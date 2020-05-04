# -*- coding: utf-8 -*-
"""Tests for the Program Serializer providing Program-wide ordering by level and chain

    corresponding to js/models/program/ProgramLevelOrdering"""

from workflow.serializers_new.base_program_serializers import (
    ProgramBaseSerializerMixin,
    ProgramRFOrderingMixin,
)
from workflow.models import Program
from factories.workflow_models import RFProgramFactory
from factories.indicators_models import RFIndicatorFactory, LevelFactory
from tola.model_utils import get_serializer
from django import test
from django.utils import translation


ORDERING_QUERY_COUNT = 4

# RF-aware ordering and base info serializer for testing:
ProgramRFOrderingProgramSerializer = get_serializer(
    ProgramRFOrderingMixin,
    ProgramBaseSerializerMixin
)

class TestProgramIndicatorOrderingProgramSerializer(test.TestCase):
    def get_serialized_data(self, program_pk):
        with self.assertNumQueries(ORDERING_QUERY_COUNT):
            return ProgramRFOrderingProgramSerializer.load_for_pk(program_pk).data

    def get_program_data(self, **kwargs):
        program = RFProgramFactory(**kwargs)
        return self.get_serialized_data(program.pk)        

    def test_program_no_indicators(self):
        data = self.get_program_data()
        self.assertEqual(data['indicator_pks_level_order'], [])
        self.assertEqual(data['indicator_pks_chain_order'], [])

    def test_program_migrated_one_indicator_per_level(self):
        p = RFProgramFactory(tiers=["Tier1", "Tier2", "Tier3"])
        l1 = LevelFactory(program=p, parent=None, customsort=0)
        l11 = LevelFactory(program=p, parent=l1, customsort=0)
        l111 = LevelFactory(program=p, parent=l11, customsort=0)
        l112 = LevelFactory(program=p, parent=l11, customsort=1)
        l12 = LevelFactory(program=p, parent=l1, customsort=1)
        l121 = LevelFactory(program=p, parent=l12, customsort=0)
        l122 = LevelFactory(program=p, parent=l12, customsort=1)
        i1 = RFIndicatorFactory(program=p, level=l1, level_order=0)
        i11 = RFIndicatorFactory(program=p, level=l11, level_order=0)
        i111 = RFIndicatorFactory(program=p, level=l111, level_order=0)
        i112 = RFIndicatorFactory(program=p, level=l112, level_order=0)
        i12 = RFIndicatorFactory(program=p, level=l12, level_order=0)
        i121 = RFIndicatorFactory(program=p, level=l121, level_order=0)
        i122 = RFIndicatorFactory(program=p, level=l122, level_order=0)
        data = self.get_serialized_data(p.pk)
        self.assertEqual(
            data['indicator_pks_level_order'],
            [i1.pk, i11.pk, i12.pk, i111.pk, i112.pk, i121.pk, i122.pk]
        )
        self.assertEqual(
            data['indicator_pks_chain_order'],
            [i1.pk, i11.pk, i111.pk, i112.pk, i12.pk, i121.pk, i122.pk]
        )

    def test_program_migrated_unassigned_indicators(self):
        p = RFProgramFactory(tiers=["Tier1", "Tier2", "Tier3"])
        l1 = LevelFactory(program=p, parent=None, customsort=0)
        LevelFactory(program=p, parent=l1, customsort=0)
        i1 = RFIndicatorFactory(program=p, level=None)
        i2 = RFIndicatorFactory(program=p, level=None)
        data = self.get_serialized_data(p.pk)
        self.assertIn(i1.pk, data['indicator_pks_level_order'])
        self.assertIn(i2.pk, data['indicator_pks_level_order'])
        self.assertIn(i1.pk, data['indicator_pks_chain_order'])
        self.assertIn(i2.pk, data['indicator_pks_chain_order'])

    def test_program_migrated_unassigned_indicators_old_level_order(self):
        p = RFProgramFactory(tiers=["Tier1", "Tier2", "Tier3"])
        l1 = LevelFactory(program=p, parent=None, customsort=0)
        l11 = LevelFactory(program=p, parent=l1, customsort=0)
        i1 = RFIndicatorFactory(program=p, level=None, old_level='Activity')
        i2 = RFIndicatorFactory(program=p, level=None, old_level='Outcome')
        i3 = RFIndicatorFactory(program=p, level=None, old_level='Output')
        i4 = RFIndicatorFactory(program=p, level=l11, old_level='Output')
        data = self.get_serialized_data(p.pk)
        self.assertEqual(
            data['indicator_pks_level_order'],
            [i4.pk, i2.pk, i3.pk, i1.pk]
        )
        self.assertEqual(
            data['indicator_pks_chain_order'],
            [i4.pk, i2.pk, i3.pk, i1.pk]
        )

    def test_program_unmigrated_indicators_old_level_order(self):
        p = RFProgramFactory(migrated=False)
        i1 = RFIndicatorFactory(program=p, old_level='Activity')
        i2 = RFIndicatorFactory(program=p, old_level='Outcome')
        i3 = RFIndicatorFactory(program=p, old_level='Output')
        data = self.get_serialized_data(p.pk)
        self.assertEqual(
            data['indicator_pks_level_order'],
            [i2.pk, i3.pk, i1.pk]
        )
        self.assertEqual(
            data['indicator_pks_chain_order'],
            [i2.pk, i3.pk, i1.pk]
        )

    def test_program_unmigrated_indicators_number_order(self):
        p = RFProgramFactory(migrated=False)
        for numbers in [
                ['1', '2', '3'], ['1.1.1', '1.1.1.1', '1.1.1.2', '1.1.2', '2', '2.1'],
                ['1001', '1003', '1101', '1111', '2231'], ['2.2.1', '2.2.1c', '2.2.1d', '2.2.2'],
                ['Outcome 1', 'Outcome 3.1', 'Outcome 4.2'], ['C1', 'C4', 'C9', 'PAH1', 'PAH4'],
            ]:
            pks = []
            for number in reversed(numbers):
                pks.append(RFIndicatorFactory(program=p, number=number).pk)
            data = self.get_serialized_data(p.pk)
            self.assertEqual(
                data['indicator_pks_level_order'],
                list(reversed(pks)), numbers
            )
            self.assertEqual(
                data['indicator_pks_chain_order'],
                list(reversed(pks))
            )
            p.indicator_set.all().delete()

    def test_program_unmigrated_indicators_old_level_new_level_and_number_order(self):
        translation.activate('fr')
        p = RFProgramFactory(migrated=False)
        l1 = LevelFactory(program=p, parent=None, customsort=0)
        l2 = LevelFactory(program=p, parent=l1, customsort=0)
        indicators = [
            RFIndicatorFactory(program=p, old_level=old_level, number=number, level=level)
            for old_level, number, level in reversed([
                ('Goal', '2', None), ('Outcome', '1', None), ('Outcome', '1.2', l1), ('Outcome', '1.3', None),
                ('Output', '1.1.1', l2), ('Output', '1.1.2', None), ('Activity', '1.1.2.1', l1)
            ])
        ]
        indicator_pks = [i.pk for i in indicators]
        data = self.get_serialized_data(p.pk)
        self.assertEqual(
            data['indicator_pks_level_order'],
            list(reversed(indicator_pks))
        )
        self.assertEqual(
            data['indicator_pks_chain_order'],
            list(reversed(indicator_pks))
        )
        translation.activate('en')


    def test_program_migrated_indicators_number_order(self):
        p = RFProgramFactory(tiers=["Tier1", "Tier2", "Tier3"])
        l1 = LevelFactory(program=p, parent=None, customsort=0)
        l11 = LevelFactory(program=p, parent=l1, customsort=0)
        numbers = ['8', '9', '10']
        pks = []
        for number in reversed(numbers):
            pks.append(RFIndicatorFactory(program=p, number=number).pk)
        i0 = RFIndicatorFactory(program=p, level=l11, number='1', level_order=0, pk=10)
        i1 = RFIndicatorFactory(program=p, level=l11, number='1012', level_order=1, pk=20)
        pks.append(i1.pk)
        pks.append(i0.pk)
        pks.append(RFIndicatorFactory(program=p, level=l1, number='1012,asdf', pk=40).pk)
        data = self.get_serialized_data(p.pk)
        self.assertEqual(
            data['indicator_pks_level_order'],
            list(reversed(pks))
        )
        self.assertEqual(
            data['indicator_pks_chain_order'],
            list(reversed(pks))
        )

