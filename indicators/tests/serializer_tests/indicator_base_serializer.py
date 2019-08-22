# -*- coding: utf-8 -*-
""" Tests for the base indicator serializer - corresponding to js/models/indicator/baseIndicator"""

from factories.indicators_models import RFIndicatorFactory, LevelFactory
from factories.workflow_models import RFProgramFactory
from indicators.models import Indicator
from indicators.serializers_new import IndicatorBaseSerializer

from django import test
from django.utils import translation


class TestIndicatorBaseSerializer(test.TestCase):
    def get_indicator_data(self, **kwargs):
        return IndicatorBaseSerializer(Indicator.objects.filter(pk=RFIndicatorFactory(**kwargs).pk), many=True).data[0]

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
