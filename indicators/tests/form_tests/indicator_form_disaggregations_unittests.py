# -*- coding: utf-8 -*-
""" Tests for the disaggregation section of the indicator setup form.

    Form renders this single many-to-many relationship as a series of collapsed checkbox groupings, one grouping
    for standard (global) disaggregations, and then another grouping for each country that has country-level
    disaggregations available for the program the indicator is in based on the user's permissions level in
    those countries (a multi-country program with a user that only has access to one country should only
    display that country's disaggregations)

    Scenarios:
        Form rendering (create/update):
        - a form with 0, 1, or many global disaggregations, of which 0, 1, or many are "selected by default"
        - a form for an indicator in a program with 1 country which has 0, 1, or many disaggregations, of which
            0, 1, or many are "selected by default"
        - a form for an indicator in a program with many countries with a user that has permission on all countries,
            with 0, 1, or many disaggregations for each country, of which 0, 1, or many are "selected by default"
        - a form for an indicator in a program with many countries with a user that has permission on less than all
            countries, with 0, 1, or many disaggregations for each country, of which 0, 1, or many are
            "selected by default"
        Form rendering (update):
        - a form where an indicator has selected 1/many disaggregation(s) previously (global/country)
        - a form where an indicator has UNselected 1/many "selected by default" disaggregation(s) (global/country)
        - a form where an indicator in a program with many countries with a user that has permission on less than
            all countries, with 1, or many disaggregations in an impermissible country, of which at least one is
            selected already
        Form saving (create/update):
        - adding disaggregations which are/are not "selected by default"
        - removing disaggregations which are/are not "selected by default"
        - invisible (outside of accessible countries) disaggregations not being affected by save (either
            "selected by default" being added, nor previously selected being removed)
"""

import uuid
from django import test
from unittest import mock
from factories import (
    workflow_models as w_factories,
    indicators_models as i_factories
)
from indicators.forms import IndicatorForm
from indicators.models import Indicator, DisaggregationLabel, DisaggregatedValue

