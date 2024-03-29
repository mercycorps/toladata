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
        # Creating a program than spans three fiscal years
        start_year = date.today().year if date.today().month < 7 else date.today().year + 1
        end_year = start_year + 2
        start_date = date(start_year, 1, 1)
        end_date = date(end_year, 1, 1)
        self.period_names = ['FY' + str(start_year), 'FY' + str(start_year + 1), 'FY' + str(end_year)]
        self.program = ProgramFactory(funding_status="Completed", reporting_period_start=start_date, reporting_period_end=end_date)

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

    def has_periodic_targets(self):
        """
        Returns the number of periodic targets created and checks that the correct FY targets have been created
        """
        pc_indicator = self.program.indicator_set.filter(admin_type=Indicator.ADMIN_PARTICIPANT_COUNT).first()
        pts = pc_indicator.periodictargets.all()
        pts_count = pts.count()
        values = [pts_count]
        periods = []
        for pt in pts:
            periods.append(pt.period)
        values.append(periods)
        return values

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
        self.assertTrue(self.has_periodic_targets() == [3, self.period_names])
