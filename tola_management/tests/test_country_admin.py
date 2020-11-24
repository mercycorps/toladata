from django.test import TestCase, RequestFactory
from factories.workflow_models import (
    ProgramFactory,
    NewCountryFactory,
    NewTolaUserFactory,
    OrganizationFactory,
    grant_country_access
)
from workflow.models import COUNTRY_ROLE_CHOICES, Program, Country, Organization
from tola_management.views import get_country_page_context


class TestCountryAdminViewSet(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.mc_org = OrganizationFactory(id=1, name="MC")
        cls.base_country = NewCountryFactory(country="Base Country", code="BC")
        ProgramFactory.create_batch(2, countries=[cls.base_country])
        cls.superadmin = NewTolaUserFactory(
            country=cls.base_country,
            superadmin=True
        )

    def setUp(self):
        super().setUp()
        request_factory = RequestFactory()
        self.request = request_factory.get('/api/tola_management/country/')

    def test_get_country_page_context(self):
        countries = NewCountryFactory.create_batch(3)
        ProgramFactory.create_batch(4, countries=[countries[0]])
        ProgramFactory(countries=countries[:2])
        OrganizationFactory.create_batch(4)

        self.request.user = self.superadmin.user
        response = get_country_page_context(self.request)
        self.assertTrue(response['is_superuser'])
        self.assertEqual(len(response['countries']), Country.objects.count())
        self.assertEqual(len(response['organizations']), Organization.objects.count())
        self.assertEqual(len(response['programs']), Program.objects.count())

        non_superuser = NewTolaUserFactory(organization=self.mc_org, country=self.base_country)
        self.request.user = non_superuser.user

        grant_country_access(non_superuser, countries[0], COUNTRY_ROLE_CHOICES[1][0])
        response = get_country_page_context(self.request)
        self.assertFalse(response['is_superuser'])
        self.assertEqual(len(response['countries']), 1)
        self.assertEqual(len(response['organizations']), Organization.objects.count())
        self.assertEqual(len(response['programs']), 5)
        grant_country_access(non_superuser, self.base_country, COUNTRY_ROLE_CHOICES[1][0])
        response = get_country_page_context(self.request)
        self.assertEqual(len(response['countries']), 2)
        self.assertEqual(len(response['programs']), 7)
        multi_country_items = [p for p in response['programs'] if len(p['country']) > 1]
        self.assertEqual(len(multi_country_items), 1)
        self.assertEqual(multi_country_items[0]['country'], [countries[0].id, countries[1].id])





