# -*- coding: utf-8 -*-
"""Tests for the Program Serializer providing Level-based ordering by level and chain

    corresponding to js/models/program/RFLevelOrdering"""

from workflow.serializers_new import RFLevelOrderingProgramSerializer
from workflow.models import Program
from factories.workflow_models import RFProgramFactory
from factories.indicators_models import RFIndicatorFactory, LevelFactory
from django import test


def get_serialized_data(program_pk):
    return RFLevelOrderingProgramSerializer(
        Program.rf_aware_objects.filter(pk=program_pk), many=True
    ).data[0]


def get_program_data(**kwargs):
    return get_serialized_data(RFProgramFactory(**kwargs).pk)


class TestRFLevelOrderingProgramSerializer(test.TestCase):

    def test_program_no_levels(self):
        data = get_program_data()
        self.assertEqual(data['level_pks_level_order'], [])
        self.assertEqual(data['level_pks_chain_order'], [])
        self.assertEqual(data['indicator_pks_for_level'], [])
        self.assertEqual(data['unassigned_indicator_pks'], [])

    def test_program_one_level(self):
        program = RFProgramFactory(tiers=['Only Tier'])
        level = LevelFactory(program=program, parent=None)
        data = get_serialized_data(program.pk)
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
        data = get_serialized_data(program.pk)
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
        data = get_serialized_data(program.pk)
        self.assertEqual(data['indicator_pks_for_level'], [{'pk': level.pk, 'indicator_pks': indicator_pks}])
        self.assertEqual(data['unassigned_indicator_pks'], [])

    def test_program_one_level_with_unassigned_indicators(self):
        program = RFProgramFactory(tiers=['Only Tier'])
        level = LevelFactory(program=program, parent=None)
        indicator_pks = [RFIndicatorFactory(program=program, level=None, number=number).pk
                         for number in ['231', '14', '11']]
        data = get_serialized_data(program.pk)
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
        data = get_serialized_data(program.pk)
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
