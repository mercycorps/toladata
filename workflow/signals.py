from django.db.models.signals import pre_save
from django.dispatch import receiver
from workflow.models import Program
from indicators.models import Indicator, DisaggregationType
from indicators.utils import create_participant_count_indicator


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
    program = Program.objects.get(pk=instance.pk)

    # Check that the funding status is being updated, the new funding status is == to Funded
    if not program.funding_status == instance.funding_status and instance.funding_status == active_funding_status:
        # Gets the levels under program. Used to determine if the program has the results framework
        rf_levels = program.levels.count()
        # Checks if the program has the results framework
        if rf_levels > 0:
            # Check for the particpant count indicator
            pc_indicator = program.indicator_set.filter(admin_type=Indicator.ADMIN_PARTICIPANT_COUNT).count()
            if pc_indicator == 0:
                # Program does not have participant count indicator create one
                top_level = program.levels.get(parent_id__isnull=True)
                disaggregations = DisaggregationType.objects.filter(global_type=DisaggregationType.DISAG_PARTICIPANT_COUNT)
                create_participant_count_indicator(program, top_level, disaggregations)
