""" Tests for the IPTTReportSerializer class (used by Excel endpoint renderer)

"""

import unittest
import datetime
from contextlib import contextmanager
from django import test
from django.utils import translation, formats
from workflow.serializers_new import (
    IPTTTPReportSerializer,
    IPTTTVAReportSerializer,
    IPTTFullReportSerializer
)
from indicators.models import Indicator
from factories.workflow_models import (
    RFProgramFactory,
    SectorFactory,
    SiteProfileFactory,
    CountryFactory,
)
from factories.indicators_models import (
    RFIndicatorFactory,
    LevelFactory,
    IndicatorTypeFactory,
    DisaggregationTypeFactory,
    ResultFactory
)

SPECIAL_CHARACTERS = "Spécîål Character Fillëd Name"

@contextmanager
def lang_context(lang):
    try:
        translation.activate(lang)
        yield
    finally:
        translation.activate('en')


class TestReportSerializers(test.TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.country = CountryFactory(country="TestLand", code="TL")
        cls.program1 = program = RFProgramFactory(
            name=SPECIAL_CHARACTERS,
            months=24,
            tiers=True,
            levels=1
        )
        cls.program1.country.set([cls.country])
        cls.goal_level = cls.program1.levels.filter(parent=None).first()
        cls.second_level = program.levels.filter(parent=cls.goal_level).first()
        cls.third_level = program.levels.filter(parent=cls.second_level).first()
        cls.sector1 = SectorFactory()
        cls.i_type1 = IndicatorTypeFactory()
        cls.standard_disagg1 = DisaggregationTypeFactory(
            standard=True,
            country=None,
            labels=['One', 'Two']
        )
        cls.standard_disagg2 = DisaggregationTypeFactory(
            standard=True,
            country=None,
            labels=['One', 'Two', 'Three']
        )
        cls.country_disagg = DisaggregationTypeFactory(
            standard=False,
            country=cls.country,
            labels=['One', 'Two']
        )
        cls.site = SiteProfileFactory(country=cls.country)
        cls.site2 = SiteProfileFactory(country=cls.country)

    def get_indicator(self, **params):
        base_params = {
            'program': self.program1,
            'level': self.second_level,
            'target_frequency': Indicator.ANNUAL,
        }
        return RFIndicatorFactory(**{**base_params, **params})

    def tearDown(self):
        self.program1.indicator_set.all().delete()

    def test_report_filename(self):
        # English:
        today = datetime.date.today()
        en_format = 'M j, Y'
        es_format = 'j N Y'
        fr_format = 'j N Y'
        date_string = formats.date_format(today, en_format, use_l10n=True)
        actuals_report = IPTTTPReportSerializer()
        self.assertEqual(
            actuals_report.filename,
            f"IPTT Actuals only report {date_string}.xlsx"
        )
        tva_report = IPTTTVAReportSerializer()
        self.assertEqual(
            tva_report.filename,
            f"IPTT TvA report {date_string}.xlsx"
        )
        full_report = IPTTFullReportSerializer()
        self.assertEqual(
            full_report.filename,
            f"IPTT TvA full program report {date_string}.xlsx"
        )
        # French
        with lang_context('fr'):
            fr_date_string = formats.date_format(today, fr_format, use_l10n=True)
            fr_actuals_report = IPTTTPReportSerializer()
            fr_tva_report = IPTTTVAReportSerializer()
            fr_full_report = IPTTFullReportSerializer()
            self.assertEqual(
                fr_actuals_report.filename,
                f"Rapport IPTT relatif aux valeurs réelles {fr_date_string}.xlsx"
            )
            
            self.assertEqual(
                fr_tva_report.filename,
                f"Rapport TVA IPTT {fr_date_string}.xlsx"
            )
            
            self.assertEqual(
                fr_full_report.filename,
                f"Rapport IPTT relatif à la totalité de la TVA du programme {fr_date_string}.xlsx"
            )
        # Spanish
        with lang_context('es'):
            es_date_string = formats.date_format(today, es_format, use_l10n=True)
            es_actuals_report = IPTTTPReportSerializer()
            es_tva_report = IPTTTVAReportSerializer()
            es_full_report = IPTTFullReportSerializer()
            self.assertEqual(
                es_actuals_report.filename,
                f"Informes de reales únicamente del IPTT {es_date_string}.xlsx"
            )
            self.assertEqual(
                es_tva_report.filename,
                f"Informe del IPTT TvA {es_date_string}.xlsx"
            )
            self.assertEqual(
                es_full_report.filename,
                f"Informe completo del programa del IPTT TvA {es_date_string}.xlsx"
            )

    def get_reports(self, pk=None, tp_frequency=Indicator.ANNUAL, tva_frequency=Indicator.LOP, filters={}):
        if pk is None:
            pk = self.program1.pk
        actuals_report = IPTTTPReportSerializer.load_report(pk, tp_frequency, filters=filters)
        tva_report = IPTTTVAReportSerializer.load_report(pk, tva_frequency, filters=filters)
        full_report = IPTTFullReportSerializer.load_report(pk, filters=filters)
        return actuals_report, tva_report, full_report


    def test_program_name(self):
        actuals_report, tva_report, full_report = self.get_reports()
        self.assertEqual(actuals_report.data['program_name'], SPECIAL_CHARACTERS)
        self.assertEqual(tva_report.data['program_name'], SPECIAL_CHARACTERS)
        self.assertEqual(full_report.data['program_name'], SPECIAL_CHARACTERS)

    def test_program_reporting_period(self):
        program = RFProgramFactory(
            reporting_period_start=datetime.date(2014, 4, 1),
            reporting_period_end=datetime.date(2017, 3, 31)
            )
        for report in self.get_reports(program.pk):
            self.assertEqual(
                report.data['report_date_range'],
                'Apr 1, 2014 – Mar 31, 2017'
            )
        with lang_context('fr'):
            for report in self.get_reports(program.pk):
                self.assertEqual(
                    report.data['report_date_range'],
                    '1 avr. 2014 – 31 mar. 2017'
                )
        with lang_context('es'):
            for report in self.get_reports(program.pk):
                self.assertEqual(
                    report.data['report_date_range'],
                    'Apr 1, 2014 – Mar 31, 2017'
                )

    def test_program_reporting_period(self):
        for report in self.get_reports():
            self.assertEqual(
                report.data['report_title'],
                'Indicator Performance Tracking Report'
            )
        with lang_context('fr'):
            for report in self.get_reports():
                self.assertEqual(
                    report.data['report_title'],
                    'Rapport de suivi des performances de l’indicateur'
                )
        with lang_context('es'):
            for report in self.get_reports():
                self.assertEqual(
                    report.data['report_title'],
                    'Informe de seguimiento del rendimiento del indicador'
                )

    def test_program_periods(self):
        program = RFProgramFactory(
            reporting_period_start=datetime.date(2016, 4, 1),
            reporting_period_end=datetime.date(2020, 1, 31)
        )
        tp, tva, full = self.get_reports(
            program.pk, tp_frequency=Indicator.ANNUAL, tva_frequency=Indicator.LOP
        )
        self.assertIn(Indicator.ANNUAL, tp.data['periods'])
        self.assertEqual(len(tp.data['periods'][Indicator.ANNUAL]), 4)
        self.assertEqual(tp.data['periods'][Indicator.ANNUAL][-1].header, 'Year 4')
        self.assertEqual(tp.data['periods'][Indicator.ANNUAL][1].subheader, 'Apr 1, 2017 – Mar 31, 2018')
        self.assertIn(Indicator.LOP, tva.data['periods'])
        self.assertEqual(len(tva.data['periods'][Indicator.LOP]), 0)
        for (frequency, period_count) in [
            (Indicator.LOP, 0),
            (Indicator.MID_END, 2),
            (Indicator.ANNUAL, 4),
            (Indicator.SEMI_ANNUAL, 8),
            (Indicator.TRI_ANNUAL, 12),
            (Indicator.QUARTERLY, 16),
            (Indicator.MONTHLY, 46),
        ]:
            self.assertIn(frequency, full.data['periods'])
            self.assertEqual(len(full.data['periods'][frequency]), period_count)
        for report in [tp, tva, full]:
            self.assertIn('lop_period', report.data)
            lop_period = report.data['lop_period']
            self.assertEqual(
                lop_period.subheader,
                'Life of Program'
            )
            self.assertEqual(len(lop_period.columns),  3)
            self.assertEqual(
                lop_period.columns[0],
                {
                    'header': 'Target',
                    'attribute': 'lop_target_real',
                    'disaggregation_attribute': None
                }
            )
            self.assertEqual(
                lop_period.columns[1],
                {
                    'header': 'Actual',
                    'attribute': 'lop_actual',
                    'disaggregation_attribute': 'disaggregation_{}_lop_actual'
                }
            )
            
            self.assertEqual(
                lop_period.columns[2],
                {
                    'header': '% Met',
                    'attribute': 'lop_met_target_decimal',
                    'disaggregation_attribute': None
                }
            )

    def test_level_rows(self):
        program = RFProgramFactory(
            months=12,
            tiers=True
        )
        tiers = list(program.level_tiers.all().order_by('tier_depth'))
        levels = [
            LevelFactory(
                program=program,
                parent=None,
                customsort=1
            )
        ]
        levels += [
            LevelFactory(
                program=program,
                parent=levels[0],
                customsort=1
            ),
            LevelFactory(
                program=program,
                parent=levels[0],
                customsort=2
            ),
        ]
        levels.append(
            LevelFactory(
                program=program,
                parent=levels[1],
                customsort=1
            )
        )
        for level in levels:
            RFIndicatorFactory(
                program=program,
                target_frequency=Indicator.SEMI_ANNUAL,
                level=level
            )
        reports = self.get_reports(
            program.pk, tp_frequency=Indicator.SEMI_ANNUAL,
            tva_frequency=Indicator.SEMI_ANNUAL
        )
        for report in reports:
            self.assertIn('level_rows', report.data)
            self.assertIn(Indicator.SEMI_ANNUAL, report.data['level_rows'])
            level_pks = [
                level_row['level']['pk'] for level_row in report.data['level_rows'][Indicator.SEMI_ANNUAL]
            ]
            expected_pks = [
                levels[0].pk, levels[1].pk, levels[3].pk, levels[2].pk
            ]
            self.assertEqual(level_pks, expected_pks)
            self.assertIn('blank_level_rows', report.data)
            self.assertIn(Indicator.SEMI_ANNUAL, report.data['blank_level_rows'])
            blank_level_row = report.data['blank_level_rows'][Indicator.SEMI_ANNUAL]
            self.assertEqual(
                blank_level_row['level']['display_name'],
                'Indicators unassigned to a results framework level'
            )
            self.assertEqual(blank_level_row['indicators'], [])
        level_order_reports = self.get_reports(
            program.pk, tp_frequency=Indicator.MONTHLY,
            tva_frequency=Indicator.MONTHLY, filters={'groupby': 2}
        )
        for report in level_order_reports:
            self.assertIn('level_rows', report.data)
            self.assertIn(Indicator.MONTHLY, report.data['level_rows'])
            level_pks = [
                level_row['level']['pk'] for level_row in report.data['level_rows'][Indicator.MONTHLY]
            ]
            expected_pks = [
                levels[0].pk, levels[1].pk, levels[2].pk, levels[3].pk
            ]
            self.assertEqual(level_pks, expected_pks)

    def test_indicators_details(self):
        indicator = RFIndicatorFactory(
            program=self.program1,
            name=SPECIAL_CHARACTERS,
            level=self.goal_level,
            level_order=1,
            target_frequency=Indicator.SEMI_ANNUAL,
            unit_of_measure="bananas",
            unit_of_measure_type=Indicator.NUMBER,
            baseline=100,
            direction_of_change=Indicator.DIRECTION_OF_CHANGE_POSITIVE,
            is_cumulative=False,
            lop_target=1500,
            targets=1200,
            results=True
        )
        reports = self.get_reports(
            self.program1.pk, tp_frequency=Indicator.SEMI_ANNUAL,
            tva_frequency=Indicator.SEMI_ANNUAL
        )
        for report in reports:
            self.assertIn(Indicator.SEMI_ANNUAL, report.data['level_rows'])
            level_rows = report.data['level_rows'][Indicator.SEMI_ANNUAL]
            goal_level_row = next(level_rows)
            for level_row in level_rows:
                self.assertEqual(level_row['indicators'], [])
            self.assertEqual(len(goal_level_row['indicators']), 1)
            goal_indicator = goal_level_row['indicators'][0]
            self.assertEqual(goal_indicator['pk'], indicator.pk)
            self.assertEqual(goal_indicator['number'], 'Goal a')
            self.assertEqual(goal_indicator['name'], SPECIAL_CHARACTERS)
            self.assertEqual(goal_indicator['unit_of_measure'], 'bananas')
            self.assertEqual(goal_indicator['direction_of_change'], '+')
            self.assertEqual(goal_indicator['is_cumulative'], False)
            self.assertEqual(goal_indicator['unit_of_measure_type'], '#')
            self.assertEqual(goal_indicator['baseline'], '100')

    def test_indicator_sector_filters(self):
        in_indicator = self.get_indicator(sector=self.sector1)
        out_indicator = self.get_indicator(sector=None)
        tp_report, tva_report, _ = self.get_reports(
            self.program1.pk, tp_frequency=Indicator.ANNUAL,
            tva_frequency=Indicator.ANNUAL, filters={'sectors': [self.sector1.pk]}
        )
        for report in [tp_report, tva_report]:
            level_rows = report.data['level_rows'][Indicator.ANNUAL]
            goal_level = next(level_rows)
            self.assertEqual(goal_level['indicators'], [])
            second_level = next(level_rows)
            self.assertEqual(len(second_level['indicators']), 1)
            indicator = second_level['indicators'][0]
            self.assertEqual(indicator['pk'], in_indicator.pk)
            for level_row in level_rows:
                self.assertEqual(level_row['indicators'], [])
            
    def test_indicator_types_filters(self):
        in_indicator = self.get_indicator()
        in_indicator.indicator_type.set([self.i_type1])
        out_indicator = self.get_indicator()
        out_indicator.indicator_type.clear()
        tp_report, tva_report, _ = self.get_reports(
            self.program1.pk, tp_frequency=Indicator.ANNUAL,
            tva_frequency=Indicator.ANNUAL, filters={'types': [self.i_type1.pk]}
        )
        for report in [tp_report, tva_report]:
            level_rows = report.data['level_rows'][Indicator.ANNUAL]
            goal_level = next(level_rows)
            self.assertEqual(goal_level['indicators'], [])
            second_level = next(level_rows)
            self.assertEqual(len(second_level['indicators']), 1)
            indicator = second_level['indicators'][0]
            self.assertEqual(indicator['pk'], in_indicator.pk)
            for level_row in level_rows:
                self.assertEqual(level_row['indicators'], [])

    def test_indicator_indicator_filters(self):
        in_indicator = self.get_indicator()
        out_indicator = self.get_indicator()
        tp_report, tva_report, _ = self.get_reports(
            self.program1.pk, tp_frequency=Indicator.ANNUAL,
            tva_frequency=Indicator.ANNUAL, filters={'indicators': [in_indicator.pk]}
        )
        for report in [tp_report, tva_report]:
            level_rows = report.data['level_rows'][Indicator.ANNUAL]
            goal_level = next(level_rows)
            self.assertEqual(goal_level['indicators'], [])
            second_level = next(level_rows)
            self.assertEqual(len(second_level['indicators']), 1)
            indicator = second_level['indicators'][0]
            self.assertEqual(indicator['pk'], in_indicator.pk)
            for level_row in level_rows:
                self.assertEqual(level_row['indicators'], [])

    def test_indicator_disaggregation_filters_standard(self):
        in_indicator = self.get_indicator()
        in_indicator.disaggregation.set([self.standard_disagg1])
        out_indicator = self.get_indicator()
        out_indicator.disaggregation.clear()
        tp_report, tva_report, _ = self.get_reports(
            self.program1.pk, tp_frequency=Indicator.ANNUAL,
            tva_frequency=Indicator.ANNUAL, filters={'disaggregations': [self.standard_disagg1.pk]}
        )
        for report in [tp_report, tva_report]:
            level_rows = report.data['level_rows'][Indicator.ANNUAL]
            goal_level = next(level_rows)
            self.assertEqual(goal_level['indicators'], [])
            second_level = next(level_rows)
            self.assertEqual(len(second_level['indicators']), 1)
            indicator = second_level['indicators'][0]
            self.assertEqual(indicator['pk'], in_indicator.pk)
            for level_row in level_rows:
                self.assertEqual(level_row['indicators'], [])

    def test_indicator_disaggregation_filters_country(self):
        in_indicator = self.get_indicator()
        in_indicator.disaggregation.set([self.country_disagg])
        out_indicator = self.get_indicator()
        out_indicator.disaggregation.clear()
        tp_report, tva_report, _ = self.get_reports(
            self.program1.pk, tp_frequency=Indicator.ANNUAL,
            tva_frequency=Indicator.ANNUAL, filters={'disaggregations': [self.country_disagg.pk]}
        )
        for report in [tp_report, tva_report]:
            level_rows = report.data['level_rows'][Indicator.ANNUAL]
            goal_level = next(level_rows)
            self.assertEqual(goal_level['indicators'], [])
            second_level = next(level_rows)
            self.assertEqual(len(second_level['indicators']), 1)
            indicator = second_level['indicators'][0]
            self.assertEqual(indicator['pk'], in_indicator.pk)
            for level_row in level_rows:
                self.assertEqual(level_row['indicators'], [])
        
        

    def test_indicator_disaggregations_filter_multiple(self):
        in_indicator1 = self.get_indicator(level=self.goal_level)
        in_indicator1.disaggregation.set([self.country_disagg])
        in_indicator2 = self.get_indicator()
        in_indicator2.disaggregation.set([self.standard_disagg1, self.country_disagg])
        in_indicator3 = self.get_indicator(level=self.third_level)
        in_indicator3.disaggregation.set([self.standard_disagg1, self.standard_disagg2])
        out_indicator1 = self.get_indicator(level=self.goal_level)
        out_indicator1.disaggregation.clear()
        out_indicator2 = self.get_indicator()
        out_indicator2.disaggregation.set([self.standard_disagg2])
        tp_report, tva_report, _ = self.get_reports(
            self.program1.pk, tp_frequency=Indicator.ANNUAL,
            tva_frequency=Indicator.ANNUAL,
            filters={'disaggregations': [self.standard_disagg1.pk, self.country_disagg.pk]}
        )
        for report in [tp_report, tva_report]:
            level_rows = report.data['level_rows'][Indicator.ANNUAL]
            goal_level = next(level_rows)
            self.assertEqual(len(goal_level['indicators']), 1)
            self.assertEqual(goal_level['indicators'][0]['pk'], in_indicator1.pk)
            second_level = next(level_rows)
            self.assertEqual(len(second_level['indicators']), 1)
            self.assertEqual(second_level['indicators'][0]['pk'], in_indicator2.pk)
            third_level = next(level_rows)
            self.assertEqual(len(third_level['indicators']), 1)
            self.assertEqual(third_level['indicators'][0]['pk'], in_indicator3.pk)
            for level_row in level_rows:
                self.assertEqual(level_row['indicators'], [])

    def test_indicator_sites_filters(self):
        in_indicator = self.get_indicator(lop_target=1000, targets=True)
        target = in_indicator.periodictargets.all().first()
        result = ResultFactory(
            indicator=in_indicator,
            periodic_target=target,
            achieved=100,
            date_collected=target.start_date + datetime.timedelta(days=1),
            sites=[self.site]
        )
        out_indicator1 = self.get_indicator(lop_target=1000, targets=True)
        out_indicator2 = self.get_indicator(lop_target=1000, targets=True)
        target = out_indicator2.periodictargets.all().first()
        result = ResultFactory(
            indicator=out_indicator2,
            periodic_target=target,
            achieved=100,
            date_collected=target.start_date + datetime.timedelta(days=1),
            sites=[self.site2]
        )
        tp_report, tva_report, _ = self.get_reports(
            self.program1.pk, tp_frequency=Indicator.ANNUAL,
            tva_frequency=Indicator.ANNUAL, filters={'sites': [self.site.pk]}
        )
        for report in [tp_report, tva_report]:
            level_rows = report.data['level_rows'][Indicator.ANNUAL]
            goal_level = next(level_rows)
            self.assertEqual(goal_level['indicators'], [])
            second_level = next(level_rows)
            self.assertEqual(len(second_level['indicators']), 1)
            indicator = second_level['indicators'][0]
            self.assertEqual(indicator['pk'], in_indicator.pk)
            for level_row in level_rows:
                self.assertEqual(level_row['indicators'], [])