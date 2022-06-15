from factories.workflow_models import ProgramFactory
from workflow.models import GaitID
from django.db import transaction
from django.test import TestCase


class GaitIDTests(TestCase):

    def setUp(self):
        self.program = ProgramFactory()
        return super().setUp()

    def get_program_gaitid_count(self):
        return GaitID.objects.filter(program=self.program).count()

    def create_gaitids(self, gaitid_list):
        for gaitid in gaitid_list:
            try:
                with transaction.atomic():
                    gait = GaitID(program=self.program, gaitid=gaitid)
                    gait.save()
            except ValueError:
                continue

    def test_one_gaitid(self):
        expected_gaitid_count = 1

        self.assertEqual(self.get_program_gaitid_count(), expected_gaitid_count)

    def test_multiple_gaitids(self):
        gaitid_list = ['1234', '4555', '9743', '3456']
        expected_gaitid_count = 5  # 1 from the ProgramFactory and 4 from the list
        self.create_gaitids(gaitid_list)

        self.assertEqual(self.get_program_gaitid_count(), expected_gaitid_count)

    def test_multiple_gaitids_some_invalid(self):
        gaitid_list = ['abc', '1234', '8643', '1-a']
        expected_gaitid_count = 3
        self.create_gaitids(gaitid_list)

        self.assertEqual(self.get_program_gaitid_count(), expected_gaitid_count)
