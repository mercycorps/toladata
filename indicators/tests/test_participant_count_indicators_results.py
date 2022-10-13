import json

from datetime import datetime, date

from django import test
from django.urls import reverse
from django.core import management

from factories import workflow_models as w_factories
from factories import ResultFactory
from factories.indicators_models import IndicatorTypeFactory, ReportingFrequencyFactory

from indicators.models import Indicator, IndicatorType, ReportingFrequency, OutcomeTheme, Result
from workflow.models import PROGRAM_ROLE_CHOICES


class TestParticipantCountSetup(test.TestCase):
    """
    Test the views for participant count result creation and updates
    """
    today = date.today()

    def setUp(self):
        program_start = date(self.today.year, self.today.month, 1)
        program_end = date(self.today.year + 1, 6, 30)
        self.country = w_factories.CountryFactory()
        self.program = w_factories.RFProgramFactory(
            country=[self.country], tiers=True, levels=1,
            reporting_period_start=program_start, reporting_period_end=program_end)
        self.tola_user = w_factories.TolaUserFactory(country=self.country)

        self.client = test.Client()
        IndicatorTypeFactory(indicator_type=IndicatorType.PC_INDICATOR_TYPE)
        ReportingFrequencyFactory(frequency=ReportingFrequency.PC_REPORTING_FREQUENCY)

        first_fiscal_year = self.today.year if self.today.month < 7 else self.today.year + 1
        self.period_string = 'FY' + str(first_fiscal_year)
        self.pt_start = str(date(first_fiscal_year - 1, 7, 1))
        self.pt_end = str(date(first_fiscal_year, 6, 30))
        self.view_only = False

    def create_indicator_utils(self):
        """
        Create pc indicator, login, grant access
        :return pc indicator
        """
        management.call_command(
            'create_participant_count_indicators', execute=True, create_disaggs_themes=True, suppress_output=True)
        self.client.force_login(self.tola_user.user)
        w_factories.grant_program_access(
            self.tola_user, self.program, self.country, PROGRAM_ROLE_CHOICES[2][0])
        indicator = Indicator.objects.filter(admin_type=Indicator.ADMIN_PARTICIPANT_COUNT)[0]
        return indicator

    def has_correct_permission(self, tola_user, access_level, status_code):
        """
        Set up and test permissions
        """
        self.client.force_login(tola_user.user)
        w_factories.grant_program_access(
            tola_user, self.program, self.country, access_level)
        indicator = Indicator.objects.filter(admin_type=Indicator.ADMIN_PARTICIPANT_COUNT)[0]
        response = self.client.get(reverse('pcountcreate', args=[indicator.pk]))
        self.assertEqual(response.status_code, status_code)

    def get_base_result_data(self, indicator=None, result=None):
        """
        Gets the base dataset for a result. Only really useful after underlying data has been created, like
        Outcome Themes and PC indicators
        :return base result data
        """
        if not indicator and not result:
            raise NotImplementedError('Arguments must include either indicator or result')
        if result and indicator:
            indicator = result.indicator
        if indicator.admin_type != Indicator.ADMIN_PARTICIPANT_COUNT:
            raise NotImplementedError('Indicator is not a Participant Count indicator')
        result_data = {'outcome_themes': OutcomeTheme.objects.values('id', 'name', 'is_active')}
        result_data['program_start_date'] = indicator.program.reporting_period_start
        result_data['program_start_end'] = indicator.program.reporting_period_end
        result_data['disaggregations'] = []
        for disagg in indicator.disaggregation.all().prefetch_related('disaggregationlabel_set', 'disaggregationlabel_set__disaggregatedvalue_set'):
            disagg_dict = {'pk': disagg.pk, 'disaggregation_type': disagg.disaggregation_type, 'labels': []}
            for count, label in enumerate(disagg.labels):
                disagg_dict['labels'].append({
                    'disaggregationlabel_id': label.id, 'label': label.name})
                value = label.disaggregatedvalue_set.filter(result=result)
                if value:
                    disagg_dict['labels'][count].update({'value_id': value[0].pk, 'value': value[0].value})
                else:
                    disagg_dict['labels'][count].update({'value_id': None, 'value': None})
                if 'Indirect' in disagg_dict['disaggregation_type']:
                    disagg_dict.update({'count_type': 'indirect'})
                else:
                    disagg_dict.update({'count_type': 'direct'})

            result_data['disaggregations'].append(disagg_dict)
        return result_data

    def update_base_results(self, base_result_data):
        """
        Add disaggregation values to base_result_data, collect values in list
        :returns updated base result data, disagg value list
        """
        updated_disagg_values = []
        for disagg in base_result_data['disaggregations']:
            if disagg['disaggregation_type'] == 'SADD (including unknown) with double counting':
                disagg['labels'][1]['value'] = 1
                updated_disagg_values.append(1.00)
            if disagg['disaggregation_type'] == 'Actual with double counting':
                disagg['labels'][0]['value'] = 1
                updated_disagg_values.append(1.00)
                disagg['labels'][1]['value'] = 1
                updated_disagg_values.append(1.00)
        return base_result_data, updated_disagg_values

    def create_result(self, pt, indicator):
        """
        Create result object
        :param pt:
        :param indicator:
        :return: result
        """
        result = ResultFactory(
            periodic_target=pt,
            indicator=indicator,
            program=self.program,
            date_collected=self.today
        )
        return result

    def get_outcome_theme_list(self, result):
        """
        Create list with outcome theme ids
        :param result:
        :return: outcome theme id list
        """
        ot_object = result.outcome_themes.filter(is_active=True)
        ot_list = []
        for ot in ot_object:
            ot_list.append(getattr(ot, 'id'))
        return ot_list

    def test_result_create_view_permissions(self):
        """
        Tests that permissions are correct
        """
        management.call_command(
            'create_participant_count_indicators', execute=True, create_disaggs_themes=True, suppress_output=True)
        for access_level in [l[0] for l in PROGRAM_ROLE_CHOICES]:
            tola_user = w_factories.TolaUserFactory(country=self.country)
            w_factories.grant_program_access(
                tola_user, self.program, self.country, access_level)
            self.has_correct_permission(tola_user, access_level, 200)

    def test_result_create_view_data(self):
        """
        Tests data for create result view
        """
        indicator = self.create_indicator_utils()
        response = self.client.get(reverse('pcountcreate', args=[indicator.pk]))
        data = json.loads(response.content)

        self.assertSetEqual(
            set(data.keys()),
            {'outcome_themes', 'disaggregations', 'program_start_date', 'program_end_date', 'periodic_target',
             'pt_start_date', 'pt_end_date'})
        self.assertEqual(data['pt_start_date'], self.pt_start)
        self.assertEqual(data['pt_end_date'], self.pt_end)

    def test_result_create_view(self):
        """
        Tests create result view functionality
        """
        indicator = self.create_indicator_utils()
        # Get base result data and update it
        base_result_data = self.get_base_result_data(indicator)
        updated_base_result_data, updated_disagg_values = self.update_base_results(base_result_data)
        disaggs = updated_base_result_data['disaggregations']
        outcome_theme = [base_result_data['outcome_themes'].last()['id']]
        payload = {'disaggregations': disaggs, 'outcome_theme': outcome_theme,
                   'date_collected': date.today(), 'indicator': indicator.pk}
        response_post = self.client.post(reverse('pcountcreate', args=[indicator.pk]), data=payload,
                                         content_type='application/json')
        updated_result = Result.objects.filter(indicator=indicator.pk).first()
        outcome_themes_list = self.get_outcome_theme_list(updated_result)
        disagg_values = []
        for disagg in updated_result.disaggregated_values:
            disagg_values.append(disagg.value)

        self.assertEqual(response_post.status_code, 200)
        self.assertEqual(outcome_themes_list, outcome_theme)
        self.assertEqual(disagg_values, updated_disagg_values)


    def test_result_update(self):
        """
        Tests result update view functionality with preset result and modified result data
        """
        indicator = self.create_indicator_utils()

        # First fiscal year periodic target for pc indicator
        pt = indicator.periodictargets.all().first()
        # Create result object in db
        result = self.create_result(pt, indicator)
        # Get base result data
        base_result_data = self.get_base_result_data(indicator)
        # Add outcome theme 'Economic Opportunity'
        base_outcome_theme = base_result_data['outcome_themes'].first()['id']
        result.outcome_themes.add(base_outcome_theme)

        response_get = self.client.get(reverse('pcountupdate', args=[result.pk]))
        data = json.loads(response_get.content)

        self.assertEqual(response_get.status_code, 200)
        self.assertEqual(data['periodic_target']['period'], self.period_string)
        self.assertEqual(data['date_collected'], str(self.today))
        self.assertTrue(data['outcome_themes'][0][2])
        self.assertEqual(data['view_only'], self.view_only)
        self.assertEqual(data['pt_start_date'], self.pt_start)
        self.assertEqual(data['pt_end_date'], self.pt_end)

        # Modify and save result data
        updated_base_result_data, updated_disagg_values = self.update_base_results(base_result_data)
        disaggs = updated_base_result_data['disaggregations']
        # Adding a second outcome theme to the existing one
        outcome_theme = [base_outcome_theme, base_result_data['outcome_themes'].last()['id']]
        url = reverse('pcountupdate', args=[result.pk])
        payload = {'disaggregations': disaggs, 'outcome_theme': outcome_theme,
                   'rationale': 'test'}
        response_post = self.client.put(url, data=payload, content_type='application/json')
        # Getting updated result object
        updated_result = Result.objects.get(pk=result.pk)
        # Fetching outcome themes from updated result object and adding them to list
        ot_list = self.get_outcome_theme_list(updated_result)
        disagg_values = []
        for disagg in updated_result.disaggregated_values:
            disagg_values.append(disagg.value)

        self.assertEqual(response_post.status_code, 200)
        self.assertEqual(updated_result.periodic_target.period, self.period_string)
        self.assertEqual(ot_list, outcome_theme)
        self.assertEqual(disagg_values, updated_disagg_values)
