import math
import random
import json
import os
from copy import deepcopy
from datetime import date, timedelta
from itertools import cycle
from dateutil.relativedelta import relativedelta

from django.contrib.auth.models import User
from django.utils import timezone
from django.conf import settings

from indicators.models import (
    Indicator,
    IndicatorType,
    Result,
    PeriodicTarget,
    Level,
    DisaggregationType,
    DisaggregationLabel,
    DisaggregatedValue,
    LevelTier,
)
from workflow.models import Program, Country, Organization, TolaUser, SiteProfile, Sector
from indicators.views.views_indicators import generate_periodic_targets


class ProgramFactory:
    with open(os.path.join(settings.SITE_ROOT, 'fixtures/sample_levels.json'), 'r') as fh:
        sample_levels = json.loads(fh.read())

    def __init__(self, country):
        self.country = country
        self.org = Organization.objects.get(id=1)
        self.default_start_date = (date.today() + relativedelta(months=-18)).replace(day=1)
        self.default_end_date = (self.default_start_date + relativedelta(months=+32)).replace(day=1) - timedelta(days=1)

    def create_program(
            self, name, start_date=False, end_date=False, post_satsuma=True, multi_country=False, create_levels=True):
        if not start_date:
            start_date = self.default_start_date
        if not end_date:
            end_date = self.default_end_date

        program = Program.objects.create(**{
            'name': name,
            'reporting_period_start': start_date,
            'reporting_period_end': end_date,
            'funding_status': 'Funded',
            'gaitid': 'fake_gait_id_{}'.format(random.randint(1, 9999)),
            '_using_results_framework': Program.RF_ALWAYS if post_satsuma else Program.NOT_MIGRATED,
        })
        program.country.add(self.country)
        if multi_country:
            country2 = Country.objects.get(country="United States")
            program.country.add(country2)

        if create_levels:
            self.create_levels(program, deepcopy(self.sample_levels))

        return program

    @staticmethod
    def create_levels(program, level_template):
        level_data = deepcopy(level_template)
        tier_labels = LevelTier.get_templates()['mc_standard']['tiers']
        for i, tier in enumerate(tier_labels):
            t = LevelTier(name=tier, tier_depth=i + 1, program=program)
            t.save()

        level_map = {}
        for level_fix in level_data:
            parent = None
            if 'parent_id' in level_fix['fields']:
                parent = level_map[level_fix['fields'].pop('parent_id')]

            level = Level(**level_fix['fields'])
            level.parent = parent
            level.program = program
            level.save()
            level_map[level_fix['pk']] = level


