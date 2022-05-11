import logging
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.db.models.signals import pre_save
from django.dispatch import receiver
from workflow.models import Program
from indicators.models import Indicator, DisaggregationType
from indicators.utils import create_participant_count_indicator, recalculate_periodic_targets

logger = logging.getLogger(__name__)

@receiver(pre_save, sender=Program)
def program_updated(sender, instance, *args, **kwargs):
    """
    Before a program is saved check that the funding_status is being updated.
    If the funding_status is updated check that the program is using the results framework.
    If using the results framework check if the program already has a participant count indicator.
    If not create a participant count indicator.
    """
    # A program is being created not updated
    if instance.pk is None:
        return

    active_funding_status = 'Funded'
    # Get the program instance that hasn't been updated yet
    try:
        program = Program.objects.get(pk=instance.pk)
    except Program.DoesNotExist:
        return

    # Gets the levels under program. Used to determine if the program has the results framework
    rf_levels = program.levels.count()
    # Checks if the program has the results framework
    if rf_levels > 0:
        # Check that the funding status is being updated, the new funding status is == to Funded
        if not program.funding_status == instance.funding_status and instance.funding_status == active_funding_status:
            # Check for the participant count indicator
            pc_indicator = program.indicator_set.filter(admin_type=Indicator.ADMIN_PARTICIPANT_COUNT).count()
            if pc_indicator == 0:
                # Program does not have participant count indicator create one
                top_level = program.levels.get(parent_id__isnull=True)
                disaggregations = DisaggregationType.objects.filter(global_type=DisaggregationType.DISAG_PARTICIPANT_COUNT)
                create_participant_count_indicator(program, top_level, disaggregations)

        # Check if the start and end dates are updated
        if not (program.start_date == instance.start_date and program.end_date == instance.end_date):
            # Find current and new fiscal years attached to this indicator and compare them with the new ones.
            # In case of discrepancy recalculate periodic targets.
            current_start_date = program.start_date if program.start_date else program.reporting_period_start
            current_end_date = program.end_date if program.end_date else program.reporting_period_end
            new_start_date = instance.start_date if instance.start_date else current_start_date
            new_end_date = instance.end_date if instance.end_date else current_end_date
            current_first_fiscal_year = current_start_date.year if current_start_date.month < 7 else current_start_date.year + 1
            current_last_fiscal_year = current_end_date.year if current_end_date.month < 7 else current_end_date.year + 1
            new_first_fiscal_year = new_start_date.year if new_start_date.month < 7 else new_start_date.year + 1
            new_last_fiscal_year = new_end_date.year if new_end_date.month < 7 else new_end_date.year + 1
            if current_first_fiscal_year != new_first_fiscal_year or current_last_fiscal_year != new_last_fiscal_year:
                # Get PC indicator
                try:
                    indicator = program.indicator_set.get(admin_type=Indicator.ADMIN_PARTICIPANT_COUNT)
                    # If one or both of the dates have changed, check if Periodic Targets for PC indicator have to be
                    # recalculated.
                    recalculate_periodic_targets(
                        current_first_fiscal_year, current_last_fiscal_year,
                        new_first_fiscal_year, new_last_fiscal_year, indicator)
                except ObjectDoesNotExist:
                    logger.error("No pc indicator found in program '{}'".format(program.name))
                except MultipleObjectsReturned:
                    logger.error("More than one pc indicator found in program '{}'".format(program.name))



