# -*- coding: utf-8 -*-
"""Excel endpoints (Timeperiods, TvA, and TvA full report) tested to ensure they download parsable content"""

from django import test
from django.urls import reverse
from factories import (
    workflow_models as w_factories,
    indicators_models as i_factories
)
from indicators.models import Indicator


class IPTTDownloadTestCases:

    def test_timeperiods_monthly_download(self):
        params = {
            'reportType': '2',
            'programId': self.program.pk,
            'frequency': '7'
        }
        response = self.client.get(reverse('iptt_excel'), params)
        self.assertEqual(response.status_code, 200)

    def test_timeperiods_annual_download(self):
        params = {
            'reportType': '2',
            'programId': self.program.pk,
            'frequency': '3'
        }
        response = self.client.get(reverse('iptt_excel'), params)
        self.assertEqual(response.status_code, 200)

    def test_timeperiods_group_by_levels_download(self):
        params = {
            'reportType': '2',
            'programId': self.program.pk,
            'groupby': '2',
            'frequency': '7'
        }
        response = self.client.get(reverse('iptt_excel'), params)
        self.assertEqual(response.status_code, 200)

    def test_timeperiods_limited_download(self):
        params = {
            'reportType': '2',
            'programId': self.program.pk,
            'frequency': '6',
            'start': '1',
            'end': '2'
        }
        response = self.client.get(reverse('iptt_excel'), params)
        self.assertEqual(response.status_code, 200)

    def test_tva_download(self):
        params = {
            'reportType': '1',
            'programId': self.program.pk,
            'frequency': '7'
        }
        response = self.client.get(reverse('iptt_excel'), params)
        self.assertEqual(response.status_code, 200)

    def test_tva_lop_download(self):
        params = {
            'reportType': '1',
            'programId': self.program.pk,
            'frequency': '1'
        }
        response = self.client.get(reverse('iptt_excel'), params)
        self.assertEqual(response.status_code, 200)

    def test_tva_limited_download(self):
        params = {
            'reportType': '1',
            'programId': self.program.pk,
            'frequency': '4',
            'start': '1',
            'end': '2'
        }
        response = self.client.get(reverse('iptt_excel'), params)
        self.assertEqual(response.status_code, 200)

    def test_tva_full_report_download(self):
        params = {
            'programId': self.program.pk,
            'fullTVA': 'true'
        }
        response = self.client.get(reverse('iptt_excel'), params)
        self.assertEqual(response.status_code, 200)


class TestRFExcelDownload(test.TestCase, IPTTDownloadTestCases):
    def setUp(self):
        country = w_factories.CountryFactory()
        self.program = w_factories.RFProgramFactory(tiers=True, levels=2)
        self.program.country.add(country)
        for level in self.program.levels.all():
            i_factories.RFIndicatorFactory(program=self.program, level=level, targets=500, results=400)
        tola_user = w_factories.TolaUserFactory(country=country)
        w_factories.grant_program_access(tola_user, self.program, country, 'high')
        self.client.force_login(tola_user.user)


class TestNonRFExcelDownload(test.TestCase, IPTTDownloadTestCases):
    def setUp(self):
        country = w_factories.CountryFactory()
        self.program = w_factories.RFProgramFactory(migrated=False)
        self.program.country.add(country)
        for _, level in Indicator.OLD_LEVELS:
            i_factories.RFIndicatorFactory(program=self.program, old_level=level, targets=500, results=400)
        tola_user = w_factories.TolaUserFactory(country=country)
        w_factories.grant_program_access(tola_user, self.program, country, 'high')
        self.client.force_login(tola_user.user)

class TestRFSpecialcharsExcelDownload(test.TestCase, IPTTDownloadTestCases):
    def setUp(self):
        country = w_factories.CountryFactory()
        self.program = w_factories.RFProgramFactory(tiers=['Spécîål Chars', '##1!@!#$', 'asdf'], levels=2)
        self.program.country.add(country)
        for level in self.program.levels.all():
            i_factories.RFIndicatorFactory(program=self.program, level=level, targets=500, results=400)
        tola_user = w_factories.TolaUserFactory(country=country)
        w_factories.grant_program_access(tola_user, self.program, country, 'high')
        self.client.force_login(tola_user.user)