""" Functional tests for the iptt report generation view

in the 'targetperiods' view (all indicators on report are same frequency):
these classes test the baseline, LOP target/actual/met values for various indicator frequencies, with one or more
indicators
"""

import utility
from factories.workflow_models import ProgramFactory
from factories.indicators_models import IndicatorFactory
from indicators.models import Indicator


class TestIPTTReportResponseCountsLOP(utility.IPTTTVADataResponseBase):
    """Test that the right number of indicators were returned, ignoring wrong frequency/program indicators"""
    indicator_frequency = Indicator.LOP

    def test_one_indicator_returned(self):
        self.get_indicator_by_frequency(self.indicator_frequency)
        response = self.get_response(self.indicator_frequency)
        self.assertEqual(len(response['indicators']), 1,
                         self.format_assert_message(
                             "One {freq} indicator added, expected 1 in return, got {num}".format(
                                 freq=self.indicator_frequency, num=len(response['indicators']))))

    def test_two_indicators_returned(self):
        self.get_indicator_by_frequency(self.indicator_frequency)
        self.get_indicator_by_frequency(self.indicator_frequency)
        response = self.get_response(self.indicator_frequency)
        self.assertEqual(len(response['indicators']), 2,
                         self.format_assert_message(
                             "Two {freq} indicators added, expected 2 in return, got {num}".format(
                                 freq=self.indicator_frequency, num=len(response['indicators']))))

    def test_out_of_program_indicators_ignored(self):
        other_program = ProgramFactory()
        # add other indicators (out of program):
        IndicatorFactory(
            target_frequency=self.indicator_frequency,
            program=other_program)
        IndicatorFactory(
            target_frequency=self.indicator_frequency,
            program=other_program)
        self.get_indicator_by_frequency(self.indicator_frequency)
        response = self.get_response(self.indicator_frequency)
        self.assertEqual(len(response['indicators']), 1,
                         self.format_assert_message(
                             "One {freq} indicator added + 2 in alt program,,expected 1 in return, got {num}".format(
                                 freq=self.indicator_frequency, num=len(response['indicators']))))

    def test_other_frequency_indicators_ignored(self):
        self.get_indicator_by_frequency(self.indicator_frequency)
        new_frequency = Indicator.LOP if self.indicator_frequency != Indicator.LOP else Indicator.ANNUAL
        self.get_indicator_by_frequency(new_frequency)
        self.get_indicator_by_frequency(new_frequency)
        response = self.get_response(self.indicator_frequency)
        self.assertEqual(len(response['indicators']), 1,
                         self.format_assert_message(
                             "One {freq} indicator added, expected 1 in return, got {num}".format(
                                 freq=self.indicator_frequency, num=len(response['indicators']))))

class TestIPTTReportResponseCountsMidEnd(TestIPTTReportResponseCountsLOP):
    indicator_frequency = Indicator.MID_END

class TestIPTTReportResponseCountsAnnual(TestIPTTReportResponseCountsLOP):
    indicator_frequency = Indicator.ANNUAL

class TestIPTTReportResponseCountsMonthly(TestIPTTReportResponseCountsLOP):
    indicator_frequency = Indicator.MONTHLY
