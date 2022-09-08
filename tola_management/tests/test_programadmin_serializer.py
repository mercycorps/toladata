from django import test
from workflow.models import Country, IDAASector, Program
from indicators.models import IDAAOutcomeTheme
from rest_framework.test import APIClient
from factories.workflow_models import UserFactory
from django.shortcuts import reverse


class TestProgramAdminSerializer(test.TestCase):
    list_url = 'tolamanagementprograms-list'
    detail_url = 'tolamanagementprograms-detail'
    error_messages = {
        'external_program_id': ['This field may not be null.'],
        'name': ['This field may not be blank.'],
        'funding_status': ['This field may not be blank.'], 
        'country': ['This field may not be blank.'], 
        'start_date': ['Date has wrong format. Use one of these formats instead: YYYY-MM-DD.', 'The program start date may not be more than 10 years in the past.'], 
        'end_date': ['Date has wrong format. Use one of these formats instead: YYYY-MM-DD.', 'The program end date may not be more than 10 years in the future.'],
        'gaitid': ['Duplicate GAIT ID numbers are not allowed.', 'A valid integer is required.', 'Ensure this value is less than or equal to 99999.']
    }
    
    def setUp(self):
        self.default_sector = IDAASector(sector='Agriculture')
        self.default_sector.save()

        self.default_outcome_theme = IDAAOutcomeTheme(name='Food Security')
        self.default_outcome_theme.save()

        self.default_country = Country(country='Afghanistan', code='AF')
        self.default_country.save()

        user = UserFactory(first_name="first", last_name="last", username="program-admin-test", is_superuser=True)
        user.set_password('password')
        user.save()

        self.client = APIClient()
        self.client.login(username="program-admin-test", password="password")

    @property
    def empty_program(self):
        return {
            "external_program_id": None,
            "name": "",
            "funding_status": "",
            "start_date": "",
            "end_date": "",
            "gaitid": [],
            "country": [],
            "idaa_sector": [],
            "idaa_outcome_theme": []
        }

    @property
    def default_program(self):
        return {
            "external_program_id": 1234,
            "name": "Program Test",
            "funding_status": "Funded",
            "start_date": "2022-01-01",
            "end_date": "2024-01-01",
            "gaitid": [
                {
                    "gaitid": 1234,
                    "donor": "donor",
                    "donor_dept": "donordept",
                    "fund_code": [30123, 30321]
                },
                {
                    "gaitid": 4321,
                    "donor": "donor",
                    "donor_dept": "donordept",
                    "fund_code": [30111, 30222]
                }
            ],
            "country": [self.default_country.id],
            "idaa_sector": [self.default_sector.id],
            "idaa_outcome_theme": [self.default_outcome_theme.id],
        }

    def assert_errors(self, response):
        for key, _ in self.empty_program.items():
            if key in self.error_messages and key in response:
                for error_message in response[key]:
                    self.assertIn(error_message, self.error_messages[key])

    def test_create(self):
        response = self.client.post(reverse(self.list_url), data=self.default_program, format='json')

        self.assertEqual(response.status_code, 201)

    def test_invalid_create(self):
        data = self.empty_program
        response = self.client.post(reverse(self.list_url), data=data, format='json')

        self.assertEqual(response.status_code, 400)

        self.assert_errors(response.json())

    def test_invalid_values(self):
        data = self.default_program
        data['start_date'] = '2000-01-01'
        data['end_date'] = '2050-01-01'
        response = self.client.post(reverse(self.list_url), data=data, format='json')

        self.assertEqual(response.status_code, 400)

        self.assert_errors(response.json())

    def test_duplicate_gaitids(self):
        data = self.default_program
        data['gaitid'].append(data['gaitid'][0])
        response = self.client.post(reverse(self.list_url), data=data, format='json')
        
        self.assertEqual(response.status_code, 400)

        self.assert_errors(response.json())

    def test_nan_gaitid_fundcodes(self):
        data = self.default_program
        data['gaitid'][0]['gaitid'] = 'aaaa'
        data['gaitid'][0]['fund_code'].append('aaaa')
        response = self.client.post(reverse(self.list_url), data=data, format='json')
        
        self.assertEqual(response.status_code, 400)

        self.assert_errors(response.json()['gaitid'])

    def test_max_value_gaitid_fundcodes(self):
        data = self.default_program
        data['gaitid'][0]['gaitid'] = 999999
        data['gaitid'][0]['fund_code'].append(999999)
        response = self.client.post(reverse(self.list_url), data=data, format='json')
        
        self.assertEqual(response.status_code, 400)

        self.assert_errors(response.json()['gaitid'])

    def test_update_program(self):
        data = self.default_program

        response = self.client.post(reverse(self.list_url), data=data, format='json')

        self.assertEqual(response.status_code, 201)

        data['name'] = 'Program Update'
        data['gaitid'].pop(1)

        response = self.client.put(reverse(self.detail_url, kwargs={'pk': response.json()['id']}), data=data, format='json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['gaitid']), 1)
        self.assertEqual(response.json()['name'], 'Program Update')
