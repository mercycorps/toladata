from django.core.exceptions import MultipleObjectsReturned
from indicators.models import Indicator, IndicatorType, PeriodicTarget, ReportingFrequency


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


def add_additional_periodic_targets(program):
    first_fiscal_year, last_fiscal_year = get_first_last_fiscal_year(program)
    # Assign current fiscal year as first fiscal year
    first_fiscal_year = 2022
    try:
        indicator = Indicator.objects.get(admin_type=Indicator.ADMIN_PARTICIPANT_COUNT, program__pk=program.pk)
    except MultipleObjectsReturned:
        print(f"Program '{program.name}' has more than one pc indicator.")
        return
    periodic_targets = PeriodicTarget.objects.filter(indicator=indicator)
    first_period = periodic_targets.values('period').first()['period']
    period_string = 'FY' + str(first_fiscal_year)
    # Make sure the first periodic target in db matches the current fiscal year
    if first_period == period_string:
        # Calculate how many periodic targets we need to add
        pts_to_add = (last_fiscal_year - first_fiscal_year)
        # First added pt is the following fiscal year
        fiscal_year = first_fiscal_year + 1
        make_pt_targets(indicator, fiscal_year, pts_to_add)
    else:
        print(f"Program dates for program {program.name} do not match pc indicator periodic targets.")


def recalculate_periodic_targets(current_first_fiscal_year, current_last_fiscal_year,
                                 new_first_fiscal_year, new_last_fiscal_year, indicator):
    # Get existing periodic targets for pc indicator
    periodic_targets = PeriodicTarget.objects.filter(indicator=indicator)

    # If the new end date fiscal year is larger than the current one, add periodic targets
    if new_last_fiscal_year > current_last_fiscal_year:
        pts_to_add = new_last_fiscal_year - current_last_fiscal_year
        fiscal_year_to_add = current_last_fiscal_year + 1
        make_pt_targets(indicator, fiscal_year_to_add, pts_to_add)

    # If the new end date fiscal year is smaller than the current one delete periodic targets (if they don't have new
    # target values or results)
    if new_last_fiscal_year < current_last_fiscal_year:
        pts_to_delete = current_last_fiscal_year - new_last_fiscal_year
        delete_index = 0
        target = periodic_targets[delete_index - 1].target
        result = periodic_targets[delete_index - 1].result.exists()
        for i in range(pts_to_delete):
            if target == 1 and not result:
                delete_index -= 1
                target = periodic_targets[delete_index - 1].target
                result = periodic_targets[delete_index - 1].result.exists()
            else:
                break
        pts_to_delete = periodic_targets.filter(indicator=indicator)[delete_index:]
        for pt in pts_to_delete:
            pt.delete()

    # If the new start date fiscal year is smaller than current one add periodic targets
    if new_first_fiscal_year < current_first_fiscal_year:
        pts_to_add = current_first_fiscal_year - new_first_fiscal_year
        fiscal_year_to_add = new_first_fiscal_year
        make_pt_targets(indicator, fiscal_year_to_add, pts_to_add)

    # If the new start date fiscal year is larger than current one delete periodic targets (if they don't have new
    # target values or results)
    if new_first_fiscal_year > current_first_fiscal_year:
        pts_to_delete = new_first_fiscal_year - current_first_fiscal_year
        delete_index = 0
        target = periodic_targets[delete_index].target
        result = periodic_targets[delete_index].result.exists()
        for i in range(pts_to_delete):
            if target == 1 and not result:
                delete_index += 1
                target = periodic_targets[delete_index].target
                result = periodic_targets[delete_index].result.exists()
            else:
                break
        pts_to_delete = periodic_targets.filter(indicator=indicator)[:delete_index]
        for pt in pts_to_delete:
            pt.delete()


def get_first_last_fiscal_year(program):
    # Get program start and end dates
    # Catch instances where dates do not come in through GAIT
    if program.start_date:
        program_start_date = program.start_date
        program_end_date = program.end_date
    else:
        program_start_date = program.reporting_period_start
        program_end_date = program.reporting_period_end

    # Find first applicable fiscal year
    first_fiscal_year = program_start_date.year if program_start_date.month < 7 else program_start_date.year + 1
    last_fiscal_year = program_end_date.year if program_end_date.month < 7 else program_end_date.year + 1

    return first_fiscal_year, last_fiscal_year


def make_pt_targets(indicator, fiscal_year, pts_to_add):
    for i in range(pts_to_add):
        period_string = 'FY' + str(fiscal_year)
        # Assign fiscal year integer to customsort to keep sort order in case new periodic targets have to be added
        # retroactively when program dates change
        customsort = fiscal_year
        PeriodicTarget.objects.get_or_create(
            period=period_string, target=1, customsort=customsort, indicator=indicator)
        fiscal_year += 1


