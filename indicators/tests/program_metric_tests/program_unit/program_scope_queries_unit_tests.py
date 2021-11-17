"""Unittests for Program Scope rollups (for Home Page)

  3.2. What percentage of indicators?
  4. Which indicators are ABOVE the 15% variance range?
  4.1. How many indicators?
  4.2. What percentage of indicators?
  5. Which indicators are BELOW the 15% variance range?
  5.1. How many indicators?
  5.2. What percentage of indicators?
"""

import datetime
from indicators.models import Indicator, PeriodicTarget
from indicators.queries import ProgramWithMetrics
from factories import (
    workflow_models as w_factories,
    indicators_models as i_factories
    )
from django import test


class TestProgramReportingCounts(test.TransactionTestCase):
    def setUp(self):
        today = datetime.date.today()
        start_date = datetime.date(today.year-2, today.month, 1)
        end_date = datetime.date(today.year-1, today.month, 1) - datetime.timedelta(days=1)
        self.program = w_factories.ProgramFactory(
            reporting_period_start=start_date,
            reporting_period_end=end_date
        )
        self.indicators = []
        self.data = []
        self.targets = []
        self.indicators.extend(self.get_on_target_indicators())
        self.indicators.extend(self.get_undertarget_indicators())
        self.indicators.extend(self.get_overtarget_indicators())
        self.indicators.extend(self.get_nonreporting_indicators())
        with self.assertNumQueries(2):
            self.reporting_program = ProgramWithMetrics.home_page.with_annotations('scope').get(pk=self.program.id)

    def tearDown(self):
        for datum in self.data:
            datum.delete()
        for target in self.targets:
            target.delete()
        for indicator in self.indicators:
            indicator.delete()
        self.program.delete()

    def get_base_indicator(self):
        return i_factories.IndicatorFactory(
            program=self.program
        )

    def get_base_data(self, indicator, target=None):
        data = i_factories.ResultFactory(
            indicator=indicator,
            periodic_target=target,
            date_collected=self.program.reporting_period_start + datetime.timedelta(days=10)
        )
        return data

    def get_on_target_indicators(self):
        # lop indicator on target to lop target value
        lop_indicator = self.get_base_indicator()
        lop_indicator.target_frequency = Indicator.LOP
        lop_indicator.lop_target = 10000
        lop_indicator.is_cumulative = Indicator.NON_CUMULATIVE
        lop_indicator.unit_of_measure_type = Indicator.NUMBER
        lop_indicator.save()
        lop_pt = i_factories.PeriodicTargetFactory(
            indicator=lop_indicator,
            target=lop_indicator.lop_target,
            start_date=lop_indicator.program.reporting_period_start,
            end_date=lop_indicator.program.reporting_period_end
        )
        lop_data = self.get_base_data(lop_indicator)
        lop_data.achieved = 10000
        lop_data.periodic_target = lop_pt
        lop_data.save()
        self.data.append(lop_data)
        # semi annual indicator with target and valid data
        time_indicator = self.get_base_indicator()
        time_indicator.target_frequency = Indicator.SEMI_ANNUAL
        time_indicator.is_cumulative = Indicator.CUMULATIVE
        time_indicator.unit_of_measure_type = Indicator.NUMBER
        time_indicator.save()
        start_date = self.program.reporting_period_start
        mid_date = datetime.date(
            start_date.year + 1 if start_date.month > 6 else start_date.year,
            start_date.month - 6 if start_date.month > 6 else start_date.month + 6,
            start_date.day)
        time_target_1 = i_factories.PeriodicTargetFactory(
            indicator=time_indicator,
            target=400,
            start_date=start_date,
            end_date=mid_date - datetime.timedelta(days=1)
        )
        time_target_2 = i_factories.PeriodicTargetFactory(
            indicator=time_indicator,
            target=600,
            start_date=mid_date,
            end_date=self.program.reporting_period_end
        )
        self.targets.extend([time_target_1, time_target_2])
        data_1 = i_factories.ResultFactory(
            indicator=time_indicator,
            periodic_target=time_target_1,
            date_collected=time_target_1.start_date + datetime.timedelta(days=2),
            achieved=200
        )
        data_2 = i_factories.ResultFactory(
            indicator=time_indicator,
            periodic_target=time_target_2,
            date_collected=time_target_2.start_date + datetime.timedelta(days=2),
            achieved=400
        )
        self.data.extend([data_1, data_2])
        return [lop_indicator, time_indicator]

    def get_undertarget_indicators(self):
        # event indicator (percent) with less than 85% of the target % hit
        event_indicator = self.get_base_indicator()
        event_indicator.target_frequency = Indicator.EVENT
        event_indicator.is_cumulative = Indicator.NON_CUMULATIVE
        event_indicator.unit_of_measure_type = Indicator.PERCENTAGE
        event_indicator.save()
        event_target = i_factories.PeriodicTargetFactory(
            indicator=event_indicator,
            target=75,
            customsort=0,
            period="event 1"
        )
        self.targets.append(event_target)
        event_data = self.get_base_data(indicator=event_indicator, target=event_target)
        event_data.achieved = 60
        event_data.save()
        self.data.append(event_data)

        non_summing_event_indicator = self.get_base_indicator()
        non_summing_event_indicator.target_frequency = Indicator.EVENT
        non_summing_event_indicator.is_cumulative = Indicator.NON_SUMMING_CUMULATIVE
        non_summing_event_indicator.unit_of_measure_type = Indicator.NUMBER
        non_summing_event_indicator.save()
        event_target_1 = i_factories.PeriodicTargetFactory(
            indicator=non_summing_event_indicator,
            target=75,
            customsort=0,
            period="event 1"
        )
        event_target_2 = i_factories.PeriodicTargetFactory(
            indicator=non_summing_event_indicator,
            target=85,
            customsort=1,
            period="event 2"
        )
        self.targets.extend([event_target_1, event_target_2])
        event_result_1 = self.get_base_data(indicator=non_summing_event_indicator, target=event_target_1)
        event_result_1.achieved = 60
        event_result_1.save()
        event_result_2 = self.get_base_data(indicator=non_summing_event_indicator, target=event_target_1)
        event_result_2.achieved = 30
        event_result_2.save()
        event_result_3 = self.get_base_data(indicator=non_summing_event_indicator, target=event_target_2)
        event_result_3.achieved = 20
        event_result_3.save()
        event_result_4 = self.get_base_data(indicator=non_summing_event_indicator, target=event_target_2)
        event_result_4.achieved = 40
        event_result_4.save()
        self.data.extend([event_result_1, event_result_2, event_result_3, event_result_4])

        return [event_indicator, non_summing_event_indicator]

    def get_overtarget_indicators(self):
        # lop indicator with 120/100 data
        lop_indicator = self.get_base_indicator()
        lop_indicator.target_frequency = Indicator.LOP
        lop_indicator.is_cumulative = Indicator.NON_CUMULATIVE
        lop_indicator.lop_target = 100
        lop_indicator.save()
        lop_pt = i_factories.PeriodicTargetFactory(
            indicator=lop_indicator,
            target=lop_indicator.lop_target,
            start_date=lop_indicator.program.reporting_period_start,
            end_date=lop_indicator.program.reporting_period_end
        )
        lop_data = self.get_base_data(lop_indicator)
        lop_data.achieved = 125
        lop_data.periodic_target = lop_pt
        lop_data.save()
        self.data.append(lop_data)

        # negative direction of change so under data should show as over target
        neg_indicator = self.get_base_indicator()
        neg_indicator.target_frequency = Indicator.LOP
        neg_indicator.direction_of_change = Indicator.DIRECTION_OF_CHANGE_NEGATIVE
        neg_indicator.lop_target = 800
        neg_indicator.save()
        neg_pt = i_factories.PeriodicTargetFactory(
            indicator=neg_indicator,
            target=neg_indicator.lop_target,
            start_date=neg_indicator.program.reporting_period_start,
            end_date=neg_indicator.program.reporting_period_end
        )
        neg_data = self.get_base_data(neg_indicator)
        neg_data.achieved = 600
        neg_data.periodic_target = neg_pt
        neg_data.save()
        self.data.append(neg_data)

        # mid end indicator _cumulative_ should check against end target only
        midend_indicator = self.get_base_indicator()
        midend_indicator.target_frequency = Indicator.MID_END
        midend_indicator.is_cumulative = Indicator.CUMULATIVE
        midend_indicator.save()
        mid_target = i_factories.PeriodicTargetFactory(
            indicator=midend_indicator,
            period=PeriodicTarget.MIDLINE,
            customsort=0,
            target=800
        )
        end_target = i_factories.PeriodicTargetFactory(
            indicator=midend_indicator,
            period=PeriodicTarget.ENDLINE,
            customsort=1,
            target=500
        )
        self.targets.extend([mid_target, end_target])
        mid_data_1 = self.get_base_data(midend_indicator, mid_target)
        mid_data_1.achieved = 200
        mid_data_1.save()
        mid_data_2 = self.get_base_data(midend_indicator, mid_target)
        mid_data_2.achieved = 200
        mid_data_2.save()
        mid_data_3 = self.get_base_data(midend_indicator, end_target)
        mid_data_3.achieved = 250
        mid_data_3.save()
        mid_data_4 = self.get_base_data(midend_indicator, end_target)
        mid_data_4.achieved = 250
        mid_data_4.save()
        self.data.extend([mid_data_1, mid_data_2, mid_data_3, mid_data_4])
        return [lop_indicator, neg_indicator, midend_indicator]

    def get_nonreporting_indicators(self):
        event_indicator = self.get_base_indicator()
        event_indicator.target_frequency = Indicator.EVENT
        event_indicator.save()
        event_target = i_factories.PeriodicTargetFactory(
            indicator=event_indicator,
            target=400,
            customsort=0,
            period="event 1"
        )
        self.targets.append(event_target)
        return [event_indicator]

    def test_percentages(self):
        with self.assertNumQueries(0):
            percentages = self.reporting_program.scope_counts
            self.assertEqual(
                percentages['low'], 2,
                "expected 1 undertarget for 2/7, got {0}".format(percentages['low'])
            )
            self.assertEqual(
                percentages['on_scope'], 2,
                "expected 2 ontarget for 2/7, got {0}".format(percentages['on_scope'])
            )
            self.assertEqual(
                percentages['high'], 3,
                "expected 3 overtarget for 3/7, got {0}".format(percentages['high'])
            )

    def test_queries(self):
        expected = {
            'low': 2,
            'on_scope': 2,
            'high': 3,
            'nonreporting_count': 1,
            'indicator_count': 8
        }
        with self.assertNumQueries(2):
            program = ProgramWithMetrics.home_page.with_annotations(
                'scope', 'targets', 'results', 'evidence'
            ).get(pk=self.program.id)
            scope_counts = program.scope_counts
            metrics = program.metrics
        for key, expected_value in expected.items():
            with self.assertNumQueries(0):
                self.assertEqual(
                    expected_value, scope_counts[key],
                    "expected {0} to be {1}, but got {2} (counts: {3} and metrics {4})".format(
                        key, expected_value, scope_counts[key], scope_counts, metrics
                    )
                )
        self.assertIn('results_count', metrics.keys())


