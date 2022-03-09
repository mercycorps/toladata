import logging
import requests
import string

from indicators.models import (
    Indicator,
    PeriodicTarget,
    ExternalService
)
from dateutil.relativedelta import relativedelta
from tola_management.models import ProgramAuditLog
from django.db.models import Max

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


def program_rollup_data(program, for_csv=False):
    """
    Used to populate the program rollup data for endpoints: programs_rollup_export, programs_rollup_export_csv

    Params
        program
            The program object
        for_csv
            Defaults to False. Dictates if the return value should be a list for CSV or a dict for JSON

    Returns
        dict or list if for_csv
    """
    recent_change_log = {k:v.date() for (k, v) in ProgramAuditLog.objects.filter(program=program) \
        .values_list('program').annotate(latest_date=Max('date'))}

    dict = {
            "unique_id": program.pk,
            "program_name": program.name,
            "gait_id": program.gaitid,
            "countries": " / ".join([c.country for c in program.country.all()]) if for_csv else [c.country for c in program.country.all()],
            "sectors": " / ".join(set([i.sector.sector for i in program.indicator_set.all() if i.sector and i.sector.sector])) 
            if for_csv else set([i.sector.sector for i in program.indicator_set.all() if i.sector and i.sector.sector]),
            "status": "active" if program.funding_status.lower().strip() == "funded" else "inactive",
            "funding_status": program.funding_status,
            "start_date": program.reporting_period_start.isoformat() if program.reporting_period_start else "",
            "end_date": program.reporting_period_end.isoformat() if program.reporting_period_end else "",
            "tola_creation_date": program.create_date.date().isoformat() if program.create_date else "",
            "most_recent_change_log_entry": recent_change_log.get(program.id, "None"),
            "program_period": "{}%".format(program.percent_complete) if program.percent_complete >= 0 else "",
            "indicator_count": program.metrics['indicator_count'],
            "indicators_reporting_above_target": program.scope_counts['high'],
            "indicators_reporting_on_target": program.scope_counts['on_scope'],
            "indicators_reporting_below_target": program.scope_counts['low'],
            "indicators_with_targets": program.metrics['targets_defined'],
            "indicators_with_results": program.metrics['reported_results'],
            "results_count": program.metrics['results_count'],
            "results_with_evidence": program.metrics['results_evidence']
        }

    if for_csv:
        return list(dict.values())

    return dict
