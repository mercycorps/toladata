""" Tests of the periodic target summaries available at result view summing target values
and determining if periodic targets' periods are complete

Indicator should have the following attributes:
 - lop_actual_sum
 - lop_target_sum (#)
 - lop_met_real (#)
 - is_complete (boolean)
 - annotated_targets: PeriodicTargets with the following attributes:
    - achieved (#)
    - target (#)
    - percent_met (#)
    - is_complete (boolean)
"""

import datetime
from factories import (
    workflow_models as w_factories,
    indicators_models as i_factories
)
from indicators.models import Indicator
from indicators.queries import ResultsIndicator, MetricsIndicator
from django import test

def get_open_program():
    return w_factories.ProgramFactory(
        reporting_period_start=datetime.date(2018, 1, 1),
        reporting_period_end=datetime.date(2021, 12, 31)
    )

def get_annual_indicator(program, lop_target, is_cumulative):
    return i_factories.IndicatorFactory(
        program=program,
        target_frequency=Indicator.ANNUAL,
        unit_of_measure_type=Indicator.NUMBER,
        is_cumulative=is_cumulative,
        lop_target=lop_target
    )

def get_annual_targets(indicator, target_values):
    start_date = indicator.program.reporting_period_start
    targets = []
    for c, value in enumerate(target_values):
        targets.append(i_factories.PeriodicTargetFactory(
            indicator=indicator,
            start_date=datetime.date(start_date.year + c, 1, 1),
            end_date=datetime.date(start_date.year + c, 12, 31),
            target=value
        ))
    return targets

def add_results_for_targets(targets, values):
    results = []
    for c, value in enumerate(values):
        results.append(i_factories.ResultFactory(
            indicator=targets[c].indicator,
            periodic_target=targets[c],
            date_collected=targets[c].start_date,
            achieved=value
        ))
    return results

def get_next_date_yearly(_, date):
    return datetime.date(date.year + 1, date.month, 1)

def get_next_date_monthly(_, date):
    if date.month > 11:
        return datetime.date(date.year + 1, date.month - 11, 1)
    return datetime.date(date.year, date.month + 1, 1)


