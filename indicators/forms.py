
import operator
import uuid
import decimal
from datetime import timedelta

from workflow.models import (
    Program,
    SiteProfile,
    TolaUser,
    Sector,
)
from tola.util import getCountry
from tola.l10n_utils import str_without_diacritics
from tola.forms import NonLocalizedDecimalField
from tola_management.models import AuditLogRationaleSelection

from indicators.models import (
    Indicator,
    PeriodicTarget,
    Result,
    Objective,
    StrategicObjective,
    DisaggregationType,
    DisaggregationLabel,
    DisaggregatedValue,
    Level,
    PinnedReport,
    ReportingFrequency,
    DataCollectionFrequency
)
from indicators.widgets import DataAttributesSelect, DatePicker

from django.core.exceptions import ValidationError
from django.db.models import Q
from django import forms
from django.utils.translation import gettext, ugettext_lazy as _
from django.utils import formats, translation, timezone


class GroupCheckboxSelectMultipleWidget(forms.CheckboxSelectMultiple):
    template_name = 'forms/widgets/groupcheckbox_select.html'
    option_template_name = 'forms/widgets/groupcheckbox_option.html'

    def __init__(self, attrs=None, title=None, order=0, choices=(), helptext=None, individual_disabled=None,
                 group_helptext=None):
        self.title = title
        self.order = order
        self.helptext = helptext
        self.group_helptext = group_helptext
        self.individual_disabled = individual_disabled
        super().__init__(attrs, choices)

    def get_context(self, *args):
        context = super().get_context(*args)
        context['widget'].update(
            {'title': self.title, 'helptext': self.helptext, 'group_helptext': self.group_helptext}
            )
        return context

    def create_option(self, name, value, label, selected, index, subindex=None, attrs=None):
        return {
            'helptext': self.helptext[index] if (self.helptext and len(self.helptext) > index) else False,
            'disabled': self.individual_disabled[index] if (
                self.individual_disabled and len(self.individual_disabled) > index
                ) else False,
            **super().create_option(name, value, label, selected, index, subindex=subindex, attrs=attrs)
        }

    def value_from_datadict(self, data, files, name):
        value = super().value_from_datadict(data, files, name)
        if isinstance(value, list):
            return value
        if value is None:
            return []
        return [value]


class GroupedMultipleChoiceWidget(forms.MultiWidget):
    template_name = 'forms/widgets/collapsed_groups.html'

    def __init__(self, groups, **kwargs):
        groups = [group for group in groups if group[1]]
        subwidget_attrs = kwargs.pop('subwidget_attrs', {})
        group_helptext = kwargs.pop('group_helptext', None)
        self.values_map = [[option[0] for option in group[1]] for group in groups]
        widgets = [
            GroupCheckboxSelectMultipleWidget(
                attrs=subwidget_attrs, title=group[0], choices=group[1], order=c,
                helptext=(group[2] if (len(group) > 2 and group[2]) else None),
                individual_disabled=(group[3] if (len(group) > 3 and group[3]) else None),
                group_helptext=group_helptext
            ) for c, group in enumerate(groups)
        ]
        super().__init__(widgets, **kwargs)

    def get_context(self, name, value, attrs):
        value = self.decompress(value)
        context = super().get_context(name, value, attrs)
        return context

    def decompress(self, value):
        if value is None:
            return [[] for subwidget in self.values_map]
        return [
            [v for v in value if v in option_list]
            for option_list in self.values_map
        ]

    def value_from_datadict(self, data, files, name):
        return [value for values_list in super().value_from_datadict(data, files, name) for value in values_list]

class GroupedMultipleChoiceField(forms.Field):
    def __init__(self, groups, **kwargs):
        self.groups = groups
        subwidget_attrs = kwargs.pop('subwidget_attrs', {})
        group_helptext = kwargs.pop('group_helptext', None)
        kwargs = {
            'required': False,
            **kwargs,
            'widget': GroupedMultipleChoiceWidget(
                groups, subwidget_attrs=subwidget_attrs, group_helptext=group_helptext)
        }
        super().__init__(**kwargs)

    @property
    def values_list(self):
        return [option[0] for group in self.groups for option in group[1]]

    @property
    def active_values(self):
        values = []
        for group in self.groups:
            for c, option in enumerate(group[1]):
                if len(group) > 3 and group[3] and len(group[3]) > c and group[3][c]:
                    pass
                else:
                    values.append(option[0])
        return values

    def clean(self, value):
        value = super().clean(value)
        value = [int(v) for v in value if int(v) in self.values_list]
        return value


class PTFormInputsForm(forms.ModelForm):
    """
    Partial IndicatorForm submit for use in generating periodic target form
    sub-section of the full Indicator form
    """
    class Meta:
        model = Indicator
        fields = (
            'target_frequency',
            'unit_of_measure_type',
        )

class ShowOnDisabledMultiSelect(forms.SelectMultiple):
    option_template_name = 'forms/widgets/select_option_disable.html'
    def get_context(self, name, value, attrs):
        if 'disabled' in attrs:
            self.is_disabled = attrs.pop('disabled')
            classes = attrs.get('class', '')
            classes += ' disabled-select'
            attrs['class'] = classes
        context = super().get_context(name, value, attrs)
        return context

    def create_option(self, *args, **kwargs):
        option = super().create_option(*args, **kwargs)
        if getattr(self, 'is_disabled', False):
            option['disabled'] = self.is_disabled
        return option


