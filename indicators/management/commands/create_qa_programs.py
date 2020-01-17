
import json
import math
import os
import random
import sys
from copy import deepcopy
from datetime import date, timedelta
from dateutil.relativedelta import relativedelta
from getpass import getpass
from itertools import cycle

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone, translation
from django.conf import settings
from django.db.utils import IntegrityError

from indicators.models import (
    Indicator,
    IndicatorType,
    Result,
    PeriodicTarget,
    Level,
    LevelTier,
    DisaggregationType,
    DisaggregationLabel,
    DisaggregatedValue,
)
from workflow.models import Program, Country, Organization, TolaUser, CountryAccess, ProgramAccess, SiteProfile, Sector
from indicators.views.views_indicators import generate_periodic_targets

class Command(BaseCommand):
    help = """
        Setup targets for indicators by reading a CSV file
        """

    def __init__(self):
        super().__init__()
        self.sadd_disagg = ''

    def add_arguments(self, parser):
        parser.add_argument('--clean_programs', action='store_true')
        parser.add_argument('--clean_tolaland', action='store_true')
        parser.add_argument('--clean_test_users', action='store_true')
        parser.add_argument('--clean_all', action='store_true')
        parser.add_argument('--create_test_users', action='store_true')
        parser.add_argument('--names')
        parser.add_argument('--named_only', action='store_true')

    def handle(self, *args, **options):
        # ***********
        # Creates programs, indicators and results for qa testing
        # ***********
        if options['clean_tolaland']:
            self.clean_tolaland()
            sys.exit()

        if options['clean_programs']:
            self.clean_programs()
            sys.exit()

        if options['clean_test_users']:
            self.clean_test_users()
            sys.exit()

        if options['clean_all']:
            self.clean_programs()
            self.clean_tolaland()
            self.clean_test_users()
            sys.exit()

        if options['create_test_users']:
            password = getpass(prompt="Enter the password to use for the test users: ")
            self.create_test_users(password)
            sys.exit()

        translation.activate(settings.LANGUAGE_CODE)

        # Load the levels fixture and get the levels by filtering out the Tiers that are also in that file
        with open(os.path.join(settings.SITE_ROOT, 'fixtures/sample_levels.json'), 'r') as fh:
            sample_levels = json.loads(fh.read())

        filtered_levels = []
        for level in sample_levels:
            if 'tier_depth' not in level['fields']:
                level['fields'].pop('program_id')
                filtered_levels.append(level)

        org = Organization.objects.get(id=1)
        country, created = Country.objects.get_or_create(
            country='Tolaland', defaults={
                'latitude': 21.4, 'longitude': -158, 'zoom': 6, 'organization': org, 'code': 'TO'})
        if created:
            self.create_disaggregations(country)

        self.create_test_sites()
        for super_user in TolaUser.objects.filter(user__is_superuser=True):
            ca, created = CountryAccess.objects.get_or_create(country=country, tolauser=super_user)
            ca.role = 'basic_admin'
            ca.save()

        main_start_date = (date.today() + relativedelta(months=-18)).replace(day=1)
        main_end_date = (main_start_date + relativedelta(months=+32)).replace(day=1) - timedelta(days=1)

        # Create a program whose end date has passed ond one whose start date is in the future
        passed_end_date = main_start_date - timedelta(days=1)
        passed_start_date = (passed_end_date + relativedelta(months=-19)).replace(day=1)
        future_start_date = (date.today() + relativedelta(months=6)).replace(day=1)
        future_end_date = (future_start_date + relativedelta(months=19)).replace(day=28)
        future_end_date = (future_end_date + relativedelta(days=5)).replace(day=1)

        all_params_base = []
        for freq in Indicator.TARGET_FREQUENCIES:
            for uom_type in (Indicator.NUMBER, Indicator.PERCENTAGE):
                for is_cumulative in (True, False):
                    for direction in (Indicator.DIRECTION_OF_CHANGE_POSITIVE, Indicator.DIRECTION_OF_CHANGE_NEGATIVE):
                        # Don't create indicators that are LoP|cumulative or percent|non-cumulative
                        # since we don't support those combinations
                        if (freq[0] == Indicator.LOP and is_cumulative) or \
                                (uom_type == Indicator.PERCENTAGE and not is_cumulative):
                            continue
                        all_params_base.append({
                            'freq': freq[0], 'uom_type': uom_type, 'is_cumulative': is_cumulative,
                            'direction': direction, 'null_level': None})
        null_supplements_params = [
            {'freq': Indicator.ANNUAL, 'uom_type': Indicator.NUMBER, 'is_cumulative': False,
             'direction': Indicator.DIRECTION_OF_CHANGE_POSITIVE, 'null_level': 'targets'},
            {'freq': Indicator.QUARTERLY, 'uom_type': Indicator.PERCENTAGE, 'is_cumulative': True,
             'direction': Indicator.DIRECTION_OF_CHANGE_NONE, 'null_level': 'results'},
            {'freq': Indicator.LOP, 'uom_type': Indicator.NUMBER, 'is_cumulative': False,
             'direction': Indicator.DIRECTION_OF_CHANGE_NONE, 'null_level': 'results'},
            {'freq': Indicator.EVENT, 'uom_type': Indicator.PERCENTAGE, 'is_cumulative': True,
             'direction': Indicator.DIRECTION_OF_CHANGE_NEGATIVE, 'null_level': 'evidence'},
            {'freq': Indicator.MID_END, 'uom_type': Indicator.NUMBER, 'is_cumulative': False,
             'direction': Indicator.DIRECTION_OF_CHANGE_POSITIVE, 'null_level': 'evidence'},
        ]

        short_param_base = [
            {'freq': Indicator.ANNUAL, 'uom_type': Indicator.NUMBER, 'is_cumulative': True,
             'direction': Indicator.DIRECTION_OF_CHANGE_POSITIVE, 'null_level': None},
            {'freq': Indicator.ANNUAL, 'uom_type': Indicator.PERCENTAGE, 'is_cumulative': True,
             'direction': Indicator.DIRECTION_OF_CHANGE_NONE, 'null_level': None},
            {'freq': Indicator.QUARTERLY, 'uom_type': Indicator.NUMBER, 'is_cumulative': False,
             'direction': Indicator.DIRECTION_OF_CHANGE_NONE, 'null_level': None},
            {'freq': Indicator.QUARTERLY, 'uom_type': Indicator.NUMBER, 'is_cumulative': True,
             'direction': Indicator.DIRECTION_OF_CHANGE_POSITIVE, 'null_level': None},
            {'freq': Indicator.QUARTERLY, 'uom_type': Indicator.PERCENTAGE, 'is_cumulative': True,
             'direction': Indicator.DIRECTION_OF_CHANGE_NEGATIVE, 'null_level': None},
            {'freq': Indicator.LOP, 'uom_type': Indicator.NUMBER, 'is_cumulative': True,
             'direction': Indicator.DIRECTION_OF_CHANGE_NONE, 'null_level': None},
            {'freq': Indicator.LOP, 'uom_type': Indicator.PERCENTAGE, 'is_cumulative': True,
             'direction': Indicator.DIRECTION_OF_CHANGE_NONE, 'null_level': None},
            {'freq': Indicator.MID_END, 'uom_type': Indicator.NUMBER, 'is_cumulative': True,
             'direction': Indicator.DIRECTION_OF_CHANGE_NONE, 'null_level': None},
            {'freq': Indicator.MID_END, 'uom_type': Indicator.PERCENTAGE, 'is_cumulative': True,
             'direction': Indicator.DIRECTION_OF_CHANGE_NONE, 'null_level': None},
            {'freq': Indicator.EVENT, 'uom_type': Indicator.PERCENTAGE, 'is_cumulative': True,
             'direction': Indicator.DIRECTION_OF_CHANGE_NONE, 'null_level': None},
        ]

        password = getpass(prompt="Enter the password to use for the test users: ")
        # Create programs for specific people

        if options['names']:
            tester_names = options['names'].split(',')
        else:
            tester_names = ['Kelly', 'Marie', 'Jenny', 'Sanjuro', 'Cameron', 'Ken', 'Paul', 'Carly', 'Marco']

        for t_name in tester_names:
            program_name = 'QA Program - {}'.format(t_name)
            program = self.create_program(main_start_date, main_end_date, country, program_name)
            print('Creating Indicators for {}'.format(Program.objects.get(id=program.id)))
            self.create_levels(program.id, filtered_levels)
            self.create_indicators(program.id, all_params_base, personal_indicator=True)
            self.create_indicators(program.id, null_supplements_params, apply_skips=False, personal_indicator=True)

        if options['named_only']:
            sys.exit()

        print('Creating ghost of programs past')
        program = self.create_program(
            passed_start_date, passed_end_date, country, 'QA Program -- Ghost of Programs Past')
        self.create_levels(program.id, filtered_levels)
        self.create_indicators(program.id, all_params_base)

        print('Creating ghost of programs future')
        future_program_params = [
            {'freq': Indicator.ANNUAL, 'uom_type': Indicator.NUMBER, 'is_cumulative': True,
             'direction': Indicator.DIRECTION_OF_CHANGE_POSITIVE, 'null_level': 'targets'},
            {'freq': Indicator.QUARTERLY, 'uom_type': Indicator.PERCENTAGE, 'is_cumulative': True,
             'direction': Indicator.DIRECTION_OF_CHANGE_NEGATIVE, 'null_level': 'targets'},
            {'freq': Indicator.EVENT, 'uom_type': Indicator.PERCENTAGE, 'is_cumulative': True,
             'direction': Indicator.DIRECTION_OF_CHANGE_NONE, 'null_level': 'targets'},
            {'freq': Indicator.LOP, 'uom_type': Indicator.NUMBER, 'is_cumulative': False,
             'direction': Indicator.DIRECTION_OF_CHANGE_NONE, 'null_level': 'targets'},
            {'freq': Indicator.MID_END, 'uom_type': Indicator.NUMBER, 'is_cumulative': True,
             'direction': Indicator.DIRECTION_OF_CHANGE_POSITIVE, 'null_level': 'targets'},
        ]

        program = self.create_program(
            future_start_date, future_end_date, country, 'QA Program --- Ghost of Programs Future')
        self.create_levels(program.id, filtered_levels)
        self.create_indicators(program.id, future_program_params)

        # Create program with lots of indicators
        program = self.create_program(
            main_start_date, main_end_date, country, 'QA Program -- I Love Indicators So Much')
        print('Creating program with many indicators')
        self.create_levels(program.id, filtered_levels)
        self.create_indicators(program.id, all_params_base)
        print('Creating moar indicators')
        self.create_indicators(program.id, all_params_base, indicator_suffix='moar1')
        self.create_indicators(program.id, all_params_base, indicator_suffix='moar2')
        self.create_indicators(program.id, all_params_base, indicator_suffix='moar3')

        print('Creating pre-satsuma program')
        program = self.create_program(
            main_start_date, main_end_date, country, 'QA Program --- Pre-Satsuma', post_satsuma=False)
        self.create_levels(program.id, filtered_levels)
        self.create_indicators(program.id, all_params_base, apply_skips=False, apply_rf_skips=True)

        print('Creating program with no skips')
        program = self.create_program(
            main_start_date, main_end_date, country, 'QA Program --- All the things! (no Skipped values)')
        self.create_levels(program.id, filtered_levels)
        self.create_indicators(program.id, all_params_base, apply_skips=False)

        # Create programs with various levels of no data indicators
        print('Creating null program with no indicators')
        self.create_program(
            main_start_date, main_end_date, country, 'QA Program --- No Indicators Here')

        print('Creating null program with no targets')
        long_null_levels = ['targets'] * len(all_params_base)
        program = self.create_program(
            main_start_date, main_end_date, country, 'QA Program --- No Targets Here')
        fail_message = self.set_null_levels(all_params_base, long_null_levels, program.name)
        if fail_message:
            print(fail_message)
            program.delete()
        else:
            self.create_levels(program.id, filtered_levels)
            self.create_indicators(program.id, all_params_base)

        print('Creating null program with no results')
        long_null_levels = ['results'] * len(all_params_base)
        program = self.create_program(main_start_date, main_end_date, country, 'QA Program --- No Results Here')
        fail_message = self.set_null_levels(all_params_base, long_null_levels, program.name)
        if fail_message:
            print(fail_message)
            program.delete()
        else:
            self.create_levels(program.id, filtered_levels)
            self.create_indicators(program.id, all_params_base)

        print('Creating null program with no evidence')
        long_null_levels = ['evidence'] * len(all_params_base)
        program = self.create_program(main_start_date, main_end_date, country, 'QA Program --- No Evidence Here')
        fail_message = self.set_null_levels(all_params_base, long_null_levels, program.name)
        if fail_message:
            print(fail_message)
            program.delete()
        else:
            self.create_levels(program.id, filtered_levels)
            self.create_indicators(program.id, all_params_base)

        short_null_levels = [
            None, None, 'results', 'targets', None, 'results', 'evidence', 'evidence', 'targets', None
        ]
        short_programs = [
            ('QA Program - PaQ', False),
            ('QA Program -- Small Indicator Set', False),
            ('QA Program -- Multi-country Program', True)
        ]
        for program_tuple in short_programs:
            print('Creating {}'.format(program_tuple[0]))
            program = self.create_program(
                main_start_date, main_end_date, country, program_tuple[0], multi_country=program_tuple[1])
            fail_message = self.set_null_levels(short_param_base, short_null_levels, program.name)
            if fail_message:
                print(fail_message)
                program.delete()
            else:
                self.create_levels(program.id, filtered_levels)
                self.create_indicators(program.id, short_param_base)

        # Create test users and assign broad permissions to superusers.
        self.create_test_users(password)

    @staticmethod
    def create_disaggregations(country):
        disagg_1 = DisaggregationType(
            disaggregation_type="A 3-category disaggregation",
            country=country
        )
        disagg_1.save()
        for c, label in enumerate(['Category 1', 'Category 2', 'Category 3']):
            category = DisaggregationLabel(
                disaggregation_type=disagg_1,
                label=label,
                customsort=c+1
            )
            category.save()
        disagg_2 = DisaggregationType(
            disaggregation_type="A 2-category disaggregation",
            country=country,
        )
        disagg_2.save()
        for c, label in enumerate(['Cåtégøry 1', 'Category 2']):
            category = DisaggregationLabel(
                disaggregation_type=disagg_2,
                label=label,
                customsort=c+1
            )
            category.save()
        # disagg_3 = DisaggregationType(
        #     disaggregation_type="An archived no-label disaggregation",
        #     country=country,
        #     is_archived=True,
        #     selected_by_default=False,
        # )
        # disagg_3.save()
        # return [disagg_1, disagg_2, disagg_3]
        return [disagg_1, disagg_2]

    @staticmethod
    def create_program(start_date, end_date, country, name, post_satsuma=True, multi_country=False):
        program = Program.objects.create(**{
            'name': name,
            'reporting_period_start': start_date,
            'reporting_period_end': end_date,
            'funding_status': 'Funded',
            'gaitid': 'fake_gait_id_{}'.format(random.randint(1, 9999)),
            '_using_results_framework': Program.RF_ALWAYS if post_satsuma else Program.NOT_MIGRATED,
        })
        program.country.add(country)
        if multi_country:
            country2 = Country.objects.get(country="United States")
            program.country.add(country2)
        return program

    @staticmethod
    def set_null_levels(param_base, null_levels, program_name):
        if len(param_base) != len(null_levels):
            return 'Could not create {}.  Null level array length did not match indicator count'.format(program_name)
        for i, params in enumerate(param_base):
            params['null_level'] = null_levels[i]
        return False

    @staticmethod
    def make_targets(program, indicator):
        if indicator.target_frequency == Indicator.LOP:
            PeriodicTarget.objects.create(**{
                'indicator': indicator,
                'customsort': 1,
                'edit_date': timezone.now(),
                'period': 'LOP target',
                })
            return
        elif indicator.target_frequency == Indicator.EVENT:
            for i in range(3):
                PeriodicTarget.objects.create(**{
                    'indicator': indicator,
                    'customsort': i,
                    'edit_date': timezone.now(),
                    'period': 'Event {}'.format(i + 1),
                })
            return

        target_generator = PeriodicTarget.generate_for_frequency(indicator.target_frequency)
        num_periods = len([p for p in target_generator(program.reporting_period_start, program.reporting_period_end)])

        targets_json = generate_periodic_targets(
            tf=indicator.target_frequency, start_date=program.reporting_period_start, numTargets=num_periods)
        for i, pt in enumerate(targets_json):
            if indicator.target_frequency in [Indicator.LOP, Indicator.MID_END]:
                PeriodicTarget.objects.create(**{
                    'indicator': indicator,
                    'customsort': i,
                    'edit_date': timezone.now(),
                    'period': 'Period {}'.format(i+1),
                })
            else:
                PeriodicTarget.objects.create(**{
                    'indicator': indicator,
                    'customsort': i,
                    'edit_date': timezone.now(),
                    'period': 'Period {}'.format(i+1),
                    'start_date': pt['start_date'],
                    'end_date': pt['end_date'],
                })

    @staticmethod
    def calc_increment(target, period_count):
        return int(math.ceil((target/period_count)/10)*10)

    def create_indicators(
        self, program_id, param_sets, indicator_suffix='', apply_skips=True, apply_rf_skips=False,
            personal_indicator=False):
        try:
            self.sadd_disagg = DisaggregationType.objects.get(pk=109)
        except DisaggregationType.DoesNotExist:
            self.sadd_disagg = False
        indicator_ids = []
        program = Program.objects.get(id=program_id)
        frequency_labels = {
            Indicator.LOP: 'LoP only',
            Indicator.MID_END: 'Midline and endline',
            Indicator.EVENT: 'Event',
            Indicator.ANNUAL: 'Annual',
            Indicator.SEMI_ANNUAL: 'Semi-annual',
            Indicator.TRI_ANNUAL: 'Tri-annual',
            Indicator.QUARTERLY: 'Quarterly',
            Indicator.MONTHLY: 'Monthly',
        }
        uom_labels = {
            Indicator.NUMBER: 'Number (#)',
            Indicator.PERCENTAGE: "Percentage (%)",
        }
        direction_labels = {
            Indicator.DIRECTION_OF_CHANGE_NONE: "Direction of change NA",
            Indicator.DIRECTION_OF_CHANGE_POSITIVE: "Increase (+)",
            Indicator.DIRECTION_OF_CHANGE_NEGATIVE: "Decrease (-)",
        }

        # Keep track of results and evidence created across the whole programs so we can skip them periodically
        result_count = 0
        result_skip_mod = 7
        evidence_count = 0
        evidence_skip_mod = 7

        old_levels = list(Indicator.objects.filter(old_level__isnull=False).order_by('old_level')
                          .distinct().values_list('old_level', flat=True))
        old_levels.append(None)
        old_level_cycle = cycle(old_levels)

        rf_levels = list(Level.objects.filter(program__id=program.id))
        if apply_rf_skips:
            rf_levels.append(None)
        rf_level_cycle = cycle(rf_levels)

        indicator_types = list(IndicatorType.objects.all())
        if apply_skips:
            indicator_types.append(None)
        type_cycle = cycle(indicator_types)

        sectors = list(Sector.objects.all()[:5])
        if apply_skips:
            sectors.append(None)
        sector_cycle = cycle(sectors)

        sites = list(SiteProfile.objects.filter(country__country="Tolaland"))
        if apply_skips:
            sites.append(None)
        site_cycle = cycle(sites)

        disagg_cycle = cycle([0, 1, 2])
        result_disagg_cycle = cycle(['sadd', 'one', 'two', 'none', 'all', 'all', 'all', 'none'])

        for n, params in enumerate(param_sets):
            if params['is_cumulative']:
                cumulative_text = 'Cumulative'
            else:
                cumulative_text = 'Non-cumulative'
            disagg_count = next(disagg_cycle)
            result_disagg = next(result_disagg_cycle)

            indicator_name_list = [
                frequency_labels[params['freq']],
                uom_labels[params['uom_type']],
                cumulative_text,
                direction_labels[params['direction']],
                f"Disagg: {disagg_count}",
            ]
            if params['null_level']:
                indicator_name_list.append(f"| No {params['null_level']}")
            else:
                indicator_name_list.append(f"Result disagg: {result_disagg}")
            if indicator_suffix:
                indicator_name_list.append(indicator_suffix)
            indicator_name = ' | '.join(indicator_name_list)

            frequency = params['freq']
            if params['null_level'] == 'targets':
                frequency = None

            # Finally, create the indicator
            indicator = Indicator(
                name=indicator_name,
                is_cumulative=params['is_cumulative'],
                target_frequency=frequency,
                unit_of_measure='This is a UOM',
                baseline=0,
                unit_of_measure_type=params['uom_type'],
                direction_of_change=params['direction'],
                program=program,
                old_level=None if program.results_framework else next(old_level_cycle),
                level=next(rf_level_cycle),
                sector=None if not personal_indicator else next(sector_cycle),
            )
            indicator.save()
            if self.sadd_disagg:
                indicator.disaggregation.add(self.sadd_disagg)
            country = Country.objects.get(country="Tolaland")
            for disagg in country.disaggregationtype_set.all().order_by('?')[:disagg_count]:
                indicator.disaggregation.add(disagg)

            i_type = next(type_cycle)
            if personal_indicator and i_type:
                indicator.indicator_type.add(i_type)
            indicator.save()
            indicator_ids.append(indicator.id)

            if params['null_level'] == 'targets':
                indicator.lop_target = 100
                indicator.save()
                continue

            self.make_targets(program, indicator)
            periodic_targets = PeriodicTarget.objects.filter(indicator__id=indicator.id)

            # Different combinations of UOM type, direction of change and cummulativeness require
            # different inputs.
            if params['uom_type'] == Indicator.NUMBER:
                if params['direction'] == Indicator.DIRECTION_OF_CHANGE_POSITIVE:
                    if params['is_cumulative']:
                        target_start = 100
                        target_increment = target_start
                        achieved_start = 90
                        achieved_increment = int(achieved_start * 1.1)
                    else:
                        target_start = 100
                        target_increment = target_start
                        achieved_start = 90
                        achieved_increment = int(achieved_start * 1.1)
                else:
                    if params['is_cumulative']:
                        target_start = 500
                        target_increment = -int(math.floor((target_start/len(periodic_targets))/10)*10)
                        achieved_start = 400
                        achieved_increment = target_increment+2
                    else:
                        target_start = 500
                        target_increment = -int(math.floor((target_start/len(periodic_targets))/10)*10)
                        achieved_start = 400
                        achieved_increment = target_increment * .8
            else:
                if params['direction'] == Indicator.DIRECTION_OF_CHANGE_POSITIVE:
                    # Don't need to check non-cumulative because we don't really handle it
                    target_start = 10
                    target_increment = 3
                    achieved_start = 7
                    achieved_increment = 4
                else:
                    # Don't need to check non-cumulative because we don't really handle it
                    target_start = 90
                    target_increment = max(-math.floor(target_start/len(periodic_targets)), -2)
                    achieved_start = 95
                    achieved_increment = target_increment - 1

            lop_target = 0
            day_offset = timedelta(days=2)
            for i, pt in enumerate(periodic_targets):
                # Create the target amount (the PeriodicTarget object has already been created)
                pt.target = target_start + target_increment * i
                pt.save()

                if params['is_cumulative']:
                    lop_target = pt.target
                else:
                    lop_target += pt.target

                # Users shouldn't put in results with a date in the future, so neither should we.
                if pt.start_date and date.today() < pt.start_date + day_offset:
                    continue

                # Skip creating a result if the null_level is result or if
                # the number of results has reached the arbitrary skip point.
                result_count += 1
                if (apply_skips and result_count % result_skip_mod == result_skip_mod - 2) or \
                        params['null_level'] == 'results':
                    continue

                # if params['direction'] == Indicator.DIRECTION_OF_CHANGE_NEGATIVE:
                #     achieved_value = achieved_start - (achieved_increment * i)
                # else:
                achieved_value = achieved_start + (achieved_increment * i)

                results_to_create = 1
                if apply_skips and result_count % result_skip_mod in (1, result_skip_mod - 3):
                    results_to_create = 2
                    if params['uom_type'] == Indicator.NUMBER:
                        achieved_value = int(achieved_value * .4)
                    else:
                        achieved_value = int(achieved_value * .9)

                # Now create the Results and their related Records
                if pt.start_date:
                    date_collected = pt.start_date + day_offset
                else:
                    date_collected = date.today()

                for c in range(results_to_create):
                    rs = Result(
                        periodic_target=pt,
                        indicator=indicator,
                        program=program,
                        achieved=achieved_value,
                        date_collected=date_collected)
                    rs.save()
                    if result_disagg != 'none':
                        self.disaggregate_result(rs, result_disagg, indicator)
                    date_collected = date_collected + day_offset
                    if params['uom_type'] == Indicator.NUMBER:
                        achieved_value = int(achieved_value * 1.5)
                    else:
                        achieved_value = int(achieved_value * 1.15)

                    evidence_count += 1
                    if params['null_level'] == 'evidence':
                        continue

                    if apply_skips and evidence_count % evidence_skip_mod == int(evidence_skip_mod / 2):
                        evidence_count += 1
                        continue
                    rs.record_name = 'Evidence {} for result id {}'.format(evidence_count, rs.id)
                    rs.evidence_url = 'http://my/evidence/url'

                    r_site = next(site_cycle)
                    if personal_indicator and r_site:
                        rs.site.add(r_site)

                    rs.save()

            indicator.lop_target = lop_target
            indicator.save()

        return indicator_ids

    def disaggregate_result(self, result, result_disagg_type, indicator):
        label_sets = []
        if result_disagg_type == 'sadd' and self.sadd_disagg:
            label_sets.append(list(DisaggregationLabel.objects.filter(disaggregation_type=self.sadd_disagg)))
        elif result_disagg_type == 'one' and indicator.disaggregation.all().count() > 1:
            disagg_type = DisaggregationType.objects\
                .filter(indicator=indicator)\
                .exclude(pk=self.sadd_disagg.pk)\
                .order_by('?')\
                .first()
            label_sets.append(list(DisaggregationLabel.objects.filter(disaggregation_type=disagg_type)))
        elif result_disagg_type == 'two' and indicator.disaggregation.all().count() > 1:
            disagg_types = DisaggregationType.objects.filter(indicator=indicator).exclude(pk=self.sadd_disagg.pk)
            for disagg_type in disagg_types:
                label_sets.append(list(DisaggregationLabel.objects.filter(disaggregation_type=disagg_type)))
        elif result_disagg_type == 'all':
            for disagg_type in indicator.disaggregation.all():
                label_sets.append(list(DisaggregationLabel.objects.filter(disaggregation_type=disagg_type)))

        if len(label_sets) < 1:
            return
        for label_set in label_sets:
            # Calculate how many of the labels we will use (k) and then randomly select that number of label indexes
            k = random.randrange(1, len(label_set) + 1)
            label_indexes = random.sample(list(range(len(label_set))), k)
            values = self.make_random_disagg_values(result.achieved, len(label_indexes))
            for label_index, value in zip(label_indexes, values):
                label = label_set[label_index]
                DisaggregatedValue.objects.create(category_id=label.pk, value=value, result=result)

    @staticmethod
    def create_levels(program_id, level_data):
        fixture_data = deepcopy(level_data)
        tier_labels = LevelTier.get_templates()['mc_standard']['tiers']
        for i, tier in enumerate(tier_labels):
            t = LevelTier(name=tier, tier_depth=i+1, program_id=program_id)
            t.save()

        level_map = {}
        for level_fix in fixture_data:
            parent = None
            if 'parent_id' in level_fix['fields']:
                parent = level_map[level_fix['fields'].pop('parent_id')]

            level = Level(**level_fix['fields'])
            level.parent = parent
            level.program = Program.objects.get(id=program_id)
            level.save()
            level_map[level_fix['pk']] = level

    def clean_test_users(self):
        for username in self.user_profiles.keys():
            auth_user = User.objects.filter(username=username)
            if auth_user.count() == 1:
                tola_user = TolaUser.objects.filter(user=auth_user[0])
                auth_user[0].delete()
            else:
                print("This auth user doesn't exist: {}".format(username))
                continue

            if tola_user.count() == 1:
                tola_user[0].delete()

    @staticmethod
    def clean_tolaland():
        try:
            country = Country.objects.get(country='Tolaland')
            disaggregations = DisaggregationType.objects.filter(country=country)
            disaggregations.delete()
            country.delete()
        except Country.DoesNotExist:
            pass

    @staticmethod
    def clean_programs():
        programs = Program.objects.filter(name__contains='QA Program -')
        if programs.count() > 0:
            print("Delete these programs?\n{}".format('\n'.join(p.name for p in programs)))
            confirm = input('[yes/no]: ')
            if confirm == 'yes':
                for program in programs:
                    print('Deleting program: {}'.format(program))
                    for indicator in program.indicator_set.all():
                        indicator.delete()
                    program.delete()
            else:
                print('\nPrograms not deleted')

    def create_test_users(self, password):
        created_users = []
        existing_users = []
        for username, profile in self.user_profiles.items():
            home_country = None
            if profile['home_country']:
                home_country = Country.objects.get(country=profile['home_country'])
            accessible_countries = []

            for country_name in profile['accessible_countries']:
                accessible_countries.append(Country.objects.get(country=country_name))

            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'first_name': profile['first_last'][0],
                    'last_name': profile['first_last'][1],
                    'email': profile['email']
                }
            )
            user.set_password(password)
            user.save()
            if created:
                created_users.append(username)
            else:
                existing_users.append(username)

            tola_user, created = TolaUser.objects.get_or_create(
                user=user,
                defaults={
                    'name': ' '.join(profile['first_last']),
                    'country': home_country,
                    'organization': profile['org']
                }
            )
            tola_user.save()

            # Add accessible country links between tola_users and countries.  The profile setup
            # is overloaded a bit.  If the user belongs to the MC org, treat the accessible
            # country as such.  If the user isn't part of MC org, you have to do it on a program by program basis.
            for accessible_country in accessible_countries:
                if tola_user.organization.name == 'Mercy Corps':
                    ca, created = CountryAccess.objects.get_or_create(
                        tolauser=tola_user, country=accessible_country, role='user')
                    ca.save()

                # Need to also do program by program for MC members if the permission level is high because
                # default with country access is low.
                if tola_user.organization.name != 'Mercy Corps' or profile['permission_level'] != 'low':
                    for program in accessible_country.program_set.all():
                        ProgramAccess.objects.get_or_create(
                            country=accessible_country, program=program, tolauser=tola_user,
                            role=profile['permission_level'])

            # Add ProgramAccess links between tola_users and programs
            for access_profile in profile.get('program_access', []):
                country = Country.objects.get(country=access_profile[0])
                try:
                    prog = Program.objects.get(name__contains=access_profile[1], country=country)
                    ProgramAccess.objects.get_or_create(
                        country=country, program=prog, tolauser=tola_user, role=access_profile[2])
                except Program.DoesNotExist:
                    print("Couldn't create program access to {} for {}.  The program '{}' doesn't exist".format(
                        tola_user, access_profile[1], access_profile[1]))
                except IntegrityError:
                    pass

            # Create/upgrade admin levels for each country listed in the profile
            try:
                country_names = profile['admin']
                if country_names == 'all':
                    country_names = list(Country.objects.all().values_list('country', flat=True))
            except KeyError:
                country_names = []

            for country_name in country_names:
                ca, created = CountryAccess.objects.get_or_create(
                    country=Country.objects.get(country=country_name),
                    tolauser=tola_user
                )
                ca.role = 'basic_admin'
                ca.save()

        if len(created_users) > 0:
            print('\nCreated the following test users: {}\n'.format(', '.join(sorted(created_users))))
        if len(existing_users) > 0:
            print('The following test users already existed: {}\n'.format(', '.join(sorted(existing_users))))

    @staticmethod
    def create_test_sites():
        country = Country.objects.get(country="Tolaland")
        for i in range(1, 6):
            SiteProfile.objects.get_or_create(
                name="Tolaland Site {}".format(i),
                country=country,
                defaults={
                    "latitude": 21.4 + i/10,
                    "longitude": -158 + i/10,
                    "status": i % 2
                }
            )

    standard_countries = ['Afghanistan', 'Haiti', 'Jordan', 'Tolaland', 'United States']
    TEST_ORG, created = Organization.objects.get_or_create(name='Test')
    MC_ORG = Organization.objects.get(name='Mercy Corps')
    user_profiles = {
        'mc-low': {
            'first_last': ['mc-low-first', 'mc-low-last'],
            'email': 'tolatestone@mercycorps.org',
            'accessible_countries': standard_countries,
            'permission_level': 'low',
            'home_country': 'United States',
            'org': MC_ORG,
        },
        'mc-medium': {
            'first_last': ['mc-med-first', 'mc-med-last'],
            'email': 'tolatesttwo@mercycorps.org',
            'accessible_countries': standard_countries,
            'permission_level': 'medium',
            'home_country': 'United States',
            'org': MC_ORG,
        },
        'mc-high': {
            'first_last': ['mc-high-first', 'mc-high-last'],
            'email': 'tolatestthree@mercycorps.org',
            'accessible_countries': standard_countries,
            'permission_level': 'high',
            'home_country': 'United States',
            'org': MC_ORG,
        },
        'mc-basicadmin': {
            'first_last': ['mc-basicadmin-first', 'mc-basicadmin-last'],
            'email': 'mcbasicadmin@example.com',
            'accessible_countries': standard_countries,
            'permission_level': 'high',
            'home_country': 'United States',
            'org': MC_ORG,
            'admin': 'all'
        },
        'gmail-low': {
            'first_last': ['gmail-low-first', 'gmail-low-last'],
            'email': 'mctest.low@gmail.com',
            'accessible_countries': standard_countries,
            'permission_level': 'low',
            'home_country': None,
            'org': TEST_ORG,
        },
        'gmail-medium': {
            'first_last': ['gmail-med-first', 'gmail-med-last'],
            'email': 'mctest.medium@gmail.com',
            'accessible_countries': standard_countries,
            'permission_level': 'medium',
            'home_country': None,
            'org': TEST_ORG,
        },
        'gmail-high': {
            'first_last': ['gmail-high-first', 'gmail-high-last'],
            'email': 'mctest.high@gmail.com',
            'accessible_countries': standard_countries,
            'permission_level': 'high',
            'home_country': None,
            'org': TEST_ORG,
        },
        'external-low': {
            'first_last': ['external-low-first', 'external-low-last'],
            'email': 'external-low@example.com',
            'accessible_countries': standard_countries,
            'permission_level': 'low',
            'home_country': None,
            'org': TEST_ORG,
        },
        'external-medium': {
            'first_last': ['external-med-first', 'external-med-last'],
            'email': 'external-medium@example.com',
            'accessible_countries': standard_countries,
            'permission_level': 'medium',
            'home_country': None,
            'org': TEST_ORG,
        },
        'external-high': {
            'first_last': ['external-high-first', 'external-high-last'],
            'email': 'external-high@example.com',
            'accessible_countries': standard_countries,
            'permission_level': 'high',
            'home_country': None,
            'org': TEST_ORG,
        },
        'demo1': {
            'first_last': ['demo', 'one'],
            'email': 'demo1@example.com',
            'accessible_countries': ['Ethiopia'],
            'permission_level': 'low',
            'home_country': 'Ethiopia',
            'org': MC_ORG,
        },
        'demo2': {
            'first_last': ['demo', 'two'],
            'email': 'demo2@example.com',
            'accessible_countries': [],
            'permission_level': 'medium',
            'home_country': None,
            'org': TEST_ORG,
            'program_access': [('Ethiopia', 'Collaboration in Cross-Border Areas', 'medium')]
        },
        'demo3': {
            'first_last': ['demo', 'three'],
            'email': 'demo3@example.com',
            'accessible_countries': [],
            'permission_level': 'high',
            'home_country': None,
            'org': TEST_ORG,
            'program_access': [('Ethiopia', 'Collaboration in Cross-Border Areas', 'high')]
        },

    }

    @staticmethod
    def make_random_disagg_values(aggregate_value, total_slot_count):
        filled = []
        for slot_index in range(total_slot_count):
            slots_available_count = total_slot_count - len(filled)
            max_value = aggregate_value - sum(filled) - slots_available_count + 1
            if max_value <=1:
                filled.extend([1]*slots_available_count)
                break
            elif slot_index == total_slot_count - 1:
                filled.append(aggregate_value - sum(filled))
            else:
                filled.append(random.randrange(0, max_value))
        if sum(filled) < aggregate_value:
            filled[0] += aggregate_value - sum(filled)
        if sum(filled) > aggregate_value:
            reduction_amount = sum(filled) - aggregate_value
            while reduction_amount > 0:
                i = filled.index(max(filled))
                if filled[i] >= reduction_amount:
                    filled[i] -= reduction_amount
                    reduction_amount = 0
                else:
                    reduction_amount -= filled[i]
                    filled[i] = 0

        if sum(filled) != aggregate_value:
            raise NotImplementedError('You wrote a bad algorithm')
        random.shuffle(filled)
        return filled
