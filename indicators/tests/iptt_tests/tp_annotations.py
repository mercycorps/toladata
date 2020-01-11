import unittest
from django import test

from factories import (
    indicators_models as i_factories,
    workflow_models as w_factories
)

from indicators.queries import IPTTIndicator
from indicators.models import Indicator

from indicators.tests.iptt_tests.scenarios import IPTTReportProgram


unittest.skip("re-implementing")
class TestLopActuals(test.TestCase):
    def setUp(self):
        self.iptt_program = IPTTReportProgram()

    def test_no_results(self):
        self.iptt_program.add_indicators_with_no_results()
        report_data = self.iptt_program.get_tp_report()
        self.assertEqual(len(report_data), 7)
        for indicator_report_data in report_data:
            self.assertEqual(indicator_report_data['lop_actual'], None)
            self.assertIn('disaggregated_report_data', indicator_report_data)
            self.assertEqual(len(indicator_report_data['disaggregated_report_data']), 2)
            for disaggregation in self.iptt_program.disaggregations:
                self.assertIn("{}".format(disaggregation.pk), indicator_report_data['disaggregated_report_data'])
                disaggregation_report_data = indicator_report_data['disaggregated_report_data']["{}".format(disaggregation.pk)]
                self.assertEqual(disaggregation_report_data['lop_actual'], None)