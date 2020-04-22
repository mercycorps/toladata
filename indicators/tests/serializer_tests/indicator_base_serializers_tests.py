# -*- coding: utf-8 -*-
""" Tests for the base indicator serializer - corresponding to js/models/indicator/baseIndicator"""

import operator
from factories.indicators_models import RFIndicatorFactory, LevelFactory
from factories.workflow_models import RFProgramFactory
from workflow.models import Program
from indicators.models import Indicator
from indicators.serializers_new import (
    IndicatorBaseSerializer,
    IndicatorRFOrderingSerializer,
    IndicatorWithMeasurementSerializer,
    TierBaseSerializer,
    LevelBaseSerializer,
)
from tola.test.utils import SPECIAL_CHARS

from django import test
from django.db import models
from django.utils import translation

QUERY_COUNT = 1

class TestIndicatorBaseSerializer(test.TestCase):
    def get_indicator_data(self, **kwargs):
        return IndicatorBaseSerializer(Indicator.rf_aware_objects.filter(pk=RFIndicatorFactory(**kwargs).pk), many=True).data[0]

    def test_pk(self):
        data = self.get_indicator_data(pk=143, program=RFProgramFactory())
        self.assertEqual(data['pk'], 143)

    def test_name(self):
        p = RFProgramFactory()
        for name in ['normal name', u'Spécîal Characters', 'asdfg'*99]:
            data = self.get_indicator_data(program=p, name=name)
            self.assertEqual(data['name'], name)

    def test_good_level_pk(self):
        p = RFProgramFactory(tiers=["Tier1", "Tier2"], levels=1, levels__1={'id': 901})
        data = self.get_indicator_data(program=p, level=p.levels.filter(pk=901).first())
        self.assertEqual(data['level_pk'], 901)

    def test_non_rf_level_pk(self):
        data = self.get_indicator_data(program=RFProgramFactory(migrated=False), old_level="Activity")
        self.assertEqual(data['old_level_name'], "Activity")
        self.assertEqual(data['level_pk'], 6)

    def test_non_rf_level_with_level_assigned(self):
        p = RFProgramFactory(migrated=False)
        data = self.get_indicator_data(program=p, level=LevelFactory(program=p, pk=5), old_level="Outcome")
        self.assertEqual(data['old_level_name'], "Outcome")
        self.assertEqual(data['level_pk'], 3)

    def test_translated_old_level(self):
        translation.activate('fr')
        data = self.get_indicator_data(program=RFProgramFactory(migrated=False), old_level="Outcome")
        self.assertEqual(data['old_level_name'], u"Résultat")
        translation.activate('en')

    def test_no_level_pk(self):
        p = RFProgramFactory(tiers=["Tier1", "Tier2"], levels=1, levels__1={'id': 901})
        data = self.get_indicator_data(program=p)
        self.assertEqual(data['level_pk'], None)

    def test_old_level_in_rf_with_level_id(self):
        p = RFProgramFactory(tiers=["Tier1", "Tier2"], levels=1, levels__1={'id': 49})
        data = self.get_indicator_data(program=p, old_level="Output", level=p.levels.filter(pk=49).first())
        self.assertEqual(data['level_pk'], 49)
        self.assertEqual(data['old_level_name'], None)

    def test_old_level_in_rf_no_level_id(self):
        p = RFProgramFactory(tiers=["Tier1", "Tier2"], levels=1, levels__1={'id': 901})
        data = self.get_indicator_data(program=p, old_level="Output")
        self.assertEqual(data['level_pk'], None)
        self.assertEqual(data['old_level_name'], None)

    def test_means_of_verification(self):
        p = RFProgramFactory()
        for means in ["test means", "long "*50, u"Spécîa¬l character means"]:
            data = self.get_indicator_data(program=p, means_of_verification=means)
            self.assertEqual(data['means_of_verification'], means)


