import unicodedata
import json
import logging
import requests
import dateutil
import datetime
from decimal import Decimal, InvalidOperation

from workflow.models import Country, TolaUser
from django.db.models import Q
from django.conf import settings
from django.contrib.auth.models import User
from django.core.mail import mail_admins, EmailMessage
from django.core.exceptions import PermissionDenied
from django.contrib.auth.decorators import user_passes_test

from django.utils.translation import ugettext as _

logger = logging.getLogger(__name__)


# CREATE NEW DATA DICTIONARY OBJECT
def siloToDict(silo):
    parsed_data = {}
    key_value = 1
    for d in silo:
        label = unicodedata.normalize('NFKD', d.field.name).encode('ascii', 'ignore')
        value = unicodedata.normalize('NFKD', d.char_store).encode('ascii', 'ignore')
        # row = unicodedata.normalize('NFKD', d.row_number).encode('ascii', 'ignore')
        parsed_data[key_value] = {label: value}

        key_value += 1

    return parsed_data


def getCountry(user):
    """
    Returns the object the view is displaying.
    """
    # get users country from django cosign module
    if user.is_authenticated:
        return Country.objects.filter(
            Q(id__in=user.tola_user.countries.all().values('id')) |
            Q(id__in=user.tola_user.programaccess_set.all().values('country__id'))
        )
        # return user.tola_user.countries.all()
    else:
        return Country.objects.none()


def emailGroup(country, group, link, subject, message, submitter=None):
    # email incident to admins in each country associated with the projects program
    for single_country in country.all():
        country = Country.objects.all().filter(country=single_country)
        getGroupEmails = User.objects.all().filter(
            tola_user=group, tola_user__country=country
        ).values_list('email', flat=True)
        email_link = link
        formatted_email = email_link
        subject = str(subject)
        message = str(message) + formatted_email

        to = [str(item) for item in getGroupEmails]
        if submitter:
            to.append(submitter)

        email = EmailMessage(subject, message, 'systems@mercycorps.org', to)

        email.send()

    mail_admins(subject, message, fail_silently=False)


def user_to_tola(backend, user, response, *args, **kwargs):

    # Add a google auth user to the tola profile
    default_country = Country.objects.first()
    userprofile, created = TolaUser.objects.get_or_create(user=user)

    userprofile.country = default_country

    userprofile.name = response.get('displayName')

    userprofile.email = response.get('emails["value"]')

    userprofile.save()
    # add user to country permissions table
    userprofile.countries.add(default_country)


def group_excluded(*group_names, **url):
    # If user is in the group passed in permission denied
    def in_groups(u):
        if u.is_authenticated:
            if not bool(u.groups.filter(name__in=group_names)):
                return True
            raise PermissionDenied
        return False
    return user_passes_test(in_groups)


def group_required(*group_names, **url):
    # Requires user membership in at least one of the groups passed in.
    def in_groups(u):
        if u.is_authenticated:
            if bool(u.groups.filter(name__in=group_names)) | u.is_superuser:
                return True
            raise PermissionDenied
        return False
    return user_passes_test(in_groups)


def formatFloat(value):
    if value is None:
        return None
    try:
        value = float(value)
    except ValueError:
        return value
    return ("%.2f" % value).rstrip('0').rstrip('.')


def get_dates_from_gait_response(gait_response):
    """take a gait response (from get_GAIT_data) and parse out start and end dates, return dict"""
    try:
        start_date = dateutil.parser.parse(gait_response['start_date']).date()
    except (ValueError, TypeError):
        start_date = None
    try:
        end_date = dateutil.parser.parse(gait_response['end_date']).date()
    except (ValueError, TypeError):
        end_date = None
    return {
        'start_date': start_date,
        'end_date': end_date
    }


def get_reporting_dates(program):
    """takes a program with start and end dates and returns default reporting_period start and end dates"""
    if program.start_date is None:
        reporting_period_start = None
    else:
        reporting_period_start = datetime.date(program.start_date.year, program.start_date.month, 1)
    if program.end_date is None:
        reporting_period_end = None
    else:
        next_month = datetime.date(program.end_date.year, program.end_date.month, 28) + datetime.timedelta(days=4)
        beginning_of_next_month = datetime.date(next_month.year, next_month.month, 1)
        reporting_period_end = beginning_of_next_month - datetime.timedelta(days=1)
    return {
        'reporting_period_start': reporting_period_start,
        'reporting_period_end': reporting_period_end
    }


# Standard library Decimal normalization can result in exponents being returned.  This returns a "normal" Decimal value.
def usefully_normalize_decimal(number):
    if type(number) != "Decimal":
        try:
            number = Decimal(number)
        except (InvalidOperation, TypeError):
            return number

    if int(number) == number:
        return Decimal(int(number))
    else:
        return number.normalize()
