""" Program last period complete tests for the Program and Home pages

business rules:
- if reporting period start or end is null reports -1
- reports percent of program complete (0 if program has not yet started, 100 if it is finished)
"""

import datetime
from factories import (
    workflow_models as w_factory,
    indicators_models as i_factory
)
from indicators.models import Indicator
from indicators.queries import ProgramWithMetrics
from django.utils import formats
from django import test


format_date = lambda date_obj: formats.date_format(date_obj, "MEDIUM_DATE_FORMAT")

class TestProgramHasLOP(test.TestCase):
    def get_program(self, start_date, end_date):
        program = w_factory.ProgramFactory(
            reporting_period_start=start_date,
            reporting_period_end=end_date
        )
        return ProgramWithMetrics.program_page.get(pk=program.pk)

    def add_lop_indicator(self, program):
        indicator = i_factory.IndicatorFactory(
            target_frequency=Indicator.LOP,
            lop_target=100,
            program=program
        )
        return indicator

    def add_non_lop_indicator(self, program):
        indicator = i_factory.IndicatorFactory(
            target_frequency=Indicator.ANNUAL,
            lop_target=100,
            program=program
        )
        i_factory.PeriodicTargetFactory(
            indicator=indicator,
            target=100,
            start_date=program.reporting_period_start,
            end_date=program.reporting_period_end
        )
        return indicator

    def refresh_program(self, program):
        return ProgramWithMetrics.program_page.get(pk=program.pk)

    def test_no_indicator_returns_false(self):
        """with no lop indicators, has_lop should be false"""
        start_date = datetime.date(2015, 1, 1)
        end_date = datetime.date(2015, 12, 31)
        program = self.get_program(start_date, end_date)
        self.assertFalse(program.target_period_info['lop'])

    def test_non_lop_indicator_returns_false(self):
        """with no lop indicators, has_lop should be false"""
        start_date = datetime.date(2015, 1, 1)
        end_date = datetime.date(2015, 12, 31)
        program = self.get_program(start_date, end_date)
        self.add_non_lop_indicator(program)
        program = self.refresh_program(program)
        self.assertFalse(program.target_period_info['lop'])

    def test_one_lop_indicator_returns_true(self):
        """with one lop indicator, has_lop should be true"""
        start_date = datetime.date(2015, 1, 1)
        end_date = datetime.date(2015, 12, 31)
        program = self.get_program(start_date, end_date)
        self.add_lop_indicator(program)
        program = self.refresh_program(program)
        self.assertTrue(program.target_period_info['lop'])

    def test_multiple_lop_indicators_returns_true(self):
        """with multiple lop indicators, has_lop should be true"""
        start_date = datetime.date(2015, 1, 1)
        end_date = datetime.date(2015, 12, 31)
        program = self.get_program(start_date, end_date)
        self.add_lop_indicator(program)
        self.add_lop_indicator(program)
        self.add_lop_indicator(program)
        program = self.refresh_program(program)
        self.assertTrue(program.target_period_info['lop'])

class TestProgramHasMidEnd(test.TestCase):
    def get_program(self, start_date, end_date):
        program = w_factory.ProgramFactory(
            reporting_period_start=start_date,
            reporting_period_end=end_date
        )
        return ProgramWithMetrics.program_page.get(pk=program.pk)

    def add_midend_indicator(self, program):
        indicator = i_factory.IndicatorFactory(
            target_frequency=Indicator.MID_END,
            lop_target=100,
            program=program
        )
        i_factory.PeriodicTargetFactory(
            indicator=indicator,
            target=100,
            start_date=datetime.date(2015, 1, 1),
            end_date=datetime.date(2015, 6, 30),
            customsort=0
        )
        i_factory.PeriodicTargetFactory(
            indicator=indicator,
            target=100,
            start_date=datetime.date(2015, 7, 1),
            end_date=datetime.date(2015, 12, 31),
            customsort=1
        )
        return indicator

    def add_non_midend_indicator(self, program):
        indicator = i_factory.IndicatorFactory(
            target_frequency=Indicator.ANNUAL,
            lop_target=100,
            program=program
        )
        i_factory.PeriodicTargetFactory(
            indicator=indicator,
            target=100,
            start_date=program.reporting_period_start,
            end_date=program.reporting_period_end
        )
        return indicator

    def refresh_program(self, program):
        return ProgramWithMetrics.program_page.get(pk=program.pk)

    def test_no_indicator_returns_false(self):
        """with no midend indicators, midend should be false"""
        start_date = datetime.date(2015, 1, 1)
        end_date = datetime.date(2015, 12, 31)
        program = self.get_program(start_date, end_date)
        self.assertFalse(program.target_period_info['midend'])

    def test_non_midend_indicator_returns_false(self):
        """with no midend indicators, midend should be false"""
        start_date = datetime.date(2015, 1, 1)
        end_date = datetime.date(2015, 12, 31)
        program = self.get_program(start_date, end_date)
        self.add_non_midend_indicator(program)
        program = self.refresh_program(program)
        self.assertFalse(program.target_period_info['midend'])

    def test_one_midend_indicator_returns_true(self):
        """with one midend indicator, midend should be true"""
        start_date = datetime.date(2015, 1, 1)
        end_date = datetime.date(2015, 12, 31)
        program = self.get_program(start_date, end_date)
        self.add_midend_indicator(program)
        program = self.refresh_program(program)
        self.assertTrue(program.target_period_info['midend'])

    def test_multiple_lop_indicators_returns_true(self):
        """with multiple midend indicators, midend should be true"""
        start_date = datetime.date(2015, 1, 1)
        end_date = datetime.date(2015, 12, 31)
        program = self.get_program(start_date, end_date)
        self.add_midend_indicator(program)
        self.add_midend_indicator(program)
        self.add_midend_indicator(program)
        program = self.refresh_program(program)
        self.assertTrue(program.target_period_info['midend'])

