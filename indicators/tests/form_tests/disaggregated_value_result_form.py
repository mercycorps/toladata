"""Tests for the formset, form, formset-factory function, instantiation, validation, and model saving behavior"""

import unittest
from django import test

from factories import (
    indicators_models as i_factories,
    workflow_models as w_factories
)

from indicators.models import (
    DisaggregatedValue
)

from indicators.forms import (
    BaseDisaggregatedValueFormSet,
    DisaggregatedValueForm,
    get_disaggregated_result_formset
)


class TestDisaggregatedValueForm(test.TestCase):
    """Form to accept a disaggregation value for a given disaggregation label"""

    def setUp(self):
        self.disagg = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test Disagg",
            standard=True,
            labels=["Test label 1", "Test label 2"]
        )

    def test_accepts_new_value(self):
        form = DisaggregatedValueForm({'value': 120}, label=self.disagg.labels[0])
        self.assertTrue(form.is_valid(), form.errors)
        self.assertEqual(form.cleaned_data['value'], float(120))

    def test_does_not_accept_characters(self):
        for value in ['banana', 'e120', '114%', '400 cats']:
            form = DisaggregatedValueForm({'value': value}, label=self.disagg.labels[0])
            self.assertFalse(form.is_valid())
            self.assertIn('value', form.errors)
            self.assertEqual(form.errors['value'], ['Enter a number.'])


