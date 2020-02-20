"""Tests for the numeric elements of IPTT exports including disaggregated data"""


import io
import openpyxl
from django import test
from django.urls import reverse
from indicators.tests.iptt_tests.iptt_scenario import IPTTScenarioBuilder
from factories.workflow_models import TolaUserFactory

from indicators.models import Indicator


class TestIPTTExcelExportData(test.TestCase):
    iptt_url = reverse('iptt_excel')

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.scenario = IPTTScenarioBuilder()
        cls.tolauser = TolaUserFactory()
        cls.tolauser.user.is_superuser = True
        cls.tolauser.user.save()
        cls.client = test.Client()

    def get_tp_report(self, frequency):
        self.client.force_login(user=self.tolauser.user)
        response = self.client.get(
            self.iptt_url,
            {
                'programId': self.scenario.program.pk,
                'fullTVA': 'false',
                'reportType': '2',
                'frequency': frequency
            }
        )
        self.assertEqual(response.status_code, 200)
        self.client.logout()
        return openpyxl.load_workbook(io.BytesIO(response.content))

    def get_tva_report(self, frequency):
        self.client.force_login(user=self.tolauser.user)
        response = self.client.get(
            self.iptt_url,
            {
                'programId': self.scenario.program.pk,
                'fullTVA': 'false',
                'reportType': '1',
                'frequency': frequency
            }
        )
        self.assertEqual(response.status_code, 200)
        self.client.logout()
        return openpyxl.load_workbook(io.BytesIO(response.content))

    def get_full_tva_report(self):
        self.client.force_login(user=self.tolauser.user)
        response = self.client.get(
            self.iptt_url,
            {
                'programId': self.scenario.program.pk,
                'fullTVA': 'true',
            }
        )
        self.assertEqual(response.status_code, 200)
        self.client.logout()
        return openpyxl.load_workbook(io.BytesIO(response.content))

    def test_tp_lop_report(self):
        report = self.get_tp_report()