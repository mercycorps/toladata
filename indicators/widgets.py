from django import forms
from functools import partial
from django.forms.widgets import Select


class DataAttributesSelect(Select):

    def __init__(self, attrs=None, choices=(), data=None):
        super(DataAttributesSelect, self).__init__(attrs, choices)
        if not data:
            data = {}
        self.data = data

    def create_option(self, name, value, label, selected, index, subindex=None, attrs=None):
        option = super(DataAttributesSelect, self).create_option(
            name, value, label, selected, index, subindex=None, attrs=None)
        for data_attr, values in self.data.iteritems():
            option['attrs'][data_attr] = values[option['value']]
        return option


class DatePicker(forms.DateInput):
    """
    Use in form to create a Jquery datepicker element
    Usage:
        self.fields['some_date_field'].widget = DatePicker.DateInput()
    """
    template_name = 'datepicker.html'
    DateInput = partial(forms.DateInput, {'class': 'datepicker'})