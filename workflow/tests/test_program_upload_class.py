from django.core import mail
from factories import workflow_models
from workflow import program, models, utils
from tola_management.models import ProgramAdminAuditLog
from unittest import skip
from django import test
import json
import copy

# Prevents an exception when ran on github
try:
    msr_country_codes_list = utils.AccessMSR().countrycode_list()
    msr_gaitid_list = utils.AccessMSR().gaitid_list()
except AttributeError:
    pass


# TODO ATTENTION! The test_program_create method includes testing email notifications. In order for the test to work,
#  the "django.core.mail.backends.smtp.EmailBackend" has to be enabled and SKIP_USER_EMAILS has to be set to FALSE in
#  settings!

@skip('Tests will fail on GitHub without the secret_keys')
class TestProgramUpload(test.TestCase):
    idaa_sample_data_path = 'workflow/tests/idaa_sample_data/idaa_sample.json'
    msr_sample_data_path = 'workflow/tests/idaa_sample_data/msr_gaitid_sample.json'
    create_idaa_program_index = 2
    new_idaa_program_index = 5
    idaa_json = None
    msr_json = None
    duplicated_gaitids = ["99999.0000000000"]

    def setUp(self):
        """
        Need to create a program that is from the idaa sample
        """
        self._create_IDAA_user()
        # Create admin_user for country HQ
        self._create_admin_user()

        with open(self.idaa_sample_data_path) as file:
            self.idaa_json = json.load(file)

        with open(self.msr_sample_data_path) as file:
            self.msr_json = json.load(file)

        target_idaa_program = self.idaa_json['value'][self.create_idaa_program_index]['fields']

        new_program = self._create_tola_program(target_idaa_program, fields={
            "name": target_idaa_program['ProgramName'],
            "funding_status": target_idaa_program['ProgramStatus'],
            "start_date": program.convert_date(target_idaa_program['ProgramStartDate']),
            "end_date": program.convert_date(target_idaa_program['ProgramEndDate'])
        }, create_country=False)

        new_country = workflow_models.CountryFactory(country='Timor-Leste', code='TL')

        new_program.country.add(new_country)

        workflow_models.CountryFactory(country='HQ', code='HQ')
        workflow_models.CountryFactory(country='Palestine (West Bank / Gaza)', code='PS')

    def _create_IDAA_user(self):
        user = workflow_models.UserFactory(username='IDAA', first_name='IDAA', last_name='')
        user.save()
        tola_user = workflow_models.TolaUserFactory(user=user, organization_id=1)
        tola_user.save()

    def _create_tola_program(self, idaa_program, fields, create_country=True):
        """
        Creates a Tola program
        """
        if create_country:
            country = workflow_models.CountryFactory(
                country=idaa_program['Country'],
                code='HQ'
            )
            fields['countries'] = [country]

        new_program = workflow_models.ProgramFactory(**fields)

        for gaitid in idaa_program['GaitIDs']:
            clean_gaitid = str(gaitid['LookupValue']).split('.')[0]

            new_gaitid = models.GaitID(gaitid=clean_gaitid, program_id=new_program.id)
            new_gaitid.save()

        return new_program

    def _create_admin_user(self):
        mc = workflow_models.OrganizationFactory(pk=1, name="MC")
        hq = workflow_models.CountryFactory(code="HQ", country="HQ")
        admin_user = workflow_models.UserFactory(username="admin_user")
        tola_admin_user = workflow_models.TolaUserFactory(user=admin_user, country=hq, organization=mc)
        workflow_models.grant_country_access(tola_admin_user, hq, role='basic_admin')

    def test_validation_idaa_not_funded(self):
        """
        Test validation when an IDAA program is not funded
        """
        idaa_not_funded_index = 0

        upload_program = program.ProgramUpload(idaa_program=self.idaa_json['value'][idaa_not_funded_index]['fields'],
            msr_country_codes_list=msr_country_codes_list, msr_gaitid_list=msr_gaitid_list, duplicated_gaitids=self.duplicated_gaitids
        )

        self.assertFalse(upload_program.is_valid())

    def test_validation_idaa_valid_and_exists(self):
        """
        Test validation when an IDAA program is valid and exists in Tola
        """
        expected_discrepancies = 0

        upload_program = program.ProgramUpload(idaa_program=self.idaa_json['value'][self.create_idaa_program_index]['fields'],
            msr_country_codes_list=msr_country_codes_list, msr_gaitid_list=msr_gaitid_list, duplicated_gaitids=self.duplicated_gaitids
        )

        self.assertTrue(upload_program.is_valid())
        self.assertTrue(upload_program.tola_program_exists)
        self.assertEquals(upload_program.discrepancy_count, expected_discrepancies)

    def test_validation_idaa_valid_and_does_not_exists(self):
        """
        Test validation when an IDAA program is valid and does not exist in Tola
        """
        idaa_index = 1
        expected_discrepancies = 0

        upload_program = program.ProgramUpload(idaa_program=self.idaa_json['value'][idaa_index]['fields'],
            msr_country_codes_list=msr_country_codes_list, msr_gaitid_list=msr_gaitid_list, duplicated_gaitids=self.duplicated_gaitids
        )

        self.assertTrue(upload_program.is_valid())
        self.assertFalse(upload_program.tola_program_exists)
        self.assertEquals(upload_program.discrepancy_count, expected_discrepancies)

    def test_invalid_countries_tola_program(self):
        """
        Test validation when a Tola program has mismatching countries to the IDAA program
        """
        idaa_index = 3
        expected_discrepancies = 1

        idaa_program = self.idaa_json['value'][idaa_index]['fields']

        self._create_tola_program(idaa_program, fields={
            "name": idaa_program['ProgramName'],
            "funding_status": idaa_program['ProgramStatus'],
            "start_date": program.convert_date(idaa_program['ProgramStartDate']),
            "end_date": program.convert_date(idaa_program['ProgramEndDate']),
        }, create_country=False)

        upload_program = program.ProgramUpload(idaa_program=idaa_program,
            msr_country_codes_list=msr_country_codes_list, msr_gaitid_list=msr_gaitid_list, duplicated_gaitids=self.duplicated_gaitids
        )
        self.assertTrue(upload_program.is_valid())
        self.assertTrue(upload_program.tola_program_exists)
        self.assertEquals(upload_program.discrepancy_count, expected_discrepancies)
        self.assertTrue(upload_program.has_discrepancy('countries'))

    def test_one_idaa_to_multiple_tola_programs(self):
        """
        Test validation when an IDAA program matches to multiple TolaData programs
        """
        idaa_index = 7
        expected_discrepancies = 1

        idaa_program = self.idaa_json['value'][idaa_index]['fields']

        for x in range(2):
            self._create_tola_program(idaa_program, fields={
                "name": f"multiple toladata program {x}",
                "funding_status": idaa_program['ProgramStatus'],
                "start_date": program.convert_date(idaa_program['ProgramStartDate']),
                "end_date": program.convert_date(idaa_program['ProgramEndDate']),
            }, create_country=True)

        upload_program = program.ProgramUpload(idaa_program=idaa_program,
            msr_country_codes_list=msr_country_codes_list, msr_gaitid_list=msr_gaitid_list, duplicated_gaitids=self.duplicated_gaitids
        )

        self.assertTrue(upload_program.is_valid())
        upload_program.upload()
        self.assertTrue(upload_program.tola_program_exists)
        self.assertTrue(upload_program.multiple_tola_programs)
        self.assertEqual(upload_program.discrepancy_count, expected_discrepancies)
        self.assertTrue(upload_program.has_discrepancy('multiple_programs'))

        tola_programs = upload_program.get_tola_programs()

        for tola_program in tola_programs:
            self.assertNotEqual(tola_program.name, idaa_program['ProgramName'])

    def test_invalid_gaitid_idaa_program(self):
        """
        Test validation when an IDAA program has invalid GaitIDs
        """
        idaa_index = 3
        expected_discrepancies = 1

        idaa_program = self.idaa_json['value'][idaa_index]['fields']

        idaa_program['GaitIDs'][0] = {'LookupValue': '1237a'}

        upload_program = program.ProgramUpload(idaa_program=idaa_program,
            msr_country_codes_list=msr_country_codes_list, msr_gaitid_list=msr_gaitid_list, duplicated_gaitids=self.duplicated_gaitids
        )

        self.assertFalse(upload_program.is_valid())
        self.assertEquals(upload_program.discrepancy_count, expected_discrepancies)
        self.assertTrue(upload_program.has_discrepancy('gaitid'))

    def test_missing_gaitid_idaa_program(self):
        """
        Test validation when an IDAA program does not have a Gait id
        """
        idaa_index = 3
        expected_discrepancies = 1

        idaa_program = self.idaa_json['value'][idaa_index]['fields']

        idaa_program['GaitIDs'] = []

        upload_program = program.ProgramUpload(idaa_program=idaa_program,
            msr_country_codes_list=msr_country_codes_list, msr_gaitid_list=msr_gaitid_list, duplicated_gaitids=self.duplicated_gaitids
        )

        self.assertFalse(upload_program.is_valid())
        self.assertEquals(upload_program.discrepancy_count, expected_discrepancies)
        self.assertTrue(upload_program.has_discrepancy('gaitid'))

    def test_each_field_empty_idaa_program(self):
        """
        Test validation when an IDAA program has an empty required field
        """
        fields = ["id", "ProgramName", "ProgramStartDate", "ProgramEndDate", "Country"]
        idaa_index = 3
        expected_discrepancies = 1

        for field in fields:
            idaa_program = copy.copy(self.idaa_json['value'][idaa_index]['fields'])

            idaa_program[field] = ''

            upload_program = program.ProgramUpload(idaa_program=idaa_program,
                msr_country_codes_list=msr_country_codes_list, msr_gaitid_list=msr_gaitid_list, duplicated_gaitids=self.duplicated_gaitids
            )

            self.assertFalse(upload_program.is_valid())
            self.assertEquals(upload_program.discrepancy_count, expected_discrepancies)
            self.assertTrue(upload_program.has_discrepancy(field))

    def test_mulitple_idaa_gaitids(self):
        """
        Test validation when an IDAA program has multiple gait ids
        """
        idaa_index = 4
        expected_discrepancies = 0

        upload_program = program.ProgramUpload(idaa_program=self.idaa_json['value'][idaa_index]['fields'],
            msr_country_codes_list=msr_country_codes_list, msr_gaitid_list=msr_gaitid_list, duplicated_gaitids=self.duplicated_gaitids
        )

        self.assertTrue(upload_program.is_valid())
        self.assertEquals(upload_program.discrepancy_count, expected_discrepancies)

    def test_skip_is_valid(self):
        """
        Test that upload raises correctly when is_valid was not called
        """
        idaa_index = 3

        upload_program = program.ProgramUpload(idaa_program=self.idaa_json['value'][idaa_index]['fields'],
            msr_country_codes_list=msr_country_codes_list, msr_gaitid_list=msr_gaitid_list, duplicated_gaitids=self.duplicated_gaitids
        )

        self.assertRaises(Exception, upload_program.upload)

    def test_duplicated_gaitid(self):
        """
        Test to check if a duplicated gaitid is properly assigned a discrepancy
        """
        idaa_index = 6

        upload_program = program.ProgramUpload(idaa_program=self.idaa_json['value'][idaa_index]['fields'],
            msr_country_codes_list=msr_country_codes_list, msr_gaitid_list=msr_gaitid_list, duplicated_gaitids=self.duplicated_gaitids
        )

        self.assertFalse(upload_program.is_valid())
        self.assertTrue(upload_program.has_discrepancy('duplicate_gaitid'))

    def test_program_update(self):
        """
        Test that an existing Tola program is updated from IDAA
        """
        gaitid = 10476
        tola_program = models.Program.objects.get(gaitid__gaitid=gaitid)
        expected_donor = 'World Vision International'
        expected_donor_dept = 'Bureau of Humanitarian Assistance (BHA)'
        expected_name = '2021 Timor-Leste Cyclone Seroja Flood Response'
        expected_fund_code = 33677

        tola_program.name = 'test name change'
        tola_program.save()

        upload_program = program.ProgramUpload(idaa_program=self.idaa_json['value'][self.create_idaa_program_index]['fields'],
            msr_country_codes_list=msr_country_codes_list, msr_gaitid_list=msr_gaitid_list, duplicated_gaitids=self.duplicated_gaitids
        )

        if upload_program.is_valid():
            upload_program.upload()

        self.assertFalse(upload_program.new_upload)

        tola_program = models.Program.objects.get(gaitid__gaitid=gaitid)
        audit_log_count = ProgramAdminAuditLog.objects.filter(program=tola_program).count()

        self.assertEquals(tola_program.country.all().count(), 1)
        self.assertEquals(tola_program.gaitid.all().count(), 1)
        self.assertEquals(tola_program.idaa_outcome_theme.all().count(), 3)
        self.assertEquals(tola_program.gaitid.first().fundcode_set.first().fund_code, expected_fund_code)
        self.assertEquals(tola_program.name, expected_name)
        self.assertEquals(tola_program.gaitid.first().donor, expected_donor)
        self.assertEquals(tola_program.gaitid.first().donor_dept, expected_donor_dept)
        self.assertEquals(audit_log_count, 1)

    def test_program_update_delete_mismatched_gaitid(self):
        """
        Test that a mismatched gaitid for Tola programs is deleted
        """
        removed_gaitid = 18021
        gaitid = 10476
        tola_program = models.Program.objects.get(gaitid__gaitid=gaitid)
        new_gaitid = models.GaitID(gaitid=removed_gaitid, program=tola_program)
        new_gaitid.save()

        upload_program = program.ProgramUpload(idaa_program=self.idaa_json['value'][self.create_idaa_program_index]['fields'],
            msr_country_codes_list=msr_country_codes_list, msr_gaitid_list=msr_gaitid_list, duplicated_gaitids=self.duplicated_gaitids
        )

        if upload_program.is_valid():
            upload_program.upload()

        self.assertFalse(upload_program.new_upload)

        tola_program = models.Program.objects.get(gaitid__gaitid=gaitid)
        audit_log_count = ProgramAdminAuditLog.objects.filter(program=tola_program).count()

        self.assertEquals(tola_program.gaitid.all().count(), 1)
        self.assertEquals(tola_program.idaa_outcome_theme.all().count(), 3)
        self.assertEquals(audit_log_count, 1)

    def test_program_create(self):
        """
        Test that a new program is created if it does not exist in Tola. This test includes email notifications.
        In order for the test to work, the "django.core.mail.backends.smtp.EmailBackend" has to be enabled and
        SKIP_USER_EMAILS has to be set to FALSE in settings!
        """

        external_program_id = self.idaa_json['value'][self.new_idaa_program_index]['fields']['id']
        expected_program_name = self.idaa_json['value'][self.new_idaa_program_index]['fields']['ProgramName']
        gaitidvalue = self.idaa_json['value'][self.new_idaa_program_index]['fields']['GaitIDs'][0]['LookupValue']
        expected_gaitid = int(str(gaitidvalue).split('.')[0])
        expected_country = self.idaa_json['value'][self.new_idaa_program_index]['fields']['Country'][0]['LookupValue']

        program_to_be_created = program.ProgramUpload(
            idaa_program=self.idaa_json['value'][self.new_idaa_program_index]['fields'],
            msr_country_codes_list=msr_country_codes_list, msr_gaitid_list=self.msr_json, duplicated_gaitids=self.duplicated_gaitids
            )

        if program_to_be_created.is_valid():
            program_to_be_created.upload()

        self.assertTrue(program_to_be_created.new_upload)

        tola_program = models.Program.objects.get(external_program_id=external_program_id)
        audit_log_count = ProgramAdminAuditLog.objects.filter(program=tola_program).count()

        self.assertEquals(tola_program.name, expected_program_name)
        self.assertEquals(tola_program.gaitid.first().gaitid, expected_gaitid)
        self.assertEquals(tola_program.funding_status, 'Funded')
        self.assertEquals(tola_program.country.first().country, expected_country)
        self.assertEquals(tola_program.idaa_outcome_theme.all().count(), 2)
        self.assertEquals(audit_log_count, 1)

        # Verify that one message has been sent.
        self.assertEqual(len(mail.outbox), 1)
        # Verify to, from_email and message subject.
        to = ['admin_user@testenv.com']
        self.assertEqual(mail.outbox[0].to, to)
        from_email = 'test@example.com'
        self.assertEqual(mail.outbox[0].from_email, from_email)
        subject = "Attention: A new program was added to TolaData - Attention: Un nouveau programme a été ajouté à TolaData - Atención: Se ha añadido un nuevo programa a TolaData"
        self.assertEqual(mail.outbox[0].subject, subject)



