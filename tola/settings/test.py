from tola.settings.base import *
import sys
from os import path
import datetime
import os
import yaml

def read_yaml(yaml_path):
    with open(yaml_path) as f:
        data = yaml.load(f, Loader=yaml.FullLoader)
    return data

SETTINGS_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_DIR = os.path.abspath(os.path.join(SETTINGS_DIR, os.pardir, os.pardir, 'config'))
app_settings = read_yaml(os.path.join(CONFIG_DIR, 'settings.secret.yml'))

MS_TENANT_ID = app_settings['MS_TENANT_ID']
MS_TOLADATA_CLIENT_ID = app_settings['MS_TOLADATA_CLIENT_ID']
MS_TOLADATA_CLIENT_SECRET = app_settings['MS_TOLADATA_CLIENT_SECRET']
MSRCOMMS_ID = app_settings['MSRCOMMS_ID']
PROGRAM_PROJECT_LIST_ID = app_settings['PROGRAM_PROJECT_LIST_ID']
GAITID_LIST_ID = app_settings['GAITID_LIST_ID']
COUNTRYCODES_LIST_ID = app_settings['COUNTRYCODES_LIST_ID']

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

today = datetime.date.today()
reporting_year = today.year if today.month > 6 else today.year - 1
REPORTING_YEAR_START_DATE = datetime.date(reporting_year, 7, 1).isoformat()
REPORTING_PERIOD_LAST_MONTH = 8


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