class IndicatorForm(forms.ModelForm):
    unit_of_measure_type = forms.ChoiceField(
        choices=Indicator.UNIT_OF_MEASURE_TYPES,
        widget=forms.RadioSelect(),
    )
    old_level = forms.ChoiceField(
        choices=[('', '------')] + [(name, name) for (pk, name) in Indicator.OLD_LEVELS],
        initial=None
    )

    baseline = NonLocalizedDecimalField(decimal_places=2, localize=True, required=False)
    lop_target = NonLocalizedDecimalField(decimal_places=2, localize=True, required=False)

    rationale = forms.CharField(required=False)
    reasons_for_change = forms.TypedMultipleChoiceField(
        choices=AuditLogRationaleSelection.OPTIONS.items(),
        coerce=int,
        required=False
    )

    class Meta:
        model = Indicator
        exclude = ['create_date', 'edit_date', 'level_order', 'program', 'disaggregation']
        widgets = {
            'definition': forms.Textarea(attrs={'rows': 4}),
            'justification': forms.Textarea(attrs={'rows': 4}),
            'quality_assurance': forms.Textarea(attrs={'rows': 4}),
            'data_issues': forms.Textarea(attrs={'rows': 4}),
            'comments': forms.Textarea(attrs={'rows': 4}),
            'rationale_for_target': forms.Textarea(attrs={'rows': 4}),
            'objectives': ShowOnDisabledMultiSelect,
            'strategic_objectives': ShowOnDisabledMultiSelect,
            'indicator_type': ShowOnDisabledMultiSelect,
            'data_collection_frequencies': ShowOnDisabledMultiSelect,
            'reporting_frequencies': ShowOnDisabledMultiSelect,
            'means_of_verification': forms.Textarea(attrs={'rows': 4}),
            'data_collection_method': forms.Textarea(attrs={'rows': 4}),
            'data_points': forms.Textarea(attrs={'rows': 4}),
            'responsible_person': forms.Textarea(attrs={'rows': 4}),
            'method_of_analysis': forms.Textarea(attrs={'rows': 4}),
            'information_use': forms.Textarea(attrs={'rows': 4}),
            'quality_assurance_techniques': forms.SelectMultiple(),
        }

    def __init__(self, *args, **kwargs):
        indicator = kwargs.get('instance', None)
        self.request = kwargs.pop('request')
        if indicator and not indicator.unit_of_measure_type:
            kwargs['initial']['unit_of_measure_type'] = Indicator.UNIT_OF_MEASURE_TYPES[0][0]
        if indicator and indicator.lop_target:
            lop_stripped = str(indicator.lop_target)
            lop_stripped = lop_stripped.rstrip('0').rstrip('.') if '.' in lop_stripped else lop_stripped
            kwargs['initial']['lop_target'] = lop_stripped


        self.programval = kwargs.pop('program')
        self.prefilled_level = kwargs.pop('level') if 'level' in kwargs else False

        super(IndicatorForm, self).__init__(*args, **kwargs)

        # per mercycorps/TolaActivity#2452 remove textarea max length validation to provide a more
        # user-friendly js-based validation (these textarea checks aren't enforced at db-level anyway)
        for field in ['name', 'definition', 'justification', 'rationale_for_target',
                      'means_of_verification', 'data_collection_method', 'data_points',
                      'responsible_person', 'method_of_analysis', 'information_use',
                      'quality_assurance', 'data_issues', 'comments']:
            self.fields[field].widget.attrs.pop('maxlength', None)

        # program_display here is to display the program without interfering in the logic that
        # assigns a program to an indicator (and doesn't update it) - but it looks like other fields
        self.fields['program_display'] = forms.ChoiceField(
            choices=[('', self.programval.name),],
            required=False,
        )
        self.fields['program_display'].disabled = True
        self.fields['program_display'].label = _('Program')
        self.fields['baseline'].label = _('Baseline')
        self.fields['baseline'].help_text = Indicator._meta.get_field('baseline').help_text

        # level is here the new "result level" (RF) level option (FK to model Level)
        # Translators: This is a form field label that allows users to select which Level object to associate with
        # the Result that's being entered into the form
        self.fields['level'].label = _('Result level')
        self.fields['level'].label_from_instance = lambda obj: obj.display_name
        # in cases where the user was sent here via CREATE from the RF BUILDER screen:
        if self.prefilled_level:
            # prefill level with only the level they clicked "add indicator" from:
            self.fields['level'].queryset = Level.objects.filter(pk=self.prefilled_level)
            self.fields['level'].initial = self.prefilled_level
            # do not allow the user to update (it is being "added to" that level)
            self.fields['level'].disabled = True
        else:
            # populate with all levels for the indicator's program:
            # self.fields['level'].queryset = Level.objects.filter(program_id=self.programval)
            self.fields['level'].choices = [('', '------')] + [
                (l.id, l.display_name) for l in Level.sort_by_ontology(
                    Level.objects.filter(program_id=self.programval)
                )]

        if self.programval.results_framework and not self.programval.manual_numbering:
            # in this (the default) case, the number field is removed (values not updated):
            self.fields.pop('number')
        elif self.programval.results_framework:
            # in this case the number field gets this special help text (added as a popover):
            self.fields['number'].label = _('Display number')
            self.fields['number'].help_text = Indicator._meta.get_field('number').help_text
        if self.programval.results_framework:
            # no need to update the old_level field if they are using the results framework:
            self.fields.pop('old_level')
            self.fields['level'].required = True
        else:
            # pre-migration to RF, all fields remain unchanged in this regard (still required):
            self.fields['old_level'].required = True
            # Translators:  Indicator objects are assigned to Levels, which are in a hierarchy.  We recently changed
            # how we organize Levels. This is a field label for the indicator-associated Level in the old level system
            self.fields['old_level'].label = _('Old indicator level')
            # Translators:  We recently changed how we organize Levels. The new system is called the "results
            # framework". This is help text for users to let them know that they can use the new system now.
            self.fields['old_level'].help_text = _("Indicators are currently grouped by an older version of indicator "
                                                   "levels. To group indicators according to the results framework, an "
                                                   "admin will need to adjust program settings.")

        # sort choices alphabetically again (to provide choices sorted in translated language)
        self.fields['quality_assurance_techniques'].choices = sorted(
            self.fields['quality_assurance_techniques'].choices,
            key=lambda choice: str_without_diacritics(choice[1])
        )

        indicator_type_choices = [(id, gettext(i_type)) for id, i_type in self.fields['indicator_type'].choices]
        self.fields['indicator_type'].choices = sorted(
            indicator_type_choices,
            key=lambda choice: str_without_diacritics(choice[1])
        )

        sector_choices = [(id, gettext(sector)) for id, sector in self.fields['sector'].choices]
        self.fields['sector'].choices = sorted(
            sector_choices,
            key=lambda choice: str_without_diacritics(choice[1])
        )

        self.fields['reporting_frequencies'].choices = [
            (pk, _(freq)) for pk, freq in self.fields['reporting_frequencies'].choices]


        self.fields['data_collection_frequencies'].choices = [
            (pk, _(freq)) for pk, freq in self.fields['data_collection_frequencies'].choices]

        allowed_countries = [
            *self.request.user.tola_user.access_data.get('countries', {}).keys(),
            *[programaccess['country'] for programaccess in self.request.user.tola_user.access_data.get('programs', [])
              if programaccess['program'] == self.programval.pk]
        ]
        countries = self.programval.country.filter(
            pk__in=allowed_countries
        )
        global_disaggs, countries_disaggs = DisaggregationType.program_disaggregations(
            self.programval.pk, countries=countries,
            indicator_pk=(indicator.pk if indicator else None)
        )
        def get_helptext(disagg):
            if not disagg.categories:
                return ''
            helptext = '<ul class=&quot;popover-list&quot;>{}</ul>'.format(
                ''.join(['<li>{}</li>'.format(category.label) for category in disagg.categories])
                )
            if getattr(disagg, 'has_results'):
                helptext += '<br /><i>{}</i>'.format(
                    _("This disaggregation cannot be unselected, because it was already "
                      "used in submitted program results.")
                )
            return helptext

        disaggregation_group_helptext = Indicator._meta.get_field('disaggregation').help_text
        self.fields['grouped_disaggregations'] = GroupedMultipleChoiceField(
            # Translators:  disaggregation types that are available to all programs
            [(_('Global disaggregations'),
              [(disagg.pk, _(str(disagg))) for disagg in global_disaggs],
              [get_helptext(disagg) for disagg in global_disaggs],
              [getattr(disagg, 'has_results') for disagg in global_disaggs])] +
            # Translators:  disaggregation types that are available only to a specific country
            [(_('%(country_name)s disaggregations') % {'country_name': country_name},
              [(disagg.pk, str(disagg)) for disagg in country_disaggs],
              [get_helptext(disagg) for disagg in country_disaggs],
              [getattr(disagg, 'has_results') for disagg in country_disaggs])
                for country_name, country_disaggs in countries_disaggs],
            subwidget_attrs={'class': 'scroll-box-200 grouped-disaggregations'},
            group_helptext=disaggregation_group_helptext
        )
        if indicator:
            self.fields['grouped_disaggregations'].initial = [
                disagg.pk for disagg in indicator.disaggregation.all()
                ]
        else:
            self.fields['grouped_disaggregations'].initial = (
                [disagg.pk for disagg in global_disaggs if disagg.selected_by_default] +
                [disagg.pk for country_name, country_disaggs in countries_disaggs
                 for disagg in country_disaggs if disagg.selected_by_default]
            )
        if (self.programval._using_results_framework == Program.NOT_MIGRATED and
            Objective.objects.filter(program_id=self.programval.id).exists()):
            self.fields['objectives'].queryset = Objective.objects.filter(program__id__in=[self.programval.id])
        else:
            self.fields.pop('objectives')
        self.fields['strategic_objectives'].queryset = StrategicObjective.objects.filter(country__in=countries)
        self.fields['name'].label = _('Indicator')
        self.fields['name'].required = True
        self.fields['name'].widget = forms.Textarea(attrs={'rows': 3})
        self.fields['unit_of_measure'].required = True
        self.fields['unit_of_measure'].widget = forms.TextInput(
            attrs={'autocomplete':'off',
                   'maxlength': Indicator._meta.get_field('unit_of_measure').max_length})
        # Translators: Label of a form field.  User specifies whether changes should increase or decrease.
        self.fields['direction_of_change'].label = _("Direction of change")
        self.fields['target_frequency'].required = True
        # self.fields['is_cumulative'].widget = forms.RadioSelect()
        if self.instance.target_frequency and self.instance.target_frequency != Indicator.LOP:
            self.fields['target_frequency'].widget.attrs['readonly'] = True
        if not self.request.has_write_access:
            for name, field in self.fields.items():
                field.disabled = True

    def clean_indicator_key(self):
        data = self.cleaned_data.get('indicator_key', uuid.uuid4())
        if not self.instance.pk:
            previous_creates = Indicator.rf_aware_objects.filter(
                indicator_key=data,
                create_date__gte=timezone.now()-timedelta(minutes=10)
            )
            if previous_creates.count() > 0:
                raise forms.ValidationError(
                    _('Multiple submissions detected'),
                    code="rate_limit"
                )
        return data

    def clean_lop_target(self):
        data = self.cleaned_data['lop_target']
        if data and data <= 0:
            # Translators: Input form error message
            raise forms.ValidationError(_('Please enter a number larger than zero.'))
        return data

    def clean_level(self):
        level = self.cleaned_data['level']
        if level and level.program_id != self.programval.pk:
            raise forms.ValidationError(
                # Translators: This is an error message that is returned when a user is trying to assign an indicator
                # to the wrong hierarch of levels.
                _('Level program ID %(l_p_id)d and indicator program ID (%i_p_id)d mismatched'),
                code='foreign_key_mismatch',
                params={
                    'l_p_id': level.program_id,
                    'i_p_id': self.programval.pk
                }
            )
        return level

    def clean_means_of_verification(self):
        """field typed changed to return "" instead of None causing a non-update, this returns old null"""
        means_of_verification = self.cleaned_data['means_of_verification']
        if not means_of_verification and self.instance and not self.instance.means_of_verification:
            return self.instance.means_of_verification
        return means_of_verification

    def clean_method_of_analysis(self):
        """field typed changed to return "" instead of None causing a non-update, this returns old null"""
        method_of_analysis = self.cleaned_data['method_of_analysis']
        if not method_of_analysis and self.instance and not self.instance.method_of_analysis:
            return self.instance.method_of_analysis
        return method_of_analysis

    def clean_data_collection_method(self):
        """field typed changed to return "" instead of None causing a non-update, this returns old null"""
        data_collection_method = self.cleaned_data['data_collection_method']
        if not data_collection_method and self.instance and not self.instance.data_collection_method:
            return self.instance.data_collection_method
        return data_collection_method

    def clean_definition(self):
        """field typed changed to return "" instead of None causing a non-update, this returns old null"""
        definition = self.cleaned_data['definition']
        if not definition and self.instance and not self.instance.definition:
            return self.instance.definition
        return definition

    def update_disaggregations(self, instance):
        # collect disaggs that this user doesn't have access to and don't touch them:
        existing_disaggregations = instance.disaggregation.exclude(
            pk__in=self.fields['grouped_disaggregations'].active_values
        )
        instance.disaggregation.set(
            DisaggregationType.objects.filter(
                Q(pk__in=self.cleaned_data.get('grouped_disaggregations', [])) |
                Q(pk__in=existing_disaggregations)
            )
        )
        return instance

    def save(self, commit=True):
        # set the program on the indicator on create (it's already set on update)
        if self.instance.program_id is None:
            self.instance.program_id = self.programval.id
        instance = super().save(commit=False)
        if commit:
            instance.save()
            instance = self.update_disaggregations(instance)
            self.save_m2m()
        return instance


    def get_form_guidance_url(self, language='en'):
        return 'https://learn.mercycorps.org/index.php/TOLA:Section_05/en#b._TolaActivity_Indicator_Planning_Form_Guides'


