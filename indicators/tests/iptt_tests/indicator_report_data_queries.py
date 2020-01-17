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
from indicators.models import Indicator, PeriodicTarget
from indicators.queries.iptt_queries import IPTTIndicator
from factories import (
    indicators_models as i_factories,
    workflow_models as w_factories
)

QUERIES_PREFETCH = 8

QUERIES_FREQUENCIES = QUERIES_PREFETCH + 0

QUERIES_DISAGG_FREQUENCIES = QUERIES_FREQUENCIES + 0


TP_QUERYSET = IPTTIndicator.timeperiods
TVA_QUERYSET = IPTTIndicator.tva


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
        cls.category_pks = [
            label.pk for disagg in [cls.standard_disagg, cls.country_disagg] for label in disagg.labels
        ]
        cls.program = w_factories.RFProgramFactory()
        cls.program.country.set([cls.country])
        cls.periods = {}
        for frequency in Indicator.REGULAR_TARGET_FREQUENCIES:
            cls.periods[frequency] = [p for p in PeriodicTarget.generate_for_frequency(frequency)(
                cls.program.reporting_period_start,
                cls.program.reporting_period_end
            )]
        cls.indicators = []
        cls.results = []
        cls.disaggs = []
        for frequency, _ in Indicator.TARGET_FREQUENCIES[:-1]:
            indicator = i_factories.RFIndicatorFactory(
                program=cls.program,
                target_frequency=frequency,
                targets=1000,
                results=True
            )
            indicator.disaggregation.set([cls.standard_disagg, cls.country_disagg])
            results = 0
            disaggs = 0
            for result in indicator.result_set.all():
                results += result.achieved
                disaggs += 2
                for label in [label for disagg in indicator.disaggregation.all() for label in disagg.labels]:
                    i_factories.DisaggregatedValueFactory(
                        result=result,
                        category=label,
                        value=2
                    )
            cls.indicators.append(indicator)
            cls.results.append(results)
            cls.disaggs.append(disaggs)
        cls.period_results = [
            [],
            [],
            [],
            [[], [10,], [20,], [10,], [20,], [30,], [40,], [120,]],
            [[], [10, None], [20, None], [10, None], [10, 10], [20, 10], [20, 20], [60, 60]],
            [[], [10, None, None], [20, None, None], [10, None, None], [10, 10, None],
                [10, 10, 10], [20, 10, 10], [40, 40, 40]]
        ]
        

    def test_indicator_queryset_queries_one_indicator(self):
        filters = {'pk': self.indicators[0].pk}
        for queryset in [TP_QUERYSET, TVA_QUERYSET]:
            with self.assertNumQueries(QUERIES_PREFETCH):
                indicator = queryset.filter(**filters).first()
                # has rf marked
                self.assertTrue(indicator.using_results_framework)
                self.assertEqual(indicator.lop_target_calculated, 1000)
                self.assertEqual(indicator.lop_actual, self.results[0])
                self.assertAlmostEqual(indicator.lop_percent_met, float(self.results[0])/1000)
                self.assertCountEqual(indicator.disaggregation_category_pks, self.category_pks)
        for queryset in [TP_QUERYSET, TVA_QUERYSET]:
            with self.assertNumQueries(QUERIES_PREFETCH):
                indicator = queryset.filter(**filters).with_disaggregation_annotations(self.category_pks).first()
                for category_pk in self.category_pks:
                    self.assertEqual(
                        getattr(indicator, f'disaggregation_{category_pk}_lop_actual'),
                        self.disaggs[0]
                        )
        for frequency in Indicator.REGULAR_TARGET_FREQUENCIES:
            period_count = len(self.periods[frequency])
            with self.assertNumQueries(QUERIES_FREQUENCIES):
                indicator = TP_QUERYSET.filter(**filters).with_disaggregation_annotations(
                    self.category_pks
                ).with_frequency_annotations(
                    frequency, self.program.reporting_period_start, self.program.reporting_period_end,
                    disaggregations=[]
                ).first()
                self.assertEqual(getattr(indicator, f'frequency_{frequency}_count'), period_count)
                for c in range(period_count):
                    self.assertEqual(
                        getattr(indicator, f'frequency_{frequency}_period_{c}'),
                        10 if c == 0 else None
                    )
            with self.assertNumQueries(QUERIES_DISAGG_FREQUENCIES):
                indicator = TP_QUERYSET.filter(**filters).with_disaggregation_annotations(
                    self.category_pks
                ).with_frequency_annotations(
                    frequency, self.program.reporting_period_start, self.program.reporting_period_end,
                    disaggregations=self.category_pks
                ).first()
                for c in range(period_count):
                    for category_pk in self.category_pks:
                        self.assertEqual(
                            getattr(indicator, f'disaggregation_{category_pk}_frequency_{frequency}_period_{c}'),
                            2 if c == 0 else None
                        )
        self.assertTrue(True)

    def test_indicator_queryset_queries_two_indicators(self):
        filters = {'pk__in': [self.indicators[0].pk, self.indicators[1].pk]}
        for queryset in [TP_QUERYSET, TVA_QUERYSET]:
            with self.assertNumQueries(QUERIES_PREFETCH):
                indicators = [indicator for indicator in queryset.filter(**filters)]
                for c, indicator in enumerate(indicators):
                    self.assertTrue(indicator.using_results_framework)
                    self.assertEqual(indicator.lop_target_calculated, 1000)
                    self.assertEqual(indicator.lop_actual, self.results[c])
                    self.assertAlmostEqual(indicator.lop_percent_met, float(self.results[c])/1000)
                    self.assertCountEqual(indicator.disaggregation_category_pks, self.category_pks)
            with self.assertNumQueries(QUERIES_PREFETCH):
                indicators = [indicator for indicator in queryset.filter(
                    **filters
                ).with_disaggregation_annotations(self.category_pks)]
                for c, indicator in enumerate(indicators):
                    for category_pk in self.category_pks:
                        self.assertEqual(
                            getattr(indicator, 'disaggregation_{}_lop_actual'.format(category_pk)),
                            self.disaggs[c]
                            )
        for frequency in Indicator.REGULAR_TARGET_FREQUENCIES:
            period_count = len(self.periods[frequency])
            with self.assertNumQueries(QUERIES_FREQUENCIES):
                indicators = [indicator for indicator in TP_QUERYSET.filter(
                    **filters
                ).with_disaggregation_annotations(self.category_pks).with_frequency_annotations(
                    frequency, self.program.reporting_period_start, self.program.reporting_period_end,
                    disaggregations=[]
                )]
                for c, indicator in enumerate(indicators):
                    self.assertEqual(getattr(indicator, 'frequency_{}_count'.format(frequency)), period_count)
                    for c in range(period_count):
                        achieved = getattr(indicator, 'frequency_{}_period_{}'.format(frequency, c))
                        if frequency in [1, 2, 3, 4, 5]:
                            self.assertEqual(
                                achieved,
                                self.period_results[frequency][indicator.target_frequency][c]
                            )
            with self.assertNumQueries(QUERIES_DISAGG_FREQUENCIES):
                indicators = [
                    indicator for indicator in TP_QUERYSET.filter(**filters).with_disaggregation_annotations(
                        self.category_pks
                    ).with_frequency_annotations(
                        frequency, self.program.reporting_period_start, self.program.reporting_period_end,
                        disaggregations=self.category_pks
                    )]
                for indicator in indicators:
                    for c in range(period_count):
                        for category_pk in self.category_pks:
                            d_value = getattr(
                                indicator,  f'disaggregation_{category_pk}_frequency_{frequency}_period_{c}'
                            )
                            if frequency in [1, 2, 3, 4, 5]:
                                expected = self.period_results[frequency][indicator.target_frequency][c]
                                if expected is not None:
                                    expected = expected/5
                                self.assertEqual(
                                    d_value, expected
                                )
        self.assertTrue(True)
                    
        
    def test_indicator_queryset_queries_multiple_indicators(self):
        filters = {'program': self.program}
        for queryset in [TP_QUERYSET, TVA_QUERYSET]:
            with self.assertNumQueries(QUERIES_PREFETCH):
                indicators = [indicator for indicator in queryset.filter(**filters)]
                for c, indicator in enumerate(indicators):
                    self.assertTrue(indicator.using_results_framework)
                    self.assertEqual(indicator.lop_target_calculated, 1000)
                    self.assertEqual(indicator.lop_actual, self.results[c])
                    self.assertAlmostEqual(indicator.lop_percent_met, float(self.results[c])/1000)
                    self.assertCountEqual(indicator.disaggregation_category_pks, self.category_pks)
            with self.assertNumQueries(QUERIES_PREFETCH):
                indicators = [
                    indicator for indicator in queryset.filter(
                        **filters
                        ).with_disaggregation_annotations(self.category_pks)]
                for c, indicator in enumerate(indicators):
                    for category_pk in self.category_pks:
                        self.assertEqual(
                            getattr(indicator, 'disaggregation_{}_lop_actual'.format(category_pk)),
                            self.disaggs[c]
                            )
        for frequency in Indicator.REGULAR_TARGET_FREQUENCIES:
            period_count = len(self.periods[frequency])
            with self.assertNumQueries(QUERIES_FREQUENCIES):
                indicators = [indicator for indicator in TP_QUERYSET.filter(
                    **filters
                ).with_disaggregation_annotations(self.category_pks).with_frequency_annotations(
                    frequency, self.program.reporting_period_start, self.program.reporting_period_end,
                    disaggregations=[]
                )]
                for c, indicator in enumerate(indicators):
                    self.assertEqual(getattr(indicator, 'frequency_{}_count'.format(frequency)), period_count)
                    for c in range(period_count):
                        achieved = getattr(indicator, 'frequency_{}_period_{}'.format(frequency, c))
                        if frequency in [1, 2, 3, 4, 5]:
                            self.assertEqual(
                                achieved,
                                self.period_results[frequency][indicator.target_frequency][c]
                            )
            with self.assertNumQueries(QUERIES_DISAGG_FREQUENCIES):
                indicators = [indicator for indicator in TP_QUERYSET.filter(
                    **filters
                ).with_disaggregation_annotations(
                    self.category_pks
                ).with_frequency_annotations(
                    frequency, self.program.reporting_period_start, self.program.reporting_period_end,
                    disaggregations=self.category_pks
                )]
                for indicator in indicators:
                    for c in range(period_count):
                        for category_pk in self.category_pks:
                            d_value = getattr(
                                indicator,  f'disaggregation_{category_pk}_frequency_{frequency}_period_{c}'
                            )
                            if frequency in [1, 2, 3, 4, 5]:
                                expected = self.period_results[frequency][indicator.target_frequency][c]
                                if expected is not None:
                                    expected = expected/5
                                self.assertEqual(
                                    d_value, expected
                                )
        self.assertTrue(True)
            
            