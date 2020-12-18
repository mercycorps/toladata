"""Utilities used throughout for internationalization

"""

import unicodedata
from django.utils import formats
import six
import decimal

def _date_format(date, date_format, decode=False):
    formatted = formats.date_format(
        date,
        date_format,
        use_l10n=True
    )
    if decode:
        return formatted
    return formatted.encode('UTF-8')


def l10n_date_iso(date, decode=False):
    return _date_format(date, 'DATE_FORMAT', decode=decode)


def l10n_date_short(date, decode=False):
    return _date_format(date, 'SHORT_DATE_FORMAT', decode=decode)


def l10n_date_medium(date, decode=False):
    return _date_format(date, 'MEDIUM_DATE_FORMAT', decode=decode)


def l10n_date_long(date, decode=False):
    return _date_format(date, 'LONG_DATE_FORMAT', decode=decode)


def l10n_date_year_month(date, decode=False):
    return _date_format(date, 'YEAR_MONTH_FORMAT', decode=decode)

def l10n_monthname(date, decode=False):
    return _date_format(date, 'N', decode=decode)

def l10n_number(value):
    if isinstance(value, (decimal.Decimal, float) + six.integer_types):
        return formats.number_format(value, use_l10n=True)
    else:
        suffix = ''
        try:
            value = str(value).rstrip()
            if len(value) > 1 and value[-1] == '%':
                suffix = '%'
                value = value[:-1]
            if value.isdigit():
                value = int(value)
            elif value.replace('.', '', 1).isdigit():
                value = float(value)
            else:
                return str(value) + suffix
            return formats.number_format(value, use_l10n=True) + suffix
        except ValueError:
            return value
    return value

def str_without_diacritics(s):
    """Key function for sorting strings that may contain accent characters, sorting as though there were no accents"""
    return ''.join(
        # normalize to form NFKD: all diacritics broken into combining character (i.e. "é" -> ´ and e)
        # all identical characters replaced with simplest equivalents (i.e. Roman Numeral I and capital I)
        c for c in unicodedata.normalize('NFKD', str(s))
        # combining returns true for a combining diacritic such as ´ or ¨
        if not unicodedata.combining(c)
    )
