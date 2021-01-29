# -*- coding: utf-8 -*-
from unittest import skip

from django.test import TestCase
from django.urls import reverse
from django.utils import translation

from factories import PinnedReportFactory
from indicators import models

from factories.workflow_models import (
    ProgramFactory,
    TolaUserFactory,
    UserFactory
)


class PinnedReportTestCase(TestCase):
    """
    Set up some base entities in the DB
    """

    def setUp(self):
        self.user = UserFactory(first_name="PeterPeter", last_name="PumpkinEater", username="PPPE")
        self.user.set_password('orangethumb')
        self.user.save()
        self.tola_user = TolaUserFactory(user=self.user)
        self.country = self.tola_user.country
        self.program = ProgramFactory(
            funding_status='Funded', reporting_period_start='2016-03-01', reporting_period_end='2020-05-01')
        self.program.country.add(self.country)
        self.program.save()

        # TolaUser not available on User if not logged in
        self.client.login(username=self.user.username, password='orangethumb')


class TestUrlCreationFromPinnedReport(TestCase):
    """
    From a saved report, can a GET URL be reconstituted
    """

    def setUp(self):
        self.pinned_report = models.PinnedReport(
            name='Test Pinned Report',
            program_id=42,
            report_type='timeperiods',
            query_string='level=3&level=2&timeframe=1&numrecentperiods=&indicators=5476&targetperiods=1',
        )

    def test_url_from_pinned_report(self):
        url_str = self.pinned_report.report_url
        expected = '/indicators/iptt_report/42/timeperiods/?level=3&level=2&timeframe=1&numrecentperiods=&indicators=5476&targetperiods=1'

        self.assertEquals(url_str, expected)

class TestCreatePinnedReport(PinnedReportTestCase):
    """
    Test AJAX call for creating a pinned report
    """

    def test_successful_create(self):
        report_name = 'Test report name'
        report_type = 'reporttype'
        query_string = 'level=3&level=2&timeframe=1&numrecentperiods=&indicators=5476&targetperiods=1'

        data = {
            'name': report_name,
            'program': self.program.id,
            'report_type': report_type,
            'query_string': query_string,
        }

        path = reverse('create_pinned_report')
        response = self.client.post(path, data=data)

        self.assertEqual(response.status_code, 200)

        pr = models.PinnedReport.objects.get()
        self.assertEquals(pr.name, report_name)
        self.assertEquals(pr.program_id, self.program.id)
        self.assertEquals(pr.report_type, report_type)
        self.assertEquals(pr.query_string, query_string)
        self.assertEquals(pr.tola_user_id, self.tola_user.id)

    def test_invalid_data_create(self):
        data = {
            # no post data!
        }

        path = reverse('create_pinned_report')
        response = self.client.post(path, data=data)

        self.assertEqual(response.status_code, 400)
        self.assertEquals(models.PinnedReport.objects.count(), 0)

    def test_duplicate_name_create(self):
        report_name = 'Test report name unique'
        report_type = 'reporttype'
        query_string = 'level=3&level=2&timeframe=1&numrecentperiods=&indicators=5476&targetperiods=1'
        data = {
            'name': report_name,
            'program': self.program.id,
            'report_type': report_type,
            'query_string': query_string,
        }
        path = reverse('create_pinned_report')
        # create report initially: should succeed
        response = self.client.post(path, data=data)
        self.assertEqual(response.status_code, 200)

        # create report with same name, should fail:
        response = self.client.post(path, data=data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['success'], False)
        self.assertEqual(response.json()['error_code'], 'DUPLICATE')



