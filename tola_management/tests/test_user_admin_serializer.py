
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
        self.assertEqual(validate_this.is_valid(), True, "There should be no errors for these valid settings")

        psmith2_user.email = "psmith@mercycorps.org"
        psmith2_user.username = "psmyth"
        psmith2_user.tola_user.organization = self.mc_org
        psmith2_data = UserAdminSerializer(psmith2_tolauser).data
        validate_this = UserAdminSerializer(data=psmith2_data)
        self.assertFalse(validate_this.is_valid(), "Duplicate emails should throw an error")
        self.assertIn("email", validate_this.errors, "Duplicate emails should throw an error")
        self.assertEqual(len(validate_this.errors), 1, "Only email error should be thrown, no username error")

        psmith2_user.email = "psmith@mercycorps.org"
        psmith2_user.username = "psmith@mercycorps.org"
        psmith2_user.tola_user.organization = self.mc_org
        psmith2_data = UserAdminSerializer(psmith2_tolauser).data
        validate_this = UserAdminSerializer(data=psmith2_data)
        self.assertFalse(validate_this.is_valid(), "Duplicate emails should throw an error")
        self.assertIn("email", validate_this.errors, "Duplicate emails should throw an error")
        self.assertEqual(len(validate_this.errors), 1, "Only email error should be thrown, username is still unique")

        psmith2_user.email = "psmith@mercycorps.org"
        psmith2_user.username = "psmith"
        psmith2_user.tola_user.organization = self.mc_org
        psmith2_data = UserAdminSerializer(psmith2_tolauser).data
        validate_this = UserAdminSerializer(data=psmith2_data)
        self.assertFalse(validate_this.is_valid(), "Dupe email and username should both throw errors")
        self.assertIn("email", validate_this.errors, "Duplicate emails should throw an error")
        self.assertIn("username", validate_this.errors, "Duplicate username should throw an error")
        self.assertEqual(len(validate_this.errors), 2, "Dupe email and username should both throw errors")

        psmith2_user.username = "psmith2@mercycorps.org"
        psmith2_user.email = "psmith2@mercycorps.org"
        psmith2_user.organization = self.mc_org
        psmith2_data = UserAdminSerializer(psmith2_tolauser).data
        validate_this = UserAdminSerializer(data=psmith2_data)
        self.assertTrue(validate_this.is_valid(), "No errors if username and email are unique")

        psmith2_user.username = "psmith2@mercycorps.org"
        psmith2_user.email = "psmith2@mercycorps.org"
        psmith2_user.tola_user.organization = self.non_mc_org
        psmith2_data = UserAdminSerializer(psmith2_tolauser).data
        validate_this = UserAdminSerializer(data=psmith2_data)
        self.assertFalse(validate_this.is_valid(), "MC org should not use MC email as email or username")
        self.assertIn("email", validate_this.errors, "MC email should not be used by non-MC org")
        self.assertIn("username", validate_this.errors, "MC email should not be used by non-MC org for username")
        self.assertEqual(len(validate_this.errors), 2, "Using MC email for email and username should throw 2 errors")

        psmith2_user.username = "psmith2@mercycorps.org"
        psmith2_user.email = "psmith2@example.org"
        psmith2_user.tola_user.organization = self.non_mc_org
        psmith2_data = UserAdminSerializer(psmith2_tolauser).data
        validate_this = UserAdminSerializer(data=psmith2_data)
        self.assertFalse(validate_this.is_valid(), "MC org should not use MC email as username")
        self.assertIn("username", validate_this.errors, "MC email should not be used by non-MC org for username")
        self.assertEqual(len(validate_this.errors), 1, "Using MC email for username should throw 1 error")

        psmith2_user.username = "psmith2@mercycorps.org"
        psmith2_user.email = "psmith2@example.org"
        psmith2_user.tola_user.organization = self.mc_org
        psmith2_data = UserAdminSerializer(psmith2_tolauser).data
        validate_this = UserAdminSerializer(data=psmith2_data)
        self.assertFalse(validate_this.is_valid(), "Using non-MC email for MC org should be invalid")
        self.assertIn("email", validate_this.errors, "Using non-MC email for MC org should be invalid")
        self.assertEqual(len(validate_this.errors), 1, "Using non-MC email for MC org should be invalid")

