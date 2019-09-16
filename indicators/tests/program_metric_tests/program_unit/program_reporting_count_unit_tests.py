"""Program reporting counts for the Home Page

Business rules:
    reporting only if:
        - LOP indicator in closed program with lop_target
        - Midline/Endline/Event with set target and 1+ data
        - Time aware indicator with completed target period and set target and 1+ data"""

import unittest
import datetime
from factories import (
    workflow_models as w_factories,
    indicators_models as i_factories
    )
from indicators.models import Indicator, PeriodicTarget
from indicators.queries import ProgramWithMetrics
from safedelete.models import HARD_DELETE
from django import test


class ReportingIndicatorBase(test.TestCase):
    TIME_AWARE_FREQUENCIES = [
        Indicator.ANNUAL,
        Indicator.SEMI_ANNUAL,
        Indicator.TRI_ANNUAL,
        Indicator.QUARTERLY,
        Indicator.MONTHLY
    ]

    DATE_FUNCS = {
        Indicator.ANNUAL: lambda x: datetime.date(x.year+1, x.month, x.day),
        Indicator.SEMI_ANNUAL: lambda x: datetime.date(
            x.year + 1 if x.month > 6 else x.year,
            x.month - 6 if x.month > 6 else x.month + 6,
            1
        ) - datetime.timedelta(days=1),
        Indicator.TRI_ANNUAL: lambda x: datetime.date(
            x.year + 1 if x.month > 8 else x.year,
            x.month - 8 if x.month > 8 else x.month + 4,
            1
        ) - datetime.timedelta(days=1),
        Indicator.QUARTERLY: lambda x: datetime.date(
            x.year + 1 if x.month > 9 else x.year,
            x.month - 9 if x.month > 9 else x.month + 3,
            1
        ) - datetime.timedelta(days=1),
        Indicator.MONTHLY: lambda x: datetime.date(
            x.year + 1 if x.month == 12 else x.year,
            1 if x.month == 12 else x.month + 1,
            1
        ) - datetime.timedelta(days=1)
    }

    indicator = None
    program = None
    targets = []
    data = []

    def load_base_indicator(self):
        """loads a bare indicator in this program"""
        self.indicator = i_factories.IndicatorFactory()
        if self.program is not None:
            self.indicator.program = self.program
            self.indicator.save()

    def load_data(self, indicator=None, achieved=None, date=None, target=None):
        """adds data to the indicator"""
        indicator = self.indicator if indicator is None else indicator
        achieved = 800 if achieved is None else achieved
        date = self.program.reporting_period_start + datetime.timedelta(days=5) if date is None else date
        datum = i_factories.ResultFactory(
            indicator=indicator,
            achieved=achieved,
            date_collected=date,
            periodic_target=target
        )
        self.data.append(datum)

    def load_target(self, indicator, target, period=None, start_date=None):
        end_date = start_date
        period = "Period {0}".format(len(self.targets)) if period is None else period
        if start_date is not None:
            end_date = self.DATE_FUNCS[indicator.target_frequency](start_date)
        target = i_factories.PeriodicTargetFactory(
                indicator=indicator,
                period=period,
                target=target,
                start_date=start_date,
                end_date=end_date
            )
        self.targets.append(target)
        return target


    def get_time_aware_dates(self, target_frequency):
        start_date = self.program.reporting_period_start
        date_func = self.DATE_FUNCS[target_frequency]
        end_date = date_func(start_date)
        dates = [start_date,]
        while end_date < self.program.reporting_period_end:
            start_date = end_date + datetime.timedelta(days=1)
            end_date = date_func(start_date)
            dates.append(start_date)
        return dates

    def load_targets(self, indicator=None, targets=None):
        indicator = self.indicator if indicator is None else indicator
        target_frequency = indicator.target_frequency
        loaded_targets = []
        if target_frequency == Indicator.MID_END:
            targets = [500, 800] if targets is None else targets
            loaded_targets.append(self.load_target(indicator, targets[0], period=PeriodicTarget.MIDLINE))
            loaded_targets.append(self.load_target(indicator, targets[1], period=PeriodicTarget.ENDLINE))
        elif target_frequency == Indicator.EVENT:
            targets = [1200,] if targets is None else targets
            for target in targets:
                loaded_targets.append(self.load_target(indicator, target))
        elif target_frequency in self.TIME_AWARE_FREQUENCIES:
            dates = self.get_time_aware_dates(target_frequency)
            targets = [400]*len(dates) if targets is None else targets
            for target, start_date in zip(targets, dates):
                loaded_targets.append(self.load_target(indicator, target, start_date=start_date))
        return loaded_targets

    def get_closed_program(self):
        self.program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2016, 1, 1),
            reporting_period_end=datetime.date(2016, 12, 31)
        )

    def get_annotated_program(self):
        return ProgramWithMetrics.home_page.with_annotations('reporting').get(pk=self.program.pk)

