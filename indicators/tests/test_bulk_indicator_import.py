import json
from django import test
from django.db import connection
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
        cls.program = w_factories.RFProgramFactory(
            country=[cls.country], tiers=True, levels=6, indicators=150, indicators__levels=True)
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
            "attachment; filename=BulkIndicatorImport.xlsx"
        )






