import json
from tempfile import NamedTemporaryFile
import openpyxl
from django import test
from django.core.files.base import ContentFile
from django.urls import reverse
from factories import (
    workflow_models as w_factories,
    indicators_models as i_factories
)
from indicators.models import Indicator, Level


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
        cls.first_used_column = Indicator.BULK_IMPORT_SETTINGS['first_used_column']
        cls.data_start_row = Indicator.BULK_IMPORT_SETTINGS['data_start_row']
        cls.program_name_row = Indicator.BULK_IMPORT_SETTINGS['program_name_row']

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
        self.assertEquals(
            response.get('Content-Disposition'),
            'attachment; filename="BulkIndicatorImport.xlsx"'
        )
        wb = openpyxl.load_workbook(self.get_template())
        ws = wb.get_sheet_by_name('Template')
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
        cls.first_used_column = Indicator.BULK_IMPORT_SETTINGS['first_used_column']
        cls.data_start_row = Indicator.BULK_IMPORT_SETTINGS['data_start_row']
        cls.program_name_row = Indicator.BULK_IMPORT_SETTINGS['program_name_row']

    def get_template(self):
        response = self.client.get(reverse('bulk_import_indicators', args=[self.program.pk]))
        return ContentFile(response.content)

    def post_template(self, wb):
        with NamedTemporaryFile() as temp_file:
            wb.save(temp_file.name)
            return self.client.post(reverse('bulk_import_indicators', args=[self.program.id]), {'file': temp_file})

    def test_template_import(self):
        self.client.force_login(user=self.tola_user.user)
        w_factories.grant_program_access(self.tola_user, self.program, self.country, role='high')
        self.assertEqual(Indicator.objects.count(), 5)

        wb = openpyxl.load_workbook(self.get_template())
        ws = wb.get_sheet_by_name('Template')

        ws.cell(self.program_name_row, self.first_used_column).value = "Wrong program name"
        response = self.post_template(wb)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)['error_code'], 100)
        ws.cell(self.program_name_row, self.first_used_column).value = self.program.name
        response = self.post_template(wb)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)['error_code'], 101)
        ws.cell(self.data_start_row, self.first_used_column).value = "Bad level name"
        self.assertEqual(self.post_template(wb).status_code, 400)

    def test_manually_numbered_indicators(self):
        pass

