# -*- coding: utf-8 -*-
"""Tests for the Program Page Indicator Serializer

    corresponding to js/pages/program_page/models/ProgramPageIndicator
"""

import datetime
from factories.workflow_models import RFProgramFactory
from factories.indicators_models import RFIndicatorFactory
from indicators.serializers_new import (
    TierBaseSerializer,
    LevelBaseSerializer,
    ProgramPageIndicatorSerializer,
    ProgramPageIndicatorOrderingSerializer
)
from indicators.models import Indicator
from tola.test.utils import lang_context
from django import test
from django.utils import timezone

QUERY_COUNT = 1
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

    def get_serialized_data(self, context):
        program_pk = context['program_pk']
        with self.assertNumQueries(QUERY_COUNT):
            return {
                s_i['pk']: s_i for s_i in
                ProgramPageIndicatorSerializer.load_for_program(program_pk, context=context).data
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
            results=True
        )
        self.assertEqual(data['is_reporting'], True)

    def test_reporting_closed_program_lop_no_results(self):
        data = self.get_manual_numbered_indicator_data(
            target_frequency=Indicator.LOP,
            targets=True
        )
        self.assertEqual(data['is_reporting'], False)
        self.assertEqual(data['over_under'], None)

    def test_reporting_open_program_lop_with_results(self):
        data = self.get_non_migrated_indicator_data(
            target_frequency=Indicator.LOP,
            targets=True,
            results=True
        )
        self.assertEqual(data['is_reporting'], False)
        self.assertEqual(data['over_under'], None)

    def test_over_under_program_lop_under_target(self):
        data = self.get_migrated_indicator_data(
            target_frequency=Indicator.LOP,
            targets=200,
            results=150
        )
        self.assertEqual(data['over_under'], -1)

    def test_over_under_program_lop_over_target(self):
        data = self.get_migrated_indicator_data(target_frequency=Indicator.LOP, targets=200, results=250)
        self.assertEqual(data['over_under'], 1)

    def test_over_under_program_lop_on_target(self):
        data = self.get_migrated_indicator_data(target_frequency=Indicator.LOP, targets=200, results=205)
        self.assertEqual(data['over_under'], 0)

    def test_all_targets_defined(self):
        data = self.get_migrated_indicator_data(
            target_frequency=Indicator.ANNUAL,
            targets=500
        )
        self.assertEqual(data['has_all_targets_defined'], True)

    def test_all_targets_not_defined(self):
        data = self.get_migrated_indicator_data(
            target_frequency=Indicator.SEMI_ANNUAL,
            targets='incomplete'
        )
        self.assertEqual(data['has_all_targets_defined'], False)

    def test_results_count(self):
        data = self.get_migrated_indicator_data(
            target_frequency=Indicator.SEMI_ANNUAL,
            targets=1000,
            results=1000,
            results__count=2
        )
        self.assertEqual(data['results_count'], 2)
        self.assertEqual(data['has_results'], True)

    def test_results_count_lop(self):
        data = self.get_migrated_indicator_data(
            target_frequency=Indicator.LOP,
            targets=1000,
            results=1000,
            results__count=10
        )
        self.assertEqual(data['results_count'], 10)
        self.assertEqual(data['has_results'], True)

    def test_results_count_zero(self):
        data = self.get_migrated_indicator_data(
            target_frequency=Indicator.SEMI_ANNUAL,
            targets=1000
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
            results__evidence=True
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
        data = self.get_serialized_data(context)[indicator.pk]
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
