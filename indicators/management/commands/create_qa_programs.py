
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
    LevelTierTemplate,
    DisaggregationType,
    DisaggregationLabel,
    DisaggregatedValue,
)
from workflow.models import Program, Country, Organization, TolaUser, CountryAccess, ProgramAccess, SiteProfile, Sector
from indicators.views.views_indicators import generate_periodic_targets
from .qa_program_proletariat.qa_program_proletariate import Cleaner, ProgramFactory, IndicatorFactory, user_profiles


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
        parser.add_argument('--levelicious_only', action='store_true')
        parser.add_argument('--children_per_node', type=int, default=3)
        parser.add_argument('--childless_nodes', type=int, default=2)

    def handle(self, *args, **options):
        # ***********
        # Creates programs, indicators and results for qa testing
        # ***********

        clean_commands = [option for option in options if 'clean' in option and options[option] is True]
        if clean_commands:
            Cleaner.clean(*clean_commands)
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
        tolaland, created = Country.objects.get_or_create(
            country='Tolaland', defaults={
                'latitude': 21.4, 'longitude': -158, 'zoom': 6, 'organization': org, 'code': 'TO'})
        if created:
            self.create_disaggregations(tolaland)

        if 'named_only' not in options:
            password = getpass(prompt="Enter the password to use for the test users: ")
            self.create_test_users(password)

        self.create_test_sites()
        for super_user in TolaUser.objects.filter(user__is_superuser=True):
            ca, created = CountryAccess.objects.get_or_create(country=tolaland, tolauser=super_user)
            ca.role = 'basic_admin'
            ca.save()

        program_factory = ProgramFactory(tolaland)

        # Create a program whose end date has passed ond one whose start date is in the future
        # passed_end_date = program_factory.default_start_date - timedelta(days=1)
        # passed_start_date = (passed_end_date + relativedelta(months=-19)).replace(day=1)
        # future_start_date = (date.today() + relativedelta(months=6)).replace(day=1)
        # future_end_date = (future_start_date + relativedelta(months=19)).replace(day=28)
        # future_end_date = (future_end_date + relativedelta(days=5)).replace(day=1)

        # Create programs for specific people
        if options['names']:
            tester_names = options['names'].split(',')
        else:
            tester_names = ['Barbara', 'Cameron', 'Carly', 'Jenny', 'Marie', 'Marco', 'PaQ', 'Paul', 'Sanjuro']
        for t_name in tester_names:
            program_name = 'QA program - {}'.format(t_name)
            print(f'Creating {program_name}')
            program = program_factory.create_program(program_name)
            # self.create_levels(program.id, filtered_levels)
            indicator_factory = IndicatorFactory(program, tolaland)
            indicator_factory.create_standard_indicators(personal_indicator=True)
            # indicator_factory.create_indicators("nulls", apply_skips=False, personal_indicator=True)

        if options['named_only']:
            sys.exit()

        # other_standard_programs = ['QA Program -- Small Indicator Set', 'QA Program -- Multi-country Program']
        # for program_tuple in other_standard_programs:
        program_name = 'QA program -- Multi-country Program'
        print(f'Creating {program_name}')
        program = program_factory.create_program(program_name, multi_country=True)
        # self.create_levels(program.id, filtered_levels)
        indicator_factory = IndicatorFactory(program, tolaland)
        indicator_factory.create_standard_indicators()

        # print('Creating {}'.format(program_tuple[0]))
        # program = program_factory.create_program(
        #     main_start_date, main_end_date, country, program_tuple[0], multi_country=program_tuple[1])
        # fail_message = self.set_null_levels(short_param_base, short_null_levels, program.name)
        # if fail_message:
        #     print(fail_message)
        #     program.delete()
        # else:
        #     self.create_levels(program.id, filtered_levels)
        #     indicator_factory.create_indicators(program.id, short_param_base)
        #
        # Program that have the max number of levels allowed, one of which has levels with no indicators assigned
        # program_title = ['QA Program -- Levels all the way down', 'QA Program -- Levels most of the way down']
        program_name = 'QA program -- Custom Results Framework'
        print(f'Creating {program_name}')
        # for title in program_titles:
        program = program_factory.create_program(program_name, create_levels=False)
        template_names = []
        tier_depth = LevelTier.MAX_TIERS
        for tier_number in range(tier_depth):
            tier_name = f"Tier {tier_number + 1}"
            LevelTier.objects.create(program=program, name=tier_name, tier_depth=tier_number + 1)
            template_names.append(tier_name)
        LevelTierTemplate.objects.create(program=program, names=(','.join(template_names)))
        self.generate_levels(
            None, program, LevelTier.MAX_TIERS, children_per_node=options['children_per_node'],
            childless_nodes=options['childless_nodes'])
        generated_levels = Level.objects.filter(program=program).order_by('id')

        # Select top level and a couple of other levels to have no indicators.  They should be levels with child
        # levels because what would be the point of creating the level then.
        indicatorless_levels = []
        parent_levels = list(generated_levels.values_list('parent_id', flat=True))
        if tier_depth-2 > 2:
            tier2_with_children = [
                level.id for level in generated_levels if level.level_depth == 2 and level.id in parent_levels]
            tier6_with_children = [
                level.id for level in generated_levels if level.level_depth == tier_depth-2 and level.id in parent_levels]
            indicatorless_levels.extend([tier2_with_children[:1][0], tier6_with_children[:1][0]])
            top_level_id = Level.objects.filter(program=program, parent__isnull=True)[0].id
            indicatorless_levels.append(top_level_id)
        else:
            indicatorless_levels = [int(tier_depth/2)]
        indicator_factory = IndicatorFactory(program, tolaland)
        indicator_factory.create_standard_indicators(indicatorless_levels=indicatorless_levels)
        # create_stindicators(program.id, all_params_base, indicatorless_levels=indicatorless_levels)

        print('Creating ghost of programs past')
        passed_end_date = program_factory.default_start_date - timedelta(days=1)
        passed_start_date = (passed_end_date + relativedelta(months=-19)).replace(day=1)
        program = program_factory.create_program(
            'QA program -- Ghost of Programs Past', start_date=passed_start_date, end_date=passed_end_date)
        # self.create_levels(program.id, filtered_levels)
        indicator_factory = IndicatorFactory(program, tolaland)
        indicator_factory.create_standard_indicators()

        print('Creating ghost of programs future')
        future_start_date = (date.today() + relativedelta(months=6)).replace(day=1)
        future_end_date = (future_start_date + relativedelta(months=19)).replace(day=28)
        future_end_date = (future_end_date + relativedelta(days=5)).replace(day=1)
        # future_program_params = [
        #     {'freq': Indicator.ANNUAL, 'uom_type': Indicator.NUMBER, 'is_cumulative': True,
        #      'direction': Indicator.DIRECTION_OF_CHANGE_POSITIVE, 'null_level': 'targets'},
        #     {'freq': Indicator.QUARTERLY, 'uom_type': Indicator.PERCENTAGE, 'is_cumulative': True,
        #      'direction': Indicator.DIRECTION_OF_CHANGE_NEGATIVE, 'null_level': 'targets'},
        #     {'freq': Indicator.EVENT, 'uom_type': Indicator.PERCENTAGE, 'is_cumulative': True,
        #      'direction': Indicator.DIRECTION_OF_CHANGE_NONE, 'null_level': 'targets'},
        #     {'freq': Indicator.LOP, 'uom_type': Indicator.NUMBER, 'is_cumulative': False,
        #      'direction': Indicator.DIRECTION_OF_CHANGE_NONE, 'null_level': 'targets'},
        #     {'freq': Indicator.MID_END, 'uom_type': Indicator.NUMBER, 'is_cumulative': True,
        #      'direction': Indicator.DIRECTION_OF_CHANGE_POSITIVE, 'null_level': 'targets'},
        # ]

        program = program_factory.create_program(
            'QA program --- Ghost of Programs Future', start_date=future_start_date, end_date=future_end_date,)
        # self.create_levels(program.id, filtered_levels)
        indicator_factory = IndicatorFactory(program, tolaland)
        indicator_factory.create_standard_indicators()


        # Create program with lots of indicators
        program = program_factory.create_program('QA program -- I Love Indicators So Much')
        print('Creating program with many indicators')
        # self.create_levels(program.id, filtered_levels)
        indicator_factory = IndicatorFactory(program, tolaland)
        indicator_factory.create_standard_indicators()
        indicator_factory.create_standard_indicators(indicator_suffix='moar1')
        print('Creating moar indicators')
        indicator_factory.create_standard_indicators(indicator_suffix='moar2')
        indicator_factory.create_standard_indicators(indicator_suffix='moar3')

        print('Creating pre-satsuma program')
        program = program_factory.create_program('QA program --- Pre-Satsuma', post_satsuma=False)
        # self.create_levels(program.id, filtered_levels)
        indicator_factory = IndicatorFactory(program, tolaland)
        indicator_factory.create_standard_indicators(apply_skips=False, apply_rf_skips=True)

        # print('Creating program with no skips')
        # program = self.create_program(
        #     main_start_date, main_end_date, country, 'QA Program --- All the things! (no skipped values)')
        # self.create_levels(program.id, filtered_levels)


        # Create programs with various levels of no data indicators
        print('Creating null program with no indicators')
        program_factory.create_program('QA program --- No Indicators Here')

        print('Creating null program with no targets')
        program = program_factory.create_program('QA program --- No Targets Here')
        indicator_factory = IndicatorFactory(program, tolaland)
        indicator_params = deepcopy(indicator_factory.standard_params_base)
        long_null_levels = ['targets'] * len(indicator_params)
        fail_message = self.set_null_levels(indicator_params, long_null_levels, program.name)
        if fail_message:
            print(fail_message)
            program.delete()
        else:
            # self.create_levels(program.id, filtered_levels)
            indicator_factory.create_indicators(indicator_params)

        print('Creating null program with no results')
        program = program_factory.create_program('QA program --- No Results Here')
        indicator_factory = IndicatorFactory(program, tolaland)
        indicator_params = deepcopy(indicator_factory.standard_params_base)
        long_null_levels = ['results'] * len(indicator_params)
        # program = program_factory.create_program(main_start_date, main_end_date, country, 'QA program --- No Results Here')
        fail_message = self.set_null_levels(indicator_params, long_null_levels, program.name)
        if fail_message:
            print(fail_message)
            program.delete()
        else:
            # self.create_levels(program.id, filtered_levels)
            indicator_factory.create_indicators(indicator_params)

        print('Creating null program with no evidence')
        program = program_factory.create_program('QA program --- No Evidence Here')
        indicator_factory = IndicatorFactory(program, tolaland)
        indicator_params = deepcopy(indicator_factory.standard_params_base)
        long_null_levels = ['evidence'] * len(indicator_params)
        # program = program_factory.create_program(main_start_date, main_end_date, country, 'QA Program --- No Evidence Here')
        fail_message = self.set_null_levels(indicator_params, long_null_levels, program.name)
        if fail_message:
            print(fail_message)
            program.delete()
        else:
            # self.create_levels(program.id, filtered_levels)
            indicator_factory.create_indicators(indicator_params)

        # short_null_levels = [
        #     None, None, 'results', 'targets', None, 'results', 'evidence', 'evidence', 'targets', None
        # ]


        # Create test users and assign broad permissions to superusers.
        # self.create_test_users(password)

        # password = getpass(prompt="Enter the password to use for the test users: ")
        # self.create_test_users(password)

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
        for username in user_profiles.keys():
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
        programs = Program.objects.filter(name__contains='QA program -')
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
        for username, profile in user_profiles.items():
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
                        tolauser=tola_user, country=accessible_country, defaults={"role": 'user'})

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

    def generate_levels(self, parent, program, max_depth=3, children_per_node=2, childless_nodes=1, cycle_start=1):
        """
        This is a recursive function that generates an RF Level hierarchy for a program.  In addition to the
        parameters required to create a Level object, it takes parameters that control how many levels in any given
        "generation" of levels have child levels, where generation is considered a set of levels with the same parent
        level.  The number of levels grows exponentially:
        2 levels per generation ** 8 tiers =  ~255 levels
        3 levels per generation ** 8 tiers = ~6559 levels
        To avoid overwhelming the RF, the childless_nodes parameter can be used to limit the number of levels that
        have children in any given generation.  And to give some variety to which levels have children, a cycle
        is used to pick the levels that do have children (e.g. the "oldest" level will be childless in one generation,
        but the 2nd oldest will be childless in the next generation).

        :param parent: level object
        :param program: program object
        :param max_depth: integer, depth of the level hierarchy
        :param children_per_node: integer, how many children should each level have
        :param childless_nodes: integer, how many levels in a generation should have children (number must be
            less than children_per_node
        :param cycle_start: only used in recursion
        :return: Nothing
        """
        if children_per_node > childless_nodes:
            cycle_start = cycle_start + 1 if cycle_start + 1 <= children_per_node else 1
        else:
            raise NotImplementedError("The value of children_per_node must be greater than childless_nodes")

        if not parent:
            top_level = Level.objects.create(
                program=program,
                name="Tier 1 (top level)",
                assumptions="So many assumptions",
                parent_id=None,
                customsort=1,
            )
            self.generate_levels(
                top_level, program, max_depth=max_depth, children_per_node=children_per_node,
                childless_nodes=childless_nodes, cycle_start=cycle_start)
        else:
            new_levels = []
            current_depth = parent.level_depth + 1
            for i in range(children_per_node):
                new_level = Level.objects.create(
                    program=program,
                    name=f"Placeholder",
                    assumptions="So many assumptions",
                    parent_id=parent.id,
                    customsort=i+1,
                )
                new_level.name = f"Tier {current_depth} - Level {new_level.display_ontology}"
                new_level.save()
                new_levels.append(new_level)
            if current_depth < max_depth:
                # Use array slicing to rearrange the order of the nodes in such a way that childless levels
                # will be at the back of the list.
                nodes_with_children = new_levels[cycle_start:]
                nodes_with_children.extend(new_levels[:cycle_start])
                nodes_with_children = nodes_with_children[:(children_per_node - childless_nodes)]
                for nl in nodes_with_children:
                    self.generate_levels(
                        nl, program, max_depth=max_depth, children_per_node=children_per_node,
                        childless_nodes=childless_nodes, cycle_start=cycle_start)

