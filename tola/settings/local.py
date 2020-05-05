"""Development settings and globals."""
import os
import yaml

from tola.settings.base import *

def read_yaml(yaml_path):
    with open(yaml_path) as f:
        data = yaml.load(f, Loader=yaml.FullLoader)
    return data

SETTINGS_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_DIR = os.path.abspath(os.path.join(SETTINGS_DIR, os.pardir, os.pardir, 'config'))
app_settings = read_yaml(os.path.join(CONFIG_DIR, 'settings.secret.yml'))

# MANAGER CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#admins
ADMINS = app_settings['ADMINS']
# See: https://docs.djangoproject.com/en/dev/ref/settings/#managers
MANAGERS = app_settings['ADMINS']

# ALLOWED HOSTS
# Hosts/domain names that are valid for this site; required if DEBUG is False
# See https://docs.djangoproject.com/en/1.5/ref/settings/#allowed-hosts
ALLOWED_HOSTS = app_settings['ALLOWED_HOSTS']

# CACHE CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#caches
CACHES = app_settings['CACHES']

# DATABASE CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#databases
DATABASES = app_settings['DATABASES']

# DEBUG CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#debug
DEBUG = app_settings['DEBUG']
# See: https://docs.djangoproject.com/en/dev/ref/settings/#template-debug

TEMPLATES[0]['OPTIONS']['debug'] = app_settings['TEMPLATE_DEBUG']

# EMAIL CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#email-backend
EMAIL_USE_TLS = app_settings['EMAIL_USE_TLS']
EMAIL_HOST = app_settings['EMAIL_HOST']
EMAIL_PORT = app_settings['EMAIL_PORT']
EMAIL_HOST_USER = app_settings['EMAIL_HOST_USER']
EMAIL_HOST_PASSWORD = app_settings['EMAIL_HOST_PASSWORD']
DEFAULT_FROM_EMAIL = app_settings['DEFAULT_FROM_EMAIL']
SERVER_EMAIL = app_settings['SERVER_EMAIL']
EMAIL_BACKEND = app_settings['EMAIL_BACKEND']
EMAIL_FILE_PATH = app_settings['EMAIL_FILE_PATH']

# GOOGLE CLIENT CONFIG
# GOOGLE_CLIENT_ID = app_settings['GOOGLE_CLIENT_ID']
# GOOGLE_CLIENT_SECRET = app_settings['GOOGLE_CLIENT_SECRET']
# GOOGLE_STEP2_URI = app_settings['GOOGLE_STEP2_URI']

# SOCIAL GOOGLE AUTH
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = app_settings['SOCIAL_AUTH_GOOGLE_OAUTH2_KEY']
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = app_settings['SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET']
# whitelisted domains no longer whitelisted because mercycorps.org should be okta, and we are allowing non-
#  mercycorps domains to access as partners using google
# SOCIAL_AUTH_GOOGLE_OAUTH2_WHITELISTED_DOMAINS = app_settings['SOCIAL_AUTH_GOOGLE_OAUTH2_WHITELISTED_DOMAINS']
# domains listed here will fail auth IF settings.DEBUG is off (mercycorps users should use Okta on production)
SOCIAL_AUTH_GOOGLE_OAUTH2_OKTA_DOMAINS = ["mercycorps.org"]


# LOCAL APPS DEPENDING ON SERVER DEBUG FOR DEV BOXES, silk or other profiling for local builds, etc.
DEV_APPS = app_settings.get('DEV_APPS', None)

if DEV_APPS is not None:
    INSTALLED_APPS = INSTALLED_APPS + tuple(DEV_APPS)

# LOCAL MIDDLEWARE (loaded top of middleware stack) DEPENDING ON SERVER i.e. silk profiling for local builds:
DEV_MIDDLEWARE_BEFORE = app_settings.get('DEV_MIDDLEWARE_BEFORE', None)

if DEV_MIDDLEWARE_BEFORE is not None:
    MIDDLEWARE = tuple(DEV_MIDDLEWARE_BEFORE) + MIDDLEWARE

