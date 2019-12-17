import operator
from factories.indicators_models import IndicatorFactory, LevelFactory
from factories.workflow_models import RFProgramFactory
from workflow.models import Program
from indicators.models import Indicator, Max, Min

from django import test

def unassigned_sort_func(indicator_set):
    indicators = []
    levels = sorted(
        sorted(
            list(set([indicator.level for indicator in [i for i in indicator_set if i.level_id is not None]])),
            key=operator.attrgetter('customsort')
            ),
        key=operator.attrgetter('level_depth')
    )
    for level in levels:
        indicators += sorted(
            [i for i in indicator_set if i.level_id == level.id],
            key=operator.attrgetter('level_order')
        )
    indicators += sorted(
        sorted(
            [i for i in indicator_set if i.level_id is None],
            key=lambda i: (i.sort_number is None, i.sort_number)
            ),
        key=lambda i: (i.old_level_pk is None, i.old_level_pk)
    )
    return indicators

class TestSoftDelete(test.TestCase):
    def test_soft_deleted_indicators_hidden(self):
        program = RFProgramFactory()
        IndicatorFactory(program=program)
        IndicatorFactory(program=program)
        deleted_indicator = IndicatorFactory(program=program)
        deleted_indicator.delete()
        self.assertEqual(len(program.indicator_set.all()), 2)
        self.assertEqual(len(Indicator.rf_aware_objects.filter(program=program)), 2)

class TestActivePrograms(test.TestCase):
    def test_active_programs(self):
        RFProgramFactory(pk=200)
        RFProgramFactory(pk=201)
        RFProgramFactory(pk=202, funding_status='Closed')
        RFProgramFactory(pk=203, funding_status='Archived')
        RFProgramFactory(pk=204, funding_status='Completed')
        RFProgramFactory(pk=205, funding_status='Approved')
        RFProgramFactory(pk=206, funding_status='Inactive')
        programs = Program.rf_aware_objects.filter(pk__in=[200, 201, 202, 203, 204, 205, 206])
        self.assertEqual(len(programs), 2)

class TestRFLabeling(test.TestCase):
    def test_unmigrated_program(self):
        program = Program.rf_aware_objects.get(pk=RFProgramFactory(migrated=False).pk)
        self.assertEqual(program.using_results_framework, False)
        indicator = Indicator.rf_aware_objects.get(pk=IndicatorFactory(program=program).pk)
        self.assertEqual(indicator.using_results_framework, False)
        program_indicator = program.rf_aware_indicators.first()
        self.assertEqual(program_indicator.using_results_framework, False)

    def test_migrated_program(self):
        program = Program.rf_aware_objects.get(pk=RFProgramFactory(migrated=True).pk)
        self.assertEqual(program.using_results_framework, True)
        indicator = Indicator.rf_aware_objects.get(pk=IndicatorFactory(program=program).pk)
        self.assertEqual(indicator.using_results_framework, True)
        program_indicator = program.rf_aware_indicators.first()
        self.assertEqual(program_indicator.using_results_framework, True)

    def test_satsuma_program(self):
        program = Program.rf_aware_objects.get(pk=RFProgramFactory(migrated=None).pk)
        self.assertEqual(program.using_results_framework, True)
        indicator = Indicator.rf_aware_objects.get(pk=IndicatorFactory(program=program).pk)
        self.assertEqual(indicator.using_results_framework, True)
        program_indicator = program.rf_aware_indicators.first()
        self.assertEqual(program_indicator.using_results_framework, True)