class IndicatorCompleteForm(forms.ModelForm):
    unit_of_measure_type = forms.ChoiceField(
        choices=Indicator.UNIT_OF_MEASURE_TYPES,
        widget=forms.RadioSelect(),
    )
    old_level = forms.ChoiceField(
        choices=[('', '------')] + [(name, name) for (pk, name) in Indicator.OLD_LEVELS],
        initial=None
    )

    baseline = NonLocalizedDecimalField(decimal_places=2, localize=True, required=False)
    lop_target = NonLocalizedDecimalField(decimal_places=2, localize=True, required=False)

    rationale = forms.CharField(required=False)
    reasons_for_change = forms.TypedMultipleChoiceField(
        choices=AuditLogRationaleSelection.OPTIONS.items(),
        coerce=int,
        required=False
    )

    class Meta:
        model = Indicator
        exclude = ['create_date', 'edit_date', 'level_order', 'program', 'disaggregation']
        widgets = {
            'definition': forms.Textarea(attrs={'rows': 4}),
            'justification': forms.Textarea(attrs={'rows': 4}),
            'quality_assurance': forms.Textarea(attrs={'rows': 4}),
            'data_issues': forms.Textarea(attrs={'rows': 4}),
            'comments': forms.Textarea(attrs={'rows': 4}),
            'rationale_for_target': forms.Textarea(attrs={'rows': 4}),
            'objectives': ShowOnDisabledMultiSelect,
            'strategic_objectives': ShowOnDisabledMultiSelect,
            'indicator_type': ShowOnDisabledMultiSelect,
            'data_collection_frequencies': ShowOnDisabledMultiSelect,
            'reporting_frequencies': ShowOnDisabledMultiSelect,
            'means_of_verification': forms.Textarea(attrs={'rows': 4}),
            'data_collection_method': forms.Textarea(attrs={'rows': 4}),
            'data_points': forms.Textarea(attrs={'rows': 4}),
            'responsible_person': forms.Textarea(attrs={'rows': 4}),
            'method_of_analysis': forms.Textarea(attrs={'rows': 4}),
            'information_use': forms.Textarea(attrs={'rows': 4}),
            'quality_assurance_techniques': forms.SelectMultiple(),
        }

    def __init__(self, *args, **kwargs):
        indicator = kwargs.get('instance', None)
        self.request = kwargs.pop('request')
        if indicator and not indicator.unit_of_measure_type:
            kwargs['initial']['unit_of_measure_type'] = Indicator.UNIT_OF_MEASURE_TYPES[0][0]
        if indicator and indicator.lop_target:
            lop_stripped = str(indicator.lop_target)
            lop_stripped = lop_stripped.rstrip('0').rstrip('.') if '.' in lop_stripped else lop_stripped
            kwargs['initial']['lop_target'] = lop_stripped


        self.programval = kwargs.pop('program')
        self.prefilled_level = kwargs.pop('level') if 'level' in kwargs else False

        super(IndicatorCompleteForm, self).__init__(*args, **kwargs)

        # per mercycorps/TolaActivity#2452 remove textarea max length validation to provide a more
        # user-friendly js-based validation (these textarea checks aren't enforced at db-level anyway)
        for field in ['name', 'definition', 'justification', 'rationale_for_target',
                      'means_of_verification', 'data_collection_method', 'data_points',
                      'responsible_person', 'method_of_analysis', 'information_use',
                      'quality_assurance', 'data_issues', 'comments']:
            self.fields[field].widget.attrs.pop('maxlength', None)

        # program_display here is to display the program without interfering in the logic that
        # assigns a program to an indicator (and doesn't update it) - but it looks like other fields
        self.fields['program_display'] = forms.ChoiceField(
            choices=[('', self.programval.name),],
            required=False,
        )
        self.fields['program_display'].disabled = True
        self.fields['program_display'].label = _('Program')
        self.fields['baseline'].label = _('Baseline')
        self.fields['baseline'].help_text = Indicator._meta.get_field('baseline').help_text

        # level is here the new "result level" (RF) level option (FK to model Level)
        # Translators: This is a form field label that allows users to select which Level object to associate with
        # the Result that's being entered into the form
        self.fields['level'].label = _('Result level')
        self.fields['level'].label_from_instance = lambda obj: obj.display_name
        # in cases where the user was sent here via CREATE from the RF BUILDER screen:
        if self.prefilled_level:
            # prefill level with only the level they clicked "add indicator" from:
            self.fields['level'].queryset = Level.objects.filter(pk=self.prefilled_level)
            self.fields['level'].initial = self.prefilled_level
            # do not allow the user to update (it is being "added to" that level)
            self.fields['level'].disabled = True
        else:
            # populate with all levels for the indicator's program:
            # self.fields['level'].queryset = Level.objects.filter(program_id=self.programval)
            self.fields['level'].choices = [('', '------')] + [
                (l.id, l.display_name) for l in Level.sort_by_ontology(
                    Level.objects.filter(program_id=self.programval)
                )]

        if self.programval.results_framework and not self.programval.manual_numbering:
            # in this (the default) case, the number field is removed (values not updated):
            self.fields.pop('number')
        elif self.programval.results_framework:
            # in this case the number field gets this special help text (added as a popover):
            self.fields['number'].label = _('Display number')
            self.fields['number'].help_text = Indicator._meta.get_field('number').help_text
        if self.programval.results_framework:
            # no need to update the old_level field if they are using the results framework:
            self.fields.pop('old_level')
            self.fields['level'].required = True
        else:
            # pre-migration to RF, all fields remain unchanged in this regard (still required):
            self.fields['old_level'].required = True
            # Translators:  Indicator objects are assigned to Levels, which are in a hierarchy.  We recently changed
            # how we organize Levels. This is a field label for the indicator-associated Level in the old level system
            self.fields['old_level'].label = _('Old indicator level')
            # Translators:  We recently changed how we organize Levels. The new system is called the "results
            # framework". This is help text for users to let them know that they can use the new system now.
            self.fields['old_level'].help_text = _("Indicators are currently grouped by an older version of indicator "
                                                   "levels. To group indicators according to the results framework, an "
                                                   "admin will need to adjust program settings.")

        # sort choices alphabetically again (to provide choices sorted in translated language)
        self.fields['quality_assurance_techniques'].choices = sorted(
            self.fields['quality_assurance_techniques'].choices,
            key=lambda choice: str_without_diacritics(choice[1])
        )

        indicator_type_choices = [(id, gettext(i_type)) for id, i_type in self.fields['indicator_type'].choices]
        self.fields['indicator_type'].choices = sorted(
            indicator_type_choices,
            key=lambda choice: str_without_diacritics(choice[1])
        )

        sector_choices = [(id, gettext(sector)) for id, sector in self.fields['sector'].choices]
        self.fields['sector'].choices = sorted(
            sector_choices,
            key=lambda choice: str_without_diacritics(choice[1])
        )

        self.fields['reporting_frequencies'].choices = [
            (pk, _(freq)) for pk, freq in self.fields['reporting_frequencies'].choices]


        self.fields['data_collection_frequencies'].choices = [
            (pk, _(freq)) for pk, freq in self.fields['data_collection_frequencies'].choices]

        allowed_countries = [
            *self.request.user.tola_user.access_data.get('countries', {}).keys(),
            *[programaccess['country'] for programaccess in self.request.user.tola_user.access_data.get('programs', [])
              if programaccess['program'] == self.programval.pk]
        ]
        countries = self.programval.country.filter(
            pk__in=allowed_countries
        )
        global_disaggs, countries_disaggs = DisaggregationType.program_disaggregations(
            self.programval.pk, countries=countries,
            indicator_pk=(indicator.pk if indicator else None)
        )
        def get_helptext(disagg):
            if not disagg.categories:
                return ''
            helptext = '<ul class=&quot;popover-list&quot;>{}</ul>'.format(
                ''.join(['<li>{}</li>'.format(category.label) for category in disagg.categories])
                )
            if getattr(disagg, 'has_results'):
                helptext += '<br /><i>{}</i>'.format(
                    _("This disaggregation cannot be unselected, because it was already "
                      "used in submitted program results.")
                )
            return helptext

        disaggregation_group_helptext = Indicator._meta.get_field('disaggregation').help_text
        self.fields['grouped_disaggregations'] = GroupedMultipleChoiceField(
            # Translators:  disaggregation types that are available to all programs
            [(_('Global disaggregations'),
              [(disagg.pk, _(str(disagg))) for disagg in global_disaggs],
              [get_helptext(disagg) for disagg in global_disaggs],
              [getattr(disagg, 'has_results') for disagg in global_disaggs])] +
            # Translators:  disaggregation types that are available only to a specific country
            [(_('%(country_name)s disaggregations') % {'country_name': country_name},
              [(disagg.pk, str(disagg)) for disagg in country_disaggs],
              [get_helptext(disagg) for disagg in country_disaggs],
              [getattr(disagg, 'has_results') for disagg in country_disaggs])
                for country_name, country_disaggs in countries_disaggs],
            subwidget_attrs={'class': 'scroll-box-200 grouped-disaggregations'},
            group_helptext=disaggregation_group_helptext
        )
        if indicator:
            self.fields['grouped_disaggregations'].initial = [
                disagg.pk for disagg in indicator.disaggregation.all()
                ]
        else:
            self.fields['grouped_disaggregations'].initial = (
                [disagg.pk for disagg in global_disaggs if disagg.selected_by_default] +
                [disagg.pk for country_name, country_disaggs in countries_disaggs
                 for disagg in country_disaggs if disagg.selected_by_default]
            )
        if (self.programval._using_results_framework == Program.NOT_MIGRATED and
            Objective.objects.filter(program_id=self.programval.id).exists()):
            self.fields['objectives'].queryset = Objective.objects.filter(program__id__in=[self.programval.id])
        else:
            self.fields.pop('objectives')
        self.fields['strategic_objectives'].queryset = StrategicObjective.objects.filter(country__in=countries)
        self.fields['name'].label = _('Indicator')
        self.fields['name'].required = True
        self.fields['name'].widget = forms.Textarea(attrs={'rows': 3})
        self.fields['unit_of_measure'].required = True
        self.fields['unit_of_measure'].widget = forms.TextInput(
            attrs={'autocomplete':'off',
                   'maxlength': Indicator._meta.get_field('unit_of_measure').max_length})
        # Translators: Label of a form field.  User specifies whether changes should increase or decrease.
        self.fields['direction_of_change'].label = _("Direction of change")
        self.fields['target_frequency'].required = True
        # self.fields['is_cumulative'].widget = forms.RadioSelect()
        if self.instance.target_frequency and self.instance.target_frequency != Indicator.LOP:
            self.fields['target_frequency'].widget.attrs['readonly'] = True
        if not self.request.has_write_access:
            for name, field in self.fields.items():
                field.disabled = True

    def clean_indicator_key(self):
        data = self.cleaned_data.get('indicator_key', uuid.uuid4())
        if not self.instance.pk:
            previous_creates = Indicator.rf_aware_objects.filter(
                indicator_key=data,
                create_date__gte=timezone.now()-timedelta(minutes=10)
            )
            if previous_creates.count() > 0:
                raise forms.ValidationError(
                    _('Multiple submissions detected'),
                    code="rate_limit"
                )
        return data

    def clean_lop_target(self):
        data = self.cleaned_data['lop_target']
        if data and data <= 0:
            # Translators: Input form error message
            raise forms.ValidationError(_('Please enter a number larger than zero.'))
        return data

    def clean_level(self):
        level = self.cleaned_data['level']
        if level and level.program_id != self.programval.pk:
            raise forms.ValidationError(
                # Translators: This is an error message that is returned when a user is trying to assign an indicator
                # to the wrong hierarch of levels.
                _('Level program ID %(l_p_id)d and indicator program ID (%i_p_id)d mismatched'),
                code='foreign_key_mismatch',
                params={
                    'l_p_id': level.program_id,
                    'i_p_id': self.programval.pk
                }
            )
        return level

    def clean_means_of_verification(self):
        """field typed changed to return "" instead of None causing a non-update, this returns old null"""
        means_of_verification = self.cleaned_data['means_of_verification']
        if not means_of_verification and self.instance and not self.instance.means_of_verification:
            return self.instance.means_of_verification
        return means_of_verification

    def clean_method_of_analysis(self):
        """field typed changed to return "" instead of None causing a non-update, this returns old null"""
        method_of_analysis = self.cleaned_data['method_of_analysis']
        if not method_of_analysis and self.instance and not self.instance.method_of_analysis:
            return self.instance.method_of_analysis
        return method_of_analysis

    def clean_data_collection_method(self):
        """field typed changed to return "" instead of None causing a non-update, this returns old null"""
        data_collection_method = self.cleaned_data['data_collection_method']
        if not data_collection_method and self.instance and not self.instance.data_collection_method:
            return self.instance.data_collection_method
        return data_collection_method

    def clean_definition(self):
        """field typed changed to return "" instead of None causing a non-update, this returns old null"""
        definition = self.cleaned_data['definition']
        if not definition and self.instance and not self.instance.definition:
            return self.instance.definition
        return definition

    def update_disaggregations(self, instance):
        # collect disaggs that this user doesn't have access to and don't touch them:
        existing_disaggregations = instance.disaggregation.exclude(
            pk__in=self.fields['grouped_disaggregations'].active_values
        )
        instance.disaggregation.set(
            DisaggregationType.objects.filter(
                Q(pk__in=self.cleaned_data.get('grouped_disaggregations', [])) |
                Q(pk__in=existing_disaggregations)
            )
        )
        return instance

    def save(self, commit=True):
        # set the program on the indicator on create (it's already set on update)
        if self.instance.program_id is None:
            self.instance.program_id = self.programval.id
        instance = super().save(commit=False)
        if commit:
            instance.save()
            instance = self.update_disaggregations(instance)
            self.save_m2m()
        return instance


    def get_form_guidance_url(self, language='en'):
        return 'https://learn.mercycorps.org/index.php/TOLA:Section_05/en#b._TolaActivity_Indicator_Planning_Form_Guides'


