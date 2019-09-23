import unittest
import datetime
from django import test
from django.conf import settings
from django.db import models
from factories import (
    workflow_models as w_factories,
    indicators_models as i_factories
)
from indicators.models import LevelTier, Level
from workflow.models import Program
from workflow.serializers import LogframeProgramSerializer


class TestTransactions(test.TestCase):
    @classmethod
    def setUpTestData(cls):
        program = w_factories.ProgramFactory(
            funding_status="funded",
            name="Test program name",
            reporting_period_start=datetime.date(2015, 1, 1),
            reporting_period_end=datetime.date(2017, 12, 31),
            _using_results_framework=Program.MIGRATED,
            auto_number_indicators=True
        )
        i_factories.LevelTierFactory(
            program=program,
            tier_depth=1,
            name="Test Tier 1"
        )
        i_factories.LevelTierFactory(
            program=program,
            tier_depth=2,
            name="Test Tier 2"
        )
        level = i_factories.LevelFactory(
            program=program,
            name="Test Output Level",
            customsort=1,
            parent=i_factories.LevelFactory(
                name="Test Goal Level",
                program=program,
                customsort=1,
                parent=None,
            ),
            assumptions=', '.join(['assuming']*10)
        )
        indicators = [
            i_factories.IndicatorFactory(
                pk=21,
                program=program,
                level=level,
                level_order=0,
                means_of_verification=None,
                number="1.23a"
            ),
            i_factories.IndicatorFactory(
                pk=22,
                program=program,
                level=level,
                level_order=1,
                means_of_verification="some means here",
                number="2.444ab"
            ),
            i_factories.IndicatorFactory(
                pk=23,
                program=program,
                level=None,
                level_order=1,
                means_of_verification=', '.join(["some means here"]*10),
                number="4.444asdf"
            )
        ]
        cls.program = program
        cls.level = level
        cls.indicators = indicators


    def test_values(self):
        serialized = LogframeProgramSerializer.load(pk=self.program.pk).data
        self.assertEqual(serialized['name'], "Test program name")
        self.assertEqual(serialized['levels'][0]['display_name'], "Test Tier 1: Test Goal Level")
        self.assertEqual(len(serialized['levels'][0]['indicators']), 0)
        self.assertEqual(len(serialized['levels'][0]['child_levels']), 1)
        self.assertEqual(len(serialized['levels'][1]['indicators']), 2)
        self.assertEqual(len(serialized['unassigned_indicators']), 1)
        self.assertEqual(serialized['rf_chain_sort_label'], "by Test Tier 2 chain")

