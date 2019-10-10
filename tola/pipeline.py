"""Social auth pipeline functions for Social Auth"""
import logging
from django.conf import settings
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from django.db import transaction
from django.contrib.auth.models import User
from social_core.pipeline.social_auth import associate_by_email, social_user, associate_user
from workflow.models import TolaUser, Organization, Country

logger = logging.getLogger('django')
login_logger = logging.getLogger('login')

def domains_allowed(backend, details, response, *args, **kwargs):
    if 'email' in details and details['email'] and len(details['email'].split('@')) > 1 and \
            backend.name == 'google-oauth2':
        domain = details['email'].split('@')[-1]
        if not settings.DEBUG and domain in settings.SOCIAL_AUTH_GOOGLE_OAUTH2_OKTA_DOMAINS:
            # redirects user to okta login if they are in OKTA domains
            return HttpResponseRedirect('/login/saml/?idp=okta')

def create_user_okta(backend, details, user, response, *args, **kwargs):
    login_logger.info(
        'creating user for backend %s and idp %s with user attributes: %s',
        backend.name,
        response.get('idp_name', 'No idp_name in response'),
        str(list(response.get('attributes', [])))
        )
    if backend.name == 'saml' and response.get('idp_name') == 'okta':
        #annoyingly the attributes are coming back as arrays, so let's flatten them
        attributes = {k: v[0] if len(v) > 0 else None for k,v in response['attributes'].iteritems()}
        savepoint = transaction.savepoint()

        email = attributes['email']
        first_name = attributes['firstName']
        last_name = attributes['lastName']
        try:
            country = Country.objects.get(code=attributes["mcCountryCode"])
        except Country.DoesNotExist:
            country = None
            logger.error("In trying to log in {}, could not retrieve Country object for {}.".format(
                attributes['email'], attributes.get("mcCountryCode")
            ))

        user_count = User.objects.filter(email=email).count()
        if user_count > 1:
            logger.error("Found too many users for {}".format(email))
            return HttpResponseRedirect(reverse("invalid_user_okta"))
        elif user_count == 1:
            user = User.objects.get(email=email)
        else:
            try:
                user = User(username=email, email=email)
                user.save()
            except Exception as e:
                logger.error("Exception while saving the Auth.User {}".format(email), e)
                return HttpResponseRedirect(reverse("invalid_user_okta"))

        if hasattr(user, 'tola_user'):
            tola_user = user.tola_user
        else:
            try:
                tola_user = TolaUser(user=user, organization=Organization.mercy_corps())
                tola_user.save()
            except Exception as e:
                transaction.savepoint_rollback(savepoint)
                logger.error("Exception while saving the TolaUser {}".format(email), e)
                return HttpResponseRedirect(reverse("invalid_user_okta"))

        # If any of these fail, the transaction should roll back the whole thing

        try:
            user.first_name = first_name[:30]
            user.last_name = last_name[:30]
            user.save()
        except Exception as e:
            if not user.first_name and not user.last_name:
                transaction.savepoint_rollback(savepoint)
                logger.error("Exception while saving the Auth.User first or last name of {}".format(email), e)
                return HttpResponseRedirect(reverse("invalid_user_okta"))
            else:
                # It's ok if we can't get name info if there's already something in the database.
                pass
        try:
            tola_user.country = country
            tola_user.save()
        except Exception as e:
            transaction.savepoint_rollback(savepoint)
            logger.error("Exception while saving the TolaUser country of {}".format(email), e)
            return HttpResponseRedirect(reverse("invalid_user_okta"))

        return None
    else:
        return None


def associate_email_or_redirect(backend, details, user=None, *args, **kwargs):
    """extension of the associate_email step in the pipeline to add redirect if user not found"""
    if user:
        return None
    else:
        associated_user = associate_by_email(backend, details, user, *args, **kwargs)
        login_logger.info(
            "associate by email for details %s for user %s returned %s",
            details, user, associated_user
        )
        if associated_user is not None:
            return associated_user
        else:
            login_logger.info(
                'backend %s failed to find user %s with details %s',
                backend.name, user, details
            )
            return HttpResponseRedirect(reverse("invalid_user"))


def social_user_tola(backend, uid, user=None, *args, **kwargs):
    """extension of the social user lookup in the pipeline to clear bad associations"""
    # try to get user from social auth storage:
    provider = backend.name
    if provider == 'google-oauth2':
        social = backend.strategy.storage.user.get_social_auth(provider, uid)
        if social and social.user.email.lower() != uid.lower():
            # we found a match, but the emails are different, delete the bad data:
            social.delete()
            user = None
    login_logger.info(
        'calling social user for provider %s for uid %s and user %s',
        provider, uid, user
    )
    # call the original social_user now that we know bad data has been expunged:
    social = social_user(backend, uid, user, *args, **kwargs)
    login_logger.info(
        'social_user returned %s',
        str(list(social.items()))
    )
    return social


def associate_user_tola(backend, uid, user=None, social=None, *args, **kwargs):
    """extension of the user-association step of the pipeline to avoid associating to previously logged-in users"""
    if backend.name == 'google-oauth2' and user and user.email and user.email.lower() != uid.lower():
        # if we have a user logged in (sessioning!) and they don't match the uid entered
        # zero out the user so we don't associate badly a user with a bad social auth:
        user = None
    return associate_user(backend, uid, user, social, *args, **kwargs)
