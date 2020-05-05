import itertools
import datetime
import operator
from django import test
from django.utils import translation
from factories.indicators_models import RFIndicatorFactory
from factories.workflow_models import RFProgramFactory, SiteProfileFactory
from indicators.models import Indicator
from tola.test.utils import lang_context
from workflow.serializers_new import (
    ProgramPageProgramSerializer,
    #ProgramRFOrderingUpdateSerializer,
    ProgramPageIndicatorUpdateSerializer,
)

PROGRAM_PAGE_QUERIES = 4
PROGRAM_PAGE_UPDATE_QUERIES = PROGRAM_PAGE_QUERIES + 1

class TestProgramPageProgramSerializer(test.TestCase):
    def get_serialized_data(self, program_pk):
        with self.assertNumQueries(PROGRAM_PAGE_QUERIES):
            return ProgramPageProgramSerializer.load_for_pk(program_pk).data

    def get_program_data(self, **kwargs):
        program = RFProgramFactory(**kwargs)
        return self.get_serialized_data(program.pk)

    def test_needs_additional_target_periods_false(self):
        p = RFProgramFactory()
        RFIndicatorFactory(program=p, target_frequency=Indicator.TRI_ANNUAL, targets=500)
        data = self.get_serialized_data(p.pk)
        self.assertFalse(data['needs_additional_target_periods'])

    def test_needs_additional_target_periods_true(self):
        p = RFProgramFactory()
        i = RFIndicatorFactory(program=p, target_frequency=Indicator.TRI_ANNUAL, targets=500)
        i.periodictargets.last().delete()
        data = self.get_serialized_data(p.pk)
        self.assertTrue(data['needs_additional_target_periods'])

    def test_needs_additional_target_periods_no_indicators(self):
        data = self.get_program_data()
        self.assertFalse(data['needs_additional_target_periods'])

    def test_needs_additional_target_periods_no_targets(self):
        p = RFProgramFactory()
        i = RFIndicatorFactory(program=p, target_frequency=Indicator.ANNUAL)
        i.periodictargets.all().delete()
        data = self.get_serialized_data(p.pk)
        self.assertFalse(data['needs_additional_target_periods'])

    def test_needs_additional_target_periods_no_target_frequency(self):
        p = RFProgramFactory()
        RFIndicatorFactory(program=p, target_frequency=None)
        data = self.get_serialized_data(p.pk)
        self.assertFalse(data['needs_additional_target_periods'])

    def test_needs_additional_target_periods_no_reporting_period_end(self):
        p = RFProgramFactory()
        RFIndicatorFactory(program=p, target_frequency=Indicator.TRI_ANNUAL, targets=1000)
        p.reporting_period_end = None
        p.save()
        data = self.get_serialized_data(p.pk)
        self.assertFalse(data['needs_additional_target_periods'])

    def test_site_count_zero(self):
        data = self.get_program_data()
        self.assertEqual(data['site_count'], 0)

    def test_site_count_non_zero(self):
        p = RFProgramFactory()
        i = RFIndicatorFactory(
            program=p, target_frequency=Indicator.LOP, targets=1000,
            results=800, results__count=10
        )
        for result in i.result_set.all():
            result.site.add(
                SiteProfileFactory()
            )
        i2 = RFIndicatorFactory(
            program=p, target_frequency=Indicator.ANNUAL, targets=50,
            results=80, results__count=3
        )
        for result in i2.result_set.all():
            result.site.add(
                SiteProfileFactory()
            )
        data = self.get_serialized_data(p.pk)
        self.assertEqual(data['site_count'], 13)

    def test_level_count_zero(self):
        data = self.get_program_data()
        self.assertFalse(data['has_levels'])

    def test_level_count_nonzero(self):
        data = self.get_program_data(tiers=['Tier1', 'Tier2'], levels=2)
        self.assertTrue(data['has_levels'])

    def test_gait_url_empty(self):
        data = self.get_program_data(gaitid=None)
        self.assertEqual(data['gait_url'], None)

    def test_gait_url(self):
        data = self.get_program_data(gaitid=1423)
        self.assertEqual(
            data['gait_url'],
            'https://gait.mercycorps.org/editgrant.vm?GrantID=1423'
            )

    def test_time_period_info_non_time_aware(self):
        p = RFProgramFactory()
        for frequency in [Indicator.LOP, Indicator.MID_END]:
            RFIndicatorFactory(
                program=p, target_frequency=frequency, targets=100
            )
        data = self.get_serialized_data(p.pk)
        tp_data = data['target_period_info']
        self.assertTrue(tp_data['lop'])
        self.assertTrue(tp_data['midend'])
        self.assertFalse(tp_data['event'])
        self.assertFalse(tp_data['time_targets'])
        self.assertFalse(tp_data['annual'])
        self.assertFalse(tp_data['semi_annual'])
        self.assertFalse(tp_data['tri_annual'])
        self.assertFalse(tp_data['quarterly'])
        self.assertFalse(tp_data['monthly'])

    def test_time_period_info_time_aware(self):
        p = RFProgramFactory(
            reporting_period_start=datetime.date(2016, 1, 1),
            reporting_period_end=datetime.date(2024, 12, 31)
        )
        for frequency in Indicator.REGULAR_TARGET_FREQUENCIES:
            RFIndicatorFactory(
                program=p, target_frequency=frequency, targets=500,
            )
        data = self.get_serialized_data(p.pk)
        today = datetime.date.today()
        annual = datetime.date(today.year, 1, 1)-datetime.timedelta(days=1)
        semi_annual = datetime.date(
            today.year,
            7 if today.month > 6 else 1,
            1
        ) - datetime.timedelta(days=1)
        tri_annual = datetime.date(
            today.year,
            (today.month-1) // 4 * 4 + 1,
            1
        ) - datetime.timedelta(days=1)
        quarterly = datetime.date(
            today.year,
            (today.month-1) // 3 * 3 + 1,
            1
        ) - datetime.timedelta(days=1)
        monthly = datetime.date(
            today.year,
            today.month,
            1
        ) - datetime.timedelta(days=1)
        tp_data = data['target_period_info']
        self.assertFalse(tp_data['lop'])
        self.assertFalse(tp_data['midend'])
        self.assertFalse(tp_data['event'])
        self.assertTrue(tp_data['time_targets'])
        self.assertEqual(tp_data['annual'], annual.isoformat())
        self.assertEqual(tp_data['semi_annual'], semi_annual.isoformat())
        self.assertEqual(tp_data['tri_annual'], tri_annual.isoformat())
        self.assertEqual(tp_data['quarterly'], quarterly.isoformat())
        self.assertEqual(tp_data['monthly'], monthly.isoformat())


