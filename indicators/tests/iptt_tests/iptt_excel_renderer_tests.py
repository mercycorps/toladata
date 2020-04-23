import decimal
from django import test
from indicators.export_renderers import (
    IPTTExcelRenderer,
)

tva = False

SPECIAL_CHARS = "Spécîal Chårs"

class FakePeriod:
    def __init__(self, **kwargs):
        self.header = kwargs.get('header')
        self.subheader = kwargs.get('subheader')
        self.count = kwargs.get('count')
        self.columns = kwargs.get('columns')
        if 'tva' in kwargs:
            self.tva = kwargs.get('tva')
        else:
            global tva
            self.tva = tva
        

class FakeSerializer:
    def __init__(self, data=None):
        self.filename = "Filename"
        if data is not None:
            self.data = data
        else:
            self.data = {
                'program_name': "Program Name",
                'results_framework': True,
                'report_date_range': "Jan 1 1900 – Dec 31 2000",
                'report_title': "Report Title",
                'frequencies': [4,],
                'lop_period': FakePeriod(**{
                    'header': None,
                    'subheader': 'LOP subheader',
                    'columns': [{'header': 'Target Header'}, {'header': 'Actual Header'}, {'header': '% Met Header'}],
                    'count': None,
                    'tva': True,
                }),
                'periods': {
                    4: [
                        FakePeriod(**{
                            'header': '4 Period 1 Header',
                            'subheader': '4 Period 1 Subheader',
                            'columns': [{'header': 'Target Header'}, {'header': 'Actual Header'},
                                {'header': '% Met Header'}],
                            'count': 0,
                        }),
                        FakePeriod(**{
                            'header': '4 Period 2 Header',
                            'subheader': '4 Period 2 Subheader',
                            'columns': [{'header': 'Target Header'}, {'header': 'Actual Header'},
                                {'header': '% Met Header'}],
                            'count': 1
                        }),
                    ]
                },
                'level_rows': {
                    4: (lr for lr in [
                        {
                            'level': {
                                'pk': 8,
                                'full_name': 'Goal level Name'
                            },
                            'indicators': []
                        },
                        {
                            'level': {
                                'pk': 10,
                                'full_name': 'Level Name',
                            },
                            'indicators': (i for i in [
                                {
                                    'program_pk': 45,
                                    'pk': 11,
                                    'name': 'Indicator 11',
                                    'number': 'Indicator number for 11',
                                    'unit_of_measure': 'Indicator 11 UOM',
                                    'direction_of_change': '+',
                                    'is_cumulative': False,
                                    'unit_of_measure_type': '#',
                                    'baseline': '100',
                                    'disaggregations': [{
                                        'pk': 100,
                                        'name': 'Disaggregation',
                                        'labels': [{'pk': 44, 'name': 'Label 1'}, {'pk': 45, 'name': 'Label 2'},],
                                        'has_results': False,
                                    }],
                                    'report_data': {
                                        'pk': 11,
                                        'lop_period': {
                                            'target': 200,
                                            'actual': 250,
                                            'met': decimal.Decimal('1.2500'),
                                            'disaggregations': {},
                                        },
                                        'periods': [
                                            {'actual': 50, 'count': 0, 'target': 100, 'met': decimal.Decimal('0.5000'),
                                             'disaggregations': {}},
                                            {'actual': 150, 'count': 1, 'target': 100, 'met': decimal.Decimal('1.5000'),
                                             'disaggregations': {},},
                                        ]
                                    }
                                },
                                {
                                    'program_pk': 45,
                                    'pk': 12,
                                    'name': 'Indicator 12',
                                    'number': 'Indicator number for 12',
                                    'unit_of_measure': 'Indicator 12 UOM',
                                    'direction_of_change': '-',
                                    'is_cumulative': True,
                                    'unit_of_measure_type': '%',
                                    'baseline': None,
                                    'disaggregations': [],
                                    'report_data': {
                                        'pk': 12,
                                        'lop_period': {
                                            'target': 100,
                                            'actual': None,
                                            'met': None,
                                        },
                                        'periods': [
                                            {'actual': None, 'count': 0, 'target': 45, 'met': None},
                                            {'actual': None, 'count': 1, 'target': 100, 'met': None},
                                        ]
                                    }
                                },
                            ]),
                        },
                        {
                            'level': {
                                'pk': None,
                                'full_name': 'Unassigned level name',
                            },
                            'indicators': (i for i in [
                                {
                                    'program_pk': 45,
                                    'pk': 13,
                                    'name': 'Indicator 13',
                                    'number': 'Indicator number for 13',
                                    'unit_of_measure': 'Indicator 13 UOM',
                                    'direction_of_change': None,
                                    'is_cumulative': False,
                                    'unit_of_measure_type': '#',
                                    'baseline': '10000.12',
                                    'disaggregations': [{
                                        'pk': 100,
                                        'name': 'Disaggregation',
                                        'labels': [{'pk': 44, 'name': 'Label 1'}, {'pk': 45, 'name': 'Label 2'},],
                                        'has_results': True,
                                    }],
                                    'report_data': {
                                        'pk': 11,
                                        'lop_period': {
                                            'target': 500,
                                            'actual': 300,
                                            'met': decimal.Decimal(0.6),
                                            'disaggregations': {44: {'actual': 150}, 45: {'actual': 150}},
                                        },
                                        'periods': [
                                            {'actual': 200, 'count': 0, 'target': 200, 'met': decimal.Decimal('1.00'),
                                             'disaggregations': {44: {'actual': 60}, 45: {'actual': 140}},
                                            },
                                            {'actual': 100, 'count': 1, 'target': 300, 'met': decimal.Decimal('0.3333'),
                                             'disaggregations': {44: {'actual': 90}, 45: {'actual': 10}},
                                            },
                                        ]
                                    }
                                },
                            ]),
                        }
                    ])
                }
            }

    def __getitem__(self, name):
        if name in self.data:
            return self.data[name]
        raise AttributeError(f"no attribute {name}")

