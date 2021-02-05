"""Tests for the country serializer and viewset serving the admin Lite countries page"""


from django import test
from workflow.models import Country
from factories.workflow_models import (
    CountryFactory,
    RFProgramFactory,
    TolaUserFactory,
    OrganizationFactory,
    grant_program_access,
    grant_country_access,
    PROGRAM_ROLE_CHOICES,
    COUNTRY_ROLE_CHOICES
)
from factories.tola_management_models import CountryAdminAuditLogFactory
from tola_management.countryadmin import (
    CountryAdminViewSet,
    CountryAdminSerializer,
    CountryAdminAuditLogSerializer
)

SPECIAL_CHARS = "Spécîål Chärs"

class TestCountryAdminSerializer(test.TestCase):
    def get_serialized_data(self, pk):
        with self.assertNumQueries(4): # 4 queries: 2 prefetches and one SU count
            qs = CountryAdminViewSet.annotate_queryset(Country.objects.filter(pk=pk))
            return CountryAdminSerializer(qs, many=True).data[0]

    def test_basic_country_data(self):
        c = CountryFactory()
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['id'], c.pk)
        self.assertEqual(data['code'], c.code)
        self.assertEqual(data['country'], c.country)
        self.assertEqual(data['description'], c.description)

    def test_special_characters(self):
        c = CountryFactory(country=SPECIAL_CHARS, description=SPECIAL_CHARS)
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['country'], SPECIAL_CHARS)
        self.assertEqual(data['description'], SPECIAL_CHARS)

    def test_programs_count(self):
        # should start with no programs:
        c = CountryFactory()
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['programs_count'], 0)
        # adding a program in country adds to the count
        p = RFProgramFactory(country=[c])
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['programs_count'], 1)
        # adding a program not in country doesn't add to the count:
        d = CountryFactory()
        p2 = RFProgramFactory(country=[d])
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['programs_count'], 1)
        # adding a multicountry program addds to the count
        p3 = RFProgramFactory(country=[c, d])
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['programs_count'], 2)

    def test_users_count(self):
        # should start with no users:
        c = CountryFactory()
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['users_count'], 0)
        # add one country access admin user:
        admin = TolaUserFactory(mc_staff=True, superadmin=False)
        grant_country_access(admin, c, COUNTRY_ROLE_CHOICES[1][0])
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['users_count'], 1)
        # add one country access regualr user:
        user = TolaUserFactory(mc_staff=True, superadmin=False)
        grant_country_access(user, c, COUNTRY_ROLE_CHOICES[0][0])
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['users_count'], 2)
        # add one program with one partner access user:
        p = RFProgramFactory(country=[c])
        partner_admin = TolaUserFactory(mc_staff=False, superadmin=False)
        grant_program_access(partner_admin, p, c, PROGRAM_ROLE_CHOICES[1][0])
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['users_count'], 3)
        # add a partner access non-admin:
        partner_user = TolaUserFactory(mc_staff=False, superadmin=False)
        grant_program_access(partner_user, p, c, PROGRAM_ROLE_CHOICES[0][0])
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['users_count'], 4)
        # add a superuser (access to programs in _all_ countries):
        superadmin = TolaUserFactory(mc_staff=True, superadmin=True)
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['users_count'], 5)

    def test_organizations_count(self):
        mc_org = OrganizationFactory(id=1, name="Mercy Corps")
        partner_org1 = OrganizationFactory()
        partner_org2 = OrganizationFactory()
        # should start with no orgs:
        c = CountryFactory()
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['organizations_count'], 0)
        # add one mc user (should count mc org now)
        admin = TolaUserFactory(mc_staff=True, superadmin=False)
        grant_country_access(admin, c, COUNTRY_ROLE_CHOICES[1][0])
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['organizations_count'], 1)
        # add another mc user (should not increase)
        user = TolaUserFactory(mc_staff=True, superadmin=False)
        grant_country_access(user, c, COUNTRY_ROLE_CHOICES[0][0])
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['organizations_count'], 1)
        # add a superuser, should not increase (still mc)
        superadmin = TolaUserFactory(mc_staff=True, superadmin=True)
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['organizations_count'], 1)
        # add a partner with one user, should add to count
        p = RFProgramFactory(country=[c])
        partner_admin = TolaUserFactory(mc_staff=False, superadmin=False, organization=partner_org1)
        grant_program_access(partner_admin, p, c, PROGRAM_ROLE_CHOICES[1][0])
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['organizations_count'], 2)
        # second user, same org, shouldn't add:
        partner_user = TolaUserFactory(mc_staff=False, superadmin=False, organization=partner_org1)
        grant_program_access(partner_user, p, c, PROGRAM_ROLE_CHOICES[0][0])
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['organizations_count'], 2)
        # add a second org with a user, should add:
        partner_user2 = TolaUserFactory(mc_staff=False, superadmin=False, organization=partner_org2)
        grant_program_access(partner_user2, p, c, PROGRAM_ROLE_CHOICES[0][0])
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['organizations_count'], 3)

    def test_mc_user_with_program_access_edge_case(self):
        c = CountryFactory()
        admin = TolaUserFactory(mc_staff=True, superadmin=False)
        grant_country_access(admin, c, COUNTRY_ROLE_CHOICES[1][0])
        p1 = RFProgramFactory(country=[c])
        user = TolaUserFactory(mc_staff=True, superadmin=False)
        grant_program_access(user, p1, c, PROGRAM_ROLE_CHOICES[0][0])
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['users_count'], 2)
        self.assertEqual(data['organizations_count'], 1)

    def test_superuser_with_country_access_edge_case(self):
        c = CountryFactory()
        admin = TolaUserFactory(mc_staff=True, superadmin=False)
        grant_country_access(admin, c, COUNTRY_ROLE_CHOICES[1][0])
        superadmin = TolaUserFactory(mc_staff=True, superadmin=True)
        grant_country_access(superadmin, c, COUNTRY_ROLE_CHOICES[1][0])
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['users_count'], 2)
        self.assertEqual(data['organizations_count'], 1)

    def test_mc_user_with_program_access_and_country_access_edge_case(self):
        c = CountryFactory()
        admin = TolaUserFactory(mc_staff=True, superadmin=False)
        grant_country_access(admin, c, COUNTRY_ROLE_CHOICES[1][0])
        p = RFProgramFactory(country=[c])
        user = TolaUserFactory(mc_staff=True, superadmin=False)
        grant_country_access(user, c, COUNTRY_ROLE_CHOICES[0][0])
        grant_program_access(user, p, c, PROGRAM_ROLE_CHOICES[2][0])
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['users_count'], 2)
        self.assertEqual(data['organizations_count'], 1)

    def test_partner_user_in_same_program_different_country_edge_case(self):
        c = CountryFactory()
        admin = TolaUserFactory(mc_staff=True, superadmin=False)
        grant_country_access(admin, c, COUNTRY_ROLE_CHOICES[1][0])
        d = CountryFactory()
        p = RFProgramFactory(country=[c, d])
        partner_org1 = OrganizationFactory()
        partner_user1 = TolaUserFactory(mc_staff=False, superadmin=False, organization=partner_org1)
        grant_program_access(partner_user1, p, c, PROGRAM_ROLE_CHOICES[2][0])
        partner_org2 = OrganizationFactory()
        partner_user2 = TolaUserFactory(mc_staff=False, superadmin=False, organization=partner_org2)
        grant_program_access(partner_user2, p, d, PROGRAM_ROLE_CHOICES[2][0])
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['users_count'], 2)
        self.assertEqual(data['organizations_count'], 2)


