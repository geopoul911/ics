from pathlib import Path
import os

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'f2h*8c#j3m@!q!z4&jv@1g4rb5o5-8ox-^d%o6=gi+e8&d=ofp'


# colors = green : #93ab3c
# black / white


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ['*']

# Applications
INSTALLED_APPS = [
    'rest_framework',
    'rest_framework.authtoken',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'accounts',
    'webapp',
    'axes',
]

# To activate a middleware component, add it to the MIDDLEWARE list.
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    # AxesMiddleware should be the last middleware in the MIDDLEWARE list.
    # It only formats user lockout messages and renders Axes lockout responses
    # on failed user authentication attempts from login views.
    # If you do not want Axes to override the authentication response
    # you can skip installing the middleware and use your own views.
    'axes.middleware.AxesMiddleware',
]

# A string representing the full Python import path to your root URLconf, for example "mydjangoapps.urls".
ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


"""
Django's primary deployment platform is WSGI, the Python standard for web servers and applications.
Django's startproject management command sets up a minimal default WSGI configuration for you,
which you can tweak as needed for your project, and direct any WSGI-compliant application server to use.
"""
WSGI_APPLICATION = 'core.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'ics',
        'USER': 'postgres',
        'PASSWORD': '',
        'HOST': 'localhost',
        'PORT': '5432'
    },
}

ADMIN_ENABLED = False

# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Europe/Athens'
USE_I18N = True
USE_L10N = True
USE_TZ = False

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/

STATIC_URL = '/dj_static/'
# STATICFILES_DIRS = [os.path.join(BASE_DIR, 'web/static'), ]
# STATIC_ROOT = os.path.join(BASE_DIR, 'static')
# MEDIA_URL = 'https://groupplan.gr/dj_static/'
# MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# CORS is a mechanism to allow interaction with resources hosted on different domains.
# For instance, one of the most common scenarios to apply it is with Ajax requests.
CORS_ORIGIN_ALLOW_ALL = True

# Headers allowed on requests
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
    'user-Token',
]

# Used for pagination
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 100
}

AUTHENTICATION_BACKENDS = [
    # AxesBackend should be the first backend in the AUTHENTICATION_BACKENDS list.
    'axes.backends.AxesBackend',

    # Django ModelBackend is the default authentication backend.
    'django.contrib.auth.backends.ModelBackend',
]

# Django axes documentation : https://django-axes.readthedocs.io/en/latest/
AXES_ENABLED = True

# Blocks account based on username
AXES_ONLY_USER_FAILURES = False

# Accounts are blocked after 5th failed attempt
AXES_FAILURE_LIMIT = 5

# refer to the Django request and response objects documentation
AXES_META_PRECEDENCE_ORDER = [
    'HTTP_X_FORWARDED_FOR',
    'REMOTE_ADDR',
]

# Whitelisted IPs
# AXES_IP_WHITELIST = ['84.254.8.173', 'localhost', '127.0.0.1', 'www.groupplan.gr', 'groupplan.gr']

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# When user logs in , delete failed attempts
AXES_RESET_ON_SUCCESS = True

# If you use this approach then `CORS_ORIGIN_WHITELIST` will not have any effect
CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True

# 2 weeks, in seconds
SESSION_COOKIE_AGE = 1209600

# Django email settings.
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = 'mail.cosmoplan.gr'
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = 'g.poulakis@cosmoplan.gr'
# EMAIL_HOST_PASSWORD = '$$g.poulakis!!'