class IndicatorFactory:
    standard_params_base = []
    for freq in Indicator.TARGET_FREQUENCIES:
        for uom_type in (Indicator.NUMBER, Indicator.PERCENTAGE):
            for is_cumulative in (True, False):
                for direction in (Indicator.DIRECTION_OF_CHANGE_POSITIVE, Indicator.DIRECTION_OF_CHANGE_NEGATIVE):
                    # Don't create indicators that are LoP|cumulative or percent|non-cumulative
                    # since we don't support those combinations
                    if (freq[0] == Indicator.LOP and is_cumulative) or \
                            (uom_type == Indicator.PERCENTAGE and not is_cumulative):
                        continue
                    standard_params_base.append({
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

    def __init__(self, program, country):
        self.program = program
        self.country = country
        self.sadd_disagg_obj = DisaggregationType.objects.get(
            pk=109, disaggregation_type="Sex and Age Disaggregated Data (SADD)")
        self.sadd_disagg_labels = self.sadd_disagg_obj.disaggregationlabel_set.all()

    def create_standard_indicators(self, **kwargs):
        indicator_ids = self.create_indicators(self.standard_params_base, **kwargs)
        indicator_ids.extend(self.create_indicators(self.null_supplements_params, **kwargs))
        return indicator_ids

    def create_indicators(
            self, param_sets, indicator_suffix='', apply_skips=True, apply_rf_skips=False,
            personal_indicator=False, indicatorless_levels=None):
        indicatorless_levels = [] if not indicatorless_levels else indicatorless_levels
        indicator_ids = []

        old_levels = list(Indicator.objects.filter(old_level__isnull=False).order_by('old_level')
                          .distinct().values_list('old_level', flat=True))
        old_levels.append(None)
        old_level_cycle = cycle(old_levels)

        rf_levels = list(Level.objects.filter(program__id=self.program.id).exclude(id__in=indicatorless_levels))
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

        result_skip_cycle = cycle([False, False, False, False, True, False, False])
        extra_result_cycle = cycle([True, False, False, True, False, False, False])
        evidence_skip_cycle = cycle([False, False, True, False, False, False, False])

        # Determines how many country disaggs an indicator will have assigned to it
        country_disagg_cycle = cycle([0, 1, 2])

        # Determins whether the country level SADD disagg will be assigned to an indicator
        sadd_disagg_cycle = cycle([True, True, True, False])

        # Regardless of what disaggs an indicator has assigned, this controls how many disaggas actually get
        # used by a result.  That way, there are potentially some results that don't have disagg values
        # even though the indicator has been assigned a particular disagg type.  one and two
        # indicate that one or two disagg types should be used but not the SADD type.
        result_disagg_cycle = cycle(['sadd', 'one', 'two', 'none', 'all', 'all', 'all', 'none'])

        for n, params in enumerate(param_sets):
            if params['is_cumulative']:
                cumulative_text = 'Cumulative'
            else:
                cumulative_text = 'Non-cumulative'

            indicator_disagg_count = next(country_disagg_cycle)
            sadd_disagg_flag = next(sadd_disagg_cycle)
            result_disagg_type = next(result_disagg_cycle)

            indicator_name_list = [
                self.frequency_labels[params['freq']],
                self.uom_labels[params['uom_type']],
                cumulative_text,
                self.direction_labels[params['direction']],
                f"Disagg type - SADD:{sadd_disagg_flag}, Country:{indicator_disagg_count}",

            ]
            if params['null_level']:
                indicator_name_list.append(f"| No {params['null_level']}")
            else:
                result_text_list = []
                result_text_list.append(f"SADD:{result_disagg_type in ('all', 'sadd')}") if sadd_disagg_flag else None
                result_text_list.append(
                    f"Country:{result_disagg_type in ('one', 'two', 'all')}"
                ) if indicator_disagg_count > 0 else None
                if len(result_text_list) > 0:
                    result_text = ", ".join(result_text_list)
                else:
                    result_text = "None"
                indicator_name_list.append(
                    f"Disaggs applied - {result_text}")
            if indicator_suffix:
                indicator_name_list.append(indicator_suffix)
            indicator_name = ' | '.join(indicator_name_list)

            frequency = params['freq']
            if params['null_level'] == 'targets':
                frequency = None

            indicator = Indicator(
                name=indicator_name,
                is_cumulative=params['is_cumulative'],
                target_frequency=frequency,
                unit_of_measure='This is a UOM',
                baseline=0,
                unit_of_measure_type=params['uom_type'],
                direction_of_change=params['direction'],
                program=self.program,
                old_level=None if self.program.results_framework else next(old_level_cycle),
                level=next(rf_level_cycle),
                sector=None if not personal_indicator else next(sector_cycle),
            )
            indicator.save()

            country_assigned_disagg_labelsets = []
            for disagg in self.country.disaggregationtype_set.order_by('?').all()[:indicator_disagg_count]:
                indicator.disaggregation.add(disagg)
                country_assigned_disagg_labelsets.append(list(disagg.disaggregationlabel_set.all()))
            if sadd_disagg_flag:
                indicator.disaggregation.add(self.sadd_disagg_obj)

            i_type = next(type_cycle)
            if personal_indicator and i_type:
                indicator.indicator_type.add(i_type)
            indicator.save()
            indicator_ids.append(indicator.id)

            if params['null_level'] == 'targets':
                indicator.lop_target = 100
                indicator.save()
                continue

            self.make_targets(self.program, indicator)
            periodic_targets = PeriodicTarget.objects.filter(indicator__id=indicator.id)

            incrementors = self.calc_target_and_achieved_base(
                params['uom_type'], params['direction'], params['is_cumulative'], len(periodic_targets))

            lop_target = 0

            for i, pt in enumerate(periodic_targets):
                pt.target = incrementors['target_start'] + incrementors['target_increment'] * i
                pt.save()
                if params['is_cumulative']:
                    lop_target = pt.target
                else:
                    lop_target += pt.target

            indicator.lop_target = lop_target
            indicator.save()

            result_factory = ResultFactory(
                indicator, self.program, country_assigned_disagg_labelsets, self.sadd_disagg_labels,
                result_disagg_type, params['uom_type'], params['null_level'], site_cycle, personal_indicator,
                apply_skips)
            result_factory.make_results(
                periodic_targets, incrementors, evidence_skip_cycle, result_skip_cycle, extra_result_cycle)

        return indicator_ids

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
                    'period': 'Period {}'.format(i + 1),
                })
            else:
                PeriodicTarget.objects.create(**{
                    'indicator': indicator,
                    'customsort': i,
                    'edit_date': timezone.now(),
                    'period': 'Period {}'.format(i + 1),
                    'start_date': pt['start_date'],
                    'end_date': pt['end_date'],
                })

    @staticmethod
    def calc_target_and_achieved_base(uom_type, direction, is_cumulative, pt_count):
        if uom_type == Indicator.NUMBER:
            if direction == Indicator.DIRECTION_OF_CHANGE_POSITIVE:
                if is_cumulative:
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
                if is_cumulative:
                    target_start = 500
                    target_increment = -int(math.floor((target_start / pt_count) / 10) * 10)
                    achieved_start = 400
                    achieved_increment = target_increment + 2
                else:
                    target_start = 500
                    target_increment = -int(math.floor((target_start / pt_count) / 10) * 10)
                    achieved_start = 400
                    achieved_increment = target_increment * .8
        else:
            if direction == Indicator.DIRECTION_OF_CHANGE_POSITIVE:
                # Don't need to check non-cumulative because we don't really handle it
                target_start = 10
                target_increment = 3
                achieved_start = 7
                achieved_increment = 4
            else:
                # Don't need to check non-cumulative because we don't really handle it
                target_start = 90
                target_increment = max(-math.floor(target_start / pt_count), -2)
                achieved_start = 95
                achieved_increment = target_increment - 1

        return {
            "target_start": target_start, "target_increment": target_increment,
            "achieved_start": achieved_start, "achieved_increment": achieved_increment}


