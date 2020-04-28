"""Tests for the IPTT Indicator Serializer (query counts and load times)"""

import decimal
from collections import defaultdict
from django import test
from django.db import models
from indicators.models import (
    Indicator,
    IndicatorType,
    PeriodicTarget,
    Result,
    DisaggregationType,
    DisaggregationLabel,
    DisaggregatedValue,
    Level,
    LevelTier,
)
from workflow.models import (
    Program,
    Sector,
    SiteProfile,
)
from factories.indicators_models import (
    RFIndicatorFactory,
    LevelFactory,
    IndicatorTypeFactory,
    DisaggregationTypeFactory,
    ResultFactory
)
from factories.workflow_models import (
    RFProgramFactory,
    SectorFactory,
    SiteProfileFactory,
    CountryFactory,
)
from indicators.tests.iptt_tests.iptt_scenario import (
    IndicatorGenerator
)
from indicators.serializers_new import (
    IPTTLevelSerializer
)
from workflow.serializers_new import (
    IPTTTPReportSerializer,
    IPTTTVAReportSerializer,
    IPTTFullReportSerializer
)

BASE_SERIALIZER_QUERIES = 1
TP_QUERIES = BASE_SERIALIZER_QUERIES + 0
TVA_QUERIES = BASE_SERIALIZER_QUERIES + 0
FULL_QUERIES = BASE_SERIALIZER_QUERIES + 0

CONTEXT_QUERIES = 4

class DecimalComparator:
    def assertDecimalEqual(self, a, b, msg=None, strict=False):
        msg = f"{msg}: " if msg else ''
        if a != b:
            raise self.failureException(f"{msg}{a} not equal to {b}")
        if not isinstance(a, decimal.Decimal):
            raise self.failureException(f"{msg}{a} expected type Decimal, got {type(a)}")
        if not isinstance(b, decimal.Decimal):
            raise self.failureException(f"{msg}{b} expected type Decimal, got {type(b)}")
        if strict and not a.same_quantum(b):
            raise self.failureException(f"{msg}{a} has exponent {a.as_tuple()[2]}, and {b} has exponent {b.as_tuple()[2]}")

def get_decimal(value, places=2):
    if isinstance(value, (int, float, str)):
        return decimal.Decimal(value).quantize(decimal.Decimal(f".{'0'*(places-1)}1"))
    if isinstance(value, (list, tuple)):
        return [get_decimal(v, places=places) for v in value]
    return value

