import uuid
from datetime import timedelta

from workflow.models import (
    Program,
    SiteProfile,
    Documentation,
    ProjectComplete,
    TolaUser,
    Sector,
)
from tola.util import getCountry
from indicators.models import (
    Indicator,
    PeriodicTarget,
    Result,
    Objective,
    StrategicObjective,
    DisaggregationType,
    Level,
    IndicatorType,
    PinnedReport,
)
from indicators.widgets import DataAttributesSelect, DatePicker

from django.core.exceptions import ValidationError
from django.db.models import Q
from django import forms
from django.utils.translation import ugettext_lazy as _
from django.utils import formats, translation, timezone


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


class IndicatorForm(forms.ModelForm):
    unit_of_measure_type = forms.ChoiceField(
        choices=Indicator.UNIT_OF_MEASURE_TYPES,
        widget=forms.RadioSelect(),
    )
    old_level = forms.ChoiceField(
        choices=[('', '------')] + [(name, name) for (pk, name) in Indicator.OLD_LEVELS],
        initial=None
    )

    rationale = forms.CharField(required=False)

    class Meta:
        model = Indicator
        exclude = ['create_date', 'edit_date', 'level_order', 'program']
        widgets = {
            'definition': forms.Textarea(attrs={'rows': 4}),
            'justification': forms.Textarea(attrs={'rows': 4}),
            'quality_assurance': forms.Textarea(attrs={'rows': 4}),
            'data_issues': forms.Textarea(attrs={'rows': 4}),
            'indicator_changes': forms.Textarea(attrs={'rows': 4}),
            'comments': forms.Textarea(attrs={'rows': 4}),
            'notes': forms.Textarea(attrs={'rows': 4}),
            'rationale_for_target': forms.Textarea(attrs={'rows': 4}),
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

        # program_display here is to display the program without interfering in the logic that
        # assigns a program to an indicator (and doesn't update it) - but it looks like other fields
        self.fields['program_display'] = forms.ChoiceField(
            choices=[('', self.programval.name),],
            required=False,
        )
        self.fields['program_display'].disabled = True
        self.fields['program_display'].label = _('Program')

        # level is here the new "result level" (RF) level option (FK to model Level)
        # Translators: This is a form field label that allows users to select which Level object to associate with the Result that's being entered into the form
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
            # Translators: a "number" in this context is a kind of label.  This is help text to explain why a user is seeing customized numbers instead of auto-generated ones that can derived from the indicator's place in the hierarchy
            self.fields['number'].help_text = _("This number is displayed in place of the indicator number automatically generated through the results framework.  An admin can turn on auto-numbering in program settings")
        if self.programval.results_framework:
            # no need to update the old_level field if they are using the results framework:
            self.fields.pop('old_level')
            self.fields['level'].required = True
        else:
            # pre-migration to RF, all fields remain unchanged in this regard (still required):
            self.fields['old_level'].required = True
            # Translators:  Indicator objects are assigned to Levels, which are in a hierarchy.  We recently changed how we organize Levels. This is a field label for the indicator-associated Level in the old level system
            self.fields['old_level'].label = _('Old indicator level')
            # Translators:  We recently changed how we organize Levels. The new system is called the "results framework". This is help text for users to let them know that they can use the new system now.
            self.fields['old_level'].help_text = _("Indicators are currently grouped by an older version of indicator levels. To group indicators according to the results framework, an admin will need to adjust program settings.")

        if not self.request.has_write_access:
            for name, field in self.fields.items():
                field.disabled = True
        countries = getCountry(self.request.user)
        self.fields['disaggregation'].queryset = DisaggregationType.objects\
            .filter(country__in=countries, standard=False)
        if self.programval._using_results_framework == Program.NOT_MIGRATED and Objective.objects.filter(program_id=self.programval.id).exists():
            self.fields['objectives'].queryset = Objective.objects.filter(program__id__in=[self.programval.id])
        else:
            self.fields.pop('objectives')
        self.fields['strategic_objectives'].queryset = StrategicObjective.objects.filter(country__in=countries)
        self.fields['approved_by'].queryset = TolaUser.objects.filter(country__in=countries).distinct()
        self.fields['approval_submitted_by'].queryset = TolaUser.objects.filter(country__in=countries).distinct()
        self.fields['name'].label = _('Indicator')
        self.fields['name'].required = True
        self.fields['name'].widget = forms.Textarea(attrs={'rows': 3})
        self.fields['unit_of_measure'].required = True
        self.fields['target_frequency'].required = True
        # self.fields['is_cumulative'].widget = forms.RadioSelect()
        if self.instance.target_frequency and self.instance.target_frequency != Indicator.LOP:
            self.fields['target_frequency'].widget.attrs['readonly'] = True

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
                # Translators: This is an error message that is returned when a user is trying to assign an indicator to the wrong hierarch of levels.
                _('Level program ID %(l_p_id)d and indicator program ID (%i_p_id)d mismatched'),
                code='foreign_key_mismatch',
                params={
                    'l_p_id': level.program_id,
                    'i_p_id': self.programval.pk
                }
            )
        return level


    def save(self, commit=True):
        # set the program on the indicator on create (it's already set on update)
        if self.instance.program_id is None:
            self.instance.program_id = self.programval.id
        return super(IndicatorForm, self).save(commit)