class TestAnnualLastCompleted(test.TestCase):
    def get_program(self, start_date, end_date):
        program = w_factory.ProgramFactory(
            reporting_period_start=start_date,
            reporting_period_end=end_date
        )
        return ProgramWithMetrics.program_page.get(pk=program.pk)

    def add_annual_indicators(self, program, dates):
        indicator = i_factory.IndicatorFactory(
            target_frequency=Indicator.ANNUAL,
            lop_target=100,
            program=program
        )
        for c, start_date in enumerate(dates):
            end_date = start_date + datetime.timedelta(days=364)
            i_factory.PeriodicTargetFactory(
                indicator=indicator,
                target=100,
                customsort=c,
                start_date=start_date,
                end_date=end_date
            )
        return indicator

    def add_non_annual_indicators(self, program):
        indicator = i_factory.IndicatorFactory(
            target_frequency=Indicator.MID_END,
            lop_target=100,
            program=program
        )
        i_factory.PeriodicTargetFactory(
            indicator=indicator,
            target=100,
            start_date=datetime.date(2015, 1, 1),
            end_date=datetime.date(2015, 6, 30),
            customsort=0
        )
        i_factory.PeriodicTargetFactory(
            indicator=indicator,
            target=100,
            start_date=datetime.date(2015, 7, 1),
            end_date=datetime.date(2015, 12, 31),
            customsort=1
        )
        return indicator

    def refresh_program(self, program):
        return ProgramWithMetrics.program_page.get(pk=program.pk)

    def test_one_year_annual_indicator_returns_correct_date(self):
        start_date = datetime.date(2015, 1, 1)
        end_date = datetime.date(2015, 12, 31)
        program = self.get_program(start_date, end_date)
        self.add_annual_indicators(program, [start_date,])
        program = self.refresh_program(program)
        self.assertEqual(program.target_period_info['annual'], format_date(end_date))

    def test_no_annual_indicator_returns_false(self):
        start_date = datetime.date(2015, 1, 1)
        end_date = datetime.date(2015, 12, 31)
        program = self.get_program(start_date, end_date)
        self.add_non_annual_indicators(program)
        program = self.refresh_program(program)
        self.assertFalse(program.target_period_info['annual'])

    def test_incomplete_annual_indicator_returns_false(self):
        start_date = datetime.date.today()
        end_date = start_date + datetime.timedelta(days=364)
        program = self.get_program(start_date, end_date)
        self.add_annual_indicators(program, [start_date,] )
        program = self.refresh_program(program)
        self.assertFalse(program.target_period_info['annual'])

    def test_partially_complete_annual_indicators_program_returns_most_recent(self):
        expected_date = datetime.date.today() - datetime.timedelta(days=10)
        start_date = expected_date - datetime.timedelta(days=364)
        second_start = expected_date + datetime.timedelta(days=1)
        second_end = second_start + datetime.timedelta(days=364)
        program = self.get_program(start_date, second_end)
        self.add_annual_indicators(program, [start_date, second_start])
        program = self.refresh_program(program)
        self.assertEqual(program.target_period_info['annual'], format_date(expected_date))
        