class TestIndicatorNumberLabeling(test.TestCase):
    numbers = [
        ('1.1.1', (Max, 1, Min)),
        ('1', (Max, 1, Min)),
        ('1.1', (Max, 1, Min)),
    ]
    def test_indicator_manual_sorting_manual_display_unmigrated(self):
        program = RFProgramFactory(migrated=False)
        indicator = Indicator.rf_aware_objects.get(pk=IndicatorFactory(program=program).pk)
        self.assertEqual(indicator.manual_number_display, True)
        for number, a in self.numbers:
            indicator = Indicator.rf_aware_objects.get(pk=IndicatorFactory(program=program, number=number).pk)
            self.assertEqual(indicator.sort_number[0], a)

    def test_indicator_manual_sorting_manual_display_migrated(self):
        program = RFProgramFactory(migrated=True)
        indicator = Indicator.rf_aware_objects.get(pk=IndicatorFactory(program=program).pk)
        self.assertEqual(indicator.manual_number_display, False)

    def test_indicator_manual_sorting_manual_display_migrated_auto_off(self):
        program = RFProgramFactory(migrated=True, auto_number_indicators=False)
        indicator = Indicator.rf_aware_objects.get(pk=IndicatorFactory(program=program).pk)
        self.assertEqual(indicator.manual_number_display, True)

    def test_indicator_manual_sorting_manual_display_rf_always(self):
        program = RFProgramFactory(migrated=None)
        indicator = Indicator.rf_aware_objects.get(pk=IndicatorFactory(program=program).pk)
        self.assertEqual(indicator.manual_number_display, False)

    def test_indicator_manual_sorting_manual_display_rf_always_auto_off(self):
        program = RFProgramFactory(migrated=None, auto_number_indicators=False)
        indicator = Indicator.rf_aware_objects.get(pk=IndicatorFactory(program=program).pk)
        self.assertEqual(indicator.manual_number_display, True)


class TestIndicatorNumberSorting(test.TestCase):
    numbers = [
        [
            '1.1.1', '1.1.1.1', '1.1.1.2', '1.1.2', '2', '2.1'
        ],
        [
            '1001', '1003', '1101', '1111', '2231'
        ],
        [
            '2.2.1', '2.2.1c', '2.2.1d', '2.2.2'
        ],
        [
            'Outcome 1', 'Output 3.1', 'Output 4.2'
        ],
        [
            '1.3.a', '1.3.b', '3.2.1', '4.b', '4.1', '4.1.1'
        ],
        [
            'C1', 'C4', 'C9', 'C20', 'PAH1', 'PAH4'
        ],
        [
            'C.1', '2.5', '3.1', '4.1'
        ]
    ]

    def test_manual_sorting_unmigrated(self):
        program = Program.objects.get(pk=RFProgramFactory(migrated=False).pk)
        self.assertEqual(program.manual_numbering, True)

    def test_manual_sorting_migrated(self):
        program = Program.objects.get(pk=RFProgramFactory(migrated=True).pk)
        self.assertEqual(program.manual_numbering, False)

    def test_manual_sorting_rf_always(self):
        program = Program.objects.get(pk=RFProgramFactory(migrated=None).pk)
        self.assertEqual(program.manual_numbering, False)

    def test_manual_sorting_migrated_auto_off(self):
        program = Program.objects.get(pk=RFProgramFactory(migrated=True, auto_number_indicators=False).pk)
        self.assertEqual(program.manual_numbering, True)

    def test_manual_sorting_rf_always_auto_off(self):
        program = Program.objects.get(pk=RFProgramFactory(migrated=None, auto_number_indicators=False).pk)
        self.assertEqual(program.manual_numbering, True)

    def test_sorting_by_numbers_unmigrated(self):
        program = Program.rf_aware_objects.get(pk=RFProgramFactory(migrated=False).pk)
        these_numbers = self.numbers[0]
        to_assign = these_numbers[0:]
        to_assign.reverse()
        for number in to_assign:
            IndicatorFactory(program=program, number=number)
        indicators = unassigned_sort_func(Indicator.rf_aware_objects.filter(program=program))
        self.assertEqual([i.number for i in indicators], these_numbers)

    def test_sorting_by_level_order_migrated(self):
        program = Program.objects.get(pk=RFProgramFactory(migrated=True).pk)
        level = LevelFactory(program=program)
        these_numbers = self.numbers[0]
        to_assign = these_numbers[0:]
        to_assign.reverse()
        for count, number in enumerate(to_assign):
            IndicatorFactory(program=program, number=number, level=level, level_order=count)
        indicators = unassigned_sort_func(Indicator.rf_aware_objects.filter(program=program))
        self.assertEqual([i.number for i in indicators], to_assign)
