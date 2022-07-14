from datetime import datetime, date
from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models import Count
from django.db.models import Q
from indicators.models import Indicator
from workflow.models import Program
from indicators.utils import add_additional_periodic_targets, add_FY2022_pt


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
            '--add_pt_2022', action='store_true',
            help='Adds pt FY2022 for relevant programs')
        parser.add_argument(
            '--suppress_output', action='store_true',
            help="Suppresses the output so tests don't get too messy")

    @transaction.atomic
    def handle(self, *args, **options):
        if options['change_customsort_to_fy']:
            pc_indicators = Indicator.objects.filter(admin_type=Indicator.ADMIN_PARTICIPANT_COUNT).prefetch_related('periodictargets')
            for indicator in pc_indicators:
                self.add_fy_customsort(indicator)

        counts = {'eligible_programs': 0, 'ineligible_programs': 0, 'programs_pts_created': 0, 'eligible_programs_2022': 0}

        today = datetime.utcnow().date()
        reporting_end_date = date(today.year, 6, 30)

        eligible_programs = Program.objects.filter(indicator__admin_type=Indicator.ADMIN_PARTICIPANT_COUNT, reporting_period_end__gt=reporting_end_date)
        pc_indicators_multiple_pts = Indicator.objects.filter(admin_type=Indicator.ADMIN_PARTICIPANT_COUNT)\
            .prefetch_related('periodictargets').annotate(num_pts=Count('periodictargets')).filter(num_pts__gte=2)
        ineligible_programs = eligible_programs.filter(indicator__id__in=[ind.pk for ind in pc_indicators_multiple_pts])
        counts['ineligible_programs'] = ineligible_programs.count()
        eligible_programs = eligible_programs.exclude(indicator__id__in=[ind.pk for ind in pc_indicators_multiple_pts])
        counts['eligible_programs'] = eligible_programs.count()

        if options['execute']:
            for program in eligible_programs:
                add_additional_periodic_targets(program)
                counts['programs_pts_created'] += 1

        if options['add_pt_2022']:
            eligible_programs_2022 = Program.objects.filter(indicator__admin_type=Indicator.ADMIN_PARTICIPANT_COUNT,
                                                       reporting_period_start__lt=reporting_end_date)
            pc_indicators_need_2022 = Indicator.objects.filter(admin_type=Indicator.ADMIN_PARTICIPANT_COUNT) \
                .prefetch_related('periodictargets').filter(~Q(periodictargets__customsort=2022))
            eligible_programs_2022 = eligible_programs_2022.filter(
                indicator__id__in=[ind.pk for ind in pc_indicators_need_2022])
            for program in eligible_programs_2022:
                add_FY2022_pt(program)
                counts['eligible_programs_2022'] += 1


        if not options['suppress_output']:
            print('')
            if options['verbosity'] > 1:
                template = '{p.name}|{p.countries}|{p.reporting_period_start}|{p.reporting_period_end}|{p.funding_status}'
                print('Programs with PC Indicators that have multiple pts already.')
                for p in ineligible_programs:
                    print(template.format(p=p))
                print('Created indicators for these programs')
                for p in eligible_programs:
                    print(template.format(p=p))
            print('\nStats')
            for key in counts:
                print(f'{key} count: {counts[key]}')
            if not options['execute']:
                print('\nINDICATOR CREATION WAS A DRY RUN\n')


    @staticmethod
    def add_fy_customsort(indicator):
        for pt in indicator.periodictargets.all():
            year = int(''.join(filter(str.isdigit, pt.period)))
            pt.customsort = year
            pt.save()


