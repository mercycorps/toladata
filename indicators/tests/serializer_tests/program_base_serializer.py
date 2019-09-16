# -*- coding: utf-8 -*-
"""Tests for the Base Program Serializer, corresponding to js/models/programs/baseProgram

    and Program with reporting period Serializer, corresponding to js/models/programs/withReportingPeriod
"""

import datetime
from workflow.serializers_new import ProgramBaseSerializer, ProgramReportingPeriodSerializer
from workflow.models import Program
from factories.workflow_models import RFProgramFactory
from django import test
from django.utils import translation


class TestProgramBaseSerializer(test.TestCase):
    def get_program_data(self, **kwargs):
        return ProgramBaseSerializer(
            Program.rf_aware_objects.filter(pk=RFProgramFactory(**kwargs).pk), many=True
        ).data[0]

    def test_pk(self):
        data = self.get_program_data(pk=400)
        self.assertEqual(data['pk'], 400)

    def test_name(self):
        data = self.get_program_data(name="Test name")
        self.assertEqual(data['name'], "Test name")

    def test_long_name(self):
        name = "Long "*50
        data = self.get_program_data(name=name)
        self.assertEqual(data['name'], name)

    def test_name_special_chars(self):
        name = u"Spéciål Charß name"
        data = self.get_program_data(name=name)
        self.assertEqual(data['name'], name)

    def test_results_framework_non_migrated(self):
        data = self.get_program_data(migrated=False)
        self.assertEqual(data['results_framework'], False)

    def test_results_framework_migrated(self):
        data = self.get_program_data(migrated=True)
        self.assertEqual(data['results_framework'], True)

    def test_results_framework_post_satsuma(self):
        data = self.get_program_data()
        self.assertEqual(data['results_framework'], True)

    def test_result_chain_filter_label_non_migrated(self):
        data = self.get_program_data(migrated=False)
        self.assertEqual(data['by_result_chain'], None)

    def test_result_chain_filter_label_no_tiers(self):
        data = self.get_program_data(tiers=["Tier1"])
        self.assertEqual(data['by_result_chain'], None)

    def test_result_chain_filter_label(self):
        data = self.get_program_data(tiers=["Tier1", "Tier2"])
        self.assertEqual(data['by_result_chain'], "by Tier2 chain")

    def test_result_chain_filter_label_special_chars(self):
        chain_label = u"Spéciål Charß Label"
        data = self.get_program_data(tiers=["Tier1", chain_label])
        self.assertEqual(data['by_result_chain'], u"by {} chain".format(chain_label))

    def test_result_chain_filter_label_translated(self):
        translation.activate('fr')
        data = self.get_program_data(tiers=["Tier1", "Outcome"])
        self.assertEqual(data['by_result_chain'], u"par chaîne Résultat")
        translation.activate('en')


class TestProgramReportingPeriodSerializer(test.TestCase):
    def get_program_data(self, **kwargs):
        return ProgramReportingPeriodSerializer(
            Program.rf_aware_objects.filter(pk=RFProgramFactory(**kwargs).pk), many=True
        ).data[0]

    def test_reporting_period_start(self):
        data = self.get_program_data(reporting_period_start=datetime.date(2016, 1, 1))
        self.assertEqual(data['reporting_period_start_iso'], "2016-01-01")
        self.assertTrue(data['has_started'])

    def test_reporting_period_start_future(self):
        data = self.get_program_data(reporting_period_start=datetime.date(2022, 12, 30))
        self.assertEqual(data['reporting_period_start_iso'], "2022-12-30")
        self.assertFalse(data['has_started'])

    def test_reporting_period_start_none(self):
        data = self.get_program_data(reporting_period_start=None)
        self.assertEqual(data['reporting_period_start_iso'], None)
        self.assertFalse(data['has_started'])

    def test_reporting_period_end(self):
        data = self.get_program_data(reporting_period_end=datetime.date(2016, 1, 1))
        self.assertEqual(data['reporting_period_end_iso'], "2016-01-01")

    def test_reporting_period_end_future(self):
        data = self.get_program_data(reporting_period_end=datetime.date(2022, 12, 30))
        self.assertEqual(data['reporting_period_end_iso'], "2022-12-30")

    def test_reporting_period_end_none(self):
        data = self.get_program_data(reporting_period_end=None)
        self.assertEqual(data['reporting_period_end_iso'], None)

    def test_percent_complete_all(self):
        data = self.get_program_data()
        self.assertEqual(data['percent_complete'], 100)

    def test_percent_complete_none(self):
        data = self.get_program_data(
            reporting_period_start=datetime.date(2024, 1, 1),
            reporting_period_end=datetime.date(2028, 12, 31),
        )
        self.assertEqual(data['percent_complete'], 0)

    def test_percent_complete_half(self):
        today = datetime.date.today()
        start = datetime.date(today.year - 10, today.month, 1)
        end = datetime.date(today.year + 10, today.month + 1, 1) - datetime.timedelta(days=1)
        data = self.get_program_data(
            reporting_period_start=start,
            reporting_period_end=end
        )
        self.assertEqual(data['percent_complete'], 50)