class TestIndicatorCreateFormDisaggregations(test.TestCase):

    def setUp(self):
        self.country = w_factories.CountryFactory(country="Testland", code="TL")
        self.user_country = w_factories.CountryFactory(country="OtherTestLand", code="OTL")
        self.out_country = w_factories.CountryFactory(country="OutsideLand", code="OL")
        self.program = w_factories.RFProgramFactory()
        self.program.country.set([self.country])
        i_factories.LevelTierFactory(program=self.program)
        self.level = i_factories.LevelFactory(program=self.program)
        self.outprogram = w_factories.RFProgramFactory()
        self.outprogram.country.set([self.country, self.out_country])
        i_factories.LevelTierFactory(program=self.outprogram)
        self.outlevel = i_factories.LevelFactory(program=self.outprogram)

    def get_create_form(self, **kwargs):
        data = kwargs.get('data', None)
        program = kwargs.get('program', self.program)
        request = mock.MagicMock()
        request.user.tola_user.access_data = {'countries': {self.country.pk: [], self.user_country.pk: []}}
        return IndicatorForm(data, program=program, request=request, auto_id=False)


    def get_create_data(self):
        return {
            'name': 'Test name',
            'indicator_key': uuid.uuid4(),
            'level': self.level.pk,
            'unit_of_measure': 'cats',
            'unit_of_measure_type': 1,
            'direction_of_change': 2,
            'target_frequency': 1
        }

    def test_no_disaggregations_form(self):
        form = self.get_create_form()
        self.assertNotIn('disaggregation', form.fields)
        self.assertIn('grouped_disaggregations', form.fields)
        self.assertEqual(str(form['grouped_disaggregations']), '')

    def test_one_standard_disaggregations_form(self):
        standard_disagg = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test Global 1",
            standard=True
        )
        form = self.get_create_form()
        self.assertHTMLEqual(
            str(form['grouped_disaggregations']),
            """<fieldset>
            <a href="#" id="grouped_disaggregations_toggle_0" class="is-accordion-toggle btn btn-link"
             data-toggle="collapse" data-target="#grouped_disaggregations_inputs_0" aria-expanded="false"
             aria-controls="grouped_disaggregations_inputs_0"><i class="fas fa-caret-right"></i>
             Global disaggregations</a>
             <div class="collapse" id="grouped_disaggregations_inputs_0"><div>
                <div class="form-check"><input class="form-check-input" type="checkbox"
                 name="grouped_disaggregations_0" value="{}" id="grouped_disaggregations_0_check_0">
                 <label class="form-check-label" for="grouped_disaggregations_0_check_0">Test Global 1</label></div>
                </div></div>
            </fieldset>""".format(standard_disagg.pk)
        )

    def test_selected_by_default_standard_disaggregations_form(self):
        special_chars = 'éüîåç'
        standard_disagg = i_factories.DisaggregationTypeFactory(
            disaggregation_type=special_chars,
            standard=True,
            selected_by_default=True
        )
        form = self.get_create_form()
        self.assertHTMLEqual(
            str(form['grouped_disaggregations']),
            """<fieldset>
            <a href="#" id="grouped_disaggregations_toggle_0" class="is-accordion-toggle btn btn-link"
             data-toggle="collapse" data-target="#grouped_disaggregations_inputs_0" aria-expanded="false"
             aria-controls="grouped_disaggregations_inputs_0"><i class="fas fa-caret-right"></i>
             Global disaggregations</a>
             <div class="collapse" id="grouped_disaggregations_inputs_0"><div>
                <div class="form-check"><input class="form-check-input" type="checkbox"
                 name="grouped_disaggregations_0" value="{}" id="grouped_disaggregations_0_check_0" checked>
                 <label class="form-check-label" for="grouped_disaggregations_0_check_0">{}</label></div>
                </div></div>
            </fieldset>""".format(standard_disagg.pk, special_chars)
        )

    def test_country_disaggregations_form(self):
        country_disagg = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test1",
            country=self.country
        )
        form = self.get_create_form()
        self.maxDiff = None
        self.assertHTMLEqual(
            str(form['grouped_disaggregations']),
            """<fieldset>
            <a href="#" id="grouped_disaggregations_toggle_0" class="is-accordion-toggle btn btn-link"
             data-toggle="collapse" data-target="#grouped_disaggregations_inputs_0" aria-expanded="false"
             aria-controls="grouped_disaggregations_inputs_0"><i class="fas fa-caret-right"></i>
             Testland disaggregations</a>
             <div class="collapse" id="grouped_disaggregations_inputs_0"><div>
                <div class="form-check"><input class="form-check-input" type="checkbox"
                 name="grouped_disaggregations_0" value="{}" id="grouped_disaggregations_0_check_0">
                 <label class="form-check-label" for="grouped_disaggregations_0_check_0">Test1</label></div>
                </div></div>
            </fieldset>""".format(country_disagg.pk)
        )

    def test_country_disaggregations_form_helptext(self):
        country_disagg = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test1",
            country=self.country
        )
        for x in range(2):
            label = DisaggregationLabel(
                disaggregation_type=country_disagg,
                label="Test1 Label {}".format(x+1),
                customsort=x+1
            )
            label.save()
        form = self.get_create_form()
        self.maxDiff=None
        self.assertHTMLEqual(
            str(form['grouped_disaggregations']),
            """<fieldset>
            <a href="#" id="grouped_disaggregations_toggle_0" class="is-accordion-toggle btn btn-link"
             data-toggle="collapse" data-target="#grouped_disaggregations_inputs_0" aria-expanded="false"
             aria-controls="grouped_disaggregations_inputs_0"><i class="fas fa-caret-right"></i>
             Testland disaggregations</a>
             <div class="collapse" id="grouped_disaggregations_inputs_0"><div>
                <div class="form-check"><input class="form-check-input" type="checkbox"
                 name="grouped_disaggregations_0" value="{}" id="grouped_disaggregations_0_check_0">
                 <label class="form-check-label" for="grouped_disaggregations_0_check_0">Test1</label>
                 <a class="ml-2" tabindex="0" data-toggle="popover" data-trigger="focus"
                    data-html="true" data-placement="right"
                    data-content="<ul class=&quot;popover-list&quot;><li>Test1 Label 1</li><li>Test1 Label 2</li></ul>">
                      <i aria-label="Categories for disaggregation Test1"
                         class="far fa-question-circle"></i>
                   </a>
                 </div>
                </div></div>
            </fieldset>""".format(country_disagg.pk)
        )

    def test_selected_by_default_country_disaggregations_form(self):
        country_disagg_1 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test1",
            country=self.country
        )
        country_disagg_2 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test2",
            country=self.country,
            selected_by_default=True
        )
        form = self.get_create_form()
        self.assertEqual(form.fields['grouped_disaggregations'].initial, [country_disagg_2.pk])
        self.assertHTMLEqual(
            str(form['grouped_disaggregations']),
            """<fieldset>
            <a href="#" id="grouped_disaggregations_toggle_0" class="is-accordion-toggle btn btn-link"
             data-toggle="collapse" data-target="#grouped_disaggregations_inputs_0" aria-expanded="false"
             aria-controls="grouped_disaggregations_inputs_0"><i class="fas fa-caret-right"></i>
             Testland disaggregations</a>
             <div class="collapse" id="grouped_disaggregations_inputs_0"><div>
                <div class="form-check"><input class="form-check-input" type="checkbox"
                 name="grouped_disaggregations_0" value="{}" id="grouped_disaggregations_0_check_0">
                 <label class="form-check-label" for="grouped_disaggregations_0_check_0">Test1</label></div>
                <div class="form-check"><input class="form-check-input" type="checkbox" checked
                 name="grouped_disaggregations_0" value="{}" id="grouped_disaggregations_0_check_1">
                 <label class="form-check-label" for="grouped_disaggregations_0_check_1">Test2</label></div>
                </div></div>
            </fieldset>""".format(country_disagg_1.pk, country_disagg_2.pk)
        )

    def test_create_with_no_disaggregation(self):
        standard_disagg = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test Global 1",
            standard=True
        )
        data = self.get_create_data()
        form = self.get_create_form(data=data)
        self.assertTrue(form.is_valid(), form.errors)
        self.assertEqual(form['grouped_disaggregations'].value(), [])
        instance = form.save()
        i = Indicator.rf_aware_objects.get(pk=instance.pk)
        self.assertEqual(i.disaggregation.all().count(), 0)

    def test_create_with_one_disaggregation(self):
        standard_disagg = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test Global 1",
            standard=True
        )
        data = self.get_create_data()
        data['grouped_disaggregations_0'] = standard_disagg.pk
        form = self.get_create_form(data=data)
        self.assertTrue(form.is_valid(), form.errors)
        self.assertEqual(form['grouped_disaggregations'].value(), [standard_disagg.pk])
        instance = form.save()
        i = Indicator.rf_aware_objects.get(pk=instance.pk)
        self.assertEqual(i.disaggregation.all().count(), 1)
        self.assertEqual(i.disaggregation.first(), standard_disagg)

    def test_create_with_many_disaggregations(self):
        sd1 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test Global 1",
            standard=True
        )
        sd2 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test Global 2",
            standard=True,
            selected_by_default=True
        )
        sd3 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test Global 3",
            standard=True
        )
        sd4 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test Global 4",
            standard=True,
            is_archived=True
        )
        cd1 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test Country 1",
            country=self.country
        )
        cd2 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test Country 2",
            country=self.country
        )
        form = self.get_create_form()
        self.assertEqual(form.fields['grouped_disaggregations'].initial, [sd2.pk])
        self.assertEqual(form['grouped_disaggregations'].value(), [sd2.pk])
        data = self.get_create_data()
        data['grouped_disaggregations_0'] = [sd1.pk, sd3.pk]
        data['grouped_disaggregations_1'] = [cd2.pk]
        form = self.get_create_form(data=data)
        self.assertTrue(form.is_valid(), form.errors)
        self.assertEqual(form['grouped_disaggregations'].value(), [sd1.pk, sd3.pk, cd2.pk])
        instance = form.save()
        i = Indicator.rf_aware_objects.get(pk=instance.pk)
        self.assertEqual(set(d.pk for d in i.disaggregation.all()), set([sd1.pk, sd3.pk, cd2.pk]))

    def test_create_with_out_of_country_disaggregations(self):
        sd1 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test Global 1",
            standard=True
        )
        sd2 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test Global 2",
            standard=True,
        )
        outcds = [i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test Out Country {}".format(x),
            country=self.user_country
            ) for x in range(10)]
        cd1 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test Country 1",
            country=self.country
        )
        cd2 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test Country 2",
            country=self.country
        )
        form = self.get_create_form()
        self.assertEqual(
            form['grouped_disaggregations'].field.values_list,
            [sd1.pk, sd2.pk, cd1.pk, cd2.pk]
        )
        data = self.get_create_data()
        data['grouped_disaggregations_0'] = [sd1.pk, sd2.pk]
        data['grouped_disaggregations_1'] = cd1.pk
        form = self.get_create_form(data=data)
        self.assertTrue(form.is_valid(), form.errors)
        instance = form.save()
        i = Indicator.rf_aware_objects.get(pk=instance.pk)
        self.assertEqual(
            set(d.pk for d in i.disaggregation.all()),
            set([sd1.pk, sd2.pk, cd1.pk])
        )

    def test_multi_country_program(self):
        sds = [i_factories.DisaggregationTypeFactory(
            disaggregation_type="Testing Standard Disaggregation {}".format(x),
            standard=True
        ) for x in range(4)]
        cds_main = [i_factories.DisaggregationTypeFactory(
            disaggregation_type="Testing Country Disaggregation {}".format(x),
            country=self.country
        ) for x in range(4)]
        cds_user = [i_factories.DisaggregationTypeFactory(
            disaggregation_type="Testing User Country Disaggregation {}".format(x),
            country=self.user_country
        ) for x in range(4)]
        cds_out = [i_factories.DisaggregationTypeFactory(
            disaggregation_type="Testing Out of View Disaggregation {}".format(x),
            country=self.out_country
        ) for x in range(4)]
        form = self.get_create_form(program=self.outprogram)
        self.assertEqual(
            set(form['grouped_disaggregations'].field.values_list),
            set([d.pk for d in (sds + cds_main)])
        )
        data = self.get_create_data()
        data['level'] = self.outlevel.pk
        data['grouped_disaggregations_0'] = [sds[0].pk, sds[1].pk]
        data['grouped_disaggregations_1'] = [cds_user[0].pk, cds_out[1].pk, cds_main[2].pk]
        form = self.get_create_form(data=data, program=self.outprogram)
        self.assertTrue(form.is_valid(), form.errors)
        self.assertNotIn(cds_user[0].pk, form.cleaned_data['grouped_disaggregations'])
        self.assertNotIn(cds_out[1].pk, form.cleaned_data['grouped_disaggregations'])
        self.assertIn(cds_main[2].pk, form.cleaned_data['grouped_disaggregations'])
        instance = form.save()
        i = Indicator.rf_aware_objects.get(pk=instance.pk)
        self.assertEqual(
            set(d.pk for d in i.disaggregation.all()),
            set([sds[0].pk, sds[1].pk, cds_main[2].pk])
        )

