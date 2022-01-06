
import datetime
from django.conf import settings
from indicators.models import Indicator, IndicatorType, PeriodicTarget, DisaggregationType, ReportingFrequency


def create_participant_count_indicator(program, top_level, disaggregations):
    definition_text = (
        "Participants are defined as “all people who have received tangible benefit – directly "
        "or indirectly from the project.” We distinguish between direct and indirect:\n\n"
        "Direct participants – are those who have received a tangible benefit from the program, "
        "either as the actual program participants or the intended recipients of the program benefits. "
        "This means individuals or communities.\n\n"
        "Indirect participants – are those who received a tangible benefit through their proximity to "
        "or contact with program participants or activities.\n\n"
        "** Add Direct Participants definition **\n\n"
        "** Add Indirect Participants definition **"
    )
    indicator_justification = (
        "Participant reach is crucial to take decisions on the program implementation. It provides insights "
        "into the intended and unintended targeted individuals and provides insights into the scale of the "
        "program.\n\n"
        "This aggregate participant number is used all over the agency in our boilerplate, capacity "
        "statements, proposals to institutional donors, and a handful of other reports.")
    information_use = (
        "Program Manager/Director - intended and uninteded reach (targeting), including imbalances across "
        "groups; direct/indirect ratio; consistency between reach and outcome of the program; historical "
        "change.\n\n"
        "Country/Regional Director - meeting strategic objectives.\n\n"
        "HQ - reporting\n\n")

    all_defaults = {
        'program': program,
        'name': Indicator.PARTICIPANT_COUNT_INDICATOR_NAME,
        'level': top_level,
        'source': 'Mercy Corps',
        'definition': definition_text,
        'justification': indicator_justification,
        'unit_of_measure': 'Participant',
        'rationale_for_target': 'The target is based on the intended reach of the program',
        'baseline': 0,
        'direction_of_change': 2,
        'data_points': '# of people reached',
        'information_use': information_use,
        'admin_type': Indicator.ADMIN_PARTICIPANT_COUNT,
    }

    indicator = Indicator.objects.create(**all_defaults)
    indicator.indicator_type.add(IndicatorType.objects.get(indicator_type="Custom"))
    indicator.target_frequency = 8
    indicator.lop_target = 1
    indicator.save()
    period_string = 'FY' + str(datetime.date.fromisoformat(settings.REPORTING_YEAR_START_DATE).year + 1)
    PeriodicTarget.objects.get_or_create(
        period=period_string, target=1, customsort=1, indicator=indicator)
    indicator.disaggregation.add(*list(disaggregations))
    indicator.reporting_frequencies.add(ReportingFrequency.objects.get(frequency='Annual'))
    return indicator