# LOCAL MIDDLEWARE (loaded bottom of middleware stack) DEPENDING ON SERVER i.e. silk profiling for local builds:
DEV_MIDDLEWARE_AFTER = app_settings.get('DEV_MIDDLEWARE_AFTER', None)

if DEV_MIDDLEWARE_AFTER is not None:
    MIDDLEWARE = MIDDLEWARE + tuple(DEV_MIDDLEWARE_AFTER)

SILK_ENABLED = app_settings.get('SILK_ENABLED', False)
SILKY_PYTHON_PROFILER = app_settings.get('SILK_PYTHON_PROFILER', False)
SILKY_PYTHON_PROFILER_BINARY = app_settings.get('SILK_PYTHON_PROFILER_BINARY', False)



AUTHENTICATION_BACKENDS = app_settings['AUTHENTICATION_BACKENDS']

# If report server then limit navigation and allow access to public dashboards
REPORT_SERVER = app_settings['REPORT_SERVER']
OFFLINE_MODE = app_settings['OFFLINE_MODE']
NON_LDAP = app_settings['NON_LDAP']

########## EMAIL SETTINGS
EMAIL_USE_TLS = app_settings.get('EMAIL_USE_TLS', True)
EMAIL_HOST = app_settings.get('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = app_settings.get('EMAIL_PORT', 587)
EMAIL_HOST_USER = app_settings['EMAIL_HOST_USER']
EMAIL_HOST_PASSWORD = app_settings['EMAIL_HOST_PASSWORD']
DEFAULT_FROM_EMAIL = app_settings.get('DEFAULT_FROM_EMAIL', 'systems@mercycorps.org')
SERVER_EMAIL = app_settings['SERVER_EMAIL']
EMAIL_BACKEND = app_settings.get('EMAIL_BACKEND', 'django.core.mail.backends.smtp.EmailBackend')


CORS_ORIGIN_ALLOW_ALL = True
CORS_ORIGIN_WHITELIST = (
    'http://127.0.0.1:8000',
    'http://localhost:8000',
)

GOOGLE_ANALYTICS_PROPERTY_ID = app_settings.get('GOOGLE_ANALYTICS_PROPERTY_ID', None)
GOOGLE_ANALYTICS_DOMAIN = app_settings.get('GOOGLE_ANALYTICS_DOMAIN', None)

SECRET_KEY = app_settings['SECRET_KEY']

LOGGING['handlers']['file']['filename'] = app_settings['LOGFILE']
LOGGING['handlers']['login_file']['filename'] = os.path.join(os.path.dirname(app_settings['LOGFILE']), 'login.log')

# use webpack dev server
WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': app_settings.get('WEBPACK_BUNDLE_DIR_NAME', 'dist/'),
        'STATS_FILE': os.path.join(SITE_ROOT, app_settings.get('WEBPACK_STATS_FILE', 'webpack-stats-local.json')),
        }
    }

PROGRAM_API_BASE_URL = app_settings['PROGRAM_API_BASE_URL']
PROGRAM_API_TOKEN = app_settings['PROGRAM_API_TOKEN']

SOCIAL_AUTH_SAML_SP_ENTITY_ID = app_settings['SOCIAL_AUTH_SAML_SP_ENTITY_ID']
SOCIAL_AUTH_SAML_SP_PUBLIC_CERT = app_settings['SOCIAL_AUTH_SAML_SP_PUBLIC_CERT']
SOCIAL_AUTH_SAML_SP_PRIVATE_KEY = app_settings['SOCIAL_AUTH_SAML_SP_PRIVATE_KEY']
SOCIAL_AUTH_SAML_ORG_INFO = app_settings['SOCIAL_AUTH_SAML_ORG_INFO']
SOCIAL_AUTH_SAML_TECHNICAL_CONTACT = app_settings['SOCIAL_AUTH_SAML_TECHNICAL_CONTACT']
SOCIAL_AUTH_SAML_SUPPORT_CONTACT = app_settings['SOCIAL_AUTH_SAML_SUPPORT_CONTACT']
SOCIAL_AUTH_SAML_ENABLED_IDPS = app_settings['SOCIAL_AUTH_SAML_ENABLED_IDPS']
