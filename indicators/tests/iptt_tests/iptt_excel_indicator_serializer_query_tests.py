from django import test
from django.db import models
from indicators.models import (
    Indicator,
    IndicatorType,
    Result,
    DisaggregationType,
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

CONTEXT_QUERIES = 3

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

    def get_context(self):
        with self.assertNumQueries(CONTEXT_QUERIES):
            context = {
                'levels': list(Level.objects.select_related(None).only(
                    'pk', 'name', 'parent_id', 'customsort', 'program_id'
                ).filter(program_id=self.program.pk)),
                'tiers': list(LevelTier.objects.select_related(None).only(
                    'pk', 'name', 'program_id', 'tier_depth'
                ).filter(program_id=self.program.pk)),
                'disaggregations': list(DisaggregationType.objects.select_related(None).prefetch_related(None).filter(
                    indicator__program_id=self.program.pk
                ).order_by('disaggregation_type').values(
                    'pk', 'disaggregation_type', 'indicator__pk', 'standard', 'country__country'
                )),
            }
        return context

    def get_serialized_indicator_data(self):
        context = self.get_context()
        filters = {'program': self.program.pk}
        with self.assertNumQueries(TP_QUERIES):
            tp = IPTTTPReportSerializer.load_indicator_data(
                indicator_context=context, indicator_filters=filters
            ).data
        with self.assertNumQueries(TVA_QUERIES):
            tva = IPTTTVAReportSerializer.load_indicator_data(
                indicator_context=context, indicator_filters=filters
            ).data
        with self.assertNumQueries(FULL_QUERIES):
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
        
        