class TestIndicatorUpdateFormDisaggregations(test.TestCase):
    maxDiff = None

    def setUp(self):
        self.country = w_factories.CountryFactory(country="Testland", code="TL")
        self.user_country = w_factories.CountryFactory(country="OtherTestLand", code="OTL")
        self.out_country = w_factories.CountryFactory(country="OutsideLand", code="OL")
        self.program = w_factories.RFProgramFactory()
        self.program.country.set([self.country])
        i_factories.LevelTierFactory(program=self.program)
        self.level = i_factories.LevelFactory(program=self.program)
        self.outprogram = w_factories.RFProgramFactory()
        self.outprogram.country.set([self.country, self.out_country])
        i_factories.LevelTierFactory(program=self.outprogram)
        self.outlevel = i_factories.LevelFactory(program=self.outprogram)
        self.doubleprogram = w_factories.RFProgramFactory()
        self.doubleprogram.country.set([self.country, self.user_country])
        i_factories.LevelTierFactory(program=self.doubleprogram)
        self.doublelevel = i_factories.LevelFactory(program=self.doubleprogram)

    def get_update_form(self, **kwargs):
        data = kwargs.get('data', None)
        instance = kwargs.get('instance', None)
        if instance:
            program = instance.program
            if data:
                data = {
                    'indicator_key': instance.indicator_key,
                    'name': instance.name,
                    'level': instance.level.pk,
                    'unit_of_measure': instance.unit_of_measure,
                    'unit_of_measure_type': instance.unit_of_measure_type,
                    'direction_of_change': instance.direction_of_change,
                    'target_frequency': instance.target_frequency,
                    **data
                }
        else:
            program = kwargs.get('program', self.program)
        initial = kwargs.get('initial', {
            'target_frequency_num_periods': 1 if not instance else instance.target_frequency_num_periods
        })
        request = mock.MagicMock()
        request.user.tola_user.access_data = {'countries': {self.country.pk: [], self.user_country.pk: []}}
        form_kwargs = {
            'program': program,
            'initial': initial,
            'request': request,
            'auto_id': False
        }
        if instance:
            form_kwargs['instance'] = instance
        return IndicatorForm(data, **form_kwargs)

    def get_indicator(self, **kwargs):
        indicator_kwargs = {
            'program': self.program,
            'level': self.level,
            **kwargs
        }
        return i_factories.RFIndicatorFactory(**indicator_kwargs)

    def test_indicator_with_no_disaggregations(self):
        indicator = self.get_indicator()
        form = self.get_update_form(instance=indicator)
        self.assertEqual(form['grouped_disaggregations'].field.values_list, [])
        form = self.get_update_form(data={'name': 'New Name'}, instance=indicator)
        self.assertTrue(form.is_valid(), form.errors)
        instance = form.save()
        i = Indicator.rf_aware_objects.get(pk=instance.pk)
        self.assertEqual(i.name, 'New Name')
        self.assertEqual(i.disaggregation.count(), 0)

    def test_indicator_with_no_disaggregations_updated(self):
        sd1 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test1",
            standard=True
        )
        sd2 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test2",
            standard=True
        )
        indicator = self.get_indicator()
        form = self.get_update_form(instance=indicator)
        self.assertEqual(form['grouped_disaggregations'].field.values_list, [sd1.pk, sd2.pk])
        form = self.get_update_form(data={'grouped_disaggregations_0': sd2.pk}, instance=indicator)
        self.assertTrue(form.is_valid(), form.errors)
        instance = form.save()
        i = Indicator.rf_aware_objects.get(pk=instance.pk)
        self.assertEqual(i.disaggregation.first().disaggregation_type, "Test2")

    def test_indicator_with_disaggregations_removed(self):
        sd1 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test1",
            standard=True
        )
        sd2 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test2",
            standard=True
        )
        indicator = self.get_indicator()
        indicator.disaggregation.set([sd1, sd2])
        form = self.get_update_form(data={'grouped_disaggregations_0': sd1.pk}, instance=indicator)
        self.assertTrue(form.is_valid(), form.errors)
        instance = form.save()
        i = Indicator.rf_aware_objects.get(pk=instance.pk)
        self.assertEqual(i.disaggregation.count(), 1)
        self.assertEqual(i.disaggregation.first().disaggregation_type, "Test1")

    def test_indicator_with_disaggregations_and_values_disabled(self):
        sd1 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test1",
            standard=True
        )
        sd1_labels = []
        for x in range(2):
            label = DisaggregationLabel(
                disaggregation_type=sd1,
                label="Test1 Label {}".format(x+1),
                customsort=x+1
            )
            label.save()
            sd1_labels.append(label)
        sd2 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test2",
            standard=True
        )
        sd2_labels = []
        for x in range(2):
            label = DisaggregationLabel(
                disaggregation_type=sd2,
                label="Test2 Label {}".format(x+1),
                customsort=x+1
            )
            label.save()
            sd2_labels.append(label)
        sd3 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test3",
            standard=True
        )
        for x in range(2):
            label = DisaggregationLabel(
                disaggregation_type=sd3,
                label="Test3 Label {}".format(x+1),
                customsort=x+1
            )
            label.save()
        indicator = self.get_indicator()
        indicator.disaggregation.set([sd1, sd2, sd3])
        result = i_factories.ResultFactory(
            indicator=indicator,
            periodic_target=indicator.periodictargets.first(),
            achieved=100
        )
        d_value1 = DisaggregatedValue(
            category=sd1_labels[0],
            value=45,
            result=result
        )
        d_value1.save()
        d_value2 = DisaggregatedValue(
            category=sd1_labels[1],
            value=55,
            result=result
        )
        d_value2.save()
        other_indicator = self.get_indicator()
        other_indicator.disaggregation.set([sd2, sd3])
        other_result = i_factories.ResultFactory(
            indicator=other_indicator,
            periodic_target=other_indicator.periodictargets.first(),
            achieved=100
        )
        d_value3 = DisaggregatedValue(
            category=sd2_labels[0],
            value=45,
            result=other_result
        )
        d_value3.save()
        self.maxDiff = None
        form = self.get_update_form(instance=indicator)
        self.assertHTMLEqual(
            str(form['grouped_disaggregations']),
            """<fieldset>
            <a href="#" id="grouped_disaggregations_toggle_0" class="is-accordion-toggle btn btn-link"
             data-toggle="collapse" data-target="#grouped_disaggregations_inputs_0" aria-expanded="false"
             aria-controls="grouped_disaggregations_inputs_0"><i class="fas fa-caret-right"></i>
             Global disaggregations</a>
             <div class="collapse" id="grouped_disaggregations_inputs_0"><div>
                <div class="form-check"><input class="form-check-input" type="checkbox" checked disabled
                 name="grouped_disaggregations_0" value="{}" id="grouped_disaggregations_0_check_0">
                 <label class="form-check-label" for="grouped_disaggregations_0_check_0">Test1</label>
                 <a class="ml-2" tabindex="0" data-toggle="popover" data-trigger="focus"
                    data-html="true" data-placement="right"
                    data-content="<ul class=&quot;popover-list&quot;><li>Test1 Label 1</li><li>Test1 Label 2</li></ul><br /><i>This disaggregation cannot be unselected, because it was already used in submitted program results.</i>">
                      <i aria-label="Categories for disaggregation Test1"
                         class="far fa-question-circle"></i>
                   </a>
                </div>
                <div class="form-check"><input class="form-check-input" type="checkbox" checked
                 name="grouped_disaggregations_0" value="{}" id="grouped_disaggregations_0_check_1">
                 <label class="form-check-label" for="grouped_disaggregations_0_check_1">Test2</label>
                 <a class="ml-2" tabindex="0" data-toggle="popover" data-trigger="focus"
                    data-html="true" data-placement="right"
                    data-content="<ul class=&quot;popover-list&quot;><li>Test2 Label 1</li><li>Test2 Label 2</li></ul>">
                      <i aria-label="Categories for disaggregation Test2"
                         class="far fa-question-circle"></i>
                   </a>
                </div>
                <div class="form-check"><input class="form-check-input" type="checkbox" checked
                 name="grouped_disaggregations_0" value="{}" id="grouped_disaggregations_0_check_2">
                 <label class="form-check-label" for="grouped_disaggregations_0_check_2">Test3</label>
                 <a class="ml-2" tabindex="0" data-toggle="popover" data-trigger="focus"
                    data-html="true" data-placement="right"
                    data-content="<ul class=&quot;popover-list&quot;><li>Test3 Label 1</li><li>Test3 Label 2</li></ul>">
                      <i aria-label="Categories for disaggregation Test3"
                         class="far fa-question-circle"></i>
                   </a>
                 </div>
                </div></div>
            </fieldset>""".format(sd1.pk, sd2.pk, sd3.pk)
        )

    def test_indicator_with_disaggregations_switched(self):
        sd1 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test1",
            standard=True
        )
        sd2 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test2",
            standard=True
        )
        sd3 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test3",
            standard=True,
        )
        sd4 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test4",
            standard=True
        )
        indicator = self.get_indicator()
        indicator.disaggregation.set([sd1, sd2])
        form = self.get_update_form(data={'grouped_disaggregations_0': [sd4.pk, sd3.pk]}, instance=indicator)
        self.assertTrue(form.is_valid(), form.errors)
        instance = form.save()
        i = Indicator.rf_aware_objects.get(pk=instance.pk)
        self.assertEqual(i.disaggregation.count(), 2)
        self.assertEqual(
            set(d.pk for d in i.disaggregation.all()),
            set([sd3.pk, sd4.pk])
        )

    def test_indicator_with_country_and_standard(self):
        sds = [i_factories.DisaggregationTypeFactory(
            disaggregation_type="Testing Standard Disaggregation {}".format(x),
            standard=True
        ) for x in range(4)]
        cds_main = [i_factories.DisaggregationTypeFactory(
            disaggregation_type="Testing Country Disaggregation {}".format(x),
            country=self.country
        ) for x in range(4)]
        cds_user = [i_factories.DisaggregationTypeFactory(
            disaggregation_type="Testing User Country Disaggregation {}".format(x),
            country=self.user_country
        ) for x in range(4)]
        indicator = self.get_indicator()
        form = self.get_update_form(instance=indicator)
        self.assertEqual(
            set(form['grouped_disaggregations'].field.values_list),
            set(d.pk for d in (sds + cds_main))
        )
        form = self.get_update_form(
            data={'grouped_disaggregations_0': sds[0].pk,
                  'grouped_disaggregations_1': cds_main[0].pk},
            instance=indicator)
        self.assertTrue(form.is_valid(), form.errors)
        instance = form.save()
        i = Indicator.rf_aware_objects.get(pk=instance.pk)
        self.assertEqual(i.disaggregation.count(), 2)
        self.assertEqual(
            set(d.pk for d in i.disaggregation.all()),
            set([sds[0].pk, cds_main[0].pk])
        )

    def test_indicator_with_archived_standard_disaggregation(self):
        sd1 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Testing Standard 1",
            standard=True
        )
        sd2 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Testing Standard 2",
            standard=True,
            is_archived=True
        )
        indicator = self.get_indicator()
        form = self.get_update_form(instance=indicator)
        self.assertEqual(form['grouped_disaggregations'].field.values_list, [sd1.pk])
        form = self.get_update_form(data={'grouped_disaggregations_0': sd2.pk}, instance=indicator)
        self.assertTrue(form.is_valid(), form.errors)
        self.assertEqual(form.cleaned_data['grouped_disaggregations'], [])
        other_indicator = self.get_indicator()
        other_indicator.disaggregation.add(sd2)
        form = self.get_update_form(instance=indicator)
        self.assertEqual(form['grouped_disaggregations'].field.values_list, [sd1.pk, sd2.pk])
        form = self.get_update_form(data={'grouped_disaggregations_0': sd2.pk}, instance=indicator)
        self.assertTrue(form.is_valid(), form.errors)
        self.assertEqual(form.cleaned_data['grouped_disaggregations'], [sd2.pk])
        instance = form.save()
        i = Indicator.rf_aware_objects.get(pk=instance.pk)
        self.assertEqual(i.disaggregation.first(), sd2)

    def test_indicator_in_multi_country_program(self):
        cd1 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Testing Country 1",
            country=self.country
        )
        cd2 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Testing Country 2",
            country=self.user_country
        )
        cd3 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Testing Country 3",
            country=self.out_country
        )
        indicator = self.get_indicator(program=self.outprogram, level=self.outlevel)
        form = self.get_update_form(instance=indicator)
        self.assertEqual(form['grouped_disaggregations'].field.values_list, [cd1.pk])
        indicator.disaggregation.set([cd1, cd3])
        form = self.get_update_form(instance=indicator)
        self.assertEqual(form['grouped_disaggregations'].field.values_list, [cd1.pk])
        form = self.get_update_form(data={'grouped_disaggregations_0': cd1.pk}, instance=indicator)
        self.assertTrue(form.is_valid(), form.errors)
        instance = form.save()
        i = Indicator.rf_aware_objects.get(pk=instance.pk)
        self.assertEqual(
            set(d.pk for d in i.disaggregation.all()),
            set([cd1.pk, cd3.pk])
        )
        indicator.disaggregation.clear()
        indicator.disaggregation.set([cd3])
        form = self.get_update_form(instance=indicator)
        self.assertEqual(form['grouped_disaggregations'].field.values_list, [cd1.pk])
        form = self.get_update_form(data={'grouped_disaggregations_0': [cd1.pk, cd2.pk]}, instance=indicator)
        self.assertTrue(form.is_valid(), form.errors)
        instance = form.save()
        i = Indicator.rf_aware_objects.get(pk=instance.pk)
        self.assertEqual(
            set(d.pk for d in i.disaggregation.all()),
            set([cd1.pk, cd3.pk])
        )

    def test_archived_disaggregations_at_country_level(self):
        sd1 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Testing Standard 1",
            standard=True
        )
        sd2 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Testing Standard 2",
            standard=True,
            is_archived=True
        )
        sd3 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Testing Standard 3",
            standard=True,
            is_archived=True
        )
        cda1 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Testing Country 1",
            country=self.country
        )
        cda2 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Testing Country 2",
            country=self.country,
            is_archived=True
        )
        cda3 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Testing Country 3",
            country=self.country,
            is_archived=True
        )
        cdb1 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Testing Other Country 1",
            country=self.user_country
        )
        cdb2 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Testing Other Country 2",
            country=self.user_country,
            is_archived=True
        )
        cdb3 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Testing Other Country 3",
            country=self.user_country,
            is_archived=True
        )
        indicator = self.get_indicator(program=self.doubleprogram, level=self.doublelevel)
        form = self.get_update_form(instance=indicator)
        self.assertEqual(
            set(form['grouped_disaggregations'].field.values_list),
            set([sd1.pk, cda1.pk, cdb1.pk])
        )
        indicator.disaggregation.set([sd2, cda2, cdb2])
        form = self.get_update_form(instance=indicator)
        self.assertEqual(
            set(form['grouped_disaggregations'].field.values_list),
            set([sd1.pk, sd2.pk, cda1.pk, cda2.pk, cdb1.pk, cdb2.pk])
        )
        other_indicator = self.get_indicator(program=self.doubleprogram, level=self.doublelevel)
        form = self.get_update_form(instance=other_indicator)
        self.assertEqual(
            set(form['grouped_disaggregations'].field.values_list),
            set([sd1.pk, sd2.pk, cda1.pk, cda2.pk, cdb1.pk, cdb2.pk])
        )
        form = self.get_update_form(
            data={'name': 'New Name',
                  'grouped_disaggregations_0': [sd1.pk, sd2.pk, sd3.pk],
                  'grouped_disaggregations_1': [cda1.pk, cda2.pk],
                  'grouped_disaggregations_2': [cdb2.pk, cdb3.pk]},
            instance=other_indicator)
        self.assertTrue(form.is_valid(), form.errors)
        i = Indicator.rf_aware_objects.get(pk=form.save().pk)
        self.assertEqual(
            set(d.pk for d in i.disaggregation.all()),
            set([sd1.pk, sd2.pk, cda1.pk, cda2.pk, cdb2.pk])
        )
        self.assertEqual(i.name, "New Name")

    def test_selected_by_default_doesnt_matter(self):
        sd1 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Testing Standard 1",
            standard=True
        )
        sd2 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Testing Standard 2",
            standard=True,
            selected_by_default=True
        )
        sd3 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Testing Standard 3",
            standard=True,
            selected_by_default=True
        )
        cd1 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Testing Country 1",
            country=self.country
        )
        cd2 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Testing Country 2",
            country=self.country,
            selected_by_default=True
        )
        cd3 = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Testing Country 3",
            country=self.country,
            selected_by_default=True
        )
        indicator = self.get_indicator()
        indicator.disaggregation.set([sd1, sd2, cd2])
        form = self.get_update_form(instance=indicator)
        self.assertEqual(form.fields['grouped_disaggregations'].initial, [sd1.pk, sd2.pk, cd2.pk])
        form = self.get_update_form(
            data={'grouped_disaggregations_0': sd3.pk,
                  'grouped_disaggregations_1': [cd1.pk, cd2.pk]},
            instance=indicator
        )
        self.assertTrue(form.is_valid(), form.errors)
        i = Indicator.rf_aware_objects.get(pk=form.save().pk)
        self.assertEqual(
            set(d.pk for d in i.disaggregation.all()),
            set([sd3.pk, cd1.pk, cd2.pk])
        )