class TestDisaggregatedValueFormSet(test.TestCase):

    def setUp(self):
        self.disagg = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test Disagg",
            standard=True,
            labels=["Test label 1", "Test label 2"]
        )
        self.indicator = i_factories.RFIndicatorFactory()
        self.indicator.disaggregation.add(self.disagg)
        self.result = i_factories.ResultFactory(
            indicator=self.indicator,
            program=self.indicator.program,
            periodic_target=self.indicator.periodictargets.first(),
            achieved=250
        )

    def test_valid_form_values(self):
        FormSet = get_disaggregated_result_formset(self.disagg)
        for values in [
            (130, 120),
            (0.25, 249.75),
            (100.89, 149.11),
            (0, 250)
        ]:
            data = {
                'disaggregation-formset-{}-TOTAL_FORMS'.format(self.disagg.pk): '2',
                'disaggregation-formset-{}-INITIAL_FORMS'.format(self.disagg.pk): '2',
                'disaggregation-formset-{}-MAX_NUM_FORMS'.format(self.disagg.pk): '',
                'disaggregation-formset-{}-0-value'.format(self.disagg.pk): '{}'.format(values[0]),
                'disaggregation-formset-{}-1-value'.format(self.disagg.pk): '{}'.format(values[1])
            }
            formset = FormSet(data, result=self.result)
            self.assertTrue(formset.is_valid(), "{}\n{}".format(formset.errors, formset.non_form_errors()))
            self.assertEqual(formset[0].cleaned_data['value'], values[0])
            self.assertEqual(formset[0].cleaned_data['label_pk'], self.disagg.labels[0].pk)
            self.assertEqual(formset[1].cleaned_data['value'], values[1])
            self.assertEqual(formset[1].cleaned_data['label_pk'], self.disagg.labels[1].pk)

    def test_valid_form_values_with_blanks(self):
        data = {
            'disaggregation-formset-{}-TOTAL_FORMS'.format(self.disagg.pk): '2',
            'disaggregation-formset-{}-INITIAL_FORMS'.format(self.disagg.pk): '2',
            'disaggregation-formset-{}-MAX_NUM_FORMS'.format(self.disagg.pk): '',
            'disaggregation-formset-{}-0-value'.format(self.disagg.pk): '{}'.format(250),
            'disaggregation-formset-{}-1-value'.format(self.disagg.pk): ''
        }
        formset = get_disaggregated_result_formset(self.disagg)(data, result=self.result)
        self.assertTrue(formset.is_valid(), "{}\n{}".format(formset.errors, formset.non_form_errors()))
        self.assertEqual(formset[0].cleaned_data['value'], 250)
        self.assertEqual(formset[1].cleaned_data['value'], 0)

    def test_invalid_form_values(self):
        FormSet = get_disaggregated_result_formset(self.disagg)
        for values in [
            (100, 100),
            (0.25, 249),
            (0, 10),
            (200, 400)
        ]:
            data = {
                'disaggregation-formset-{}-TOTAL_FORMS'.format(self.disagg.pk): '2',
                'disaggregation-formset-{}-INITIAL_FORMS'.format(self.disagg.pk): '2',
                'disaggregation-formset-{}-MAX_NUM_FORMS'.format(self.disagg.pk): '',
                'disaggregation-formset-{}-0-value'.format(self.disagg.pk): '{}'.format(values[0]),
                'disaggregation-formset-{}-1-value'.format(self.disagg.pk): '{}'.format(values[1])
            }
            formset = FormSet(data, result=self.result)
            self.assertFalse(formset.is_valid())

    def test_creates_disaggregated_values(self):
        FormSet = get_disaggregated_result_formset(self.disagg)
        data = {
                'disaggregation-formset-{}-TOTAL_FORMS'.format(self.disagg.pk): '2',
                'disaggregation-formset-{}-INITIAL_FORMS'.format(self.disagg.pk): '2',
                'disaggregation-formset-{}-MAX_NUM_FORMS'.format(self.disagg.pk): '',
                'disaggregation-formset-{}-0-value'.format(self.disagg.pk): '71.45',
                'disaggregation-formset-{}-1-value'.format(self.disagg.pk): '178.55'
            }
        formset = FormSet(data, result=self.result)
        self.assertTrue(formset.is_valid())
        values = formset.save()
        self.assertEqual(len(values), 2)
        self.assertEqual(float(values[0].value), 71.45)
        self.assertEqual(values[0].category, self.disagg.labels[0])
        self.assertEqual(float(values[1].value), 178.55)
        self.assertEqual(values[1].category, self.disagg.labels[1])
        value1 = DisaggregatedValue.objects.get(pk=values[0].pk)
        self.assertEqual(float(value1.value), values[0].value)
        value2 = DisaggregatedValue.objects.get(pk=values[1].pk)
        self.assertEqual(float(value2.value), values[1].value)

    def test_doesnt_create_with_no_values(self):
        FormSet = get_disaggregated_result_formset(self.disagg)
        data = {
                'disaggregation-formset-{}-TOTAL_FORMS'.format(self.disagg.pk): '2',
                'disaggregation-formset-{}-INITIAL_FORMS'.format(self.disagg.pk): '2',
                'disaggregation-formset-{}-MAX_NUM_FORMS'.format(self.disagg.pk): '',
                'disaggregation-formset-{}-0-value'.format(self.disagg.pk): '',
                'disaggregation-formset-{}-1-value'.format(self.disagg.pk): ''
            }
        formset = FormSet(data, result=self.result)
        self.assertTrue(formset.is_valid())
        values = formset.save()
        self.assertEqual(DisaggregatedValue.objects.filter(result=self.result).count(), 0)

    def test_create_then_clear(self):
        FormSet = get_disaggregated_result_formset(self.disagg)
        data = {
                'disaggregation-formset-{}-TOTAL_FORMS'.format(self.disagg.pk): '2',
                'disaggregation-formset-{}-INITIAL_FORMS'.format(self.disagg.pk): '2',
                'disaggregation-formset-{}-MAX_NUM_FORMS'.format(self.disagg.pk): '',
                'disaggregation-formset-{}-0-value'.format(self.disagg.pk): '100',
                'disaggregation-formset-{}-1-value'.format(self.disagg.pk): '150'
            }
        formset = FormSet(data, result=self.result)
        self.assertTrue(formset.is_valid())
        formset.save()
        self.assertEqual(DisaggregatedValue.objects.filter(result=self.result).count(), 2)
        data = {
                'disaggregation-formset-{}-TOTAL_FORMS'.format(self.disagg.pk): '2',
                'disaggregation-formset-{}-INITIAL_FORMS'.format(self.disagg.pk): '2',
                'disaggregation-formset-{}-MAX_NUM_FORMS'.format(self.disagg.pk): '',
                'disaggregation-formset-{}-0-value'.format(self.disagg.pk): '',
                'disaggregation-formset-{}-1-value'.format(self.disagg.pk): ''
            }
        formset2 = FormSet(data, result=self.result)
        self.assertTrue(formset2.is_valid())
        formset2.save()
        self.assertEqual(DisaggregatedValue.objects.filter(result=self.result).count(), 0)

    def test_create_then_update(self):
        FormSet = get_disaggregated_result_formset(self.disagg)
        data = {
                'disaggregation-formset-{}-TOTAL_FORMS'.format(self.disagg.pk): '2',
                'disaggregation-formset-{}-INITIAL_FORMS'.format(self.disagg.pk): '2',
                'disaggregation-formset-{}-MAX_NUM_FORMS'.format(self.disagg.pk): '',
                'disaggregation-formset-{}-0-value'.format(self.disagg.pk): '100',
                'disaggregation-formset-{}-1-value'.format(self.disagg.pk): '150'
            }
        formset = FormSet(data, result=self.result)
        self.assertTrue(formset.is_valid())
        values = formset.save()
        self.assertEqual(DisaggregatedValue.objects.filter(result=self.result).count(), 2)
        data = {
                'disaggregation-formset-{}-TOTAL_FORMS'.format(self.disagg.pk): '2',
                'disaggregation-formset-{}-INITIAL_FORMS'.format(self.disagg.pk): '2',
                'disaggregation-formset-{}-MAX_NUM_FORMS'.format(self.disagg.pk): '',
                'disaggregation-formset-{}-0-value'.format(self.disagg.pk): '249',
                'disaggregation-formset-{}-1-value'.format(self.disagg.pk): '1'
            }
        formset2 = FormSet(data, result=self.result)
        self.assertTrue(formset2.is_valid())
        formset2.save()
        self.assertEqual(DisaggregatedValue.objects.filter(result=self.result).count(), 2)
        self.assertEqual(set([dv.value for dv in DisaggregatedValue.objects.filter(result=self.result)]), set([249, 1]))


