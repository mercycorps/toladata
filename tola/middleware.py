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

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if (not request.is_ajax() and 'application/json' not in request.META['HTTP_ACCEPT']):
            return response
        if not settings.DEBUG:
            return response
        if not request.session.get('fail_mode', False):
            return response
        if request.path == '/fail_mode_toggle':
            return response
        return HttpResponseServerError("Fail Mode Activated")
