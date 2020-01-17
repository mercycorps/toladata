import json
import datetime
from django import test
from django.urls import reverse
from indicators.models import Indicator
from factories import (
    workflow_models as w_factories,
    indicators_models as i_factories
)

class TestIPTTTimeperiodsValues(test.TestCase):
    indicator_kwargs = [
        {
            'indicator': {
                'target_frequency': Indicator.LOP,
                'lop_target': 100,
                'unit_of_measure_type': Indicator.NUMBER,
                'is_cumulative': False
            },
            'targets': [
            ],
            'results': [
                (datetime.date(2018, 2, 15), 50),
                (datetime.date(2018, 3, 16), 30),
                (datetime.date(2019, 3, 1), 20)
            ],
            'annual': [80, 20],
            'monthly': {
                0: 50,
                1: 30,
                13: 20
            }
        },
        {
            'indicator': {
                'target_frequency': Indicator.LOP,
                'lop_target': 101,
                'unit_of_measure_type': Indicator.PERCENTAGE,
                'is_cumulative': False
            },
            'targets': [
            ],
            'results': [
                (datetime.date(2018, 2, 15), 20),
                (datetime.date(2018, 3, 16), 60),
                (datetime.date(2019, 3, 1), 50)
            ],
            'annual': [60, 50],
            'monthly': {
                0: 20,
                1: 60,
                13: 50
            }
        },
        {
            'indicator': {
                'target_frequency': Indicator.LOP,
                'lop_target': 102,
                'unit_of_measure_type': Indicator.NUMBER,
                'is_cumulative': True
            },
            'targets': [
            ],
            'results': [
                (datetime.date(2018, 2, 15), 20),
                (datetime.date(2018, 3, 16), 60),
                (datetime.date(2019, 2, 15), 50)
            ],
            'annual': [80, 130],
            'monthly': {
                0: 20,
                1: 80,
                12: 130
            }
        },
        {
            'indicator': {
                'target_frequency': Indicator.MID_END,
                'lop_target': 1003,
                'unit_of_measure_type': Indicator.NUMBER,
                'is_cumulative': False
            },
            'targets': [
                {
                    'target': 50,
                    'results': [
                        (datetime.date(2018, 2, 15), 100),
                        (datetime.date(2018, 12, 3), 550)
                    ]
                },
                {
                    'target': 950,
                    'results': [
                        (datetime.date(2018, 10, 3), 100),
                        (datetime.date(2018, 10, 6), 200),
                        (datetime.date(2018, 12, 1), 150),
                        (datetime.date(2019, 3, 1), 500),
                        (datetime.date(2019, 2, 3), 400),
                    ]
                }
            ],
            'results': [],
            'annual': [1100, 900],
            'monthly': {
                0: 100,
                8: 300,
                10: 700,
                12: 400,
                13: 500
            }
        },
        {
            'indicator': {
                'target_frequency': Indicator.SEMI_ANNUAL,
                'lop_target': 105,
                'unit_of_measure_type': Indicator.NUMBER,
                'is_cumulative': True
            },
            'targets': [
                {
                    'target': 30,
                    'results': [
                        (datetime.date(2018, 2, 15), 10),
                    ]
                },
                {
                    'target': 40,
                    'results': [
                        (datetime.date(2018, 8, 15), 40),
                    ]
                },
                {
                    'target': 50,
                    'results': [
                        (datetime.date(2019, 2, 10), 80),
                    ]
                },
                {
                    'target': 60,
                    'results': []
                },
            ],
            'results': [],
            'annual': [50, 130],
            'monthly': {
                0: 10,
                6: 50,
                10: None,
                12: 130,
                15: None
            }
        }
    ]
    def setUp(self):
        self.user = w_factories.TolaUserFactory()
        self.client = test.Client()
        self.client.force_login(self.user.user)
        self.response = None
        self.program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2018, 2, 1),
            reporting_period_end=datetime.date(2020, 1, 31)
        )
        self.get_indicators()

    def tearDown(self):
        self.response = None

    def get_indicators(self):
        for c, kwargs in enumerate(self.indicator_kwargs):
            indicator = i_factories.IndicatorFactory(program=self.program,
                                                     number=c,
                                                     **kwargs['indicator'])
            for target_kwargs, period in zip(kwargs['targets'],
                                             self.program.get_periods_for_frequency(indicator.target_frequency)):
                target = i_factories.PeriodicTargetFactory(
                    indicator=indicator,
                    target=target_kwargs['target'],
                    start_date=period['start'],
                    end_date=period['end'],
                    customsort=period['customsort']
                )
                for date_collected, achieved in target_kwargs['results']:
                    i_factories.ResultFactory(
                        periodic_target=target,
                        indicator=indicator,
                        date_collected=date_collected,
                        achieved=achieved
                    )
            for date_collected, achieved in kwargs['results']:
                i_factories.ResultFactory(
                    indicator=indicator,
                    date_collected=date_collected,
                    achieved=achieved
                )

    def test_annual_values(self):
        response = json.loads(self.client.get(
            reverse('iptt_ajax'),
            {
                'programId': self.program.id,
                'frequency': Indicator.ANNUAL,
                'reporttype': 'timeperiods'
            }
        ).content)
        self.assertEqual(len(response['indicators']), len(self.indicator_kwargs))
        for response_indicator, kwargs in zip(response['indicators'], self.indicator_kwargs):
            for response_value, expected_value in zip(
                response_indicator['reportData']['timeperiods'][str(Indicator.ANNUAL)],
                kwargs['annual']):
                value = float(response_value) if response_value else None
                self.assertEqual(value, expected_value,
                                 "expected {0} got {1}\n kwargs {2}\n response {3}".format(
                                    expected_value, value, kwargs, response_indicator))

    def test_monthly_values(self):
        response = json.loads(self.client.get(
            reverse('iptt_ajax'),
            {
                'programId': self.program.id,
                'frequency': Indicator.MONTHLY,
                'reporttype': 'timeperiods'
            }
        ).content)
        self.assertEqual(len(response['indicators']), len(self.indicator_kwargs))
        for response_indicator, kwargs in zip(response['indicators'], self.indicator_kwargs):
            for month, expected_value in kwargs['monthly'].items():
                response_value = response_indicator['reportData']['timeperiods'][str(Indicator.MONTHLY)][month]
                response_value = float(response_value) if response_value else None
                self.assertEqual(response_value, expected_value,
                                 "expected {0} got {1}\n kwargs {2}\n response {3}".format(
                                    expected_value, response_value, kwargs, response_indicator))