class TestPinnedReportDateStrings(TestCase):
    """
    Date range strings vary depending on query string args - test possibilities
    """
    def test_fixed_date_range_timeperiods(self):
        pr = models.PinnedReport()
        pr.query_string = 'timeperiods=7&numrecentperiods=&start_period=2018-01-01&end_period=2018-06-30'

        self.assertEqual(pr.date_range_str, u'Jan 1, 2018 – Jun 30, 2018')

    def test_fixed_date_range_targetperiods(self):
        pr = models.PinnedReport()
        pr.query_string = 'start_period=2017-07-01&numrecentperiods=&end_period=2020-06-30&targetperiods=3'

        self.assertEqual(pr.date_range_str, u'Jul 1, 2017 – Jun 30, 2020')

    def test_relative_to_today_timeperiods(self):
        pr = models.PinnedReport()
        pr.query_string = 'timeperiods=7&numrecentperiods=2&timeframe=2'

        self.assertEqual(pr.date_range_str, 'Most recent 2 months')

        pr.query_string = 'timeperiods=3&numrecentperiods=2&timeframe=2'

        self.assertEqual(pr.date_range_str, 'Most recent 2 years')

    def test_relative_to_today_targetperiods(self):
        pr = models.PinnedReport()
        pr.query_string = 'targetperiods=7&numrecentperiods=2&timeframe=2'

        self.assertEqual(pr.date_range_str, 'Most recent 2 months')

        pr.query_string = 'targetperiods=3&numrecentperiods=2&timeframe=2'

        self.assertEqual(pr.date_range_str, 'Most recent 2 years')

        pr.query_string = 'targetperiods=4&numrecentperiods=2&timeframe=2'

        self.assertEqual(pr.date_range_str, 'Most recent 2 semi-annual periods')

    def test_show_all(self):
        pr = models.PinnedReport()
        pr.query_string = 'timeperiods=4&numrecentperiods=&timeframe=1'

        self.assertEqual(pr.date_range_str, 'Show all semi-annual periods')

    def test_midline_endline(self):
        pr = models.PinnedReport()
        pr.query_string = 'targetperiods=2&timeframe=1'

        self.assertEqual(pr.date_range_str, 'Show all results')

    def test_lop(self):
        pr = models.PinnedReport()
        pr.query_string = 'targetperiods=1&timeframe=1'

        self.assertEqual(pr.date_range_str, 'Show all results')

    def test_missing_qs(self):
        pr = models.PinnedReport()
        pr.query_string = ''

        self.assertEqual(pr.date_range_str, '')

    def test_possible_bad_input(self):
        # the current quickstart UI allows this invalid form input -> query str
        pr = models.PinnedReport()
        pr.query_string = 'targetperiods=1&timeframe=2&numrecentperiods=2'

        self.assertEquals(pr.date_range_str, 'Show all results')


class TestPinnedReportDateStringsInSpanish(TestCase):
    """
    Date range strings vary depending on query string args - test possibilities in Spanish
    This is important for strings containing unicode chars
    """
    @classmethod
    def setUpClass(cls):
        super(TestPinnedReportDateStringsInSpanish, cls).setUpClass()
        translation.activate('es')

    @classmethod
    def tearDownClass(cls):
        translation.activate('en')
        super(TestPinnedReportDateStringsInSpanish, cls).tearDownClass()

    def test_fixed_date_range_timeperiods(self):
        pr = models.PinnedReport()
        pr.query_string = 'timeperiods=7&numrecentperiods=&start_period=2018-01-01&end_period=2018-06-30'

        self.assertEqual(pr.date_range_str, u'1 Ene. 2018 \u2013 30 Jun. 2018')

    def test_fixed_date_range_targetperiods(self):
        pr = models.PinnedReport()
        pr.query_string = 'start_period=2017-07-01&numrecentperiods=&end_period=2020-06-30&targetperiods=3'

        self.assertEqual(pr.date_range_str, u'1 Jul. 2017 \u2013 30 Jun. 2020')

    @skip('Translation PO files needed for final expected strings')
    def test_relative_to_today_timeperiods(self):
        pr = models.PinnedReport()
        pr.query_string = 'timeperiods=7&numrecentperiods=2&timeframe=2'

        self.assertEqual(pr.date_range_str, u'Most recent 2 Meses')

        pr.query_string = 'timeperiods=3&numrecentperiods=2&timeframe=2'

        self.assertEqual(pr.date_range_str, u'Most recent 2 A\xf1os')

    @skip('Translation PO files needed for final expected strings')
    def test_relative_to_today_targetperiods(self):
        pr = models.PinnedReport()
        pr.query_string = 'targetperiods=7&numrecentperiods=2&timeframe=2'

        self.assertEqual(pr.date_range_str, u'Most recent 2 Meses')

        pr.query_string = 'targetperiods=3&numrecentperiods=2&timeframe=2'

        self.assertEqual(pr.date_range_str, u'Most recent 2 A\xf1os')

        pr.query_string = 'targetperiods=4&numrecentperiods=2&timeframe=2'

        self.assertEqual(pr.date_range_str, u'Most recent 2 Periodos semestrales')

    @skip('Translation PO files needed for final expected strings')
    def test_show_all(self):
        pr = models.PinnedReport()
        pr.query_string = 'timeperiods=4&numrecentperiods=&timeframe=1'

        self.assertEqual(pr.date_range_str, u'Show all Periodos semestrales')

    @skip('Translation PO files needed for final expected strings')
    def test_midline_endline(self):
        pr = models.PinnedReport()
        pr.query_string = 'targetperiods=2&timeframe=1'

        self.assertEqual(pr.date_range_str, 'Show all results')

    @skip('Translation PO files needed for final expected strings')
    def test_lop(self):
        pr = models.PinnedReport()
        pr.query_string = 'targetperiods=1&timeframe=1'

        self.assertEqual(pr.date_range_str, 'Show all results')

    def test_missing_qs(self):
        pr = models.PinnedReport()
        pr.query_string = ''

        self.assertEqual(pr.date_range_str, '')

    @skip('Translation PO files needed for final expected strings')
    def test_possible_bad_input(self):
        # the current quickstart UI allows this invalid form input -> query str
        pr = models.PinnedReport()
        pr.query_string = 'targetperiods=1&timeframe=2&numrecentperiods=2'

        self.assertEquals(pr.date_range_str, 'Show all results')