class TestAnnualNoncumulativeNumeric(test.TestCase):
    is_cumulative = False
    lop_target = 1500
    calculated_lop_target = 1200
    progress_lop_target = 300
    lop_actual = 520
    lop_percent_met = 0.43 # - the new (based on caluclated_target) version
    # lop_percent_met = 0.35 - the old (based on lop_target) version
    lop_actual_progress = 170
    lop_percent_met_progress = 0.57
    target_values = [100, 200, 400, 500]
    result_values = [50, 120, 350]
    expected_results_values = [50, 120, 350, None]
    expected_percent_mets = [0.5, 0.6, 0.88, None]
    complete = [True, True, False, False, False]

    def setUp(self):
        program = get_open_program()
        indicator = get_annual_indicator(program, self.lop_target, self.is_cumulative)
        targets = get_annual_targets(indicator, self.target_values)
        results = add_results_for_targets(targets, self.result_values)
        self.results_indicator = ResultsIndicator.results_view.get(pk=indicator.pk)
        self.metrics_indicator = MetricsIndicator.objects.with_annotations('scope').get(pk=indicator.pk)

    def test_lop_targets(self):
        # lop_target is set by indicator setup field (arbitrary, non-calculated, being deprecated):
        self.assertEqual(self.results_indicator.lop_target, self.lop_target)
        # lop_target_calculated is the sum of all targets entered for the program for noncumulative number
        self.assertEqual(self.results_indicator.lop_target_calculated, self.calculated_lop_target)
        # lop_target_active is currently the lop_target field (this alias is to assist in deprecating):
        self.assertEqual(self.results_indicator.lop_target_active, self.results_indicator.lop_target_calculated)
        # lop_target_progress is for metrics only, sum of targets for ACTIVE target periods
        # (active target period = completed for time-aware, with-data for event/mid-end, lop_target_active for lop)
        self.assertEqual(self.metrics_indicator.lop_target_progress, self.progress_lop_target)

    def test_lop_actuals(self):
        # lop_actual is sum of all results for the entire program:
        self.assertEqual(self.results_indicator.lop_actual, self.lop_actual)
        # lop_actual_progress is for metrics only, sum of achieved values in ACTIVE target periods:
        self.assertEqual(self.metrics_indicator.lop_actual_progress, self.lop_actual_progress)

    def test_lop_percent_met(self):
        # lop_percent_met is the sum of all results divided by the calculated lop_target
        self.assertEqual(round(self.results_indicator.lop_percent_met, 2), self.lop_percent_met)
        # lop_percent_met_progress is the sum of all results in active targets divided by the sum of all active
        # targets:
        self.assertEqual(round(self.metrics_indicator.lop_percent_met_progress, 2), self.lop_percent_met_progress,
                         "actual progress {0} and target progress {1}".format(self.metrics_indicator.lop_actual_progress, self.metrics_indicator.lop_target_progress))

    def test_annotated_target_targets(self):
        # target should always match exactly what was entered for that target:
        for target, expected in zip(self.results_indicator.annotated_targets, self.target_values):
            self.assertEqual(target.target, expected)

    def test_annotated_target_actuals(self):
        for expected, target in zip(self.expected_results_values, self.results_indicator.annotated_targets):
            self.assertEqual(target.actual, expected,
                             "expected {0} got {1} for target starting {2}".format(
                                expected, target.actual, target.start_date))

    def test_annotated_target_percent_mets(self):
        for expected, target in zip(self.expected_percent_mets, self.results_indicator.annotated_targets):
            if expected is None:
                self.assertIsNone(target.percent_met)
            else:
                self.assertEqual(round(target.percent_met, 2), expected)

    def test_annotated_target_is_complete(self):
        for target, expected in zip(self.results_indicator.annotated_targets, self.complete):
            self.assertEqual(target.is_complete, expected)


class TestAnnualCumulativeNumeric(TestAnnualNoncumulativeNumeric):
    is_cumulative = True
    lop_target = 200
    calculated_lop_target = 90
    progress_lop_target = 20
    lop_actual = 78
    #lop_percent_met = 0.39
    lop_percent_met = 0.87 # new version based on calculated lop target
    lop_actual_progress = 33
    lop_percent_met_progress = 1.65
    target_values = [10, 20, 50, 90]
    result_values = [8, 25, 45]
    expected_results_values = [8, 33, 78, None]
    expected_percent_mets = [0.8, 1.65, 1.56, None]
    complete = [True, True, False, False, False]


