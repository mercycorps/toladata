
import sys
from datetime import date
from safedelete.models import HARD_DELETE

from django.core.management.base import BaseCommand
from django.conf import settings
from django.db import transaction

from indicators.models import (
    Indicator, DisaggregationType, DisaggregationLabel, OutcomeTheme
)
from indicators.utils import create_participant_count_indicator
from workflow.models import Program


class Command(BaseCommand):
    help = """
        Create participant count indicators.  The fiscal year needs to be set in order for this to work.  It will
        create participant count indicators for any program that doesn't already have one.  It will also create
        the participant count disaggregations if desired.
        """

    def add_arguments(self, parser):
        parser.add_argument(
            '--execute', action='store_true', help='Without this flag, the command will only be a dry run')
        parser.add_argument(
            '--create_disaggs_themes', action='store_true', help='Creates the participant count disaggregations to the database, does not create indicators')
        parser.add_argument('--clean', action='store_true')

    @transaction.atomic
    def handle(self, *args, **options):
        if options['clean']:
            ind_to_delete = Indicator.objects.filter(admin_type=Indicator.ADMIN_PARTICIPANT_COUNT)
            disaggs_to_delete = DisaggregationType.objects.filter(
                global_type=DisaggregationType.DISAG_PARTICIPANT_COUNT)
            outcome_themes_to_delete = OutcomeTheme.objects.all()
            response = input(f'Are you sure you want to delete {ind_to_delete.count()} indicators, {disaggs_to_delete.count()} disaggregations, and {outcome_themes_to_delete.count()} outcome themes (Y/n)? ')
            if response == 'Y':
                response = input(f'Hard or soft delete for indicators (hard/soft)? ')
                if response == 'hard':
                    ind_to_delete.delete(force_policy=HARD_DELETE)
                    disaggs_to_delete.delete()
                    outcome_themes_to_delete.delete()
                else:
                    ind_to_delete.delete()
                    for disagg in disaggs_to_delete:
                        disagg.is_archived = True
                        disagg.save()
                    for theme in outcome_themes_to_delete:
                        theme.is_active = False
                        theme.save()
            return

        if options['create_disaggs_themes']:
            sadd_label_text = 'Age Unknown M, Age Unknown F, Age Unknown Sex Unknown, 0-5 M, 0-5 F, 0-5 Sex Unknown, 6-9 M, 6-9 F, 6-9 Sex Unknown, 10-14 M, 10-14 F, 10-14 Sex Unknown, 15-19 M, 15-19 F, 15-19 Sex Unknown, 20-24 M, 20-24 F, 20-24 Sex Unknown, 25-34 M, 25-34 F, 25-34 Sex Unknown, 35-49 M, 35-49 F, 35-49 Sex Unknown, 50+ M, 50+ F, 50+ Sex Unknown'
            sadd_label_list = sadd_label_text.split(', ')

            sector_list = sorted([
                'Agriculture', 'Cash and Voucher Assistance', 'Environment (DRR, Energy and Water)',
                'Infrastructure (non - WASH, non - energy)', 'Governance and Partnership', 'Employment', 'WASH',
                'Financial Services', 'Nutrition', 'Health (non - nutrition)']
            )

            actual_disagg_labels = ['Direct', 'Indirect']

            disaggs_to_create = (
                ('SADD (including unknown) with double counting', sadd_label_list),
                ('SADD (including unknown) without double counting', sadd_label_list),
                ('Sectors Direct with double counting', sector_list),
                ('Sectors Indirect with double counting', sector_list),
                ('Actual without double counting', actual_disagg_labels),
                ('Actual with double counting', actual_disagg_labels),
            )

            for disagg_pair in disaggs_to_create:
                self._create_disagg_type_and_labels(*disagg_pair)

            created_counts = 0
            outcome_themes = sorted([
                'Humanitarian response', 'Food security', 'Economic opportunity',
                'Climate adaptation and water security', 'Peace and governance', 'Resilience'])
            for theme_name in outcome_themes:
                theme_obj, created = OutcomeTheme.objects.get_or_create(name=theme_name, defaults={'is_active': True})
                theme_obj.save()
                if created:
                    created_counts += 1

            print(f'{created_counts} Outcome themes created, {len(outcome_themes)-created_counts} already existed')

        counts = {
            'eligible_programs': 0, 'pc_indicator_does_not_exist': 0, 'has_rf': 0, 'indicators_created': 0,}

        reporting_start_date = date.fromisoformat(settings.REPORTING_YEAR_START_DATE)

        eligible_programs = Program.objects.filter(reporting_period_end__gte=reporting_start_date)
        counts['eligible_programs'] = eligible_programs.count()
        eligible_programs = eligible_programs.exclude(indicator__admin_type=Indicator.ADMIN_PARTICIPANT_COUNT)
        counts['pc_indicator_does_not_exist'] = eligible_programs.count()
        eligible_programs = eligible_programs.exclude(levels__isnull=True).prefetch_related('level_tiers')
        counts['has_rf'] = eligible_programs.count()

        disaggregations = DisaggregationType.objects.filter(global_type=DisaggregationType.DISAG_PARTICIPANT_COUNT)
        if len(disaggregations) < 1:
            response = input(f"There aren't many PC disaggregations ({len(disaggregations)}).  Continue creating indicators? (Y/n) ")
            if response != 'Y':
                print('Exiting')
                sys.exit()

        for program in eligible_programs:
            top_level = program.levels.get(parent_id__isnull=True)
            if options['execute']:
                create_participant_count_indicator(program, top_level, disaggregations)
                counts['indicators_created'] += 1

        for key in counts:
            print(f'{key} count: {counts[key]}')
        if not options['execute']:
            print('\nINDICATOR CREATION WAS A DRY RUN\n')

    @staticmethod
    def _create_disagg_type_and_labels(disagg_type_label, disagg_label_list):
        disagg_type, created = DisaggregationType.objects.get_or_create(
            disaggregation_type=disagg_type_label,
            country=None,
            global_type=DisaggregationType.DISAG_PARTICIPANT_COUNT,
            defaults={
                'is_archived': False,
                'selected_by_default': True,
            }
        )
        if created:
            for i, label in enumerate(disagg_label_list):
                DisaggregationLabel.objects.create(
                    label=label, disaggregation_type=disagg_type, customsort=i + 1)
            print(f'Created disaggregation type: {disagg_type}')
        else:
            if disagg_type.is_archived:
                disagg_type.is_archived = False
                disagg_type.save()
                print(f'This disaggregation was unarchived: {disagg_type}')
            else:
                print(f'This disaggregation type already exists: {disagg_type}')