class TestDefaultPinnedReport(TestCase):
    """
    Default pinned report for programs page
    """

    def test_default_report(self):
        default_report = models.PinnedReport.default_report(0)
        self.assertEquals(default_report.name, 'Recent progress for all indicators')
        self.assertEquals(default_report.date_range_str, 'Most recent 2 months')
        self.assertEquals(default_report.program_id, 0)


class TestPinnedReportListInProgramView(PinnedReportTestCase):
    """
    Verify list of pinned reports is as expected on program page view
    """

    def test_program_view_no_pinned_reports(self):
        response = self.client.get(self.program.program_page_url)

        self.assertEqual(response.status_code, 200)
        pinned_reports = response.context['pinned_reports']
        self.assertEquals(len(pinned_reports), 1)  # default report

    def test_program_view(self):
        # Create 3 reports, 1 tied to a different user
        for i in range(2):
            PinnedReportFactory(
                tola_user=self.tola_user,
                program=self.program,
            )

        other_user = UserFactory(first_name='Other', last_name='User', username='otheruser')
        other_tola_user = TolaUserFactory(user=other_user)
        PinnedReportFactory(
            tola_user=other_tola_user,
            program=self.program,
        )

        response = self.client.get(self.program.program_page_url)

        self.assertEqual(response.status_code, 200)
        pinned_reports = response.context['pinned_reports']
        self.assertEquals(len(pinned_reports), 3)  # 2 + 1 default

        # verify ordering - pinned reports should be sorted newest to oldest
        self.assertTrue(pinned_reports[0].creation_date > pinned_reports[1].creation_date)

    @skip('Translation PO files needed for final expected strings')
    def test_program_view_spanish_language(self):
        pr = PinnedReportFactory(
            tola_user=self.tola_user,
            program=self.program,
            query_string='timeperiods=3&numrecentperiods=2&timeframe=2'
        )

        self.tola_user.language = 'es'
        self.tola_user.save()

        response = self.client.get(self.program.program_page_url)

        self.assertEqual(response.status_code, 200)

        date_range_str_es = response.context['pinned_reports'][0].date_range_str
        self.assertEquals(date_range_str_es, u'Most recent 2 A\xf1os')

        pr.query_string = 'timeperiods=3&numrecentperiods=&timeframe=1'
        pr.save()

        response = self.client.get(self.program.program_page_url)

        self.assertEqual(response.status_code, 200)

        date_range_str_es = response.context['pinned_reports'][0].date_range_str
        self.assertEquals(date_range_str_es, u'Show all A\xf1os')


class TestDeletePinnedReportAPI(PinnedReportTestCase):
    """
    Test delete API call
    """

    def test_delete_of_pinned_report(self):
        pr = PinnedReportFactory(
            tola_user=self.tola_user,
            program=self.program,
        )

        self.assertEquals(models.PinnedReport.objects.count(), 1)

        data = {
            'pinned_report_id': pr.id,
        }

        response = self.client.post(reverse('delete_pinned_report'), data=data)

        self.assertEqual(response.status_code, 200)

        self.assertEquals(models.PinnedReport.objects.count(), 0)

    def test_delete_of_pinned_report_not_owned_by_user(self):
        other_user = UserFactory(first_name='Other', last_name='User', username='otheruser')
        other_tola_user = TolaUserFactory(user=other_user)
        pr = PinnedReportFactory(
            tola_user=other_tola_user,
            program=self.program,
        )

        self.assertEquals(models.PinnedReport.objects.count(), 1)

        data = {
            'pinned_report_id': pr.id,
        }

        response = self.client.post(reverse('delete_pinned_report'), data=data)

        self.assertEqual(response.status_code, 404)

        # nothing deleted!
        self.assertEquals(models.PinnedReport.objects.count(), 1)