class TestMidEndPercent(test.TestCase):
    lop_target = 60
    calculated_lop_target = 65
    progress_lop_target = 80
    lop_actual = 70
    lop_percent_met = 1.08 # new version based on calculated lop target
    # lop_percent_met = 1.17
    lop_actual_progress = 70
    lop_percent_met_progress = 0.88
    target_values = [80, 65]
    expected_results_values = [70, None]
    complete = [True, False]
    expected_percent_mets = [0.88, None]

    def setUp(self):
        program = get_open_program()
        indicator = i_factories.IndicatorFactory(
            program=program,
            target_frequency=Indicator.MID_END,
            unit_of_measure_type=Indicator.PERCENTAGE,
            lop_target=60
        )
        targets = [
            i_factories.PeriodicTargetFactory(
                indicator=indicator,
                customsort=0,
                start_date=None,
                end_date=None,
                target=80
            ),
            i_factories.PeriodicTargetFactory(
                indicator=indicator,
                customsort=1,
                start_date=None,
                end_date=None,
                target=65
            )
        ]
        results = [
            i_factories.ResultFactory(
                indicator=indicator,
                periodic_target=targets[0],
                date_collected=datetime.date(2018, 1, 1),
                achieved=75
            ),
            i_factories.ResultFactory(
                indicator=indicator,
                periodic_target=targets[0],
                date_collected=datetime.date(2018, 2, 1),
                achieved=70
            )
        ]
        self.results_indicator = ResultsIndicator.results_view.get(pk=indicator.pk)
        self.metrics_indicator = MetricsIndicator.objects.with_annotations('scope').get(pk=indicator.pk)

    def test_lop_targets(self):
        # lop_target is set by indicator setup field (arbitrary, non-calculated, being deprecated):
        self.assertEqual(self.results_indicator.lop_target, self.lop_target)
        # lop_target_calculated is the sum of all targets entered for the program for noncumulative number
        self.assertEqual(self.results_indicator.lop_target_calculated, self.calculated_lop_target)
        # lop_target_active is currently the lop_target field (this alias is to assist in deprecating):
        self.assertEqual(self.results_indicator.lop_target_active, self.results_indicator.lop_target_calculated)
        # lop_target_progress is for metrics only, sum of targets for ACTIVE target periods
        # (active target period = completed for time-aware, with-data for event/mid-end, lop_target_active for lop)
        self.assertEqual(self.metrics_indicator.lop_target_progress, self.progress_lop_target)

    def test_lop_actuals(self):
        # lop_actual is sum of all results for the entire program:
        self.assertEqual(self.results_indicator.lop_actual, self.lop_actual)
        # lop_actual_progress is for metrics only, sum of achieved values in ACTIVE target periods:
        self.assertEqual(self.metrics_indicator.lop_actual_progress, self.lop_actual_progress)

    def test_lop_percent_met(self):
        # lop_percent_met is the sum of all results divided by the arbitrary lop target
        self.assertEqual(round(self.results_indicator.lop_percent_met, 2), self.lop_percent_met)
        # lop_percent_met_progress is the sum of all results in active targets divided by the sum of all active
        # targets:
        self.assertEqual(round(self.metrics_indicator.lop_percent_met_progress, 2), self.lop_percent_met_progress)

    def test_annotated_target_targets(self):
        # target should always match exactly what was entered for that target:
        for target, expected in zip(self.results_indicator.annotated_targets, self.target_values):
            self.assertEqual(target.target, expected)

    def test_annotated_target_actuals(self):
        for expected, target in zip(self.expected_results_values, self.results_indicator.annotated_targets):
            self.assertEqual(target.actual, expected)

    def test_annotated_target_percent_mets(self):
        for expected, target in zip(self.expected_percent_mets, self.results_indicator.annotated_targets):
            if expected is None:
                self.assertIsNone(target.percent_met)
            else:
                self.assertEqual(round(target.percent_met, 2), expected)

    def test_annotated_target_is_complete(self):
        for target, expected in zip(self.results_indicator.annotated_targets, self.complete):
            self.assertEqual(target.is_complete, expected)


class ScenarioBuilderMixin:
    program_dates = [datetime.date(2017, 6, 1), datetime.date(2020, 1, 31)]
    unit_of_measure_type = Indicator.NUMBER
    direction_of_change = Indicator.DIRECTION_OF_CHANGE_POSITIVE
    target_frequency = Indicator.ANNUAL
    is_cumulative = False
    target_values = []
    result_values = []

    def do_setup(self):
        self.program = self.get_program()
        self.indicator = self.get_indicator()
        self.targets, self.results = self.get_targets()
        if self.is_cumulative and self.unit_of_measure_type == Indicator.NUMBER:
            self.expected_result_values = [
                sum(self.result_values[:count+1]) for count in range(len(self.result_values))
                ]
        self.assertEqual(len(self.expected_result_values), len(self.result_values))
        self.results_indicator = ResultsIndicator.results_view.get(pk=self.indicator.pk)

    def get_program(self):
        return w_factories.ProgramFactory(
            reporting_period_start=self.program_dates[0],
            reporting_period_end=self.program_dates[1]
        )

    def get_indicator(self):
        return i_factories.IndicatorFactory(
            program=self.program,
            target_frequency=self.target_frequency,
            unit_of_measure_type=self.unit_of_measure_type,
            direction_of_change=self.direction_of_change,
            is_cumulative=self.is_cumulative,
            lop_target=self.lop_target
        )

    def get_targets(self):
        targets = []
        results = []
        start_date = self.program_dates[0]
        end_date = self.program_dates[1]
        next_date = self.next_date_func(start_date)
        counter = 0
        while start_date < end_date:
            target = i_factories.PeriodicTargetFactory(
                indicator=self.indicator,
                start_date=start_date,
                end_date=next_date - datetime.timedelta(days=1),
                target=self.target_values[counter]
            )
            targets.append(target)
            if counter < len(self.result_values):
                results.append(
                    i_factories.ResultFactory(
                        indicator=self.indicator,
                        periodic_target=target,
                        date_collected=start_date + datetime.timedelta(days=1),
                        achieved=self.result_values[counter]
                    )
                )
            counter += 1
            start_date = next_date
            next_date = self.next_date_func(start_date)
        return targets, results

