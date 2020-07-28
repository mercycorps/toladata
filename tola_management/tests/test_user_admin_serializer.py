
from django import test
from django.contrib.auth.models import User
from factories.workflow_models import OrganizationFactory, TolaUserFactory
from factories.django_models import UserFactory
from tola_management.views import UserAdminSerializer
from workflow.models import TolaUser


class TestUserAdminSerializerValidation(test.TestCase):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.mc_org = OrganizationFactory(name="Mercy Corps")
        cls.non_mc_org = OrganizationFactory()
        cls.psmith = UserFactory(
            username="psmith", first_name="Patti", last_name="Smith", email="psmith@mercycorps.org", tola_user=None)
        TolaUserFactory(user=cls.psmith, name="Patti Smith", organization=cls.mc_org)

    def test_validation(self):
        psmith2_user = User(username="psmyth", first_name="Patty", last_name="Smith", email="psmyth@mercycorps.org", tola_user=None)
        psmith2_tolauser = TolaUser(user=psmith2_user, name="Patty Smith", organization=self.mc_org)

        psmith2_data = UserAdminSerializer(psmith2_tolauser).data
        validate_this = UserAdminSerializer(data=psmith2_data)
        self.assertEqual(validate_this.is_valid(), True)

        psmith2_user.email = "psmith@mercycorps.org"
        psmith2_data = UserAdminSerializer(psmith2_tolauser).data
        validate_this = UserAdminSerializer(data=psmith2_data)
        self.assertFalse(validate_this.is_valid())
        self.assertIn("email", validate_this.errors)
        self.assertEqual(len(validate_this.errors), 1)

        psmith2_user.username = "psmith@mercycorps.org"
        psmith2_data = UserAdminSerializer(psmith2_tolauser).data
        validate_this = UserAdminSerializer(data=psmith2_data)
        self.assertFalse(validate_this.is_valid())
        self.assertIn("email", validate_this.errors)
        self.assertEqual(len(validate_this.errors), 1)

        psmith2_user.username = "psmith"
        psmith2_data = UserAdminSerializer(psmith2_tolauser).data
        validate_this = UserAdminSerializer(data=psmith2_data)
        self.assertFalse(validate_this.is_valid())
        self.assertIn("email", validate_this.errors)
        self.assertIn("username", validate_this.errors)
        self.assertEqual(len(validate_this.errors), 2)

        psmith2_user.username = "psmith2@mercycorps.org"
        psmith2_user.email = "psmith2@mercycorps.org"
        psmith2_user.organization = self.mc_org
        psmith2_data = UserAdminSerializer(psmith2_tolauser).data
        validate_this = UserAdminSerializer(data=psmith2_data)
        self.assertTrue(validate_this.is_valid())

        psmith2_user.tola_user.organization = self.non_mc_org
        psmith2_data = UserAdminSerializer(psmith2_tolauser).data
        validate_this = UserAdminSerializer(data=psmith2_data)
        self.assertFalse(validate_this.is_valid())
        self.assertIn("email", validate_this.errors)
        self.assertEqual(len(validate_this.errors), 1)

        psmith2_user.email = "psmith2@example.org"
        psmith2_user.tola_user.organization = self.non_mc_org
        psmith2_data = UserAdminSerializer(psmith2_tolauser).data
        validate_this = UserAdminSerializer(data=psmith2_data)
        self.assertTrue(validate_this.is_valid())

        psmith2_user.tola_user.organization = self.mc_org
        psmith2_data = UserAdminSerializer(psmith2_tolauser).data
        validate_this = UserAdminSerializer(data=psmith2_data)
        self.assertFalse(validate_this.is_valid())
        self.assertIn("email", validate_this.errors)
        self.assertEqual(len(validate_this.errors), 1)

