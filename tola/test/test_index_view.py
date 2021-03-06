"""Tests for the index view producing the home page (aka country page) for Tola

Behavior:
 - shows programs in the correct country
 - doesn't show programs not in the correct country
 - shows programs user has access to
 - doesn't show programs a user doesn't have access to
 - shows active_country for base url if active_country exists
 - shows first country with access for base url if active_country doesn't exist
 - shows selected country for selected country url
 - updates active_country for selected country url
 - permission denied for selected country url if user doesn't have permission
"""

from django import test
from tola.views import index
from factories.workflow_models import (
    TolaUserFactory,
    CountryFactory,
    RFProgramFactory,
    grant_program_access,
    grant_country_access,
    PROGRAM_ROLE_CHOICES,
    COUNTRY_ROLE_CHOICES
)


class TestIndexViewProgramList(test.TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.country_a = CountryFactory(country="Xtestcountry")
        cls.country_a_programs = RFProgramFactory.create_batch(4, country=[cls.country_a])
        cls.country_b = CountryFactory(country="Ytestcountry")
        cls.country_b_programs = RFProgramFactory.create_batch(3, country=[cls.country_b])
        cls.country_c = CountryFactory(country="Atestcountry")
        cls.country_c_program = RFProgramFactory(country=[cls.country_c])
        cls.two_country_program = RFProgramFactory(country=[cls.country_b, cls.country_c])
        cls.mc_user_all_admin = TolaUserFactory(mc_staff=True)
        cls.mc_user_all_user = TolaUserFactory(mc_staff=True)
        for country in [cls.country_a, cls.country_b, cls.country_c]:
            grant_country_access(cls.mc_user_all_admin, country, COUNTRY_ROLE_CHOICES[1][0])
            grant_country_access(cls.mc_user_all_user, country, COUNTRY_ROLE_CHOICES[0][0])
        cls.mc_user_country_b = TolaUserFactory(mc_staff=True)
        grant_country_access(cls.mc_user_country_b, cls.country_b, COUNTRY_ROLE_CHOICES[0][0])
        cls.partner_user_admin = TolaUserFactory(mc_staff=False, country=None)
        grant_program_access(cls.partner_user_admin, cls.country_a_programs[0],
                             cls.country_a, PROGRAM_ROLE_CHOICES[2][0])
        grant_program_access(cls.partner_user_admin, cls.country_a_programs[2],
                             cls.country_a, PROGRAM_ROLE_CHOICES[2][0])
        grant_program_access(cls.partner_user_admin, cls.country_b_programs[0],
                             cls.country_b, PROGRAM_ROLE_CHOICES[2][0])
        cls.partner_user_multi_country = TolaUserFactory(mc_staff=False, country=None)
        grant_program_access(cls.partner_user_multi_country, cls.country_c_program,
                             cls.country_c, PROGRAM_ROLE_CHOICES[1][0])
        grant_program_access(cls.partner_user_multi_country, cls.two_country_program,
                             cls.country_c, PROGRAM_ROLE_CHOICES[1][0])

    def get_index_view_program_pks(self, user, pk=None):
        self.client.logout()
        self.client.force_login(user=user.user)
        url = '/' if pk is None else f"/{pk}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        return {p.pk for p in response.context['programs']}

    def get_index_view_permission_denied(self, user, pk=None):
        self.client.logout()
        self.client.force_login(user=user.user)
        url = '/' if pk is None else f"/{pk}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 403)
        return True

    def test_shows_programs_in_correct_country(self):
        # should show programs in country a but no others even with access:
        programs = self.get_index_view_program_pks(self.mc_user_all_admin, pk=self.country_a.pk)
        self.assertEqual(programs, {p.pk for p in self.country_a_programs})
        # should show programs in country b including multi-country:
        programs = self.get_index_view_program_pks(self.mc_user_all_user, pk=self.country_b.pk)
        self.assertEqual(programs, {p.pk for p in self.country_b_programs} | {self.two_country_program.pk})

    def test_shows_programs_user_has_access_to(self):
        programs = self.get_index_view_program_pks(self.partner_user_admin, pk=self.country_a.pk)
        self.assertEqual(programs, {self.country_a_programs[0].pk, self.country_a_programs[2].pk})
        programs = self.get_index_view_program_pks(self.partner_user_admin, pk=self.country_b.pk)
        self.assertEqual(programs, {self.country_b_programs[0].pk})
        programs = self.get_index_view_program_pks(self.partner_user_multi_country, pk=self.country_c.pk)
        self.assertEqual(programs, {self.country_c_program.pk, self.two_country_program.pk})
        # should not have permission to country b even with access to country C side of multi-country program
        self.assertTrue(self.get_index_view_permission_denied(self.partner_user_multi_country, pk=self.country_b.pk))

    def test_shows_active_country_for_base_url_if_it_exists(self):
        self.mc_user_all_user.active_country = self.country_a
        self.mc_user_all_user.save()
        programs = self.get_index_view_program_pks(self.mc_user_all_user)
        self.assertEqual(programs, {p.pk for p in self.country_a_programs})
        self.mc_user_all_user.active_country = self.country_b
        self.mc_user_all_user.save()
        programs = self.get_index_view_program_pks(self.mc_user_all_user)
        self.assertEqual(programs, {p.pk for p in self.country_b_programs} | {self.two_country_program.pk})

    def test_shows_home_country_for_base_url_if_no_active_country(self):
        self.mc_user_all_user.active_country = None
        self.mc_user_all_user.country=self.country_c
        self.mc_user_all_user.save()
        programs = self.get_index_view_program_pks(self.mc_user_all_user)
        self.assertEqual(programs, {self.country_c_program.pk, self.two_country_program.pk})

    def test_shows_selected_country_and_updates_active_country_for_selected_url(self):
        self.mc_user_all_user.active_country = None
        self.mc_user_all_user.save()
        programs = self.get_index_view_program_pks(self.mc_user_all_user, pk=self.country_a.pk)
        self.assertEqual(programs, {p.pk for p in self.country_a_programs})
        self.mc_user_all_user.refresh_from_db()
        self.assertEqual(self.mc_user_all_user.active_country.pk, self.country_a.pk)
        programs = self.get_index_view_program_pks(self.mc_user_all_user, pk=self.country_c.pk)
        self.assertEqual(programs, {self.two_country_program.pk, self.country_c_program.pk})
        self.mc_user_all_user.refresh_from_db()
        self.assertEqual(self.mc_user_all_user.active_country.pk, self.country_c.pk)

    def test_uses_correct_country_if_active_country_is_stale(self):
        self.mc_user_all_user.country = self.country_a
        self.mc_user_all_user.active_country = self.country_b
        self.mc_user_all_user.countries.remove(self.country_b)
        self.mc_user_all_user.save()
        programs = self.get_index_view_program_pks(self.mc_user_all_user)
        self.assertEqual(programs, {p.pk for p in self.country_a_programs})
        self.mc_user_all_user.refresh_from_db()
        self.assertEqual(self.mc_user_all_user.active_country.pk, self.country_a.pk)

        self.mc_user_all_user.active_country = self.country_b
        self.mc_user_all_user.countries.clear()
        self.mc_user_all_user.save()
        programs = self.get_index_view_program_pks(self.mc_user_all_user)
        self.assertEqual(programs, {p.pk for p in self.country_a_programs})
        self.mc_user_all_user.refresh_from_db()
        self.assertEqual(self.mc_user_all_user.active_country.pk, self.country_a.pk)

        non_mc_user = TolaUserFactory(mc_staff=False, country=None)
        non_mc_user.active_country = self.country_a
        non_mc_user.save()
        self.get_index_view_program_pks(non_mc_user)
        non_mc_user.refresh_from_db()
        self.assertIsNone(non_mc_user.active_country)

        non_mc_user.active_country = self.country_a
        grant_program_access(non_mc_user, self.country_b_programs[0], self.country_b, PROGRAM_ROLE_CHOICES[0][0])
        non_mc_user.save()
        self.get_index_view_program_pks(non_mc_user)
        non_mc_user.refresh_from_db()
        self.assertEqual(non_mc_user.active_country.pk, self.country_b.pk)


    def test_permission_is_denied_for_no_country_access(self):
        self.assertTrue(self.get_index_view_permission_denied(self.mc_user_country_b, pk=self.country_a.pk))
