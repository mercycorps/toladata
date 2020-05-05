""" Tests for the Level and LevelTier serializers used by program serializers on IPTT/Program Page/Logframe"""

import operator
from indicators.models import Level, LevelTier
from indicators.serializers_new import (
    TierBaseSerializer,
    LevelBaseSerializer,
)
from tola.test.utils import SPECIAL_CHARS, lang_context
from factories.workflow_models import RFProgramFactory
from factories.indicators_models import RFIndicatorFactory, LevelFactory
from django import test
from django.utils import translation

TIERS_QUERY_COUNT = 1
LEVELS_QUERY_COUNT = 1


class TestTierBaseSerializer(test.TestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.program = RFProgramFactory(tiers=['Outcome', 'Tier 2', f'{SPECIAL_CHARS} tier'], levels=4)
        cls.tiers = list(cls.program.level_tiers.all().order_by('tier_depth'))
        cls.non_rf_program = RFProgramFactory(migrated=False, tiers=None)

    def test_tier_info_correct(self):
        with self.assertNumQueries(TIERS_QUERY_COUNT):
            serialized_data = TierBaseSerializer.load_for_program(self.program.pk).data
        with self.assertNumQueries(0):
            self.assertEqual(len(serialized_data), 3)
            for c, (tier, serialized_tier) in enumerate(zip(self.tiers, serialized_data)):
                self.assertEqual(tier.pk, serialized_tier['pk'])
                self.assertEqual(tier.name, serialized_tier['name'])
                self.assertEqual(tier.tier_depth, serialized_tier['tier_depth'])
                self.assertEqual(serialized_tier['tier_depth'], c+1)

    def test_non_rf_program(self):
        with self.assertNumQueries(TIERS_QUERY_COUNT):
            serialized_data = TierBaseSerializer.load_for_program(self.non_rf_program.pk).data
        with self.assertNumQueries(0):
            self.assertEqual(serialized_data, [])

    def test_translated_tier_name(self):
        tier_pk = self.tiers[0].pk
        with lang_context('fr'):
            with self.assertNumQueries(TIERS_QUERY_COUNT):
                serialized_data = TierBaseSerializer.load_for_program(self.program.pk).data
            with self.assertNumQueries(0):
                self.assertEqual(serialized_data[0]['pk'], tier_pk)
                self.assertEqual(serialized_data[0]['name'], 'Résultat')


class TestLevelBaseSerializer(test.TestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.level_pks = [201, 202, 203, 204, 205, 206]
        cls.parent_ids = [None, 201, 201, 202, 203, 203]
        cls.program = RFProgramFactory(tiers=['Tier 1', 'Tier 2', f'{SPECIAL_CHARS} tier'],
                                       levels=[(1,), ((2,),), (((1, 2),),)],
                                       levels__pks=cls.level_pks)
        cls.levels = cls.program.levels.all().order_by('pk')
        cls.level_names = [level.name for level in cls.levels]
        cls.ontologies = ['', '1', '2', '1.1', '2.1', '2.2']
        cls.tier_names = ['Tier 1'] + ['Tier 2']*2 + [f'{SPECIAL_CHARS} tier']*3
        cls.non_rf_program = RFProgramFactory(migrated=False, tiers=None, levels=None)

    def test_rf_program(self):
        with self.assertNumQueries(TIERS_QUERY_COUNT):
            tiers = TierBaseSerializer.load_for_program(self.program.pk).data
        with self.assertNumQueries(LEVELS_QUERY_COUNT):
            serialized_data = LevelBaseSerializer.load_for_program(self.program.pk, context={'tiers': tiers}).data
        with self.assertNumQueries(0):
            serialized_data = sorted(serialized_data, key=operator.itemgetter('pk'))
            self.assertEqual(len(serialized_data), 6)
            for count, serialized_level in enumerate(serialized_data):
                self.assertEqual(serialized_level['pk'], self.level_pks[count])
                self.assertEqual(serialized_level['parent_id'], self.parent_ids[count])
                self.assertEqual(serialized_level['name'], self.level_names[count])
                self.assertEqual(serialized_level['ontology'], self.ontologies[count])
                self.assertEqual(serialized_level['tier_name'], self.tier_names[count])

    def test_non_rf_program(self):
        with self.assertNumQueries(TIERS_QUERY_COUNT):
            tiers = TierBaseSerializer.load_for_program(self.non_rf_program.pk).data
        with self.assertNumQueries(LEVELS_QUERY_COUNT):
            serialized_data = LevelBaseSerializer.load_for_program(
                self.non_rf_program.pk, context={'tiers': tiers}
            ).data
        with self.assertNumQueries(0):
            self.assertEqual(serialized_data, [])