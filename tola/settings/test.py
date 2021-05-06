from tola.settings.base import *
import sys
from os import path

TESTING = len(sys.argv) > 1 and sys.argv[1] == 'test'

if TESTING:
    print('===================================')
    print('In TEST Mode - Disabling Migrations')
    print('===================================')

    class DisableMigrations(object):

        def __contains__(self, item):
            return True

        def __getitem__(self, item):
            return None

    MIGRATION_MODULES = DisableMigrations()

PASSWORD_HASHERS = (
    'django.contrib.auth.hashers.MD5PasswordHasher',
)

########## IN-MEMORY TEST DATABASE
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "tola",
        "OPTIONS": {
            'charset': 'utf8mb4',
        },
        "HOST": "127.0.0.1",
        "USER": "root",
        "PORT": "3306",
    },
}

ADMINS = (
    ('test', 'test@test.com'),
)

MANAGERS = ADMINS

DEBUG = False

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'test@example.com'
EMAIL_HOST_PASSWORD = ''
DEFAULT_FROM_EMAIL = 'test@example.com'
SERVER_EMAIL = "test@example.com"
# Django's test runner automatically uses locmem for testing, which seems like a good option.
# Use an EMAIL_BACKEND setting like the one below in the test_local.py file if you want something different
# EMAIL_BACKEND = 'django.core.mail.backends.filebased.EmailBackend'

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}

try:
    from tola.settings.test_local import *
except ImportError:
    pass
