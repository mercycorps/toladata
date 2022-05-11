import logging
from datetime import datetime, date
from django.conf import settings
from django.core.exceptions import MultipleObjectsReturned
from indicators.models import Indicator, IndicatorType, PeriodicTarget, ReportingFrequency


logger = logging.getLogger('__name__')

def create_participant_count_indicator(program, top_level, disaggregations_qs):
    definition_text = (
        "** Add Direct Participants definition **\n\n"
        "** Add Indirect Participants definition **\n\n"
        "** Add methodology for double counting **\n\n"
        "Participants are defined as “all people who have received tangible benefit – directly "
        "or indirectly from the project.” We distinguish between direct and indirect:\n\n"
        "Direct participants – are those who have received a tangible benefit from the program, "
        "either as the actual program participants or the intended recipients of the program benefits. "
        "This means individuals or communities.\n\n"
        "Indirect participants – are those who received a tangible benefit through their proximity to "
        "or contact with program participants or activities."
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
    indicator.target_frequency = Indicator.EVENT
    indicator.is_cumulative = Indicator.NON_SUMMING_CUMULATIVE
    indicator.lop_target = 1
    indicator.save()
    create_periodic_target_range(program, indicator)
    indicator.disaggregation.add(*list(disaggregations_qs))
    indicator.reporting_frequencies.add(ReportingFrequency.objects.get(frequency='Annual'))
    return indicator


def create_periodic_target_range(program, indicator):
    # Get first and last fiscal year in program duration
    first_fiscal_year, last_fiscal_year = get_first_last_fiscal_year(program)
    # Calculate how many periodic targets we need to add
    pts_to_add = (last_fiscal_year - first_fiscal_year) + 1
    # Get the first fiscal year to add
    fiscal_year = first_fiscal_year
    # Add periodic targets
    make_pt_targets(indicator, fiscal_year, pts_to_add)


# This just need to be run once in FY2022, thereafter all periodic targets for a programming period will be
# created automatically.
def add_additional_periodic_targets(program):
    first_fiscal_year, last_fiscal_year = get_first_last_fiscal_year(program)
    first_fiscal_year = current_fiscal_year()
    try:
        indicator = Indicator.objects.get(admin_type=Indicator.ADMIN_PARTICIPANT_COUNT, program__pk=program.pk)
    except MultipleObjectsReturned:
        print(f"Program '{program.name}' has more than one pc indicator.")
        return
    periodic_targets = PeriodicTarget.objects.filter(indicator=indicator)
    first_period = periodic_targets.values('customsort').first()['customsort']
    # Make sure the first periodic target in db matches the current fiscal year
    if first_period == first_fiscal_year:
        # Calculate how many periodic targets we need to add
        pts_to_add = (last_fiscal_year - first_fiscal_year)
        # First added pt should be the next fiscal year (2023)
        fiscal_year = first_fiscal_year + 1
        make_pt_targets(indicator, fiscal_year, pts_to_add)
    else:
        print(f"Program dates for program {program.name} do not match pc indicator periodic targets.")


def recalculate_periodic_targets(current_first_fiscal_year, current_last_fiscal_year,
                                 new_first_fiscal_year, new_last_fiscal_year, indicator):
    # Get existing periodic targets for pc indicator
    periodic_targets = PeriodicTarget.objects.filter(indicator=indicator)
    # Get current fiscal year
    current_fy_year = current_fiscal_year()

    # If the new end date fiscal year is larger than the current one, add periodic targets
    if new_last_fiscal_year > current_last_fiscal_year:
        reversed_pts = periodic_targets.reverse()
        try:
            # Start creating new targets after the last periodic target
            current_last_pt = reversed_pts[0].customsort
        except IndexError:
            # There are no periodic targets, create them for the entire program period
            # The first periodic target cannot be smaller than the current fiscal year
            current_last_pt = max(new_first_fiscal_year, current_fy_year) - 1
        pts_to_add = new_last_fiscal_year - current_last_pt
        if pts_to_add > 0:
            fiscal_year_to_add = current_last_pt + 1
            make_pt_targets(indicator, fiscal_year_to_add, pts_to_add)

    # If the new end date fiscal year is smaller than the current one, delete periodic targets (if they don't have new
    # target values or results)
    if new_last_fiscal_year < current_last_fiscal_year:
        reversed_pts = periodic_targets.reverse()
        try:
            current_last_pt = reversed_pts[0].customsort
        except IndexError:
            # There are no periodic targets, do nothing.
            return
        pts_to_delete = current_last_pt - new_last_fiscal_year
        if pts_to_delete > 0:
            delete_pts = reversed_pts[:pts_to_delete]
            for pt in delete_pts:
                if pt.target == 1 and not pt.result_set.all().exists():
                    pt.delete()
                else:
                    break

    # If the new start date fiscal year is smaller than current one, add periodic targets
    if new_first_fiscal_year < current_first_fiscal_year:
        # The first new periodic target cannot be smaller than the current fiscal year
        new_first_fiscal_year = max(new_first_fiscal_year, current_fy_year)
        try:
            first_pts = periodic_targets[0].customsort
        except IndexError:
            # There are no periodic targets, create them for the entire program period
            # The first periodic target cannot be smaller than the current fiscal year
            first_pts = new_last_fiscal_year
        pts_to_add = first_pts - new_first_fiscal_year
        if pts_to_add > 0:
            fiscal_year_to_add = new_first_fiscal_year
            make_pt_targets(indicator, fiscal_year_to_add, pts_to_add)

    # If the new start date fiscal year is larger than current one delete periodic targets (if they don't have new
    # target values or results)
    if new_first_fiscal_year > current_first_fiscal_year:
        try:
            fiscal_year_to_delete = periodic_targets[0].customsort
        except IndexError:
            # There are no periodic targets, do nothing.
            return
        pts_to_delete = new_first_fiscal_year - fiscal_year_to_delete
        if pts_to_delete > 0:
            delete_pts = periodic_targets[:pts_to_delete]
            for pt in delete_pts:
                if pt.target == 1 and not pt.result_set.all().exists():
                    pt.delete()
                else:
                    break


def get_first_last_fiscal_year(program):
    # Get program start and end dates
    # Catch instances where dates do not come in through GAIT
    current_fy_year = current_fiscal_year()
    program_start_date = program.start_date if program.start_date else program.reporting_period_start
    program_end_date = program.end_date if program.end_date else program.reporting_period_end
    if program_start_date and program_end_date:
        # Find first applicable fiscal year
        first_fiscal_year = max((program_start_date.year if program_start_date.month < 7 else program_start_date.year + 1), current_fy_year)
        last_fiscal_year = program_end_date.year if program_end_date.month < 7 else program_end_date.year + 1
    else:
        # For test programs that have been created without dates
        first_fiscal_year = last_fiscal_year = current_fiscal_year()
    return first_fiscal_year, last_fiscal_year


def make_pt_targets(indicator, fiscal_year, pts_to_add):
    for i in range(pts_to_add):
        period_string = 'FY' + str(fiscal_year)
        # Assign fiscal year integer to customsort to keep sort order in case new periodic targets have to be added
        # retroactively when program dates change
        customsort = fiscal_year
        PeriodicTarget.objects.get_or_create(
            period=period_string, target=1, customsort=customsort, indicator=indicator)
        indicator.lop_target = 1
        indicator.save()
        fiscal_year += 1


def current_fiscal_year():
    today = datetime.utcnow().date()
    current_fy_year = today.year if today.month < 7 else today.year + 1
    return current_fy_year