class TestIndicatorBaseSerializerQueryCounts(test.TestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.program = RFProgramFactory(tiers=["Tier1", "Tier2"], levels=1, levels__1={'id': 901})
        cls.indicators = [
            RFIndicatorFactory(
                program=cls.program, level_id=901, name=f'{SPECIAL_CHARS}1',
                means_of_verification=f'{SPECIAL_CHARS} means'),
            RFIndicatorFactory(
                program=cls.program, level_id=None, name='no_level_id', means_of_verification=None,
                old_level="Output"
            )
        ]

    def indicator_asserts_one(self, serialized_indicator):
        self.assertEqual(serialized_indicator['pk'], self.indicators[0].pk)
        self.assertEqual(serialized_indicator['name'], f'{SPECIAL_CHARS}1')
        self.assertEqual(serialized_indicator['level_pk'], 901)
        self.assertEqual(serialized_indicator['old_level_name'], None)
        self.assertEqual(serialized_indicator['means_of_verification'], f'{SPECIAL_CHARS} means')
        return True

    def indicator_asserts_two(self, serialized_indicator):
        self.assertEqual(serialized_indicator['pk'], self.indicators[1].pk)
        self.assertEqual(serialized_indicator['name'], 'no_level_id')
        self.assertEqual(serialized_indicator['level_pk'], None)
        self.assertEqual(serialized_indicator['old_level_name'], None)
        self.assertEqual(serialized_indicator['means_of_verification'], None)
        return True

    def indicator_asserts(self, serialized_indicator_data):
        self.assertEqual(len(serialized_indicator_data), 2)
        self.assertTrue(self.indicator_asserts_one(serialized_indicator_data[0]))
        self.assertTrue(self.indicator_asserts_two(serialized_indicator_data[1]))
        return True

    def test_query_count_load_for_program(self):
        with self.assertNumQueries(QUERY_COUNT):
            serialized_indicator_data = IndicatorBaseSerializer.load_for_program(self.program.pk).data
        with self.assertNumQueries(0):
            self.assertTrue(self.indicator_asserts(serialized_indicator_data))

    def test_query_count_load_for_prefetch(self):
        # +1 query to get program information:
        with self.assertNumQueries(QUERY_COUNT+1):
            program = Program.rf_aware_objects.select_related(None).prefetch_related(
                models.Prefetch(
                    'indicator_set',
                    queryset=IndicatorBaseSerializer.get_queryset(),
                    to_attr='prefetch_indicators_test'
                )
            ).get(pk=self.program.pk)
            serialized_indicator_data = IndicatorBaseSerializer(program.prefetch_indicators_test, many=True).data
        with self.assertNumQueries(0):
            self.assertTrue(self.indicator_asserts(serialized_indicator_data))

    def test_query_count_load_for_filtered_prefetch(self):
        # +1 query to get program information:
        with self.assertNumQueries(QUERY_COUNT+1):
            program = Program.rf_aware_objects.select_related(None).prefetch_related(
                models.Prefetch(
                    'indicator_set',
                    queryset=IndicatorBaseSerializer.get_queryset(filters={'level_id__isnull': False}),
                    to_attr='prefetch_indicators_test'
                )
            ).get(pk=self.program.pk)
            serialized_indicator_data = IndicatorBaseSerializer(program.prefetch_indicators_test, many=True).data
        with self.assertNumQueries(0):
            self.assertEqual(len(serialized_indicator_data), 1)
            self.assertTrue(self.indicator_asserts_one(serialized_indicator_data[0]))


class TestIndicatorRFOrderingSerializer(test.TestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.rf_program = RFProgramFactory(
            tiers=['Tier 1', 'Tier 2'], levels=[(1,), ((1,),)], levels__pks=[95, 96])
        cls.levels = sorted(list(cls.rf_program.levels.all()), key=lambda l: l.pk)
        cls.rf_indicators = [
            RFIndicatorFactory(program=cls.rf_program, level=cls.levels[1], pk=496),
            RFIndicatorFactory(program=cls.rf_program, level=cls.levels[0], pk=497),
            RFIndicatorFactory(program=cls.rf_program, level=cls.levels[0], pk=495, old_level='Activity'),
        ]
        cls.non_rf_program = RFProgramFactory(migrated=False)
        cls.non_rf_indicators = [RFIndicatorFactory(
            program=cls.non_rf_program, pk=1000+c, number=number, old_level='Activity'
            ) for c, number in enumerate(['1.5', '1.2', '3.4.5'])] + [
                RFIndicatorFactory(program=cls.non_rf_program, pk=1100, number='1.1', old_level='Outcome'),
                RFIndicatorFactory(program=cls.non_rf_program, pk=1101, number='422', old_level='Outcome'),
            ]

    def test_rf_indicator_data(self):
        level_orders = [1, 0, 0]
        level_ids = [95, 96, 95]
        with self.assertNumQueries(QUERY_COUNT):
            serialized_data = IndicatorRFOrderingSerializer.load_for_program(self.rf_program.pk).data
        with self.assertNumQueries(0):
            self.assertEqual(len(serialized_data), 3)
            serialized_data = sorted(serialized_data, key=operator.itemgetter('pk'))
            for c, serialized_indicator in enumerate(serialized_data):
                self.assertTrue(serialized_indicator['results_framework'])
                self.assertEqual(serialized_indicator['level_pk'], level_ids[c])
                self.assertEqual(serialized_indicator['level_order'], level_orders[c])


    def test_non_rf_indicator_data(self):
        sort_numbers = [3, 2, 4, 0, 1]
        old_level_pks = [6, 6, 6, 3, 3]
        with self.assertNumQueries(QUERY_COUNT):
            serialized_data = IndicatorRFOrderingSerializer.load_for_program(self.non_rf_program.pk).data
        with self.assertNumQueries(0):
            self.assertEqual(len(serialized_data), 5)
            serialized_data = sorted(serialized_data, key=operator.itemgetter('pk'))
            for c, serialized_indicator in enumerate(serialized_data):
                self.assertFalse(serialized_indicator['results_framework'])
                self.assertEqual(serialized_indicator['level_pk'], old_level_pks[c])
                self.assertEqual(serialized_indicator['level_order'], sort_numbers[c])


class TestIndicatorWithMeasurementSerializer(test.TestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.program = RFProgramFactory(tiers=['Tier 1', 'Tier 2'], levels=1)
        context = {
            'program_pk': cls.program.pk,
            'tiers': TierBaseSerializer.load_for_program(cls.program.pk)
        }
        context['levels'] = LevelBaseSerializer.load_for_program(cls.program.pk)
        cls.context = context

    def tearDown(self):
        self.program.indicator_set.all().delete()

    def get_serialized_data(self):
        context = self.context.copy()
        return IndicatorWithMeasurementSerializer.load_for_program(self.program.pk, context=context).data

    def get_indicator_data(self, **kwargs):
        indicator_pk = RFIndicatorFactory(program=self.program, **kwargs).pk
        with self.assertNumQueries(QUERY_COUNT):
            data = {s_i['pk']: s_i for s_i in self.get_serialized_data()}
            return data[indicator_pk]

    def test_unit_of_measure(self):
        for uom in ["Test uom", None, "Long "*26, u"Spécîal Chars"]:
            data = self.get_indicator_data(unit_of_measure=uom)
            self.assertEqual(data['unit_of_measure'], uom)

    def test_is_percent(self):
        data = self.get_indicator_data(unit_of_measure_type=Indicator.NUMBER)
        self.assertEqual(data['is_percent'], False)
        data2 = self.get_indicator_data(unit_of_measure_type=Indicator.PERCENTAGE)
        self.assertEqual(data2['is_percent'], True)

    def test_is_cumulative(self):
        data = self.get_indicator_data(is_cumulative=False)
        self.assertEqual(data['is_cumulative'], False)
        data2 = self.get_indicator_data(is_cumulative=True)
        self.assertEqual(data2['is_cumulative'], True)
        data3 = self.get_indicator_data(is_cumulative=None)
        self.assertEqual(data3['is_cumulative'], None)

    def test_direction_of_change(self):
        data = self.get_indicator_data(direction_of_change=Indicator.DIRECTION_OF_CHANGE_NONE)
        self.assertEqual(data['direction_of_change'], None)
        data2 = self.get_indicator_data(direction_of_change=None)
        self.assertEqual(data2['direction_of_change'], None)
        data3 = self.get_indicator_data(direction_of_change=Indicator.DIRECTION_OF_CHANGE_POSITIVE)
        self.assertEqual(data3['direction_of_change'], "+")
        data4 = self.get_indicator_data(direction_of_change=Indicator.DIRECTION_OF_CHANGE_NEGATIVE)
        self.assertEqual(data4['direction_of_change'], "-")

    def test_baseline(self):
        for baseline, na, result in [
                (None, True, None), ("100", True, None), ("500", False, "500"), ("50%", False, "50%")
            ]:
            data = self.get_indicator_data(baseline=baseline, baseline_na=na)
            self.assertEqual(data['baseline'], result)
