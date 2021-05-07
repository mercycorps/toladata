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


class TestBulkImportTemplateCreation(test.TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.country = w_factories.CountryFactory()
        # cls.program = w_factories.RFProgramFactory(
        #     country=[cls.country], tiers=True, levels=6, indicators=150, indicators__levels=True)
        cls.program = w_factories.RFProgramFactory(
            country=[cls.country], tiers=True, levels=2, indicators=5, indicators__levels=True)
        cls.tola_user = w_factories.TolaUserFactory()
        cls.client = test.client

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


class TestBulkImportTemplateImport(test.TestCase):
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
        cls.first_used_column = 2
        cls.data_start_row = 7
        cls.program_name_row = 2

    def get_response(self, wb):
        with NamedTemporaryFile() as tmp:
            wb.save(tmp.name)
            return self.client.post(reverse('bulk_import_indicators', args=[self.program.id]), {'file': tmp})

    def test_template_import(self):
        self.client.force_login(user=self.tola_user.user)

        w_factories.grant_program_access(self.tola_user, self.program, self.country, role='high')
        response = self.client.get(reverse('bulk_import_indicators', args=[self.program.pk]))
        content_file = ContentFile(response.content)
        wb = openpyxl.load_workbook(content_file)
        ws = wb.get_sheet_by_name('Template')
        ws.cell(self.program_name_row, self.first_used_column).value = "Wrong Name"
        self.assertEqual(self.get_response(wb).status_code, 400)
        ws.cell(self.program_name_row, self.first_used_column).value = self.program.name
        self.assertEqual(self.get_response(wb).status_code, 200)
