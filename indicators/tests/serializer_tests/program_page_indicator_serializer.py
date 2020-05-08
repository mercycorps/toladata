# -*- coding: utf-8 -*-
"""Tests for the Program Page Indicator Serializer

    corresponding to js/pages/program_page/models/ProgramPageIndicator
"""

import datetime
from factories.workflow_models import RFProgramFactory
from factories.indicators_models import RFIndicatorFactory
from indicators.serializers_new import ProgramPageIndicatorSerializer
from indicators.models import Indicator

from django import test
from django.utils import translation, timezone


class TestProgramPageIndicatorSerializer(test.TestCase):
    def get_indicator_data(self, **kwargs):
        return ProgramPageIndicatorSerializer(
            Indicator.program_page_objects.filter(pk=RFIndicatorFactory(**kwargs).pk), many=True
        ).data[0]

    def test_non_migrated_long_number(self):
        p = RFProgramFactory(migrated=False)
        data = self.get_indicator_data(program=p, number="142.5a")
        self.assertEqual(data['number'], "142.5a")

    def test_non_migrated_long_number_special_chars(self):
        p = RFProgramFactory(migrated=False)
        data = self.get_indicator_data(program=p, number=u"1.1å")
        self.assertEqual(data['number'], u"1.1å")

    def test_non_migrated_long_number_number_blank(self):
        p = RFProgramFactory(migrated=False)
        data = self.get_indicator_data(program=p, number=None)
        self.assertEqual(data['number'], None)

    def test_non_migrated_long_number_number_empty(self):
        p = RFProgramFactory(migrated=False)
        data = self.get_indicator_data(program=p, number="")
        self.assertEqual(data['number'], None)

    def test_migrated_manual_number_long_number(self):
        p = RFProgramFactory(migrated=True, auto_number_indicators=False)
        data = self.get_indicator_data(program=p, number="203893.12")
        self.assertEqual(data['number'], "203893.12")

    def test_migrated_manual_number_long_number_number_blank(self):
        p = RFProgramFactory(migrated=True, auto_number_indicators=False)
        data = self.get_indicator_data(program=p, number=None)
        self.assertEqual(data['number'], None)

    def test_migrated_manual_number_long_number_number_empty(self):
        p = RFProgramFactory(migrated=True, auto_number_indicators=False)
        data = self.get_indicator_data(program=p, number="")
        self.assertEqual(data['number'], None)

    def test_migrated_manual_number_long_number_with_tier(self):
        p = RFProgramFactory(migrated=True, tiers=['tier1', 'tier2'],
                             levels=True, auto_number_indicators=False)
        l = [l for l in p.levels.all() if l.level_depth == 2][0]
        data = self.get_indicator_data(program=p, number="203893.12", level=l, level_order=0)
        self.assertEqual(data['number'], "tier2 203893.12")

    def test_migrated_manual_number_long_number_number_blank_with_tier(self):
        p = RFProgramFactory(migrated=True, tiers=['tier1', 'tier2'],
                             levels=True, auto_number_indicators=False)
        l = [l for l in p.levels.all() if l.level_depth == 2][0]
        data = self.get_indicator_data(program=p, number=None, level=l, level_order=0)
        self.assertEqual(data['number'], 'tier2')

    def test_migrated_manual_number_long_number_number_empty_with_tier(self):
        p = RFProgramFactory(migrated=True, tiers=['tier1', 'tier2'],
                             levels=True, auto_number_indicators=False)
        l = [l for l in p.levels.all() if l.level_depth == 2][0]
        data = self.get_indicator_data(program=p, number="", level=l, level_order=0)
        self.assertEqual(data['number'], 'tier2')

    def test_migrated_no_level_number(self):
        p = RFProgramFactory(tiers=['tier1', 'tier2'], levels=True)
        data = self.get_indicator_data(program=p, level=None)
        self.assertEqual(data['number'], None)

    def test_migrated_has_level_number(self):
        p = RFProgramFactory(tiers=['tier1', 'tier2'], levels=True)
        l = [l for l in p.levels.all() if l.level_depth == 2][0]
        data = self.get_indicator_data(program=p, level=l, level_order=0)
        self.assertEqual(data['number'], "tier2 1a")
        l2 = [l for l in p.levels.all() if l.level_depth == 1][0]
        RFIndicatorFactory(program=p, level=l2, level_order=0)
        data2 = self.get_indicator_data(program=p, level=l2, level_order=1)
        self.assertEqual(data2['number'], "tier1 b")

    def test_migrated_has_level_number_lower_tier(self):
        p = RFProgramFactory(tiers=['tier1', 'tier2', 'tier3'], levels=2)
        l1 = [l for l in p.levels.all() if l.level_depth == 2][0]
        level = p.levels.filter(parent=l1, customsort=2).first()
        RFIndicatorFactory(program=p, level=level, level_order=0)
        RFIndicatorFactory(program=p, level=level, level_order=1)
        data = self.get_indicator_data(program=p, level=level, level_order=2)
        self.assertEqual(data['number'], "tier3 1.2c")

    def test_migrated_has_level_number_special_chars(self):
        special_chars = u"Tiér Speciål Chars"
        p = RFProgramFactory(tiers=['tier1', special_chars], levels=True)
        l = [l for l in p.levels.all() if l.level_depth == 2][0]
        data = self.get_indicator_data(program=p, level=l, level_order=0)
        self.assertEqual(data['number'], u"{} 1a".format(special_chars))

    def test_migrated_has_translated_level_number(self):
        p = RFProgramFactory(tiers=['tier1', 'Outcome'], levels=True)
        l = [l for l in p.levels.all() if l.level_depth == 2][0]
        translation.activate('fr')
        data = self.get_indicator_data(program=p, level=l, level_order=0)
        translation.activate('en')
        self.assertEqual(data['number'], u"Résultat 1a")

    def test_was_just_created(self):
        data = self.get_indicator_data()
        self.assertEqual(data['was_just_created'], True)

    def test_was_not_just_created(self):
        data = self.get_indicator_data(
            create_date=timezone.now()-datetime.timedelta(minutes=6)
        )
        self.assertEqual(data['was_just_created'], False)

    def test_kpi_indicator(self):
        data = self.get_indicator_data(key_performance_indicator=True)
        self.assertEqual(data['is_key_performance_indicator'], True)

    def test_non_kpi_indicator(self):
        data = self.get_indicator_data()
        self.assertEqual(data['is_key_performance_indicator'], False)

    def test_reporting_closed_program_lop_with_results(self):
        data = self.get_indicator_data(
            program=RFProgramFactory(),
            target_frequency=Indicator.LOP,
            targets=True,
            results=True
        )
        self.assertEqual(data['is_reporting'], True)

    def test_reporting_closed_program_lop_no_results(self):
        data = self.get_indicator_data(
            program=RFProgramFactory(),
            target_frequency=Indicator.LOP,
            targets=True
        )
        self.assertEqual(data['is_reporting'], False)
        self.assertEqual(data['over_under'], None)

    def test_reporting_open_program_lop_with_results(self):
        data = self.get_indicator_data(
            program=RFProgramFactory(closed=False),
            target_frequency=Indicator.LOP,
            targets=True,
            results=True
        )
        self.assertEqual(data['is_reporting'], False)
        self.assertEqual(data['over_under'], None)

    def test_over_under_program_lop_under_target(self):
        data = self.get_indicator_data(
            program=RFProgramFactory(),
            target_frequency=Indicator.LOP,
            targets=200,
            results=150
        )
        self.assertEqual(data['over_under'], -1)

    def test_over_under_program_lop_over_target(self):
        data = self.get_indicator_data(
            program=RFProgramFactory(),
            target_frequency=Indicator.LOP,
            targets=200,
            results=250
        )
        self.assertEqual(data['over_under'], 1)

    def test_over_under_program_lop_on_target(self):
        data = self.get_indicator_data(
            program=RFProgramFactory(),
            target_frequency=Indicator.LOP,
            targets=200,
            results=205
        )
        self.assertEqual(data['over_under'], 0)

    def test_all_targets_defined(self):
        data = self.get_indicator_data(
            program=RFProgramFactory(),
            target_frequency=Indicator.ANNUAL,
            targets=500
        )
        self.assertEqual(data['has_all_targets_defined'], True)

    def test_all_targets_not_defined(self):
        data = self.get_indicator_data(
            program=RFProgramFactory(),
            target_frequency=Indicator.SEMI_ANNUAL,
            targets='incomplete'
        )
        self.assertEqual(data['has_all_targets_defined'], False)

    def test_results_count(self):
        data = self.get_indicator_data(
            program=RFProgramFactory(),
            target_frequency=Indicator.SEMI_ANNUAL,
            targets=1000,
            results=1000,
            results__count=2
        )
        self.assertEqual(data['results_count'], 2)
        self.assertEqual(data['has_results'], True)

    def test_results_count_lop(self):
        data = self.get_indicator_data(
            program=RFProgramFactory(),
            target_frequency=Indicator.LOP,
            targets=1000,
            results=1000,
            results__count=10
        )
        self.assertEqual(data['results_count'], 10)
        self.assertEqual(data['has_results'], True)

    def test_results_count_zero(self):
        data = self.get_indicator_data(
            program=RFProgramFactory(),
            target_frequency=Indicator.SEMI_ANNUAL,
            targets=1000
        )
        self.assertEqual(data['results_count'], 0)
        self.assertEqual(data['has_results'], False)
        self.assertEqual(data['missing_evidence'], False)

    def test_results_evidence_count(self):
        data = self.get_indicator_data(
            program=RFProgramFactory(),
            target_frequency=Indicator.ANNUAL,
            targets=1000,
            results=1000,
            results__count=10,
            results__evidence=True
        )
        self.assertEqual(data['results_with_evidence_count'], 10)
        self.assertEqual(data['missing_evidence'], False)

    def test_results_evidence_count_lower(self):
        data = self.get_indicator_data(
            program=RFProgramFactory(),
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
        data = self.get_indicator_data(
            program=RFProgramFactory(
                reporting_period_start=datetime.date(2015, 1, 1),
                reporting_period_end=datetime.date(2024, 1, 1)
            ),
            target_frequency=Indicator.ANNUAL,
            targets=1000
        )
        expected_date = datetime.date(datetime.date.today().year, 1, 1) - datetime.timedelta(days=1)
        self.assertEqual(data['most_recent_completed_target_end_date'], expected_date.isoformat())
