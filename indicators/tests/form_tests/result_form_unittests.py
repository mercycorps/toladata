"""Unit tests for result_form_functional_tests.py
Systems:
    - indicators.views.ResultCreate
        - bad indicator id 404
        - get with good ids gives form
        - initial form data is correct
        - correct disaggregation values
        - form valid returns appropriate response
        - form invalid returns appropriate response
    - indicators.views.ResultUpdate
    - indicators.forms.ResultForm
"""
import datetime
from indicators.views import ResultCreate, ResultUpdate
from indicators.forms import ResultForm
from indicators.models import Indicator, Result
from factories import (
    indicators_models as i_factories,
    workflow_models as w_factories
)
from django.urls import reverse
from django.http import Http404
from django import test


class TestResultCreateUpdate404(test.TestCase):
    def setUp(self):
        self.program = w_factories.ProgramFactory()
        self.indicator = i_factories.IndicatorFactory(
            program=self.program
        )
        self.result = i_factories.ResultFactory(
            indicator=self.indicator
        )
        self.user = w_factories.UserFactory(first_name="FN", last_name="LN", username="tester", is_superuser=True)
        self.user.set_password('password')
        self.user.save()

        self.tola_user = w_factories.TolaUserFactory(user=self.user)
        self.tola_user.save()

        self.client = test.Client(enforce_csrf_checks=False)
        self.client.login(username='tester', password='password')

    def test_create_view_raises_404_with_bad_indicator_id(self):
        kwargs = {
            'indicator': self.indicator.id + 1
        }
        bad_url = reverse('result_add', kwargs=kwargs)
        response = self.client.get(bad_url)
        self.assertEqual(response.status_code, 404)

    def test_update_view_raises_404_with_bad_result_id(self):
        kwargs = {
            'pk': self.result.id + 1
        }
        bad_url = reverse('result_update', kwargs=kwargs)
        response = self.client.get(bad_url)
        self.assertEqual(response.status_code, 404)


class TestUpdateFormInitialValues(test.TestCase):
    def setUp(self):
        self.program = w_factories.ProgramFactory()
        self.indicator = i_factories.IndicatorFactory(
            program=self.program,
            target_frequency=Indicator.ANNUAL
        )
        self.result = i_factories.ResultFactory(
            indicator=self.indicator,
        )
        self.result.record_name = 'record name'
        self.result.evidence_url = 'evidence url'

        self.blank_result = i_factories.ResultFactory(
            indicator=self.indicator
        )

        self.tola_user = w_factories.TolaUserFactory()
        self.user = self.tola_user.user
        self.request = type('Request', (object,), {'has_write_access': True, 'user': self.user})()


    def test_initial_values(self):
        form = ResultForm(user=self.user, indicator=self.indicator, program=self.program, instance=self.result, request=self.request)
        self.assertEqual(form['achieved'].value(), self.result.achieved)
        self.assertEqual(form['target_frequency'].value(), Indicator.ANNUAL)
        self.assertEqual(form['indicator'].value(), self.indicator.id)
        self.assertEqual(form['date_collected'].value(), self.result.date_collected)
        self.assertEqual(form['record_name'].value(), 'record name')
        self.assertEqual(form['evidence_url'].value(), 'evidence url')

    def test_initial_values_no_evidence(self):
        form = ResultForm(user=self.user, indicator=self.indicator, program=self.program, instance=self.blank_result, request=self.request)
        self.assertEqual(form['achieved'].value(), self.result.achieved)
        self.assertEqual(form['target_frequency'].value(), Indicator.ANNUAL)
        self.assertEqual(form['indicator'].value(), self.indicator.id)
        self.assertEqual(form['record_name'].value(), None)
        self.assertEqual(form['evidence_url'].value(), None)

    def test_create_form_initial_values(self):
        form = ResultForm(user=self.user, indicator=self.indicator, program=self.program, request=self.request)
        self.assertEqual(form['indicator'].value(), self.indicator.id)
        self.assertEqual(form['program'].value(), self.program.id)
        self.assertEqual(form['achieved'].value(), None)
        self.assertEqual(form['record_name'].value(), None)
        self.assertEqual(form['evidence_url'].value(), None)


