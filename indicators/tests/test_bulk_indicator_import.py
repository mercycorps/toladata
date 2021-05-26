import json
import string
import time
import os
import unittest
import copy
from tempfile import NamedTemporaryFile
import openpyxl
from openpyxl.cell import MergedCell
from django import test
from django.conf import settings
from django.core.files.base import ContentFile
from django.urls import reverse
from django.utils.translation import gettext, activate
from factories import (
    workflow_models as w_factories,
    indicators_models as i_factories
)
from indicators.models import Indicator, Level, LevelTier, BulkIndicatorImportFile
from indicators.views.bulk_indicator_import_views import (
    COLUMNS, FIRST_USED_COLUMN, DATA_START_ROW, PROGRAM_NAME_ROW, TEMPLATE_SHEET_NAME, HIDDEN_SHEET_NAME,
    BASE_TEMPLATE_NAME, ERROR_INDICATOR_DATA_NOT_FOUND, ERROR_TEMPLATE_NOT_FOUND, ERROR_MISMATCHED_PROGRAM,
    ERROR_NO_NEW_INDICATORS, ERROR_UNDETERMINED_LEVEL, ERROR_INVALID_LEVEL_HEADER, ERROR_MALFORMED_INDICATOR,
    LEVEL_HEADER_STYLE, PROTECTED_INDICATOR_STYLE, UNPROTECTED_INDICATOR_STYLE
)


