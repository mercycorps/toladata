"""One test suite for testing the filtered results from the Users, Programs, Orgs, and Countries admins

    - one test suite so integrative tests requiring heavy setup can be set up once and tested
    - also an opportunity to test that counts displayed as "associated Users/Programs/Organizations" can be
        easily tested against the filtered results those links would display

    cases to catch:
    countries -> 

"""

from django import test
from factories.workflow_models import (
    RFProgramFactory,
    NewTolaUserFactory,
    OrganizationFactory,
    CountryFactory
)

class AdminScenario:
    countries_count = 21

    def __init__(self):
        self.first_page_countries = {}
        CountryFactory.reset_sequence()
        mc = OrganizationFactory(id=1, name="Mercy Corps")
        base_country = CountryFactory(country="ZZZZZZZZZZZ")
        self.superadmin = NewTolaUserFactory(mc_staff=True, superadmin=True, country=base_country)
        self.superusers = NewTolaUserFactory.create_batch(10, mc_staff=True, superadmin=True, country=base_country)
        self.get_countries()

    def get_countries(self):

        for x in range(19):
            country = CountryFactory(country=f"AAAAAAB{x}")
            self.first_page_countries[country.pk] = {
                'country': country.country,
                'description': country.description,
                'code': country.code,
                'programs_count': 0,
                'users_count': 11,
                'organizations_count': 0
            }


class TestAdminLiteFilterCounts(test.TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.scenario = AdminScenario()
        cls.client = test.Client()

    def setUp(self):
        self.client.force_login(user=self.scenario.superadmin.user)

    def tearDown(self):
        self.client.logout()

    def get_countries_data(self, page=1, filters=None):
        url = f'/api/tola_management/country/?page={page}'
        if filters is not None:
            for k, v in filters.items():
                if isinstance(v, list):
                    param_string = ''.join([f'&{k}[]={item}' for item in v])
                else:
                    param_string = f'&{k}={v}'
                url += param_string
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        return response.json()

    def test_countries_data(self):
        # test count:
        data = self.get_countries_data()
        self.assertEqual(data['count'], self.scenario.countries_count)
        # test pagination:
        self.assertEqual(len(data['results']), 20)
        results = {r['id']: r for r in data['results']}
        for pk, country_data in self.scenario.first_page_countries.items():
            self.assertIn(pk, results)
            self.assertEqual(country_data['country'], results[pk]['country'])
            self.assertEqual(country_data['description'], results[pk]['description'])
            self.assertEqual(country_data['programs_count'], results[pk]['programs_count'])
            self.assertEqual(country_data['users_count'], results[pk]['users_count'])
            self.assertEqual(country_data['organizations_count'], results[pk]['organizations_count'])