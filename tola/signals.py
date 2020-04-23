import logging
from importlib import import_module
from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.dispatch import receiver
from django.conf import settings

SessionStore = import_module(settings.SESSION_ENGINE).SessionStore

logger = logging.getLogger(__name__)

@receiver(user_logged_in, dispatch_uid="global_user_login_signal")
def sig_user_logged_in(sender, user, request, **kwargs):
    logger.info("user logged in: %s at %s", user, request.META.get('REMOTE_ADDR', "No address in request"))
    # set covid banner on user session (dismissable by closing)
    request.session['show_covid_banner'] = True

@receiver(user_logged_out, dispatch_uid="global_user_logout_signal")
def sig_user_logged_out(sender, user, request, **kwargs):
    logger.info("user logged out: %s at %s", user, request.META.get('REMOTE_ADDR', "No address in request"))
    # remove any session variables set that should be reinstated on login
    if 'show_covid_banner' in request.session:
        del request.session['show_covid_banner']