"""Ensure reporting_period_start and reporting_period_end can only be set with first and last of the month dates
respectively"""

from io import StringIO
from os import path
from django import test
from django.core.management import call_command
from unittest import skip
from factories import workflow_models as w_factories
from workflow.management.commands.upload_programs import process_file
from django.contrib.auth.models import User


@skip('Tests will fail on GitHub without the secret_keys')
class TestUploadIDAAPrograms(test.TestCase):

    def setUp(self):
        w_factories.CountryFactory(country="HQ", code="HQ")
        w_factories.CountryFactory(country="Mercy Corps NW", code="US")

    def test_dry_run(self):
        output = StringIO()
        call_command(
            'upload_IDAA_programs', upload=False, create_discrepancies=False, create_report=False,
            supress_output=False, verbosity=0, stdout=output)
        # Command should not output anything. Program upload class is tested separately.
        self.assertEqual('', output.getvalue())


@skip('This has been replaced by upload_IDAA_programs command')
class TestProgramUpload(test.TestCase):

    # @classmethod
    # def setUpClass(cls):
    #     super().setUpClass()
    #     cls.program1 = w_factories.ProgramFactory(
    #         reporting_period_start=datetime.date(2015, 1, 1),
    #         reporting_period_end=datetime.date(2017, 12, 31))

    def setUp(self):
        # self.user = w_factories.UserFactory(first_name="FN", last_name="LN", username="iptt_tester", is_superuser=True)
        # self.user.set_password('password')
        # self.user.save()

        # self.tola_user = w_factories.TolaUserFactory(user=self.user)
        # self.tola_user.save()

        # self.client = test.Client(enforce_csrf_checks=False)
        # self.client.login(username='iptt_tester', password='password')
        indonesia = w_factories.CountryFactory(country='Indonesia')
        syria = w_factories.CountryFactory(country='Syria')
        colombia = w_factories.CountryFactory(country='Colombia')
        program1 = w_factories.RFProgramFactory(gaitid=1, country=[indonesia])
        program2 = w_factories.RFProgramFactory(gaitid=2, country=[syria])
        program3 = w_factories.RFProgramFactory(gaitid=3, country=[syria, indonesia])
        program4s = w_factories.RFProgramFactory(gaitid=4, country=[syria])
        program4i = w_factories.RFProgramFactory(gaitid=4, country=[indonesia])

    def test_base_upload(self):
        events = process_file(
            path.join(path.dirname(path.abspath(__file__)), 'fixtures/program_upload_data.csv'), 'initial')

        self.assertEqual(len(events['warn_no_gait']), 2)
        self.assertEqual(len(events['warn_excess_gait']), 1)
        self.assertEqual(len(events['funded_not_found']), 0)
        self.assertEqual(len(events['added_external_id']), 1)
        self.assertEqual(len(events['created_program']), 0)
        self.assertEqual(len(events['updated_program']), 0)
        self.assertEqual(len(events['gait_program_mismatch']), 0)
        self.assertEqual(len(events['no_change']), 0)
        self.assertEqual(len(events['country_mismatch']), 2)

    def test_extra_fund_code_generates_warning(self):
        pass

    def test_no_countries_prevents_upload(self):
        pass

    def test_validates_csv_file_structure(self):
        pass


class TestXanaduPermissions(test.TestCase):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.mc_organization = w_factories.OrganizationFactory(pk=1, name='Mercy Corps')
        cls.non_mc_organization = w_factories.OrganizationFactory()
        cls.homecountry = w_factories.CountryFactory(country="USA", code="US")
        cls.xanadu = w_factories.CountryFactory(country="Xanadu", code="XA")
        cls.mc_tolauser = w_factories.TolaUserFactory(organization=cls.mc_organization)
        w_factories.CountryAccessFactory(tolauser=cls.mc_tolauser, country=cls.homecountry, role='basic_admin')
        cls.non_mc_tolauser = w_factories.TolaUserFactory(organization=cls.non_mc_organization)

    def test_access_to_xanadu(self):
        # Test that mc_tolauser initially has one managed country, non_mc_tolauser has none
        self.assertEqual(len(self.mc_tolauser.managed_countries), 1)
        self.assertEqual(len(self.non_mc_tolauser.managed_countries), 0)
        output = StringIO()
        call_command('Xanadu_permissions', verbosity=0, stdout=output)
        # Test that after management command mc_tolauser has Xanadu added as managed country, non_mc_tolauser has not
        self.assertEqual(len(self.mc_tolauser.managed_countries), 2)
        xa = self.mc_tolauser.countries.filter(country="Xanadu").exists()
        self.assertEqual(xa, True)
        self.assertEqual(len(self.non_mc_tolauser.managed_countries), 0)


class TestAliasUserEmails(test.TestCase):
    alias = 'tola+'
    users_to_create = 5

    def setUp(self):
        organization = w_factories.OrganizationFactory(pk=1, name='Mercy Corps')

        for _ in range(self.users_to_create):
            w_factories.TolaUserFactory(organization=organization)

    def test_command(self):
        call_command('alias_user_emails', execute=True)

        users = User.objects.all()

        for user in users:
            self.assertEqual(user.email[0:len(self.alias)], self.alias)
            self.assertTrue(user.email.endswith('@mercycorps.org'))