class TestSingleNonReportingIndicator(ReportingIndicatorBase):
    """test conditions under which indicator should report reporting as false"""
    def one_incomplete_assert(self, program, scenario):
        nonreporting = program.scope_counts['nonreporting']
        reporting = program.scope_counts['indicator_count'] - nonreporting
        self.assertEqual(
            nonreporting, 1,
            "For {0}, program should have 1 incomplete indicator, got {1}".format(
                scenario, nonreporting
            )
        )
        self.assertEqual(
            reporting, 0,
            "For {0}, program should have 0 complete indicators, got {1}".format(
                scenario, reporting
            )
        )

    def test_lop_indicator_in_open_program(self):
        # get open (reporting period not over) program:
        # set dates from today so test doesn't become obsolete at some arbitrary future date:
        start_date = datetime.date.today() - datetime.timedelta(days=10)
        end_date = datetime.date.today() + datetime.timedelta(days=100)
        self.program = w_factories.ProgramFactory(
            reporting_period_start=start_date,
            reporting_period_end=end_date
        )
        self.load_base_indicator()
        self.indicator.target_frequency = Indicator.LOP
        # lop_target and data should be set to ensure it's only program openness restricting from "complete"
        self.indicator.lop_target = 1000
        self.indicator.save()
        self.load_data()
        program = self.get_annotated_program()
        self.assertEqual(program.scope_counts['nonreporting_count'], 1)

    def test_lop_indicator_no_lop_target(self):
        #program is complete:
        self.get_closed_program()
        # add indicator with data:
        self.load_base_indicator()
        self.indicator.target_frequency = Indicator.LOP
        self.indicator.save()
        self.load_data()
        program = self.get_annotated_program()
        self.assertEqual(program.scope_counts['nonreporting_count'], 1)

    def test_lop_indicator_no_data(self):
        self.get_closed_program()
        self.load_base_indicator()
        self.indicator.target_frequency = Indicator.LOP
        self.indicator.lop_target = 1400
        self.indicator.save()
        program = self.get_annotated_program()
        self.assertEqual(program.scope_counts['nonreporting_count'], 1)

    def test_midend_indicator_no_targets(self):
        self.get_closed_program()
        self.load_base_indicator()
        self.indicator.target_frequency = Indicator.MID_END
        self.indicator.save()
        # ensure indicator has data for midline indicator:
        self.load_data()
        program = self.get_annotated_program()
        self.assertEqual(program.scope_counts['nonreporting_count'], 1)

    def test_midend_indicator_no_data(self):
        self.get_closed_program()
        self.load_base_indicator()
        self.indicator.target_frequency = Indicator.MID_END
        self.indicator.save()
        # ensure indicator has targets for midline indicator:
        self.load_targets()
        program = self.get_annotated_program()
        self.assertEqual(program.scope_counts['nonreporting_count'], 1)

    def test_event_indicator_no_target(self):
        self.get_closed_program()
        self.load_base_indicator()
        self.indicator.target_frequency = Indicator.EVENT
        self.indicator.save()
        self.load_data()
        program = self.get_annotated_program()
        self.assertEqual(program.scope_counts['nonreporting_count'], 1)

    def test_event_indicator_no_data(self):
        self.get_closed_program()
        self.load_base_indicator()
        self.indicator.target_frequency = Indicator.EVENT
        self.indicator.save()
        self.load_targets()
        program = self.get_annotated_program()
        self.assertEqual(program.scope_counts['nonreporting_count'], 1)

    def test_time_aware_indicators_no_targets(self):
        self.get_closed_program()
        for frequency in self.TIME_AWARE_FREQUENCIES:
            self.load_base_indicator()
            self.indicator.target_frequency = frequency
            self.indicator.save()
            self.load_data()
            program = self.get_annotated_program()
            self.assertEqual(program.scope_counts['nonreporting_count'], 1)
            for datum in self.data:
                datum.delete()
            self.data = []
            self.indicator.delete()
            self.indicator = None

    def test_time_aware_indicators_no_data(self):
        self.targets = []
        self.get_closed_program()
        for frequency in self.TIME_AWARE_FREQUENCIES:
            self.load_base_indicator()
            self.indicator.target_frequency = frequency
            self.indicator.save()
            self.load_targets()
            program = self.get_annotated_program()
            self.assertEqual(program.scope_counts['nonreporting_count'], 1)
            for target in self.targets:
                target.delete()
            self.targets = []
            self.indicator.delete()
            self.indicator = None

    def test_time_aware_indicators_no_completed_periods(self):
        # if program started yesterday then no targets will be finished by today:
        today = datetime.date.today() - datetime.timedelta(days=1)
        self.program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(today.year, today.month, 1),
            reporting_period_end=datetime.date(today.year+1, today.month, 1) - datetime.timedelta(days=1)
        )
        for frequency in [freq for freq in self.TIME_AWARE_FREQUENCIES if freq != Indicator.MONTHLY]:
            # the above hack brought to you by the fact that once a month it is impossible to make a monthly indicator
            # with no completed programs.  I apologize.
            self.load_base_indicator()
            self.indicator.target_frequency = frequency
            self.indicator.save()
            targets = self.load_targets()
            for target in targets:
                self.load_data(date=datetime.date.today()-datetime.timedelta(days=1), target=target)
            program = self.get_annotated_program()
            self.assertEqual(
                program.scope_counts['nonreporting_count'], 1,
                '{frequency} frequency indicator got scope counts {sc} instead of 1 nonreporting'.format(
                    frequency=frequency,
                    sc=program.scope_counts
                ))
            for target in self.targets:
                target.delete()
            self.targets = []
            self.indicator.delete()
            self.indicator = None

