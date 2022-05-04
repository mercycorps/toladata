from datetime import datetime, date
from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models import Count
from indicators.models import Indicator
from workflow.models import Program
from indicators.utils import add_additional_periodic_targets


class Command(BaseCommand):
    help = """
        Add all relevant periodic targets to participant count indicators. It will create additional periodic targets
        for participant count indicators with program dates that extent the current FY.that doesn't already have one.
        """

    def add_arguments(self, parser):
        parser.add_argument(
            '--execute', action='store_true', help='Without this flag, the command will only be a dry run')
        parser.add_argument(
            '--change_customsort_to_fy', action='store_true', help='Changes customsort value of periodic targets to match the fiscal year')
        parser.add_argument(
            '--suppress_output', action='store_true',
            help="Supresses the output so tests don't get too messy")

    @transaction.atomic
    def handle(self, *args, **options):
        today = datetime.utcnow().date()
        reporting_end_date = date(today.year, 6, 30)
        eligible_programs = Program.objects.filter(indicator__admin_type=Indicator.ADMIN_PARTICIPANT_COUNT, reporting_period_end__gt=reporting_end_p)

        if options['change_customsort_to_fy']:
            pc_indicators = Indicator.objects.filter(admin_type=Indicator.ADMIN_PARTICIPANT_COUNT).prefetch_related('periodictargets')
            for indicator in pc_indicators:
                self.add_fy_customsort(indicator)

        counts = {
            'eligible_programs': 0, 'pc_indicators_with_multiple_pts': 0, 'pts_created': 0, }

        pc_indicators_multiple_pts = Indicator.objects.filter(admin_type=Indicator.ADMIN_PARTICIPANT_COUNT)\
            .prefetch_related('periodictargets').annotate(num_pts=Count('periodictargets')).filter(num_pts__gte=2)
        counts['pc_indicators_with_multiple_pts'] = pc_indicators_multiple_pts.count()
        eligible_programs = eligible_programs.exclude(indicator__id__in=[ind.pk for ind in pc_indicators_multiple_pts])
        counts['eligible_programs'] = eligible_programs.count()

        if options['execute']:
            for program in eligible_programs:
                add_additional_periodic_targets(program)

    @staticmethod
    def add_fy_customsort(indicator):
        for pt in indicator.periodictargets.all():
            year = int(''.join(filter(str.isdigit, pt.period)))
            pt.customsort = year
            pt.save()


