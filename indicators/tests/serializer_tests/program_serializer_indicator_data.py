# -*- coding: utf-8 -*-
"""Tests for program serializer output of indicator/level data for various use case cases.

Program serializers:
 - ProgramPageProgramSerializer


"""

import json
import datetime

from factories import (
    workflow_models as w_factories
)
from indicators.models import Indicator
from workflow.serializers import (
    ProgramPageProgramSerializer,
)

from django import test
from django.utils import translation


today = datetime.date.today()

scenarios = [
    {
        'id': 1452,
        'name': 'Unmigrated, One indicator per level',
        'migrated': False,
        'indicators': 4,
        'indicators__0': {'id': 14521, 'old_level': 'Activity'},
        'indicators__1': {'id': 14524, 'old_level': 'Goal'},
        'indicators__2': {'id': 14523, 'old_level': 'Outcome'},
        'indicators__3': {'id': 14522, 'old_level': 'Output'},
        'output': {
            'levels': [{'pk': depth, 'depth': depth, 'label': label} for (depth, label) in Indicator.OLD_LEVELS],
            'indicators': {
                '14521': {
                    'pk': 14521,
                    'level': 6,
                    'level_order': 0,
                },
                '14522': {
                    'pk': 14522,
                    'level': 5,
                    'level_order': 0,
                },
                '14523': {
                    'pk': 14523,
                    'level': 3,
                    'level_order': 0,
                },
                '14524': {
                    'pk': 14524,
                    'level': 1,
                    'level_order': 0,
                },
            }
        },
    },
    {
        'id': 1453,
        'name': 'Unmigrated, Numbered indicators, one level',
        'migrated': False,
        'indicators': 6,
        'indicators__0': {'id': 14531, 'old_level': 'Output', 'number': '1.2'},
        'indicators__1': {'id': 14532, 'old_level': 'Output', 'number': '1.1'},
        'indicators__2': {'id': 14533, 'old_level': 'Output', 'number': '1.2b'},
        'indicators__3': {'id': 14534, 'old_level': 'Output', 'number': '1.2a'},
        'indicators__4': {'id': 14535, 'old_level': 'Output', 'number': ''},
        'indicators__5': {'id': 14536, 'old_level': 'Activity', 'number': '1.2.4'},
        'output': {
            'levels': [{'pk': depth, 'depth': depth, 'label': label} for (depth, label) in Indicator.OLD_LEVELS],
            'indicators': {
                '14531': {
                    'pk': 14531,
                    'level': 5,
                    'number': '1.2',
                    'level_order': 1,
                },
                '14532': {
                    'pk': 14532,
                    'level': 5,
                    'number': '1.1',
                    'level_order': 0,
                },
                '14533': {
                    'pk': 14533,
                    'level': 5,
                    'number': '1.2b',
                    'level_order': 3,
                },
                '14534': {
                    'pk': 14534,
                    'level': 5,
                    'number': '1.2a',
                    'level_order': 2,
                },
                '14535': {
                    'pk': 14535,
                    'level': 5,
                    'number': '',
                    'level_order': 4,
                },
                '14536': {
                    'pk': 14536,
                    'level': 6,
                    'number': '1.2.4',
                    'level_order': 0,
                },
            }
        },
    },
    {
        'id': 99999,
        'name': 'Migrated, Reporting period 1.5 years, open, MC Tiers',
        'closed': False,
        'months': 18,
        'migrated': True,
        'tiers': True,
        'output': {
            'results_framework': True,
            'rf_chain_sort_label': 'by Outcome chain',
        },
        'translation': {
            'rf_chain_sort_label': u'par chaîne Résultat'
        },
    },
    # {
    #     'id': 999991,
    #     'name': 'Migrated Program, Reporting period 4 years, one month open, custom tiers',
    #     'closed': False,
    #     'months': 48,
    #     'age': 1,
    #     'migrated': True,
    #     'tiers': [u'Customgoal', u'Customóutput', u'CustomTier3'],
    #     'output': {
    #         'results_framework': True,
    #         'rf_chain_sort_label': u'by Customóutput chain',
    #     },
    # },
    # {
    #     'name': 'RF Always Program, Reporting period 2.5 years, incomplete indicators',
    #     'closed': False,
    #     'months': 30,
    #     'indicators': 2,
    #     'indicators__all': {'target_frequency': Indicator.SEMI_ANNUAL, 'targets': True},
    #     'indicators__0': {'targets': 'incomplete'},
    #     'output': {
    #         'results_framework': True,
    #         'does_it_need_additional_target_periods': True,
    #     },
    # },
    # {
    #     'name': 'RF Always Program, Reporting period 1.5 years, complete indicators',
    #     'closed': False,
    #     'months': 18,
    #     'indicators': 3,
    #     'indicators__all': {'target_frequency': Indicator.QUARTERLY, 'targets': True},
    #     'indicators__2': {'target_frequency': Indicator.ANNUAL},
    #     'output': {
    #         'results_framework': True,
    #         'does_it_need_additional_target_periods': False,
    #     },
    # }
]

class ProgramSerializerIndicatorDataScenarios(object):
    programs_data = []
    translations_programs = []

    def __init__(self):
        for scenario in scenarios:
            output = scenario.pop('output')
            translation_output = scenario.pop('translation', False)
            query_modifier = 0
            program = w_factories.RFProgramFactory(**scenario)
            output.update(
                {
                    'pk': program.id,
                    'query_modifier': query_modifier,
                }
            )
            self.programs_data.append(output)
            if translation_output:
                translation_output.update(
                    {
                        'pk': program.id,
                        'query_modifier': query_modifier,
                    }
                )
                self.translations_programs.append(translation_output)


class TestProgramSerializerIndicatorData(test.TestCase):
    program_page_transactions = 5

    @classmethod
    def setUpTestData(cls):
        cls.scenarios = ProgramSerializerIndicatorDataScenarios()

    def test_program_page_serializer(self):
        for program_data in self.scenarios.programs_data:
            query_count = self.program_page_transactions + program_data.pop('query_modifier', 0)
            with self.assertNumQueries(query_count):
                serialized_data = json.loads(ProgramPageProgramSerializer.load(program_data['pk']).json)
            self.assertEqual(program_data['pk'], serialized_data['pk'])
            if 'levels' in program_data:
                for expected_level, serialized_level in zip(program_data['levels'], serialized_data['levels']):
                    for field, value in expected_level.items():
                        self.assertEqual(serialized_level[field], value)
            if 'indicators' in program_data:
                for indicator_pk, indicator_data in program_data['indicators'].items():
                    self.assertIn(indicator_pk, serialized_data['indicators'])
                    for field, value in indicator_data.items():
                        self.assertEqual(serialized_data['indicators'][indicator_pk][field], value)