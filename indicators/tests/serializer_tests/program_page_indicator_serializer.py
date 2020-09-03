# -*- coding: utf-8 -*-
"""Tests for the Program Page Indicator Serializer

    corresponding to js/pages/program_page/models/ProgramPageIndicator
"""

import datetime
import decimal
from factories.workflow_models import RFProgramFactory
from factories.indicators_models import RFIndicatorFactory, ResultFactory
from indicators.serializers_new import (
    TierBaseSerializer,
    LevelBaseSerializer,
    ProgramPageIndicatorSerializer,
    ProgramPageIndicatorOrderingSerializer
)
from indicators.models import Indicator
from tola.test.utils import lang_context
from django import test
from django.utils import timezone, formats

QUERY_COUNT = 3 # indicators, periodic targets, orphaned results
WITH_TARGETS_QUERY_COUNT = 4 # indicators, periodic targets, targeted results, orphaned results
UPDATE_QUERY_COUNT = 1

def get_program_context(program):
    pk = program.pk
    context = {'program_pk': pk}
    context['tiers'] = TierBaseSerializer.load_for_program(pk, context=context).data
    context['levels'] = LevelBaseSerializer.load_for_program(pk, context=context).data
    return context


class TestProgramPageIndicatorSerializer(test.TestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.non_rf_program = RFProgramFactory(closed=False, migrated=False)
        cls.non_rf_context = get_program_context(cls.non_rf_program)
        cls.manual_number_program = RFProgramFactory(
            closed=True, migrated=True, auto_number_indicators=False
        )
        cls.manual_number_context = get_program_context(cls.manual_number_program)
        cls.migrated_program = RFProgramFactory(
            migrated=True, auto_number_indicators=True,
            tiers=['tier1', 'tier2', 'Outcome'], levels=[(1,), ((2,),), (((1, 1),),)]
        )
        cls.migrated_context = get_program_context(cls.migrated_program)
        cls.migrated_levels = sorted(
            cls.migrated_program.levels.all(),
            key=lambda l: (l.level_depth, l.customsort)
        )

    def tearDown(self):
        self.non_rf_program.indicator_set.all().delete()
        self.manual_number_program.indicator_set.all().delete()
        self.migrated_program.indicator_set.all().delete()

    def get_serialized_data(self, context, has_targets=False):
        program_pk = context['program_pk']
        query_count = WITH_TARGETS_QUERY_COUNT if has_targets else QUERY_COUNT
        with self.assertNumQueries(query_count):
            return {
                s_i['pk']: s_i for s_i in
                ProgramPageIndicatorSerializer.load_for_program(program_pk, context=context).data
            }

    def get_indicator_data(self, **kwargs):
        has_targets = kwargs.pop('has_targets', False)
        indicator = RFIndicatorFactory(**kwargs)
        context = get_program_context(indicator.program)
        return self.get_serialized_data(context, has_targets=has_targets)[indicator.pk]

    def get_non_migrated_indicator_data(self, **kwargs):
        has_targets = kwargs.pop('has_targets', False)
        refresh = kwargs.pop('refresh', False)
        indicator = RFIndicatorFactory(program=self.non_rf_program, **kwargs)
        if refresh:
            context = get_program_context(self.non_rf_program)
        else:
            context = self.non_rf_context.copy()
        return self.get_serialized_data(context, has_targets=has_targets)[indicator.pk]

    def get_manual_numbered_indicator_data(self, **kwargs):
        has_targets = kwargs.pop('has_targets', False)
        refresh = kwargs.pop('refresh', False)
        indicator = RFIndicatorFactory(program=self.manual_number_program, **kwargs)
        if refresh:
            context = get_program_context(self.manual_number_program)
        else:
            context = self.manual_number_context.copy()
        return self.get_serialized_data(context, has_targets=has_targets)[indicator.pk]

    def get_migrated_indicator_data(self, **kwargs):
        has_targets = kwargs.pop('has_targets', False)
        refresh = kwargs.pop('refresh', False)
        indicator = RFIndicatorFactory(program=self.migrated_program, **kwargs)
        if refresh:
            context = get_program_context(self.migrated_program)
        else:
            context = self.migrated_context.copy()
        return self.get_serialized_data(context, has_targets=has_targets)[indicator.pk]

    def test_non_migrated_long_number(self):
        data = self.get_non_migrated_indicator_data(number="142.5a")
        self.assertEqual(data['number'], "142.5a")
        data = self.get_non_migrated_indicator_data(number="142.5a", old_level="Goal")
        self.assertEqual(data['number'], "Goal 142.5a")
        with lang_context('fr'):
            data = self.get_non_migrated_indicator_data(number="142.5a", old_level="Goal")
            self.assertEqual(data['number'], "But 142.5a")

    def test_non_migrated_long_number_special_chars(self):
        data = self.get_non_migrated_indicator_data(number=u"1.1å")
        self.assertEqual(data['number'], u"1.1å")
        data = self.get_non_migrated_indicator_data(number=u"1.1å", old_level="Output")
        self.assertEqual(data['number'], u"Output 1.1å")
        with lang_context('fr'):
            data = self.get_non_migrated_indicator_data(number=u"1.1å", old_level="Output")
            self.assertEqual(data['number'], u"Extrant 1.1å")

    def test_non_migrated_long_number_number_blank(self):
        data = self.get_non_migrated_indicator_data(number=None)
        self.assertEqual(data['number'], None)
        data = self.get_non_migrated_indicator_data(number=None, old_level="Activity")
        self.assertEqual(data['number'], "Activity")
        with lang_context('fr'):
            data = self.get_non_migrated_indicator_data(number=None, old_level="Activity")
            self.assertEqual(data['number'], "Activité")

    def test_non_migrated_long_number_number_empty(self):
        data = self.get_non_migrated_indicator_data(number="")
        self.assertEqual(data['number'], None)
        data = self.get_non_migrated_indicator_data(number="", old_level="Result")
        self.assertEqual(data['number'], "Result")

    def test_non_migrated_long_number_with_level(self):
        p = RFProgramFactory(migrated=False, tiers=['tier1', 'tier2'],
                             levels=True)
        l = [l for l in p.levels.all() if l.level_depth == 2][0]
        data = self.get_indicator_data(program=p, number="a443a", level=l, level_order=0)
        self.assertEqual(data['number'], "a443a")
        data = self.get_indicator_data(program=p, number="a443a", level=l, level_order=0, old_level="Goal")
        self.assertEqual(data['number'], "Goal a443a")

    def test_migrated_manual_number_long_number(self):
        data = self.get_manual_numbered_indicator_data(number="203893.12")
        self.assertEqual(data['number'], "203893.12")

    def test_migrated_manual_number_long_number_number_blank(self):
        data = self.get_manual_numbered_indicator_data(number=None)
        self.assertEqual(data['number'], None)

    def test_migrated_manual_number_long_number_number_empty(self):
        data = self.get_manual_numbered_indicator_data(number="")
        self.assertEqual(data['number'], None)

    def test_migrated_manual_number_long_number_with_tier(self):
        p = RFProgramFactory(migrated=True, tiers=['tier1', 'tier2'],
                             levels=True, auto_number_indicators=False)
        l = [l for l in p.levels.all() if l.level_depth == 2][0]
        data = self.get_indicator_data(program=p, number="203893.12", level=l, level_order=0)
        self.assertEqual(data['number'], "tier2 203893.12")

    def test_migrated_manual_number_long_number_with_tier_translated(self):
        p = RFProgramFactory(migrated=True, tiers=['Goal', 'Activity'],
                             levels=True, auto_number_indicators=False)
        l = [l for l in p.levels.all() if l.level_depth == 2][0]
        with lang_context('fr'):
            data = self.get_indicator_data(program=p, number="1a", level=l, level_order=0)
        self.assertEqual(data['number'], "Activité 1a")

    def test_migrated_manual_number_long_number_number_blank_with_tier(self):
        p = RFProgramFactory(migrated=True, tiers=['Goal', 'Output'],
                             levels=True, auto_number_indicators=False)
        l = [l for l in p.levels.all() if l.level_depth == 1][0]
        data = self.get_indicator_data(program=p, number=None, level=l, level_order=0)
        self.assertEqual(data['number'], 'Goal')
        del data
        with lang_context('fr'):
            data = self.get_indicator_data(program=p, number=None, level=l, level_order=1)
        self.assertEqual(data['number'], 'But')

    def test_migrated_manual_number_long_number_number_empty_with_tier(self):
        p = RFProgramFactory(migrated=True, tiers=['tier1', 'Outcome'],
                             levels=True, auto_number_indicators=False)
        l = [l for l in p.levels.all() if l.level_depth == 2][0]
        data = self.get_indicator_data(program=p, number="", level=l, level_order=0)
        self.assertEqual(data['number'], 'Outcome')
        del data
        with lang_context('fr'):
            data = self.get_indicator_data(program=p, number="", level=l, level_order=1)
        self.assertEqual(data['number'], 'Résultat')

    def test_migrated_no_level_number(self):
        data = self.get_migrated_indicator_data(level=None)
        self.assertEqual(data['number'], None)

    def test_migrated_has_level_number(self):
        data = self.get_migrated_indicator_data(level=self.migrated_levels[1], level_order=0)
        self.assertEqual(data['number'], "tier2 1a")
        RFIndicatorFactory(program=self.migrated_program, level=self.migrated_levels[0], level_order=0)
        data2 = self.get_migrated_indicator_data(level=self.migrated_levels[0], level_order=1)
        self.assertEqual(data2['number'], "tier1 b")
        RFIndicatorFactory(program=self.migrated_program, level=self.migrated_levels[4], level_order=0)
        RFIndicatorFactory(program=self.migrated_program, level=self.migrated_levels[4], level_order=1)
        data3 = self.get_migrated_indicator_data(level=self.migrated_levels[4], level_order=2)
        self.assertEqual(data3['number'], "Outcome 2.1c")

    def test_migrated_has_translated_level_number(self):
        with lang_context('fr'):
            data = self.get_migrated_indicator_data(refresh=True, level=self.migrated_levels[3])
        self.assertEqual(data['number'], "Résultat 1.1a")

    def test_was_just_created(self):
        data = self.get_migrated_indicator_data()
        self.assertEqual(data['was_just_created'], True)

    def test_was_not_just_created(self):
        data = self.get_non_migrated_indicator_data(
            create_date=timezone.now()-datetime.timedelta(minutes=6)
        )
        self.assertEqual(data['was_just_created'], False)

    def test_kpi_indicator(self):
        data = self.get_migrated_indicator_data(key_performance_indicator=True)
        self.assertEqual(data['is_key_performance_indicator'], True)

    def test_non_kpi_indicator(self):
        data = self.get_non_migrated_indicator_data()
        self.assertEqual(data['is_key_performance_indicator'], False)

    def test_reporting_closed_program_lop_with_results(self):
        data = self.get_manual_numbered_indicator_data(
            target_frequency=Indicator.LOP,
            targets=True,
            results=True,
            has_targets=True
        )
        self.assertEqual(data['is_reporting'], True)

    def test_reporting_closed_program_lop_no_results(self):
        data = self.get_manual_numbered_indicator_data(
            target_frequency=Indicator.LOP,
            targets=True, has_targets=True
        )
        self.assertEqual(data['is_reporting'], False)
        self.assertEqual(data['over_under'], None)

    def test_reporting_open_program_lop_with_results(self):
        data = self.get_non_migrated_indicator_data(
            target_frequency=Indicator.LOP,
            targets=True,
            results=True,
            has_targets=True
        )
        self.assertEqual(data['is_reporting'], False)
        self.assertEqual(data['over_under'], None)

    def test_over_under_program_lop_under_target(self):
        data = self.get_migrated_indicator_data(
            target_frequency=Indicator.LOP,
            targets=200,
            results=150,
            has_targets=True
        )
        self.assertEqual(data['over_under'], -1)

    def test_over_under_program_lop_over_target(self):
        data = self.get_migrated_indicator_data(
            target_frequency=Indicator.LOP, targets=200, results=250, has_targets=True
        )
        self.assertEqual(data['over_under'], 1)

    def test_over_under_program_lop_on_target(self):
        data = self.get_migrated_indicator_data(
            target_frequency=Indicator.LOP, targets=200, results=205, has_targets=True
        )
        self.assertEqual(data['over_under'], 0)

    def test_all_targets_defined(self):
        data = self.get_migrated_indicator_data(
            target_frequency=Indicator.ANNUAL,
            targets=500, has_targets=True
        )
        self.assertEqual(data['has_all_targets_defined'], True)

    def test_all_targets_not_defined(self):
        data = self.get_migrated_indicator_data(
            target_frequency=Indicator.SEMI_ANNUAL,
            targets='incomplete', has_targets=True
        )
        self.assertEqual(data['has_all_targets_defined'], False)

    def test_results_count(self):
        data = self.get_migrated_indicator_data(
            target_frequency=Indicator.SEMI_ANNUAL,
            targets=1000,
            results=1000,
            results__count=2,
            has_targets=True
        )
        self.assertEqual(data['results_count'], 2)
        self.assertEqual(data['has_results'], True)

    def test_results_count_lop(self):
        data = self.get_migrated_indicator_data(
            target_frequency=Indicator.LOP,
            targets=1000,
            results=1000,
            results__count=10,
            has_targets=True
        )
        self.assertEqual(data['results_count'], 10)
        self.assertEqual(data['has_results'], True)

    def test_results_count_zero(self):
        data = self.get_migrated_indicator_data(
            target_frequency=Indicator.SEMI_ANNUAL,
            targets=1000, has_targets=True
        )
        self.assertEqual(data['results_count'], 0)
        self.assertEqual(data['has_results'], False)
        self.assertEqual(data['missing_evidence'], False)

    def test_results_evidence_count(self):
        data = self.get_migrated_indicator_data(
            target_frequency=Indicator.ANNUAL,
            targets=1000,
            results=1000,
            results__count=10,
            results__evidence=True,
            has_targets=True
        )
        self.assertEqual(data['results_with_evidence_count'], 10)
        self.assertEqual(data['missing_evidence'], False)

    def test_results_evidence_count_lower(self):
        data = self.get_migrated_indicator_data(
            target_frequency=Indicator.ANNUAL,
            targets=1000,
            results=1000,
            results__count=10,
            results__evidence=5,
            has_targets=True
        )
        self.assertEqual(data['results_count'], 10)
        self.assertEqual(data['results_with_evidence_count'], 5)
        self.assertEqual(data['missing_evidence'], True)

    def test_most_recent_completed_end_date(self):
        program = RFProgramFactory(
            reporting_period_start=datetime.date(2015, 1, 1),
            reporting_period_end=datetime.date(2024, 1, 1)
        )
        context = get_program_context(program)
        indicator = RFIndicatorFactory(
            program=program, target_frequency=Indicator.ANNUAL, targets=1000
        )
        data = self.get_serialized_data(context, has_targets=True)[indicator.pk]
        expected_date = datetime.date(datetime.date.today().year, 1, 1) - datetime.timedelta(days=1)
        self.assertEqual(data['most_recent_completed_target_end_date'], expected_date.isoformat())


class TestProgramPageOrderingUpdateSerializer(test.TestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.non_rf_program = RFProgramFactory(closed=False, migrated=False)
        cls.non_rf_context = get_program_context(cls.non_rf_program)
        cls.manual_number_program = RFProgramFactory(
            closed=True, migrated=True, auto_number_indicators=False
        )
        cls.manual_number_context = get_program_context(cls.manual_number_program)
        cls.migrated_program = RFProgramFactory(
            migrated=True, auto_number_indicators=True,
            tiers=['tier1', 'tier2', 'Outcome'], levels=[(1,), ((2,),), (((1, 1),),)]
        )
        cls.migrated_context = get_program_context(cls.migrated_program)
        cls.migrated_levels = sorted(
            cls.migrated_program.levels.all(),
            key=lambda l: (l.level_depth, l.customsort)
        )

    def tearDown(self):
        self.non_rf_program.indicator_set.all().delete()
        self.manual_number_program.indicator_set.all().delete()
        self.migrated_program.indicator_set.all().delete()

    def get_serialized_data(self, context):
        program_pk = context['program_pk']
        with self.assertNumQueries(UPDATE_QUERY_COUNT):
            return {
                s_i['pk']: s_i for s_i in
                ProgramPageIndicatorOrderingSerializer.load_for_program(program_pk, context=context).data
            }

    def get_indicator_data(self, **kwargs):
        indicator = RFIndicatorFactory(**kwargs)
        context = get_program_context(indicator.program)
        return self.get_serialized_data(context)[indicator.pk]

    def get_non_migrated_indicator_data(self, **kwargs):
        refresh = kwargs.pop('refresh', False)
        indicator = RFIndicatorFactory(program=self.non_rf_program, **kwargs)
        if refresh:
            context = get_program_context(self.non_rf_program)
        else:
            context = self.non_rf_context.copy()
        return self.get_serialized_data(context)[indicator.pk]

    def get_manual_numbered_indicator_data(self, **kwargs):
        refresh = kwargs.pop('refresh', False)
        indicator = RFIndicatorFactory(program=self.manual_number_program, **kwargs)
        if refresh:
            context = get_program_context(self.manual_number_program)
        else:
            context = self.manual_number_context.copy()
        return self.get_serialized_data(context)[indicator.pk]

    def get_migrated_indicator_data(self, **kwargs):
        refresh = kwargs.pop('refresh', False)
        indicator = RFIndicatorFactory(program=self.migrated_program, **kwargs)
        if refresh:
            context = get_program_context(self.migrated_program)
        else:
            context = self.migrated_context.copy()
        return self.get_serialized_data(context)[indicator.pk]

    def test_non_migrated_long_number(self):
        data = self.get_non_migrated_indicator_data(number="142.5a")
        self.assertEqual(data['number'], "142.5a")

    def test_non_migrated_long_number_special_chars(self):
        data = self.get_non_migrated_indicator_data(number=u"1.1å")
        self.assertEqual(data['number'], u"1.1å")

    def test_non_migrated_long_number_number_blank(self):
        data = self.get_non_migrated_indicator_data(number=None)
        self.assertEqual(data['number'], None)

    def test_non_migrated_long_number_number_empty(self):
        data = self.get_non_migrated_indicator_data(number="")
        self.assertEqual(data['number'], None)

    def test_non_migrated_long_number_with_level(self):
        p = RFProgramFactory(migrated=False, tiers=['tier1', 'tier2'],
                             levels=True)
        l = [l for l in p.levels.all() if l.level_depth == 2][0]
        data = self.get_indicator_data(program=p, number="a443a", level=l, level_order=0)
        self.assertEqual(data['number'], "a443a")

    def test_migrated_manual_number_long_number(self):
        data = self.get_manual_numbered_indicator_data(number="203893.12")
        self.assertEqual(data['number'], "203893.12")

    def test_migrated_manual_number_long_number_number_blank(self):
        data = self.get_manual_numbered_indicator_data(number=None)
        self.assertEqual(data['number'], None)

    def test_migrated_manual_number_long_number_number_empty(self):
        data = self.get_manual_numbered_indicator_data(number="")
        self.assertEqual(data['number'], None)

    def test_migrated_manual_number_long_number_with_tier(self):
        p = RFProgramFactory(migrated=True, tiers=['tier1', 'tier2'],
                             levels=True, auto_number_indicators=False)
        l = [l for l in p.levels.all() if l.level_depth == 2][0]
        data = self.get_indicator_data(program=p, number="203893.12", level=l, level_order=0)
        self.assertEqual(data['number'], "tier2 203893.12")

    def test_migrated_manual_number_long_number_with_tier_translated(self):
        p = RFProgramFactory(migrated=True, tiers=['Goal', 'Activity'],
                             levels=True, auto_number_indicators=False)
        l = [l for l in p.levels.all() if l.level_depth == 2][0]
        with lang_context('fr'):
            data = self.get_indicator_data(program=p, number="1a", level=l, level_order=0)
        self.assertEqual(data['number'], "Activité 1a")

    def test_migrated_manual_number_long_number_number_blank_with_tier(self):
        p = RFProgramFactory(migrated=True, tiers=['Goal', 'Output'],
                             levels=True, auto_number_indicators=False)
        l = [l for l in p.levels.all() if l.level_depth == 1][0]
        data = self.get_indicator_data(program=p, number=None, level=l, level_order=0)
        self.assertEqual(data['number'], 'Goal')
        del data
        with lang_context('fr'):
            data = self.get_indicator_data(program=p, number=None, level=l, level_order=1)
        self.assertEqual(data['number'], 'But')

    def test_migrated_manual_number_long_number_number_empty_with_tier(self):
        p = RFProgramFactory(migrated=True, tiers=['tier1', 'Outcome'],
                             levels=True, auto_number_indicators=False)
        l = [l for l in p.levels.all() if l.level_depth == 2][0]
        data = self.get_indicator_data(program=p, number="", level=l, level_order=0)
        self.assertEqual(data['number'], 'Outcome')
        del data
        with lang_context('fr'):
            data = self.get_indicator_data(program=p, number="", level=l, level_order=1)
        self.assertEqual(data['number'], 'Résultat')

    def test_migrated_no_level_number(self):
        data = self.get_migrated_indicator_data(level=None)
        self.assertEqual(data['number'], None)

    def test_migrated_has_level_number(self):
        data = self.get_migrated_indicator_data(level=self.migrated_levels[1], level_order=0)
        self.assertEqual(data['number'], "tier2 1a")
        RFIndicatorFactory(program=self.migrated_program, level=self.migrated_levels[0], level_order=0)
        data2 = self.get_migrated_indicator_data(level=self.migrated_levels[0], level_order=1)
        self.assertEqual(data2['number'], "tier1 b")
        RFIndicatorFactory(program=self.migrated_program, level=self.migrated_levels[4], level_order=0)
        RFIndicatorFactory(program=self.migrated_program, level=self.migrated_levels[4], level_order=1)
        data3 = self.get_migrated_indicator_data(level=self.migrated_levels[4], level_order=2)
        self.assertEqual(data3['number'], "Outcome 2.1c")

    def test_migrated_has_translated_level_number(self):
        with lang_context('fr'):
            data = self.get_migrated_indicator_data(refresh=True, level=self.migrated_levels[3])
        self.assertEqual(data['number'], "Résultat 1.1a")


class TestProgramPageIndicatorSerializerResultData(test.TestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.program = RFProgramFactory(
            tiers=['tier1', 'tier2', 'Outcome'], levels=[(1,), ((2,),), (((1, 1),),)],
            months=24, closed=False
        )

    def tearDown(self):
        self.program.indicator_set.all().delete()

    def get_serialized_data(self, context, has_targets=False):
        program_pk = context['program_pk']
        query_count = WITH_TARGETS_QUERY_COUNT if has_targets else QUERY_COUNT
        with self.assertNumQueries(query_count):
            return {
                s_i['pk']: s_i for s_i in
                ProgramPageIndicatorSerializer.load_for_program(program_pk, context=context).data
            }

    def get_indicator_data(self, **kwargs):
        has_targets = kwargs.pop('has_targets', False)
        indicator = RFIndicatorFactory(program=self.program, **kwargs)
        context = get_program_context(indicator.program)
        return self.get_serialized_data(context, has_targets=has_targets)[indicator.pk], indicator

    def test_indicator_basic_data(self):
        data, indicator = self.get_indicator_data(
            target_frequency=Indicator.ANNUAL, unit_of_measure_type=Indicator.NUMBER, is_cumulative=False)
        self.assertEqual(data['pk'], indicator.pk)
        self.assertEqual(data['target_frequency'], Indicator.ANNUAL)
        self.assertFalse(data['is_cumulative'])
        self.assertFalse(data['is_percent'])
        data, indicator = self.get_indicator_data(
            target_frequency=Indicator.LOP, unit_of_measure_type=Indicator.NUMBER, is_cumulative=True
        )
        self.assertEqual(data['target_frequency'], Indicator.LOP)
        self.assertTrue(data['is_cumulative'])
        self.assertFalse(data['is_percent'])
        data, indicator = self.get_indicator_data(
            target_frequency=Indicator.EVENT, unit_of_measure_type=Indicator.PERCENTAGE
        )
        self.assertEqual(data['target_frequency'], Indicator.EVENT)
        self.assertTrue(data['is_percent'])

    def test_indicator_lop_data(self):
        reporting_period_start = formats.date_format(self.program.reporting_period_start, 'MEDIUM_DATE_FORMAT')
        data, indicator = self.get_indicator_data(
            target_frequency=Indicator.LOP, targets=500, results=450, has_targets=True
        )
        self.assertEqual(data['lop_target'], 500)
        self.assertEqual(data['lop_actual'], 450)
        self.assertEqual(data['lop_met'], 0.9)
        self.assertEqual(data['lop_target_progress'], None)
        self.assertEqual(data['lop_actual_progress'], None)
        self.assertEqual(data['lop_met_progress'], None)
        self.assertEqual(data['reporting_period'], None)
        data, indicator = self.get_indicator_data(
            target_frequency=Indicator.ANNUAL, targets=12.48, results=None, has_targets=True
        )
        annual_period_end = formats.date_format(indicator.periodictargets.first().end_date, 'MEDIUM_DATE_FORMAT')
        self.assertEqual(data['lop_target'], 12.48)
        self.assertEqual(data['lop_actual'], None)
        self.assertEqual(data['lop_met'], None)
        self.assertEqual(data['lop_target_progress'], 6.24)
        self.assertEqual(data['lop_actual_progress'], None)
        self.assertEqual(data['lop_met_progress'], None)
        self.assertEqual(data['reporting_period'], '{} – {}'.format(reporting_period_start, annual_period_end))
        data, indicator = self.get_indicator_data(
            target_frequency=Indicator.SEMI_ANNUAL, targets=[50, 50, 50, 100],
            results=[40, 50, 150, None], has_targets=True
        )
        semiannual_period_end = formats.date_format(indicator.periodictargets.all()[1].end_date, 'MEDIUM_DATE_FORMAT')
        self.assertEqual(data['lop_target'], 250)
        self.assertEqual(data['lop_actual'], 240)
        self.assertEqual(data['lop_met'], 0.96)
        self.assertEqual(data['lop_target_progress'], 100)
        self.assertEqual(data['lop_actual_progress'], 90)
        self.assertEqual(data['lop_met_progress'], decimal.Decimal('0.9'))
        self.assertEqual(data['reporting_period'], '{} – {}'.format(reporting_period_start, semiannual_period_end))
        data, indicator = self.get_indicator_data(
            target_frequency=Indicator.SEMI_ANNUAL, targets=[50, 50, 50, 100], results=[40, 50, 150, None],
            is_cumulative=True, has_targets=True
        )
        self.assertEqual(data['lop_target'], 100)
        self.assertEqual(data['lop_actual'], 240)
        self.assertEqual(data['lop_met'], 2.4)
        self.assertEqual(data['lop_target_progress'], 50)
        self.assertEqual(data['lop_actual_progress'], 90)
        self.assertEqual(data['lop_met_progress'], decimal.Decimal('1.8'))
        self.assertEqual(data['reporting_period'], '{} – {}'.format(reporting_period_start, semiannual_period_end))
        data, indicator = self.get_indicator_data(
            target_frequency=Indicator.SEMI_ANNUAL, targets=[50, 50, 50, 100], results=[40, 50, 150, None],
            unit_of_measure_type=Indicator.PERCENTAGE, has_targets=True
        )
        self.assertEqual(data['lop_target'], 100)
        self.assertEqual(data['lop_actual'], 150)
        self.assertEqual(data['lop_met'], 1.5)
        self.assertEqual(data['lop_target_progress'], 50)
        self.assertEqual(data['lop_actual_progress'], 50)
        self.assertEqual(data['lop_met_progress'], decimal.Decimal('1'))
        self.assertEqual(data['reporting_period'], '{} – {}'.format(reporting_period_start, semiannual_period_end))

    def test_lop_target_data(self):
        data, indicator = self.get_indicator_data(
            target_frequency=Indicator.LOP, targets=500, results=100, has_targets=True
        )
        self.assertEqual(len(data['no_target_results']), 0)
        result = indicator.result_set.first()
        self.assertEqual(len(data['periodic_targets']), 1)
        target_data = data['periodic_targets'][0]
        self.assertEqual(target_data['period_name'], "Life of Program (LoP) only")
        self.assertIsNone(target_data['date_range'])
        self.assertFalse(target_data['completed'])
        self.assertFalse(target_data['most_recently_completed'])
        self.assertEqual(target_data['target'], 500)
        self.assertEqual(target_data['actual'], 100)
        self.assertEqual(target_data['percent_met'], 0.2)
        self.assertEqual(len(target_data['results']), 1)
        result_data = target_data['results'][0]
        self.assertEqual(result_data['pk'], result.pk)
        self.assertEqual(result_data['date_collected'],
                         formats.date_format(result.date_collected, 'MEDIUM_DATE_FORMAT'))
        self.assertEqual(result_data['achieved'], 100)
        self.assertIsNone(result_data['evidence_url'])
        self.assertIsNone(result_data['record_name'])

    def test_mid_end_target_data(self):
        indicator = RFIndicatorFactory(
            program=self.program, target_frequency=Indicator.MID_END, is_cumulative=True,
            targets=[25, 35.5]
        )
        [mid_target, end_target] = list(indicator.periodictargets.all())
        result1 = ResultFactory(
            program=self.program, indicator=indicator, periodic_target=mid_target,
            achieved=15, date_collected=self.program.reporting_period_start + datetime.timedelta(days=10),
            evidence_url="https://www.example.com/1"
        )
        result2 = ResultFactory(
            program=self.program, indicator=indicator, periodic_target=mid_target,
            achieved=12, date_collected=self.program.reporting_period_start + datetime.timedelta(days=15),
            evidence_url="https://www.example.com/2"
        )
        result3 = ResultFactory(
            program=self.program, indicator=indicator, periodic_target=end_target,
            achieved=8.5, date_collected=self.program.reporting_period_start + datetime.timedelta(days=100),
            evidence_url="https://www.example.com/3"
        )
        context = get_program_context(indicator.program)
        data = self.get_serialized_data(context, has_targets=True)[indicator.pk]
        self.assertTrue(data['is_cumulative'])
        self.assertEqual(len(data['periodic_targets']), 2)
        self.assertEqual(len(data['no_target_results']), 0)
        mid_target_data = data['periodic_targets'][0]
        self.assertEqual(mid_target_data['period_name'], "Midline")
        self.assertIsNone(mid_target_data['date_range'])
        self.assertTrue(mid_target_data['completed'])
        self.assertFalse(mid_target_data['most_recently_completed'])
        self.assertEqual(mid_target_data['target'], 25)
        self.assertEqual(mid_target_data['actual'], 27)
        self.assertEqual(mid_target_data['percent_met'], 1.08)
        self.assertEqual(len(mid_target_data['results']), 2)
        self.assertEqual(mid_target_data['results'][0]['pk'], result1.pk)
        self.assertEqual(
            mid_target_data['results'][0]['date_collected'],
            formats.date_format(self.program.reporting_period_start + datetime.timedelta(days=10),
                                "MEDIUM_DATE_FORMAT")
        )
        self.assertEqual(mid_target_data['results'][0]['achieved'], 15)
        self.assertEqual(mid_target_data['results'][0]['evidence_url'], "https://www.example.com/1")
        self.assertIsNone(mid_target_data['results'][0]['record_name'])
        self.assertEqual(mid_target_data['results'][1]['pk'], result2.pk)
        self.assertEqual(
            mid_target_data['results'][1]['date_collected'],
            formats.date_format(self.program.reporting_period_start + datetime.timedelta(days=15),
                                "MEDIUM_DATE_FORMAT")
        )
        self.assertEqual(mid_target_data['results'][1]['achieved'], 12)
        self.assertEqual(mid_target_data['results'][1]['evidence_url'], "https://www.example.com/2")
        self.assertIsNone(mid_target_data['results'][1]['record_name'])
        end_target_data = data['periodic_targets'][1]
        self.assertEqual(end_target_data['period_name'], "Endline")
        self.assertIsNone(end_target_data['date_range'])
        self.assertTrue(end_target_data['completed'])
        self.assertFalse(end_target_data['most_recently_completed'])
        self.assertEqual(end_target_data['target'], 35.5)
        self.assertEqual(end_target_data['actual'], 35.5)
        self.assertEqual(end_target_data['percent_met'], 1)
        self.assertEqual(len(end_target_data['results']), 1)
        self.assertEqual(end_target_data['results'][0]['pk'], result3.pk)
        self.assertEqual(
            end_target_data['results'][0]['date_collected'],
            formats.date_format(self.program.reporting_period_start + datetime.timedelta(days=100),
                                "MEDIUM_DATE_FORMAT")
        )
        self.assertEqual(end_target_data['results'][0]['achieved'], 8.5)
        self.assertEqual(end_target_data['results'][0]['evidence_url'], "https://www.example.com/3")
        self.assertIsNone(end_target_data['results'][0]['record_name'])

    def test_annual_target_data(self):
        dates = [self.program.reporting_period_start + datetime.timedelta(days=d) for d in [20, 40, 460, 480]]
        indicator = RFIndicatorFactory(
            program=self.program, target_frequency=Indicator.ANNUAL, unit_of_measure_type=Indicator.PERCENTAGE,
            targets=[50, 87.5]
        )
        [first_year, second_year] = list(indicator.periodictargets.all())
        result1 = ResultFactory(
            program=self.program, indicator=indicator, periodic_target=first_year,
            achieved=44, date_collected=dates[1]
        )
        result2 = ResultFactory(
            program=self.program, indicator=indicator, periodic_target=first_year,
            achieved=23, date_collected=dates[0]
        )
        result3 = ResultFactory(
            program=self.program, indicator=indicator, periodic_target=second_year,
            achieved=75, date_collected=dates[2]
        )
        result4 = ResultFactory(
            program=self.program, indicator=indicator, periodic_target=second_year,
            achieved=105, date_collected=dates[3]
        )
        context = get_program_context(self.program)
        year_2 = datetime.date(self.program.reporting_period_start.year + 1,
                               self.program.reporting_period_start.month,
                               self.program.reporting_period_start.day)
        data = self.get_serialized_data(context, has_targets=True)[indicator.pk]
        self.assertTrue(data['is_percent'])
        self.assertEqual(len(data['no_target_results']), 0)
        target_expected = {
            'period_name': ("Year 1", "Year 2"),
            'date_range': (
                '{} – {}'.format(
                    formats.date_format(self.program.reporting_period_start, "MEDIUM_DATE_FORMAT"),
                    formats.date_format(year_2 - datetime.timedelta(days=1), "MEDIUM_DATE_FORMAT")),
                '{} – {}'.format(
                    formats.date_format(year_2, "MEDIUM_DATE_FORMAT"),
                    formats.date_format(self.program.reporting_period_end, "MEDIUM_DATE_FORMAT"))
            ),
            'completed': (True, False),
            'most_recently_completed': (True, False),
            'target': (50, 87.5),
            'actual': (44, 105),
            'percent_met': (0.88, 1.2),
            'results': (
                [{'pk': result2.pk, 'date_collected': formats.date_format(dates[0], "MEDIUM_DATE_FORMAT"),
                  'achieved': 23, 'evidence_url': None, 'record_name': None},
                 {'pk': result1.pk, 'date_collected': formats.date_format(dates[1], "MEDIUM_DATE_FORMAT"),
                  'achieved': 44, 'evidence_url': None, 'record_name': None},],
                [{'pk': result3.pk, 'date_collected': formats.date_format(dates[2], "MEDIUM_DATE_FORMAT"),
                  'achieved': 75, 'evidence_url': None, 'record_name': None},
                 {'pk': result4.pk, 'date_collected': formats.date_format(dates[3], "MEDIUM_DATE_FORMAT"),
                  'achieved': 105, 'evidence_url': None, 'record_name': None},]
            )
        }
        for c, target_data in enumerate(data['periodic_targets']):
            for k, v in target_expected.items():
                self.assertEqual(target_data[k], v[c],
                                 "key {} got {} expected {} period {}".format(k, target_data[k], v[c], c))

    def test_orphaned_result_data(self):
        indicator = RFIndicatorFactory(
            program=self.program, target_frequency=Indicator.SEMI_ANNUAL, targets=250
        )
        result1 = ResultFactory(
            program=self.program, indicator=indicator, periodic_target=indicator.periodictargets.first(),
            achieved=120.5, date_collected=self.program.reporting_period_start, evidence_url="https://www.example.com"
        )
        indicator.periodictargets.all().delete()
        indicator.target_frequency = None
        indicator.save()
        context = get_program_context(self.program)
        data = self.get_serialized_data(context, has_targets=False)[indicator.pk]
        self.assertEqual(len(data['no_target_results']), 1)
        expected_result_data = {
            'pk': result1.pk,
            'date_collected': formats.date_format(self.program.reporting_period_start, "MEDIUM_DATE_FORMAT"),
            'achieved': 120.5, 'evidence_url': "https://www.example.com", 'record_name': None
        }
        for k, v in expected_result_data.items():
            self.assertEqual(data['no_target_results'][0][k], v,
                             "for {} expected {} got {}".format(k, v, data['no_target_results'][0][k]))