class TestSingleReportingIndicator(ReportingIndicatorBase):
    def test_lop_indicator_closed_program_target_set_with_data(self):
        #program is complete:
        self.get_closed_program()
        # add indicator with data:
        self.load_base_indicator()
        self.indicator.target_frequency = Indicator.LOP
        self.indicator.lop_target = 1400
        self.indicator.save()
        target = i_factories.PeriodicTargetFactory(
            indicator=self.indicator,
            target=self.indicator.lop_target,
            start_date=self.indicator.program.reporting_period_start,
            end_date=self.indicator.program.reporting_period_end
        )
        self.load_data(target=target)
        program = self.get_annotated_program()
        self.assertEqual(program.scope_counts['nonreporting_count'], 0)
        self.assertEqual(program.scope_counts['indicator_count'], 1)

    def test_midend_indicator_midline_target_and_data(self):
        self.get_closed_program()
        self.load_base_indicator()
        self.indicator.target_frequency = Indicator.MID_END
        self.indicator.save()
        # ensure indicator has targets for midline indicator:
        target = self.load_target(self.indicator, 800, period=PeriodicTarget.MIDLINE)
        self.load_data(indicator=self.indicator, achieved=500, date=None, target=target)
        program = self.get_annotated_program()
        self.assertEqual(program.scope_counts['nonreporting_count'], 0)
        self.assertEqual(program.scope_counts['indicator_count'], 1)

    def test_midend_indicator_both_targets_and_data(self):
        self.get_closed_program()
        self.load_base_indicator()
        self.indicator.target_frequency = Indicator.MID_END
        self.indicator.save()
        # ensure indicator has targets for midline indicator:
        target1 = self.load_target(self.indicator, 800, period=PeriodicTarget.MIDLINE)
        target2 = self.load_target(self.indicator, 400, period=PeriodicTarget.ENDLINE)
        self.load_data(indicator=self.indicator, achieved=500, date=None, target=target1)
        self.load_data(indicator=self.indicator, achieved=700, date=None, target=target2)
        program = self.get_annotated_program()
        self.assertEqual(program.scope_counts['nonreporting_count'], 0)
        self.assertEqual(program.scope_counts['indicator_count'], 1)

    def test_event_indicator_with_target_and_data(self):
        self.get_closed_program()
        self.load_base_indicator()
        self.indicator.target_frequency = Indicator.EVENT
        self.indicator.save()
        # ensure indicator has targets for midline indicator:
        target = self.load_target(self.indicator, 800)
        self.load_data(indicator=self.indicator, achieved=500, date=None, target=target)
        program = self.get_annotated_program()
        self.assertEqual(program.scope_counts['nonreporting_count'], 0)
        self.assertEqual(program.scope_counts['indicator_count'], 1)

    def test_time_aware_indicators_with_completed_targets_and_data(self):
        self.get_closed_program()
        self.targets = []
        self.data = []
        for frequency in self.TIME_AWARE_FREQUENCIES:
            self.load_base_indicator()
            self.indicator.target_frequency = frequency
            self.indicator.save()
            self.load_targets()
            for target in self.targets:
                self.load_data(indicator=target.indicator, target=target)
            program = self.get_annotated_program()
            self.assertEqual(program.scope_counts['nonreporting_count'], 0)
            self.assertEqual(program.scope_counts['indicator_count'], 1)
            for target in self.targets:
                target.delete()
            for datum in self.data:
                datum.delete()
            self.data = []
            self.targets = []
            self.indicator.delete(force_policy=HARD_DELETE)
            self.indicator = None

