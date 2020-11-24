
from django.test import TestCase
from factories.workflow_models import (
    ProgramFactory,
    CountryFactory,
    TolaUserFactory,
    grant_program_access,
    grant_country_access
)
from workflow.models import COUNTRY_ROLE_CHOICES, PROGRAM_ROLE_INT_MAP, PROGRAM_ROLE_CHOICES


class TestTolaUserMethods(TestCase):
    @classmethod
    def setUpClass(cls):
        super(TestTolaUserMethods, cls).setUpClass()
        cls.country1 = CountryFactory()
        cls.country2 = CountryFactory()
        cls.country3 = CountryFactory()
        cls.tola_user = TolaUserFactory(country=cls.country1)
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
