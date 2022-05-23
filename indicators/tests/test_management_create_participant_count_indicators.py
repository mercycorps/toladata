from django import test
from django.conf import settings
from django.core import management
from datetime import datetime, date
from indicators.models import Indicator, IndicatorType, OutcomeTheme, DisaggregationType, PeriodicTarget, DisaggregationLabel
from factories.indicators_models import IndicatorTypeFactory, ReportingFrequencyFactory, ReportingFrequency, LevelFactory
from factories.workflow_models import ProgramFactory


class TestManagementCreateParticipantCountIndicators(test.TestCase):
    expected_lengths = {
        'outcome_themes': 5,
        'disagg_types': 6,
        'periodic_target': 1,
        'periodic_target_next': 2,
        'indicators': 1
    }

    def setUp(self):
        IndicatorTypeFactory(indicator_type=IndicatorType.PC_INDICATOR_TYPE)
        ReportingFrequencyFactory(frequency=ReportingFrequency.PC_REPORTING_FREQUENCY)
        current_fy = date.fromisoformat(settings.REPORTING_YEAR_START_DATE).year + 1
        program = ProgramFactory(reporting_period_start=date(current_fy, 7, 1), reporting_period_end=date(current_fy + 1, 6, 1))
        LevelFactory(name="test", program=program)

    def indicators(self):
        indicators = Indicator.objects.filter(admin_type=Indicator.ADMIN_PARTICIPANT_COUNT)
        return len(indicators)

    def outcome_themes(self):
        outcome_themes = OutcomeTheme.objects.all()
        return len(outcome_themes)

    def disagg_types(self):
        disagg_types = DisaggregationType.objects.all()
        return len(disagg_types)

    def periodic_target(self):
        periodic_target = PeriodicTarget.objects.all()
        return len(periodic_target)

    def create_disagg_type(self, **kwargs):
        actual_disagg_labels = ['Direct', 'Indirect']

        disagg_type = DisaggregationType(disaggregation_type='Actual with double counting', global_type=DisaggregationType.DISAG_PARTICIPANT_COUNT, **kwargs)
        disagg_type.save()

        for label in actual_disagg_labels:
            disagg_label = DisaggregationLabel(label=label, disaggregation_type=disagg_type, customsort=1)
            disagg_label.save()

    def create_outcome(self):
        outcome_theme = OutcomeTheme(name='Resilience approach (tick this box if the program used a resilience approach)', is_active=True)
        outcome_theme.save()

    def assertions(self):
        self.assertEquals(self.outcome_themes(), self.expected_lengths['outcome_themes'])
        self.assertEquals(self.disagg_types(), self.expected_lengths['disagg_types'])
        self.assertEquals(self.periodic_target(), self.expected_lengths['periodic_target'])
        self.assertEquals(self.indicators(), self.expected_lengths['indicators'])

    def test_disagg_type_archived(self):
        self.create_disagg_type(is_archived=True)
        management.call_command(
            'create_participant_count_indicators', execute=True, create_disaggs_themes=True, suppress_output=True, verbosity=0)
        self.assertions()

    def test_disagg_type_exists(self):
        self.create_disagg_type()
        management.call_command(
            'create_participant_count_indicators', execute=True, create_disaggs_themes=True, suppress_output=True, verbosity=0)
        self.assertions()

    def test_outcome_exists(self):
        self.create_outcome()
        management.call_command(
            'create_participant_count_indicators', execute=True, create_disaggs_themes=True, suppress_output=True, verbosity=0)
        self.assertions()

    def test_dry_run(self):
        management.call_command(
            'create_participant_count_indicators', execute=False, create_disaggs_themes=True, suppress_output=True, verbosity=0)

        self.assertEquals(self.outcome_themes(), self.expected_lengths['outcome_themes'])
        self.assertEquals(self.disagg_types(), self.expected_lengths['disagg_types'])
        self.assertEquals(self.periodic_target(), 0)  # Not created when execute is False
        self.assertEquals(self.indicators(), 0)  # Not created when execute is False

    """
    Commenting out the test. The job on github will freeze from the input selection.
    def test_without_create_disaggs_themes(self):
        management.call_command(
            'create_participant_count_indicators', execute=True, create_disaggs_themes=False, suppress_output=False, verbosity=0)
    """




