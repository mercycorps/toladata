from itertools import chain
from django.test import TestCase
from factories.workflow_models import (
    ProgramFactory,
    NewCountryFactory,
    NewTolaUserFactory,
    OrganizationFactory,
    grant_program_access,
    grant_country_access
)
from workflow.models import COUNTRY_ROLE_CHOICES, PROGRAM_ROLE_INT_MAP, PROGRAM_ROLE_CHOICES, Program, Country


class TestTolaUserMethods(TestCase):
    @classmethod
    def setUpClass(cls):
        super(TestTolaUserMethods, cls).setUpClass()
        cls.mc_organization = OrganizationFactory(pk=1, name='Mercy Corps')
        cls.non_mc_organization = OrganizationFactory()
        cls.country1 = NewCountryFactory()
        cls.country2 = NewCountryFactory()
        cls.country3 = NewCountryFactory()
        cls.tola_user = NewTolaUserFactory(country=cls.country1)
        cls.program = ProgramFactory(countries=[cls.country2])

    def test_program_role_method(self):
        self.assertEqual(None, self.tola_user.program_role(self.program.id))
        grant_country_access(self.tola_user, self.country2, COUNTRY_ROLE_CHOICES[0][0])
        self.assertEqual(PROGRAM_ROLE_CHOICES[0][0], self.tola_user.program_role(self.program.id))
        for role in PROGRAM_ROLE_CHOICES:
            grant_program_access(self.tola_user, self.program, self.country2, role=role[0])
            self.assertEqual(role[0], self.tola_user.program_role(self.program.id))
        self.program.country.add(self.country3)
        grant_program_access(self.tola_user, self.program, self.country2, role=PROGRAM_ROLE_CHOICES[0][0])
        grant_program_access(self.tola_user, self.program, self.country2, role=PROGRAM_ROLE_CHOICES[1][0])
        highest_permission_int = max(
            PROGRAM_ROLE_INT_MAP[PROGRAM_ROLE_CHOICES[0][0]],
            PROGRAM_ROLE_INT_MAP[PROGRAM_ROLE_CHOICES[1][0]]
        )
        self.assertEqual(
            highest_permission_int,
            PROGRAM_ROLE_INT_MAP[self.tola_user.program_role(self.program.id)])


    def test_managed_countries(self):
        non_mc_user = NewTolaUserFactory(organization=self.non_mc_organization)
        mc_tola_user = NewTolaUserFactory(organization=self.mc_organization)
        program_country1 = ProgramFactory.create_batch(3, countries=[self.country1])

        self.assertEqual(len(non_mc_user.managed_countries), 0)
        grant_program_access(non_mc_user, program_country1[0], self.country1, role=PROGRAM_ROLE_CHOICES[0][0])
        self.assertEqual(len(non_mc_user.managed_countries), 0)
        grant_program_access(non_mc_user, program_country1[0], self.country1, role=PROGRAM_ROLE_CHOICES[2][0])

        self.assertEqual(len(mc_tola_user.managed_countries), 0)
        grant_program_access(mc_tola_user, program_country1[0], self.country1, role=PROGRAM_ROLE_CHOICES[0][0])
        self.assertEqual(len(mc_tola_user.managed_countries), 0)
        grant_country_access(mc_tola_user, self.country1, COUNTRY_ROLE_CHOICES[0][0])
        self.assertEqual(len(mc_tola_user.managed_countries), 0)
        grant_country_access(mc_tola_user, self.country1, COUNTRY_ROLE_CHOICES[1][0])
        self.assertEqual(len(mc_tola_user.managed_countries), 1)
        grant_country_access(mc_tola_user, self.country2, COUNTRY_ROLE_CHOICES[1][0])
        self.assertEqual(len(mc_tola_user.managed_countries), 2)
        mc_tola_user.user.is_superuser = True
        self.assertEqual(len(mc_tola_user.managed_countries), Country.objects.count())


    def test_managed_programs(self):
        mc_tola_user = NewTolaUserFactory(organization=self.mc_organization)
        programs_country1 = ProgramFactory.create_batch(3, countries=[self.country1])
        programs_country2 = ProgramFactory.create_batch(
            3, countries=[self.country2])  # One already declared with class
        ProgramFactory.create_batch(5, countries=[self.country3])

        grant_country_access(mc_tola_user, self.country1, COUNTRY_ROLE_CHOICES[1][0])
        grant_program_access(mc_tola_user, programs_country2[0], self.country2, role=PROGRAM_ROLE_CHOICES[2][0])
        self.assertEqual(set(mc_tola_user.managed_programs), set(programs_country1))
        grant_country_access(mc_tola_user, self.country2, COUNTRY_ROLE_CHOICES[1][0])
        self.assertEqual(
            [p.id for p in mc_tola_user.managed_programs].sort(),
            [p.id for p in chain.from_iterable([programs_country1, programs_country2])].sort())
        mc_tola_user.user.is_superuser = True
        self.assertEqual(len(mc_tola_user.managed_programs), Program.objects.count())