class TestDisaggregatedValueFormSetFactory(test.TestCase):
    """Produce a formset comprised of forms with the right number of fields accurately labeled

        - global or country-specific disaggregation
        - archived or not archived, standard or non-standard
        - 2:many labels
        - produces no forms given no disaggregation_labels
    """

    def test_global_disagg_with_two_labels(self):
        disagg = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test Disagg 1",
            standard=True,
            labels=["Test Label 1", "Test Label 2"]
        )
        formset = get_disaggregated_result_formset(disagg)()
        self.assertEqual(len(formset), 2)
        self.assertEqual(formset[0]['value'].field.label, "Test Label 1")
        self.assertEqual(formset[1]['value'].field.label, "Test Label 2")
        self.assertEqual(formset[0]['label_pk'].field.initial, disagg.labels[0].pk)
        self.assertEqual(formset[1]['label_pk'].field.initial, disagg.labels[1].pk)

    def test_country_disagg_with_two_labels(self):
        country = w_factories.CountryFactory()
        disagg = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test Disagg 2",
            country=country,
            labels=["Test Label 1", "Test Label 2"]
        )
        formset = get_disaggregated_result_formset(disagg)()
        self.assertEqual(len(formset), 2)
        self.assertEqual(formset[0]['value'].field.label, "Test Label 1")
        self.assertEqual(formset[1]['value'].field.label, "Test Label 2")
        self.assertEqual(formset[0]['label_pk'].field.initial, disagg.labels[0].pk)
        self.assertEqual(formset[1]['label_pk'].field.initial, disagg.labels[1].pk)

    def test_disagg_with_no_labels(self):
        disagg = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test Disagg 1",
            standard=True,
        )
        formset = get_disaggregated_result_formset(disagg)()
        self.assertEqual(len(formset), 0)

    def test_form_with_many_lables(self):
        disagg = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test disagg 3",
            standard=True,
            labels=["Label {}".format(x) for x in range(20)]
        )
        formset = get_disaggregated_result_formset(disagg)()
        self.assertEqual(len(formset), 20)

    def test_form_with_initial_data(self):
        indicator = i_factories.RFIndicatorFactory()
        result = i_factories.ResultFactory(
            indicator=indicator,
            program=indicator.program,
            periodic_target=indicator.periodictargets.first(),
            achieved=200
        )
        disagg = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test Disagg 4",
            standard=True,
            labels=["Test Label 1", "Test Label 2"]
        )
        indicator.disaggregation.set([disagg])
        for label in disagg.labels:
            disagg_value = i_factories.DisaggregatedValueFactory(
                category=label,
                value=100,
                result=result
            )
        formset = get_disaggregated_result_formset(disagg)(result=result)
        self.assertEqual(len(formset), 2)
        self.assertEqual(int(formset[0]['value'].field.initial), 100)
        self.assertEqual(formset[0]['label_pk'].field.initial, disagg.labels[0].pk)
        self.assertEqual(int(formset[1]['value'].field.initial), 100)
        self.assertEqual(formset[1]['label_pk'].field.initial, disagg.labels[1].pk)

    def test_multiple_initial_disaggregations(self):
        country = w_factories.CountryFactory(country="TolaLand", code="TL")
        indicator = i_factories.RFIndicatorFactory()
        result = i_factories.ResultFactory(
            indicator=indicator,
            program=indicator.program,
            periodic_target=indicator.periodictargets.first(),
            achieved=500.50
        )
        disagg1 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test Disagg 5",
            standard=True,
            labels=["Test Label 1", "Test Label 2"]
        )
        disagg2 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test Disagg 6",
            standard=False,
            country=country,
            labels=["Test Label 3", "Test Label 4", "Test Label 5"]
        )
        disagg1_values = [200, 300.50]
        for label, value in zip(disagg1.labels, disagg1_values):
            disagg_value = i_factories.DisaggregatedValueFactory(
                category=label,
                value=value,
                result=result
            )
        disagg2_values = [50, 250.25, 200.25]
        for label, value in zip(disagg2.labels, disagg2_values):
            disagg_value = i_factories.DisaggregatedValueFactory(
                category=label,
                value=value,
                result=result
            )
        formset1 = get_disaggregated_result_formset(disagg1)(result=result)
        self.assertEqual(formset1.prefix, "disaggregation-formset-{}".format(disagg1.pk))
        self.assertEqual(len(formset1), 2)
        self.assertEqual([float(form['value'].field.initial) for form in formset1], disagg1_values)
        self.assertEqual([form['label_pk'].field.initial for form in formset1], [l.pk for l in disagg1.labels])
        self.assertEqual([form['label_pk'].value() for form in formset1], [l.pk for l in disagg1.labels])
        formset2 = get_disaggregated_result_formset(disagg2)(result=result)
        self.assertEqual(formset2.prefix, "disaggregation-formset-{}".format(disagg2.pk))
        self.assertEqual(len(formset2), 3)
        self.assertEqual([float(form['value'].field.initial) for form in formset2], disagg2_values)
        self.assertEqual([form['label_pk'].field.initial for form in formset2], [l.pk for l in disagg2.labels])
        self.assertEqual([form['label_pk'].value() for form in formset2], [l.pk for l in disagg2.labels])