class TestCountryAdminAuditLogSerializer(test.TestCase):
    def test_handles_empty_admin_user(self):
        log_entry = CountryAdminAuditLogFactory()
        serialized_log = CountryAdminAuditLogSerializer(log_entry)
        self.assertIsNotNone(serialized_log.data['admin_user'])

        log_entry.admin_user = None
        log_entry.save()
        serialized_log = CountryAdminAuditLogSerializer(log_entry)
        self.assertIsNone(serialized_log.data['admin_user'])

        log_entry.disaggregation_type = None
        log_entry.save()
        serialized_log = CountryAdminAuditLogSerializer(log_entry)
        self.assertEqual(serialized_log.data['disaggregation_type'], '')



class TestCountryAdminViewSetFilters(test.TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.base_country = CountryFactory(country="ZZZZ")
        cls.mc = OrganizationFactory(id=1)
        cls.superadmin = TolaUserFactory(mc_staff=True, superadmin=True, country=cls.base_country)
        cls.first_page_countries = CountryFactory.create_batch(20)
        cls.one_program_country = CountryFactory(country="YYYY")
        cls.one_country_program = RFProgramFactory(country=[cls.one_program_country])
        cls.multi_country_program_country1 = CountryFactory(country="XXXXX1")
        cls.multi_country_program_country2 = CountryFactory(country="XXXXX2")
        cls.multi_country_program = RFProgramFactory(
            country=[cls.multi_country_program_country1, cls.multi_country_program_country2])
        cls.one_organization_country = CountryFactory(country="VVVVV")
        cls.partner_organization1 = OrganizationFactory()
        partner_program = RFProgramFactory(country=[cls.one_organization_country])
        partner_user = TolaUserFactory(mc_staff=False, organization=cls.partner_organization1)
        grant_program_access(partner_user, partner_program, cls.one_organization_country, PROGRAM_ROLE_CHOICES[2][0])
        cls.two_organization_country = CountryFactory(country="VVVVV")
        cls.other_organization_country = CountryFactory(country="VVVVV2")
        cls.partner_organization2 = OrganizationFactory()
        partner_program2 = RFProgramFactory(country=[cls.two_organization_country])
        partner_user2 = TolaUserFactory(mc_staff=False, organization=cls.partner_organization2)
        grant_program_access(partner_user2, partner_program2, cls.two_organization_country, PROGRAM_ROLE_CHOICES[1][0])
        cls.partner_organization3 = OrganizationFactory()
        partner_program3 = RFProgramFactory(country=[cls.two_organization_country, cls.other_organization_country])
        partner_user3 = TolaUserFactory(mc_staff=False, organization=cls.partner_organization3)
        grant_program_access(partner_user3, partner_program3, cls.two_organization_country, PROGRAM_ROLE_CHOICES[1][0])
        partner_user4 = TolaUserFactory(mc_staff=False, organization=cls.partner_organization3)
        grant_program_access(partner_user4, partner_program3,
                             cls.other_organization_country, PROGRAM_ROLE_CHOICES[0][0])


    def setUp(self):
        self.client = test.Client()
        self.client.force_login(user=self.superadmin.user)

    def tearDown(self):
        self.client.logout()

    def get_countries_data(self, **filters):
        page = filters.pop('page', 1)
        url = f'/api/tola_management/country/?page={page}'
        for key, value in filters.items():
            if isinstance(value, list):
                url += ''.join(f'&{key}[]={v}' for v in value)
            else:
                url += f'&{key}={value}'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        return response.json()

    def test_pagination(self):
        data = self.get_countries_data()
        self.assertEqual(data['count'], 31)
        self.assertEqual(data['page_count'], 2)
        self.assertEqual(len(data['results']), 20)

    def test_one_program_programs_filter(self):
        data = self.get_countries_data(programs=[self.one_country_program.pk])
        self.assertEqual(data['count'], 1)
        self.assertEqual(len(data['results']), 1)
        result = data['results'][0]
        self.assertEqual(result['id'], self.one_program_country.pk)
        self.assertEqual(result['country'], "YYYY")
        self.assertEqual(result['description'], self.one_program_country.description)
        self.assertEqual(result['code'], self.one_program_country.code)
        self.assertEqual(result['programs_count'], 1)
        self.assertEqual(result['organizations_count'], 1)
        self.assertEqual(result['users_count'], 1)

    def test_multiple_country_program_programs_filter(self):
        data = self.get_countries_data(programs=[self.multi_country_program.pk])
        self.assertEqual(data['count'], 2)
        self.assertEqual(len(data['results']), 2)
        self.assertEqual(data['results'][0]['id'], self.multi_country_program_country1.pk)
        self.assertEqual(data['results'][1]['id'], self.multi_country_program_country2.pk)

    def test_multiple_programs_programs_filter(self):
        data = self.get_countries_data(programs=[self.one_country_program.pk, self.multi_country_program.pk])
        self.assertEqual(data['count'], 3)
        self.assertEqual(len(data['results']), 3)
        for c, country in enumerate([
                self.multi_country_program_country1, self.multi_country_program_country2,
                self.one_program_country]):
            self.assertEqual(data['results'][c]['id'], country.pk)
            self.assertEqual(data['results'][c]['country'], country.country)

    def test_one_organization_organizations_filter(self):
        data = self.get_countries_data(organizations=[self.partner_organization1.pk])
        self.assertEqual(data['count'], 1)
        self.assertEqual(len(data['results']), 1)
        self.assertEqual(data['results'][0]['id'], self.one_organization_country.pk)
        self.assertEqual(data['results'][0]['organizations_count'], 2)
        self.assertEqual(data['results'][0]['users_count'], 2)
        self.assertEqual(data['results'][0]['programs_count'], 1)

    def test_two_organizations_organizations_filter(self):
        data = self.get_countries_data(organizations=[self.partner_organization2.pk])
        self.assertEqual(data['count'], 1)
        self.assertEqual(len(data['results']), 1)
        self.assertEqual(data['results'][0]['id'], self.two_organization_country.pk)
        self.assertEqual(data['results'][0]['organizations_count'], 3)
        self.assertEqual(data['results'][0]['users_count'], 3)
        self.assertEqual(data['results'][0]['programs_count'], 2)
        data = self.get_countries_data(organizations=[self.partner_organization3.pk])
        self.assertEqual(data['count'], 2)
        self.assertEqual(len(data['results']), 2)
        self.assertEqual(data['results'][0]['id'], self.two_organization_country.pk)
        self.assertEqual(data['results'][0]['organizations_count'], 3)
        self.assertEqual(data['results'][0]['users_count'], 3)
        self.assertEqual(data['results'][0]['programs_count'], 2)
        self.assertEqual(data['results'][1]['id'], self.other_organization_country.pk)
        self.assertEqual(data['results'][1]['organizations_count'], 2)
        self.assertEqual(data['results'][1]['users_count'], 2)
        self.assertEqual(data['results'][1]['programs_count'], 1)

    def test_multiple_organizations_organizations_filter(self):
        data = self.get_countries_data(organizations=[
            self.partner_organization1.pk, self.partner_organization2.pk])
        self.assertEqual(data['count'], 2)
        self.assertEqual(len(data['results']), 2)
        data = self.get_countries_data(organizations=[
            self.partner_organization1.pk, self.partner_organization3.pk])
        self.assertEqual(data['count'], 3)
        self.assertEqual(len(data['results']), 3)

    def test_one_country_countries_filter(self):
        data = self.get_countries_data(countries=[self.one_program_country.pk])
        self.assertEqual(data['count'], 1)
        self.assertEqual(len(data['results']), 1)
        self.assertEqual(data['results'][0]['id'], self.one_program_country.pk)

    def test_many_country_countries_filter(self):
        data = self.get_countries_data(
            countries=[c.pk for c in self.first_page_countries[0:5]]
        )
        self.assertEqual(data['count'], 5)
        self.assertEqual(len(data['results']), 5)
