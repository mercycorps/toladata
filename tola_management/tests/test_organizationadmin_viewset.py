"""Tests for the organizations admin viewset ensuring query counts remain O(n) and all fields are accurate"""


import unittest
from django import test
from django.db import models
from tola_management.views import OrganizationAdminViewSet, OrganizationSerializer
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
from workflow.models import Program, TolaUser, Organization

SPECIAL_CHARS = "Spécîal Chåracters"


class TestOrganizationBaseFields(test.TestCase):
    @classmethod
    def setUpTestData(cls):
        CountryFactory.reset_sequence()
        cls.mercy_corps_org = OrganizationFactory(id=1)
        cls.sector1 = SectorFactory()
        cls.sector2 = SectorFactory()
        cls.non_mercy_corps_org = OrganizationFactory(
            name=SPECIAL_CHARS,
            primary_address="some nonsense",
            primary_contact_name="some name",
            primary_contact_phone="555-555-5555",
            mode_of_contact="some mode"
        )
        cls.non_mercy_corps_org.sectors.set([cls.sector1, cls.sector2])
        cls.non_mc_users = []
        program_country = CountryFactory(code='II', country='IIIII')
        cls.non_mc_program1 = RFProgramFactory()
        cls.non_mc_program1.country.set([program_country])
        for x in range(10):
            user = NewTolaUserFactory(
                mc_staff=False,
                superadmin=False,
                organization=cls.non_mercy_corps_org
            )
            cls.non_mc_users.append(user)
            grant_program_access(user, cls.non_mc_program1, program_country, PROGRAM_ROLE_CHOICES[0][0])
        cls.non_mc_program2 = RFProgramFactory()
        cls.non_mc_program2.country.set([program_country])
        for x in range(10):
            user = NewTolaUserFactory(
                mc_staff=False,
                superadmin=False,
                organization=cls.non_mercy_corps_org
            )
            cls.non_mc_users.append(user)
            grant_program_access(user, cls.non_mc_program2, program_country, PROGRAM_ROLE_CHOICES[0][0])
        cls.non_mc_program3 = RFProgramFactory()
        cls.non_mc_program3.country.set([program_country])
        for x in range(4):
            user = NewTolaUserFactory(
                mc_staff=False,
                superadmin=False,
                organization=cls.non_mercy_corps_org
            )
            cls.non_mc_users.append(user)
            grant_program_access(user, cls.non_mc_program3, program_country, PROGRAM_ROLE_CHOICES[0][0])
        cls.country1 = CountryFactory(code='TT', country='TestLand')
        cls.country2 = CountryFactory(code='UU', country='UtherTestLand')

    def test_base_organization_info(self):
        queryset = OrganizationAdminViewSet.base_queryset().filter(pk=self.non_mercy_corps_org.pk)
        data = OrganizationSerializer(queryset, many=True).data[0]
        self.assertEqual(data['name'], SPECIAL_CHARS)
        self.assertEqual(data['primary_address'], 'some nonsense')
        self.assertEqual(data['primary_contact_name'], 'some name')
        self.assertEqual(data['primary_contact_phone'], '555-555-5555')
        self.assertEqual(data['mode_of_contact'], "some mode")
        self.assertEqual(data['sectors'], [self.sector1.pk, self.sector2.pk])
        self.assertEqual(data['users_count'], 24)
        self.assertEqual(data['programs_count'], 3)


