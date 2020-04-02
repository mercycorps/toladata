# -*- coding: utf-8 -*-
"""Tests for the Program Page Program serializer corresponding to js/pages/program_page/models/ProgramPageProgram"""

from __future__ import division
from workflow.models import Program
from workflow.serializers_new import IPTTQSProgramSerializer
from indicators.models import Indicator
from factories.workflow_models import RFProgramFactory
from factories.indicators_models import RFIndicatorFactory

from django import test

class TestIPTTQSProgramSerializer(test.TestCase):
    def get_serialized_data(self, pks):
        return IPTTQSProgramSerializer(
            Program.rf_aware_objects.filter(
                pk__in=pks
            ), many=True
        ).data

    def test_frequencies(self):
        p1 = RFProgramFactory()
        RFIndicatorFactory(program=p1, target_frequency=Indicator.LOP, targets=200)
        p2 = RFProgramFactory()
        RFIndicatorFactory(program=p2, target_frequency=Indicator.ANNUAL, targets=1000)
        data = self.get_serialized_data([p1.pk, p2.pk])
        self.assertEqual(len(data), 2)
        data1 = [d for d in data if d['pk'] == p1.pk][0]
        self.assertEqual(data1['frequencies'], [1])
        data2 = [d for d in data if d['pk'] == p2.pk][0]
        self.assertEqual(data2['frequencies'], [3])

    def test_period_date_ranges(self):
        p = RFProgramFactory(closed=False, months=12, age=4) # 4+months ago 
        RFIndicatorFactory(program=p, target_frequency=Indicator.LOP, targets=200)
        data = self.get_serialized_data([p.pk])[0]
        self.assertEqual(data['pk'], p.pk)
        for frequency, count in [(3, 1), (4, 2), (5, 3), (6, 4), (7, 12)]:
            self.assertEqual(len(data['period_date_ranges'][frequency]), count)
        self.assertEqual(len([f for f in data['period_date_ranges'][7] if f['past']]), 5)


class TestIPTTQSProgramSerializerTransactions(test.TestCase):

    def get_serialized_data(self, *pks):
        return IPTTQSProgramSerializer.load_for_pks(pks).data

    def test_one_program(self):
        p = RFProgramFactory()
        RFIndicatorFactory(program=p, target_frequency=Indicator.LOP, targets=500)
        RFIndicatorFactory(program=p, target_frequency=Indicator.ANNUAL, targets=200)
        with self.assertNumQueries(2):
            data = self.get_serialized_data(p.pk)[0]
        self.assertEqual(data['frequencies'], [1, 3])

    def test_multiple_programs(self):
        p = RFProgramFactory(migrated=False)
        RFIndicatorFactory(program=p, target_frequency=Indicator.LOP, targets=500)
        RFIndicatorFactory(program=p, target_frequency=Indicator.ANNUAL, targets=200)
        p2 = RFProgramFactory(migrated=True, tiers=True, levels=1)
        RFIndicatorFactory(program=p2, target_frequency=Indicator.SEMI_ANNUAL, targets=5000)
        RFIndicatorFactory(program=p2, target_frequency=Indicator.ANNUAL, targets=200)
        p3 = RFProgramFactory(tiers=['Tier1', 'Tier2'], levels=2)
        for level in p3.levels.all():
            RFIndicatorFactory(program=p3, target_frequency=Indicator.MONTHLY, targets=5000, level=level)
        with self.assertNumQueries(2):
            data = {d['pk']: d for d in self.get_serialized_data(p.pk, p2.pk, p3.pk)}
        self.assertEqual(data[p.pk]['frequencies'], [1, 3])
        self.assertEqual(data[p2.pk]['frequencies'], [3, 4])
        self.assertEqual(data[p3.pk]['frequencies'], [7])
