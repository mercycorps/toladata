import logging
from importlib import import_module
from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.conf import settings
from django.core.mail import send_mail

from indicators.models import ReportingFrequency, DataCollectionFrequency, IndicatorType
from workflow.models import Sector

SessionStore = import_module(settings.SESSION_ENGINE).SessionStore

logger = logging.getLogger(__name__)


@receiver(user_logged_in, dispatch_uid="global_user_login_signal")
def sig_user_logged_in(sender, user, request, **kwargs):
    logger.info("user logged in: %s at %s", user, request.META.get('REMOTE_ADDR', "No address in request"))
    # set covid banner on user session (dismissable by closing)
    request.session['show_covid_banner'] = True
    request.session['show_import_banner'] = True


@receiver(user_logged_out, dispatch_uid="global_user_logout_signal")
def sig_user_logged_out(sender, user, request, **kwargs):
    logger.info("user logged out: %s at %s", user, request.META.get('REMOTE_ADDR', "No address in request"))
    # remove any session variables set that should be reinstated on login
    if 'show_covid_banner' in request.session:
        del request.session['show_covid_banner']
    if 'show_import_banner' in request.session:
        del request.session['show_import_banner']


# Send a message any time a model with database values that are being translated is saved.  If the model is
# created, or the translated field is updated, a manual process will need to be run to translate the new values.
@receiver(post_save, sender=IndicatorType)
@receiver(post_save, sender=ReportingFrequency)
@receiver(post_save, sender=DataCollectionFrequency)
@receiver(post_save, sender=Sector)
def translated_database_items_updated(sender, instance, created, *args, **kwargs):
    model_name = type(instance).__name__
    update_text = 'created' if created else 'updated'
    message = (f'The "{str(instance)}" instance of the {model_name} model was {update_text}.  This model is translated for users and '
                'may require running the makemessagesdb command and following up with a new translation.')
    send_mail(
        f'An instance of {model_name} was updated and may require translation',
        message,
        settings.DEFAULT_FROM_EMAIL,
        settings.ADMINS,
        fail_silently=False,
    )
