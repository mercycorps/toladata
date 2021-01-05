
import sys
import uuid
from copy import deepcopy
from datetime import date, timedelta
from dateutil.relativedelta import relativedelta
from getpass import getpass

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import translation
from django.conf import settings
from django.db.utils import IntegrityError

from indicators.models import (
    Level,
    LevelTier,
    LevelTierTemplate,
    DisaggregationType,
    DisaggregationLabel,
)
from workflow.models import Program, Country, Organization, TolaUser, CountryAccess, ProgramAccess, SiteProfile, Region
from .qa_program_widgets.qa_widgets import Cleaner, ProgramFactory, IndicatorFactory, user_profiles, standard_countries


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

        clean_commands = [option for option in options if 'clean' in option and options[option] is True]
        if clean_commands:
            Cleaner.clean(*clean_commands)
            return

        translation.activate(settings.LANGUAGE_CODE)

        if not options['named_only']:
            if 'test' in sys.argv:
                test_password = str(uuid.uuid4())
            else:
                test_password = getpass(prompt="Enter the password to use for the test users: ")

        org = Organization.mercy_corps()
        hq_region = Region.objects.get_or_create(gait_region_id=99, defaults={'name': 'HQ Managed'})
        tolaland, created = Country.objects.get_or_create(
            country='Tolaland', defaults={
                'latitude': 21.4, 'longitude': -158, 'zoom': 6, 'organization': org, 'code': 'TO', 'region': hq_region
            })
        if created:
            self.create_disaggregations(tolaland)

        self.create_test_sites()

        named_testers = {
            'Alex': 'atran@mercycorps.org',
            'André': 'anthomas@mercycorps.org',
            'Cameron': 'cmcfee@mercycorps.org',
            'Carly': 'colenick@mercycorps.org',
            'Jenny': 'jmarx@mercycorps.org',
            'Marie': 'mbakke@mercycorps.org',
            'Marco': 'mscagliusi@mercycorps.org',
            'PaQ': None,
            'Paul': 'psouders@mercycorps.org',
            'Sanjuro': 'sjogdeo@mercycorps.org',
        }

        program_factory = ProgramFactory(tolaland)

        if options['names']:
            tester_names = options['names'].split(',')
        else:
            tester_names = named_testers.keys()
        for t_name in tester_names:
            program_name = 'QA program - {}'.format(t_name)
            print(f'Creating {program_name}')
            program = program_factory.create_program(program_name)
            indicator_factory = IndicatorFactory(program, tolaland)
            indicator_factory.create_standard_indicators(personal_indicator=True)

        if options['named_only']:
            self.assign_permissions(named_testers, options['named_only'], tolaland)
            return

        program_name = 'QA program -- Multi-country Program'
        print(f'Creating {program_name}')
        program = program_factory.create_program(program_name, multi_country=True)
        indicator_factory = IndicatorFactory(program, tolaland)
        indicator_factory.create_standard_indicators()

        program_name = 'QA program -- Custom Results Framework'
        print(f'Creating {program_name}')
        program = program_factory.create_program(program_name, create_levels=False)
        template_names = []
        tier_depth = LevelTier.MAX_TIERS
        for tier_number in range(tier_depth):
            tier_name = f"Tier {tier_number + 1}"
            LevelTier.objects.create(program=program, name=tier_name, tier_depth=tier_number + 1)
            template_names.append(tier_name)
        LevelTierTemplate.objects.create(program=program, names=(','.join(template_names)))
        self.generate_levels(None, program, LevelTier.MAX_TIERS)
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

        program_name = 'QA program -- Ghost of Programs Past'
        print(f'Creating {program_name}')
        passed_end_date = program_factory.default_start_date - timedelta(days=1)
        passed_start_date = (passed_end_date + relativedelta(months=-19)).replace(day=1)
        program = program_factory.create_program(
            program_name, start_date=passed_start_date, end_date=passed_end_date)
        indicator_factory = IndicatorFactory(program, tolaland)
        indicator_factory.create_standard_indicators()

        program_name = 'QA program -- Ghost of Programs Future'
        print(f'Creating {program_name}')
        future_start_date = (date.today() + relativedelta(months=6)).replace(day=1)
        future_end_date = (future_start_date + relativedelta(months=19)).replace(day=28)
        future_end_date = (future_end_date + relativedelta(days=5)).replace(day=1) - timedelta(days=1)
        program = program_factory.create_program(
            program_name, start_date=future_start_date, end_date=future_end_date,)
        indicator_factory = IndicatorFactory(program, tolaland)
        indicator_params = deepcopy(indicator_factory.standard_params_base)
        indicator_params.extend(deepcopy(indicator_factory.null_supplements_params))
        null_level_list = ['results'] * len(indicator_params)
        fail_message = self.set_null_levels(indicator_params, null_level_list, program.name)
        if fail_message:
            print(fail_message)
            program.delete()
        else:
            indicator_factory.create_indicators(indicator_params)
        # supplemental_params = deepcopy(indicator_factory.null_supplements_params)
        # null_level_list = ['results'] * len(supplemental_params)
        # fail_message = self.set_null_levels(supplemental_params, null_level_list, program.name)
        # if fail_message:
        #     print(fail_message)
        #     program.delete()
        # else:
        #     indicator_factory.create_indicators(supplemental_params, apply_skips=True)

        program_name = 'QA program -- I Love Indicators So Much'
        print(f'Creating {program_name}')
        program = program_factory.create_program(program_name)
        indicator_factory = IndicatorFactory(program, tolaland)
        indicator_factory.create_standard_indicators()
        indicator_factory.create_standard_indicators(indicator_suffix='moar1')
        print('Creating moar indicators')
        indicator_factory.create_standard_indicators(indicator_suffix='moar2')
        indicator_factory.create_standard_indicators(indicator_suffix='moar3')

        program_name = 'QA program --- Pre-Satsuma'
        print(f'Creating {program_name}')
        program = program_factory.create_program(program_name, post_satsuma=False)
        indicator_factory = IndicatorFactory(program, tolaland)
        indicator_factory.create_standard_indicators(apply_skips=False, apply_rf_skips=True)

        # Create programs with various levels of no data indicators
        program_name = 'QA program --- No Indicators Here'
        print(f'Creating {program_name}')
        program_factory.create_program('QA program --- No Indicators Here')

        program_name = 'QA program --- No Results Here'
        print(f'Creating {program_name}')
        program = program_factory.create_program(program_name)
        indicator_factory = IndicatorFactory(program, tolaland)
        indicator_params = deepcopy(indicator_factory.standard_params_base)
        long_null_levels = ['results'] * len(indicator_params)
        fail_message = self.set_null_levels(indicator_params, long_null_levels, program.name)
        if fail_message:
            print(fail_message)
            program.delete()
        else:
            indicator_factory.create_indicators(indicator_params)

        program_name = 'QA program --- No Evidence Here'
        print(f'Creating {program_name}')
        program = program_factory.create_program(program_name)
        indicator_factory = IndicatorFactory(program, tolaland)
        indicator_params = deepcopy(indicator_factory.standard_params_base)
        long_null_levels = ['evidence'] * len(indicator_params)
        fail_message = self.set_null_levels(indicator_params, long_null_levels, program.name)
        if fail_message:
            print(fail_message)
            program.delete()
        else:
            indicator_factory.create_indicators(indicator_params)

        # Create test users and assign permissions last to ensure same permissions are applied to Tolaland programs
        self.assign_permissions(named_testers, options['named_only'], tolaland, test_password)

    def assign_permissions(self, named_testers, named_only, tolaland, test_password=None):
        for super_user in TolaUser.objects.filter(user__is_superuser=True):
            ca, created = CountryAccess.objects.get_or_create(country=tolaland, tolauser=super_user)
            ca.role = 'basic_admin'
            ca.save()

        named_tester_emails = [email for email in named_testers.values() if email]
        named_user_objs = TolaUser.objects.filter(user__email__in=named_tester_emails).select_related()
        for tola_user in named_user_objs:
            print(f'Assigning {tola_user.user.email} lots of permissions')
            for country in Country.objects.filter(country__in=standard_countries):
                ca, created = CountryAccess.objects.get_or_create(
                    country=Country.objects.get(country=country),
                    tolauser=tola_user
                )
                ca.role = 'basic_admin'
                ca.save()

                for program in country.program_set.all():
                    ProgramAccess.objects.get_or_create(
                        country=country, program=program, tolauser=tola_user, defaults={'role': 'high'})

        if not named_only:
            self.create_test_users(test_password)


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
    def set_null_levels(param_base, null_levels, program_name):
        if len(param_base) != len(null_levels):
            return 'Could not create {}.  Null level array length did not match indicator count'.format(program_name)
        for i, params in enumerate(param_base):
            params['null_level'] = null_levels[i]
        return False

    @staticmethod
    def create_test_users(password):
        created_users = []
        existing_users = []
        for username, profile in user_profiles.items():
            home_country = None
            if profile['home_country']:
                home_country = Country.objects.get(country=profile['home_country'])

            accessible_countries = Country.objects.filter(country__in=profile['accessible_countries'])

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
                    CountryAccess.objects.get_or_create(
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