class TestBulkImportTemplateCreation(test.TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.country = w_factories.CountryFactory()
        # cls.program = w_factories.RFProgramFactory(
        #     country=[cls.country], tiers=True, levels=6, indicators=150, indicators__levels=True)
        cls.program = w_factories.RFProgramFactory(
            country=[cls.country], tiers=True, levels=2, indicators=5, indicators__levels=True)
        levels = Level.objects.filter(program=cls.program)
        cls.ordered_levels = sorted(levels, key=lambda l: l.ontology)
        cls.tola_user = w_factories.TolaUserFactory()
        cls.client = test.client
        cls.first_used_column = FIRST_USED_COLUMN
        cls.data_start_row = DATA_START_ROW
        cls.program_name_row = PROGRAM_NAME_ROW
        cls.letters = list(string.ascii_lowercase) + [f'a{letter}' for letter in list(string.ascii_lowercase)]

    def get_template(self, program=None, request_params=None):
        if not program:
            program = self.program
        if not request_params:
            request_params = dict([(gettext(tier.name), 10) for tier in LevelTier.objects.filter(program=program)])
        response = self.client.get(reverse('bulk_import_indicators', args=[program.pk]), data=request_params)
        return ContentFile(response.content)

    def get_expected_indicator_numbers(self, config, request_params, has_indicators=False):
        expected_numbers = []
        for level_conf in config:
            row_count = request_params[level_conf['tier']]
            row_count += level_conf['indicators'] if has_indicators else 0
            display_ontology = Level.truncate_ontology(level_conf['ontology'])
            expected_numbers.append([f'{display_ontology}{letter}' for letter in self.letters[:row_count]])
        return expected_numbers

    def process_indicator_rows(self, wb):
        ws = wb.get_sheet_by_name(TEMPLATE_SHEET_NAME)
        counts = {'level_headers': 0, 'existing_indicators': [], 'new_indicators': []}
        level_names = []
        indicator_numbers = []
        level_index = -1
        for row_index in range(DATA_START_ROW, ws.max_row + 1):
            if isinstance(ws.cell(row_index, FIRST_USED_COLUMN + 1), MergedCell):
                # It's a level header
                level_names.append(ws.cell(row_index, FIRST_USED_COLUMN).value)
                indicator_numbers.append([])
                counts['level_headers'] += 1
                counts['existing_indicators'].append(0)
                counts['new_indicators'].append(0)
                level_index += 1
                self.assertEqual(ws.cell(row_index, FIRST_USED_COLUMN).style, LEVEL_HEADER_STYLE)
            elif ws.cell(row_index, FIRST_USED_COLUMN + 2).value is not None:
                counts['existing_indicators'][level_index] += 1
                indicator_numbers[-1].append(ws.cell(row_index, FIRST_USED_COLUMN + 1).value)
                are_protected = [ws.cell(row_index, col).style == PROTECTED_INDICATOR_STYLE
                                for col in range(FIRST_USED_COLUMN, len(COLUMNS) )]
                self.assertTrue(all(are_protected))
            elif ws.cell(row_index, FIRST_USED_COLUMN + 1).value is not None:
                counts['new_indicators'][level_index] += 1
                indicator_numbers[-1].append(ws.cell(row_index, FIRST_USED_COLUMN + 1).value)
                are_unprotected = [ws.cell(row_index, col).style == UNPROTECTED_INDICATOR_STYLE
                                 for col in range(FIRST_USED_COLUMN, len(COLUMNS))]
                self.assertTrue(all(are_unprotected))
        return counts, level_names, indicator_numbers

    def compare_ws_lines(self, wb, expected_counts, expected_level_names, expected_indicator_numbers):
        actual_counts, actual_level_names, actual_indicator_numbers = self.process_indicator_rows(wb)
        self.assertEqual(actual_counts, expected_counts)
        self.assertEqual(actual_level_names, expected_level_names)
        self.assertEqual(actual_indicator_numbers, expected_indicator_numbers)

    def test_permissions(self):
        response = self.client.get(reverse('bulk_import_indicators', args=[self.program.pk]))
        self.assertRedirects(response, '/accounts/login/')
        self.client.force_login(self.tola_user.user)
        response = self.client.get(reverse('bulk_import_indicators', args=[self.program.pk]))
        self.assertEqual(response.status_code, 403)
        w_factories.grant_program_access(self.tola_user, self.program, self.country, role='medium')
        response = self.client.get(reverse('bulk_import_indicators', args=[self.program.pk]))
        self.assertEqual(response.status_code, 403)
        w_factories.grant_program_access(self.tola_user, self.program, self.country, role='high')
        request_params = dict([(tier.name, 10) for tier in LevelTier.objects.filter(program=self.program)])
        response = self.client.get(reverse('bulk_import_indicators', args=[self.program.pk]), data=request_params)
        self.assertEqual(response.status_code, 200)

    def test_template_create(self):
        self.client.force_login(self.tola_user.user)
        w_factories.grant_program_access(self.tola_user, self.program, self.country, role='high')
        request_params = dict([(tier.name, 10) for tier in LevelTier.objects.filter(program=self.program)])
        response = self.get_template(request_params=request_params)
        wb = openpyxl.load_workbook(response)
        ws = wb.get_sheet_by_name(TEMPLATE_SHEET_NAME)
        self.assertEqual(
            ws.cell(self.data_start_row, self.first_used_column).value,
            f'Goal: {self.ordered_levels[0].name} ({self.ordered_levels[0].ontology})')

    def test_row_counts(self):
        level_config = [
            {'name': 'Goal level', 'indicators': 2, 'ontology': '1.0.0.0', 'customsort': 1, 'tier': 'Goal'},
            {'name': 'Outcome level 1', 'indicators': 0, 'ontology': '1.1.0.0', 'customsort': 1, 'tier': 'Outcome'},
            {'name': 'Output level 1', 'indicators': 2, 'ontology': '1.1.1.0', 'customsort': 1, 'tier': 'Output'},
            {'name': 'Activity level 1', 'indicators': 0, 'ontology': '1.1.1.1', 'customsort': 1, 'tier': 'Activity'},
            {'name': 'Outcome level 2', 'indicators': 3, 'ontology': '1.2.0.0', 'customsort': 2, 'tier': 'Outcome'},
            {'name': 'Output level 2', 'indicators': 0, 'ontology': '1.2.1.0', 'customsort': 1, 'tier': 'Output'},
            {'name': 'Activity level 2', 'indicators': 3, 'ontology': '1.2.1.1', 'customsort': 1, 'tier': 'Activity'},
        ]
        self.client.force_login(self.tola_user.user)
        small_program = w_factories.RFProgramFactory(country=[self.country], tiers=True)
        w_factories.grant_program_access(self.tola_user, small_program, self.country, role='high')
        request_params = {}
        tiers = self.program.level_tiers.all()
        for i, tier in enumerate(tiers):
            request_params[tier.name] = 10 if i < len(tiers) - 2 else 20

        parent_level = None
        for i, level in enumerate(level_config[:4]):
            level_obj = i_factories.LevelFactory(
                program=small_program,
                name=level_config[i]['name'],
                parent=parent_level,
                customsort=level_config[i]['customsort'])
            level_config[i]['level_obj'] = level_obj
            parent_level = level_obj

        # Test the defaults
        wb = openpyxl.load_workbook(self.get_template(program=small_program, request_params=request_params))
        expected_counts = {'level_headers': 4, 'existing_indicators': [0] * 4, 'new_indicators': [10, 10, 20, 20]}
        expected_level_names = [f"{item['tier']}: {item['name']} ({item['ontology']})" for item in level_config[:4]]
        expected_indicator_numbers = self.get_expected_indicator_numbers(level_config[:4], request_params)
        self.compare_ws_lines(wb, expected_counts, expected_level_names, expected_indicator_numbers)

        # Test with additional levels
        parent_level = level_config[0]['level_obj']
        for i in range(4, len(level_config)):
            level_obj = i_factories.LevelFactory(
                program=small_program,
                name=level_config[i]['name'],
                parent=parent_level,
                customsort=level_config[i]['customsort'])
            level_config[i]['level_obj'] = level_obj
            parent_level = level_obj

        wb = openpyxl.load_workbook(self.get_template(program=small_program, request_params=request_params))
        expected_counts = {
            'level_headers': 7, 'existing_indicators': [0] * 7, 'new_indicators': [10, 10, 20, 20, 10, 20, 20]}
        expected_level_names = [f"{item['tier']}: {item['name']} ({item['ontology']})" for item in level_config]
        expected_indicator_numbers = self.get_expected_indicator_numbers(level_config, request_params)
        self.compare_ws_lines(wb, expected_counts, expected_level_names, expected_indicator_numbers)

        # Add some indicators
        for level_dict in level_config:
            if level_dict['indicators'] > 0:
                i_factories.IndicatorFactory.create_batch(
                    level_dict['indicators'], program=small_program, level=level_dict['level_obj'])
        wb = openpyxl.load_workbook(self.get_template(program=small_program, request_params=request_params))
        expected_indicator_counts = [conf['indicators'] for conf in level_config]
        expected_counts = {
            'level_headers': 7,
            'existing_indicators': expected_indicator_counts,
            'new_indicators': [10, 10, 20, 20, 10, 20, 20]}
        expected_level_names = [f"{item['tier']}: {item['name']} ({item['ontology']})" for item in level_config]
        expected_indicator_numbers = self.get_expected_indicator_numbers(
            level_config, request_params, has_indicators=True)
        self.compare_ws_lines(wb, expected_counts, expected_level_names, expected_indicator_numbers)

        # Do some other request params
        for i, tier in enumerate(tiers):
            request_params[tier.name] = 5 if i < len(tiers) - 2 else 30
        wb = openpyxl.load_workbook(self.get_template(program=small_program, request_params=request_params))
        expected_counts = {
            'level_headers': 7,
            'existing_indicators': expected_indicator_counts,
            'new_indicators': [5, 5, 30, 30, 5, 30, 30]}
        expected_level_names = [f"{item['tier']}: {item['name']} ({item['ontology']})" for item in level_config]
        expected_indicator_numbers = self.get_expected_indicator_numbers(
            level_config, request_params, has_indicators=True)
        self.compare_ws_lines(wb, expected_counts, expected_level_names, expected_indicator_numbers)

        for i, tier in enumerate(tiers):
            request_params[tier.name] = 5 if i < len(tiers) - 2 else 0
        wb = openpyxl.load_workbook(self.get_template(program=small_program, request_params=request_params))
        expected_counts = {
            'level_headers': 7,
            'existing_indicators': expected_indicator_counts,
            'new_indicators': [5, 5, 0, 0, 5, 0, 0]}
        expected_level_names = [f"{item['tier']}: {item['name']} ({item['ontology']})" for item in level_config]
        expected_indicator_numbers = self.get_expected_indicator_numbers(
            level_config, request_params, has_indicators=True)
        self.compare_ws_lines(wb, expected_counts, expected_level_names, expected_indicator_numbers)

        for i, tier in enumerate(tiers):
            request_params[tier.name] = 0
        wb = openpyxl.load_workbook(self.get_template(program=small_program, request_params=request_params))
        expected_counts = {
            'level_headers': 7,
            'existing_indicators': expected_indicator_counts,
            'new_indicators': ([0] * 7)}
        expected_level_names = [f"{item['tier']}: {item['name']} ({item['ontology']})" for item in level_config]
        expected_indicator_numbers = self.get_expected_indicator_numbers(
            level_config, request_params, has_indicators=True)
        self.compare_ws_lines(wb, expected_counts, expected_level_names, expected_indicator_numbers)

        # Check a custom set of tiers
        level_obj=i_factories.LevelFactory(
            program=small_program,
            name='SubActivity 1',
            parent=level_config[-1]['level_obj'],
            customsort=1)
        i_factories.LevelTierFactory(program=small_program, name='SubActivity', tier_depth=5)
        i_factories.IndicatorFactory.create_batch(2, program=small_program, level=level_obj)
        new_tiers = LevelTier.objects.filter(program=small_program)
        new_level_config = copy.deepcopy(level_config)
        for conf in new_level_config:
            conf['ontology'] += '.0'
        new_level_config.append(
            {'name': 'SubActivity 1', 'indicators': 2, 'ontology': '1.2.1.1.1',
             'customsort': 1, 'tier': 'SubActivity'})
        for i, tier in enumerate(new_tiers):
            request_params[tier.name] = 10 if i < len(new_tiers) - 2 else 20
        wb = openpyxl.load_workbook(self.get_template(program=small_program, request_params=request_params))
        expected_counts = {
            'level_headers': 8,
            'existing_indicators': expected_indicator_counts + [2],
            'new_indicators': [10, 10, 10, 20, 10, 10, 20, 20]}
        expected_level_names = [f"{item['tier']}: {item['name']} ({item['ontology']})" for item in new_level_config]
        expected_indicator_numbers = self.get_expected_indicator_numbers(
            new_level_config, request_params, has_indicators=True)
        self.compare_ws_lines(wb, expected_counts, expected_level_names, expected_indicator_numbers)

    def test_non_english_template_create(self):
        self.client.force_login(self.tola_user.user)
        self.tola_user.language = 'fr'
        self.tola_user.save()
        activate('fr')
        for sector in ['Agriculture', 'Conflict Management', 'Agribusiness']:
            w_factories.SectorFactory(sector=sector)
        w_factories.grant_program_access(self.tola_user, self.program, self.country, role='high')

        wb = openpyxl.load_workbook(self.get_template())
        ws = wb.get_sheet_by_name(TEMPLATE_SHEET_NAME)
        first_level_header = ws.cell(DATA_START_ROW, FIRST_USED_COLUMN).value
        self.assertEqual(first_level_header[:3], 'But')
        hidden_ws = wb.get_sheet_by_name(HIDDEN_SHEET_NAME)
        self.assertEqual(hidden_ws['A3'].value, 'éTranslated Agribusiness')

        activate('en')
        self.tola_user.language = 'en'
        self.tola_user.save()

    @unittest.skip
    def test_data_validation(self):
        # openpyxl apparently does not allow you to read validations from a spreadsheet, only create new ones.
        # So for now, testing of validations is being deferred until openpyxl allows read and/or another package is
        # used.
        pass


class TestBulkImportTemplateProcessing(test.TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.country = w_factories.CountryFactory()
        # cls.program = w_factories.RFProgramFactory(
        #     country=[cls.country], tiers=True, levels=6, indicators=150, indicators__levels=True)
        cls.program = w_factories.RFProgramFactory(
            country=[cls.country], tiers=True, levels=2, indicators=5, indicators__levels=True)
        cls.tola_user = w_factories.TolaUserFactory()
        w_factories.grant_program_access(cls.tola_user, cls.program, cls.country, role='high')
        cls.client = test.client
        cls.first_used_column = FIRST_USED_COLUMN
        cls.data_start_row = DATA_START_ROW
        cls.program_name_row = PROGRAM_NAME_ROW
        cls.sector = w_factories.SectorFactory()
        cls.template_file_path = os.path.join(settings.SITE_ROOT, BulkIndicatorImportFile.FILE_STORAGE_PATH)

    def tearDown(self):
        for file_entry in os.scandir(self.template_file_path):
            if file_entry.name != BASE_TEMPLATE_NAME:
                file_path = os.path.join(self.template_file_path, file_entry.name)
                os.remove(file_path)

    def get_template(self):
        request_params = dict([(tier.name, 10) for tier in LevelTier.objects.filter(program=self.program)])
        response = self.client.get(reverse('bulk_import_indicators', args=[self.program.pk]), data=request_params)
        return ContentFile(response.content)

    def post_template(self, wb):
        with NamedTemporaryFile() as temp_file:
            wb.save(temp_file.name)
            return self.client.post(reverse('bulk_import_indicators', args=[self.program.id]), {'file': temp_file})

    def fill_worksheet_row(self, ws, row_index, custom_values=None):
        custom_values = [] if custom_values is None else custom_values
        for i, column in enumerate(COLUMNS):
            current_cell = ws.cell(row_index, FIRST_USED_COLUMN + i)
            if column['field_name'] in custom_values:
                current_cell.value = custom_values[column['field_name']]
                continue
            if column['field_name'] == 'unit_of_measure_type':
                current_cell.value = str(Indicator.UNIT_OF_MEASURE_TYPES[0][1])
            elif column['field_name'] == 'direction_of_change':
                current_cell.value = str(Indicator.DIRECTION_OF_CHANGE[0][1])
            elif column['field_name'] == 'target_frequency':
                current_cell.value = str(Indicator.TARGET_FREQUENCIES[0][1])
            elif column['field_name'] == 'sector':
                current_cell.value = gettext(self.sector.sector)
            elif column['field_name'] == 'level':
                current_cell.value = gettext(Level.objects.first().name)
            else:
                current_cell.value = 'Lorem ipsum'

    def test_template_import_with_structural_problems(self):
        self.client.force_login(user=self.tola_user.user)
        w_factories.grant_program_access(self.tola_user, self.program, self.country, role='high')
        self.assertEqual(Indicator.objects.count(), 5)

        wb = openpyxl.load_workbook(self.get_template())
        ws = wb.get_sheet_by_name(TEMPLATE_SHEET_NAME)

        ws.cell(self.program_name_row, self.first_used_column).value = "Wrong program name"
        response = self.post_template(wb)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)['error_code'], ERROR_MISMATCHED_PROGRAM)
        ws.cell(self.program_name_row, self.first_used_column).value = self.program.name
        response = self.post_template(wb)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)['error_code'], ERROR_NO_NEW_INDICATORS)

    def test_template_import(self):
        self.client.force_login(user=self.tola_user.user)
        w_factories.grant_program_access(self.tola_user, self.program, self.country, role='high')
        wb = openpyxl.load_workbook(self.get_template())
        existing_goal_indicator_count = Indicator.objects.filter(level__parent=None).count()
        first_blank_goal_row = DATA_START_ROW + existing_goal_indicator_count + 1
        ws = wb.get_sheet_by_name(TEMPLATE_SHEET_NAME)
        ws.cell(PROGRAM_NAME_ROW, FIRST_USED_COLUMN).value = self.program.name
        self.fill_worksheet_row(ws, first_blank_goal_row)
        self.fill_worksheet_row(ws, first_blank_goal_row + 1)
        response = self.post_template(wb)
        self.assertEqual(response.status_code, 200)
        bulk_upload_objs = BulkIndicatorImportFile.objects.filter(
            program=self.program, user=self.tola_user, file_type=BulkIndicatorImportFile.INDICATOR_DATA_TYPE)
        self.assertEqual(len(bulk_upload_objs), 1, 'There should be a new Bulk...File entry in the DB')
        self.assertEqual(
            len(os.listdir(self.template_file_path)),
            2,
            'There should be a indicator json file saved to the file system.')
        # Need to sleep to avoid file name collision
        time.sleep(1)
        response = self.post_template(wb)
        self.assertEqual(response.status_code, 200)
        bulk_upload_objs = BulkIndicatorImportFile.objects.filter(
            program=self.program, user=self.tola_user, file_type=BulkIndicatorImportFile.INDICATOR_DATA_TYPE)
        self.assertEqual(len(bulk_upload_objs), 1, 'Old template file entry should have been deleted')
        self.assertEqual(
            len(os.listdir(self.template_file_path)), 2, 'Old indicator json file should have been deleted.')

        self.fill_worksheet_row(ws, first_blank_goal_row, {'name': None})
        response = self.post_template(wb)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)['error_code'], ERROR_MALFORMED_INDICATOR)
        self.fill_worksheet_row(ws, first_blank_goal_row, {'name': 'Indicator name'})

        # TODO: fix this test
        # orig_level_string = ws.cell(self.data_start_row, self.first_used_column).value
        # ws.cell(self.data_start_row, self.first_used_column).value = "Bad level name"
        # response = self.post_template(wb)
        # self.assertEqual(response.status_code, 400)
        # self.assertEqual(json.loads(response.content)['error_code'], ERROR_INVALID_LEVEL_HEADER)
        # ws.cell(self.data_start_row, self.first_used_column).value = orig_level_string

    def test_manually_numbered_indicators(self):
        pass

    def test_saving_indicators(self):
        self.client.force_login(user=self.tola_user.user)
        w_factories.grant_program_access(self.tola_user, self.program, self.country, role='high')
        wb = openpyxl.load_workbook(self.get_template())
        ws = wb.get_sheet_by_name(TEMPLATE_SHEET_NAME)
        ws.cell(PROGRAM_NAME_ROW, FIRST_USED_COLUMN).value = self.program.name
        self.fill_worksheet_row(ws, DATA_START_ROW + 2)
        self.fill_worksheet_row(ws, DATA_START_ROW + 3)
        self.post_template(wb)
        self.assertEqual(Indicator.objects.count(), 5)
        self.client.post(reverse('save_bulk_import_data', args=[self.program.id]))
        self.assertEqual(Indicator.objects.count(), 7)

    def test_retrieving_feedback_template(self):
        self.client.force_login(user=self.tola_user.user)
        w_factories.grant_program_access(self.tola_user, self.program, self.country, role='high')
        wb = openpyxl.load_workbook(self.get_template())
        ws = wb.get_sheet_by_name(TEMPLATE_SHEET_NAME)
        ws.cell(PROGRAM_NAME_ROW, FIRST_USED_COLUMN).value = self.program.name
        self.fill_worksheet_row(ws, DATA_START_ROW + 2, {'name': None})
        self.fill_worksheet_row(ws, DATA_START_ROW + 3)
        self.post_template(wb)
        response = self.client.get(reverse('get_feedback_bulk_import_template', args=[self.program.id]))
        self.assertEqual(response.get('Content-Disposition'),'attachment; filename="Marked-up-template.xlsx"')


