import json
import time
import os
from tempfile import NamedTemporaryFile
import openpyxl
from django import test
from django.conf import settings
from django.core.files.base import ContentFile
from django.urls import reverse
from django.utils.translation import gettext
from factories import (
    workflow_models as w_factories,
    indicators_models as i_factories
)
from indicators.models import Indicator, Level, BulkIndicatorImportFile
from indicators.views.bulk_indicator_import_views import (
    COLUMNS, FIRST_USED_COLUMN, DATA_START_ROW, PROGRAM_NAME_ROW, TEMPLATE_SHEET_NAME, BASE_TEMPLATE_NAME,
    ERROR_INDICATOR_DATA_NOT_FOUND, ERROR_TEMPLATE_NOT_FOUND, ERROR_MISMATCHED_PROGRAM, ERROR_NO_NEW_INDICATORS,
    ERROR_UNDETERMINED_LEVEL, ERROR_INVALID_LEVEL_HEADER, ERROR_MALFORMED_INDICATOR
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

    def get_template(self):
        response = self.client.get(reverse('bulk_import_indicators', args=[self.program.pk]))
        return ContentFile(response.content)

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
        response = self.client.get(reverse('bulk_import_indicators', args=[self.program.pk]))
        self.assertEqual(response.status_code, 200)

    def test_template_create(self):
        self.client.force_login(self.tola_user.user)
        w_factories.grant_program_access(self.tola_user, self.program, self.country, role='high')
        response = self.client.get(reverse('bulk_import_indicators', args=[self.program.pk]))
        self.assertEqual(response.status_code, 200)
        self.assertEquals(response.get('Content-Disposition'), 'attachment; filename="BulkIndicatorImport.xlsx"')
        wb = openpyxl.load_workbook(self.get_template())
        ws = wb.get_sheet_by_name(TEMPLATE_SHEET_NAME)
        self.assertEqual(ws.cell(self.program_name_row, self.first_used_column).value, self.program.name)

        self.assertEqual(
            ws.cell(self.data_start_row, self.first_used_column).value,
            f'Goal: {self.ordered_levels[0].name} ({self.ordered_levels[0].ontology})')


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
        response = self.client.get(reverse('bulk_import_indicators', args=[self.program.pk]))
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
        ws = wb.get_sheet_by_name(TEMPLATE_SHEET_NAME)
        ws.cell(PROGRAM_NAME_ROW, FIRST_USED_COLUMN).value = self.program.name
        self.fill_worksheet_row(ws, DATA_START_ROW + 2)
        self.fill_worksheet_row(ws, DATA_START_ROW + 3)
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

        # TODO: test for invalid level
        # orig_level_string = ws.cell(self.data_start_row, self.first_used_column).value
        # ws.cell(self.data_start_row, self.first_used_column).value = "Bad level name"
        # self.assertEqual(self.post_template(wb).status_code, 400)
        # self.assertEqual(json.loads(response.content)['error_code'], ERROR_INVALID_LEVEL_HEADER)
        # ws.cell(self.data_start_row, self.first_used_column).value = orig_level_string

        self.fill_worksheet_row(ws, DATA_START_ROW + 3, {'name': None})
        response = self.post_template(wb)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)['error_code'], ERROR_MALFORMED_INDICATOR)

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


