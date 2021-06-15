import logging
import requests
import string

from indicators.models import (
    Indicator,
    PeriodicTarget,
    Result,
    ExternalService
)
from dateutil.relativedelta import relativedelta
from django.utils import timezone

logger = logging.getLogger(__name__)


def import_indicator(service=1):
    """
    Imports an indicator from a web service (the dig only for now)
    """
    service = ExternalService.objects.get(id=service)

    try:
        response = requests.get(service.feed_url)
    except requests.exceptions.RequestException:
        logger.exception('Error reaching DIG service')
        return []

    return response.json()


def generate_periodic_target_single(tf, start_date, nthTargetPeriod, event_name='', num_existing_targets=0):
    i = nthTargetPeriod
    j = i + 1
    target_period = ''
    period_num = num_existing_targets
    if period_num == 0:
        period_num = j

    if tf == Indicator.LOP:
        return {'period': PeriodicTarget.LOP_PERIOD, 'period_name': PeriodicTarget.generate_lop_period_name()}
    elif tf == Indicator.MID_END:
        return [{'period': PeriodicTarget.MIDLINE, 'period_name': PeriodicTarget.generate_midline_period_name()},
                {'period': PeriodicTarget.ENDLINE, 'period_name': PeriodicTarget.generate_endline_period_name()}]
    elif tf == Indicator.EVENT:
        if i == 0:
            return {'period': event_name, 'period_name': PeriodicTarget.generate_event_period_name(event_name)}
        return {'period': ''}

    if tf == Indicator.ANNUAL:
        start = ((start_date + relativedelta(years=+i)).replace(day=1)).strftime('%Y-%m-%d')
        end = ((start_date + relativedelta(years=+j)) + relativedelta(days=-1)).strftime('%Y-%m-%d')
        period_label = '{period} {period_num}'.format(
            period=PeriodicTarget.ANNUAL_PERIOD, period_num=period_num
        )
        target_period = {'period': period_label, 'start_date': start, 'end_date': end,
                         'period_name': PeriodicTarget.generate_annual_quarterly_period_name(tf, period_num)}

    elif tf == Indicator.SEMI_ANNUAL:
        start = ((start_date + relativedelta(months=+(i * 6))).replace(day=1)).strftime('%Y-%m-%d')
        end = ((start_date + relativedelta(months=+(j * 6))) + relativedelta(days=-1)).strftime('%Y-%m-%d')
        period_label = '{period} {period_num}'.format(
            period=PeriodicTarget.SEMI_ANNUAL_PERIOD, period_num=period_num
        )
        target_period = {'period': period_label, 'start_date': start, 'end_date': end,
                         'period_name': PeriodicTarget.generate_annual_quarterly_period_name(tf, period_num)}

    elif tf == Indicator.TRI_ANNUAL:
        start = ((start_date + relativedelta(months=+(i * 4))).replace(day=1)).strftime('%Y-%m-%d')
        end = ((start_date + relativedelta(months=+(j * 4))) + relativedelta(days=-1)).strftime('%Y-%m-%d')
        period_label = '{period} {period_num}'.format(
            period=PeriodicTarget.TRI_ANNUAL_PERIOD, period_num=period_num
        )
        target_period = {'period': period_label, 'start_date': start, 'end_date': end,
                         'period_name': PeriodicTarget.generate_annual_quarterly_period_name(tf, period_num)}

    elif tf == Indicator.QUARTERLY:
        start = ((start_date + relativedelta(months=+(i * 3))).replace(day=1)).strftime('%Y-%m-%d')
        end = ((start_date + relativedelta(months=+(j * 3))) + relativedelta(days=-1)).strftime('%Y-%m-%d')
        period_label = '{period} {period_num}'.format(
            period=PeriodicTarget.QUARTERLY_PERIOD, period_num=period_num
        )
        target_period = {'period': period_label, 'start_date': start, 'end_date': end,
                         'period_name': PeriodicTarget.generate_annual_quarterly_period_name(tf, period_num)}

    elif tf == Indicator.MONTHLY:
        target_period_start_date = start_date + relativedelta(months=+i)
        name = PeriodicTarget.generate_monthly_period_name(target_period_start_date)

        start = ((start_date + relativedelta(months=+i)).replace(day=1)).strftime('%Y-%m-%d')
        end = ((start_date + relativedelta(months=+j)) + relativedelta(days=-1)).strftime('%Y-%m-%d')
        target_period = {'period': name, 'start_date': start, 'end_date': end, 'period_name': name}

    return target_period


def generate_periodic_targets(tf, start_date, numTargets, event_name='', num_existing_targets=0):
    gentargets = []

    if tf == Indicator.LOP or tf == Indicator.MID_END:
        target_period = generate_periodic_target_single(tf, start_date, numTargets)
        return target_period

    for i in range(numTargets):
        num_existing_targets += 1
        target_period = generate_periodic_target_single(tf, start_date, i, event_name, num_existing_targets)

        gentargets.append(target_period)
    return gentargets



def dictfetchall(cursor):
    "Return all rows from a cursor as a dict"
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]


def indicator_letter_generator(start_letter=1):
    """
    Generates letters for indicator numbering.  A start_letter value of 1 corresponds to the letter a.
    When z is reached the next "letter" generated will be aa.
    """
    current_index = start_letter - 1

    while True:
        if current_index < 26:
            yield string.ascii_lowercase[current_index]
        else:
            yield string.ascii_lowercase[current_index // 26 - 1] + \
                       string.ascii_lowercase[current_index % 26]
        current_index += 1
