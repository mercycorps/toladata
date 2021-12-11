"""Ensure reporting_period_start and reporting_period_end can only be set with first and last of the month dates
respectively"""

import datetime
from os import path
from django import test
from django.core.management import call_command
from unittest import skip
from factories import workflow_models as w_factories
from workflow.models import Program
from workflow.management.commands.upload_programs import process_file, get_program_maps, \
    SUCCESS_SIMPLE, ERROR_NO_MATCHING_GAIT
from pathlib import Path, PurePath


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
        file_path = path.join(path.dirname(path.abspath(__file__)), 'fixtures/program_upload_data.csv')
        import_gait_to_program_map, tola_gait_to_program_map, tola_external_id_to_program_map = \
            get_program_maps(file_path)
        dispositions = process_file(
            file_path, 'initial', tola_gait_to_program_map, tola_external_id_to_program_map,
            import_gait_to_program_map)

        disposition_counts = {}
        for disposition in dispositions:
            try:
                disposition_counts[disposition.disposition_type].append(disposition)
            except KeyError:
                disposition_counts[disposition.disposition_type] = [disposition]
        self.assertEqual(len(disposition_counts[SUCCESS_SIMPLE]), 1)
        self.assertEqual(len(disposition_counts[ERROR_NO_MATCHING_GAIT]), 2)
        # self.assertEqual(len(dispositions['funded_not_found']), 0)
        # self.assertEqual(len(dispositions['added_external_id']), 1)
        # self.assertEqual(len(dispositions['created_program']), 0)
        # self.assertEqual(len(dispositions['updated_program']), 0)
        # self.assertEqual(len(dispositions['gait_program_mismatch']), 0)
        # self.assertEqual(len(dispositions['no_change']), 0)
        # self.assertEqual(len(dispositions['country_mismatch']), 2)


    @skip
    def test_extra_fund_code_generates_warning(self):
        pass

    @skip
    def test_no_countries_prdispositions_upload(self):
        pass

    @skip
    def test_validates_csv_file_structure(self):
        pass