class TestProgramIndicatorOrderingProgramSerializerQueryCounts(test.TestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        p = RFProgramFactory(name="LevelOrder Test", tiers=["Tier1", "Tier2", "Tier3"])
        l1 = LevelFactory(program=p, parent=None, customsort=0)
        l11 = LevelFactory(program=p, parent=l1, customsort=0)
        l111 = LevelFactory(program=p, parent=l11, customsort=0)
        l112 = LevelFactory(program=p, parent=l11, customsort=1)
        l12 = LevelFactory(program=p, parent=l1, customsort=1)
        l121 = LevelFactory(program=p, parent=l12, customsort=0)
        l122 = LevelFactory(program=p, parent=l12, customsort=1)
        i1 = RFIndicatorFactory(program=p, level=l1, level_order=0)
        i11 = RFIndicatorFactory(program=p, level=l11, level_order=0)
        i111 = RFIndicatorFactory(program=p, level=l111, level_order=0)
        i112 = RFIndicatorFactory(program=p, level=l112, level_order=0)
        i12 = RFIndicatorFactory(program=p, level=l12, level_order=0)
        i121 = RFIndicatorFactory(program=p, level=l121, level_order=0)
        i122 = RFIndicatorFactory(program=p, level=l122, level_order=0)
        cls.rf_program = p
        cls.rf_level_order = [i1.pk, i11.pk, i12.pk, i111.pk, i112.pk, i121.pk, i122.pk]
        cls.rf_chain_order = [i1.pk, i11.pk, i111.pk, i112.pk, i12.pk, i121.pk, i122.pk]
        p2 = RFProgramFactory(name="Unmigrated Test", migrated=False)
        i_2_1 = RFIndicatorFactory(program=p2, old_level='Activity')
        i_2_2 = RFIndicatorFactory(program=p2, old_level='Outcome')
        i_2_3 = RFIndicatorFactory(program=p2, old_level='Output')
        cls.non_rf_program = p2
        cls.non_rf_order = [i_2_2.pk, i_2_3.pk, i_2_1.pk]

    def test_rf_program_query_counts(self):
        with self.assertNumQueries(ORDERING_QUERY_COUNT):
            serialized_data = ProgramRFOrderingProgramSerializer.load_for_pk(self.rf_program.pk).data
        with self.assertNumQueries(0):
            self.assertEqual(serialized_data['name'], 'LevelOrder Test')
            self.assertEqual(serialized_data['indicator_pks_level_order'], self.rf_level_order)
            self.assertEqual(serialized_data['indicator_pks_chain_order'], self.rf_chain_order)

    def test_non_rf_program_query_counts(self):
        with self.assertNumQueries(ORDERING_QUERY_COUNT):
            serialized_data = ProgramRFOrderingProgramSerializer.load_for_pk(self.non_rf_program.pk).data
        with self.assertNumQueries(0):
            self.assertEqual(serialized_data['name'], 'Unmigrated Test')
            self.assertEqual(serialized_data['indicator_pks_level_order'], self.non_rf_order)
            self.assertEqual(serialized_data['indicator_pks_chain_order'], self.non_rf_order)


class TestProgramRFLevelOrderingProgramSerializer(test.TestCase):

    def get_serialized_data(self, program_pk):
        with self.assertNumQueries(ORDERING_QUERY_COUNT):
            return ProgramRFOrderingProgramSerializer.load_for_pk(program_pk).data

    def get_program_data(self, **kwargs):
        return self.get_serialized_data(RFProgramFactory(**kwargs).pk)

    def test_program_no_levels(self):
        data = self.get_program_data()
        with self.assertNumQueries(0):
            self.assertEqual(data['level_pks_level_order'], [])
            self.assertEqual(data['level_pks_chain_order'], [])
            self.assertEqual(data['indicator_pks_for_level'], [])
            self.assertEqual(data['unassigned_indicator_pks'], [])

    def test_program_one_level(self):
        program = RFProgramFactory(tiers=['Only Tier'])
        level = LevelFactory(program=program, parent=None)
        data = self.get_serialized_data(program.pk)
        self.assertEqual(data['level_pks_level_order'], [level.pk])
        self.assertEqual(data['level_pks_chain_order'], [level.pk])
        self.assertEqual(data['indicator_pks_for_level'], [{'pk': level.pk, 'indicator_pks': []}])
        self.assertEqual(data['unassigned_indicator_pks'], [])

    def test_program_mercycorps_tiers(self):
        program = RFProgramFactory(tiers=True)
        goal = LevelFactory(program=program, parent=None)
        output1 = LevelFactory(program=program, parent=goal)
        output2 = LevelFactory(program=program, parent=goal)
        impact11 = LevelFactory(program=program, parent=output1)
        impact12 = LevelFactory(program=program, parent=output1)
        impact21 = LevelFactory(program=program, parent=output2)
        data = self.get_serialized_data(program.pk)
        self.assertEqual(
            data['level_pks_level_order'],
            [goal.pk, output1.pk, output2.pk, impact11.pk,
             impact12.pk, impact21.pk]
            )
        self.assertEqual(
            data['level_pks_chain_order'],
            [goal.pk, output1.pk, impact11.pk,
             impact12.pk, output2.pk, impact21.pk]
            )
        self.assertEqual(
            sorted(data['indicator_pks_for_level'], key=lambda l: l['pk']),
            sorted([{'pk': level_pk, 'indicator_pks': []}
                    for level_pk in [
                        goal.pk, output1.pk, impact11.pk, impact12.pk, output2.pk, impact21.pk
                        ]], key=lambda l: l['pk']
                  )
            )
        self.assertEqual(data['unassigned_indicator_pks'], [])

    def test_program_one_level_with_indicators(self):
        program = RFProgramFactory(tiers=['Only Tier'])
        level = LevelFactory(program=program, parent=None)
        indicator_pks = [RFIndicatorFactory(program=program, level=level).pk for _ in range(3)]
        data = self.get_serialized_data(program.pk)
        self.assertEqual(data['indicator_pks_for_level'], [{'pk': level.pk, 'indicator_pks': indicator_pks}])
        self.assertEqual(data['unassigned_indicator_pks'], [])

    def test_program_one_level_with_unassigned_indicators(self):
        program = RFProgramFactory(tiers=['Only Tier'])
        level = LevelFactory(program=program, parent=None)
        indicator_pks = [RFIndicatorFactory(program=program, level=None, number=number).pk
                         for number in ['231', '14', '11']]
        data = self.get_serialized_data(program.pk)
        self.assertEqual(data['indicator_pks_for_level'], [{'pk': level.pk, 'indicator_pks':[]}])
        self.assertEqual(data['unassigned_indicator_pks'], indicator_pks[::-1])

    def test_program_three_levels_with_unassigned_indicators(self):
        program = RFProgramFactory(tiers=['Tier1', 'Tier2]'])
        goal = LevelFactory(program=program, parent=None)
        output = LevelFactory(program=program, parent=goal)
        output_indicator = RFIndicatorFactory(program=program, level=output)
        impact = LevelFactory(program=program, parent=output)
        impact_indicator1 = RFIndicatorFactory(program=program, level=impact, number='21', old_level='Activity')
        impact_indicator2 = RFIndicatorFactory(program=program, level=impact, number='11', old_level='Goal')
        for old_level, number, pk in [
                ('Activity', '2.1', 106),
                ('Impact', '1.4', 102),
                ('Impact', '1.2', 101),
                ('Output', '1.3', 103),
                ('Goal', '1', 104),
                ('Activity', '1.1.5', 105),
        ]:
            RFIndicatorFactory(program=program, level=None, old_level=old_level, number=number, pk=pk)
        data = self.get_serialized_data(program.pk)
        self.assertEqual(data['level_pks_level_order'], [goal.pk, output.pk, impact.pk])
        self.assertEqual(data['level_pks_chain_order'], [goal.pk, output.pk, impact.pk])
        self.assertEqual(
            sorted(data['indicator_pks_for_level'], key=lambda l: l['pk']),
            sorted([
                {'pk': goal.pk, 'indicator_pks': []},
                {'pk': output.pk, 'indicator_pks': [output_indicator.pk]},
                {'pk': impact.pk, 'indicator_pks': [impact_indicator1.pk, impact_indicator2.pk]},
            ], key=lambda l: l['pk']))
        self.assertEqual(data['unassigned_indicator_pks'], [104, 101, 102, 103, 105, 106])