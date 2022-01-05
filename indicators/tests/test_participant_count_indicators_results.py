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
    Test the get_level_depth method on the Level model to assure that the depth calculation is correct.
    """
    def setUp(self):
        self.tola_user = w_factories.TolaUserFactory()
        self.program = w_factories.RFProgramFactory(country=[cls.tola_user.country], tiers=True, levels=1)
        self.client = test.Client()
        IndicatorTypeFactory(indicator_type="Custom")
        ReportingFrequencyFactory(frequency="Annual")

    def test_result_create_view(self):
        self.client.force_login(self.tola_user.user)
        w_factories.grant_program_access(self.tola_user, self.program, self.tola_user.country, PROGRAM_ROLE_CHOICES[2])
        management.call_command(
            'create_participant_count_indicators', execute=True, create_disaggs_themes=True, suppress_output=True)
        indicator = Indicator.objects.filter(admin_type=Indicator.ADMIN_PARTICIPANT_COUNT)[0]
        response = self.client.get(reverse('pcountcreate', args=[indicator.pk]))
        self.assertSetEqual(set(json.loads(response.content).keys()), {'outcome_themes', 'disaggregations'})