class TestIPTTIndicatorSerializerQueries(test.TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.program = RFProgramFactory(
            months=24,
            tiers=True,
            levels=2
            )
        cls.goal_level = cls.program.levels.filter(parent__isnull=True).first()
        cls.second_levels = list(cls.program.levels.filter(parent=cls.goal_level))
        cls.third_levels = [
            list(cls.program.levels.filter(parent=cls.second_levels[0])),
            list(cls.program.levels.filter(parent=cls.second_levels[1]))
        ]
        cls.fourth_levels = [
            [
                list(cls.program.levels.filter(parent=cls.third_levels[0][0])),
                list(cls.program.levels.filter(parent=cls.third_levels[0][1])),
            ],
            [
                list(cls.program.levels.filter(parent=cls.third_levels[1][0])),
                list(cls.program.levels.filter(parent=cls.third_levels[1][1])),
            ]
        ]

    def tearDown(self):
        self.program.indicator_set.all().delete()

    def get_base_indicator(self):
        return RFIndicatorFactory(
            program=self.program,
            level=self.second_levels[0],
            target_frequency=Indicator.ANNUAL,
            lop_target=1000,
            targets=True
        )

    def get_context(self, program_pk=None):
        if program_pk is None:
            program_pk = self.program.pk
        with self.assertNumQueries(CONTEXT_QUERIES):
            disaggregation_labels = DisaggregationLabel.objects.select_related(
                'disaggregation_type'
            ).prefetch_related(None).filter(
                disaggregation_type__indicator__program_id=program_pk
            ).distinct()
            disaggregations_map = {}
            for label in disaggregation_labels:
                if label.disaggregation_type.pk not in disaggregations_map:
                    disaggregations_map[label.disaggregation_type.pk] = {
                        'disaggregation': label.disaggregation_type,
                        'labels': []
                    }
                disaggregations_map[label.disaggregation_type.pk]['labels'].append(label)
            
            values_subquery = DisaggregatedValue.objects.select_related(None).prefetch_related(
                None
            ).filter(
                category_id__disaggregation_type_id=models.OuterRef('pk'),
                result__indicator_id=models.OuterRef('indicator__pk'),
                value__isnull=False
            )
            disaggregations_indicators = defaultdict(
                lambda: {'all': [], 'with_results': []}
            )
            for d_i in DisaggregationType.objects.select_related(None).prefetch_related(
                None
            ).filter(
                indicator__program_id=program_pk,
                indicator__pk__isnull=False
            ).values('pk', 'indicator__pk').annotate(has_results=models.Exists(values_subquery)):
                disaggregations_indicators[d_i['indicator__pk']]['all'].append(d_i['pk'])
                if d_i['has_results']:
                    disaggregations_indicators[d_i['indicator__pk']]['with_results'].append(d_i['pk'])
            context = {
                'levels': list(Level.objects.select_related(None).only(
                    'pk', 'name', 'parent_id', 'customsort', 'program_id'
                ).filter(program_id=program_pk)),
                'tiers': list(LevelTier.objects.select_related(None).only(
                    'pk', 'name', 'program_id', 'tier_depth'
                ).filter(program_id=program_pk)),
                #'disaggregations': {d.pk: d for d in disaggregations},
                'disaggregations': disaggregations_map,
                'disaggregations_indicators': disaggregations_indicators
            }
        return context

    def get_serialized_indicator_data(self, program_pk=None, filters={}, no_full_report=False):
        if program_pk is None:
            program_pk = self.program.pk
        context = self.get_context(program_pk=program_pk)
        base_filters = filters.copy()
        base_context = IPTTTPReportSerializer._get_base_context(program_pk)
        with self.assertNumQueries(TP_QUERIES):
            filters = IPTTTPReportSerializer.get_indicator_filters(base_filters, program_pk, context=base_context)
            tp = IPTTTPReportSerializer.load_indicator_data(
                indicator_context=context, indicator_filters=filters
            ).data
        with self.assertNumQueries(TVA_QUERIES):
            filters = IPTTTVAReportSerializer.get_indicator_filters(base_filters, program_pk, context=base_context)
            tva = IPTTTVAReportSerializer.load_indicator_data(
                indicator_context=context, indicator_filters=filters
            ).data
        if no_full_report:
            return tp, tva
        with self.assertNumQueries(FULL_QUERIES):
            filters = IPTTFullReportSerializer.get_indicator_filters(base_filters, program_pk)
            full = IPTTFullReportSerializer.load_indicator_data(
                indicator_context=context, indicator_filters=filters
            ).data
        return tp, tva, full
        
    def test_loads_one_basic_indicator(self):
        indicator = self.get_base_indicator()
        for serialized_data in self.get_serialized_indicator_data():
            with self.assertNumQueries(0):
                self.assertEqual(len(serialized_data), 1)
                self.assertEqual(serialized_data[0]['pk'], indicator.pk)

    def test_loads_two_basic_indicators(self):
        indicators = [self.get_base_indicator() for x in range(2)]
        for serialized_data in self.get_serialized_indicator_data():
            with self.assertNumQueries(0):
                self.assertEqual(len(serialized_data), 2)
                self.assertEqual(serialized_data[0]['pk'], indicators[0].pk)
                self.assertEqual(serialized_data[1]['pk'], indicators[1].pk)

    def test_loads_indicator_naming_data(self):
        i_gen = IndicatorGenerator()
        expected = {i.pk: {
            'expected_program_pk': i_gen.program.pk,
            'expected_number': i.number_display,
            'expected_pk': i.pk,
            'expected_name': i.name,
            } for i in i_gen.indicators_per_level(count=2)}
        first_number = "{} a".format(i_gen.tiers[0].name)
        for serialized_data in self.get_serialized_indicator_data(program_pk=i_gen.program.pk):
            with self.assertNumQueries(0):
                self.assertEqual(len(serialized_data), 12)
                self.assertEqual(serialized_data[0]['number'], first_number)
                for serialized_indicator in serialized_data:
                    self.assertEqual(
                        serialized_indicator['program_pk'],
                        expected[serialized_indicator['pk']]['expected_program_pk'],
                    )
                    self.assertEqual(
                        serialized_indicator['pk'],
                        expected[serialized_indicator['pk']]['expected_pk'],
                    )
                    self.assertEqual(
                        serialized_indicator['number'],
                        expected[serialized_indicator['pk']]['expected_number'],
                    )
                    self.assertEqual(
                        serialized_indicator['name'],
                        expected[serialized_indicator['pk']]['expected_name'],
                    )

    def test_loads_old_level_names(self):
        i_gen = IndicatorGenerator(migrated=False, tiers=False, levels=False)
        expected = {i.pk: {
            'expected_number': i.number,
            'expected_old_level': i.old_level
            } for i in i_gen.old_level_indicators()
        }
        for serialized_data in self.get_serialized_indicator_data(program_pk=i_gen.program.pk):
            with self.assertNumQueries(0):
                self.assertEqual(len(serialized_data), 6)
                for serialized_indicator in serialized_data:
                    self.assertEqual(
                        serialized_indicator['old_level_name'],
                        expected[serialized_indicator['pk']]['expected_old_level'],
                    )
                    self.assertEqual(
                        serialized_indicator['number'],
                        expected[serialized_indicator['pk']]['expected_number'],
                    )

    def test_loads_measurement_stats(self):
        fields = ['unit_of_measure', 'direction_of_change', 'unit_of_measure_type',
                  'is_cumulative_display', 'baseline']
        i_gen = IndicatorGenerator()
        expected = {}
        for indicator in i_gen.all_measurement_type_indicators():
            expected_data = {
                'expected_unit_of_measure': indicator.unit_of_measure
            }
            if indicator.direction_of_change == Indicator.DIRECTION_OF_CHANGE_POSITIVE:
                expected_data['expected_direction_of_change'] = '+'
            elif indicator.direction_of_change == Indicator.DIRECTION_OF_CHANGE_NEGATIVE:
                expected_data['expected_direction_of_change'] = '-'
            else:
                expected_data['expected_direction_of_change'] = None
            if indicator.unit_of_measure_type == Indicator.PERCENTAGE:
                expected_data['expected_unit_of_measure_type'] = '%'
            else:
                expected_data['expected_unit_of_measure_type'] = '#'
            if indicator.is_cumulative:
                expected_data['expected_is_cumulative_display'] = 'Cumulative'
            else:
                expected_data['expected_is_cumulative_display'] = 'Not cumulative'
            if indicator.baseline_na:
                expected_data['expected_baseline'] = None
            else:
                expected_data['expected_baseline'] = str(indicator.baseline)
            expected[indicator.pk] = expected_data
        for serialized_data in self.get_serialized_indicator_data(program_pk=i_gen.program.pk):
            with self.assertNumQueries(0):
                self.assertEqual(len(serialized_data), 12)
                for serialized_indicator in serialized_data:
                    for field in fields:
                        self.assertEqual(
                            serialized_indicator[field],
                            expected[serialized_indicator['pk']][f'expected_{field}'],
                            (f"field {field} expected:\n"
                             f"{expected[serialized_indicator['pk']]} \ngot:\n"
                             f"{serialized_indicator}")
                        )

    def test_loads_frequencies(self):
        i_gen = IndicatorGenerator()
        expected = {i.pk: i.target_frequency for i in i_gen.all_frequencies_indicators()}
        for serialized_data in self.get_serialized_indicator_data(program_pk=i_gen.program.pk):
            with self.assertNumQueries(0):
                self.assertEqual(len(serialized_data), 16)
                for serialized_indicator in serialized_data:
                    self.assertEqual(
                        serialized_indicator['target_frequency'],
                        expected[serialized_indicator['pk']]
                    )

    def test_filters_indicators(self):
        i_gen = IndicatorGenerator(
            sectors=True,
            indicator_types=True,
            disaggregations=True,
        )
        expected_sectors = []
        expected_indicator_types = []
        expected_standard_disaggs = []
        expected_country_disaggs = []
        indicators = i_gen.all_filters_indicators()
        no_filters = []
        pk_filters = []
        for c, indicator in enumerate(indicators):
            no_filters.append(indicator.pk)
            if c < 3:
                pk_filters.append(indicator.pk)
            if indicator.sector and indicator.sector.pk == i_gen.sectors[0].pk:
                expected_sectors.append(indicator.pk)
            if any(it.pk == i_gen.indicator_types[0].pk for it in indicator.indicator_type.all()):
                expected_indicator_types.append(indicator.pk)
            if any(d.pk == i_gen.standard_disaggs[0].pk for d in indicator.disaggregation.all()):
                expected_standard_disaggs.append(indicator.pk)
            if any(d.pk == i_gen.country_disaggs[0].pk for d in indicator.disaggregation.all()):
                expected_country_disaggs.append(indicator.pk)
        tp, tva, full = self.get_serialized_indicator_data(
            program_pk=i_gen.program.pk,
            filters={'sectors': [i_gen.sectors[0].pk]}
        )
        with self.assertNumQueries(0):
            for serialized_data in [tp, tva]:
                self.assertEqual(
                    set(s_i['pk'] for s_i in serialized_data),
                    set(expected_sectors),
                )
            self.assertEqual(set(s_i['pk'] for s_i in full), set(no_filters))
        del tp, tva, full
        tp, tva, full = self.get_serialized_indicator_data(
            program_pk=i_gen.program.pk, filters={'disaggregations': [i_gen.standard_disaggs[0].pk]}
        )
        with self.assertNumQueries(0):
            for serialized_data in [tp, tva]:
                self.assertEqual(
                    set(s_i['pk'] for s_i in serialized_data),
                    set(expected_standard_disaggs),
                )
            self.assertEqual(set(s_i['pk'] for s_i in full), set(no_filters))
        del tp, tva, full
        tp, tva, full = self.get_serialized_indicator_data(
            program_pk=i_gen.program.pk, filters={'disaggregations': [i_gen.country_disaggs[0].pk]}
        )
        with self.assertNumQueries(0):
            for serialized_data in [tp, tva]:
                self.assertEqual(
                    set(s_i['pk'] for s_i in serialized_data),
                    set(expected_country_disaggs),
                )
            self.assertEqual(set(s_i['pk'] for s_i in full), set(no_filters))
        del tp, tva, full
        tp, tva, full = self.get_serialized_indicator_data(
            program_pk=i_gen.program.pk, filters={'types': [i_gen.indicator_types[0].pk]}
        )
        with self.assertNumQueries(0):
            for serialized_data in [tp, tva]:
                self.assertEqual(
                    set(s_i['pk'] for s_i in serialized_data),
                    set(expected_indicator_types),
                )
            self.assertEqual(set(s_i['pk'] for s_i in full), set(no_filters))
        del tp, tva, full
        tp, tva, full = self.get_serialized_indicator_data(
            program_pk=i_gen.program.pk,
            filters={
                'types': [i_gen.indicator_types[0].pk],
                'disaggregations': [i_gen.country_disaggs[0].pk, i_gen.standard_disaggs[0].pk],
                'sectors': [i_gen.sectors[0].pk]
            }
        )
        these_expected_pks = (set(expected_indicator_types) &
                              set(expected_standard_disaggs + expected_country_disaggs) &
                              set(expected_sectors))
        with self.assertNumQueries(0):
            for serialized_data in [tp, tva]:
                self.assertEqual(
                    set(s_i['pk'] for s_i in serialized_data),
                    these_expected_pks,
                )
            self.assertEqual(set(s_i['pk'] for s_i in full), set(no_filters))
        del tp, tva, full
        tp, tva, full = self.get_serialized_indicator_data(
            program_pk=i_gen.program.pk, filters={'indicators': pk_filters}
        )
        with self.assertNumQueries(0):
            for serialized_data in [tp, tva]:
                self.assertEqual(
                    set(s_i['pk'] for s_i in serialized_data),
                    set(pk_filters),
                )
            self.assertEqual(set(s_i['pk'] for s_i in full), set(no_filters))
        del tp, tva, full


    def test_site_filters(self):
        i_gen = IndicatorGenerator(
            sites=True
        )
        indicators = i_gen.sites_indicators()
        expected_pks = []
        no_filters = []
        for indicator in indicators:
            no_filters.append(indicator.pk)
            for result in indicator.result_set.all():
                if (indicator.pk not in expected_pks and
                   i_gen.sites[0].pk in [s.pk for s in result.site.all()]):
                    expected_pks.append(indicator.pk)
        tp, tva, full = self.get_serialized_indicator_data(
            program_pk=i_gen.program.pk, filters={'sites': [i_gen.sites[0]]}
        )
        with self.assertNumQueries(0):
            for serialized_data in [tp, tva]:
                self.assertEqual(
                    set(s_i['pk'] for s_i in serialized_data),
                    set(expected_pks),
                )
            self.assertEqual(set(s_i['pk'] for s_i in full), set(no_filters))
        del tp, tva, full

    def test_level_filters(self):
        i_gen = IndicatorGenerator()
        indicators = i_gen.indicators_per_level()
        selected_level_pk = [i_gen.levels[1].pk]
        selected_level_and_chain_pks = [i_gen.levels[x].pk for x in [1, 3, 5]]
        selected_indicator_pks = []
        for indicator in indicators:
            if indicator.level_id in selected_level_and_chain_pks:
                selected_indicator_pks.append(indicator.pk)
        for report in self.get_serialized_indicator_data(
            program_pk=i_gen.program.pk, filters={'levels': selected_level_pk}, no_full_report=True
        ):
            with self.assertNumQueries(0):
                self.assertCountEqual([s_i['pk'] for s_i in report], selected_indicator_pks)

    def test_tier_filters(self):
        i_gen = IndicatorGenerator()
        indicators = i_gen.indicators_per_level()
        one_tier = [i_gen.tiers[0].pk]
        two_tiers = [i_gen.tiers[1].pk, i_gen.tiers[2].pk]
        one_tier_indicator_pks = []
        two_tier_indicator_pks = []
        for indicator in indicators:
            if indicator.level.leveltier.pk in one_tier:
                one_tier_indicator_pks.append(indicator.pk)
            elif indicator.level.leveltier.pk in two_tiers:
                two_tier_indicator_pks.append(indicator.pk)
        for report in self.get_serialized_indicator_data(
            program_pk=i_gen.program.pk, filters={'tiers': one_tier}, no_full_report=True
        ):
            with self.assertNumQueries(0):
                self.assertCountEqual([s_i['pk'] for s_i in report], one_tier_indicator_pks)
        for report in self.get_serialized_indicator_data(
            program_pk=i_gen.program.pk, filters={'tiers': two_tiers}, no_full_report=True
        ):
            with self.assertNumQueries(0):
                self.assertCountEqual([s_i['pk'] for s_i in report], two_tier_indicator_pks)
                

    def test_disaggregations_data(self):
        i_gen = IndicatorGenerator(
            disaggregations=True
        )
        indicators = i_gen.disaggregations_indicators()
        reports = self.get_serialized_indicator_data(program_pk=i_gen.program.pk)
        for serialized_data in reports:
            for serialized_indicator in serialized_data:
                with self.assertNumQueries(0):
                    indicator_pk = serialized_indicator['pk']
                    disaggregations = serialized_indicator['disaggregations']
                expected_indicator = Indicator.objects.get(pk=indicator_pk)
                expected_disaggregations = list(expected_indicator.disaggregation.all())
                disaggs_with_results = i_gen.indicators_with_disaggregated_results.get(indicator_pk, set())
                self.assertEqual(len(disaggregations), len(expected_disaggregations))
                for disaggregation in disaggregations:
                    with self.assertNumQueries(0):
                        disagg_pk = disaggregation['pk']
                        name = disaggregation['name']
                        labels = disaggregation['labels']
                        results = disaggregation['has_results']
                    expected_disaggregation = expected_indicator.disaggregation.get(pk=disagg_pk)
                    self.assertEqual(
                        name, expected_disaggregation.disaggregation_type
                    )
                    if disagg_pk in disaggs_with_results:
                        self.assertTrue(results)
                    else:
                        self.assertFalse(results)
                    expected_labels = list(expected_disaggregation.labels)
                    for label, expected_label in zip(labels, expected_labels):
                        with self.assertNumQueries(0):
                            label_pk = label['pk']
                            label_name = label['name']
                        self.assertEqual(label_pk, expected_label.pk)
                        self.assertEqual(label_name, expected_label.label)


REPORT_CONTEXT_QUERIES = 4
RESULTS_CONTEXT_QUERIES = 1

REPORT_QUERIES = 1
TP_REPORT_QUERIES = REPORT_QUERIES + 0
TVA_REPORT_QUERIES = REPORT_QUERIES + 0
FULL_REPORT_QUERIES = REPORT_QUERIES + 0

class TestIPTTSerializedReportData(test.TestCase, DecimalComparator):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.i_gen = IndicatorGenerator(sectors=True, indicator_types=True, sites=True, disaggregations=True)

    def tearDown(self):
        self.i_gen.clear_after_test()

    def get_context(self, program_pk, frequency, filters={}):
        context = {}
        context['frequency'] = frequency
        program = Program.rf_aware_objects.only(
            'reporting_period_start', 'reporting_period_end'
        ).get(pk=program_pk)
        periods = list(PeriodicTarget.generate_for_frequency(frequency)(
            program.reporting_period_start, program.reporting_period_end
        ))
        end_period = (filters['end'] + 1) if 'end' in filters else len(periods)
        context['periods'] = periods[filters.get('start', 0):end_period]
        context['results'] = defaultdict(list)
        disaggregated_values_queryset = DisaggregatedValue.objects.filter(
            value__isnull=False
        ).only('result_id', 'category_id', 'value')
        if 'disaggregations' in filters:
            disaggregated_values_queryset = disaggregated_values_queryset.filter(
                category__disaggregation_type__id__in=filters.get('disaggregations')
            )
        results = Result.objects.select_related('periodic_target').prefetch_related(None).filter(
            indicator__program_id=program_pk
        ).order_by('indicator_id').prefetch_related(
            models.Prefetch(
                'disaggregatedvalue_set',
                queryset=disaggregated_values_queryset,
                to_attr='prefetch_disaggregated_values'
            )
        )
        for result in results:
            context['results'][result.indicator_id].append(result)
        context['targets'] = defaultdict(list)
        targets = PeriodicTarget.objects.select_related(None).prefetch_related(None).filter(
            indicator__program_id=program_pk
        ).only('indicator_id', 'pk', 'customsort', 'target')
        for target in targets:
            context['targets'][target.indicator_id].append(target)
        labels_filters = {
            'disaggregation_type__indicator__program_id': program_pk,
            'disaggregation_type__indicator__deleted__isnull': True,
        }
        if 'disaggregations' in filters:
            labels_filters['disaggregation_type__id__in'] = filters.get('disaggregations')
        labels = DisaggregationLabel.objects.select_related(None).prefetch_related(None).filter(
            **labels_filters
        ).values_list(
            'disaggregation_type__indicator__pk', 'pk'
        ).order_by('disaggregation_type__indicator__pk').distinct()
        labels_indicators_map = defaultdict(list)
        for indicator_pk, label_pk in labels:
            labels_indicators_map[indicator_pk].append(label_pk)
        context['labels_indicators_map'] = labels_indicators_map
        return context
    
    def get_serialized_report_data(self, program_pk=None, frequency=Indicator.ANNUAL,
                                   filters={}, tp_only=False, tva_only=False, no_tva_full=False):
        if program_pk is None:
            program_pk = self.i_gen.program.pk
        results_exist = Result.objects.filter(indicator__program_id=program_pk).exists()
        context_query_count = REPORT_CONTEXT_QUERIES + (RESULTS_CONTEXT_QUERIES if results_exist else 0)
        with self.assertNumQueries(context_query_count):
            context = self.get_context(program_pk=program_pk, frequency=frequency, filters=filters)
        
        
        base_filters = filters.copy()
        if not tva_only:
            with self.assertNumQueries(TP_REPORT_QUERIES):
                filters = IPTTTPReportSerializer.get_report_filters(base_filters, program_pk, frequency=frequency)
                tp = IPTTTPReportSerializer.load_report_data(
                    report_context=context, report_filters=filters
                )
            if tp_only:
                return tp
        with self.assertNumQueries(TVA_REPORT_QUERIES):
            filters = IPTTTVAReportSerializer.get_report_filters(base_filters, program_pk, frequency=frequency)
            tva = IPTTTVAReportSerializer.load_report_data(
                report_context=context, report_filters=filters
            )
        if tva_only:
            return tva
        if no_tva_full:
            return tp, tva
        with self.assertNumQueries(FULL_REPORT_QUERIES):
            filters = IPTTFullReportSerializer.get_report_filters(base_filters, program_pk)
            full = IPTTFullReportSerializer.load_report_data(
                report_context=context, report_filters=filters
            )
        return tp, tva, full

    def test_one_indicator_with_one_result(self):
        indicator = self.i_gen.one_indicator_with_one_result()
        tva = False
        for serialized_reports in self.get_serialized_report_data():
            with self.assertNumQueries(0):
                self.assertEqual(list(serialized_reports.keys()), [indicator.pk])
                serialized_data = serialized_reports[indicator.pk]
                self.assertEqual(serialized_data['pk'], indicator.pk)
                self.assertEqual(serialized_data['level_id'], indicator.level_id)
                lop_data = serialized_data['lop_period']
                self.assertEqual(lop_data['target'], 1500)
                self.assertEqual(lop_data['actual'], 100)
                self.assertEqual(lop_data['met'], decimal.Decimal('0.0667'))
                periods = serialized_data['periods']
                self.assertEqual(len(periods), 2)
                self.assertEqual(periods[0]['actual'], 100)
                if tva:
                    self.assertEqual(periods[0]['target'], 750)
                    self.assertEqual(periods[0]['met'], decimal.Decimal('0.1333'))
                self.assertEqual(periods[1]['actual'], None)
                if tva:
                    self.assertEqual(periods[1]['target'], 750)
                    self.assertEqual(periods[1]['met'], None)
            tva = True

    def test_indicators_with_multiple_results(self):
        indicators = self.i_gen.indicators_with_results_different_uoms()
        percentage_pks = []
        cumulative_pks = []
        non_cumulative_pks = []
        for indicator in indicators:
            if indicator.unit_of_measure_type == Indicator.PERCENTAGE:
                percentage_pks.append(indicator.pk)
            elif indicator.is_cumulative:
                cumulative_pks.append(indicator.pk)
            else:
                non_cumulative_pks.append(indicator.pk)
        def universal_asserts(report, pk):
            report_data = report[pk]
            self.assertEqual(report_data['pk'], pk)
            lop_data = report_data['lop_period']
            periods = report_data['periods']
            self.assertEqual(len(periods), 2)
            return lop_data, periods
        tva = False
        for report in self.get_serialized_report_data():
            with self.assertNumQueries(0):
                self.assertEqual(len(report.keys()), 12)
                for pk in percentage_pks:
                    lop_data, periods = universal_asserts(report, pk)
                    self.assertEqual(lop_data['target'], 600)
                    self.assertEqual(lop_data['actual'], 80)
                    self.assertEqual(lop_data['met'], decimal.Decimal('0.1333'))
                    self.assertEqual(periods[0]['actual'], 50)
                    if tva:
                        self.assertEqual(periods[0]['target'], 600)
                        self.assertEqual(periods[0]['met'], decimal.Decimal('0.0833'))
                    self.assertEqual(periods[1]['actual'], 80)
                    if tva:
                        self.assertEqual(periods[1]['target'], 600)
                        self.assertEqual(periods[1]['met'], decimal.Decimal('0.1333'))
                for pk in cumulative_pks:
                    lop_data, periods = universal_asserts(report, pk)
                    self.assertEqual(lop_data['target'], 600)
                    self.assertEqual(lop_data['actual'], 150)
                    self.assertEqual(lop_data['met'], decimal.Decimal('0.25'))
                    self.assertEqual(periods[0]['actual'], 70)
                    if tva:
                        self.assertEqual(periods[0]['target'], 600)
                        self.assertEqual(periods[0]['met'], decimal.Decimal('0.1167'))
                    self.assertEqual(periods[1]['actual'], 150)
                    if tva:
                        self.assertEqual(periods[1]['target'], 600)
                        self.assertDecimalEqual(periods[1]['met'], get_decimal('0.25', places=4))
                for pk in non_cumulative_pks:
                    lop_data, periods = universal_asserts(report, pk)
                    self.assertEqual(lop_data['target'], 1200)
                    self.assertEqual(lop_data['actual'], 150)
                    self.assertDecimalEqual(lop_data['met'], get_decimal('0.125', places=4))
                    self.assertEqual(periods[0]['actual'], 70)
                    if tva:
                        self.assertDecimalEqual(periods[0]['target'], get_decimal(600))
                        self.assertDecimalEqual(periods[0]['met'], get_decimal('0.1167', places=4))
                    self.assertDecimalEqual(periods[1]['actual'], get_decimal(80))
                    if tva:
                        self.assertDecimalEqual(periods[1]['target'], get_decimal(600))
                        self.assertDecimalEqual(periods[1]['met'], get_decimal('0.1333', places=4))
                tva = True

    def test_one_indicator_with_mismatched_lop_target_and_target_sum(self):
        indicators = list(self.i_gen.mismatched_lop_target_indicators())
        for report in self.get_serialized_report_data():
            with self.assertNumQueries(0):
                for indicator in indicators:
                    if indicator.unit_of_measure_type == Indicator.PERCENTAGE or indicator.is_cumulative:
                        self.assertDecimalEqual(report[indicator.pk]['lop_period']['target'], get_decimal(80))
                    else:
                        self.assertDecimalEqual(report[indicator.pk]['lop_period']['target'], get_decimal(160))

    def test_disaggregated_indicator(self):
        indicator = self.i_gen.disaggregated_result_indicator()
        label_pks = [l.pk for l in indicator.disaggregation.first().labels]
        for report in self.get_serialized_report_data():
            with self.assertNumQueries(0):
                report_data = report[indicator.pk]
                self.assertDecimalEqual(report_data['lop_period']['target'], get_decimal(140))
                self.assertDecimalEqual(report_data['lop_period']['actual'], get_decimal(100))
                for label_pk in label_pks:
                    self.assertDecimalEqual(report_data['lop_period']['disaggregations'][label_pk]['actual'], get_decimal(50))
                for period in report_data['periods']:
                    self.assertDecimalEqual(period['actual'], get_decimal(50))
                    for label_pk in label_pks:
                        self.assertDecimalEqual(period['disaggregations'][label_pk]['actual'], get_decimal(25))

    def test_multiple_disaggregated_indicators_mixed_uoms(self):
        indicators = list(self.i_gen.different_disaggregated_result_measurement_type_indicators())
        used_label_pks = [l.pk for l in self.i_gen.standard_disaggs[0].labels] +\
            [l.pk for l in self.i_gen.country_disaggs[0].labels]
        unused_label_pks = [l.pk for l in self.i_gen.standard_disaggs[1].labels]
        blank_label_pks = [l.pk for l in self.i_gen.country_disaggs[1].labels]
        percents = []
        cumulatives = []
        regulars = []
        for indicator in indicators:
            if indicator.unit_of_measure_type == Indicator.PERCENTAGE:
                percents.append(indicator.pk)
            elif indicator.is_cumulative:
                cumulatives.append(indicator.pk)
            else:
                regulars.append(indicator.pk)
        targets = [50, 100, 150, 200]
        actuals = [60, 105, 150, 195]

        def lop_asserts(report_data, lop_target, lop_actual):
            self.assertDecimalEqual(report_data['lop_period']['target'], get_decimal(lop_target))
            self.assertDecimalEqual(report_data['lop_period']['actual'], get_decimal(lop_actual))
            self.assertDecimalEqual(report_data['lop_period']['met'], get_decimal(lop_actual/lop_target, places=4))
            for label_pk in used_label_pks:
                self.assertDecimalEqual(
                    report_data['lop_period']['disaggregations'][label_pk]['actual'], get_decimal(lop_actual/2)
                )
            for label_pk in blank_label_pks:
                self.assertIsNone(report_data['lop_period']['disaggregations'][label_pk]['actual'])
            for label_pk in unused_label_pks:
                self.assertNotIn(label_pk, report_data['lop_period']['disaggregations'])

        def period_asserts(period, target, actual, check_tva):
            if check_tva:
                self.assertDecimalEqual(period['target'], get_decimal(target))
                self.assertDecimalEqual(period['met'], get_decimal(actual/target, places=4))
            self.assertDecimalEqual(period['actual'], get_decimal(actual))
            for label_pk in used_label_pks:
                self.assertDecimalEqual(period['disaggregations'][label_pk]['actual'], get_decimal(actual/2))
            for label_pk in blank_label_pks:
                self.assertIsNone(period['disaggregations'][label_pk]['actual'])
            for label_pk in unused_label_pks:
                self.assertNotIn(label_pk, period['disaggregations'])

        tva = False
        for report in self.get_serialized_report_data(frequency=Indicator.SEMI_ANNUAL):
            with self.assertNumQueries(0):
                for percent_pk in percents:
                    report_data = report[percent_pk]
                    lop_asserts(report_data, 200, 195)
                    for c, period in enumerate(report_data['periods']):
                        period_asserts(period, targets[c], actuals[c], tva)
                for cumulative_pk in cumulatives:
                    report_data = report[cumulative_pk]
                    lop_asserts(report_data, 200, 510)
                    for c, period in enumerate(report_data['periods']):
                        period_asserts(period, targets[c], sum(actuals[:c+1]), tva)
                for regular_pk in regulars:
                    report_data = report[regular_pk]
                    lop_asserts(report_data, 500, 510)
                    for c, period in enumerate(report_data['periods']):
                        period_asserts(period, targets[c], actuals[c], tva)
                tva = True

    def test_percentage_indicators_in_tp_report(self):
        results_list = list(self.i_gen.indicators_mixed_results(unit_of_measure_type=Indicator.PERCENTAGE))
        all_ones_label, one_off_label = [label.pk for label in self.i_gen.standard_disaggs[1].labels]
        report = self.get_serialized_report_data(frequency=Indicator.MONTHLY, tp_only=True)
        with self.assertNumQueries(0):
            for indicator, months in results_list:
                report_data = report[indicator.pk]
                non_empty_months = [m[-1] for m in months if len(m) > 0]
                if non_empty_months:
                    last_actual = get_decimal(non_empty_months[-1])
                    self.assertDecimalEqual(report_data['lop_period']['actual'], last_actual)
                    self.assertDecimalEqual(report_data['lop_period']['disaggregations'][all_ones_label]['actual'], get_decimal(1))
                    self.assertDecimalEqual(report_data['lop_period']['disaggregations'][one_off_label]['actual'], last_actual - 1)
                else:
                    self.assertIsNone(report_data['lop_period']['actual'])
                    self.assertIsNone(report_data['lop_period']['disaggregations'][all_ones_label]['actual'])
                    self.assertIsNone(report_data['lop_period']['disaggregations'][one_off_label]['actual'])
                for period, month_values in zip(report_data['periods'], months):
                    if month_values:
                        last_actual = get_decimal(month_values[-1])
                        self.assertDecimalEqual(period['actual'], last_actual)
                        self.assertDecimalEqual(period['disaggregations'][all_ones_label]['actual'], get_decimal(1))
                        self.assertDecimalEqual(period['disaggregations'][one_off_label]['actual'], last_actual - 1)
                    else:
                        self.assertIsNone(period['actual'])
                        self.assertIsNone(period['disaggregations'][all_ones_label]['actual'])
                        self.assertIsNone(period['disaggregations'][one_off_label]['actual'])

    def test_cumulative_indicators_in_tp_report(self):
        results_list = list(self.i_gen.indicators_mixed_results(is_cumulative=True))
        all_ones_label, one_off_label = [label.pk for label in self.i_gen.standard_disaggs[1].labels]
        report = self.get_serialized_report_data(frequency=Indicator.MONTHLY, tp_only=True)
        with self.assertNumQueries(0):
            for indicator, months in results_list:
                report_data = report[indicator.pk]
                month_sums = list(map(lambda m: get_decimal(sum(m) if m else 0), months))
                if any(months):
                    months_with_values = get_decimal(sum(len(m) for m in months if m))
                    self.assertDecimalEqual(report_data['lop_period']['actual'], sum(month_sums))
                    self.assertDecimalEqual(report_data['lop_period']['disaggregations'][all_ones_label]['actual'], months_with_values)
                    self.assertDecimalEqual(report_data['lop_period']['disaggregations'][one_off_label]['actual'], get_decimal(sum(month_sums)-months_with_values))
                else:
                    self.assertIsNone(report_data['lop_period']['actual'])
                    self.assertIsNone(report_data['lop_period']['disaggregations'][all_ones_label]['actual'])
                    self.assertIsNone(report_data['lop_period']['disaggregations'][one_off_label]['actual'])
                for c, period in enumerate(report_data['periods']):
                    if months[c]:
                        month_sum = get_decimal(sum(month_sums[:c+1]))
                        months_with_values = get_decimal(sum(len(m) for m in months[:c+1]))
                        self.assertDecimalEqual(period['actual'], month_sum)
                        self.assertDecimalEqual(period['disaggregations'][all_ones_label]['actual'], months_with_values)
                        self.assertDecimalEqual(period['disaggregations'][one_off_label]['actual'], month_sum - months_with_values)
                    else:
                        self.assertIsNone(period['actual'])
                        self.assertIsNone(period['disaggregations'][all_ones_label]['actual'])
                        self.assertIsNone(period['disaggregations'][one_off_label]['actual'])

    def test_non_cumulative_indicators_in_tp_report(self):
        results_list = list(self.i_gen.indicators_mixed_results())
        all_ones_label, one_off_label = [label.pk for label in self.i_gen.standard_disaggs[1].labels]
        report = self.get_serialized_report_data(frequency=Indicator.MONTHLY, tp_only=True)
        with self.assertNumQueries(0):
            for indicator, months in results_list:
                report_data = report[indicator.pk]
                month_sums = list(map(lambda m: get_decimal(sum(m) if m else 0), months))
                if any(months):
                    months_with_values = get_decimal(sum(len(m) for m in months))
                    self.assertDecimalEqual(report_data['lop_period']['actual'], sum(month_sums))
                    self.assertDecimalEqual(report_data['lop_period']['disaggregations'][all_ones_label]['actual'], months_with_values)
                    self.assertDecimalEqual(report_data['lop_period']['disaggregations'][one_off_label]['actual'], sum(month_sums)-months_with_values)
                else:
                    self.assertIsNone(report_data['lop_period']['actual'])
                    self.assertIsNone(report_data['lop_period']['disaggregations'][all_ones_label]['actual'])
                    self.assertIsNone(report_data['lop_period']['disaggregations'][one_off_label]['actual'])
                for period, month, month_sum in zip(report_data['periods'], months, month_sums):
                    if month:
                        self.assertDecimalEqual(period['actual'], month_sum)
                        self.assertDecimalEqual(period['disaggregations'][all_ones_label]['actual'], get_decimal(len(month)))
                        self.assertDecimalEqual(period['disaggregations'][one_off_label]['actual'], month_sum - len(month))
                    else:
                        self.assertIsNone(period['actual'])
                        self.assertIsNone(period['disaggregations'][all_ones_label]['actual'])
                        self.assertIsNone(period['disaggregations'][one_off_label]['actual'])

    def test_loads_only_frequency_indicators_in_tva_report(self):
        frequency_indicators = {
            freq: [] for freq in range(1, 8)
        }
        for indicator in self.i_gen.all_frequencies_indicators(event=False):
            frequency_indicators[indicator.target_frequency].append(indicator.pk)
        for frequency, indicator_pks in frequency_indicators.items():
            report = self.get_serialized_report_data(frequency=frequency, tva_only=True)
            with self.assertNumQueries(0):
                self.assertCountEqual(report.keys(), indicator_pks)

    def test_loads_only_sites_indicators(self):
        indicators = self.i_gen.sites_indicators(target_frequency=Indicator.ANNUAL, targets=1000)
        expected_pks = []
        no_filters = []
        for indicator in indicators:
            no_filters.append(indicator.pk)
            if any([s.pk == self.i_gen.sites[0].pk for r in indicator.result_set.all() for s in r.site.all()]):
                expected_pks.append(indicator.pk)
        for c, report in enumerate(self.get_serialized_report_data(filters={'sites': [self.i_gen.sites[0].pk]})):
            with self.assertNumQueries(0):
                if c == 2:
                    # Full TVA report, no filters
                    self.assertCountEqual(report.keys(), no_filters)
                else:
                    self.assertCountEqual(report.keys(), expected_pks)

    def test_filters_indicators(self):
        expected_sectors = []
        expected_indicator_types = []
        expected_standard_disaggs = []
        expected_country_disaggs = []
        indicators = self.i_gen.all_filters_indicators(target_frequency=Indicator.ANNUAL, targets=1200, results=True)
        no_filters = []
        pk_filters = []
        standard_label_pks = [l.pk for l in self.i_gen.standard_disaggs[0].labels]
        country_label_pks = [l.pk for l in self.i_gen.country_disaggs[0].labels]
        for c, indicator in enumerate(indicators):
            no_filters.append(indicator.pk)
            if c < 3:
                pk_filters.append(indicator.pk)
            if indicator.sector and indicator.sector.pk == self.i_gen.sectors[0].pk:
                expected_sectors.append(indicator.pk)
            if any(it.pk == self.i_gen.indicator_types[0].pk for it in indicator.indicator_type.all()):
                expected_indicator_types.append(indicator.pk)
            if any(d.pk == self.i_gen.standard_disaggs[0].pk for d in indicator.disaggregation.all()):
                expected_standard_disaggs.append(indicator.pk)
            if any(d.pk == self.i_gen.country_disaggs[0].pk for d in indicator.disaggregation.all()):
                expected_country_disaggs.append(indicator.pk)
        for report in self.get_serialized_report_data(filters={'sectors': [self.i_gen.sectors[0].pk]}, no_tva_full=True):
            with self.assertNumQueries(0):
                self.assertCountEqual(report.keys(), expected_sectors)
        for report in self.get_serialized_report_data(filters={'disaggregations': [self.i_gen.standard_disaggs[0].pk]}, no_tva_full=True):
            with self.assertNumQueries(0):
                self.assertCountEqual(report.keys(), expected_standard_disaggs)
                for indicator_report in report.values():
                    self.assertCountEqual(
                        indicator_report['lop_period']['disaggregations'].keys(),
                        standard_label_pks
                    )
        for report in self.get_serialized_report_data(filters={'disaggregations': [self.i_gen.country_disaggs[0].pk]}, no_tva_full=True):
            with self.assertNumQueries(0):
                self.assertCountEqual(report.keys(), expected_country_disaggs)
        for report in self.get_serialized_report_data(filters={'types': [self.i_gen.indicator_types[0].pk]}, no_tva_full=True):
            with self.assertNumQueries(0):
                self.assertCountEqual(report.keys(), expected_indicator_types)
        for report in self.get_serialized_report_data(
            filters={
                'types': [self.i_gen.indicator_types[0].pk],
                'disaggregations': [self.i_gen.country_disaggs[0].pk, self.i_gen.standard_disaggs[0].pk],
                'sectors': [self.i_gen.sectors[0].pk]
            }, no_tva_full=True):
            with self.assertNumQueries(0):
                self.assertCountEqual(
                    report.keys(),
                    list(set(expected_indicator_types) & set(expected_standard_disaggs + expected_country_disaggs) & set(expected_sectors))
                )
        for report in self.get_serialized_report_data(filters={'indicators': pk_filters}, no_tva_full=True):
            with self.assertNumQueries(0):
                self.assertCountEqual(report.keys(), pk_filters)

    def test_start_and_end_period_filters(self):
        indicator_pks = {}
        for indicator in self.i_gen.two_results_per_semi_annual_indicators():
            if indicator.unit_of_measure_type == Indicator.PERCENTAGE:
                indicator_pks['percent'] = indicator.pk
            elif indicator.is_cumulative:
                indicator_pks['cumulative'] = indicator.pk
            else:
                indicator_pks['noncumulative'] = indicator.pk
            
        def lop_asserts(report_pk, lop_period):
            noncumulative = report_pk == indicator_pks['noncumulative']
            cumulative = report_pk == indicator_pks['cumulative']
            percent = report_pk == indicator_pks['percent']
            assert noncumulative or cumulative or percent
            self.assertDecimalEqual(lop_period['target'], get_decimal(500 if noncumulative else 200))
            self.assertDecimalEqual(lop_period['actual'], get_decimal(205.15 if percent else 1000.6))
            self.assertDecimalEqual(
                lop_period['met'], get_decimal((2.0012 if noncumulative else 5.003 if cumulative else 1.0258), places=4)
            )
            return 0 if noncumulative else 1 if cumulative else 2
            
        tva = False
        below_five_label = self.i_gen.standard_disaggs[0].labels[0].pk
        empty_label = self.i_gen.standard_disaggs[0].labels[1].pk
        on_target_label = self.i_gen.country_disaggs[0].labels[0].pk
        decimal_value_label = self.i_gen.country_disaggs[0].labels[1].pk
        for report in self.get_serialized_report_data(
            frequency=Indicator.SEMI_ANNUAL, filters={'start': 2}, no_tva_full=True
        ):
            with self.assertNumQueries(0):
                self.assertCountEqual(report.keys(), indicator_pks.values())
                for report_pk, report_data in report.items():
                    period_counter = lop_asserts(report_pk, report_data['lop_period'])
                    self.assertEqual(len(report_data['periods']), 2)
                    for (c, period), target, actuals, mets in zip(
                        enumerate(report_data['periods']), [150, 200],
                        [(300.15, 600.45, 155.15), (400.15, 1000.6, 205.15)],
                        [(2.001, 4.003, 1.0343), (2.0008, 5.003, 1.0258)]
                        ):
                        self.assertDecimalEqual(period['actual'], get_decimal(actuals[period_counter]))
                        self.assertEqual(period['count'], c+2)
                        if tva:
                            self.assertDecimalEqual(period['target'], get_decimal(target))
                            self.assertDecimalEqual(period['met'], get_decimal(mets[period_counter], places=4))
                        self.assertCountEqual(period['disaggregations'].keys(), [below_five_label, empty_label, on_target_label, decimal_value_label])
                        self.assertIsNone(period['disaggregations'][empty_label]['actual'])
                        period_count = 3 if target == 150 else 4
                        disagg_actual = target
                        if period_counter == 1:
                            disagg_actual += (150 if target == 150 else 300)
                        self.assertDecimalEqual(period['disaggregations'][on_target_label]['actual'], get_decimal(disagg_actual))
                        disagg_actual -= (5 if period_counter != 1 else 5*period_count)
                        self.assertDecimalEqual(period['disaggregations'][below_five_label]['actual'], get_decimal(disagg_actual))
                        self.assertDecimalEqual(period['disaggregations'][decimal_value_label]['actual'],
                                                get_decimal(5.15 if period_counter != 1 else 5.15*period_count))
            tva = True
        tva = False
        for report in self.get_serialized_report_data(
            frequency=Indicator.SEMI_ANNUAL, filters={'end': 0}, no_tva_full=True
        ):
            with self.assertNumQueries(0):
                self.assertCountEqual(report.keys(), indicator_pks.values())
                for report_pk, report_data in report.items():
                    period_counter = lop_asserts(report_pk, report_data['lop_period'])
                    self.assertEqual(len(report_data['periods']), 1)
                    period_actual = [100.15, 100.15, 55.15][period_counter]
                    period_met = [2.003, 2.003, 1.103][period_counter]
                    period_data = report_data['periods'][0]
                    self.assertDecimalEqual(period_data['actual'], get_decimal(period_actual))
                    if tva:
                        self.assertDecimalEqual(period_data['target'], get_decimal(50))
                        self.assertDecimalEqual(period_data['met'], get_decimal(period_met, places=4))
                    self.assertCountEqual(period_data['disaggregations'].keys(), [below_five_label, empty_label, on_target_label, decimal_value_label])
                    self.assertIsNone(period_data['disaggregations'][empty_label]['actual'])
                    self.assertDecimalEqual(period_data['disaggregations'][below_five_label]['actual'], get_decimal(45))
                    self.assertDecimalEqual(period_data['disaggregations'][on_target_label]['actual'], get_decimal(50))
                    self.assertDecimalEqual(period_data['disaggregations'][decimal_value_label]['actual'], get_decimal(5.15))
            tva = True
        tva = False
        for report in self.get_serialized_report_data(
            frequency=Indicator.SEMI_ANNUAL, filters={'start': 1, 'end': 1}, no_tva_full=True
        ):
            with self.assertNumQueries(0):
                self.assertCountEqual(
                    report.keys(),
                    indicator_pks.values()
                )
                for report_pk, report_data in report.items():
                    period_counter = lop_asserts(report_pk, report_data['lop_period'])
                    self.assertEqual(len(report_data['periods']), 1)
                    period_data = report_data['periods'][0]
                    self.assertDecimalEqual(period_data['actual'], get_decimal([200.15, 300.3, 105.15][period_counter]))
                    if tva:
                        self.assertDecimalEqual(period_data['target'], get_decimal(100))
                        self.assertDecimalEqual(period_data['met'], get_decimal([2.0015, 3.003, 1.0515][period_counter], places=4))
                    self.assertCountEqual(period_data['disaggregations'].keys(), [below_five_label, empty_label, on_target_label, decimal_value_label])
                    self.assertIsNone(period_data['disaggregations'][empty_label]['actual'])
                    self.assertDecimalEqual(period_data['disaggregations'][below_five_label]['actual'], get_decimal([95, 140, 95][period_counter]))
                    self.assertDecimalEqual(period_data['disaggregations'][on_target_label]['actual'], get_decimal([100, 150, 100][period_counter]))
                    self.assertDecimalEqual(period_data['disaggregations'][decimal_value_label]['actual'], get_decimal([5.15, 10.3, 5.15][period_counter]))
            tva = True

    def test_contexts(self):
        indicators = list(self.i_gen.different_disaggregated_result_measurement_type_indicators())
        program_pk = self.i_gen.program.pk
        frequency = Indicator.SEMI_ANNUAL
        filters = {}
        context_query_count = REPORT_CONTEXT_QUERIES + RESULTS_CONTEXT_QUERIES
        with self.assertNumQueries(context_query_count):
            context = self.get_context(program_pk=program_pk, frequency=frequency, filters=filters)
        base_context = IPTTTPReportSerializer._get_base_context(program_pk)
        program_data = IPTTTPReportSerializer.load_program_data(program_pk, program_context=base_context).data
        tp_contexts = IPTTTPReportSerializer._report_data_context(
            [frequency], program_data
        )
        self.assertIn(Indicator.SEMI_ANNUAL, tp_contexts)
        tp_context = tp_contexts[Indicator.SEMI_ANNUAL]
        keys = ['frequency', 'periods', 'results', 'targets']
        for key in keys:
            self.assertIn(key, tp_context)
            self.assertEqual(context[key], tp_context[key])
        expected_report_data = self.get_serialized_report_data(frequency=Indicator.SEMI_ANNUAL)
        tp_report = IPTTTPReportSerializer.get_context(program_pk, [frequency], filters=filters)
        self.assertIn('report_data', tp_report)
        self.assertIn(Indicator.SEMI_ANNUAL, tp_report['report_data'])
        tp_report_data = tp_report['report_data'][Indicator.SEMI_ANNUAL]
        self.assertCountEqual(expected_report_data[0].keys(), tp_report_data.keys())
        tva_report = IPTTTVAReportSerializer.get_context(program_pk, [frequency], filters=filters)
        self.assertIn('report_data', tva_report)
        self.assertIn(Indicator.SEMI_ANNUAL, tva_report['report_data'])
        tva_report_data = tva_report['report_data'][Indicator.SEMI_ANNUAL]
        self.assertCountEqual(expected_report_data[1].keys(), tva_report_data.keys())

    def test_lop_only_indicator(self):
        indicator = self.i_gen.lop_only_indicator_with_results()
        indicator_pk = indicator.pk
        tva_report = self.get_serialized_report_data(frequency=Indicator.LOP, tva_only=True)
        with self.assertNumQueries(0):
            self.assertIn(indicator_pk, tva_report)