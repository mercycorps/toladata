# -*- coding: utf-8 -*-
"""Tests for the main Program Page JSON endpoint - produces jscontext for program page

    - should load indicators as well as all program attributes
    - should do so in 3 queries
"""

import itertools
import operator
import datetime
from factories.indicators_models import RFIndicatorFactory
from factories.workflow_models import RFProgramFactory, SiteProfileFactory
from workflow.serializers_new import ProgramPageProgramSerializer, ProgramPageUpdateSerializer
from indicators.models import Indicator
from django import test
from django.utils import translation


class TestProgramPageEndpoint(test.TestCase):

    def test_rf_program_two_indicators(self):
        p = RFProgramFactory(
            tiers=['Tier1', 'Tier2'], levels=1,
            reporting_period_start=datetime.date(2014, 5, 1)
        )
        for level in p.levels.all():
            RFIndicatorFactory(program=p, level=level)
        with self.assertNumQueries(4):
            data = ProgramPageProgramSerializer.get_for_pk(p.pk).data
        self.assertEqual(data['pk'], p.pk)
        self.assertEqual(data['name'], p.name)
        self.assertTrue(data['results_framework'])
        self.assertEqual(data['by_result_chain'], 'by Tier2 chain')
        self.assertEqual(data['reporting_period_start_iso'], '2014-05-01')
        self.assertEqual(data['site_count'], 0)
        self.assertTrue(data['has_levels'])
        self.assertEqual(data['indicator_pks_level_order'], data['indicator_pks_chain_order'])
        indicator_pks = data['indicator_pks_level_order']
        self.assertEqual(len(indicator_pks), 2)
        indicators_data = data['indicators']
        self.assertEqual(len(indicators_data), 2)
        goal_indicator_data = indicators_data[indicator_pks[0]]
        self.assertEqual(goal_indicator_data['number'], 'Tier1 a')
        output_indicator_data = indicators_data[indicator_pks[1]]
        self.assertEqual(output_indicator_data['number'], 'Tier2 1a')

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
        with self.assertNumQueries(4):
            data = ProgramPageProgramSerializer.get_for_pk(p.pk).data
        self.assertFalse(data['has_levels'])
        self.assertEqual(data['indicator_pks_level_order'], data['indicator_pks_chain_order'])
        indicator_pks = data['indicator_pks_level_order']
        self.assertEqual(expected_pks, indicator_pks)
        for (old_level, number), pk in zip(old_levels_numbers, pks):
            indicator_data = data['indicators'][pk]
            self.assertEqual(indicator_data['number'], u'{}'.format(number))
            self.assertEqual(indicator_data['old_level_name'], old_level)
            self.assertTrue(indicator_data['is_reporting'])
            self.assertEqual(indicator_data['over_under'], 1)
        self.assertEqual(data['indicators'][pks[0]]['level_pk'], 6)
        self.assertEqual(data['indicators'][pks[3]]['level_pk'], 3)
        translation.activate('fr')
        with self.assertNumQueries(4):
            french_data = ProgramPageProgramSerializer.get_for_pk(p.pk).data
        translation.activate('en')
        self.assertEqual(french_data['indicators'][pks[0]]['old_level_name'], u'Activité')
        self.assertEqual(french_data['indicators'][pks[4]]['old_level_name'], u'Résultat')


    def test_rf_program_many_indicators(self):
        p = RFProgramFactory(months=20, tiers=['Goal', 'Outcome', 'Output', 'Activity'], levels=3)
        p.levels.filter(parent__isnull=True, customsort__gt=1).delete()
        goal_level = p.levels.filter(parent__isnull=True).first()
        goal_pk_a = RFIndicatorFactory(
            program=p, level=goal_level,
            target_frequency=Indicator.LOP, targets=300, results=310
        ).pk
        goal_pk_b = RFIndicatorFactory(
            program=p, level=goal_level,
            target_frequency=Indicator.ANNUAL, targets=10, results=40,
            baseline="100", baseline_na=True
        ).pk
        pks = []
        pks.append(
            RFIndicatorFactory(
                program=p, level=None, number='A1'
            ).pk
        )
        pks.append(
            RFIndicatorFactory(
                program=p, level=None, old_level='Outcome',
                number='X21'
            ).pk
        )
        pks.append(
            RFIndicatorFactory(
                program=p, level=None, old_level='Outcome',
                number='C14'
            ).pk
        )
        pks.append(
            RFIndicatorFactory(
                program=p, level=None, old_level='Goal'
            ).pk
        )
        unassigned_pks = pks[::-1]
        levels = list(
            sorted(
                sorted(
                    [l for l in p.levels.filter(parent__isnull=False)],
                    key=lambda l: l.customsort
                ), key=lambda l: l.level_depth
            )
        )
        for level in list(reversed(levels)):
            pks.append(
                RFIndicatorFactory(
                    program=p, level=level,
                ).pk
            )
        expected_pks = [goal_pk_a, goal_pk_b] + list(reversed(pks))
        with self.assertNumQueries(4):
            data = ProgramPageProgramSerializer.get_for_pk(p.pk).data
        self.assertEqual(data['by_result_chain'], 'by Outcome chain')
        self.assertNotEqual(data['indicator_pks_level_order'], data['indicator_pks_chain_order'])
        indicator_pks = data['indicator_pks_level_order']
        self.assertEqual(indicator_pks, expected_pks)
        chain_pks = [indicator.pk for indicator in goal_level.indicator_set.order_by('level_order')]
        for level in goal_level.get_children():
            chain_pks += [indicator.pk for indicator in level.indicator_set.order_by('level_order')]
        chain_pks += unassigned_pks
        self.assertEqual(data['indicator_pks_chain_order'], chain_pks)
        self.assertTrue(data['indicators'][goal_pk_a]['is_reporting'])
        self.assertEqual(data['indicators'][goal_pk_a]['over_under'], 0)
        self.assertEqual(data['indicators'][goal_pk_a]['lop_target'], 300)
        self.assertEqual(data['indicators'][goal_pk_a]['level_pk'], goal_level.pk)
        self.assertEqual(data['indicators'][goal_pk_b]['baseline'], None)
        self.assertEqual(data['indicators'][goal_pk_b]['over_under'], 1)
        self.assertEqual(data['indicators'][unassigned_pks[0]]['number'], None)
        self.assertEqual(data['indicators'][unassigned_pks[1]]['old_level_name'], None)
        self.assertEqual(data['indicators'][unassigned_pks[2]]['level_pk'], None)
        translation.activate('fr')
        with self.assertNumQueries(4):
            french_data = ProgramPageProgramSerializer.get_for_pk(p.pk).data
        translation.activate('en')
        self.assertEqual(french_data['by_result_chain'], 'par chaîne Résultat')
        self.assertEqual(french_data['indicators'][goal_pk_b]['number'], 'But b')
        self.assertEqual(french_data['indicators'][expected_pks[6]]['number'], 'Extrant 1.2a')
        self.assertEqual(french_data['indicators'][unassigned_pks[1]]['old_level_name'], None)

    def test_manual_numbering(self):
        p = RFProgramFactory(tiers=['Tier1', 'Tier2', 'Tier3'], levels=1, auto_number_indicators=False)
        levels = list(
            sorted(
                sorted(
                    [l for l in p.levels.all()],
                    key=lambda l: l.customsort
                ), key=lambda l: l.level_depth
            )
        )
        numbers = ['482', '28.C', '999']
        pks = []
        for level, number in zip(list(reversed(levels)), numbers):
            pks.append(
                RFIndicatorFactory(
                    program=p,
                    level=level,
                    number=number
                ).pk
            )
        expected_pks = list(reversed(pks))
        expected_numbers = list(reversed(numbers))
        with self.assertNumQueries(4):
            data = ProgramPageProgramSerializer.get_for_pk(p.pk).data
        self.assertEqual(len(data['indicators']), 3)
        self.assertEqual(data['indicator_pks_level_order'], expected_pks)
        self.assertEqual(data['indicator_pks_chain_order'], expected_pks)
        for pk, number in zip(expected_pks, expected_numbers):
            self.assertEqual(data['indicators'][pk]['number'], number)

    def test_rollups(self):
        p = RFProgramFactory()
        incomplete_i = RFIndicatorFactory(
            program=p, target_frequency=Indicator.MONTHLY, targets=300
        )
        incomplete_i.periodictargets.order_by('-end_date').first().delete()
        targets_i = RFIndicatorFactory(
            program=p, target_frequency=Indicator.QUARTERLY, targets=400
        )
        results_i = RFIndicatorFactory(
            program=p, target_frequency=Indicator.SEMI_ANNUAL, targets=400,
            results=200, results__count=10
        )
        sites = itertools.cycle([SiteProfileFactory() for _ in range(8)])
        for result in results_i.result_set.all():
            result.site.add(next(sites))
        evidence_i = RFIndicatorFactory(
            program=p, target_frequency=Indicator.ANNUAL, targets=40,
            results=100, results__count=12, results__evidence=8
        )
        for result in evidence_i.result_set.all():
            result.site.add(next(sites))
        evidence_i2 = RFIndicatorFactory(
            program=p, target_frequency=Indicator.ANNUAL, targets=40,
            results=10, results__count=4, results__evidence=4
        )
        with self.assertNumQueries(4):
            data = ProgramPageProgramSerializer.get_for_pk(p.pk).data
        self.assertTrue(data['needs_additional_target_periods'])
        self.assertEqual(data['site_count'], 8)
        self.assertFalse(data['indicators'][incomplete_i.pk]['has_all_targets_defined'])
        self.assertTrue(data['indicators'][targets_i.pk]['has_all_targets_defined'])
        self.assertFalse(data['indicators'][targets_i.pk]['has_results'])
        self.assertEqual(data['indicators'][results_i.pk]['results_count'], 10)
        self.assertTrue(data['indicators'][results_i.pk]['has_results'])
        self.assertEqual(data['indicators'][evidence_i.pk]['results_with_evidence_count'], 8)
        self.assertTrue(data['indicators'][evidence_i.pk]['missing_evidence'])
        self.assertFalse(data['indicators'][evidence_i2.pk]['missing_evidence'])

    def test_rf_program_two_indicators_update_only(self):
        p = RFProgramFactory(
            tiers=['Tier1', 'Tier2'], levels=1,
        )
        expected_pks = []
        levels = sorted(p.levels.all(), key=operator.attrgetter('level_depth'))
        for level in levels:
            expected_pks.append(RFIndicatorFactory(program=p, level=level).pk)
        indicator = RFIndicatorFactory(program=p, level=levels[1], name='Test Name')
        expected_pks.append(indicator.pk)
        full_data = ProgramPageProgramSerializer.get_for_pk(p.pk).data
        with self.assertNumQueries(5):
            data = ProgramPageUpdateSerializer.update_indicator_pk(p.pk, indicator.pk).data
        self.assertEqual(len(data), 5)
        self.assertEqual(data['pk'], p.pk)
        self.assertEqual(data['indicator_pks_level_order'], data['indicator_pks_chain_order'])
        indicator_pks = data['indicator_pks_level_order']
        self.assertEqual(indicator_pks, expected_pks)
        self.assertEqual(data['indicator']['name'], 'Test Name')
        for indicator_pk in full_data['indicators']:
            self.assertIn(indicator_pk, data['indicators'])
            self.assertEqual(
                full_data['indicators'][indicator_pk]['number'],
                data['indicators'][indicator_pk]['number']
                )

    def test_rf_program_two_indicators_delete_only(self):
        p = RFProgramFactory(
            tiers=['Tier1', 'Tier2'], levels=1,
        )
        expected_pks = []
        levels = sorted(p.levels.all(), key=operator.attrgetter('level_depth'))
        for level in levels:
            expected_pks.append(RFIndicatorFactory(program=p, level=level).pk)
        indicator = RFIndicatorFactory(program=p, level=levels[1], name='Test Name')
        expected_pks.append(indicator.pk)
        full_data = ProgramPageProgramSerializer.get_for_pk(p.pk).data
        with self.assertNumQueries(4):
            data = ProgramPageUpdateSerializer.update_ordering(p.pk).data
        self.assertEqual(len(data), 5)
        self.assertEqual(data['pk'], p.pk)
        self.assertEqual(data['indicator_pks_level_order'], data['indicator_pks_chain_order'])
        indicator_pks = data['indicator_pks_level_order']
        self.assertEqual(indicator_pks, expected_pks)
        for indicator_pk in full_data['indicators']:
            self.assertIn(indicator_pk, data['indicators'])
            self.assertEqual(
                full_data['indicators'][indicator_pk]['number'],
                data['indicators'][indicator_pk]['number']
                )
