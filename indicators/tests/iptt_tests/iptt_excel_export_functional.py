"""Functional tests for the IPTT Excel export - test overall excel export for completeness and accuracy"""

import datetime
import unittest
import openpyxl
from django import test
from django.urls import reverse
from indicators.models import Indicator
from factories.workflow_models import CountryFactory, RFProgramFactory, TolaUserFactory
from factories.indicators_models import RFIndicatorFactory, LevelFactory, LevelTierFactory

SPECIAL_CHARS = "Spécîal Chårs"

class TestIPTTHeaders(test.TestCase):
    fulltva = False
    report_type = 2
    start_period = 0
    end_period = 2
    groupby = 1

    @classmethod
    def get_program(cls):
        cls.country = CountryFactory(country=f'{SPECIAL_CHARS} country', code='TL')
        cls.program = RFProgramFactory(months=36)
        cls.program.country.set([cls.country])

    @classmethod
    def get_indicators(cls):
        indicator = RFIndicatorFactory(
            program=cls.program,
            target_frequency=Indicator.ANNUAL
        )
        cls.indicators = [indicator]

    @classmethod
    def set_up_client(cls):
        cls.tolauser = TolaUserFactory()
        cls.tolauser.user.is_superuser = True
        cls.tolauser.user.save()
        cls.client = test.Client()

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.get_program()
        cls.get_indicators()
        cls.set_up_client()

    @property
    def filename(self):
        return f"IPTT Actuals only report {datetime.date.today().strftime('%b %-d, %Y')}.xlsx"

    @property
    def frequency(self):
        return Indicator.ANNUAL

    @property
    def iptt_url(self):
        return reverse('iptt_excel')

    @property
    def request_params(self):
        return {
            'programId': self.program.pk,
            'frequency': self.frequency,
            'fullTVA': self.fulltva,
            'reportType': self.report_type,
            'start': self.start_period,
            'end': self.end_period,
            'groupby': self.groupby
        }

    def get_report_response(self):
        self.client.force_login(user=self.tolauser.user)
        response = self.client.get(self.iptt_url, self.request_params)
        return response

    def test_response_headers(self):
        response = self.get_report_response()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.get('Content-Type'),
            "application/ms-excel"
        )
        self.assertEqual(
            response.get('Content-Disposition'),
            f'attachment; filename="{self.filename}"'
        )

    @unittest.skip("no")
    def test_report_header_row(self):
        report = self.get_report()
        wb = openpyxl.load_workbook(report.content)
        print("ws {}".format(wb))