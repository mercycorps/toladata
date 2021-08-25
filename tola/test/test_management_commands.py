import os
import re
from django import test

from factories.workflow_models import SectorFactory
from factories.indicators_models import (
    ReportingFrequencyFactory, DataCollectionFrequencyFactory, IndicatorTypeFactory)
from tola.management.commands.makemessagesdb import create_translated_db_items, Command
from tola.management.commands.create_temp_translations import WHITESPACE_REGEX


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

    def test_makemessagedb_contains_new_values(self):

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


class TestTempTranslations(test.TestCase):

    def run_match(self, test_string, g1, g2):
        matches = WHITESPACE_REGEX.match(test_string)
        self.assertEqual(matches.group(1), g1)
        self.assertEqual(matches.group(2), g2)

    def test_regex(self):
        self.run_match('I am', '', 'I am')
        self.run_match('I am\nreally', '', 'I am\nreally')
        self.run_match('  I am', '  ', 'I am')
        self.run_match('\n I am', '\n ', 'I am')
        self.run_match('\n<p>I am</p><p>hungry</p>', '\n<p>', 'I am</p><p>hungry</p>')
        self.run_match(' <p><strong>I am</strong></p><p>hungry</p>', ' <p><strong>', 'I am</strong></p><p>hungry</p>')



