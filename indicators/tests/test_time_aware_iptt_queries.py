import unittest
import sys
from datetime import datetime
from indicators.queries import IPTTIndicator
from indicators.models import Indicator
from factories.indicators_models import (
    IndicatorFactory,
    LevelFactory,
    PeriodicTargetFactory,
    ResultFactory
    )
from factories.workflow_models import ProgramFactory
from django import test
from django.core.exceptions import ValidationError

from django.conf import settings
from django.db import connection

""" cases
    - cumulative number +
        - lop target: last target
        - lop result: sum of all data
        - period result: sum of data to date
    - cumulative number - (this one might change) (flip bad and good)
        - same as above
    - cumulative percent +
        - lop target: last target
        - lop result: last result
        - period result: last result
    - cumulative percent -
        - same as above (flip bad and good)
    - noncumulative number +
        - lop target: sum of targets
        - lop result: sum of all data
        - period result: sum of data in period
    - noncumulative number -
        - same as above (flip bad and good)
    - noncumulative percent + : no results
    - noncumulative precent - : no results
"""

dates = {
    'program_start': (1, 1),
    'program_end': (12, 31),
    'targets': [
        ((1, 1), (4, 30)),
        ((5, 1), (8, 31)),
        ((9, 1), (12, 31))
    ],
    'collects': [
        ((2, 1),),
        ((6, 1), (8, 10)),
        ((10, 20),)
    ]
}

def get_date(date_tuple):
    return datetime(2016, date_tuple[0], date_tuple[1])

scenarios = [
    {
        'desc': 'cumulative number positive',
        'cumulative': True,
        'number': True,
        'positive': True,
        'targets': [50, 100, 150],
        'data': [(40,), (30, 30), (45,)],
        'blank': False,
        'lop_target': 150,
        'lop_sum': 145,
        'lop_met': '97%',
        'results': [40, 100, 145],
        'mets': ['80%', '100%', '97%'],
        'over_under': [-1, 0, 0],
        'semi_annual_results': [70, 145],
    },
    {
        'desc': 'cumulative number negative',
        'cumulative': True,
        'number': True,
        'positive': False,
        'targets': [300, 200, 100],
        'data': [(100,), (50, 80), (40,)],
        'blank': False,
        'lop_target': 100,
        'lop_sum': 270,
        'lop_met': '270%',
        'results': [100, 230, 270],
        'mets': ['33%', '115%', '270%'],
        'over_under': [1, 0, -1],
        'semi_annual_results': [150, 270]
    },
    {
        'desc': 'cumulative percent positive',
        'cumulative': True,
        'number': False,
        'positive': True,
        'targets': [50, 60, 70],
        'data': [(40,), (50, 55,), (75,)],
        'blank': False,
        'lop_target': 70,
        'lop_sum': 75,
        'lop_met': '107%',
        'results': [40, 55, 75],
        'mets': ['80%', '92%', '107%'],
        'over_under': [-1, 0, 0],
        'semi_annual_results': [50, 75]
    },
    {
        'desc': 'cumulative percent negative',
        'cumulative': True,
        'number': False,
        'positive': False,
        'targets': [80, 40, 20],
        'data': [(75,), (35, 55), (25,)],
        'blank': False,
        'lop_target': 20,
        'lop_sum': 25,
        'lop_met': '125%',
        'results': [75, 55, 25],
        'mets': ['94%', '138%', '125%'],
        'over_under': [0, -1, -1],
        'semi_annual_results': [35, 25]
    },
    {
        'desc': 'noncumulative number positive',
        'cumulative': False,
        'number': True,
        'positive': True,
        'targets': [100, 100, 100],
        'data': [(80,), (40, 70), (90,)],
        'blank': False,
        'lop_target': 300,
        'lop_sum': 280,
        'lop_met': '93%',
        'results': [80, 110, 90],
        'mets': ['80%', '110%', '90%'],
        'over_under': [-1, 0, 0],
        'semi_annual_results': [120, 160]
    },
    {
        'desc': 'noncumulative number negative',
        'cumulative': False,
        'number': True,
        'positive': False,
        'targets': [500, 500, 500],
        'data': [(400,), (300, 200), (600,)],
        'blank': False,
        'lop_target': 1500,
        'lop_sum': 1500,
        'lop_met': '100%',
        'results': [400, 500, 600],
        'mets': ['80%', '100%', '120%'],
        'over_under': [1, 0, -1],
        'semi_annual_results': [700, 800]
    },
    {
        'desc': 'noncumulative percent positive',
        'cumulative': False,
        'number': False,
        'positive': True,
        'targets': [30, 30, 30],
        'data': [(30,), (20,), (50,)],
        'blank': True
    },
    {
        'desc': 'noncumulative percent negative',
        'cumulative': False,
        'number': False,
        'positive': False,
        'targets': [30, 30, 30],
        'data': [(30,), (20,), (50,)],
        'blank': True
    }
]

