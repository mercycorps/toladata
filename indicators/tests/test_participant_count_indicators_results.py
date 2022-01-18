import json

from django import test
from django.urls import reverse
from django.core import management

from factories import workflow_models as w_factories
from factories.indicators_models import IndicatorTypeFactory, ReportingFrequencyFactory

from indicators.models import Indicator
from workflow.models import PROGRAM_ROLE_CHOICES


class TestParticipantCountSetup(test.TestCase):
    """
    Test the views for participant count result creation and updates
    """
    def setUp(self):
        self.country = w_factories.CountryFactory()
        self.program = w_factories.RFProgramFactory(country=[self.country], tiers=True, levels=1)
        self.tola_user = w_factories.TolaUserFactory(country=self.country)

        self.client = test.Client()
        IndicatorTypeFactory(indicator_type="Custom")
        ReportingFrequencyFactory(frequency="Annual")

    def has_correct_permission(self, tola_user, access_level, status_code):
        self.client.force_login(tola_user.user)
        w_factories.grant_program_access(
            tola_user, self.program, self.country, access_level)
        indicator = Indicator.objects.filter(admin_type=Indicator.ADMIN_PARTICIPANT_COUNT)[0]
        response = self.client.get(reverse('pcountcreate', args=[indicator.pk]))
        self.assertEqual(response.status_code, status_code)

    def test_result_create_view_permissions(self):
        management.call_command(
            'create_participant_count_indicators', execute=True, create_disaggs_themes=True, suppress_output=True)
        for access_level in [l[0] for l in PROGRAM_ROLE_CHOICES]:
            tola_user = w_factories.TolaUserFactory(country=self.country)
            w_factories.grant_program_access(
                tola_user, self.program, self.country, access_level)
            self.has_correct_permission(tola_user, access_level, 200)

    def test_result_create_view_data(self):
        management.call_command(
            'create_participant_count_indicators', execute=True, create_disaggs_themes=True, suppress_output=True)
        self.client.force_login(self.tola_user.user)
        w_factories.grant_program_access(
            self.tola_user, self.program, self.country, PROGRAM_ROLE_CHOICES[2][0])
        indicator = Indicator.objects.filter(admin_type=Indicator.ADMIN_PARTICIPANT_COUNT)[0]
        response = self.client.get(reverse('pcountcreate', args=[indicator.pk]))
        self.assertSetEqual(
            set(json.loads(response.content).keys()),
            {'outcome_themes', 'disaggregations', 'program_start_date', 'program_end_date', 'periodic_target'})


