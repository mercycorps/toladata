"""Tests that IPTT Report Serializers for various types of report utilize less than a specified number of queries

    - Ensures that added complexity does not exponentially increase query count and load times"""

from django import test
from workflow.serializers_new import (
    IPTTTPReportSerializer,
    IPTTTVAReportSerializer,
    IPTTFullReportSerializer,
)
from factories.workflow_models import RFProgramFactory
from factories.indicators_models import RFIndicatorFactory
from indicators.models import Indicator, Level, LevelTier

PROGRAM_QUERIES = 1

TP_CONTEXT = 9
TVA_CONTEXT = 9
FULL_CONTEXT = 9

TP_REPORT = 0
TVA_REPORT = 0
FULL_REPORT = 0

class IPTTReportSerializerQueriesMixin:
    @classmethod
    def get_program_details(cls):
        return {
            'name': "Program Name!!",
            'tiers': ["Tier1", "Tier2", "Tier3"],
            'levels': [(1,), ((2,),), (((2,1),),)],
        }

    @classmethod
    def set_up_test_programs(cls):
        cls.program = RFProgramFactory(**cls.get_program_details())
        cls.levels = list(Level.objects.select_related(None).only(
            'pk', 'name', 'parent_id', 'customsort', 'program_id'
        ).filter(program_id=cls.program.pk))
        cls.tiers = list(LevelTier.objects.select_related(None).only(
            'pk', 'name', 'program_id', 'tier_depth'
        ).filter(program_id=cls.program.pk))

    @classmethod
    def get_indicator_details(cls):
        return {
            'program': cls.program,
            'lop_target': 1500,
            'targets': True,
            'results': True
        }

    @classmethod
    def set_up_test_indicators(cls):
        indicators = []
        for frequency, _ in Indicator.TARGET_FREQUENCIES:
            if frequency != Indicator.EVENT:
                indicators.append(
                    RFIndicatorFactory(**{
                        'target_frequency': frequency,
                        **cls.get_indicator_details()
                    })
                )
        cls.indicators = indicators

    @property
    def report_queries_count(self):
        return self.report_queries + self.context_queries + PROGRAM_QUERIES

    def program_query_tests(self):
        program_context = {
            'tiers': self.tiers,
            'levels': self.levels
        }
        with self.assertNumQueries(PROGRAM_QUERIES):
            data = self.serializer.load_program_data(self.program.pk, program_context=program_context).data
            self.assertEqual(data['name'], "Program Name!!")
            assert data['reporting_period_start_iso'] is not None
            assert data['reporting_period_end_iso'] is not None
            self.assertEqual(len(data['levels']), 6)

    def context_data_query_tests(self, frequency=Indicator.ANNUAL):
        with self.assertNumQueries(self.context_queries + PROGRAM_QUERIES):
            context = self.serializer.get_context(self.program.pk, [frequency,])
            assert context['program'] is not None
            assert context['indicators'] is not None
            assert context['report_data'] is not None

    def load_report_tests(self):
        with self.assertNumQueries(self.report_queries_count):
            report = self.load_report()
            assert report.data['program_name'] is not None
            assert report.data['report_date_range'] is not None
            assert report.data['report_title'] is not None
            assert report.data['level_rows'] is not None


class TestIPTTTPReportSerializer(test.TestCase, IPTTReportSerializerQueriesMixin):
    serializer = IPTTTPReportSerializer
    context_queries = TP_CONTEXT
    report_queries = TP_REPORT

    @classmethod
    def setUpTestData(cls):
        cls.set_up_test_programs()
        cls.set_up_test_indicators()

    def load_report(self, program_pk=None, **kwargs):
        if program_pk is None:
            program_pk = self.program.pk
        return self.serializer.load_report(program_pk, **kwargs)

    def test_base_queries(self):
        self.program_query_tests()
        self.context_data_query_tests()
        self.load_report_tests()


class TestIPTTTVAReportSerializer(test.TestCase, IPTTReportSerializerQueriesMixin):
    serializer = IPTTTVAReportSerializer
    context_queries = TVA_CONTEXT
    report_queries = TVA_REPORT

    @classmethod
    def setUpTestData(cls):
        cls.set_up_test_programs()
        cls.set_up_test_indicators()

    def load_report(self, **kwargs):
        return self.serializer.load_report(self.program.pk, **kwargs)

    def test_base_queries(self):
        self.program_query_tests()
        self.context_data_query_tests()
        self.load_report_tests()


class TestIPTTFullReportSerializer(test.TestCase, IPTTReportSerializerQueriesMixin):
    serializer = IPTTFullReportSerializer
    context_queries = FULL_CONTEXT
    report_queries = TVA_REPORT

    def load_report(self, filters={}):
        return self.serializer.load_report(self.program.pk, filters=filters)

    @classmethod
    def setUpTestData(cls):
        cls.set_up_test_programs()
        cls.set_up_test_indicators()

    def test_base_queries(self):
        self.program_query_tests()
        self.context_data_query_tests()
        self.load_report_tests()