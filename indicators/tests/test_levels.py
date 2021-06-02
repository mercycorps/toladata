# -*- coding: utf-8 -*-
"""
Test levels
"""
import datetime

from django import test

from factories import ProgramFactory, LevelFactory, LevelTierFactory

from indicators.models import Level


class TestLevelProperties(test.TestCase):
    """
    Test the get_level_depth method on the Level model to assure that the depth calculation is correct.
    """

    def setUp(self):
        self.program = ProgramFactory(
            reporting_period_start=datetime.date(2018, 1, 1),
            reporting_period_end=datetime.date(2019, 1, 1),
        )
        self.level1 = LevelFactory(program=self.program, customsort=1)
        self.level1_1 = LevelFactory(parent=self.level1, customsort=1, program=self.program)
        self.level1_1_1 = LevelFactory(parent=self.level1_1, customsort=1, program=self.program)
        self.level1_1_2 = LevelFactory(parent=self.level1_1, customsort=2, program=self.program)
        self.level1_2 = LevelFactory(parent=self.level1, customsort=2, program=self.program)
        self.level1_2_1 = LevelFactory(parent=self.level1_2, customsort=1, program=self.program)
        self.level1_2_2 = LevelFactory(parent=self.level1_2, customsort=2, program=self.program)
        self.level1_2_3 = LevelFactory(parent=self.level1_2, customsort=3, program=self.program)
        self.level1_2_3_1 = LevelFactory(parent=self.level1_2_3, customsort=1, program=self.program)
        self.level1_2_3_1_1 = LevelFactory(parent=self.level1_2_3_1, customsort=1, program=self.program)

        self.tier1 = LevelTierFactory(program=self.program, name='Tier1', tier_depth=1)
        self.tier2 = LevelTierFactory(program=self.program, name='Tier2', tier_depth=2)
        self.tier3 = LevelTierFactory(program=self.program, name='Tier3', tier_depth=3)
        self.tier4 = LevelTierFactory(program=self.program, name='Tier4', tier_depth=4)

    def test_level_depth(self):
        self.assertEqual(self.level1.get_level_depth(), 1)
        self.assertEqual(self.level1_1.get_level_depth(), 2)
        self.assertEqual(self.level1_1_1.get_level_depth(), 3)
        self.assertEqual(self.level1_1_2.get_level_depth(), 3)

    def test_leveltier_method(self):
        self.assertEqual(self.level1.leveltier.tier_depth, 1)
        self.assertEqual(self.level1_1.leveltier.tier_depth, 2)
        self.assertEqual(self.level1_2_3_1_1.leveltier, None)

        # check if the property is still correct after a reordering and if the numbers don't start with 1
        self.tier1.tier_depth = 10
        self.tier1.save()
        self.tier2.tier_depth = 9
        self.tier2.save()
        self.assertEqual(self.level1.leveltier.name, 'Tier3')
        self.assertEqual(self.level1_1.leveltier.name, 'Tier4')

    def test_ontology_method(self):
        self.assertEqual(self.level1.ontology, '1.0.0.0')
        self.assertEqual(self.level1_1.ontology, '1.1.0.0')
        self.assertEqual(self.level1_1_1.ontology, '1.1.1.0')
        self.assertEqual(self.level1_1_2.ontology, '1.1.2.0')
        self.assertEqual(self.level1_2.ontology, '1.2.0.0')
        self.assertEqual(self.level1_2_1.ontology, '1.2.1.0')
        self.assertEqual(self.level1_2_2.ontology, '1.2.2.0')
        self.assertEqual(self.level1_2_3.ontology, '1.2.3.0')
        self.assertEqual(self.level1_2_3_1.ontology, '1.2.3.1')

    def test_truncate_ontology(self):
        self.assertEqual(Level.truncate_ontology('1.0.0.0'), '')
        self.assertEqual(Level.truncate_ontology('1.1.0.0'), '1')
        self.assertEqual(Level.truncate_ontology('1.2.1.0'), '2.1')
        self.assertEqual(Level.truncate_ontology('1.1.3.2'), '1.3.2')