class ResultForm(forms.ModelForm):
    rationale = forms.CharField(required=False)
    achieved = NonLocalizedDecimalField(
        decimal_places=2, localize=True,
        # Translators: This is a result that was actually achieved, versus one that was planned.
        label=_('Actual value'))

    class Meta:
        model = Result
        exclude = ['create_date', 'edit_date']
        widgets = {
            'comments': forms.Textarea(attrs={'rows': 4}),
            'program': forms.HiddenInput(),
            'indicator': forms.HiddenInput(),
        }
        labels = {
            'site': _('Site'),
            # Translators: field label that identifies which of a set of a targets (e.g. monthly/annual) a result
            # is being compared to
            'periodic_target': _('Measure against target'),
            'evidence_url': _('Link to file or folder'),
        }

    target_frequency = forms.CharField(
        widget=forms.HiddenInput(),
        required=False
    )
    date_collected = forms.DateField(
        widget=DatePicker.DateInput(
            format=formats.get_format('DATE_INPUT_FORMATS', lang=translation.get_language())[-1]),
        # TODO: this field outputs dates in non-ISO formats in Spanish & French
        localize=True,
        required=True,
        help_text=' ',
        label=_('Result date')
    )

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user')
        self.indicator = kwargs.pop('indicator')
        self.program = kwargs.pop('program')
        self.request = kwargs.pop('request')
        super(ResultForm, self).__init__(*args, **kwargs)

        # Disable all field objects contained in this dict if the user has read-only access.
        if not self.request.has_write_access:
            for field in self.fields.values():
                field.disabled = True

        self.set_initial_querysets()
        self.set_periodic_target_widget()
        self.fields['target_frequency'].initial = self.indicator.target_frequency
        self.fields['indicator'].initial = self.indicator.id
        self.fields['program'].initial = self.indicator.program.id


    def set_initial_querysets(self):
        """populate foreign key fields with limited quersets based on user / country / program"""
        # provide only in-program / in-country Site objects for the evidence queryset

        self.fields['site'].queryset = SiteProfile.objects.filter(
            country__in=self.indicator.program.country.filter(
                Q(id__in=self.request.user.tola_user.managed_countries.all().values('id')) |
                Q(id__in=self.request.user.tola_user.programaccess_set.filter(
                    Q(role='high') | Q(role='medium')
                ).values('country_id'))
            )
        )

    def set_periodic_target_widget(self):
        # Django will deliver localized strings to the template but the form needs to be able to compare the date
        # entered to the start and end dates of each period.  Data attributes (attached to each option element) are
        # used to provide access to the start and end dates in ISO format, since they are easier to compare to than
        # the localized date strings.
        periodic_targets = PeriodicTarget.objects.select_related('indicator') \
            .filter(indicator=self.indicator) \
            .order_by('customsort', 'create_date', 'period')
        data = {'data-start': {'': ''}, 'data-end': {'': ''}}
        choices = [('', '---------')]
        for pt in periodic_targets:
            data['data-start'].update({pt.id: pt.start_date})
            data['data-end'].update({pt.id: pt.end_date})
            choices.append((pt.id, str(pt)))
        self.fields['periodic_target'].widget = DataAttributesSelect(data=data, choices=choices)

    def clean_date_collected(self):
        date_collected = self.cleaned_data['date_collected']

        # Date can't be before program start
        if date_collected < self.program.reporting_period_start:
            raise ValidationError(
                _("You can begin entering results on {program_start_date}, the program start date").format(
                    program_start_date=self.program.reporting_period_start))

        # Date must be before program end date
        if date_collected > self.program.reporting_period_end:
            raise ValidationError(_("Please select a date between {program_start_date} and {program_end_date}").format(
                program_start_date=self.program.reporting_period_start,
                program_end_date=self.program.reporting_period_end,
            ))

        # Date must be before "today" with some wiggle room to account for timezone differences
        # Assume a user can only be 1 day in the future
        # Fun fact: If our server was in the right time zone, the user could be 2 days ahead!
        # https://www.timeanddate.com/time/dateline.html
        today = timezone.localdate() + timedelta(days=1)
        if date_collected > today:
            raise ValidationError(_("Please select a date between {program_start_date} and {todays_date}").format(
                program_start_date=self.program.reporting_period_start,
                todays_date=today,
            ))

        return date_collected

    def clean(self):
        cleaned_data = super(ResultForm, self).clean()
        record_name = cleaned_data.get('record_name')
        evidence_url = cleaned_data.get('evidence_url')

        if record_name and not evidence_url:
            msg = forms.ValidationError(_('URL required if record name is set'))
            self.add_error('evidence_url', msg)


