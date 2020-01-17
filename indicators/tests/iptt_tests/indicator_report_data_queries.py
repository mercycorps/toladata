"""Tests for the IPTT Report Data Indicators (TP/TVA) to ensure their query counts stay O(n) and not O(n^2)

    - api_report_data takes program_pk and frequency, calls IPTT<TVA/TP>ReportIndicatorSerializer.load_report
    - IPTT<TVA/TP>ReportIndicatorSerializer.load_report takes program_pk and frequency
        - queries for program data (start/end dates)
        - queries for disaggregations data ??
        - calls IPTTIndicator.tva/timperiods
    - IPTTIndicator
        - get queryset adds prefetch
        - with_annotations adds lop_target lop_actual, lop_percent_met, and old_level if necessary
        - with_disaggaggregation_annotations takes disaggregation_category_pks and adds lop_actual for each
        - with_frequency_annotations takes freq, start, end, and disaggregation_category_pks and adds
            frequency_disaggregation_actual for each disaggregation and overall frequency actual
            (if TVA also adds overall frequency target and percent met)

"""

from django import test

from indicators.serializers_new import (
    IPTTTVAReportIndicatorSerializer,
    IPTTTPReportIndicatorSerializer
)
from indicators.models import Indicator
from indicators.queries.iptt_queries import IPTTIndicator
from factories import (
    indicators_models as i_factories,
    workflow_models as w_factories
)

QUERIES_PREFETCH = 1


class TestIPTTIndicatorQuerysetPrefetch(test.TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.standard_disagg = i_factories.DisaggregationTypeFactory(
            standard=True,
            country=None,
            disaggregation_type="Test Standard Disagg",
            labels=["Test SD Label {}".format(c+1) for c in range(5)]
        )
        cls.country = w_factories.CountryFactory(country="TestLand", code="TL")
        cls.country_disagg = i_factories.DisaggregationTypeFactory(
            standard=False,
            country=cls.country,
            disaggregation_type="Test Country Disagg",
            labels=["Test CD Label {}".format(c+1) for c in range(5)]
        )
        cls.program = w_factories.RFProgramFactory()
        cls.program.country.set([self.country])
        cls.indicators = []
        for frequency, _ in Indicator.TARGET_FREQUENCIES[:-1]:
            indicator = i_factories.RFIndicatorFactory(
                program=cls.program,
                frequency=frequency,
                targets=1000,
                results=True
            )
            indicator.disaggregation.set([cls.standard_disagg, cls.country_disagg])
            for result in indicator.result_set.all():
                for label in [label for disagg in indicator.disaggregation.all() for label in disagg.labels]:
                    i_factories.DisaggregatedValueFactory(
                        result=result,
                        category=label,
                        value=2
                    )
            cls.indicators.append(indicator)
        
    def test_tp_indicator_queryset_queries(self):
        with self.assertNumQueries(QUERIES_PREFETCH):
            indicators = [indicator for indicator in IPTTIndicator.timeperiods.filter(program=self.program)]
            
            