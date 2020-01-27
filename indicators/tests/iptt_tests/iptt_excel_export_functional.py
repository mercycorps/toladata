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


class TVAMixin:
    report_type = 1

    @property
    def filename(self):
        return f"IPTT TvA report {datetime.date.today().strftime('%b %-d, %Y')}.xlsx"

    def get_date_row1(self):
        return [
            (13, "Year 1"),
            (16, "Year 2"),
            (19, "Year 3")
        ]

    def get_date_row2(self):
        return [
            (10, "Life of Program"),
            (13, "Jan 1, 2015 – Dec 31, 2015"),
            (16, "Jan 1, 2016 – Dec 31, 2016"),
            (19, "Jan 1, 2017 – Dec 31, 2017"),
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
            "Target",
            "Actual",
            "% Met",
            "Target",
            "Actual",
            "% Met",
        ]

class IPTTReportMixin:
    fulltva = False
    report_type = 2
    start_period = 0
    end_period = 2
    groupby = 1
    columns = []

    @classmethod
    def set_up_client(cls):
        cls.tolauser = TolaUserFactory()
        cls.tolauser.user.is_superuser = True
        cls.tolauser.user.save()
        cls.client = test.Client()

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
            'groupby': self.groupby,
            'columns': self.columns
        }

    def get_report_response(self):
        self.client.force_login(user=self.tolauser.user)
        response = self.client.get(self.iptt_url, self.request_params)
        return response

    def get_report(self):
        response = self.get_report_response()
        return openpyxl.load_workbook(io.BytesIO(response.content))

class TestIPTTHeaders(IPTTReportMixin, test.TestCase):
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
    def setUpClass(cls):
        super().setUpClass()
        cls.get_program()
        cls.get_indicators()
        cls.set_up_client()

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


class TestTVAIPTTHeaders(TVAMixin, TestIPTTHeaders):
    pass


class TestIPTTReportHiddenColumns(TestIPTTHeaders):
    columns = ['1', '3']

    def get_date_row1(self):
        return [
            (11, "Year 1"),
            (12, "Year 2"),
            (13, "Year 3")
        ]

    def get_date_row2(self):
        return [
            (8, "Life of Program"),
            (11, "Jan 1, 2015 – Dec 31, 2015"),
            (12, "Jan 1, 2016 – Dec 31, 2016"),
            (13, "Jan 1, 2017 – Dec 31, 2017"),
        ]

    def get_column_headers(self):
        return [
            "Program ID",
            "Indicator ID",
            "No.",
            "Indicator",
            "Unit of measure",
            "C / NC",
            "Baseline",
            "Target",
            "Actual",
            "% Met",
            "Actual",
            "Actual",
            "Actual",
        ]


class TestIndicatorOrdering(IPTTReportMixin, test.TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.program = RFProgramFactory(
            tiers=["Tier 1", "Tier 2", "Tier 3"]
        )
        cls.level1 = LevelFactory(
            parent=None,
            program=cls.program,
            name="Level 1",
            customsort=1
        )
        cls.indicator1a = RFIndicatorFactory(
            program=cls.program,
            level=cls.level1,
            target_frequency=Indicator.LOP
        )
        cls.indicator1b = RFIndicatorFactory(
            program=cls.program,
            level=cls.level1,
            target_frequency=Indicator.LOP
        )
        cls.level2a = LevelFactory(
            parent=cls.level1,
            program=cls.program,
            name="Level 2a",
            customsort=1
        )
        cls.indicator2aa = RFIndicatorFactory(
            program=cls.program,
            level=cls.level2a,
            target_frequency=Indicator.LOP
        )
        cls.level2b = LevelFactory(
            parent=cls.level1,
            program=cls.program,
            name="Level 2b",
            customsort=2
        )
        cls.indicator2ba = RFIndicatorFactory(
            program=cls.program,
            level=cls.level2b,
            target_frequency=Indicator.LOP
        )
        cls.level3a = LevelFactory(
            parent=cls.level2a,
            program=cls.program,
            name="Level 3a",
            customsort=1
        )
        cls.indicator3aa = RFIndicatorFactory(
            program=cls.program,
            level=cls.level3a,
            target_frequency=Indicator.LOP
        )
        cls.indicator3ab = RFIndicatorFactory(
            program=cls.program,
            level=cls.level3a,
            target_frequency=Indicator.LOP
        )
        cls.indicator3ac = RFIndicatorFactory(
            program=cls.program,
            level=cls.level3a,
            target_frequency=Indicator.LOP
        )
        cls.set_up_client()

    def test_indicator_ordering_by_chain(self):
        wb = self.get_report()
        ws = wb.active
        for level_row, level_name in [
            (5, "Tier 1: Level 1"),
            (8, "Tier 2 1: Level 2a"),
            (10, "Tier 3 1.1: Level 3a"),
            (14, "Tier 2 2: Level 2b"),
        ]:
            self.assertEqual(
                ws.cell(row=level_row, column=3).value,
                level_name
            )
        for indicator_row, indicator, number in [
            (6, self.indicator1a, "Tier 1 a"),
            (7, self.indicator1b, "Tier 1 b"),
            (9, self.indicator2aa, "Tier 2 1a"),
            (11, self.indicator3aa, "Tier 3 1.1a"),
            (12, self.indicator3ab, "Tier 3 1.1b"),
            (13, self.indicator3ac, "Tier 3 1.1c"),
            (15, self.indicator2ba, "Tier 2 2a"),
        ]:
            self.assertEqual(
                ws.cell(row=indicator_row, column=3).value,
                number
            )
            self.assertEqual(
                ws.cell(row=indicator_row, column=4).value,
                indicator.name
            )

    def test_indicator_ordering_by_level(self):
        self.groupby = 2
        wb = self.get_report()
        ws = wb.active
        for level_row, level_name in [
            (5, "Tier 1: Level 1"),
            (8, "Tier 2 1: Level 2a"),
            (10, "Tier 2 2: Level 2b"),
            (12, "Tier 3 1.1: Level 3a"),
        ]:
            self.assertEqual(
                ws.cell(row=level_row, column=3).value,
                level_name
            )
        for indicator_row, indicator, number in [
            (6, self.indicator1a, "Tier 1 a"),
            (7, self.indicator1b, "Tier 1 b"),
            (9, self.indicator2aa, "Tier 2 1a"),
            (11, self.indicator2ba, "Tier 2 2a"),
            (13, self.indicator3aa, "Tier 3 1.1a"),
            (14, self.indicator3ab, "Tier 3 1.1b"),
            (15, self.indicator3ac, "Tier 3 1.1c"),
            
        ]:
            self.assertEqual(
                ws.cell(row=indicator_row, column=3).value,
                number
            )
            self.assertEqual(
                ws.cell(row=indicator_row, column=4).value,
                indicator.name
            )