class PinnedReportForm(forms.ModelForm):
    class Meta:
        model = PinnedReport
        exclude = ('tola_user',)

    def validate_uniqueness(self, tola_user):
        """Helper method for validating uniqueness (called after form validation, as it is a multi-field validate)"""
        data = self.cleaned_data
        if PinnedReport.objects.filter(name=data['name'], program=data['program'], tola_user=tola_user).exists():
            return False
        return True


class BaseDisaggregatedValueFormSet(forms.BaseFormSet):
    disaggregation = None

    @classmethod
    def get_default_prefix(cls):
        return "disaggregation-formset-{}".format(cls.disaggregation.pk) if cls.disaggregation else 'form'

    def __init__(self, *args, **kwargs):
        self.result = kwargs.pop('result', None)
        self.request = kwargs.pop('request', None)
        self.clear_all = False
        super().__init__(*args, **kwargs)

    def get_form_kwargs(self, index):
        try:
            label = self.disaggregation.labels[index]
        except (IndexError, AttributeError):
            raise RuntimeError("Disaggregation/Labels not provided to Disaggregation form")
        if self.result and self.result.disaggregated_values.filter(category=label.pk).exists():
            value = self.result.disaggregated_values.filter(category=label.pk).first().value
        else:
            value = None
        enabled = self.request and self.request.has_write_access

        return {
            **super().get_form_kwargs(index),
            'label': label,
            'initial_value': value,
            'enabled': enabled
        }
        return super().get_form_kwargs(index)

    def clean(self):
        if any(self.errors):
            return
        if not self.result:
            raise forms.ValidationError('cannot save disaggregated values without result provided')
        achieved = [form.cleaned_data.get('value') for form in self.forms]
        if all([v is None for v in achieved]):
            self.clear_all = True
        elif self.result.indicator.unit_of_measure_type == Indicator.PERCENTAGE:
            return


    def save(self):
        if self.is_valid():
            values = []
            for form in self.forms:
                if not self.clear_all:
                    value, created = DisaggregatedValue.objects.update_or_create(
                        category_id=form.cleaned_data.get('label_pk'),
                        result_id=self.result.id,
                        defaults={'value': form.cleaned_data.get('value')}
                    )
                    values.append(value)
                else:
                    # if clear all (all values blanked) delete the whole range of disaggs
                    DisaggregatedValue.objects.filter(
                        result=self.result,
                        category_id=form.cleaned_data.get('label_pk')
                    ).delete()
            return values
        return self.errors


