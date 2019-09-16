# pylint: disable=R0901
"""Tests for the LOP/baseline/LOP progress for the iptt_report_data endpoint in various situations"""

import utility
from indicators.models import Indicator

class SingleIndicatorLOPValuesIPTTResponse(utility.IPTTTVADataResponseBase):
    def setUp(self):
        super(SingleIndicatorLOPValuesIPTTResponse, self).setUp()
        self.indicator = self.get_indicator(baseline=10, lop_target=99)

    def get_response_indicator(self):
        response = super(SingleIndicatorLOPValuesIPTTResponse, self).get_response()
        self.assertEqual(len(response['indicators']), 1,
                         self.format_assert_message(
                             "single indicator test should return one indicator response, got {0}".format(
                                 len(response['indicators']))))
        return response['indicators'][0]

    def test_indicator_baseline(self):
        indicator = self.get_response_indicator()
        self.assertEqual(int(float(indicator['baseline'])), self.indicator.baseline,
                         self.format_assert_message("expected baseline {0} for indicator, got {1}".format(
                             self.indicator.baseline, indicator['baseline'])))

    def test_indicator_lop_target(self):
        indicator = self.get_response_indicator()
        self.assertEqual(int(float(indicator['lopTarget'])), self.indicator.lop_target,
                         self.format_assert_message("expected lop target {0} for indicator, got {1}".format(
                             self.indicator.lop_target, indicator['lopTarget'])))

    def test_indicator_lop_sum_single_data_point(self):
        self.add_result(50)
        indicator = self.get_response_indicator()
        self.assertEqual(int(float(indicator['lopActual'])), 50,
                         self.format_assert_message("expected lop sum 50 for indicator, got {0}".format(
                             indicator['lopActual'])))

    def test_indicator_lop_sum_multiple_data_points(self):
        expected_sum = self.add_multiple_results()
        indicator = self.get_response_indicator()
        self.assertEqual(float(indicator['lopActual']), expected_sum,
                         self.format_assert_message(
                             "Expected lop sum {0} for indicator, got {1}".format(
                                 expected_sum, indicator['lopActual'])))

    def test_indicator_lop_pct_single_data_point(self):
        self.add_result(49.5)
        indicator = self.get_response_indicator()
        self.assertEqual(indicator['lopMet'], 0.5,
                         self.format_assert_message("Expected 50% met (49.5/99), got {0}".format(
                             indicator['lopMet'])))

    def test_indicator_lop_pct_multiple_data_points(self):
        self.add_hundred_percent_results()
        indicator = self.get_response_indicator()
        self.assertEqual(indicator['lopMet'], 1,
                         self.format_assert_message("Expected 100% met (99/99), got {0}".format(
                             indicator['lopMet'])))

class TestSingleLOPNumNCIndicatorIPTTResponse(SingleIndicatorLOPValuesIPTTResponse,
                                              utility.Numeric,
                                              utility.LOPIndicator):
    indicator_frequency = Indicator.LOP


class TestSingleMidendNumNCIndicatorIPTTResponse(SingleIndicatorLOPValuesIPTTResponse,
                                                 utility.Numeric,
                                                 utility.MidendIndicator):
    indicator_frequency = Indicator.MID_END


class TestSingleSemiAnnualNumNCIndicatorIPTTResponse(SingleIndicatorLOPValuesIPTTResponse,
                                                     utility.Numeric,
                                                     utility.TimeawareIndicator):
    indicator_frequency = Indicator.SEMI_ANNUAL

class TestSingleQuarterlyNumNCIndicatorIPTTResponse(SingleIndicatorLOPValuesIPTTResponse,
                                                    utility.Numeric,
                                                    utility.TimeawareIndicator):
    indicator_frequency = Indicator.QUARTERLY

class TestSingleLOPNumCumIndicatorIPTTResponse(SingleIndicatorLOPValuesIPTTResponse,
                                               utility.Numeric,
                                               utility.LOPIndicator):
    indicator_frequency = Indicator.LOP
    indicator_kwargs = {'is_cumulative': True}

class TestSingleSemiAnnualNumCumIndicatorIPTTResponse(SingleIndicatorLOPValuesIPTTResponse,
                                                      utility.Numeric,
                                                      utility.TimeawareIndicator):
    indicator_frequency = Indicator.SEMI_ANNUAL
    indicator_kwargs = {'is_cumulative': True}

class TestSingleLOPPercentIndicatorIPTTResponse(SingleIndicatorLOPValuesIPTTResponse,
                                                utility.Percent,
                                                utility.LOPIndicator):
    indicator_frequency = Indicator.LOP

class TestSingleMidEndPercentIndicatorIPTTResponse(SingleIndicatorLOPValuesIPTTResponse,
                                                   utility.Percent,
                                                   utility.MidendIndicator):
    indicator_frequency = Indicator.MID_END

