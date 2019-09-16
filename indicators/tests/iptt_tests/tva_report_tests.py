""" Functional tests for the iptt report generation view

in the 'targetperiods' view (all indicators on report are same frequency):
these classes test monthly/annual/mid-end indicators generated report ranges, values, sums, and percentages
"""

import datetime
import utility
from factories import indicators_models as i_factories
from indicators.models import Indicator

class TVAReportValues(utility.IPTTTVADataResponseBase):
    indicators = []

    def setUp(self):
        super(TVAReportValues, self).setUp()
        for kwargs, target_values, result_values in zip(self.indicator_kwarg_sets, self.target_sets,
                                                        self.results_sets):
            indicator = self.get_indicator(**kwargs)
            targets = self.get_targets(indicator, target_values)
            self.add_results(indicator, targets, result_values)

    def get_indicator(self, **kwargs):
        these_kwargs = self.indicator_kwargs.copy()
        these_kwargs.update(kwargs)
        indicator = self.get_indicator_by_frequency(self.indicator_frequency, **these_kwargs)
        self.indicators.append(indicator)
        return indicator

    def get_targets(self, indicator, target_values):
        targets = []
        for period, target_value in zip(self.program.get_periods_for_frequency(self.indicator_frequency),
                                        target_values):
            targets.append(
                i_factories.PeriodicTargetFactory(
                    start_date=period['start'],
                    end_date=period['end'],
                    customsort=period['customsort'],
                    target=target_value,
                    indicator=indicator
                )
            )
        return targets

    def add_results(self, indicator, targets, result_values):
        data = []
        for target, result_value_set in zip(targets, result_values):
            collect_date = target.start_date
            for c, result_value in enumerate(result_value_set):
                data.append(
                    i_factories.ResultFactory(
                        achieved=result_value,
                        periodic_target=target,
                        indicator=indicator,
                        date_collected=collect_date + datetime.timedelta(days=c)
                    )
                )
        return data

    def test_targets_report_correctly(self):
        response = self.get_response()
        self.assertEqual(len(response['indicators']), len(self.indicator_kwarg_sets))
        for indicator, target_set in zip(response['indicators'], self.target_sets):
            for period_count, target in enumerate(target_set):
                self.assertEqual(
                    float(indicator['reportData']['tva'][str(self.indicator_frequency)][period_count]['target']),
                    target)

    def test_actuals_report_correctly(self):
        response = self.get_response()
        self.assertEqual(len(response['indicators']), len(self.indicator_kwarg_sets))
        for indicator, expected_results in zip(response['indicators'], self.expected_results):
            for period_count, expected_result in enumerate(expected_results):
                if expected_result:
                    self.assertEqual(
                        float(indicator['reportData']['tva'][str(self.indicator_frequency)][period_count]['value']),
                        expected_result, "indicator {0} period_count {1}".format(indicator, period_count)
                        )
                else:
                    self.assertIsNone(
                        indicator['reportData']['tva'][str(self.indicator_frequency)][period_count]['value'])


class TestMidEndTVAReportValues(TVAReportValues):
    indicator_frequency = Indicator.MID_END
    indicator_kwargs = {'baseline': 100}
    indicator_kwarg_sets = [
        {
            'lop_target': 450,
            'is_cumulative': False,
            'unit_of_measure_type': Indicator.NUMBER
        },
        {
            'lop_target': 120,
            'is_cumulative': False,
            'unit_of_measure_type': Indicator.NUMBER
        },
        {
            'lop_target': 100,
            'is_cumulative': True,
            'unit_of_measure_type': Indicator.NUMBER
        },
        {
            'lop_target': 130,
            'unit_of_measure_type': Indicator.PERCENTAGE
        },
    ]
    target_sets = [
        (200, 250),
        (100, 120),
        (50, 100),
        (80, 130)
    ]
    results_sets = [
        [(200,), (150,)],
        [tuple(), (10, 10, 10, 10, 10)],
        [(15,), (40, )],
        [(14,), (80,)]
    ]
    expected_results = [
        [200, 150],
        [None, 50],
        [15, 55],
        [14, 80]
    ]

class TestSemiannualTVAReportValues(TVAReportValues):
    indicator_frequency = Indicator.SEMI_ANNUAL
    indicator_kwargs = {'baseline': 32}
    indicator_kwarg_sets = [
        {
            'lop_target': 20,
            'is_cumulative': False,
            'unit_of_measure_type': Indicator.NUMBER
        },
        {
            'lop_target': 18,
            'is_cumulative': False,
            'unit_of_measure_type': Indicator.NUMBER
        },
        {
            'lop_target': 50,
            'is_cumulative': True,
            'unit_of_measure_type': Indicator.NUMBER
        },
        {
            'lop_target': 40,
            'unit_of_measure_type': Indicator.PERCENTAGE
        },
    ]
    target_sets = [
        (10, 14, 3, 8, 5),
        (1, 1, 3, 4, 5),
        (40, 1, 1, 1, 7),
        (10, 10, 10, 5, 5)
    ]
    results_sets = [
        [(4,), (12,), (3,), (5,), (12,)],
        [(2, 3), (4, 1, 1, 1, 1), tuple(), (1, 5), tuple()],
        [tuple(), (4, 1), tuple(), tuple(), (45,)],
        [(14,), tuple(), (35, 12), (14,), (50,)]
    ]
    expected_results = [
        [4, 12, 3, 5, 12],
        [5, 8, None, 6, None],
        [None, 5, None, None, 50],
        [14, None, 12, 14, 50]
    ]