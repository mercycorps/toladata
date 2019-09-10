# -*- coding: utf-8 -*-
"""Tests for the main IPTT JSON endpoint - produces jscontext for IPTT reports

    - should load indicators, levels, tiers, sites, sectors, indicator types,
        as well as all program attributes
    - should do so in 7 queries
"""

import datetime
from factories.indicators_models import RFIndicatorFactory, IndicatorTypeFactory
from factories.workflow_models import RFProgramFactory, SiteProfileFactory, SectorFactory
from workflow.serializers_new import IPTTProgramSerializer
from indicators.models import Indicator
from django import test
from django.utils import translation


IPTT_QUERY_COUNT = 7

def get_serialized_data(program_pk):
    return IPTTProgramSerializer.get_for_pk(program_pk).data

class TestIPTTEndpoint(test.TestCase):
    def test_rf_program_two_indicators(self):
        p = RFProgramFactory(
            tiers=['Tier1', 'Tier2'], levels=1,
            reporting_period_start=datetime.date(2014, 5, 1)
        )
        site = SiteProfileFactory()
        it = IndicatorTypeFactory()
        sector = SectorFactory()
        indicators = [RFIndicatorFactory(
            program=p, level=level, target_frequency=Indicator.LOP, targets=500, results=400
            ) for level in p.levels.all()]
        levels = sorted(p.levels.all(), key=lambda l: l.level_depth)
        level_pks = [{'pk': level.pk, 'indicator_pks': [indicator.pk]}
                     for level, indicator in zip(levels, indicators)]
        indicators[0].indicator_type.add(it)
        indicators[1].sector = sector
        indicators[1].save()
        indicators[0].result_set.first().site.add(site)
        indicators[1].result_set.first().site.add(site)
        with self.assertNumQueries(IPTT_QUERY_COUNT):
            data = get_serialized_data(p.pk)
        self.assertEqual(data['pk'], p.pk)
        self.assertEqual(data['name'], p.name)
        self.assertTrue(data['results_framework'])
        self.assertEqual(data['by_result_chain'], 'by Tier2 chain')
        self.assertEqual(data['reporting_period_start_iso'], '2014-05-01')
        self.assertEqual(data['frequencies'], [Indicator.LOP])
        self.assertEqual(data['sites'], [{'pk': site.pk, 'name': site.name}])
        self.assertEqual(data['sectors'], [{'pk': sector.pk, 'name': sector.sector}])
        self.assertEqual(data['indicator_types'], [{'pk': it.pk, 'name': it.indicator_type}])
        self.assertEqual(data['unassigned_indicator_pks'], [])
        self.assertEqual(data['level_pks_level_order'], [l.pk for l in levels])
        self.assertEqual(data['level_pks_chain_order'], [l.pk for l in levels])
        self.assertEqual(data['indicator_pks_for_level'], level_pks)


    def test_unmigrated_program(self):
        p = RFProgramFactory(migrated=False)
        pks = []
        old_levels_numbers = [
            ('Activity', '5'),
            ('Activity', '3'),
            ('Outcome', '3.4'),
            ('Outcome', '2.8'),
            ('Outcome', '2.2')
        ]
        for old_level, number in old_levels_numbers:
            pks.append(
                RFIndicatorFactory(
                    program=p, old_level=old_level, number=number,
                    target_frequency=Indicator.SEMI_ANNUAL, targets=400, results=550
                ).pk
            )
        expected_pks = list(reversed(pks))
        with self.assertNumQueries(IPTT_QUERY_COUNT):
            data = get_serialized_data(p.pk)
        self.assertEqual(expected_pks, data['unassigned_indicator_pks'])
        self.assertEqual(data['level_pks_level_order'], [])
        self.assertEqual(data['level_pks_chain_order'], [])
        self.assertEqual(data['indicator_pks_for_level'], [])
        self.assertEqual(data['frequencies'], [Indicator.SEMI_ANNUAL])
        activity = [i_data for i_data in data['indicators'] if i_data['number'] == '5'][0]
        self.assertEqual(activity['old_level_name'], 'Activity')
        translation.activate('fr')
        with self.assertNumQueries(IPTT_QUERY_COUNT):
            french_data = get_serialized_data(p.pk)
        activity = [i_data for i_data in french_data['indicators'] if i_data['number'] == '5'][0]
        self.assertEqual(activity['old_level_name'], u'Activité')
        translation.activate('en')
