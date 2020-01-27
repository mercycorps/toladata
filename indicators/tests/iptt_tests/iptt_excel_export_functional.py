"""Functional tests for the IPTT Excel export - test overall excel export for completeness and accuracy"""

import io
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
    title = "Indicator Performance Tracking Report"

    @classmethod
    def get_program(cls):
        cls.country = CountryFactory(country=f'{SPECIAL_CHARS} country', code='TL')
        cls.program = RFProgramFactory(
            reporting_period_start=datetime.date(2015, 1, 1),
            reporting_period_end=datetime.date(2018, 1, 1) - datetime.timedelta(days=1),
            name=SPECIAL_CHARS)
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

    @property
    def filename(self):
        return f"IPTT Actuals only report {datetime.date.today().strftime('%b %-d, %Y')}.xlsx"

    @property
    def report_date_range(self):
        return "Jan 1, 2015 – Dec 31, 2017"

    def get_date_row1(self):
        return [
            (13, "Year 1"),
            (14, "Year 2"),
            (15, "Year 3")
        ]

    def get_date_row2(self):
        return [
            (10, "Life of Program"),
            (13, "Jan 1, 2015 – Dec 31, 2015"),
            (14, "Jan 1, 2016 – Dec 31, 2016"),
            (15, "Jan 1, 2017 – Dec 31, 2017"),
        ]

    def get_column_headers(self):
        return [
            "Program ID",
            "Indicator ID",
            "No.",
            "Indicator",
            "Unit of measure",
            "Change",
            "C / NC",
            "# / %",
            "Baseline",
            "Target",
            "Actual",
            "% Met",
            "Actual",
            "Actual",
            "Actual",
        ]

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

    def get_report(self):
        response = self.get_report_response()
        return openpyxl.load_workbook(io.BytesIO(response.content))

    def test_report_header_row(self):
        wb = self.get_report()
        ws = wb.active
        self.assertEqual(ws.cell(row=1, column=3).value, self.title)
        self.assertEqual(
            ws.cell(row=2, column=3).value,
            self.report_date_range
            )
        for column, period_value in self.get_date_row1():
            self.assertEqual(
                ws.cell(row=2, column=column).value,
                period_value
            )
        self.assertEqual(
            ws.cell(row=3, column=3).value,
            SPECIAL_CHARS
        )
        for column, period_value in self.get_date_row2():
            self.assertEqual(
                ws.cell(row=3, column=column).value,
                period_value
            )
        for column, header_value in enumerate(self.get_column_headers()):
            self.assertEqual(
                ws.cell(row=4, column=column+1).value,
                header_value
            )