class TestMixedReportingAndNonIndicators(ReportingIndicatorBase):

    def test_lop_and_midend_just_mid_reporting(self):
        self.get_closed_program()
        indicator_lop = i_factories.IndicatorFactory(
            target_frequency=Indicator.LOP,
            lop_target=1000,
            program=self.program
        )
        i_lop_target = i_factories.PeriodicTargetFactory(
            indicator=indicator_lop,
            target=indicator_lop.lop_target,
            start_date=self.program.reporting_period_start,
            end_date=self.program.reporting_period_end
        )
        lop_data = i_factories.ResultFactory(
            indicator=indicator_lop,
            periodic_target=i_lop_target,
            achieved=400,
            date_collected=self.program.reporting_period_end - datetime.timedelta(days=10)
        )
        indicator_midend = i_factories.IndicatorFactory(
            target_frequency=Indicator.MID_END,
            program=self.program
        )
        mid_target = i_factories.PeriodicTargetFactory(
            indicator=indicator_midend,
            period=PeriodicTarget.MIDLINE,
            target=1000
        )
        mid_data = i_factories.ResultFactory(
            indicator=indicator_midend,
            periodic_target=mid_target,
            achieved=400,
            date_collected=self.program.reporting_period_start + datetime.timedelta(days=20)
        )
        program = self.get_annotated_program()
        self.assertEqual(program.scope_counts['nonreporting_count'], 0)
        self.assertEqual(program.scope_counts['indicator_count'], 2)

    def test_multiple_time_aware_indicators(self):
        self.get_closed_program()
        for frequency in self.TIME_AWARE_FREQUENCIES:
            indicator = i_factories.IndicatorFactory(
                target_frequency=frequency,
                program=self.program
            )
            self.load_targets(indicator=indicator)
        for target in self.targets:
            self.load_data(indicator=target.indicator, target=target)
        program = self.get_annotated_program()
        self.assertEqual(program.scope_counts['nonreporting_count'], 0)
        self.assertEqual(program.scope_counts['indicator_count'], len(self.TIME_AWARE_FREQUENCIES))

class TestProgramReportingPeriodCorrect(test.TestCase):
    def test_reporting_period_correct_shows_correct(self):
        program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2015, 1, 1),
            reporting_period_end=datetime.date(2017, 2, 28)
        )
        homepage_program = ProgramWithMetrics.home_page.with_annotations().get(pk=program.pk)
        self.assertTrue(homepage_program.reporting_period_correct)

    def test_reporting_period_bad_start_shows_incorrect(self):
        program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2015, 1, 15),
            reporting_period_end=datetime.date(2017, 2, 28)
        )
        homepage_program = ProgramWithMetrics.home_page.with_annotations().get(pk=program.pk)
        self.assertFalse(homepage_program.reporting_period_correct)

    def test_reporting_period_bad_end_shows_incorrect(self):
        program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2015, 1, 1),
            reporting_period_end=datetime.date(2017, 2, 15)
        )
        homepage_program = ProgramWithMetrics.home_page.with_annotations().get(pk=program.pk)
        self.assertFalse(homepage_program.reporting_period_correct)

    def test_reporting_period_bad_both_shows_incorrect(self):
        program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2015, 1, 15),
            reporting_period_end=datetime.date(2017, 2, 15)
        )
        homepage_program = ProgramWithMetrics.home_page.with_annotations().get(pk=program.pk)
        self.assertFalse(homepage_program.reporting_period_correct)

