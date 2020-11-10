import unittest
import json
from rest_framework import test as drf_test
from django import test
from factories.workflow_models import (
    RFProgramFactory,
    CountryFactory,
    OrganizationFactory,
    TolaUserFactory,
    NewTolaUserFactory,
    grant_program_access,
    grant_country_access
)
from workflow.models import COUNTRY_ROLE_CHOICES, PROGRAM_ROLE_INT_MAP, PROGRAM_ROLE_CHOICES
from tola_management.views import UserAdminViewSet


class TestUserAdminViewSet(test.TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.mc_org = OrganizationFactory(id=1, name="MC")
        cls.partner_org1 = OrganizationFactory(name="PO1")
        cls.partner_org2 = OrganizationFactory(name="PO2")
        cls.base_country = CountryFactory(country="Base Country", code="BC")
        cls.base_country2 = CountryFactory(country="Base Country2", code="BC2")
        cls.country1 = CountryFactory(country="TestLand", code="T1")
        cls.country1_program = RFProgramFactory(active=True, country=[cls.country1])
        cls.country2 = CountryFactory(country="TestLand2", code="T2")
        cls.country2_program = RFProgramFactory(active=True, country=[cls.country2])
        cls.country3 = CountryFactory(country="TestLand3", code="T3")
        cls.country3_program1 = RFProgramFactory(active=True, country=[cls.country3])
        cls.country3_program2 = RFProgramFactory(active=True, country=[cls.country3])
        cls.factory = drf_test.APIRequestFactory()
        cls.superadmin = NewTolaUserFactory(
            country=cls.base_country,
            superadmin=True
        )

    def setUp(self):
        self.user_count = 0

    def get_response(self, **kwargs):
        request_kwargs = {
            'page': 1,
            **kwargs
        }
        request = self.factory.get('/api/tola_management/user/', request_kwargs)
        drf_test.force_authenticate(request, user=self.superadmin.user)
        return json.loads(UserAdminViewSet.as_view({'get': 'list'})(request).render().content)

    def get_pks(self, response, count=None):
        if count is not None:
            self.assertEqual(
                response['count'], count, "received:\n{}".format("\n".join(str(r) for r in response['results']))
                )
        return set(user['id'] for user in response['results'])

    def get_user(self, **kwargs):
        country = kwargs.pop('country', self.base_country)
        country_admin = kwargs.pop('country_admin', [])
        country_user = kwargs.pop('country_user', [])
        program_admin = kwargs.pop('program_admin', [])
        program_user = kwargs.pop('program_user', [])
        user = NewTolaUserFactory(country=country, **kwargs)
        for country in country_admin:
            grant_country_access(user, country, COUNTRY_ROLE_CHOICES[1][0])
        for country in country_user:
            grant_country_access(user, country, COUNTRY_ROLE_CHOICES[0][0])
        for program in program_admin:
            grant_program_access(user, program, program.country.first(), PROGRAM_ROLE_CHOICES[1][0])
        for program in program_user:
            grant_program_access(user, program, program.country.first(), PROGRAM_ROLE_CHOICES[0][0])
        self.user_count += 1
        return user

    def test_users_count(self):
        user = self.get_user()
        response = self.get_response()
        user_pks = self.get_pks(response, count=2)
        self.assertIn(user.pk, user_pks)

    def test_countries_permissions_filter(self):
        user_level_user = self.get_user(country_user=[self.country1])
        admin_level_user = self.get_user(country_admin=[self.country1])
        non_permissioned_user = self.get_user()
        country2_user = self.get_user(country_user=[self.country2])
        response = self.get_response(**{'countries[]': [self.country1.pk]})
        user_pks = self.get_pks(response, count=3)
        self.assertIn(user_level_user.pk, user_pks)
        self.assertIn(admin_level_user.pk, user_pks)
        self.assertNotIn(non_permissioned_user.pk, user_pks)
        self.assertNotIn(country2_user.pk, user_pks)
        response = self.get_response(**{'countries[]': [self.country1.pk, self.country2.pk]})
        user_pks = self.get_pks(response, count=4)
        self.assertIn(user_level_user.pk, user_pks)
        self.assertIn(admin_level_user.pk, user_pks)
        self.assertIn(country2_user.pk, user_pks)
        self.assertNotIn(non_permissioned_user.pk, user_pks)

    def test_base_country_filter(self):
        base_country_user = self.get_user()
        country1_user = self.get_user(country=self.country1)
        country2_user = self.get_user(country=self.country2)
        response = self.get_response(**{'base_countries[]': [self.country1.pk]})
        self.assertEqual(response['count'], 1)
        self.assertEqual(response['results'][0]['id'], country1_user.pk)
        response = self.get_response(**{'base_countries[]': [self.country1.pk, self.base_country.pk]})
        user_pks = self.get_pks(response, count=3)
        self.assertIn(base_country_user.pk, user_pks)
        self.assertIn(country1_user.pk, user_pks)

    def test_base_countries_and_countries_permission_filters(self):
        in_user_1 = self.get_user(country=self.country1, country_user=[self.country2])
        in_user_2 = self.get_user(country=self.country1, country_admin=[self.country2])
        in_user_3 = self.get_user(country=self.country1, country_admin=[self.country1, self.country2])
        self.get_user(country=self.country1)
        self.get_user(country=self.country2, country_user=[self.country2])
        self.get_user(country=self.country2, country_admin=[self.country2])
        self.get_user(country_user=[self.country1, self.country2])
        self.get_user(country_admin=[self.country1])
        response = self.get_response(**{'base_countries[]': [self.country1.pk], 'countries[]': [self.country2.pk]})
        user_pks = self.get_pks(response, count=3)
        self.assertIn(in_user_1.pk, user_pks)
        self.assertIn(in_user_2.pk, user_pks)
        self.assertIn(in_user_3.pk, user_pks)

    def test_program_access_filter(self):
        # country level users:
        user_level_user = self.get_user(country_user=[self.country1])
        admin_level_user = self.get_user(country_admin=[self.country1])
        user_level_user2 = self.get_user(country_user=[self.country2])
        multi_country_user = self.get_user(country_user=[self.country1, self.country2])
        non_permissioned_user = self.get_user()
        response = self.get_response(**{'programs[]': [self.country1_program.pk]})
        # 1 admin, 1 users, 1 multi-country user, 1 superadmin
        user_pks = self.get_pks(response, count=4)
        self.assertIn(user_level_user.pk, user_pks)
        self.assertIn(admin_level_user.pk, user_pks)
        self.assertIn(multi_country_user.pk, user_pks)
        self.assertIn(self.superadmin.pk, user_pks)
        self.assertNotIn(user_level_user2.pk, user_pks)
        self.assertNotIn(non_permissioned_user.pk, user_pks)
        response = self.get_response(**{'programs[]': [self.country1_program.pk, self.country2_program.pk]})
        user_pks = self.get_pks(response, count=5)
        self.assertIn(user_level_user.pk, user_pks)
        self.assertIn(admin_level_user.pk, user_pks)
        self.assertIn(user_level_user2.pk, user_pks)
        self.assertIn(multi_country_user.pk, user_pks)
        self.assertIn(self.superadmin.pk, user_pks)
        self.assertNotIn(non_permissioned_user.pk, user_pks)
        # program-specific users:
        user_level_user = self.get_user(mc_staff=False, program_user=[self.country1_program])
        admin_level_user = self.get_user(mc_staff=False, program_admin=[self.country1_program])
        user_level_user2 = self.get_user(mc_staff=False, program_user=[self.country2_program])
        multi_program_user = self.get_user(mc_staff=False, program_user=[self.country1_program, self.country2_program])
        non_permissioned_user = self.get_user(mc_staff=False, program_user=[self.country3_program1])
        response = self.get_response(**{'programs[]': [self.country1_program.pk]})
        user_pks = self.get_pks(response, count=7)
        self.assertIn(user_level_user.pk, user_pks)
        self.assertIn(admin_level_user.pk, user_pks)
        self.assertIn(multi_program_user.pk, user_pks)
        self.assertIn(self.superadmin.pk, user_pks)
        self.assertNotIn(user_level_user2.pk, user_pks)
        self.assertNotIn(non_permissioned_user.pk, user_pks)
        response = self.get_response(**{'programs[]': [self.country1_program.pk, self.country2_program.pk],
                                        'test': True})
        user_pks = self.get_pks(response, count=9)
        self.assertIn(user_level_user.pk, user_pks)
        self.assertIn(admin_level_user.pk, user_pks)
        self.assertIn(multi_program_user.pk, user_pks)
        self.assertIn(user_level_user2.pk, user_pks)
        self.assertIn(self.superadmin.pk, user_pks)
        self.assertNotIn(non_permissioned_user.pk, user_pks)

    def test_program_access_country_base_country_filters(self):
        in_user_1 = self.get_user(mc_staff=False, country=self.country1, program_user=[self.country1_program])
        in_user_2 = self.get_user(mc_staff=False, country=self.country1,
                                  program_admin=[self.country1_program, self.country2_program])
        in_user_3 = self.get_user(country=self.country1, country_user=[self.country1, self.country2])
        self.get_user(mc_staff=False, country=self.country2, program_user=[self.country1_program])
        self.get_user(mc_staff=False, country=self.country2, program_admin=[self.country1_program])
        self.get_user(mc_staff=False, country=self.country1, program_admin=[self.country2_program])
        self.get_user(country=self.country2)
        response = self.get_response(**{'programs[]': [self.country1_program.pk],
                                        'base_countries[]': [self.country1.pk]})
        user_pks = self.get_pks(response, count=3)
        self.assertIn(in_user_1.pk, user_pks)
        self.assertIn(in_user_2.pk, user_pks)
        self.assertIn(in_user_3.pk, user_pks)

    def test_organization_filter(self):
        mc_user = self.get_user()
        non_mc_user = self.get_user(mc_staff=False)
        response = self.get_response(**{'organizations[]': [self.mc_org.pk]})
        user_pks = self.get_pks(response, count=2)
        self.assertIn(mc_user.pk, user_pks)
        self.assertNotIn(non_mc_user.pk, user_pks)
        partner_user1 = self.get_user(mc_staff=False, organization=self.partner_org1)
        partner_user2 = self.get_user(mc_staff=False, organization=self.partner_org2)
        response = self.get_response(**{'organizations[]': [self.partner_org1.pk]})
        self.assertEqual(response['count'], 1)
        self.assertEqual(response['results'][0]['id'], partner_user1.pk)
        response = self.get_response(**{'organizations[]': [self.partner_org1.pk, self.partner_org2.pk]})
        user_pks = self.get_pks(response, count=2)
        self.assertIn(partner_user1.pk, user_pks)
        self.assertIn(partner_user2.pk, user_pks)
        self.assertNotIn(mc_user.pk, user_pks)

    def test_organization_countries_filters(self):
        in_user_1 = self.get_user(country=self.country1)
        in_user_2 = self.get_user(country=self.country2)
        in_user_3 = self.get_user(mc_staff=False, organization=self.partner_org1, country=self.country1)
        self.get_user(mc_staff=False, organization=self.partner_org2, country=self.country1)
        self.get_user(mc_staff=False, organization=self.partner_org1, country=self.base_country)
        self.get_user()
        response = self.get_response(**{'organizations[]': [self.mc_org.pk, self.partner_org1.pk],
                                        'base_countries[]': [self.country1.pk, self.country2.pk]})
        user_pks = self.get_pks(response, count=3)
        self.assertIn(in_user_1.pk, user_pks)
        self.assertIn(in_user_2.pk, user_pks)
        self.assertIn(in_user_3.pk, user_pks)

    def test_admin_filter(self):
        admin_user1 = self.get_user(country_admin=[self.country1])
        admin_user2 = self.get_user(country_admin=[self.country2])
        admin_user3 = self.get_user(country_admin=[self.country2, self.country3])
        non_admin1 = self.get_user()
        non_admin2 = self.get_user(country_user=[self.country1])
        non_admin3 = self.get_user(mc_staff=False, program_user=[self.country1_program])
        response = self.get_response(**{'admin_role': 1})
        user_pks = self.get_pks(response, count=4)
        self.assertIn(admin_user1.pk, user_pks)
        self.assertIn(admin_user2.pk, user_pks)
        self.assertIn(admin_user3.pk, user_pks)
        self.assertIn(self.superadmin.pk, user_pks)

    def test_status_filter(self):
        active_user = self.get_user()
        non_mc_active_user = self.get_user(mc_staff=False)
        inactive_user = self.get_user(active=False)
        inactive_non_mc_user = self.get_user(active=False, mc_staff=False)
        response = self.get_response(user_status=1)
        user_pks = self.get_pks(response, count=3)
        self.assertIn(active_user.pk, user_pks)
        self.assertIn(non_mc_active_user.pk, user_pks)
        self.assertNotIn(inactive_user.pk, user_pks)
        self.assertNotIn(inactive_non_mc_user.pk, user_pks)
        response = self.get_response(user_status=0)
        user_pks = self.get_pks(response, count=2)
        self.assertIn(inactive_user.pk, user_pks)
        self.assertIn(inactive_non_mc_user.pk, user_pks)
        self.assertNotIn(active_user.pk, user_pks)
        self.assertNotIn(non_mc_active_user.pk, user_pks)

    def test_status_organization_countries_filters(self):
        in_user_1 = self.get_user(country=self.country1)
        in_user_2 = self.get_user(country=self.country2)
        in_user_3 = self.get_user(mc_staff=False, organization=self.partner_org1, country=self.country1)
        inactive_user_1 = self.get_user(country=self.country1, active=False)
        inactive_user_2 = self.get_user(country=self.country2, active=False)
        inactive_user_3 = self.get_user(mc_staff=False, organization=self.partner_org1, country=self.country1, active=False)
        self.get_user(mc_staff=False, organization=self.partner_org2, country=self.country1)
        self.get_user(mc_staff=False, organization=self.partner_org1, country=self.base_country)
        self.get_user()
        response = self.get_response(**{'organizations[]': [self.mc_org.pk, self.partner_org1.pk],
                                        'base_countries[]': [self.country1.pk, self.country2.pk],
                                        'user_status': 1})
        user_pks = self.get_pks(response, count=3)
        self.assertIn(in_user_1.pk, user_pks)
        self.assertIn(in_user_2.pk, user_pks)
        self.assertIn(in_user_3.pk, user_pks)
        response2 = self.get_response(**{'organizations[]': [self.mc_org.pk, self.partner_org1.pk],
                                        'base_countries[]': [self.country1.pk, self.country2.pk],
                                        'user_status': 0})
        user_pks = self.get_pks(response2, count=3)
        self.assertIn(inactive_user_1.pk, user_pks)
        self.assertIn(inactive_user_2.pk, user_pks)
        self.assertIn(inactive_user_3.pk, user_pks)

    def test_users_filter(self):
        user1 = self.get_user()
        user2 = self.get_user()
        user3 = self.get_user()
        response = self.get_response(**{'users[]': [user1.pk]})
        user_pks = self.get_pks(response, count=1)
        self.assertIn(user1.pk, user_pks)
        response = self.get_response(**{'users[]': [user1.pk, user3.pk]})
        user_pks = self.get_pks(response, count=2)
        self.assertIn(user1.pk, user_pks)
        self.assertIn(user3.pk, user_pks)
        self.assertNotIn(user2.pk, user_pks)

    def test_programs_count(self):
        user_with_one_program = self.get_user(country_admin=[self.country1])
        response = self.get_response(**{'users[]': [user_with_one_program.pk]})
        self.assertEqual(response['results'][0]['user_programs'], 1)
        user_with_two_programs = self.get_user(country_admin=[self.country3])
        response = self.get_response(**{'users[]': [user_with_two_programs.pk]})
        self.assertEqual(response['results'][0]['user_programs'], 2, response['results'])
        user_with_three_programs = self.get_user(country_user=[self.country2], country_admin=[self.country3])
        response = self.get_response(**{'users[]': [user_with_three_programs.pk]})
        self.assertEqual(response['results'][0]['user_programs'], 3)
        response = self.get_response(**{'users[]': [self.superadmin.pk]})
        self.assertEqual(response['results'][0]['user_programs'], 4)

    def test_pagination(self):
        first_user = self.get_user(user__first_name="AAAAaron", country=self.base_country2)
        users = [self.get_user(user__first_name="AAAB{}".format(x), country=self.base_country2) for x in range(19)]
        twenty_first_user = self.get_user(user__first_name="ZZZron", country=self.base_country2)
        response = self.get_response(**{'base_countries[]': [self.base_country2.pk]})
        user_pks = self.get_pks(response, count=21)
        self.assertIn(first_user.pk, user_pks)
        self.assertNotIn(twenty_first_user.pk, user_pks)
        for user in users:
            self.assertIn(user.pk, user_pks)
        response = self.get_response(**{'base_countries[]': [self.base_country2.pk], 'page': 2})
        user_pks = self.get_pks(response, count=21)
        self.assertIn(twenty_first_user.pk, user_pks)
        