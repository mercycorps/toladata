"""Functional tests for the IPTT Excel export - test overall excel export for completeness and accuracy

    Report types:
        TvA full
        TvA LoP
        TvA MidEnd
        TvA regular (SEMI_ANNUAL)
        TP ANNUAL
        TP Monthly
    Languages:
        English
        French
        Spanish
    Programs:
        Auto-numbering
        Non-auto-numbering
    Indicators:
        Numeric NC
        Numeric Cumulative
        Percent
    Results:
        None
        One in a period
        Many in a period
    Disaggregations:
        None
        One with no results
        One with some results
        Many with no results
        Many with some results
    Display Filters:
        Start period
        End period
        Grouping
        Columns Hidden
        Rows expanded
    Indicator Filters:
        Sites
        Types
        Sectors
        Indicators
        Disaggregations (with disaggs shown accordingly)


Indicators:
    LoP - a - "1.1.1" - Numeric NC - baseline 0 - No results - standard disagg - no sites - no types - sector 1
    MID_END - b - "aaa" - Percent - baseline na - One result Mid (month 2) - country disagg (no disagg results) - site 1 - type 1 - no sector
    ANNUAL - 1a - "x4.1" - Numeric Cum - baseline 100 - Two results month 4,5 - no disaggs - sites 1 and 2 - types 1 + 2 - sector 2
    QUARTERLY - 2a - "4a" - Numeric NC - baseline 0 - Two results month 2 One result month 10 - standard disagg and country disagg (all results disagg'd) - no sites - type 2 - sector 1
    TRI_ANNUAL - 2b - "4b" - Percent - baseline na - No results - no disaggs - site 1 - no types - no sector
    MONTHLY - 1.1a - "21.4" - Numeric Cum - baseline 100 - One result month 3 One result month 6 - standard disagg (disagg'd result) - sites 1 and 2 - type 1 - sector 2
    EVENT - 1.1b - "19.1" - Numeric NC - baseline 0 - One result month 1 event 1 - country disagg (disagg'd result) - no sites - types 1 + 2 - sector 1

"""

import io
import datetime
import locale
import itertools
import unittest
import openpyxl
from django import test
from django.urls import reverse
from django.utils import translation
from indicators.models import Indicator
from factories.workflow_models import (
    CountryFactory,
    RFProgramFactory,
    TolaUserFactory,
    SectorFactory,
    SiteProfileFactory,
)
from factories.indicators_models import (
    RFIndicatorFactory,
    LevelFactory,
    LevelTierFactory,
    DisaggregationTypeFactory,
    IndicatorTypeFactory,
    PeriodicTargetFactory,
    ResultFactory,
    DisaggregatedValueFactory,
)