class TestProgramHasTimeAwareIndicators(test.TestCase):
    def test_program_with_no_indicators_returns_false(self):
        program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2015, 1, 1),
            reporting_period_end=datetime.date(2017, 2, 28)
        )
        self.assertFalse(program.has_time_aware_targets)

    def test_program_with_non_time_aware_indicators_returns_false(self):
        for frequency in [Indicator.LOP, Indicator.MID_END, Indicator.EVENT]:
            program = w_factories.ProgramFactory(
                reporting_period_start=datetime.date(2015, 1, 1),
                reporting_period_end=datetime.date(2017, 2, 28)
            )
            i_factories.IndicatorFactory(
                target_frequency=frequency,
                program=program
            )
            self.assertFalse(program.has_time_aware_targets)

    def test_program_with_time_aware_indicators_returns_true(self):
        for frequency in Indicator.REGULAR_TARGET_FREQUENCIES:
            program = w_factories.ProgramFactory(
                reporting_period_start=datetime.date(2015, 1, 1),
                reporting_period_end=datetime.date(2017, 12, 31)
            )
            i_factories.IndicatorFactory(
                target_frequency=frequency,
                program=program
            )
            self.assertTrue(program.has_time_aware_targets)

    def test_program_with_all_time_aware_indicators_returns_true(self):
        program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2015, 1, 1),
            reporting_period_end=datetime.date(2017, 12, 31)
        )
        for frequency in Indicator.REGULAR_TARGET_FREQUENCIES:
            i_factories.IndicatorFactory(
                target_frequency=frequency,
                program=program
            )
        self.assertTrue(program.has_time_aware_targets)

    def test_program_with_all_indicators_returns_true(self):
        program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2015, 1, 1),
            reporting_period_end=datetime.date(2017, 12, 31)
        )
        for frequency, _ in Indicator.TARGET_FREQUENCIES:
            i_factories.IndicatorFactory(
                target_frequency=frequency,
                program=program
            )
        self.assertTrue(program.has_time_aware_targets)

class TestProgramLastTimeAwareStartDate(test.TestCase):
    def test_no_time_aware_indicators_returns_none(self):
        program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2015, 1, 1),
            reporting_period_end=datetime.date(2017, 12, 31)
        )
        self.assertIsNone(program.last_time_aware_indicator_start_date)

    def test_program_with_non_time_aware_indicators_returns_none(self):
        for frequency in [Indicator.LOP, Indicator.MID_END, Indicator.EVENT]:
            program = w_factories.ProgramFactory(
                reporting_period_start=datetime.date(2015, 1, 1),
                reporting_period_end=datetime.date(2017, 12, 31)
            )
            i_factories.IndicatorFactory(
                target_frequency=frequency,
                program=program
            )
            self.assertIsNone(program.last_time_aware_indicator_start_date)

    def test_program_with_annual_indicator_returns_correct_date(self):
        program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2015, 1, 1),
            reporting_period_end=datetime.date(2017, 12, 31)
        )
        indicator = i_factories.IndicatorFactory(
            target_frequency=Indicator.ANNUAL,
            program=program
        )
        for start, end in [(datetime.date(2015, 1, 1), datetime.date(2015, 12, 31)),
                           (datetime.date(2016, 1, 1), datetime.date(2016, 12, 31)),
                           (datetime.date(2017, 1, 1), datetime.date(2017, 12, 31))]:
            i_factories.PeriodicTargetFactory(
                indicator=indicator,
                start_date=start,
                end_date=end
            )
        self.assertEqual(program.last_time_aware_indicator_start_date, datetime.date(2017, 1, 1))

    def test_program_with_multiple_indicators_returns_correct_date(self):
        program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2015, 1, 1),
            reporting_period_end=datetime.date(2015, 12, 31)
        )
        indicator1 = i_factories.IndicatorFactory(
            target_frequency=Indicator.ANNUAL,
            program=program
        )
        i_factories.PeriodicTargetFactory(
            indicator=indicator1,
            start_date=datetime.date(2015, 1, 1),
            end_date=datetime.date(2015, 12, 31)
        )
        indicator2 = i_factories.IndicatorFactory(
            target_frequency=Indicator.TRI_ANNUAL,
            program=program
        )
        for start, end in [(datetime.date(2015, 1, 1), datetime.date(2015, 4, 30)),
                           (datetime.date(2015, 5, 1), datetime.date(2015, 8, 31)),
                           (datetime.date(2015, 9, 1), datetime.date(2015, 12, 31))]:
            i_factories.PeriodicTargetFactory(
                indicator=indicator2,
                start_date=start,
                end_date=end
            )
        self.assertEqual(program.last_time_aware_indicator_start_date, datetime.date(2015, 9, 1))
