# -*- coding: utf-8 -*-
"""Tests for program serializer output for various use case cases.

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
        'name': 'Unmigrated, Reporting period two years, closed',
        'migrated': False,
        'output': {
            'results_framework': False,
            'rf_chain_sort_label': None,
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
    {
        'id': 999991,
        'name': 'Migrated Program, Reporting period 4 years, one month open, custom tiers',
        'closed': False,
        'months': 48,
        'age': 1,
        'migrated': True,
        'tiers': [u'Customgoal', u'Customóutput', u'CustomTier3'],
        'output': {
            'results_framework': True,
            'rf_chain_sort_label': u'by Customóutput chain',
        },
    },
    {
        'name': 'RF Always Program, Reporting period 2.5 years, incomplete indicators',
        'closed': False,
        'months': 30,
        'indicators': 2,
        'indicators__all': {'target_frequency': Indicator.SEMI_ANNUAL, 'targets': True},
        'indicators__0': {'targets': 'incomplete'},
        'output': {
            'results_framework': True,
            'does_it_need_additional_target_periods': True,
        },
    },
    {
        'name': 'RF Always Program, Reporting period 1.5 years, complete indicators',
        'closed': False,
        'months': 18,
        'indicators': 3,
        'indicators__all': {'target_frequency': Indicator.QUARTERLY, 'targets': True},
        'indicators__2': {'target_frequency': Indicator.ANNUAL},
        'output': {
            'results_framework': True,
            'does_it_need_additional_target_periods': False,
        },
    }
]

class ProgramSerializerScenarios(object):
    programs_data = []
    translations_programs = []

    def __init__(self):
        for scenario in scenarios:
            output = scenario.pop('output')
            translation_output = scenario.pop('translation', False)
            query_modifier = 0
            if 'indicators' in scenario:
                query_modifier += 1
            program = w_factories.RFProgramFactory(**scenario)
            output.update(
                {
                    'pk': program.id,
                    'name': program.name,
                    'reporting_period_start': program.reporting_period_start.isoformat(),
                    'reporting_period_end': program.reporting_period_end.isoformat(),
                    'query_modifier': query_modifier,
                }
            )
            self.programs_data.append(output)
            if translation_output:
                translation_output.update(
                    {
                        'pk': program.id,
                        'name': program.name,
                        'query_modifier': query_modifier,
                    }
                )
                self.translations_programs.append(translation_output)


class TestProgramSerializerProgramData(test.TestCase):
    """Tests output of program model and derived data for all Program Serializers"""
    program_page_transactions = 4
    program_page_fields = [
        'pk',
        'results_framework',
        'reporting_period_start',
        'reporting_period_end',
        'rf_chain_sort_label',
        'does_it_need_additional_target_periods'
    ]

    @classmethod
    def setUpTestData(cls):
        cls.scenarios = ProgramSerializerScenarios()

    def test_program_page_serializer(self):
        # towrite = []
        for program_data in self.scenarios.programs_data:
            query_count = self.program_page_transactions + program_data.pop('query_modifier', 0)
            with self.assertNumQueries(query_count):
                serialized_data = json.loads(ProgramPageProgramSerializer.load(program_data['pk']).json)
            for field in [f for f in self.program_page_fields if f in program_data]:
                self.assertIn(field, serialized_data)
                self.assertEqual(
                    program_data[field],
                    serialized_data[field],
                    u"for field {}, expected {} but received {} from Program Page serializer for program {}".format(
                        field, program_data[field], serialized_data[field], program_data['name']
                        ))
            # towrite.append(serialized_data)
        translation.activate('fr')
        for translated_data in self.scenarios.translations_programs:
            query_count = self.program_page_transactions + translated_data.pop('query_modifier', 0)
            with self.assertNumQueries(query_count):
                serialized_data = json.loads(ProgramPageProgramSerializer.load(translated_data['pk']).json)
            for field, translated_value in translated_data.items():
                self.assertIn(field, serialized_data)
                self.assertEqual(
                    translated_value,
                    serialized_data[field],
                    u"(FR) field {} expect: {} received {} from Program Page serializer for program {}".format(
                        field, translated_value, serialized_data[field], translated_data['name']
                    )
                )
            # towrite.append(serialized_data)
        translation.activate('en')
        # with open('/Users/cmcfee/tola/TolaActivity/temp.json', 'w') as f:
        #     json.dump(towrite, f)
        