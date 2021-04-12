import os
from django import test
from tola.management.commands.makemessagesdb import create_translated_db_items, Command
from django.core import mail
from factories.workflow_models import TolaUserFactory, RFProgramFactory, SectorFactory
from factories.indicators_models import (
    RFIndicatorFactory, ReportingFrequencyFactory, DataCollectionFrequencyFactory, IndicatorTypeFactory)
from indicators.models import IndicatorType


class TestMakemessagesDB(test.TestCase):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.root_path = '/tmp'

    @classmethod
    def tearDownClass(cls):
        os.remove(os.path.join(cls.root_path, Command.js_filename))
        os.remove(os.path.join(cls.root_path, Command.py_filename))
        super().tearDownClass()

    def test_command_contains_new_values(self):

        # Check when values created
        string_values = ['test sector', 'test type', 'test reporting freq', 'test data collection freq']
        sector = SectorFactory(sector=string_values[0])
        indicator_type = IndicatorTypeFactory(indicator_type=string_values[1])
        reporting_freq = ReportingFrequencyFactory(frequency=string_values[2])
        data_collections_freq = DataCollectionFrequencyFactory(frequency=string_values[3])
        create_translated_db_items(Command.js_filename, Command.py_filename, root_path=self.root_path)
        for filename in [Command.js_filename, Command.py_filename]:
            with open(os.path.join(self.root_path, filename), 'r') as fh:
                file_contents = fh.read()
            for string_val in string_values:
                self.assertTrue(string_val in file_contents)

        # Check when values updated
        string_values = [
            'test sector new', 'test type new', 'test reporting freq new', 'test data collection freq new']
        sector.sector = string_values[0]
        sector.save()
        indicator_type.indicator_type = string_values[1]
        indicator_type.save()
        reporting_freq.frequency=string_values[2]
        reporting_freq.save()
        data_collections_freq.frequency = string_values[3]
        data_collections_freq.save()
        create_translated_db_items(Command.js_filename, Command.py_filename, root_path=self.root_path)
        for filename in [Command.js_filename, Command.py_filename]:
            with open(os.path.join(self.root_path, filename), 'r') as fh:
                file_contents = fh.read()
            for string_val in string_values:
                self.assertTrue(string_val in file_contents)