class DisaggregatedValueForm(forms.Form):
    label_pk = forms.IntegerField(widget=forms.HiddenInput(), required=False)
    value = NonLocalizedDecimalField(decimal_places=2, localize=True, required=False,
                                     widget=forms.TextInput(attrs={'autocomplete': 'off'}))

    def __init__(self, *args, **kwargs):
        kwargs.setdefault('label_suffix', '')
        label = kwargs.pop('label')
        enabled = kwargs.pop('enabled')
        initial_value = kwargs.pop('initial_value', None)
        super().__init__(*args, **kwargs)
        self.fields['label_pk'].initial = label.pk
        self.fields['value'].label = label.label
        self.fields['value'].initial = initial_value
        if not enabled:
            self.fields['value'].disabled = True

    def clean_label_pk(self):
        data = self.fields['label_pk'].initial
        try:
            label = DisaggregationLabel.objects.get(pk=data)
        except DisaggregationLabel.DoesNotExist:
            raise forms.ValidationError("Invalid form setup - no label for disaggregation value")
        return data

    def clean_value(self):
        value = self.cleaned_data.get('value', None)
        if value is None:
            return value
        try:
            value = float(value)
        except ValueError:
            raise forms.ValidationError('Please enter a number, you entered {}'.format(value))
        if round(value, 2) == int(value):
            return int(value)
        return decimal.Decimal(value).quantize(decimal.Decimal('.01'))


def get_disaggregated_result_formset(disaggregation):
    FormSet = forms.formset_factory(
        DisaggregatedValueForm,
        formset=BaseDisaggregatedValueFormSet,
        min_num=len(disaggregation.labels),
        max_num=len(disaggregation.labels),
        extra=0
    )
    FormSet.disaggregation = disaggregation
    FormSet.disaggregation_label = _(disaggregation.disaggregation_type)
    return FormSet
