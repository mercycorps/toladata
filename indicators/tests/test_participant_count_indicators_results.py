import json

from django import test
from django.urls import reverse
from django.core import management

from factories import workflow_models as w_factories
from factories.indicators_models import IndicatorTypeFactory, ReportingFrequencyFactory

from indicators.models import Indicator, IndicatorType, ReportingFrequency, OutcomeTheme
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
        IndicatorTypeFactory(indicator_type=IndicatorType.PC_INDICATOR_TYPE)
        ReportingFrequencyFactory(frequency=ReportingFrequency.PC_REPORTING_FREQUENCY)

    def has_correct_permission(self, tola_user, access_level, status_code):
        self.client.force_login(tola_user.user)
        w_factories.grant_program_access(
            tola_user, self.program, self.country, access_level)
        indicator = Indicator.objects.filter(admin_type=Indicator.ADMIN_PARTICIPANT_COUNT)[0]
        response = self.client.get(reverse('pcountcreate', args=[indicator.pk]))
        self.assertEqual(response.status_code, status_code)

    def get_base_result_data(self, indicator=None, result=None):
        # Gets the base dataset for a result. Only really useful after underlying data has been created, like
        # Outcome Themes and PC indicators
        if not indicator and not result:
            raise NotImplementedError('Arguments must include either indicator or result')
        if result and indicator:
            indicator = result.indicator
        if indicator.admin_type != Indicator.ADMIN_PARTICIPANT_COUNT:
            raise NotImplementedError('Indicator is not a Participant Count indicator')
        result_data = {'outcome_themes': OutcomeTheme.objects.values('id', 'name')}
        result_data['program_start_date'] = indicator.program.reporting_period_start
        result_data['program_start_end'] = indicator.program.reporting_period_end
        result_data['disaggregations'] = []
        for disagg in indicator.disaggregation.all().prefetch_related('disaggregationlabel_set', 'disaggregationlabel_set__disaggregatedvalue_set'):
            disagg_dict = {'pk': disagg.pk, 'disaggregation_type': disagg.disaggregation_type, 'labels': []}
            for label in disagg.labels:
                disagg_dict['labels'].append({
                    'label_id': label.id, 'label': label.name})
                value = label.disaggregatedvalue_set.filter(result=result)
                if value:
                    disagg_dict.update({'value_id': value[0].pk, 'value': value[0].value})
                else:
                    disagg_dict.update({'value_id': None, 'value': None})
            result_data['disaggregations'].append(disagg_dict)
        return result_data

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
        base_result_data = self.get_base_result_data(indicator)