class ResultsTestBase:
    def test_result_rows_target_values(self):
        for expected, pt_row in zip(self.target_values, self.results_indicator.annotated_targets):
            self.assertEqual(expected, pt_row.target)

    def test_result_rows_actual_values(self):
        for expected, pt_row in zip(self.expected_result_values, self.results_indicator.annotated_targets):
            self.assertEqual(expected, pt_row.actual)

    def test_result_rows_percents_values(self):
        for count, pt_row in enumerate(self.results_indicator.annotated_targets):
            if count < len(self.expected_result_values) and self.target_values[count] == 0:
                expected = None
            elif count < len(self.expected_result_values):
                expected = round(float(self.expected_result_values[count])/self.target_values[count], 2)
            else:
                expected = None
            self.assertAlmostEqual(expected, pt_row.percent_met, 2)

    def test_lop_values(self):
        self.assertEqual(self.expected_lop_target, self.results_indicator.lop_target_active)
        self.assertEqual(self.expected_lop_actual, self.results_indicator.lop_actual)
        self.assertAlmostEqual(self.expected_lop_percent_met, self.results_indicator.lop_percent_met, 2)


class TestMonthlyDecreaseCumulative(test.TestCase, ResultsTestBase, ScenarioBuilderMixin):
    """built to deal with a weird failing edge case"""
    program_dates = [datetime.date(2017, 6, 1), datetime.date(2020, 1, 31)]
    unit_of_measure_type = Indicator.NUMBER
    direction_of_change = Indicator.DIRECTION_OF_CHANGE_NEGATIVE
    target_frequency = Indicator.MONTHLY
    is_cumulative = True
    lop_target = 12000
    calculated_lop_target = 100
    target_values = range(500, 180, -10)
    result_values = range(400, 628, 12)
    expected_result_values = []
    # expected_lop_target = 12000
    expected_lop_target = 190 # new value based on calculated lop target
    expected_lop_actual = 9652
    #expected_lop_percent_met = 0.80
    expected_lop_percent_met = 50.8 # new value based on calculated lop target
    next_date_func = get_next_date_monthly

    def setUp(self):
        self.do_setup()

class TestAnnualIncreasePercentage(test.TestCase, ResultsTestBase, ScenarioBuilderMixin):
    program_dates = [datetime.date(2017, 1, 1), datetime.date(2020, 12, 31)]
    unit_of_measure_type = Indicator.PERCENTAGE
    target_frequency = Indicator.ANNUAL
    is_cumulative = False
    lop_target = 30
    target_values = [50, 0, 90, 20]
    result_values = [45, 5, 0]
    expected_result_values = [45, 5, 0]
    # expected_lop_target = 30 
    expected_lop_target = 20 # new value based on calculated lop target
    expected_lop_actual = 0
    expected_lop_percent_met = 0
    next_date_func = get_next_date_yearly

    def setUp(self):
        self.do_setup()
