import time
from django.utils import translation
from django.conf import settings
from django.http import HttpResponseServerError


class UserLanguageMiddleware(object):

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_view(self, request, callback, callback_args, callback_kwargs):
        user = getattr(request, 'user', None)

        if user.is_authenticated:
            tola_user = getattr(user, 'tola_user', None)
            user_language = getattr(tola_user, 'language', None)
            # bypass django language pref discovery
            # (see https://docs.djangoproject.com/en/1.11/topics/i18n/translation/#how-django-discovers-language-preference)
            # current_language = translation.get_language()
            current_language = user_language
            translation.activate(user_language)
            request.session[translation.LANGUAGE_SESSION_KEY] = user_language
        else:
            request.session[translation.LANGUAGE_SESSION_KEY] = 'en'


class FailModeMiddleware(object):
    """On QA / localhost, this middleware will fail all ajax/json requests if the session key "fail_mode" is set"""

    def __init__(self, get_response):
        """Initial configuration"""
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        # fail mode only applies on local and QA, where DEBUG=true, if debug isn't true (prod failsafe) bail:
        if not settings.DEBUG:
            return response
        # fail mode only applies to superusers, so if there isn't a user or they are not a superuser, bail:
        if not request.user or not request.user.is_superuser:
            return response
        # fail mode isn't supposed to interrupt regular page loads, only ajax / json requests:
        if (not request.is_ajax() and
            'application/json' not in getattr(getattr(request, 'META', {}), 'HTTP_ACCEPT', [])):
            return response
        # if they haven't activated fail mode, don't fail:
        if not request.session.get('fail_mode', False):
            return response
        # allow requests to deactivate fail mode:
        if request.path == '/fail_mode_toggle':
            return response
        # fail the request:
        return HttpResponseServerError("Fail Mode Activated")
