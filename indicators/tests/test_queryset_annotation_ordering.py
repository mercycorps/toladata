from factories.indicators_models import IndicatorFactory, LevelFactory
from factories.workflow_models import RFProgramFactory
from workflow.models import Program
from indicators.models import Indicator

from django import test


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
        programs = Program.objects.filter(pk__in=[200, 201, 202, 203, 204, 205, 206])
        self.assertEqual(len(programs), 2)

class TestRFLabeling(test.TestCase):
    def test_unmigrated_program(self):
        program = Program.objects.get(pk=RFProgramFactory(migrated=False).pk)
        self.assertEqual(program.using_results_framework, False)
        indicator = Indicator.rf_aware_objects.get(pk=IndicatorFactory(program=program).pk)
        self.assertEqual(indicator.using_results_framework, False)
        program_indicator = program.rf_aware_indicators.first()
        self.assertEqual(program_indicator.using_results_framework, False)

    def test_migrated_program(self):
        program = Program.objects.get(pk=RFProgramFactory(migrated=True).pk)
        self.assertEqual(program.using_results_framework, True)
        indicator = Indicator.rf_aware_objects.get(pk=IndicatorFactory(program=program).pk)
        self.assertEqual(indicator.using_results_framework, True)
        program_indicator = program.rf_aware_indicators.first()
        self.assertEqual(program_indicator.using_results_framework, True)

    def test_satsuma_program(self):
        program = Program.objects.get(pk=RFProgramFactory(migrated=None).pk)
        self.assertEqual(program.using_results_framework, True)
        indicator = Indicator.rf_aware_objects.get(pk=IndicatorFactory(program=program).pk)
        self.assertEqual(indicator.using_results_framework, True)
        program_indicator = program.rf_aware_indicators.first()
        self.assertEqual(program_indicator.using_results_framework, True)

class TestIndicatorOrdering(test.TestCase):
    numbers = [
        [
            '1.1.1',
            '1.1.1.1',
            '1.1.1.2',
            '1.1.2',
            '2',
            '2.1'
        ]
    ]

    def test_unmigrated_program_levels_sort(self):
        program = RFProgramFactory(migrated=False)
        IndicatorFactory(
            pk=300,
            program=program,
            old_level='Activity',
            number='1'
        )
        IndicatorFactory(
            pk=301,
            program=program,
            old_level='Outcome',
            number='2'
        )
        IndicatorFactory(
            pk=302,
            program=program,
            old_level=None,
            number='2.1'
        )
        IndicatorFactory(
            pk=303,
            program=program,
            old_level='Output',
            number='3'
        )

        self.assertEqual(Indicator.rf_aware_objects.get(pk=300).old_level_pk, 6)
        self.assertEqual(Indicator.rf_aware_objects.get(pk=302).old_level_pk, None)
        indicators = Indicator.rf_aware_objects.filter(program=program)
        self.assertEqual([i.pk for i in indicators], [301, 303, 300, 302])

    def test_migrated_program_old_levels_sort(self):
        program = RFProgramFactory(migrated=True, tiers=['Tier1', 'Tier2'], levels=1)
        levels = program.levels.all()
        IndicatorFactory(
            pk=400,
            program=program,
            old_level='Activity'
        )
        IndicatorFactory(
            pk=401,
            program=program,
            level=levels[1],
            old_level='Impact'
        )
        IndicatorFactory(
            pk=402,
            program=program,
            level=levels[1]
        )
        IndicatorFactory(
            pk=403,
            program=program,
            old_level='Goal'
        )
        self.assertEqual(Indicator.rf_aware_objects.get(pk=400).old_level_pk, 6)
        self.assertEqual(Indicator.rf_aware_objects.get(pk=401).old_level_pk, 0)
        self.assertEqual(Indicator.rf_aware_objects.get(pk=402).old_level_pk, 0)
        self.assertEqual(Indicator.rf_aware_objects.get(pk=403).old_level_pk, 1)
        self.assertEqual([i.pk for i in Indicator.rf_aware_objects.filter(pk__in=[400, 403])], [403, 400])


class TestIndicatorNumberLabeling(test.TestCase):
    numbers = [
        ('1.1.1', (None, 1, None)),
        ('1', (None, 1, None)),
        ('1.1', (None, 1, None)),
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
        program = Program.objects.get(pk=RFProgramFactory(migrated=False).pk)
        these_numbers = self.numbers[0]
        to_assign = these_numbers[0:]
        to_assign.reverse()
        for number in to_assign:
            IndicatorFactory(program=program, number=number)
        indicators = Indicator.rf_aware_objects.filter(program=program).in_order()
        self.assertEqual([i.number for i in indicators], these_numbers)

    def test_sorting_by_level_order_migrated(self):
        program = Program.objects.get(pk=RFProgramFactory(migrated=True).pk)
        level = LevelFactory(program=program)
        these_numbers = self.numbers[0]
        to_assign = these_numbers[0:]
        to_assign.reverse()
        for count, number in enumerate(to_assign):
            IndicatorFactory(program=program, number=number, level=level, level_order=count)
        indicators = Indicator.rf_aware_objects.filter(program=program).in_order()
        self.assertEqual([i.number for i in indicators], to_assign)
