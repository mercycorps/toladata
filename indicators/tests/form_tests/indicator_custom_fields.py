# -*- coding: utf-8 -*-
"""Tests for custom fields used in forms in the indicators app
    - GroupedModelMultipleChoiceField: takes a list of (name, queryset) tuples, updates a single
        many-to-many relationship based on user input.  Can be MultiSelect or MultiCheckbox widgeted
"""

import unittest
from django import test
from django import forms
from indicators.forms import GroupedMultipleChoiceField
from factories import (
    workflow_models as w_factories,
    indicators_models as i_factories
)
from indicators.models import DisaggregationType


class TestGroupedMultipleChoiceField(test.TestCase):
    TWO_GROUPS = [
        ('One', [(1, 'A'), (2, 'B')]),
        ('Two', [(3, 'C'), (4, 'D'), (10, 'E')])
    ]

    def test_empty_groups(self):
        field = GroupedMultipleChoiceField([])
        self.assertHTMLEqual(field.widget.render('name', []), '')

    def test_one_group(self):
        groups = [
            ('Test Name', [
                (1, 'One'),
                (2, 'Two')
            ])
        ]
        field = GroupedMultipleChoiceField(groups)
        self.assertHTMLEqual(
            field.widget.render('name', []),
            """<fieldset>
                <a href="#" id="name_toggle_0" class="is-accordion-toggle btn btn-link"
                data-toggle="collapse" data-target="#name_inputs_0"
                aria-expanded="true" aria-controls="name_inputs_0">
                    <i class="fas fa-caret-down"></i>Test Name
                </a>
                <div class="collapse show" id="name_inputs_0">
                    <div>
                        <div class="form-check"><input class="form-check-input" type="checkbox"
                         name="name_0" value="1" id="name_0_check_0">
                        <label class="form-check-label" for="name_0_check_0"><small>One</small></label></div>
                        <div class="form-check"><input class="form-check-input" type="checkbox"
                         name="name_0" value="2" id="name_0_check_1">
                        <label class="form-check-label" for="name_0_check_1"><small>Two</small></label></div>
                    </div>
                </div>
            </fieldset>""")

    def test_one_group_with_help_text(self):
        groups = [
            ('Test Name', [
                (1, 'One'),
                (2, 'Two')
            ], [
                '<ul><li>Category One</li><li>Category Two</li></ul>',
                '<ul><li>Two Cat 1</li><li>Two Cat 2</li><li>Two Cat 3</li></ul>'
            ])
        ]
        field = GroupedMultipleChoiceField(groups)
        self.assertHTMLEqual(
            field.widget.render('name', []),
            """<fieldset>
                <a href="#" id="name_toggle_0" class="is-accordion-toggle btn btn-link"
                data-toggle="collapse" data-target="#name_inputs_0" aria-expanded="true"
                aria-controls="name_inputs_0">
                    <i class="fas fa-caret-down"></i>Test Name
                </a>
                <div class="collapse show" id="name_inputs_0">
                    <div>
                        <div class="form-check"><input class="form-check-input" type="checkbox"
                         name="name_0" value="1" id="name_0_check_0">
                        <label class="form-check-label" for="name_0_check_0"><small>One</small></label>
                          <a class="ml-2" tabindex="0" data-toggle="popover" data-trigger="focus"
                             data-html="true" data-placement="right"
                             data-boundary="window"
                             data-content="<ul><li>Category One</li><li>Category Two</li></ul>">
                               <i aria-label="Categories for disaggregation One"
                                  class="far fa-question-circle"></i>
                            </a>
                        </div>
                        <div class="form-check"><input class="form-check-input" type="checkbox"
                         name="name_0" value="2" id="name_0_check_1">
                        <label class="form-check-label" for="name_0_check_1"><small>Two</small></label>
                          <a class="ml-2" tabindex="0" data-toggle="popover" data-trigger="focus"
                             data-html="true" data-placement="right"
                             data-boundary="window"
                             data-content="<ul><li>Two Cat 1</li><li>Two Cat 2</li><li>Two Cat 3</li></ul>">
                               <i aria-label="Categories for disaggregation Two"
                                  class="far fa-question-circle"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </fieldset>""")

    def test_two_groups(self):
        long_name = 'AAAAA'*10
        special_chars = '∆iéåaç'
        group_1 = [(100 + v, 'Option {}'.format(v)) for v in range(4)]
        group_2 = [(21, 'Twenty-one')]
        groups = [
            (long_name, group_1),
            (special_chars, group_2)
        ]
        field = GroupedMultipleChoiceField(groups)
        self.assertHTMLEqual(
            field.widget.render('grouped_field_name', []),
            """<fieldset>
            <a href="#" id="grouped_field_name_toggle_0" class="is-accordion-toggle btn btn-link"
             data-toggle="collapse" data-target="#grouped_field_name_inputs_0" aria-expanded="true"
             aria-controls="grouped_field_name_inputs_0"><i class="fas fa-caret-down"></i>{0}</a>
             <div class="collapse show" id="grouped_field_name_inputs_0"><div>
                <div class="form-check"><input class="form-check-input" type="checkbox"
                 name="grouped_field_name_0" value="100" id="grouped_field_name_0_check_0">
                 <label class="form-check-label" for="grouped_field_name_0_check_0"><small>Option 0</small></label></div>
                <div class="form-check"><input class="form-check-input" type="checkbox"
                 name="grouped_field_name_0" value="101" id="grouped_field_name_0_check_1">
                 <label class="form-check-label" for="grouped_field_name_0_check_1"><small>Option 1</small></label></div>
                <div class="form-check"><input class="form-check-input" type="checkbox"
                 name="grouped_field_name_0" value="102" id="grouped_field_name_0_check_2">
                 <label class="form-check-label" for="grouped_field_name_0_check_2"><small>Option 2</small></label></div>
                <div class="form-check"><input class="form-check-input" type="checkbox"
                 name="grouped_field_name_0" value="103" id="grouped_field_name_0_check_3">
                 <label class="form-check-label" for="grouped_field_name_0_check_3"><small>Option 3</small></label></div>
                </div></div>
            </fieldset><fieldset>
            <a href="#" id="grouped_field_name_toggle_1" class="is-accordion-toggle btn btn-link"
             data-toggle="collapse" data-target="#grouped_field_name_inputs_1" aria-expanded="true"
             aria-controls="grouped_field_name_inputs_1"><i class="fas fa-caret-down"></i>{1}</a>
             <div class="collapse show" id="grouped_field_name_inputs_1"><div>
                <div class="form-check"><input class="form-check-input" type="checkbox"
                 name="grouped_field_name_1" value="21" id="grouped_field_name_1_check_0">
                 <label class="form-check-label" for="grouped_field_name_1_check_0"><small>Twenty-one</small></label></div>
               </div></div>
            </fieldset>""".format(long_name, special_chars)
        )

    def get_form(self, groups):
        class _TestForm(forms.Form):
            group_field = GroupedMultipleChoiceField(groups)
        return _TestForm

    def test_initial_value(self):
        TestForm = self.get_form(self.TWO_GROUPS)
        form = TestForm(initial={"group_field": [1, 2, 10]}, auto_id=False)
        self.assertFalse(form.is_bound)
        self.assertHTMLEqual(
            str(form['group_field']),
            """<fieldset>
            <a href="#" id="group_field_toggle_0" class="is-accordion-toggle btn btn-link"
             data-toggle="collapse" data-target="#group_field_inputs_0" aria-expanded="true"
             aria-controls="group_field_inputs_0"><i class="fas fa-caret-down"></i>One</a>
             <div class="collapse show" id="group_field_inputs_0"><div>
                <div class="form-check"><input class="form-check-input" type="checkbox"
                 name="group_field_0" value="1" id="group_field_0_check_0" checked>
                 <label class="form-check-label" for="group_field_0_check_0"><small>A</small></label></div>
                <div class="form-check"><input class="form-check-input" type="checkbox"
                 name="group_field_0" value="2" id="group_field_0_check_1" checked>
                 <label class="form-check-label" for="group_field_0_check_1"><small>B</small></label></div>
                </div></div>
            </fieldset><fieldset>
            <a href="#" id="group_field_toggle_1" class="is-accordion-toggle btn btn-link"
             data-toggle="collapse" data-target="#group_field_inputs_1" aria-expanded="true"
             aria-controls="group_field_inputs_1"><i class="fas fa-caret-down"></i>Two</a>
             <div class="collapse show" id="group_field_inputs_1"><div>
                <div class="form-check"><input class="form-check-input" type="checkbox"
                 name="group_field_1" value="3" id="group_field_1_check_0">
                 <label class="form-check-label" for="group_field_1_check_0"><small>C</small></label></div>
                <div class="form-check"><input class="form-check-input" type="checkbox"
                 name="group_field_1" value="4" id="group_field_1_check_1">
                 <label class="form-check-label" for="group_field_1_check_1"><small>D</small></label></div>
                <div class="form-check"><input class="form-check-input" type="checkbox"
                 name="group_field_1" value="10" id="group_field_1_check_2" checked>
                 <label class="form-check-label" for="group_field_1_check_2"><small>E</small></label></div>
                </div></div>
            </fieldset>"""
        )

    def test_validates_data_one_group(self):
        groups = [
            ('One', [(5, 'Five'), (18, 'Eighteen')])
        ]
        TestForm = self.get_form(groups)
        form = TestForm({'group_field_0': [5]})
        self.assertTrue(form.is_bound)
        self.assertEqual(form.errors, {})
        self.assertTrue(form.is_valid())
        self.assertEqual(form.cleaned_data['group_field'], [5])
        form = TestForm({'group_field_0': []})
        self.assertTrue(form.is_bound)
        self.assertEqual(form.errors, {})
        self.assertTrue(form.is_valid())
        self.assertEqual(form.cleaned_data['group_field'], [])
        form = TestForm({'group_field_0': 18})
        self.assertTrue(form.is_valid())
        self.assertEqual(form.cleaned_data['group_field'], [18])
        form = TestForm({})
        self.assertTrue(form.is_valid())
        self.assertEqual(form.cleaned_data['group_field'], [])


    def test_validates_data_two_groups(self):
        TestForm = self.get_form(self.TWO_GROUPS)
        form = TestForm({'group_field_0': [2], 'group_field_1': [3, 4]})
        self.assertTrue(form.is_valid())
        self.assertEqual(form.cleaned_data['group_field'], [2, 3, 4])
        form = TestForm({'group_field_1': 3}, initial={'group_field': [2, 3]})
        self.assertTrue(form.is_valid())
        self.assertEqual(form.cleaned_data['group_field'], [3])
        field = form['group_field']
        self.assertEqual(field.initial, [2, 3])
        self.assertEqual(field.value(), [3])
        self.assertEqual(field.field.values_list, [1, 2, 3, 4, 10])