class TestSingleTriannualPercentIndicatorIPTTResponse(SingleIndicatorLOPValuesIPTTResponse,
                                                      utility.Percent,
                                                      utility.TimeawareIndicator):
    indicator_frequency = Indicator.TRI_ANNUAL


class MultipleIndicatorsIPTTResponse(utility.IPTTTVADataResponseBase):
    indic1_baseline = 85
    indic1_target = 200
    indic2_baseline = 33
    indic2_target = 1000
    expected = None
    expected_met = None

    def setUp(self):
        super(MultipleIndicatorsIPTTResponse, self).setUp()
        self.indicators = [
            self.get_indicator(baseline=self.indic1_baseline, lop_target=self.indic1_target, number='1'),
            self.get_indicator(baseline=self.indic2_baseline, lop_target=self.indic2_target, number='2')
            ]

    def get_response_indicator(self):
        response = super(MultipleIndicatorsIPTTResponse, self).get_response()
        self.assertEqual(len(response['indicators']), 2,
                         self.format_assert_message(
                             "double indicator test should return two indicator response, got {0}".format(
                                 len(response['indicators']))))
        return response['indicators']

    def test_indicator_baselines(self):
        for c, indicator in enumerate(self.get_response_indicator()):
            self.assertEqual(int(float(indicator['baseline'])), self.indicators[c].baseline,
                             self.format_assert_message("expected baseline {0} for indicator {1}, got {2}".format(
                                 self.indicators[c].baseline, c, indicator['baseline'])))

    def test_indicator_lop_target(self):
        for c, indicator in enumerate(self.get_response_indicator()):
            self.assertEqual(int(float(indicator['lopTarget'])), self.indicators[c].lop_target,
                             self.format_assert_message("expected lop target {0} for indicator {1}, got {2}".format(
                                 self.indicators[c].lop_target, c, indicator['lopTarget'])))

    def test_indicator_sums_and_percents_single_data_points(self):
        self.add_result(40, indicator=self.indicators[0])
        self.add_result(100, indicator=self.indicators[1])
        expected = [40, 100]
        expected_met = [0.2, 0.1]
        for c, indicator in enumerate(self.get_response_indicator()):
            self.assertEqual(int(float(indicator['lopActual'])), expected[c],
                             self.format_assert_message("expected lop actual {0} for indicator {1}, got {2}".format(
                                 expected[c], c, indicator['lopActual']
                             )))
            self.assertEqual(indicator['lopMet'], expected_met[c],
                             self.format_assert_message("expectged lop pct {0} for indicator {1}, got {2}".format(
                                 expected_met[c], c, indicator['lopMet']
                             )))

    def test_indicator_sums_and_percents_multiple_data_points(self):
        expected = [180, 1400] if self.expected is None else self.expected
        expected_met = [0.9, 1.4] if self.expected_met is None else self.expected_met
        values = [
            [90, 40, 50],
            [100, 100, 100, 50, 50, 50, 50, 425, 475]
        ]
        for value in values[0]:
            self.add_result(value, indicator=self.indicators[0])
        for value in values[1]:
            self.add_result(value, indicator=self.indicators[1])
        for c, indicator in enumerate(self.get_response_indicator()):
            self.assertEqual(int(float(indicator['lopActual'])), expected[c],
                             self.format_assert_message("expected lop actual {0} for indicator {1}, got {2}".format(
                                 expected[c], c, indicator['lopActual']
                             )))
            self.assertEqual(indicator['lopMet'], expected_met[c],
                             self.format_assert_message("expectged lop pct {0} for indicator {1}, got {2}".format(
                                 expected_met[c], c, indicator['lopMet']
                             )))

class TestMultipleLOPIndicatorsIPTTResponse(MultipleIndicatorsIPTTResponse,
                                            utility.Numeric,
                                            utility.LOPIndicator):
    indicator_frequency = Indicator.LOP

class TestMultipleQuarterlyIndicatorsIPTTResponse(MultipleIndicatorsIPTTResponse,
                                                  utility.Numeric,
                                                  utility.TimeawareIndicator):
    indicator_frequency = Indicator.QUARTERLY


class TestMultipleCumulativeIndicatorsIPTTResponse(MultipleIndicatorsIPTTResponse,
                                                   utility.Numeric,
                                                   utility.MidendIndicator):
    indicator_frequency = Indicator.MID_END
    indicator_kwargs = {'is_cumulative': True}

class TestMultiplePercentLOPIndicatorsIPTTResponse(MultipleIndicatorsIPTTResponse,
                                                   utility.Percent,
                                                   utility.LOPIndicator):
    indicator_frequency = Indicator.LOP
    expected = [50, 475]
    expected_met = [0.25, 0.475]

class TestMultiplePercentAnnualIndicatorsIPTTResponse(MultipleIndicatorsIPTTResponse,
                                                      utility.Percent,
                                                      utility.TimeawareIndicator):
    indicator_frequency = Indicator.ANNUAL
    expected = [50, 475]
    expected_met = [0.25, 0.475]
