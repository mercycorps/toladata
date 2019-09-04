# -*- coding: utf-8 -*-
import datetime

from django import test
from django.utils import translation

from indicators.models import Indicator
from workflow.models import Program
from factories.workflow_models import RFProgramFactory
from factories.indicators_models import RFIndicatorFactory


class TestProgramGeneration(test.TestCase):

    def get_program(self, **kwargs):
        return Program.objects.get(pk=RFProgramFactory(**kwargs).pk)

    def test_active_program(self):
        p = self.get_program()
        self.assertEqual(p.funding_status, "Funded")

    def test_inactive_program(self):
        p = RFProgramFactory(active=False)
        self.assertEqual(p.funding_status, "Inactive")

    def test_closed_program(self):
        p = self.get_program()
        # is closed:
        self.assertLess(p.reporting_period_start, datetime.date.today())
        self.assertLess(p.reporting_period_end, datetime.date.today())
        # less/greater for leap years:
        self.assertLessEqual(p.reporting_period_end-p.reporting_period_start, datetime.timedelta(days=365))
        self.assertGreaterEqual(p.reporting_period_end-p.reporting_period_start, datetime.timedelta(days=364))
        p2 = self.get_program(months=24)
        # is closed:
        self.assertLess(p2.reporting_period_start, datetime.date.today())
        self.assertLess(p2.reporting_period_end, datetime.date.today())
       # less/greater for leap years:
        self.assertLessEqual(p2.reporting_period_end-p2.reporting_period_start, datetime.timedelta(days=730))
        self.assertGreaterEqual(p2.reporting_period_end-p2.reporting_period_start, datetime.timedelta(days=729))

    def test_open_program(self):
        p = self.get_program(closed=False)
        # is open:
        self.assertLess(p.reporting_period_start, datetime.date.today())
        self.assertGreater(p.reporting_period_end, datetime.date.today())
        # is one year (less/greater for leap years)
        self.assertLessEqual(p.reporting_period_end-p.reporting_period_start, datetime.timedelta(days=365))
        self.assertGreaterEqual(p.reporting_period_end-p.reporting_period_start, datetime.timedelta(days=364))
        p2 = self.get_program(closed=False, months=3)
        # is open:
        self.assertLess(p2.reporting_period_start, datetime.date.today())
        self.assertGreater(p2.reporting_period_end, datetime.date.today())
        # is one year (less/greater for weird short months)
        self.assertLessEqual(p2.reporting_period_end-p2.reporting_period_start, datetime.timedelta(days=91))
        self.assertGreaterEqual(p2.reporting_period_end-p2.reporting_period_start, datetime.timedelta(days=88))

    def test_open_program_set_age(self):
        p = self.get_program(closed=False, age=2, months=10)
        # is open:
        self.assertLess(p.reporting_period_start, datetime.date.today())
        first_of_this_month = datetime.date(datetime.date.today().year, datetime.date.today().month, 1)
        self.assertLessEqual(first_of_this_month - p.reporting_period_start, datetime.timedelta(days=63))
        self.assertGreaterEqual(first_of_this_month - p.reporting_period_start, datetime.timedelta(days=58))
        self.assertGreater(p.reporting_period_end, datetime.date.today())
        # is one year (less/greater for leap years)
        self.assertLessEqual(p.reporting_period_end-p.reporting_period_start, datetime.timedelta(days=305))
        self.assertGreaterEqual(p.reporting_period_end-p.reporting_period_start, datetime.timedelta(days=302))

    def test_migration_status(self):
        p = self.get_program()
        self.assertEqual(p.results_framework, True)
        self.assertEqual(p._using_results_framework, p.RF_ALWAYS)
        p2 = self.get_program(migrated=False)
        self.assertEqual(p2.results_framework, False)
        self.assertEqual(p2._using_results_framework, p2.NOT_MIGRATED)
        p3 = self.get_program(migrated=True)
        self.assertEqual(p3.results_framework, True)
        self.assertEqual(p3._using_results_framework, p3.MIGRATED)

    def test_numbering_status(self):
        p = self.get_program()
        self.assertFalse(p.manual_numbering)
        p2 = self.get_program(migrated=False)
        self.assertTrue(p2.manual_numbering)
        p3 = self.get_program(migrated=True)
        self.assertFalse(p3.manual_numbering)
        p4 = self.get_program(auto_number_indicators=False)
        self.assertTrue(p4.manual_numbering)

    def test_tier_generation(self):
        p = self.get_program(tiers=True)
        tiers = p.level_tiers.all()
        self.assertEqual(len(tiers), 4)
        self.assertEqual(tiers[2].name, "Output")
        p2 = self.get_program(tiers=["Custom1", "Custom2", "Custom3"])
        tiers2 = p2.level_tiers.all()
        self.assertEqual(len(tiers2), 3)
        self.assertEqual(tiers2[1].name, "Custom2")
        self.assertEqual(tiers2[2].tier_depth, 3)

    def test_tier_translation(self):
        p = self.get_program(tiers=True)
        tier = p.level_tiers.filter(tier_depth=2)[0]
        self.assertEqual(tier.name, 'Outcome')
        translation.activate('fr')
        self.assertEqual(translation.ugettext(tier.name), u'Résultat')
        translation.activate('en')

    def test_level_generation(self):
        p = self.get_program()
        tiers = p.level_tiers.all()
        self.assertEqual(len(tiers), 0)
        levels = p.levels.all()
        self.assertEqual(len(levels), 0)
        p2 = self.get_program(tiers=True, levels=1)
        levels = p2.levels.all()
        self.assertEqual(len(levels), 4)
        self.assertEqual(levels[1].parent, levels[0])
        self.assertEqual(levels[3].leveltier.name, "Activity", levels)
        p3 = self.get_program(tiers=["Custom1", "Custom2", "Custom3"], levels=2)
        levels = p3.levels.all()
        self.assertEqual(len(levels), 7)
        tier2_levels = levels.filter(parent=levels[0])
        self.assertEqual(len(tier2_levels), 2)
        self.assertEqual(tier2_levels[1].name, "Tier: Custom2 Order: 2")
        self.assertEqual(tier2_levels[1].ontology, "1.2.0")

    def test_indicator_generation_old_levels(self):
        p = self.get_program(migrated=False, indicators=2)
        indicators = p.indicator_set.all()
        self.assertEqual(len(indicators), 2)
        p2 = self.get_program(migrated=False, indicators=5, indicators__levels=True)
        indicators = p2.indicator_set.filter(old_level="Impact")
        self.assertEqual(len(indicators), 1)

    def test_indicator_generation_mc_levels(self):
        p = self.get_program(tiers=True, levels=2, indicators=30, indicators__levels=True)
        self.assertEqual(len(p.indicator_set.all()), 30)
        self.assertEqual(len(p.levels.all()), 15)
        level = [l for l in p.levels.all() if l.level_depth == 3][0]
        indicators = p.indicator_set.filter(level=level)
        self.assertEqual(len(indicators), 2)
        self.assertEqual(indicators[0].leveltier_name, u"Output")

    def test_indicator_generation_custom_levels(self):
        p = self.get_program(tiers=[u"Custøm1", u"Cüstom2"], levels=3, indicators=12, indicators__levels=True)
        self.assertEqual(len(p.indicator_set.all()), 12)
        self.assertEqual(len(p.levels.all()), 4)
        level = [l for l in p.levels.all() if l.level_depth == 2][0]
        indicators = p.indicator_set.filter(level=level)
        self.assertEqual(len(indicators), 3)
        self.assertEqual(indicators[0].leveltier_name, u"Cüstom2")

    def test_level_generation_custom_level_data(self):
        p = self.get_program(
            tiers=[u"Custom1", u"Custom2", u"Custom3"],
            levels=[(1,), ((2,),), (((1, 3),),)],
            levels__pks=[905, 906, 907, 908, 909, 910, 911]
        )
        self.assertEqual(len(p.levels.all()), 7)
        top_tier = p.levels.filter(parent=None)
        self.assertEqual(len(top_tier), 1)
        top_tier = top_tier.first()
        self.assertEqual(top_tier.pk, 905)
        second_tier = p.levels.filter(parent=top_tier)
        self.assertEqual(len(second_tier), 2)
        third_tier_a = p.levels.filter(parent=906)
        self.assertEqual(len(third_tier_a), 1)
        third_tier_b = p.levels.filter(parent=907)
        self.assertEqual(len(third_tier_b), 3)

    def test_indicator_generation_incomplete(self):
        p = self.get_program(
            tiers=True, levels=1, indicators=4, indicators__levels=True,
            indicators__all={'target_frequency': Indicator.TRI_ANNUAL, 'targets': True},
            indicators__1={'targets': 'incomplete'},
        )
        indicators = p.indicator_set.order_by('pk').all()
        good_indicator = indicators[3]
        bad_indicator = indicators[1]
        self.assertEqual(bad_indicator.target_frequency, Indicator.TRI_ANNUAL)
        self.assertEqual(bad_indicator.periodictargets.count(), 2)
        self.assertEqual(good_indicator.periodictargets.count(), 3)


class TestNewIndicatorFactory(test.TestCase):
    def test_complete_targets(self):
        p = RFProgramFactory(months=18)
        i = RFIndicatorFactory(program=p, target_frequency=Indicator.SEMI_ANNUAL, targets=True)
        self.assertEqual(i.target_frequency, Indicator.SEMI_ANNUAL)
        self.assertEqual(i.periodictargets.count(), 3)
        self.assertEqual(i.periodictargets.order_by('start_date').first().start_date, p.reporting_period_start)
        self.assertEqual(i.periodictargets.order_by('-end_date').first().end_date, p.reporting_period_end)

    def test_incomplete_targets(self):
        p = RFProgramFactory(months=24)
        i = RFIndicatorFactory(
            program=p, target_frequency=RFIndicatorFactory._meta.model.QUARTERLY, targets="incomplete"
        )
        self.assertEqual(i.periodictargets.count(), 7)
        self.assertLess(i.periodictargets.order_by('-end_date').first().end_date, p.reporting_period_end)