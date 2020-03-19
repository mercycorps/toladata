from django import test
from workflow.serializers_new import (
    IPTTTPReportSerializer,
    IPTTTVAReportSerializer,
    IPTTFullReportSerializer,
)
from factories.workflow_models import (
    RFProgramFactory
)
from factories.indicators_models import (
    RFIndicatorFactory
)
from indicators.models import Indicator

PROGRAM_QUERIES = 3

TP_CONTEXT = 1
TVA_CONTEXT = 1
FULL_CONTEXT = 1

TP_REPORT = 0
TVA_REPORT = 0
FULL_REPORT = 0

class IPTTReportSerializerQueriesMixin:
    @classmethod
    def get_program_details(cls):
        return {
            'tiers': True,
            'levels': 2
        }
    @classmethod
    def set_up_test_program(cls):
        cls.program = RFProgramFactory(**cls.get_program_details())

    @classmethod
    def get_indicator_details(cls):
        return {
            'program': cls.program,
            'lop_target': 1500,
            'targets': True
        }

    @classmethod
    def set_up_test_indicators(cls):
        indicators = []
        for frequency, _ in Indicator.TARGET_FREQUENCIES:
            if frequency != Indicator.EVENT:
                indicators.append(
                    RFIndicatorFactory(**{'target_frequency': frequency, **cls.get_indicator_details()})
                )
        cls.indicators = indicators

    def program_query_tests(self):
        with self.assertNumQueries(PROGRAM_QUERIES):
            data = self.serializer.load_program_data(self.program.pk).data
            assert data['name'] is not None
            assert data['reporting_period_start_iso'] is not None
            assert data['reporting_period_end_iso'] is not None
            assert data['levels'] is not None

    def context_data_query_tests(self, frequency=Indicator.ANNUAL):
        with self.assertNumQueries(self.context_queries + PROGRAM_QUERIES):
            context = self.serializer.get_context(self.program.pk, [frequency,])
            assert context['program'] is not None
            assert context['indicators'] is not None

    def load_report_tests(self):
        with self.assertNumQueries(self.report_queries + self.context_queries + PROGRAM_QUERIES):
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
        cls.set_up_test_program()
        cls.set_up_test_indicators()

    def load_report(self, frequency=Indicator.ANNUAL, filters={}):
        return self.serializer.load_report(self.program.pk, frequency, filters=filters)

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
        cls.set_up_test_program()
        cls.set_up_test_indicators()

    def load_report(self, frequency=Indicator.MID_END, filters={}):
        return self.serializer.load_report(self.program.pk, frequency, filters=filters)

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
        cls.set_up_test_program()
        cls.set_up_test_indicators()

    def test_base_queries(self):
        self.program_query_tests()
        self.context_data_query_tests()
        self.load_report_tests()



""" Indicator queryset tests:
    - lop_target_real
    - lop_actual
    - lop_met_target_decimal
"""