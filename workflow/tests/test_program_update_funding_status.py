from datetime import date
from django import test
from factories.workflow_models import ProgramFactory
from factories.indicators_models import LevelFactory, IndicatorTypeFactory, ReportingFrequencyFactory
from indicators.models import Indicator, IndicatorType, ReportingFrequency
from django.core import management


class TestProgramFundingStatusUpdate(test.TestCase):
    """
    Tests that the participant count indicator gets created when a programs funding_status changes.
    """

    def setUp(self):
        """
        Set up for the test case. IndicatorTypeFactory and ReportingFrequencyFactory are required for creating disaggs
        """
        IndicatorTypeFactory(indicator_type=IndicatorType.PC_INDICATOR_TYPE)
        ReportingFrequencyFactory(frequency=ReportingFrequency.PC_REPORTING_FREQUENCY)
        self.program = ProgramFactory(funding_status="Completed", reporting_period_start=date(2022, 1, 1), reporting_period_end=date(2022, 6, 1))

    def has_rf(self):
        """
        Returns True if the program has a results framework
        """
        return self.program.levels.count() > 0

    def has_pc(self):
        """
        Returns True if the program has a participant count indicator
        """
        return self.program.indicator_set.filter(admin_type=Indicator.ADMIN_PARTICIPANT_COUNT).count() > 0

    def create_disaggs(self):
        """
        Runs the management command create_participant_count_indicators as a dry run to create the disaggs
        """
        management.call_command(
            'create_participant_count_indicators', create_disaggs_themes=True, suppress_output=True)

    def create_rf(self):
        """
        Creates a results framework
        """
        self.create_disaggs()
        LevelFactory(name="Test", program=self.program)

    def test_program_updated_funding_status_without_rf(self):
        """
        Test for when a programs funding status is updated but the program does not have a results framework
        """
        self.program.funding_status = "Funded"
        self.program.save()

        self.assertFalse(self.has_rf())
        self.assertFalse(self.has_pc())

    def test_program_updated_funding_status_with_rf(self):
        """
        Test for when a programs funding status is updated and the program has a results framework
        """
        self.create_rf()

        self.program.funding_status = "Funded"
        self.program.save()

        self.assertTrue(self.has_rf())
        self.assertTrue(self.has_pc())
