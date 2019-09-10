# -*- coding: utf-8 -*-
"""Tests for the Program Serializer providing Program-wide ordering by level and chain

    corresponding to js/models/program/ProgramLevelOrdering"""

from workflow.serializers_new import ProgramLevelOrderingProgramSerializer
from workflow.models import Program
from factories.workflow_models import RFProgramFactory
from factories.indicators_models import RFIndicatorFactory, LevelFactory
from django import test
from django.utils import translation


class TestProgramLevelOrderingProgramSerializer(test.TestCase):
    def get_program_data(self, **kwargs):
        return ProgramLevelOrderingProgramSerializer(
            Program.rf_aware_objects.filter(pk=RFProgramFactory(**kwargs).pk), many=True
        ).data[0]

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
        data = ProgramLevelOrderingProgramSerializer(
            Program.rf_aware_objects.filter(pk=p.pk), many=True
        ).data[0]
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
        data = ProgramLevelOrderingProgramSerializer(
            Program.rf_aware_objects.filter(pk=p.pk), many=True
        ).data[0]
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
        data = ProgramLevelOrderingProgramSerializer(
            Program.rf_aware_objects.filter(pk=p.pk), many=True
        ).data[0]
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
        data = ProgramLevelOrderingProgramSerializer(
            Program.rf_aware_objects.filter(pk=p.pk), many=True
        ).data[0]
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
            data = ProgramLevelOrderingProgramSerializer(
                Program.rf_aware_objects.filter(pk=p.pk), many=True
            ).data[0]
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
        data = ProgramLevelOrderingProgramSerializer(
            Program.rf_aware_objects.filter(pk=p.pk), many=True
        ).data[0]
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
        data = ProgramLevelOrderingProgramSerializer(
            Program.rf_aware_objects.filter(pk=p.pk), many=True
        ).data[0]
        self.assertEqual(
            data['indicator_pks_level_order'],
            list(reversed(pks))
        )
        self.assertEqual(
            data['indicator_pks_chain_order'],
            list(reversed(pks))
        )
