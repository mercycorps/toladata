# -*- coding: utf-8 -*-
"""Tests for the Program Page Program serializer corresponding to js/pages/program_page/models/ProgramPageProgram"""

from __future__ import division
import datetime
from workflow.serializers_new import ProgramPageProgramSerializer
from workflow.models import Program
from factories.workflow_models import RFProgramFactory, SiteProfileFactory
from factories.indicators_models import RFIndicatorFactory
from indicators.models import Indicator
from django import test


class TestProgramPageProgramSerializer(test.TestCase):
    def get_program_data(self, **kwargs):
        return ProgramPageProgramSerializer(
            Program.program_page_objects.filter(pk=RFProgramFactory(**kwargs).pk), many=True
        ).data[0]

    def test_needs_additional_target_periods_false(self):
        p = RFProgramFactory()
        RFIndicatorFactory(program=p, target_frequency=Indicator.TRI_ANNUAL, targets=500)
        data = ProgramPageProgramSerializer(
            Program.program_page_objects.filter(pk=p.pk), many=True
        ).data[0]
        self.assertFalse(data['needs_additional_target_periods'])

    def test_needs_additional_target_periods_true(self):
        p = RFProgramFactory()
        i = RFIndicatorFactory(program=p, target_frequency=Indicator.TRI_ANNUAL, targets=500)
        i.periodictargets.last().delete()
        data = ProgramPageProgramSerializer(
            Program.program_page_objects.filter(pk=p.pk), many=True
        ).data[0]
        self.assertTrue(data['needs_additional_target_periods'])

    def test_needs_additional_target_periods_no_indicators(self):
        data = self.get_program_data()
        self.assertFalse(data['needs_additional_target_periods'])

    def test_needs_additional_target_periods_no_targets(self):
        p = RFProgramFactory()
        RFIndicatorFactory(program=p)
        data = ProgramPageProgramSerializer(
            Program.program_page_objects.filter(pk=p.pk), many=True
        ).data[0]
        self.assertFalse(data['needs_additional_target_periods'])

    def test_needs_additional_target_periods_no_reporting_period_end(self):
        p = RFProgramFactory()
        RFIndicatorFactory(program=p, target_frequency=Indicator.TRI_ANNUAL, targets=1000)
        p.reporting_period_end = None
        p.save()
        data = ProgramPageProgramSerializer(
            Program.program_page_objects.filter(pk=p.pk), many=True
        ).data[0]
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
        data = ProgramPageProgramSerializer.get_for_pk(p.pk).data
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
        data = ProgramPageProgramSerializer.get_for_pk(p.pk).data
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
        data = ProgramPageProgramSerializer.get_for_pk(p.pk).data
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