class TestCreateValidation(test.TestCase):
    def setUp(self):
        self.program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2016, 1, 1),
            reporting_period_end=datetime.date(2016, 12, 31),
        )
        self.indicator = i_factories.IndicatorFactory(
            program=self.program,
            target_frequency=Indicator.LOP
        )
        self.tola_user = w_factories.TolaUserFactory()
        self.user = self.tola_user.user

        self.request = type('Request', (object,), {'has_write_access': True, 'user': self.user})()
        self.form_kwargs = {
            'user': self.user,
            'indicator': self.indicator,
            'program': self.program,
            'request': self.request,
        }

    def test_good_data_validates(self):
        minimal_data = {
            'date_collected': '2016-01-01',
            'achieved': '30',
            'indicator': self.indicator.id,
            'program': self.program.id,
            'rationale': 'this is a rationale'
        }
        form = ResultForm(minimal_data, **self.form_kwargs)
        self.assertTrue(form.is_valid(), "errors {0}".format(form.errors))
        new_result = form.save()
        self.assertIsNotNone(new_result.id)
        db_result = Result.objects.get(pk=new_result.id)
        self.assertEqual(db_result.date_collected, datetime.date(2016, 1, 1))
        self.assertEqual(db_result.achieved, 30)

    def test_good_data_with_evidence_validates(self):
        minimal_data = {
            'date_collected': '2016-03-31',
            'achieved': '30',
            'indicator': self.indicator.id,
            'program': self.program.id,
            'record_name': 'new record',
            'evidence_url': 'http://google.com',
            'rationale': 'this is a rationale'
        }
        form = ResultForm(minimal_data, **self.form_kwargs)
        self.assertTrue(form.is_valid(), "errors {0}".format(form.errors))
        new_result = form.save()
        self.assertIsNotNone(new_result.id)
        db_result = Result.objects.get(pk=new_result.id)
        self.assertEqual(db_result.record_name, 'new record')

    def test_good_data_updating_evidence_validates(self):
        minimal_data = {
            'date_collected': '2016-03-31',
            'achieved': '30',
            'indicator': self.indicator.id,
            'program': self.program.id,
            'record_name': 'existing record',
            'evidence_url': 'http://google.com',
            'rationale': 'this is a rationale'
        }
        form = ResultForm(minimal_data, **self.form_kwargs)
        self.assertTrue(form.is_valid(), "errors {0}".format(form.errors))
        new_result = form.save()
        self.assertIsNotNone(new_result.id)
        db_result = Result.objects.get(pk=new_result.id)
        self.assertEqual(db_result.record_name, 'existing record')
        self.assertEqual(db_result.evidence_url, 'http://google.com')


    @test.tag('slow')
    def test_adding_record_without_name_passes_validation(self):
        bad_data = {
            'date_collected': '2016-03-31',
            'achieved': '30',
            'indicator': self.indicator.id,
            'program': self.program.id,
            'evidence_url': 'http://google.com',
            'rationale': 'this is a rationale'
        }
        form = ResultForm(bad_data, **self.form_kwargs)
        self.assertTrue(form.is_valid())

    def test_adding_record_without_url_fails_validation(self):
        bad_data = {
            'date_collected': '2016-03-31',
            'achieved': '30',
            'indicator': self.indicator.id,
            'program': self.program.id,
            'record_name': 'new record',
        }
        form = ResultForm(bad_data, **self.form_kwargs)
        self.assertFalse(form.is_valid())
        self.assertIn('evidence_url', form.errors)

    # date_collected validation

    def test_collected_date_before_program_start(self):
        minimal_data = {
            'date_collected': '2015-12-31',
            'achieved': '30',
            'indicator': self.indicator.id,
            'program': self.program.id,
        }
        form = ResultForm(minimal_data, **self.form_kwargs)
        self.assertFalse(form.is_valid())
        self.assertIn('date_collected', form.errors)

    def test_collected_date_after_program_end(self):
        minimal_data = {
            'date_collected': '2017-1-1',
            'achieved': '30',
            'indicator': self.indicator.id,
            'program': self.program.id,
        }
        form = ResultForm(minimal_data, **self.form_kwargs)
        self.assertFalse(form.is_valid())
        self.assertIn('date_collected', form.errors)
