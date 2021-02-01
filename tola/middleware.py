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
        """Attempts to bail out of fail mode as early as possible, to minimize overhead on every request.

            Ordered by likelihood:
                - not a superuser
                - fail mode isn't on
                - not on qa or local (placed third because of the get_host() overhead)
                - not an ajax / json request
                - not trying to get to the fail mode toggle to turn it off
        """
        response = self.get_response(request)
        # fail mode only applies to superusers, so if there isn't a user or they are not a superuser, bail:
        if not request.user or not request.user.is_superuser:
            return response
        # if they haven't activated fail mode, don't fail:
        if not request.session.get('fail_mode', False):
            return response
        # if we aren't on qa or local, fail mode doesn't even apply:
        uri = request.get_host()
        if not any(["qa" in uri, "127." in uri, "local" in uri]):
            return response
        # fail mode isn't supposed to interrupt regular page loads, only ajax / json requests:
        if (not request.is_ajax() and
            'application/json' not in getattr(request, 'META', {}).get('HTTP_ACCEPT', [])):
            return response

        # allow requests to deactivate fail mode:
        if request.path == '/fail_mode_toggle':
            return response
        # fail the request:
        return HttpResponseServerError("Fail Mode Activated")