class TestTargetsActualsOverUnderCorrect(test.TestCase):
    def setUp(self):
        self.program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2016, 10, 1),
            reporting_period_end=datetime.date(2017, 9, 30)
        )
        self.indicator = i_factories.IndicatorFactory(
            program=self.program
        )
        self.targets = []
        self.data = []

    def tearDown(self):
        for datum in self.data:
            datum.delete()
        for target in self.targets:
            target.delete()
        self.indicator.delete()
        self.program.delete()

    def test_midend_target_sums_midend_with_both_data(self):
        self.indicator.target_frequency = Indicator.MID_END
        self.indicator.save()
        mid_target = i_factories.PeriodicTargetFactory(
            indicator=self.indicator,
            target=500,
            period=PeriodicTarget.MIDLINE,
            customsort=0
        )
        end_target = i_factories.PeriodicTargetFactory(
            indicator=self.indicator,
            target=800,
            period=PeriodicTarget.ENDLINE,
            customsort=1
        )
        self.targets.extend([mid_target, end_target])
        mid_data = i_factories.ResultFactory(
            indicator=self.indicator,
            periodic_target=mid_target,
            achieved=350,
            date_collected=self.program.reporting_period_start + datetime.timedelta(days=1)
        )
        end_data = i_factories.ResultFactory(
            indicator=self.indicator,
            periodic_target=end_target,
            achieved=950,
            date_collected=self.program.reporting_period_start + datetime.timedelta(days=10)
        )
        self.data.extend([mid_data, end_data])
        program = ProgramWithMetrics.home_page.with_annotations('scope').get(pk=self.program.id)
        self.assertEqual(
            program.scope_counts['on_scope'], 1,
            "should show overunder as 0 (in range), got {0}".format(program.scope_counts)
        )
        self.indicator.is_cumulative = Indicator.CUMULATIVE
        self.indicator.save()
        program = ProgramWithMetrics.home_page.with_annotations('scope').get(pk=self.program.id)
        # both have data, set to cumulative, so should show latest (endline) target:
        self.assertEqual(
            program.scope_counts['high'], 1,
            "should show overunder as 1 (over range), got {0}".format(program.scope_counts)
        )
        self.indicator.direction_of_change = Indicator.DIRECTION_OF_CHANGE_NEGATIVE
        self.indicator.save()
        program = ProgramWithMetrics.home_page.with_annotations('scope').get(pk=self.program.id)
        self.assertEqual(
            program.scope_counts['low'], 1,
            "should show overunder as -1 (under range - negative DOC), got {0}".format(program.scope_counts)
        )

    def test_midend_doesnt_sum_if_no_endline_data(self):
        self.indicator.target_frequency = Indicator.MID_END
        self.indicator.save()
        mid_target = i_factories.PeriodicTargetFactory(
            indicator=self.indicator,
            target=500,
            period=PeriodicTarget.MIDLINE,
            customsort=0
        )
        end_target = i_factories.PeriodicTargetFactory(
            indicator=self.indicator,
            target=800,
            period=PeriodicTarget.ENDLINE,
            customsort=1
        )
        self.targets.extend([mid_target, end_target])
        mid_data = i_factories.ResultFactory(
            indicator=self.indicator,
            periodic_target=mid_target,
            achieved=350,
            date_collected=self.program.reporting_period_start + datetime.timedelta(days=1)
        )
        self.data.append(mid_data)
        program = ProgramWithMetrics.home_page.with_annotations('scope').get(pk=self.program.id)
        self.assertEqual(
            program.scope_counts['low'], 1,
            "should show under (350/500), got {0}".format(program.scope_counts)
        )
        self.indicator.direction_of_change = Indicator.DIRECTION_OF_CHANGE_NEGATIVE
        self.indicator.save()
        program = ProgramWithMetrics.home_page.with_annotations('scope').get(pk=self.program.id)
        self.assertEqual(
            program.scope_counts['high'], 1,
            "should show over (350/500), got {0}".format(program.scope_counts)
        )