class TestOrganizationFieldsStressTest(test.TestCase):
    @classmethod
    def setUpTestData(cls):
        CountryFactory.reset_sequence()
        cls.outcountry = CountryFactory(code="OT", country="Out Country")
        cls.in_sector1 = SectorFactory()
        cls.in_sector2 = SectorFactory()
        cls.out_sector = SectorFactory()
        cls.countries = [CountryFactory(code=f'T{x}', country=f'Country {x}') for x in range(20)]
        cls.superusers = [NewTolaUserFactory(mc_staff=True, superadmin=True) for x in range(8)]
        cls.superuser_country_admin = NewTolaUserFactory(mc_staff=True, superadmin=True)
        cls.superuser_country_user = NewTolaUserFactory(mc_staff=True, superadmin=True)
        for country in cls.countries:
            program = RFProgramFactory()
            program.country.set([country])
            admin1 = NewTolaUserFactory(mc_staff=True, superadmin=False)
            admin1.country = country
            admin1.countries.clear()
            grant_country_access(admin1, country, COUNTRY_ROLE_CHOICES[1][0])
            admin2 = NewTolaUserFactory(mc_staff=True, superadmin=False)
            admin2.country = cls.outcountry
            admin2.countries.set([country])
            grant_country_access(admin2, country, COUNTRY_ROLE_CHOICES[1][0])
            user1 = NewTolaUserFactory(mc_staff=True, superadmin=False)
            user1.country = country
            user1.countries.clear()
            grant_country_access(user1, country, COUNTRY_ROLE_CHOICES[0][0])
            user2 = NewTolaUserFactory(mc_staff=True, superadmin=False)
            user2.country = cls.outcountry
            user2.countries.set([country])
            grant_country_access(user2, country, COUNTRY_ROLE_CHOICES[0][0])
        cls.partner_org1 = OrganizationFactory()
        cls.partner_org1.sectors.set([cls.in_sector1])
        for p in range(5):
            program = RFProgramFactory()
            program.country.set([cls.countries[0]])
            for x in range(4):
                user = NewTolaUserFactory(mc_staff=False, superadmin=False, organization=cls.partner_org1)
                grant_program_access(user, program, cls.countries[0], PROGRAM_ROLE_CHOICES[0][0])
        cls.partner_org2 = OrganizationFactory()
        cls.partner_org2.sectors.set([cls.in_sector2])
        for p in range(2):
            program = RFProgramFactory()
            program.country.set([cls.countries[1]])
            for x in range(5):
                user = NewTolaUserFactory(mc_staff=False, superadmin=False, organization=cls.partner_org2)
                grant_program_access(user, program, cls.countries[1], PROGRAM_ROLE_CHOICES[0][0])
        cls.partner_org3 = OrganizationFactory()
        cls.partner_org3.sectors.set([cls.in_sector1, cls.in_sector2])
        for p in range(5):
            program = RFProgramFactory()
            program.country.set([cls.countries[2]])
            for x in range(5):
                user = NewTolaUserFactory(mc_staff=False, superadmin=False, organization=cls.partner_org3)
                grant_program_access(user, program, cls.countries[2], PROGRAM_ROLE_CHOICES[0][0])
        cls.partner_org4 = OrganizationFactory()
        cls.partner_org4.sectors.set([cls.out_sector])
        for p in range(10):
            program = RFProgramFactory()
            program.country.set([cls.countries[3]])
            for x in range(3):
                user = NewTolaUserFactory(mc_staff=False, superadmin=False, organization=cls.partner_org4)
                grant_program_access(user, program, cls.countries[3], PROGRAM_ROLE_CHOICES[0][0])

    def get_organization(self, organization_pk):
        # 1 query to count programss
        with self.assertNumQueries(1):
            return OrganizationAdminViewSet.base_queryset().filter(pk=organization_pk)

    def get_data(self, organization_qs):
        # 2 queries: organization with annotations, prefetched sector
        with self.assertNumQueries(2):
            return OrganizationSerializer(organization_qs, many=True).data[0]

    def get_users_filtered_data(self, organization_pk):
        client = test.Client()
        client.force_login(user=self.superusers[0].user)
        response = client.get(
            f'/api/tola_management/user/?page=1&organizations[]={organization_pk}')
        self.assertEqual(response.status_code, 200)
        return response.json()

    def get_programs_filtered_data(self, organization_pk):
        client = test.Client()
        client.force_login(user=self.superusers[0].user)
        response = client.get(
            f'/api/tola_management/program/?page=1&organizations[]={organization_pk}')
        self.assertEqual(response.status_code, 200)
        return response.json()

    def test_mc_org(self):
        organization_qs = self.get_organization(1)
        data = self.get_data(organization_qs)
        self.assertEqual(data['users_count'], 90)
        users_data = self.get_users_filtered_data(1)
        self.assertEqual(users_data['count'], 90)
        self.assertEqual(data['programs_count'], 42)
        programs_data = self.get_programs_filtered_data(1)
        self.assertEqual(programs_data['count'], 42)

    def test_partner_orgs(self):
        data = self.get_data(self.get_organization(self.partner_org1.pk))
        self.assertEqual(data['users_count'], 20)
        self.assertEqual(self.get_users_filtered_data(self.partner_org1.pk)['count'], 20)
        self.assertEqual(data['programs_count'], 5)
        self.assertEqual(self.get_programs_filtered_data(self.partner_org1.pk)['count'], 5)
        data = self.get_data(self.get_organization(self.partner_org2.pk))
        self.assertEqual(data['users_count'], 10)
        self.assertEqual(self.get_users_filtered_data(self.partner_org2.pk)['count'], 10)
        self.assertEqual(data['programs_count'], 2)
        self.assertEqual(self.get_programs_filtered_data(self.partner_org2.pk)['count'], 2)
        data = self.get_data(self.get_organization(self.partner_org3.pk))
        self.assertEqual(data['users_count'], 25)
        self.assertEqual(self.get_users_filtered_data(self.partner_org3.pk)['count'], 25)
        self.assertEqual(data['programs_count'], 5)
        self.assertEqual(self.get_programs_filtered_data(self.partner_org3.pk)['count'], 5)
        data = self.get_data(self.get_organization(self.partner_org4.pk))
        self.assertEqual(data['users_count'], 30)
        self.assertEqual(self.get_users_filtered_data(self.partner_org4.pk)['count'], 30)
        self.assertEqual(data['programs_count'], 10)
        self.assertEqual(self.get_programs_filtered_data(self.partner_org4.pk)['count'], 10)