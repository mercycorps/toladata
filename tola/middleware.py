import time
from django.utils import translation

class TimingMiddleware(object):
    """
    Appends the X-PROCESSING_TIME_MS header to all responses.
    This value is the total time spent processing a user request in microseconds.
    """
    REQUEST_ATTR = '_timing_start'
    RESPONSE_HEADER = 'X-PROCESSING_TIME_MS'

    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.


    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.
        setattr(request, self.REQUEST_ATTR, time.clock())

        response = self.get_response(request)
        # Code to be executed for each request/response after
        # the view is called.
        start = getattr(request, self.REQUEST_ATTR, None)
        if start:
            length = time.clock() - start
            response[self.RESPONSE_HEADER] = "%i" % (length * 1000)

        return response


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
