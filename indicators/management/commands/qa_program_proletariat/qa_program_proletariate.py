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

class ProgramFactory():
    def __init__(self, country, *args, **kwargs):
        self.country = country
        self.org = Organization.objects.get(id=1)
        self.country, created = Country.objects.get_or_create(
            country='Tolaland', defaults={
                'latitude': 21.4, 'longitude': -158, 'zoom': 6, 'organization': self.org, 'code': 'TO'})
        if created:
            self.create_disaggregations(self.country)

    def create_program(self, start_date, end_date, name, post_satsuma=True, multi_country=False):
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
        return program

    @staticmethod
    def create_disaggregations(country):
        disagg_1, created = DisaggregationType.objects.get_or_create(
            disaggregation_type="A 3-category disaggregation",
            country=country
        )
        if created:
            disagg_1.save()
            for c, label in enumerate(['Category 1', 'Category 2', 'Category 3']):
                category = DisaggregationLabel(
                    disaggregation_type=disagg_1,
                    label=label,
                    customsort=c + 1
                )
                category.save()

        disagg_2, created = DisaggregationType.objects.get_or_create(
            disaggregation_type="A 2-category disaggregation",
            country=country,
        )
        if created:
            for c, label in enumerate(['Cåtégøry 1', 'Category 2']):
                category = DisaggregationLabel(
                    disaggregation_type=disagg_2,
                    label=label,
                    customsort=c + 1
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



class IndicatorFactory():
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
    parameter_options = {"base": all_params_base, "nulls": null_supplements_params}

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

    try:
        sadd_disagg = DisaggregationType.objects.get(pk=109)
    except DisaggregationType.DoesNotExist:
        sadd_disagg = False

    # def __init__(self):
    #     try:
    #         self.sadd_disagg = DisaggregationType.objects.get(pk=109)
    #     except DisaggregationType.DoesNotExist:
    #         self.sadd_disagg = False

    @classmethod
    def create_indicators(
        cls, program, param_sets, indicator_suffix='', apply_skips=True, apply_rf_skips=False,
            personal_indicator=False, indicatorless_levels=None):
        if param_sets in cls.parameter_options:
            param_sets = cls.parameter_options[param_sets]
        indicatorless_levels = [] if not indicatorless_levels else indicatorless_levels
        # try:
        #     self.sadd_disagg = DisaggregationType.objects.get(pk=109)
        # except DisaggregationType.DoesNotExist:
        #     self.sadd_disagg = False
        indicator_ids = []
        # frequency_labels = {
        #     Indicator.LOP: 'LoP only',
        #     Indicator.MID_END: 'Midline and endline',
        #     Indicator.EVENT: 'Event',
        #     Indicator.ANNUAL: 'Annual',
        #     Indicator.SEMI_ANNUAL: 'Semi-annual',
        #     Indicator.TRI_ANNUAL: 'Tri-annual',
        #     Indicator.QUARTERLY: 'Quarterly',
        #     Indicator.MONTHLY: 'Monthly',
        # }
        # uom_labels = {
        #     Indicator.NUMBER: 'Number (#)',
        #     Indicator.PERCENTAGE: "Percentage (%)",
        # }
        # direction_labels = {
        #     Indicator.DIRECTION_OF_CHANGE_NONE: "Direction of change NA",
        #     Indicator.DIRECTION_OF_CHANGE_POSITIVE: "Increase (+)",
        #     Indicator.DIRECTION_OF_CHANGE_NEGATIVE: "Decrease (-)",
        # }

        # Keep track of results and evidence created across the whole programs so we can skip them periodically
        result_count = 0
        result_skip_mod = 7
        evidence_count = 0
        evidence_skip_mod = 7

        old_levels = list(Indicator.objects.filter(old_level__isnull=False).order_by('old_level')
                          .distinct().values_list('old_level', flat=True))
        old_levels.append(None)
        old_level_cycle = cycle(old_levels)

        rf_levels = list(Level.objects.filter(program__id=program.id).exclude(id__in=indicatorless_levels))
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


        country_disagg_cycle = cycle([0, 1, 2])
        sadd_disagg_cycle = cycle([True, True, True, False])
        result_disagg_cycle = cycle(['sadd', 'one', 'two', 'none', 'all', 'all', 'all', 'none'])

        for n, params in enumerate(param_sets):
            if params['is_cumulative']:
                cumulative_text = 'Cumulative'
            else:
                cumulative_text = 'Non-cumulative'
            country_disagg_count = next(country_disagg_cycle)
            sadd_disagg = next(sadd_disagg_cycle)
            result_disagg = next(result_disagg_cycle)

            indicator_name_list = [
                cls.frequency_labels[params['freq']],
                cls.uom_labels[params['uom_type']],
                cumulative_text,
                cls.direction_labels[params['direction']],
                f"Disagg type - SADD:{sadd_disagg}, Country:{country_disagg_count}",

            ]
            if params['null_level']:
                indicator_name_list.append(f"| No {params['null_level']}")
            else:
                result_text_list = []
                result_text_list.append(f"SADD:{result_disagg in ('all', 'sadd')}") if sadd_disagg else None
                result_text_list.append(f"Country:{result_disagg in ('one', 'two', 'all')}") if country_disagg_count > 0 else None
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
            if cls.sadd_disagg and sadd_disagg:
                indicator.disaggregation.add(cls.sadd_disagg)
            country = Country.objects.get(country="Tolaland")
            for disagg in country.disaggregationtype_set.all().order_by('?')[:country_disagg_count]:
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

            cls.make_targets(program, indicator)
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
                        cls.disaggregate_result(rs, result_disagg, indicator)
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

    @classmethod
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


class ResultFactory():
    pass


class DisaggFactory():
    pass


class Cleaner():

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

        # for username in user_profiles.keys():
        #     auth_user = User.objects.filter(username=username)
        #     if auth_user.count() == 1:
        #         tola_user = TolaUser.objects.filter(user=auth_user[0])
        #         auth_user[0].delete()
        #     else:
        #         print("This auth user doesn't exist: {}".format(username))
        #         continue
        #
        #     if tola_user.count() == 1:
        #         tola_user[0].delete()

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