class ResultForm(forms.ModelForm):
    rationale = forms.CharField(required=False)

    class Meta:
        model = Result
        exclude = ['create_date', 'edit_date']
        widgets = {
            'comments': forms.Textarea(attrs={'rows': 4}),
            'program': forms.HiddenInput(),
            'indicator': forms.HiddenInput(),
            'evidence': forms.HiddenInput()
        }
        labels = {
            'site': _('Site'),
            # Translators: This is a result that was actually achieved, versus one that was planned.
            'achieved': _('Actual value'),
            # Translators: field label that
            'periodic_target': _('Measure against target'),
            'complete': _('Project'),
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

        #TODO: unless I don't know how dicts work, this doesn't modify the actual fields at all?
        if not self.request.has_write_access:
            for name, field in self.fields.items():
                field.disabled = True

        self.set_initial_querysets()
        self.set_periodic_target_widget()
        self.fields['target_frequency'].initial = self.indicator.target_frequency
        self.fields['indicator'].initial = self.indicator.id
        self.fields['program'].initial = self.indicator.program.id

    def set_initial_querysets(self):
        """populate foreign key fields with limited quersets based on user / country / program"""
        # provide only in-program Documentation objects for the evidence queryset

        self.fields['site'].queryset = SiteProfile.objects.filter(
            country__in=self.indicator.program.country.filter(
                Q(id__in=self.request.user.tola_user.managed_countries.all().values('id')) |
                Q(id__in=self.request.user.tola_user.programaccess_set.filter(
                    Q(role='high') | Q(role='medium')
                ).values('country_id'))
            )
        )

        self.fields['evidence'].queryset = Documentation.objects\
            .filter(program=self.indicator.program)
        # only display Project field to existing users
        if not self.user.tola_user.allow_projects_access:
            self.fields.pop('complete')
        else:
            # provide only in-program projects for the complete queryset:
            self.fields['complete'].queryset = ProjectComplete.objects.filter(program=self.program)

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




class ReportFormCommon(forms.Form):
    EMPTY = 0
    YEARS = Indicator.ANNUAL
    SEMIANNUAL = Indicator.SEMI_ANNUAL
    TRIANNUAL = Indicator.TRI_ANNUAL
    QUARTERS = Indicator.QUARTERLY
    MONTHS = Indicator.MONTHLY
    TIMEPERIODS_CHOICES = (
        (YEARS, _("years")),
        (SEMIANNUAL, _("semi-annual periods")),
        (TRIANNUAL, _("tri-annual periods")),
        (QUARTERS, _("quarters")),
        (MONTHS, _("months"))
    )

    SHOW_ALL = 1
    MOST_RECENT = 2
    TIMEFRAME_CHOICES = (
        (SHOW_ALL, _("Show all")),
        (MOST_RECENT, _("Most recent"))
    )

    EMPTY_OPTION = (EMPTY, "---------")
    # combine the target_frequencies (except EVENT) and the EMPTY option
    TARGETPERIODS_CHOICES = (EMPTY_OPTION,) + Indicator.TARGET_FREQUENCIES[0:7]

    program = forms.ModelChoiceField(queryset=Program.objects.none())
    timeperiods = forms.ChoiceField(choices=TIMEPERIODS_CHOICES, required=False)
    targetperiods = forms.ChoiceField(choices=TARGETPERIODS_CHOICES, required=False)
    timeframe = forms.ChoiceField(choices=TIMEFRAME_CHOICES, widget=forms.RadioSelect(), required=False)
    numrecentperiods = forms.IntegerField(required=False)
    formprefix = forms.CharField(widget=forms.HiddenInput(), required=False)

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request')
        countries = getCountry(self.request.user)
        super(ReportFormCommon, self).__init__(*args, **kwargs)
        self.fields['program'].label = _("Program")
        self.fields['timeperiods'].label = _("Time periods")
        self.fields['timeperiods'].choices = ((k, v.capitalize()) for k, v in self.TIMEPERIODS_CHOICES)
        self.fields['numrecentperiods'].widget.attrs['placeholder'] = _("enter a number")
        self.fields['targetperiods'].label = _("Target periods")
        self.fields['program'].queryset = self.request.user.tola_user.available_programs \
            .filter(funding_status="Funded",
                    reporting_period_start__isnull=False,
                    reporting_period_end__isnull=False,
                    reporting_period_start__lte=timezone.localdate(),
                    indicator__target_frequency__isnull=False,) \
            .exclude(indicator__isnull=True) \
            .distinct()


class IPTTReportQuickstartForm(ReportFormCommon):
    prefix = 'timeperiods'
    formprefix = forms.CharField(widget=forms.HiddenInput(), required=False)

    def __init__(self, *args, **kwargs):
        prefix = kwargs.pop('prefix')
        self.prefix = prefix if prefix is not None else self.prefix
        super(IPTTReportQuickstartForm, self).__init__(*args, **kwargs)
        self.fields['formprefix'].initial = self.prefix
        self.fields['timeframe'].initial = self.SHOW_ALL
        # self.fields['timeperiods'].widget = forms.HiddenInput()
        self.fields['timeperiods'].initial = Indicator.MONTHLY


class IPTTReportFilterForm(ReportFormCommon):
    level = forms.ModelMultipleChoiceField(queryset=Level.objects.none(), required=False, label=_('Levels'))
    ind_type = forms.ModelMultipleChoiceField(queryset=IndicatorType.objects.none(), required=False, label=_('Types'))
    sector = forms.ModelMultipleChoiceField(queryset=Sector.objects.none(), required=False, label=_('Sectors'))
    site = forms.ModelMultipleChoiceField(queryset=SiteProfile.objects.none(), required=False, label=_('Sites'))
    indicators = forms.ModelMultipleChoiceField(
        queryset=Indicator.objects.none(), required=False, label=_('Indicators'))

    def __init__(self, *args, **kwargs):
        program = kwargs.pop('program')
        periods_choices_start = kwargs.get('initial').get('period_choices_start') # TODO: localize this date
        periods_choices_end = kwargs.get('initial').get('period_choices_end') # TODO: localize this date

        target_frequencies = program.indicator_set.filter(target_frequency__isnull=False) \
            .exclude(target_frequency=Indicator.EVENT) \
            .values('target_frequency') \
            .distinct() \
            .order_by('target_frequency')

        target_frequency_choices = []
        for tp in target_frequencies:
            try:
                pk = int(tp['target_frequency'])
                target_frequency_choices.append((pk, Indicator.TARGET_FREQUENCIES[pk-1][1]))
            except TypeError:
                pass

        first_year_first_daterange_key = kwargs.get('initial').get('period_start_initial')
        last_year_last_daterange_key = kwargs.get('initial').get('period_end_initial')

        super(IPTTReportFilterForm, self).__init__(*args, **kwargs)
        del self.fields['formprefix']
        level_ids = program.indicator_set.values(
            'level_id').distinct().order_by('level')

        self.fields['program'].initial = program
        self.fields['sector'].queryset = Sector.objects.filter(
            indicator__program=program).distinct()
        self.fields['level'].queryset = Level.objects.filter(id__in=level_ids).distinct().order_by('customsort')
        ind_type_ids = program.indicator_set.values(
            'indicator_type__id').distinct().order_by('indicator_type')
        self.fields['ind_type'].queryset = IndicatorType.objects.filter(id__in=ind_type_ids).distinct()
        self.fields['site'].queryset = program.get_sites()
        self.fields['indicators'].queryset = program.indicator_set.all()

        # Start and end periods dropdowns are updated dynamically
        self.fields['start_period'] = forms.ChoiceField(choices=periods_choices_start, label=_("START"))
        self.fields['end_period'] = forms.ChoiceField(choices=periods_choices_end, label=_("END"))

        self.fields['start_period'].initial = str(first_year_first_daterange_key)
        self.fields['end_period'].initial = str(last_year_last_daterange_key)

        self.fields['targetperiods'] = forms.ChoiceField(choices=target_frequency_choices, label=_("TARGET PERIODS"))


class PinnedReportForm(forms.ModelForm):
    class Meta:
        model = PinnedReport
        exclude = ('tola_user',)
