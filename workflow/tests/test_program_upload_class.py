from factories import workflow_models
from workflow import program, models
from django import test
import json
import copy


class TestProgramUpload(test.TestCase):
    idaa_sample_data_path = 'workflow/tests/idaa_sample_data/idaa_sample.json'
    create_idaa_program_index = 2
    idaa_json = None

    def setUp(self):
        """
        Need to create a program that is from the idaa sample
        """
        with open(self.idaa_sample_data_path) as file:
            self.idaa_json = json.load(file)
        
        target_idaa_program = self.idaa_json['value'][self.create_idaa_program_index]['fields']

        self._create_tola_program(target_idaa_program, fields={
            "name": target_idaa_program['ProgramName'],
            "funding_status": target_idaa_program['ProgramStatus'],
            "start_date": program.convert_date(target_idaa_program['ProgramStartDate']),
            "end_date": program.convert_date(target_idaa_program['ProgramEndDate'])
        })

    def _create_tola_program(self, idaa_program, fields, create_country=True):
        """
        Creates a Tola program
        """
        if create_country:
            country = workflow_models.CountryFactory(
                country=idaa_program['Country']
            )
            fields['countries'] = [country]

        new_program = workflow_models.ProgramFactory(**fields)

        for gaitid in idaa_program['GaitIDs']:
            clean_gaitid = gaitid['LookupValue'].rstrip('.0')

            new_gaitid = models.GaitID(gaitid=clean_gaitid, program_id=new_program.id)
            new_gaitid.save()

    def test_validation_idaa_not_funded(self):
        """
        Test validation when an IDAA program is not funded
        """
        idaa_not_funded_index = 0
        
        upload_program = program.ProgramUpload(idaa_program=self.idaa_json['value'][idaa_not_funded_index]['fields'])
        
        self.assertFalse(upload_program.is_valid())

    def test_validation_idaa_valid_and_exists(self):
        """
        Test validation when an IDAA program is valid and exists in Tola
        """
        expected_discrepancies = 0

        upload_program = program.ProgramUpload(idaa_program=self.idaa_json['value'][self.create_idaa_program_index]['fields'])

        self.assertTrue(upload_program.is_valid())
        self.assertTrue(upload_program.tola_program_exists)
        self.assertEquals(upload_program.discrepancy_count, expected_discrepancies)

    def test_validation_idaa_valid_and_does_not_exists(self):
        """
        Test validation when an IDAA program is valid and does not exist in Tola
        """
        idaa_index = 1
        expected_discrepancies = 0

        upload_program = program.ProgramUpload(idaa_program=self.idaa_json['value'][idaa_index]['fields'])

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

        upload_program = program.ProgramUpload(idaa_program=idaa_program)

        self.assertFalse(upload_program.is_valid())
        self.assertTrue(upload_program.tola_program_exists)
        self.assertEquals(upload_program.discrepancy_count, expected_discrepancies)
        self.assertTrue(upload_program.has_discrepancy('countries'))

    def test_invalid_fields_tola_program(self):
        """
        Test validation when a Tola program has mismatching fields to the IDAA program
        """
        idaa_index = 3
        expected_discrepancies = 2

        idaa_program = self.idaa_json['value'][idaa_index]['fields']

        self._create_tola_program(idaa_program, fields={
            "name": idaa_program['ProgramName'],
            "funding_status": idaa_program['ProgramStatus'],
            "start_date": "2022-05-12",
            "end_date": "2022-08-01"
        })

        upload_program = program.ProgramUpload(idaa_program=idaa_program)

        self.assertFalse(upload_program.is_valid())
        self.assertTrue(upload_program.tola_program_exists)
        self.assertEquals(upload_program.discrepancy_count, expected_discrepancies)
        self.assertTrue(upload_program.has_discrepancy('start_date'))
        self.assertTrue(upload_program.has_discrepancy('end_date'))

    def test_invalid_gaitid_idaa_program(self):
        """
        Test validation when an IDAA program has invalid GaitIDs
        """
        idaa_index = 3
        expected_discrepancies = 1

        idaa_program = self.idaa_json['value'][idaa_index]['fields']
        
        idaa_program['GaitIDs'][0] = {'LookupValue': '1237a'}

        upload_program = program.ProgramUpload(idaa_program=idaa_program)

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

        upload_program = program.ProgramUpload(idaa_program=idaa_program)

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

            upload_program = program.ProgramUpload(idaa_program=idaa_program)

            self.assertFalse(upload_program.is_valid())
            self.assertEquals(upload_program.discrepancy_count, expected_discrepancies)
            self.assertTrue(upload_program.has_discrepancy(field))

    def test_mulitple_idaa_gaitids(self):
        """
        Test validation when an IDAA program has multiple gait ids
        """
        idaa_index = 4
        expected_discrepancies = 0

        upload_program = program.ProgramUpload(idaa_program=self.idaa_json['value'][idaa_index]['fields'])

        self.assertTrue(upload_program.is_valid())
        self.assertEquals(upload_program.discrepancy_count, expected_discrepancies)

    def test_skip_is_valid(self):
        """
        Test that upload raises correctly when is_valid was not called
        """
        idaa_index = 3
        
        upload_program = program.ProgramUpload(idaa_program=self.idaa_json['value'][idaa_index]['fields'])

        self.assertRaises(Exception, upload_program.upload)