class TestExcelRendererGlobals(test.TestCase):
    all_rows = {
        1: {
            3: 'Report Title'
        },
        2: {
            3: "Jan 1 1900 – Dec 31 2000"
        },
        3: {
            3: "Program Name",
            10: "LOP subheader",
        },
        4: {
            1: "Program ID",
            2: "Indicator ID",
            3: "No.",
            4: "Indicator",
            5: "Unit of measure",
            6: "Change",
            7: "C / NC",
            8: "# / %",
            9: "Baseline",
            10: "Target",
            11: "Actual",
            12: "% Met"
        },
    }
    all_indicator_rows = {
        5: {
            3: "Goal level Name"
        },
        6: {
            3: 'Level Name',
        },
        7: {
            1: 45,
            2: 11,
            3: 'Indicator number for 11',
            4: 'Indicator 11',
            5: 'Indicator 11 UOM',
            6: '+',
            7: "Not cumulative",
            8: "#",
            9: 100,
            10: 200,
            11: 250,
            12: 1.25
        },
        8: {
            3: "Disaggregation",
            4: "Label 1",
        },
        9: {
            4: "Label 2",
        },
        10: {
            1: 45,
            2: 12,
            3: 'Indicator number for 12',
            4: 'Indicator 12',
            5: 'Indicator 12 UOM',
            6: '-',
            7: "Cumulative",
            8: "%",
            9: '–',
            10: 1.00,
            11: '–',
            12: '–',
        },
        11: {
            3: 'Unassigned level name',
        },
        12: {
            1: 45,
            2: 13,
            3: 'Indicator number for 13',
            4: 'Indicator 13',
            5: 'Indicator 13 UOM',
            6: '',
            7: "Not cumulative",
            8: "#",
            9: 10000.12,
            10: 500,
            11: 300,
            12: 0.6,
        },
        13: {
            3: "Disaggregation",
            4: "Label 1",
            10: '–',
            11: 150,
            12: '–'
        },
        14: {
            4: "Label 2",
            10: '–',
            11: 150,
            12: '–',
        },
    }
    tp_rows = {
        7: {
            13: 50,
            14: 150
        },
        8: {
            13: '–',
            14: '–',
        },
        9: {
            13: '–',
            14: '–',
        },
        10: {
            13: '–',
            14: '–',
        },
        12: {
            13: 200,
            14: 100
        },
        13: {
            13: 60,
            14: 90,
        },
        14: {
            13: 140,
            14: 10,
        }
    }
    tva_rows = {
        7: {
            13: 100,
            14: 50,
            15: 0.5,
            16: 100,
            17: 150,
            18: 1.5,
        },
        8: {
            14: '–',
            17: '–',
        },
        9: {
            14: '–',
            17: '–',
        },
        10: {
            13: 0.45,
            14: '–',
            15: '–',
            16: 1,
            17: '–',
            18: '–',
        },
        12: {
            13: 200,
            14: 200,
            15: 1,
            16: 300,
            17: 100,
            18: 0.3333,
        },
        13: {
            13: '–',
            14: 60,
            15: '–',
            16: '–',
            17: 90,
            18: '–',
        },
        14: {
            13: '–',
            14: 140,
            15: '–',
            16: '–',
            17: 10,
            18: '–',
        }
    }
    def test_tp_serializer(self):
        global tva
        tva = False
        serializer = FakeSerializer()
        renderer = IPTTExcelRenderer(serializer)
        wb = renderer.wb
        self.assertEqual(len(wb.worksheets), 1)
        sheet = wb.worksheets[0]
        self.assertEqual(sheet.title, "Semi-annual")
        self.assertEqual(sheet.cell(row=1, column=3).value, "Report Title")
        for row, row_expectations in self.all_rows.items():
            for column, expected_value in row_expectations.items():
                self.assertEqual(sheet.cell(row=row, column=column).value, expected_value,
                                 f"Row {row} column {column} expected {expected_value}")
        for row, row_expectations in self.all_indicator_rows.items():
            for column, expected_value in row_expectations.items():
                self.assertEqual(sheet.cell(row=row, column=column).value, expected_value,
                                 f"Row {row} column {column} expected {expected_value}")
        for row, row_expectations in self.tp_rows.items():
            for column, expected_value in row_expectations.items():
                self.assertEqual(sheet.cell(row=row, column=column).value, expected_value,
                                 f"Row {row} column {column} expected {expected_value}")
        response = renderer.render_to_response()
        self.assertEqual(response['Content-Disposition'], 'attachment; filename="Filename"')

    def test_tva_serializer(self):
        global tva
        tva = True
        serializer = FakeSerializer()
        renderer = IPTTExcelRenderer(serializer)
        wb = renderer.wb
        self.assertEqual(len(wb.worksheets), 1)
        sheet = wb.worksheets[0]
        self.assertEqual(sheet.title, "Semi-annual")
        self.assertEqual(sheet.cell(row=1, column=3).value, "Report Title")
        for row, row_expectations in self.all_rows.items():
            for column, expected_value in row_expectations.items():
                self.assertEqual(sheet.cell(row=row, column=column).value, expected_value,
                                 f"Row {row} column {column} expected {expected_value}")
        for row, row_expectations in self.all_indicator_rows.items():
            for column, expected_value in row_expectations.items():
                self.assertEqual(sheet.cell(row=row, column=column).value, expected_value,
                                 f"Row {row} column {column} expected {expected_value}")
        for row, row_expectations in self.tva_rows.items():
            for column, expected_value in row_expectations.items():
                self.assertEqual(sheet.cell(row=row, column=column).value, expected_value,
                                 f"Row {row} column {column} expected {expected_value}")
        tva = False
        response = renderer.render_to_response()
        self.assertEqual(response['Content-Disposition'], 'attachment; filename="Filename"')

    def test_full_tva_serializer(self):
        global tva
        tva = True
        serializer = FakeSerializer(self.get_full_data())
        renderer = IPTTExcelRenderer(serializer)
        wb = renderer.wb
        self.assertEqual(len(wb.worksheets), 6)
        for c, (sheet, title) in enumerate(zip(
            wb.worksheets,
            ["Life of Program (LoP) only", "Midline and endline", "Annual",
             "Semi-annual", "Tri-annual", "Monthly"]
        )):
            self.assertEqual(sheet.title, title)
            for row, row_expectations in self.all_rows.items():
                for column, expected_value in row_expectations.items():
                    self.assertEqual(sheet.cell(row=row, column=column).value, expected_value,
                                     f"Row {row} column {column} expected {expected_value}")

    def get_full_data(self):
        return {
            'program_name': 'Program Name',
            'results_framework': True,
            'report_date_range': "Jan 1 1900 – Dec 31 2000",
            'report_title': 'Report Title',
            'frequencies': [1, 2, 3, 4, 5, 7],
            'lop_period': FakePeriod(**{
                'header': None,
                'subheader': 'LOP subheader',
                'columns': [{'header': 'Target Header'}, {'header': 'Actual Header'}, {'header': '% Met Header'}],
                'count': None,
                'tva': True,
            }),
            'periods': {
                freq: [FakePeriod(**{
                    'header': f'{freq} Period {count} Header',
                    'subheader': f'{freq} Period {count} Subheader',
                    'columns': [{'header': 'Target Header'}, {'header': 'Actual Header'},
                        {'header': '% Met Header'}],
                    'count': count,
                }) for count in range((freq-1)*2)] for freq in [1, 2, 3, 4, 5, 7]
            },
            'level_rows': {
                freq: (lr for lr in [
                    {
                        'level': {
                            'pk': 8,
                            'full_name': 'Goal level Name'
                        },
                        'indicators': (i for i in [
                            {
                                'program_pk': 45,
                                'pk': 1100 + freq,
                                'name': f'Indicator 11{freq}',
                                'number': f'Indicator number for 11{freq}',
                                'unit_of_measure': f'Indicator 11{freq} UOM',
                                'direction_of_change': '+',
                                'is_cumulative': False,
                                'unit_of_measure_type': '#',
                                'baseline': None,
                                'disaggregations': [{
                                    'pk': 100,
                                    'name': 'Disaggregation',
                                    'labels': [{'pk': 44, 'name': 'Label 1'}, {'pk': 45, 'name': 'Label 2'},],
                                    'has_results': True,
                                }],
                                'report_data': {
                                    'pk': 1100+freq,
                                    'lop_period': {
                                        'target': 200,
                                        'actual': 250,
                                        'met': decimal.Decimal('1.2500'),
                                        'disaggregations': {44: {'actual': 150}, 45: {'actual': 150}},
                                    },
                                    'periods': [
                                        {'actual': 50, 'count': c, 'target': 100+c, 'met': decimal.Decimal('0.5000'),
                                         'disaggregations': {44: {'actual': 10.5}, 45: {'actual': 95.5}},
                                        } for c in range((freq-1)*2)]
                                }
                            }
                        ]),
                    }, ]) for freq in [1, 2, 3, 4, 5, 7]
            }
        }