class TestProgramPageSerializersFunctional(test.TestCase):
    def get_serialized_data(self, program_pk):
        with self.assertNumQueries(PROGRAM_PAGE_QUERIES):
            return ProgramPageProgramSerializer.load_for_pk(program_pk).data

    def get_ordering_update_serialized_data(self, program_pk):
        with self.assertNumQueries(PROGRAM_PAGE_QUERIES):
            return ProgramPageIndicatorUpdateSerializer.load_for_pk(program_pk).data

    def get_update_indicator_data(self, program_pk, indicator_pk):
        with self.assertNumQueries(PROGRAM_PAGE_UPDATE_QUERIES):
            return ProgramPageIndicatorUpdateSerializer.load_for_indicator_and_program(indicator_pk, program_pk).data

    def test_rf_program_two_indicators(self):
        p = RFProgramFactory(
            tiers=['Tier1', 'Tier2'], levels=1,
            reporting_period_start=datetime.date(2014, 5, 1)
        )
        for level in p.levels.all():
            RFIndicatorFactory(program=p, level=level)
        data = self.get_serialized_data(p.pk)
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
        data = self.get_serialized_data(p.pk)
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
        with lang_context('fr'):
            french_data = self.get_serialized_data(p.pk)
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
        pks.append(RFIndicatorFactory(program=p, level=None, number='A1').pk)
        pks.append(RFIndicatorFactory(program=p, level=None, old_level='Outcome', number='X21').pk)
        pks.append(RFIndicatorFactory(program=p, level=None, old_level='Outcome', number='C14').pk)
        pks.append(RFIndicatorFactory(program=p, level=None, old_level='Goal').pk)
        unassigned_pks = pks[::-1]
        all_levels = list(p.levels.all())
        levels_in_order = []
        parents = sorted([l for l in all_levels if l.parent is None], key=operator.attrgetter('customsort'))
        while parents:
            for parent in parents:
                children = sorted([l for l in all_levels if l.parent == parent], key=operator.attrgetter('customsort'))
                levels_in_order += children
                parents = children
        for level in list(reversed(levels_in_order)):
            pks.append(RFIndicatorFactory(program=p, level=level).pk)
        expected_pks = [goal_pk_a, goal_pk_b] + list(reversed(pks))
        data = self.get_serialized_data(p.pk)
        self.assertEqual(data['by_result_chain'], 'by Outcome chain')
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
        with lang_context('fr'):
            french_data = self.get_serialized_data(p.pk)
        self.assertEqual(french_data['by_result_chain'], 'par chaîne Résultat')
        self.assertEqual(french_data['indicators'][goal_pk_b]['number'], 'Objectif b')
        self.assertEqual(french_data['indicators'][expected_pks[6]]['number'], 'Rendement 1.2a')
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
        data = self.get_serialized_data(p.pk)
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
        data = self.get_serialized_data(p.pk)
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
        full_data = self.get_serialized_data(p.pk)
        data = self.get_ordering_update_serialized_data(p.pk)
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
        full_data = self.get_serialized_data(p.pk)
        data = self.get_update_indicator_data(p.pk, indicator.pk)
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
