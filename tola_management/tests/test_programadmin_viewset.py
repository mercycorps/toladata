"""Tests for the program admin viewset ensuring query counts remain O(n) and all fields are accurate"""


from django import test
from django.db import models
from tola_management.programadmin import ProgramAdminSerializer, ProgramAdminViewSet
from factories.workflow_models import (
    RFProgramFactory,
    OrganizationFactory,
    CountryFactory,
    SectorFactory,
    NewTolaUserFactory,
    grant_program_access,
    grant_country_access,
    PROGRAM_ROLE_CHOICES,
    COUNTRY_ROLE_CHOICES
)
from workflow.models import Program, TolaUser

SPECIAL_CHARS = "Spécîal Chåracters"

class TestProgramBaseFields(test.TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.country1 = CountryFactory(code='TT', country='TestLand')
        cls.country2 = CountryFactory(code='UU', country='UtherTestLand')

    def test_base_program_info(self):
        program = RFProgramFactory(
            name=SPECIAL_CHARS,
            funding_status='funded',
            gaitid='123456',
            description="A description"
        )
        queryset = ProgramAdminViewSet.base_queryset().all()
        data = ProgramAdminSerializer(queryset, many=True).data[0]
        self.assertEqual(data['name'], SPECIAL_CHARS)
        self.assertEqual(data['funding_status'], 'funded')
        self.assertEqual(data['gaitid'], '123456')
        self.assertEqual(data['description'], 'A description')
        self.assertEqual(data['id'], program.pk)

    def test_program_sector_info(self):
        sector1 = SectorFactory()
        sector2 = SectorFactory()
        _ = SectorFactory()
        program = RFProgramFactory()
        program.sector.set([sector1, sector2])
        queryset = ProgramAdminViewSet.base_queryset().all()
        data = ProgramAdminSerializer(queryset, many=True).data[0]
        self.assertEqual(set(data['sector']), set([sector1.pk, sector2.pk]))

    def test_program_country_info(self):
        program = RFProgramFactory()
        program.country.set([self.country1])
        queryset = ProgramAdminViewSet.base_queryset().all()
        data = ProgramAdminSerializer(queryset, many=True).data[0]
        self.assertEqual(data['country'], [self.country1.pk])

    def test_program_country_user_info(self):
        program = RFProgramFactory()
        program.country.set([self.country1])
        superuser = NewTolaUserFactory(mc_staff=True, superadmin=True)
        in_country_admin = NewTolaUserFactory(mc_staff=True, superadmin=False)
        grant_country_access(in_country_admin, self.country1, COUNTRY_ROLE_CHOICES[1][0])
        out_country_admin = NewTolaUserFactory(mc_staff=True, superadmin=False)
        grant_country_access(out_country_admin, self.country2, COUNTRY_ROLE_CHOICES[1][0])
        in_country_user = NewTolaUserFactory(mc_staff=True, superadmin=False)
        grant_country_access(in_country_user, self.country1, COUNTRY_ROLE_CHOICES[0][0])
        out_country_user = NewTolaUserFactory(mc_staff=True, superadmin=False)
        grant_country_access(out_country_user, self.country2, COUNTRY_ROLE_CHOICES[0][0])
        queryset = ProgramAdminViewSet.base_queryset().all()
        qs_program = queryset.first()
        self.assertEqual(qs_program.organization_count, 1)
        self.assertEqual(qs_program.program_users_count, 2)
        self.assertEqual(qs_program.only_organization_id, 1)
        data = ProgramAdminSerializer(queryset, many=True).data[0]
        self.assertEqual(data['organizations'], 1)
        self.assertEqual(data['program_users'], 2)
        self.assertEqual(data['onlyOrganizationId'], 1)

    def test_program_program_access_user_info(self):
        superuser = NewTolaUserFactory(mc_staff=True, superadmin=True)
        program = RFProgramFactory()
        program.country.set([self.country1])
        in_country_admin = NewTolaUserFactory(mc_staff=True, superadmin=False)
        grant_country_access(in_country_admin, self.country1, COUNTRY_ROLE_CHOICES[1][0])
        in_partner1 = NewTolaUserFactory(mc_staff=False, superadmin=False)
        grant_program_access(in_partner1, program, self.country1, PROGRAM_ROLE_CHOICES[0][0])
        in_partner2 = NewTolaUserFactory(mc_staff=False, superadmin=False, organization=in_partner1.organization)
        grant_program_access(in_partner2, program, self.country1, PROGRAM_ROLE_CHOICES[0][0])
        queryset = ProgramAdminViewSet.base_queryset().all()
        data = ProgramAdminSerializer(queryset, many=True).data[0]
        self.assertEqual(data['organizations'], 2)
        self.assertEqual(data['program_users'], 3)
        self.assertEqual(data['onlyOrganizationId'], None)

    def test_program_access_only_users(self):
        """should never really have a program with only partner users, but make sure it works"""
        superuser = NewTolaUserFactory(mc_staff=True, superadmin=True)
        program = RFProgramFactory()
        program.country.set([self.country1])
        in_partner1 = NewTolaUserFactory(mc_staff=False, superadmin=False)
        grant_program_access(in_partner1, program, self.country1, PROGRAM_ROLE_CHOICES[0][0])
        in_partner2 = NewTolaUserFactory(mc_staff=False, superadmin=False, organization=in_partner1.organization)
        grant_program_access(in_partner2, program, self.country1, PROGRAM_ROLE_CHOICES[0][0])
        in_partner3 = NewTolaUserFactory(mc_staff=False, superadmin=False, organization=in_partner1.organization)
        grant_program_access(in_partner3, program, self.country1, PROGRAM_ROLE_CHOICES[1][0])
        out_country_admin = NewTolaUserFactory(mc_staff=True, superadmin=False)
        grant_country_access(out_country_admin, self.country2, COUNTRY_ROLE_CHOICES[1][0])
        queryset = ProgramAdminViewSet.base_queryset().all()
        data = ProgramAdminSerializer(queryset, many=True).data[0]
        self.assertEqual(data['organizations'], 1)
        self.assertEqual(data['program_users'], 3)
        self.assertEqual(data['onlyOrganizationId'], in_partner1.organization.pk)


class TestProgramFieldsStressTest(test.TestCase):
    """How do the queries perform with hundreds of users and dozens of extraneous programs?"""
    @classmethod
    def setUpTestData(cls):
        cls.outcountry = CountryFactory(code="XX", country="No programs country")
        cls.in_sector1 = SectorFactory()
        cls.in_sector2 = SectorFactory()
        cls.out_sector = SectorFactory()
        cls.no_mc_country = CountryFactory(code="NM", country="No MC Users")
        cls.countries = [CountryFactory(code=f'T{x}', country=f'Country {x}') for x in range(20)]
        cls.superusers = [NewTolaUserFactory(mc_staff=True, superadmin=True) for x in range(10)]
        cls.country_admins = {}
        cls.country_users = {}
        for country in cls.countries:
            admin1 = NewTolaUserFactory(mc_staff=True, superadmin=False)
            admin1.country = country
            admin1.countries.clear()
            grant_country_access(admin1, country, COUNTRY_ROLE_CHOICES[1][0])
            admin2 = NewTolaUserFactory(mc_staff=True, superadmin=False)
            admin2.country = cls.outcountry
            admin2.countries.set([country])
            grant_country_access(admin2, country, COUNTRY_ROLE_CHOICES[1][0])
            cls.country_admins[country.pk] = [admin1, admin2]
            user1 = NewTolaUserFactory(mc_staff=True, superadmin=False)
            user1.country = country
            user1.countries.clear()
            grant_country_access(user1, country, COUNTRY_ROLE_CHOICES[0][0])
            user2 = NewTolaUserFactory(mc_staff=True, superadmin=False)
            user2.country = cls.outcountry
            user2.countries.set([country])
            grant_country_access(user2, country, COUNTRY_ROLE_CHOICES[0][0])
            cls.country_users[country.pk] = [user1, user2]
            bonus_program = RFProgramFactory()
            bonus_program.country.set([country])
            bonus_program.sector.set([cls.out_sector])
        cls.partner_org1 = OrganizationFactory()
        cls.partner_org2 = OrganizationFactory()
        cls.only_mc_program = RFProgramFactory()
        cls.only_mc_program.country.set([cls.countries[0]])
        cls.only_mc_program.sector.set([cls.in_sector1])
        cls.only_partner_program = RFProgramFactory()
        cls.only_partner_program.country.set([cls.no_mc_country])
        cls.only_partner_program.sector.set([cls.in_sector1, cls.in_sector2])
        for x in range(5):
            admin = NewTolaUserFactory(mc_staff=False, superadmin=False, organization=cls.partner_org1)
            grant_program_access(admin, cls.only_partner_program, cls.no_mc_country, PROGRAM_ROLE_CHOICES[1][0])
            user = NewTolaUserFactory(mc_staff=False, superadmin=False, organization=cls.partner_org1)
            grant_program_access(user, cls.only_partner_program, cls.no_mc_country, PROGRAM_ROLE_CHOICES[0][0])
        cls.two_org_program = RFProgramFactory()
        cls.two_org_program.country.set([cls.countries[1]])
        cls.two_org_program.sector.set([cls.in_sector2])
        for x in range(5):
            admin1 = NewTolaUserFactory(mc_staff=False, superadmin=False, organization=cls.partner_org1)
            grant_program_access(admin1, cls.two_org_program, cls.countries[1], PROGRAM_ROLE_CHOICES[1][0])
            admin2 = NewTolaUserFactory(mc_staff=False, superadmin=False, organization=cls.partner_org2)
            grant_program_access(admin2, cls.two_org_program, cls.countries[1], PROGRAM_ROLE_CHOICES[1][0])
            user = NewTolaUserFactory(mc_staff=False, superadmin=False, organization=cls.partner_org1)
            grant_program_access(user, cls.two_org_program, cls.countries[1], PROGRAM_ROLE_CHOICES[0][0])
        cls.two_country_program = RFProgramFactory()
        cls.two_country_program.country.set([cls.countries[2], cls.countries[3]])
        cls.two_country_program.sector.set([cls.in_sector1])
        for x in range(5):
            admin1 = NewTolaUserFactory(mc_staff=False, superadmin=False, organization=cls.partner_org1)
            grant_program_access(admin1, cls.two_country_program, cls.countries[2], PROGRAM_ROLE_CHOICES[1][0])
            admin2 = NewTolaUserFactory(mc_staff=False, superadmin=False, organization=cls.partner_org2)
            grant_program_access(admin2, cls.two_country_program, cls.countries[3], PROGRAM_ROLE_CHOICES[1][0])
            user1 = NewTolaUserFactory(mc_staff=False, superadmin=False, organization=cls.partner_org1)
            grant_program_access(user1, cls.two_country_program, cls.countries[2], PROGRAM_ROLE_CHOICES[0][0])
            user2 = NewTolaUserFactory(mc_staff=False, superadmin=False, organization=cls.partner_org2)
            grant_program_access(user, cls.two_country_program, cls.countries[3], PROGRAM_ROLE_CHOICES[0][0])

    def get_program(self, program_pk):
        # no queries because queryset is not evaluated:
        with self.assertNumQueries(0):
            return ProgramAdminViewSet.base_queryset().filter(pk=program_pk)

    def get_data(self, program_qs):
        # 3 queries: program with annotations, prefetched sectors, prefetched countries
        with self.assertNumQueries(3):
            return ProgramAdminSerializer(program_qs, many=True).data[0]

    def test_only_mc_program(self):
        program_qs = self.get_program(self.only_mc_program.pk)
        data = self.get_data(program_qs)
        self.assertEqual(data['organizations'], 1)
        self.assertEqual(data['program_users'], 4) # 2 country admins 2 country users per country
        self.assertEqual(data['onlyOrganizationId'], 1)

    def test_non_mc_program(self):
        program_qs = self.get_program(self.only_partner_program.pk)
        data = self.get_data(program_qs)
        self.assertEqual(data['organizations'], 1)
        self.assertEqual(data['program_users'], 10) # 5 admins 5 users per partner org
        self.assertEqual(data['onlyOrganizationId'], self.partner_org1.pk)

    def test_two_org_program(self):
        program_qs = self.get_program(self.two_org_program.pk)
        data = self.get_data(program_qs)
        self.assertEqual(data['organizations'], 3)
        self.assertEqual(data['program_users'], 19) # 5 partner admins, 5 partner users, 2 mc admins, 2 mc users
        self.assertEqual(data['onlyOrganizationId'], None)

    def test_two_country_program(self):
        program_qs = self.get_program(self.two_country_program.pk)
        data = self.get_data(program_qs)
        self.assertEqual(data['organizations'], 3)
        self.assertEqual(data['program_users'], 24) # 10 partner admins, 10 partner users, 2 mc admins, 2 mc users
        self.assertEqual(data['onlyOrganizationId'], None)

    def test_query_count_on_multiple(self):
        with self.assertNumQueries(3):
            program_qs = ProgramAdminViewSet.base_queryset().all()
            data = ProgramAdminSerializer(program_qs, many=True).data
            self.assertEqual(len(data), 24)

    def test_api_call(self):
        client = test.Client()
        client.force_login(user=self.superusers[0].user)
        response = client.get(
            f'/api/tola_management/program/?page=1&sectors[]={self.in_sector1.pk}&sectors[]={self.in_sector2.pk}')
        self.assertEqual(response.status_code, 200)
        response_json = response.json()
        self.assertEqual(response_json['count'], 4)
        self.assertEqual(response_json['next'], None)
        results = {result['id']: result for result in response_json['results']}
        for pk, (organizations, program_users, onlyOrganizationId) in [
            (self.only_mc_program.pk, (1, 4, 1)),
            (self.only_partner_program.pk, (1, 10, self.partner_org1.pk)),
            (self.two_org_program.pk, (3, 19, None)),
            (self.two_country_program.pk, (3, 24, None))
        ]:
            self.assertIn(pk, results)
            self.assertEqual(results[pk]['organizations'], organizations)
            self.assertEqual(results[pk]['program_users'], program_users)
            self.assertEqual(results[pk]['onlyOrganizationId'], onlyOrganizationId)
        