class IPTTScenarioBuilder:
    program_name = "Nåmé of the Program its long and has Spécîal Characters"
    start_date = datetime.date(2016, 1, 1)
    end_date = datetime.date(2018, 12, 31)

    def __init__(self):
        self.get_program()
        self.get_levels()
        self.get_disaggregations()
        self.get_sectors()
        self.get_indicator_types()
        self.get_sites()
        self.get_indicators()

    def get_program(self):
        self.country = CountryFactory(country="TéstLand", code="TL")
        self.program = RFProgramFactory(
            name=self.program_name,
            reporting_period_start=self.start_date,
            reporting_period_end=self.end_date,
        )

    def get_levels(self):
        self.tiers = [
            LevelTierFactory(
                name=f"Tîér{c+1}",
                tier_depth=c+1,
                program=self.program
            ) for c in range(3)]
        goal_level = LevelFactory(
                name="Lévël goal a",
                parent=None,
                program=self.program,
                customsort=1
            )
        outcome_levels = [
            LevelFactory(
                name="Lévêl outcome 1a",
                parent=goal_level,
                program=self.program,
                customsort=1
            ),
            LevelFactory(
                name="Lévêl outcome 1b",
                parent=goal_level,
                program=self.program,
                customsort=2
            ),
        ]
        output_level = LevelFactory(
            name="Lévêl output 1.1a",
            parent=outcome_levels[0],
            program=self.program,
            customsort=1
        )
        self.levels = [goal_level, outcome_levels[0], outcome_levels[1], output_level]

    def get_disaggregations(self):
        self.standard_disagg = DisaggregationTypeFactory(
            standard=True,
            country=None,
            disaggregation_type="Ståndard Dîsäggregation",
            labels=["Label 1", "Låbél 2"]
        )
        self.country_disagg = DisaggregationTypeFactory(
            standard=False,
            country=self.country,
            disaggregation_type="Country Dîsäggregation with a VERY VERY VERY VERY VERY LONG NAME",
            labels=["Label 1", "Låbél 2", "Label 3"]
        )

    def get_sectors(self):
        self.sector1 = SectorFactory(sector="Test Séctor 1")
        self.sector2 = SectorFactory(sector="Test Séctor 2 with a very long name which doesn't matter at all")

    def get_sites(self):
        self.site1 = SiteProfileFactory(name="Site profile 1 with Spécîal Characters")
        self.site2 = SiteProfileFactory(name="Site profile 2 with a very long name which doesn't matter at all")

    def get_indicator_types(self):
        self.type1 = IndicatorTypeFactory(indicator_type="Typé 1")
        self.type2 = IndicatorTypeFactory(indicator_type="Typé 2 with a very long name which doesn't matter at all")

    def get_indicators(self):
        self.indicators = [
            self.get_indicator1(),
            self.get_indicator2(),
            self.get_indicator3(),
            self.get_indicator4(),
            self.get_indicator5(),
            self.get_indicator6(),
            self.get_indicator7(),
        ]

    def add_result(self, achieved, indicator, target, month):
        date_collected = datetime.date(
            self.start_date.year,
            self.start_date.month+month-1,
            1
        )
        return ResultFactory(
            indicator=indicator,
            periodic_target=target,
            achieved=achieved,
            date_collected=date_collected
        )

    def add_disagg(self, result, disagg):
        if len(disagg.labels) == 2:
            values = [1, result.achieved-1]
        elif len(disagg.labels) == 3:
            values = [1, 1, result.achieved-2]
        for value, label in zip(values, disagg.labels):
            DisaggregatedValueFactory(
                result=result,
                category=label,
                value=value
            )
        

    def get_indicator1(self):
        indicator = RFIndicatorFactory(
            program=self.program,
            target_frequency=Indicator.LOP,
            level=self.levels[0],
            level_order=1,
            name="Indicåtor Náme 1",
            number="1.1.1",
            unit_of_measure_type=Indicator.NUMBER,
            is_cumulative=False,
            baseline=0,
            baseline_na=False,
            sector=self.sector1,
            targets=1000,
        )
        return indicator

    def get_indicator2(self):
        indicator = RFIndicatorFactory(
            program=self.program,
            target_frequency=Indicator.MID_END,
            level=self.levels[0],
            level_order=2,
            name="Indicåtor Náme 2",
            number="aaa",
            unit_of_measure_type=Indicator.PERCENTAGE,
            baseline=None,
            baseline_na=True,
            sector=None,
            targets=100
        )
        mid_target = indicator.periodictargets.first()
        indicator.disaggregation.set([self.country_disagg])
        indicator.indicator_type.set([self.type1])
        result = self.add_result(95, indicator, mid_target, month=2)
        result.site.set([self.site1])
        return indicator

    def get_indicator3(self):
        indicator = RFIndicatorFactory(
            program=self.program,
            target_frequency=Indicator.ANNUAL,
            level=self.levels[1],
            level_order=1,
            name="Indicåtor Náme 3",
            number="x4.1",
            unit_of_measure_type=Indicator.NUMBER,
            is_cumulative=True,
            baseline=100,
            baseline_na=False,
            sector=self.sector2,
            targets=45
        )
        first_target = indicator.periodictargets.first()
        indicator.indicator_type.set([self.type1, self.type2])
        result = self.add_result(50, indicator, first_target, month=4)
        result.site.set([self.site1])
        result = self.add_result(20, indicator, first_target, month=5)
        result.site.set([self.site2])
        return indicator

    def get_indicator4(self):
        indicator = RFIndicatorFactory(
            program=self.program,
            target_frequency=Indicator.QUARTERLY,
            level=self.levels[2],
            level_order=1,
            name="Indicåtor Náme 4",
            number="4a",
            unit_of_measure_type=Indicator.NUMBER,
            is_cumulative=False,
            baseline=0,
            baseline_na=False,
            sector=self.sector1,
            targets=10
        )
        first_target = indicator.periodictargets.first()
        third_target = indicator.periodictargets.all()[2]
        indicator.indicator_type.set([self.type2])
        indicator.disaggregation.set([self.standard_disagg, self.country_disagg])
        result1 = self.add_result(4, indicator, first_target, month=2)
        self.add_disagg(result1, self.standard_disagg)
        self.add_disagg(result1, self.country_disagg)
        result2 = self.add_result(7, indicator, first_target, month=2)
        self.add_disagg(result2, self.standard_disagg)
        self.add_disagg(result2, self.country_disagg)
        result3 = self.add_result(9, indicator, third_target, month=10)
        self.add_disagg(result3, self.standard_disagg)
        self.add_disagg(result3, self.country_disagg)
        return indicator

    def get_indicator5(self):
        indicator = RFIndicatorFactory(
            program=self.program,
            target_frequency=Indicator.TRI_ANNUAL,
            level=self.levels[2],
            level_order=2,
            name="Indicåtor Náme 5",
            number="4b",
            unit_of_measure_type=Indicator.PERCENTAGE,
            baseline=None,
            baseline_na=True,
            sector=None,
            targets=15
        )
        indicator.indicator_type.set([])
        indicator.disaggregation.set([])
        return indicator

    def get_indicator6(self):
        indicator = RFIndicatorFactory(
            program=self.program,
            target_frequency=Indicator.MONTHLY,
            level=self.levels[3],
            level_order=1,
            name="Indicåtor Náme 6",
            number="21.4",
            unit_of_measure_type=Indicator.NUMBER,
            is_cumulative=True,
            baseline=100,
            baseline_na=False,
            sector=self.sector2,
            targets=80
        )
        targets = list(indicator.periodictargets.all())
        indicator.indicator_type.set([self.type1])
        indicator.disaggregation.set([self.standard_disagg])
        result1 = self.add_result(40, indicator, targets[2], month=3)
        result1.site.set([self.site1])
        result2 = self.add_result(70, indicator, targets[5], month=6)
        result2.site.set([self.site2])
        self.add_disagg(result2, self.standard_disagg)
        return indicator

    def get_indicator7(self):
        indicator = RFIndicatorFactory(
            program=self.program,
            target_frequency=Indicator.EVENT,
            level=self.levels[3],
            level_order=2,
            name="Indicåtor Náme 7",
            number="19.1",
            unit_of_measure_type=Indicator.NUMBER,
            is_cumulative=False,
            baseline=0,
            baseline_na=False,
            sector=self.sector1,
        )
        event_targets = [
            PeriodicTargetFactory(
                indicator=indicator,
                period=f"Evént {c}",
                target=40 + 10*c,
                start_date=self.start_date,
                end_date=self.end_date,
                customsort=c
            ) for c in range(4)
        ]
        first_target = event_targets[0]
        indicator.indicator_type.set([self.type1, self.type2])
        indicator.disaggregation.set([self.country_disagg])
        result = self.add_result(42, indicator, first_target, month=1)
        self.add_disagg(result, self.country_disagg)
        return indicator