class TestIndicatorInstance(test.TestCase):

    def setUp(self):
        self.level = LevelFactory()
        self.indicator = IndicatorFactory(name="testname", level=self.level)

    def tearDown(self):
        self.indicator.delete()
        self.level.delete()

    def test_instances(self):
        indicators = IPTTIndicator.timeperiods.all()
        self.assertEqual(len(indicators), 1)
        self.assertEqual(indicators[0].name, self.indicator.name)

    def test_level(self):
        indicator = IPTTIndicator.timeperiods.first()
        self.assertEqual(indicator.levelname, self.level.name)

@unittest.skip('needs updating')
class TestIndicatorScenarios(test.TestCase):
    def setUp(self):
        self.program = ProgramFactory(reporting_period_start=get_date(dates['program_start']),
                                      reporting_period_end=get_date(dates['program_end']))
        self.indicator = None
        self.targets = []
        self.data = []

    def tearDown(self):
        for data in self.data:
            data.delete()
        for target in self.targets:
            target.delete()
        if self.indicator is not None:
            self.indicator.delete()
        self.program.delete()

    def indicator_for_scenario(self, scenario):
        indicator = IndicatorFactory(
            target_frequency=Indicator.TRI_ANNUAL,
            is_cumulative=scenario['cumulative'],
            direction_of_change=(
                Indicator.DIRECTION_OF_CHANGE_POSITIVE
                if scenario['positive'] else Indicator.DIRECTION_OF_CHANGE_NEGATIVE
            ),
            unit_of_measure_type=(
                Indicator.NUMBER if scenario['number'] else Indicator.PERCENTAGE
            ),
            program=self.program
        )
        for target_number, period in zip(scenario['targets'], dates['targets']):
            self.targets.append(PeriodicTargetFactory(
                indicator=indicator,
                target=target_number,
                start_date=get_date(period[0]),
                end_date=get_date(period[1])
            ))
        for c, data_set in enumerate(scenario['data']):
            date_set = dates['collects'][c]
            for data, date in zip(data_set, date_set):
                self.data.append(ResultFactory(
                    periodic_target=self.targets[c],
                    achieved=data,
                    indicator=indicator,
                    program=self.program,
                    date_collected=get_date(date)
                ))
        return indicator

    def get_scenarios(self):
        for scenario in scenarios:
            try:
                self.indicator = self.indicator_for_scenario(scenario)
            except ValidationError:
                exc_type, exc_value = sys.exc_info()[:2]
                self.fail("{0} in {1} scenario: {2}".format(exc_type.__name__, scenario['desc'], ",".join(exc_value)))
            self.assertEqual(self.indicator.program, self.program)
            yield scenario

    @unittest.skip('not implemented - IPTT Indicator not currently in use, fix tests when it is reintroduced')
    def test_scenario_totals_targetperiods(self):
        settings.DEBUG = True
        for scenario in self.get_scenarios():
            created = len(connection.queries)
            iptt_indicator = IPTTIndicator.withtargets.get(pk=self.indicator.pk)
            expected_queries = 2
            self.assertLessEqual(
                len(connection.queries)-created, expected_queries,
                "Expecting {0} query to fetch indicator, but it took {1}".format(
                    expected_queries, len(connection.queries)-created))
            # make sure iptt indicator proxy loaded correctly:
            self.assertEqual(iptt_indicator.pk, self.indicator.pk)
            if scenario['blank']:
                # no tests on a blank (unsupported for annotations) indicator:
                return
            self.assertEqual(
                iptt_indicator.lop_target_calculated,
                scenario['lop_target'],
                "In scenario {desc}: calculated lop_target_sum should be {1}, got {0}".format(
                    iptt_indicator.lop_target_calculated, scenario['lop_target'],
                    desc=scenario['desc']))
            self.assertEqual(
                iptt_indicator.lop_actual,
                scenario['lop_sum'],
                "In scenario {desc}: calculated lop sum should be {0}, got {1}".format(
                    scenario['lop_sum'], iptt_indicator.lop_actual,
                    desc=scenario['desc']))
            self.assertEqual(
                iptt_indicator.lop_percent_met,
                scenario['lop_met'],
                "In scenarios {desc}: lop met_target should be {0}, got {1}".format(
                    scenario['lop_met'], iptt_indicator.lop_percent_met,
                    desc=scenario['desc']))
        settings.DEBUG = False

    @unittest.skip('not implemented - IPTT Indicator not currently in use, fix tests when it is reintroduced')
    def test_scenario_totals_timeperiods(self):
        settings.DEBUG = True
        for scenario in self.get_scenarios():
            created = len(connection.queries)
            iptt_indicator = IPTTIndicator.notargets.get(pk=self.indicator.pk)
            expected_queries = 1
            self.assertLessEqual(
                len(connection.queries)-created, expected_queries,
                "Expecting {0} query to fetch indicator, but it took {1}".format(
                    expected_queries, len(connection.queries)-created))
            # make sure iptt indicator proxy loaded correctly:
            self.assertEqual(iptt_indicator.pk, self.indicator.pk)
            if scenario['blank']:
                # no tests on a blank (unsupported for annotations) indicator:
                return
            self.assertEqual(
                iptt_indicator.lop_target_sum,
                scenario['lop_target'],
                "In scenario {desc}: calculated lop_target_sum should be {1}, got {0}".format(
                    iptt_indicator.lop_target_sum, scenario['lop_target'],
                    desc=scenario['desc']))
            self.assertEqual(
                iptt_indicator.lop_actual_sum,
                scenario['lop_sum'],
                "In scenario {desc}: calculated lop sum should be {0}, got {1}".format(
                    scenario['lop_sum'], iptt_indicator.lop_actual_sum,
                    desc=scenario['desc']))
            self.assertEqual(
                iptt_indicator.lop_met_target,
                scenario['lop_met'],
                "In scenarios {desc}: lop met_target should be {0}, got {1}".format(
                    scenario['lop_met'], iptt_indicator.lop_met_target,
                    desc=scenario['desc']))
        settings.DEBUG = False

    def test_periodic_target_scenarios(self):
        settings.DEBUG = True
        for scenario in self.get_scenarios():
            created = len(connection.queries)
            indicator = IPTTIndicator.tva.get(pk=self.indicator.pk)
            expected_queries = 2 #one for each target
            self.assertLessEqual(
                len(connection.queries)-created, expected_queries,
                "Expecting {0} queries to fetch indicator, but it took {1}".format(
                    expected_queries, len(connection.queries)-created))
            if scenario['blank']:
                return
            self.assertEqual(
                len(indicator.data_targets),
                len(scenario['targets']),
                "In {desc}: expecting {0} indicator targets, got {1}".format(
                    len(scenario['targets']), len(indicator.data_targets),
                    desc=scenario['desc']))
            for c, target_actual in enumerate(indicator.data_targets):
                self.assertEqual(
                    target_actual.target,
                    scenario['targets'][c],
                    "In {desc}: expected {0} for target {1}, but got {2}".format(
                        scenario['targets'][c], c, target_actual.target,
                        desc=scenario['desc']))
                self.assertEqual(
                    target_actual.data_sum,
                    scenario['results'][c],
                    "In {desc}: expected a sum of {0} for target {1}, but got {2}".format(
                        scenario['results'][c], c, target_actual.data_sum,
                        desc=scenario['desc']))
                self.assertEqual(
                    target_actual.met,
                    scenario['mets'][c],
                    "In {desc}: expected a met of {0} for target {1}, but got {2}".format(
                        scenario['mets'][c], c, target_actual.met,
                        desc=scenario['desc']))
                self.assertEqual(
                    target_actual.within_target_range,
                    scenario['over_under'][c],
                    "In {desc}: expected {0} within_target_range to be {1}, got {2}".format(
                        c, scenario['over_under'][c], target_actual.within_target_range,
                        desc=scenario['desc']))
            self.assertLessEqual(
                len(connection.queries)-created, expected_queries,
                "(after all tests): expecting {0} queries to fetch indicator, but it took {1}".format(
                    expected_queries, len(connection.queries)-created))
            settings.DEBUG = False

    def test_timeperiod_scenarios(self):
        settings.DEBUG = True
        periods = [
            {
                'start_date': datetime(2016, 1, 1),
                'end_date': datetime(2016, 6, 30),
            },
            {
                'start_date': datetime(2016, 7, 1),
                'end_date': datetime(2016, 12, 31)
            }]
        for scenario in self.get_scenarios():
            created = len(connection.queries)
            indicator = IPTTIndicator.timeperiods.with_frequency_annotations(Indicator.SEMI_ANNUAL,
                                                                             self.indicator.program.reporting_period_start,
                                                                             self.indicator.program.reporting_period_end).get(pk=self.indicator.id)
            expected_queries = 1
            self.assertLessEqual(
                len(connection.queries)-created, expected_queries,
                "Expecting {0} queries to fetch indicator, but it took {1}".format(
                    expected_queries, len(connection.queries)-created))
            expected_results = len(scenario['semi_annual_results']) if not scenario['blank'] else 0
            self.assertEqual(
                len([p for p in indicator.timeperiods]),
                expected_results,
                "In {desc}, expected {0} timeperiods, got {1}".format(
                    expected_results, len([p for p in indicator.timeperiods]),
                    desc=scenario['desc']))
            for c, period in enumerate(periods):
                if scenario['blank'] != True:
                    period_sum = getattr(indicator, "{0}-{1}".format(
                        period['start_date'].strftime('%Y-%m-%d'),
                        period['end_date'].strftime('%Y-%m-%d')))
                    self.assertEqual(
                        period_sum, scenario['semi_annual_results'][c],
                        "{desc} expected {0} for sum of semi annual period {1}, got {2}".format(
                            scenario['semi_annual_results'][c], c, period_sum,
                            desc=scenario['desc']))
        settings.DEBUG = False