class ResultFactory:

    def __init__(
            self, indicator, program, country_assigned_disagg_labelsets, sadd_disagg_labels, result_disagg,
            uom_type, null_level, site_cycle, personal_indicator, apply_skips):
        self.program = program
        self.indicator = indicator
        self.sadd_disagg_labels = sadd_disagg_labels
        self.indicator_disagg_labelsets = country_assigned_disagg_labelsets
        self.result_disagg = result_disagg
        self.uom_type = uom_type
        self.null_level = null_level
        self.site_cycle = site_cycle
        self.personal_indicator = personal_indicator
        self.apply_skips = apply_skips

    def make_results(self, periodic_targets, incrementors, evidence_skip_cycle, result_skip_cycle, extra_result_cycle):

        day_offset = timedelta(days=2)
        for i, pt in enumerate(periodic_targets):
            # Users shouldn't put in results with a date in the future, so neither should we.
            if pt.start_date and date.today() < pt.start_date + day_offset:
                continue

            # Skip creating a result if the null_level is result or if
            # the number of results has reached the arbitrary skip point.
            result_skip = next(result_skip_cycle)
            extra_result = next(extra_result_cycle)
            if (self.apply_skips and result_skip) or self.null_level == 'results':
                continue

            achieved_value = incrementors['achieved_start'] + (incrementors['achieved_increment'] * i)

            results_to_create = 1
            if self.apply_skips and extra_result:
                results_to_create = 2
                if self.uom_type == Indicator.NUMBER:
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
                    indicator=self.indicator,
                    program=self.program,
                    achieved=achieved_value,
                    date_collected=date_collected)
                rs.save()

                if self.result_disagg != 'none':
                    self.disaggregate_result(rs, self.result_disagg, self.indicator)
                date_collected = date_collected + day_offset
                if self.uom_type == Indicator.NUMBER:
                    achieved_value = int(achieved_value * 1.5)
                else:
                    achieved_value = int(achieved_value * 1.15)

                if self.null_level == 'evidence':
                    continue

                # evidence_skip = next(evidence_skip_cycle)
                if self.apply_skips and next(evidence_skip_cycle):
                    continue

                rs.record_name = 'Evidence for result id {}'.format(rs.id)
                rs.evidence_url = 'https://www.pinterest.ca/search/pins/?q=cute%20animals'

                r_site = next(self.site_cycle)
                # TODO: remove personal indicator?
                if self.personal_indicator and r_site:
                    rs.site.add(r_site)

                rs.save()

    def disaggregate_result(self, result, result_disagg_type, indicator):
        label_sets = []
        if result_disagg_type == 'sadd':
            label_sets.append(self.sadd_disagg_labels)
        elif result_disagg_type == 'one' and len(self.indicator_disagg_labelsets) > 1:
            try:
                label_sets.append(random.choice(self.indicator_disagg_labelsets))
            except ValueError:
                pass
        elif result_disagg_type == 'two' and indicator.disaggregation.all().count() > 1:
            try:
                label_sets.extend(random.sample(self.indicator_disagg_labelsets, k=2))
            except ValueError:
                label_sets.extend(self.indicator_disagg_labelsets)
        elif result_disagg_type == 'all':
            label_sets.append(self.sadd_disagg_labels)
            label_sets.extend(self.indicator_disagg_labelsets)

        if len(label_sets) < 1:
            return
        for label_set in label_sets:
            # Calculate how many of the labels we will use (k) and then randomly select that number of label indexes
            k = random.randrange(1, len(label_set) + 1)
            label_indexes = random.sample(list(range(len(label_set))), k)
            values = self.make_random_disagg_values(result.achieved, len(label_indexes))
            value_objects = []
            for label_index, value in zip(label_indexes, values):
                label = label_set[label_index]
                value_objects.append(DisaggregatedValue(category=label, value=value, result=result))

            DisaggregatedValue.objects.bulk_create(value_objects)

    @staticmethod
    def make_random_disagg_values(aggregate_value, total_slot_count):
        filled = []
        for slot_index in range(total_slot_count):
            slots_available_count = total_slot_count - len(filled)
            max_value = aggregate_value - sum(filled) - slots_available_count + 1
            if max_value <= 1:
                filled.extend([1] * slots_available_count)
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


class Cleaner:

    @classmethod
    def clean(cls, *args):
        if 'clean_all' in args:
            cls.clean_programs()
            cls.clean_tolaland()
            cls.clean_test_users()

        else:
            if 'clean_tolaland' in args:
                cls.clean_tolaland()
            if 'clean_programs' in args:
                cls.clean_programs()
            if 'clean_test_users' in args:
                cls.clean_test_users()

    @staticmethod
    def clean_test_users():
        auth_users = User.objects.filter(username__in=user_profiles.keys())
        tola_users = TolaUser.objects.filter(user__in=auth_users)
        message = f"{auth_users.count()} Auth Users and {tola_users.count()} Tola Users deleted"
        tola_users.delete()
        auth_users.delete()
        print(message)

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