SPECIAL_CHARS = "Spécîal Chårs"

class TestScenarioBuilder(test.TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.scenario = IPTTScenarioBuilder()

    def test_indicators(self):
        indicators = self.scenario.indicators
        for c, frequency in enumerate([
            Indicator.LOP,
            Indicator.MID_END,
            Indicator.ANNUAL,
            Indicator.QUARTERLY,
            Indicator.TRI_ANNUAL,
            Indicator.MONTHLY,
            Indicator.EVENT
        ]):
            self.assertEqual(indicators[c].target_frequency, frequency)



ENGLISH_COLUMNS = [
    'No.',
    'Indicator',
    'Unit of measure',
    'Change',
    'C / NC',
    '# / %',
    'Baseline'
]



class TestIPTTExcelExports(test.TestCase):
    iptt_url = reverse('iptt_excel')

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.scenario = IPTTScenarioBuilder()
        cls.tolauser = TolaUserFactory()
        cls.tolauser.user.is_superuser = True
        cls.tolauser.user.save()
        cls.client = test.Client()

    def get_tva_report_full(self, response=False, language="English", **kwargs):
        if language == "French":
            self.tolauser.language = 'fr'
            self.tolauser.save()
        elif language == "Spanish":
            self.tolauser.language = 'es'
            self.tolauser.save()
        self.client.force_login(user=self.tolauser.user)
        get_response = self.client.get(
            self.iptt_url,
            {
                **{
                    'programId': self.scenario.program.pk,
                    'fullTVA': 'true'
                    },
                **kwargs
        })
        self.assertEqual(get_response.status_code, 200)
        self.client.logout()
        self.tolauser.language = 'en'
        self.tolauser.save()
        if response:
            return get_response
        return openpyxl.load_workbook(io.BytesIO(get_response.content))

    def get_tva_report(self, frequency=Indicator.LOP, response=False, language="English", **kwargs):
        if language == "French":
            self.tolauser.language = 'fr'
            self.tolauser.save()
        elif language == "Spanish":
            self.tolauser.language = 'es'
            self.tolauser.save()
        self.client.force_login(user=self.tolauser.user)
        get_response = self.client.get(
            self.iptt_url,
            { **{
                'programId': self.scenario.program.pk,
                'fullTVA': 'false',
                'reportType': '1',
                'frequency': frequency,
                },
             **kwargs
            }
        )
        self.assertEqual(get_response.status_code, 200)
        self.client.logout()
        self.tolauser.language = 'en'
        self.tolauser.save()
        if response:
            return get_response
        return openpyxl.load_workbook(io.BytesIO(get_response.content))

    def get_tp_report(self, frequency=Indicator.ANNUAL, response=False, language="English", **kwargs):
        if language == "French":
            self.tolauser.language = 'fr'
            self.tolauser.save()
        elif language == "Spanish":
            self.tolauser.language = 'es'
            self.tolauser.save()
        self.client.force_login(user=self.tolauser.user)
        get_response = self.client.get(
            self.iptt_url,
            { **{
                'programId': self.scenario.program.pk,
                'fullTVA': 'false',
                'reportType': '2',
                'frequency': frequency,
                },
             **kwargs
            }
        )
        self.assertEqual(get_response.status_code, 200)
        self.client.logout()
        self.tolauser.language = 'en'
        self.tolauser.save()
        if response:
            return get_response
        return openpyxl.load_workbook(io.BytesIO(get_response.content))

    def test_responses(self):
        tva_full_response = self.get_tva_report_full(response=True)
        filename = f"IPTT TvA full program report {datetime.date.today().strftime('%b %-d, %Y')}.xlsx"
        self.assertEqual(
            tva_full_response.get('Content-Type'),
            "application/ms-excel"
        )
        self.assertEqual(
            tva_full_response.get('Content-Disposition'),
            f'attachment; filename="{filename}"'
        )
        tva_response = self.get_tva_report(response=True)
        filename = f"IPTT TvA report {datetime.date.today().strftime('%b %-d, %Y')}.xlsx"
        self.assertEqual(
            tva_response.get('Content-Type'),
            "application/ms-excel"
        )
        self.assertEqual(
            tva_response.get('Content-Disposition'),
            f'attachment; filename="{filename}"'
        )
        tp_response = self.get_tp_report(response=True)
        filename = f"IPTT Actuals only report {datetime.date.today().strftime('%b %-d, %Y')}.xlsx"
        self.assertEqual(
            tp_response.get('Content-Type'),
            "application/ms-excel"
        )
        self.assertEqual(
            tp_response.get('Content-Disposition'),
            f'attachment; filename="{filename}"'
        )

    def test_responses_french(self):
        default_locale = locale.getlocale()
        locale.setlocale(locale.LC_ALL, 'fr_FR')
        tva_full_response = self.get_tva_report_full(response=True, language="French")
        filename = f"Rapport IPTT relatif à la totalité de la TVA du programme {datetime.date.today().strftime('%-d %b. %Y').lower()}.xlsx"
        self.assertEqual(
            tva_full_response.get('Content-Type'),
            "application/ms-excel"
        )
        self.assertEqual(
            tva_full_response.get('Content-Disposition'),
            f'attachment; filename="{filename}"'
        )
        tva_response = self.get_tva_report(response=True, language="French")
        filename = f"Rapport TVA IPTT {datetime.date.today().strftime('%-d %b. %Y').lower()}.xlsx"
        self.assertEqual(
            tva_response.get('Content-Type'),
            "application/ms-excel"
        )
        self.assertEqual(
            tva_response.get('Content-Disposition'),
            f'attachment; filename="{filename}"'
        )
        tp_response = self.get_tp_report(response=True, language="French")
        filename = f"Rapport IPTT relatif aux valeurs réelles {datetime.date.today().strftime('%-d %b. %Y').lower()}.xlsx"
        self.assertEqual(
            tp_response.get('Content-Type'),
            "application/ms-excel"
        )
        self.assertEqual(
            tp_response.get('Content-Disposition'),
            f'attachment; filename="{filename}"'
        )
        locale.setlocale(locale.LC_ALL, default_locale)

    def test_responses_spanish(self):
        default_locale = locale.getlocale()
        locale.setlocale(locale.LC_ALL, 'es_ES')
        tva_full_response = self.get_tva_report_full(response=True, language="Spanish")
        filename = f"Informe completo del programa del IPTT TvA {datetime.date.today().strftime('%-d %b. %Y').title()}.xlsx"
        self.assertEqual(
            tva_full_response.get('Content-Type'),
            "application/ms-excel"
        )
        self.assertEqual(
            tva_full_response.get('Content-Disposition'),
            f'attachment; filename="{filename}"'
        )
        tva_response = self.get_tva_report(response=True, language="Spanish")
        filename = f"Informe del IPTT TvA {datetime.date.today().strftime('%-d %b. %Y').title()}.xlsx"
        self.assertEqual(
            tva_response.get('Content-Type'),
            "application/ms-excel"
        )
        self.assertEqual(
            tva_response.get('Content-Disposition'),
            f'attachment; filename="{filename}"'
        )
        tp_response = self.get_tp_report(response=True, language="Spanish")
        filename = f"Informes de reales únicamente del IPTT {datetime.date.today().strftime('%-d %b. %Y').title()}.xlsx"
        self.assertEqual(
            tp_response.get('Content-Type'),
            "application/ms-excel"
        )
        self.assertEqual(
            tp_response.get('Content-Disposition'),
            f'attachment; filename="{filename}"'
        )
        locale.setlocale(locale.LC_ALL, default_locale)

    def test_tva_full_report_headers(self):
        tva_full_report = self.get_tva_report_full()
        self.assertEqual(len(tva_full_report.worksheets), 7)
        self.assertEqual(
            tva_full_report.sheetnames,
            [
                "Life of Program (LoP) only",
                "Midline and endline",
                "Annual",
                "Tri-annual",
                "Quarterly",
                "Monthly",
                "Change log"
            ])
        for sheet in tva_full_report.worksheets[:-1]:
            self.assertEqual(sheet.cell(row=1, column=3).value, "Indicator Performance Tracking Report")
            self.assertEqual(
                sheet.cell(row=2, column=3).value,
                f"{self.scenario.start_date.strftime('%b %-d, %Y')} – {self.scenario.end_date.strftime('%b %-d, %Y')}",
            )
            self.assertEqual(
                sheet.cell(row=3, column=3).value,
                self.scenario.program_name
            )
            self.assertEqual(
                sheet.cell(row=3, column=10).value,
                "Life of Program"
            )
            for column, header in enumerate(ENGLISH_COLUMNS):
                self.assertEqual(
                    sheet.cell(row=4, column=3+column).value,
                    header
                )
            self.assertEqual(
                sheet.cell(row=4, column=10).value,
                "Target"
            )
            self.assertEqual(
                sheet.cell(row=4, column=11).value,
                "Actual"
            )
            self.assertEqual(
                sheet.cell(row=4, column=12).value,
                "% Met"
            )
        midend = tva_full_report.worksheets[1]
        for col, period in enumerate(["Midline", "Endline"]):
            self.assertEqual(
                midend.cell(row=3, column=13+3*col).value,
                period
            )
            self.assertEqual(
                midend.cell(row=4, column=13+3*col).value,
                "Target"
            )
            self.assertEqual(
                midend.cell(row=4, column=14+3*col).value,
                "Actual"
            )
            self.assertEqual(
                midend.cell(row=4, column=15+3*col).value,
                "% Met"
            )
        change_log = tva_full_report.worksheets[-1]
        self.assertEqual(change_log.cell(row=1, column=1).value, "Change log")
        self.assertEqual(change_log.cell(row=2, column=1).value, self.scenario.program_name)
        for column, header in enumerate(
            ['Date and time', 'Result level', 'Indicator', 'User', 'Organization', 'Change type',
             'Previous entry', 'New entry', 'Rationale']
        ):
            self.assertEqual(change_log.cell(row=3, column=1+column).value, header)

    def test_tva_lop_report_headers(self):
        tva_lop_report = self.get_tva_report(frequency=Indicator.LOP)
        self.assertEqual(len(tva_lop_report.worksheets), 1)
        sheet = tva_lop_report.worksheets[0]
        self.assertEqual(sheet.cell(row=1, column=3).value, "Indicator Performance Tracking Report")
        self.assertEqual(
            sheet.cell(row=2, column=3).value,
            f"{self.scenario.start_date.strftime('%b %-d, %Y')} – {self.scenario.end_date.strftime('%b %-d, %Y')}",
        )
        self.assertEqual(
            sheet.cell(row=3, column=3).value,
            self.scenario.program_name
        )
        self.assertEqual(
            sheet.cell(row=3, column=10).value,
            "Life of Program"
        )
        for column, header in enumerate(ENGLISH_COLUMNS):
            self.assertEqual(
                sheet.cell(row=4, column=3+column).value,
                header
            )
        self.assertEqual(
            sheet.cell(row=4, column=10).value,
            "Target"
        )
        self.assertEqual(
            sheet.cell(row=4, column=11).value,
            "Actual"
        )
        self.assertEqual(
            sheet.cell(row=4, column=12).value,
            "% Met"
        )
        

    
        

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