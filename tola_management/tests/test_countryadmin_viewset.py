"""Tests for the country serializer and viewset serving the admin Lite countries page"""


from django import test
from workflow.models import Country
from factories.workflow_models import (
    CountryFactory,
    RFProgramFactory,
    NewTolaUserFactory,
    OrganizationFactory,
    grant_program_access,
    grant_country_access,
    PROGRAM_ROLE_CHOICES,
    COUNTRY_ROLE_CHOICES
)
from tola_management.countryadmin import (
    CountryAdminViewSet,
    CountryAdminSerializer
)

SPECIAL_CHARS = "Spécîål Chärs"

class TestCountryAdminSerializer(test.TestCase):
    def get_serialized_data(self, pk):
        with self.assertNumQueries(2):
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
        admin = NewTolaUserFactory(mc_staff=True, superadmin=False)
        grant_country_access(admin, c, COUNTRY_ROLE_CHOICES[1][0])
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['users_count'], 1)
        # add one country access regualr user:
        user = NewTolaUserFactory(mc_staff=True, superadmin=False)
        grant_country_access(user, c, COUNTRY_ROLE_CHOICES[0][0])
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['users_count'], 2)
        # add one program with one partner access user:
        p = RFProgramFactory(country=[c])
        partner_admin = NewTolaUserFactory(mc_staff=False, superadmin=False)
        grant_program_access(partner_admin, p, c, PROGRAM_ROLE_CHOICES[1][0])
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['users_count'], 3)
        # add a partner access non-admin:
        partner_user = NewTolaUserFactory(mc_staff=False, superadmin=False)
        grant_program_access(partner_user, p, c, PROGRAM_ROLE_CHOICES[0][0])
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['users_count'], 4)
        # add a superuser (access to programs in _all_ countries):
        superadmin = NewTolaUserFactory(mc_staff=True, superadmin=True)
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
        admin = NewTolaUserFactory(mc_staff=True, superadmin=False)
        grant_country_access(admin, c, COUNTRY_ROLE_CHOICES[1][0])
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['organizations_count'], 1)
        # add another mc user (should not increase)
        user = NewTolaUserFactory(mc_staff=True, superadmin=False)
        grant_country_access(user, c, COUNTRY_ROLE_CHOICES[0][0])
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['organizations_count'], 1)
        # add a superuser, should not increase (still mc)
        superadmin = NewTolaUserFactory(mc_staff=True, superadmin=True)
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['organizations_count'], 1)
        # add a partner with one user, should add to count
        p = RFProgramFactory(country=[c])
        partner_admin = NewTolaUserFactory(mc_staff=False, superadmin=False, organization=partner_org1)
        grant_program_access(partner_admin, p, c, PROGRAM_ROLE_CHOICES[1][0])
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['organizations_count'], 2)
        # second user, same org, shouldn't add:
        partner_user = NewTolaUserFactory(mc_staff=False, superadmin=False, organization=partner_org1)
        grant_program_access(partner_user, p, c, PROGRAM_ROLE_CHOICES[0][0])
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['organizations_count'], 2)
        # add a second org with a user, should add:
        partner_user2 = NewTolaUserFactory(mc_staff=False, superadmin=False, organization=partner_org2)
        grant_program_access(partner_user2, p, c, PROGRAM_ROLE_CHOICES[0][0])
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['organizations_count'], 3)

    def test_mc_user_with_program_access_edge_case(self):
        c = CountryFactory()
        admin = NewTolaUserFactory(mc_staff=True, superadmin=False)
        grant_country_access(admin, c, COUNTRY_ROLE_CHOICES[1][0])
        p1 = RFProgramFactory(country=[c])
        user = NewTolaUserFactory(mc_staff=True, superadmin=False)
        grant_program_access(user, p1, c, PROGRAM_ROLE_CHOICES[0][0])
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['users_count'], 2)
        self.assertEqual(data['organizations_count'], 1)

    def test_superuser_with_country_access_edge_case(self):
        c = CountryFactory()
        admin = NewTolaUserFactory(mc_staff=True, superadmin=False)
        grant_country_access(admin, c, COUNTRY_ROLE_CHOICES[1][0])
        superadmin = NewTolaUserFactory(mc_staff=True, superadmin=True)
        grant_country_access(superadmin, c, COUNTRY_ROLE_CHOICES[1][0])
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['users_count'], 2)
        self.assertEqual(data['organizations_count'], 1)

    def test_mc_user_with_program_access_and_country_access_edge_case(self):
        c = CountryFactory()
        admin = NewTolaUserFactory(mc_staff=True, superadmin=False)
        grant_country_access(admin, c, COUNTRY_ROLE_CHOICES[1][0])
        p = RFProgramFactory(country=[c])
        user = NewTolaUserFactory(mc_staff=True, superadmin=False)
        grant_country_access(user, c, COUNTRY_ROLE_CHOICES[0][0])
        grant_program_access(user, p, c, PROGRAM_ROLE_CHOICES[2][0])
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['users_count'], 2)
        self.assertEqual(data['organizations_count'], 1)

    def test_partner_user_in_same_program_different_country_edge_case(self):
        c = CountryFactory()
        admin = NewTolaUserFactory(mc_staff=True, superadmin=False)
        grant_country_access(admin, c, COUNTRY_ROLE_CHOICES[1][0])
        d = CountryFactory()
        p = RFProgramFactory(country=[c, d])
        partner_org1 = OrganizationFactory()
        partner_user1 = NewTolaUserFactory(mc_staff=False, superadmin=False, organization=partner_org1)
        grant_program_access(partner_user1, p, c, PROGRAM_ROLE_CHOICES[2][0])
        partner_org2 = OrganizationFactory()
        partner_user2 = NewTolaUserFactory(mc_staff=False, superadmin=False, organization=partner_org2)
        grant_program_access(partner_user2, p, d, PROGRAM_ROLE_CHOICES[2][0])
        data = self.get_serialized_data(c.pk)
        self.assertEqual(data['users_count'], 2)
        self.assertEqual(data['organizations_count'], 2)