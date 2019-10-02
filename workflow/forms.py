
from functools import partial

from crispy_forms.helper import FormHelper
from crispy_forms.bootstrap import *
from crispy_forms.layout import Layout, Submit, Reset, Field, LayoutObject, TEMPLATE_PACK, Fieldset, Div, HTML

from django.forms import HiddenInput
from django.utils.translation import ugettext_lazy as _
from django import forms
from django.db.models import Q
from django.template import Context

from workflow.widgets import GoogleMapsWidget
from workflow.models import (
    ProjectComplete, Program, SiteProfile, Documentation, Benchmarks,
    Monitor, Budget, ChecklistItem,
    TolaUser, Sector, Country
)

from tola.util import getCountry



#Global for approvals
APPROVALS = (
        ('in progress', 'in progress'),
        ('awaiting approval', 'awaiting approval'),
        ('approved', 'approved'),
        ('rejected', 'rejected'),
    )


#Global for Budget Variance
BUDGET_VARIANCE = (
        ("Over Budget", "Over Budget"),
        ("Under Budget", "Under Budget"),
        ("No Variance", "No Variance"),
    )


class Formset(LayoutObject):
    """
    Layout object. It renders an entire formset, as though it were a Field.

    Example::

    Formset("attached_files_formset")
    """

    def __init__(self, formset_name_in_context, *fields, **kwargs):
        self.fields = []
        self.formset_name_in_context = formset_name_in_context
        self.label_class = kwargs.pop('label_class', u'blockLabel')
        self.css_class = kwargs.pop('css_class', u'ctrlHolder')
        self.css_id = kwargs.pop('css_id', None)
        self.flat_attrs = flatatt(kwargs)
        self.template = "formset.html"
        self.helper = FormHelper()
        self.helper.form_tag = False

    def render(self, form, form_style, context, template_pack=TEMPLATE_PACK):

        form_class = 'form-horizontal'

        return render_to_string(
            self.template,
            Context({'wrapper': self, 'formset': self.formset_name_in_context, 'form_class': form_class}))


class DatePicker(forms.DateInput):
    """
    Use in form to create a Jquery datepicker element
    """
    template_name = 'datepicker.html'

    DateInput = partial(forms.DateInput, {'class': 'datepicker', 'autocomplete': 'off'})


class BudgetForm(forms.ModelForm):

    class Meta:
        model = Budget
        exclude = ['create_date', 'edit_date']


    def __init__(self, *args, **kwargs):

        self.request = kwargs.pop('request')
        self.helper = FormHelper()
        self.helper.form_class = 'form-horizontal'
        self.helper.label_class = ''
        self.helper.field_class = ''
        self.helper.form_error_title = 'Form Errors'
        self.helper.error_text_inline = True
        self.helper.help_text_inline = True
        self.helper.html5_required = True
        self.helper.form_tag = False
        self.helper.layout = Layout(
            Field('contributor', required=False), Field('description_of_contribution', required=False),
            PrependedAppendedText('proposed_value','$', '.00'), 'agreement', 'complete',
        )


        super(BudgetForm, self).__init__(*args, **kwargs)
        self.fields['agreement'].widget = forms.HiddenInput()#TextInput()
        self.fields['complete'].widget = forms.HiddenInput()#TextInput()
        #countries = getCountry(self.request.user)

        #self.fields['agreement'].queryset = ProjectAgreement.objects.filter(program__country__in = countries)

    def save(self, *args, **kwargs):
        # Commit is already set to false
        obj = super(BudgetForm, self).save(*args, **kwargs)
        return obj


class ProjectCompleteCreateForm(forms.ModelForm):

    class Meta:
        model = ProjectComplete
        fields = '__all__'

    program2 =  forms.CharField( widget=forms.TextInput(attrs={'readonly':'readonly'}) )
    project_agreement2 =  forms.CharField( widget=forms.TextInput(attrs={'readonly':'readonly'}) )

    map = forms.CharField(widget=GoogleMapsWidget(
        attrs={'width': 700, 'height': 400, 'longitude': 'longitude', 'latitude': 'latitude'}), required=False)

    expected_start_date = forms.DateField(widget=DatePicker.DateInput(), required=False)
    expected_end_date = forms.DateField(widget=DatePicker.DateInput(), required=False)
    actual_start_date = forms.DateField(widget=DatePicker.DateInput(), required=False)
    actual_end_date = forms.DateField(widget=DatePicker.DateInput(), required=False)

    program = forms.ModelChoiceField(queryset=Program.objects.filter(funding_status="Funded"))

    def __init__(self, *args, **kwargs):
        #get the user object from request to check permissions
        self.request = kwargs.pop('request')
        self.helper = FormHelper()
        self.helper.form_method = 'post'
        self.helper.form_class = 'form-horizontal'
        self.helper.label_class = 'col-sm-2'
        self.helper.field_class = 'col-sm-6'
        self.helper.form_error_title = 'Form Errors'
        self.helper.error_text_inline = True
        self.helper.help_text_inline = True
        self.helper.html5_required = True
        if kwargs['initial'].get('short'):
            fieldset = Fieldset(
                'Program', 'program2', 'program', 'project_agreement2', 'project_agreement', 'activity_code',
                'sector', 'project_name', 'estimated_budget', 'site',
                    )
        else:
            fieldset = Fieldset(
                'Program', 'program2', 'program', 'project_agreement', 'project_agreement2', 'activity_code',
                'account_code', 'lin_code', 'sector','project_name', 'project_activity', 'site',
                    )
        self.helper.layout = Layout(
            HTML("""<br/>"""),
            TabHolder(
                Tab('Executive Summary',
                    fieldset,
                    Fieldset(
                        'Dates',
                        'expected_start_date','expected_end_date', 'actual_start_date', 'actual_end_date',
                        PrependedText('on_time', ''), 'no_explanation',

                    ),
                ),
            ),
            FormActions(
                Submit('submit', 'Save', css_class='btn-default')
            ),
        )
        super(ProjectCompleteCreateForm, self).__init__(*args, **kwargs)

        #override the program queryset to use request.user for country
        countries = getCountry(self.request.user)
        self.fields['program'].queryset = Program.objects.filter(funding_status="Funded", country__in=countries)
        self.fields['site'].queryset = SiteProfile.objects.filter(country__in=countries)
        self.fields['program2'].initial = kwargs['initial'].get('program')
        self.fields['program'].widget = forms.HiddenInput()
        self.fields['program2'].label = "Program"
        self.fields['project_agreement2'].initial = "%s - %s" % (kwargs['initial'].get('office'),  kwargs['initial'].get('project_name', 'No project name') )
        self.fields['project_agreement2'].label = "Project Initiation"
        self.fields['project_agreement'].widget = forms.HiddenInput()


class ProjectCompleteForm(forms.ModelForm):

    class Meta:
        model = ProjectComplete
        fields = '__all__'

    map = forms.CharField(widget=GoogleMapsWidget(
        attrs={'width': 700, 'height': 400, 'longitude': 'longitude', 'latitude': 'latitude'}), required=False)

    expected_start_date = forms.DateField(widget=DatePicker.DateInput(), required=False)
    expected_end_date = forms.DateField(widget=DatePicker.DateInput(), required=False)
    actual_start_date = forms.DateField(widget=DatePicker.DateInput(), required=False)
    actual_end_date = forms.DateField(widget=DatePicker.DateInput(), required=False)
    actual_cost_date = forms.DateField(widget=DatePicker.DateInput(), required=False)
    exchange_rate_date = forms.DateField(widget=DatePicker.DateInput(), required=False)

    program2 =  forms.CharField( widget=forms.TextInput(attrs={'readonly':'readonly'}) )
    project_agreement2 = forms.CharField( widget=forms.TextInput(attrs={'readonly': 'readonly'}))

    approval = forms.ChoiceField(
        choices=APPROVALS,
        initial='in progress',
        required=False,
    )

    budget_variance = forms.ChoiceField(
        choices=BUDGET_VARIANCE,
        initial='Over Budget',
        required=False,
    )

    def __init__(self, *args, **kwargs):
        #get the user object from request to check permissions
        self.request = kwargs.pop('request')
        self.helper = FormHelper()
        self.helper.form_method = 'post'
        self.helper.form_class = ''
        self.helper.label_class = ''
        self.helper.field_class = ''
        self.helper.form_error_title = 'Form Errors'
        self.helper.error_text_inline = True
        self.helper.help_text_inline = True
        self.helper.html5_required = True
        self.helper.layout = Layout(

            HTML("""<br/>"""),
            TabHolder(
                Tab('Executive Summary',
                    Fieldset(
                        '', 'program', 'program2', 'project_agreement', 'project_agreement2', 'activity_code',
                        'account_code', 'lin_code', 'sector','project_name', 'project_activity', 'site',
                        ),
                    Fieldset(
                        'Dates',
                        'expected_start_date','expected_end_date', 'actual_start_date', 'actual_end_date',
                        'on_time', 'no_explanation',

                        ),
                    ),
                Tab('Components',
                    Fieldset("Project Components",
                        HTML("""

                            <div class='panel panel-default'>
                              <!-- Default panel contents -->
                              <div class='panel-heading'>Components</div>
                              {% if getBenchmark %}
                                  <!-- Table -->
                                  <table class="table">
                                    <tr>
                                    <th>Description</th>
                                    <th>Site</th>
                                    <th>Est. Start Date</th>
                                    <th>Est. End Date</th>
                                    <th>Actual Start Date</th>
                                    <th>Actual End Date</th>
                                    <th>Budget</th>
                                    <th>Actual Cost</th>
                                    <th>View</th>
                                    </tr>
                                    {% for item in getBenchmark %}
                                    <tr>
                                        <td>{{ item.description}}</td>
                                        <td>{{ item.site }}</td>
                                        <td>{{ item.est_start_date|date:"MEDIUM_DATE_FORMAT"}}</td>
                                        <td>{{ item.est_end_date|date:"MEDIUM_DATE_FORMAT"}}</td>
                                        <td>{{ item.actual_start_date|date:"MEDIUM_DATE_FORMAT"}}</td>
                                        <td>{{ item.actual_end_date|date:"MEDIUM_DATE_FORMAT"}}</td>
                                        <td>{{ item.budget}}</td>
                                        <td>{{ item.cost}}</td>
                                        <td><a class="benchmarks" data-toggle="modal" data-target="#myModal" href='/workflow/benchmark_complete_update/{{ item.id }}/'>Edit</a> | <a class="benchmarks" href='/workflow/benchmark_complete_delete/{{ item.id }}/' data-toggle="modal" data-target="#myModal">Delete</a></td>
                                    </tr>
                                    {% endfor %}
                                  </table>
                              {% endif %}
                              <div class="panel-footer">
                                <a class="benchmarks btn btn-link btn-add" data-toggle="modal" data-target="#myModal" href="/workflow/benchmark_complete_add/{{ id }}/?is_it_project_complete_form=true"><i class="fas fa-plus-circle"></i> Add Component</a>
                              </div>
                            </div>

                            """),
                        ),
                    ),
                Tab('Budget',
                    Fieldset(
                        '',
                        PrependedAppendedText('estimated_budget','$', '.00'), PrependedAppendedText('actual_budget','$', '.00'),'actual_cost_date', 'budget_variance', 'explanation_of_variance',
                        PrependedAppendedText('total_cost','$', '.00'), PrependedAppendedText('agency_cost','$', '.00'),
                        AppendedText('local_total_cost', '.00'), AppendedText('local_agency_cost', '.00'),'exchange_rate','exchange_rate_date',
                    ),

                ),
                Tab('Budget Other',
                    Fieldset(
                        "Other Budget Contributions:",
                        Div(
                            "",
                            HTML("""

                                <div class='panel panel-default'>
                                  <!-- Default panel contents -->
                                  <div class='panel-heading'>Budget Contributions</div>
                                  <!-- Table -->
                                  <table class="table" id="budget_contributions_table">
                                  <tbody>
                                  {% if getBudget %}
                                        <tr>
                                        <th>Contributor</th>
                                        <th>Description</th>
                                        <th>Value</th>
                                        <th>View</th>
                                        </tr>
                                        {% for item in getBudget %}
                                        <tr>
                                            <td>{{ item.contributor}}</td>
                                            <td>{{ item.contributor_description}}</td>
                                            <td>{{ item.proposed_value}}</td>
                                            <td><a class="output" data-toggle="modal" data-target="#myModal" href='/workflow/budget_update/{{ item.id }}/'>View</a> | <a class="output" href='/workflow/budget_delete/{{ item.id }}/' data-toggle="modal" data-target="#myModal" >Delete</a>
                                        </tr>
                                        {% endfor %}
                                  {% endif %}
                                  </tbody>
                                  </table>
                                  <div class="panel-footer">
                                    <a class="output btn btn-link btn-add" data-toggle="modal" data-target="#myModal" href="/workflow/budget_add/{{ id }}/?is_it_project_complete_form=true"><i class="fas fa-plus-circle"></i> Add Budget Contribution</a>
                                  </div>
                                </div>
                            """),
                        ),
                    ),

                ),
                Tab('Impact',
                    Fieldset(
                        '',
                        Div(
                            '',
                             HTML("""
                                <div class='panel panel-default'>
                                    <div class='panel-heading'><h3>Related indicators</h3></div>
                                    {% if getQuantitative %}
                                        <table class="table">
                                        {% for item in getQuantitative %}
                                            {% ifchanged item.indicator.id %}
                                                <tr>
                                                    <td><a href="/program/{{ item.indicator.program_id }}/#/indicator/{{ item.indicator_id }}/" target="_blank">{{ item.indicator}}<a/></td>
                                                </tr>
                                            {% endifchanged %}
                                        {% endfor %}
                                        </table>
                                    {% endif %}
                                </div>
                            """),
                        ),
                    ),
                    Fieldset(
                        '',AppendedText('progress_against_targets','%'),'beneficiary_type', 'direct_beneficiaries', 'average_household_size', 'indirect_beneficiaries', 'capacity_built','quality_assured','issues_and_challenges', 'lessons_learned',
                    ),
                ),

                Tab('Approval',
                    Fieldset('Approval',
                             'approval', 'approved_by',
                             Field('approval_remarks', rows="3", css_class='input-xlarge')
                    ),
                ),
            ),

            Div(
                FormActions(
                    Submit('submit', 'Save changes', css_class=''),
                    Reset('reset', 'Reset', css_class='')
                ),
                css_class='form-actions',
            ),


            Fieldset(
                '',
                Div(
                    '',
                    HTML("""
                        <div class='card-header'><strong>Project Files</strong></div>
                        <div class='card-body'>
                          <!-- Default panel contents -->
                          <h4>Documentation</h4>
                          {% if getDocuments %}
                              <!-- Table -->
                              <table class="table">
                                <tr>
                                <th>Name</th>
                                <th>Link(URL)</th>
                                <th>Description</th>
                                <th>&nbsp;</th>
                                </tr>
                                {% for item in getDocuments %}
                                <tr>
                                    <td>{{ item.name}}</td>
                                    <td><a href="{{ item.url}}" target="_new">{{ item.url}}</a></td>
                                    <td>{{ item.description}}</td>
                                    <td><a class="monitoring" data-toggle="modal" data-target="#myModal" href='/workflow/documentation_agreement_update/{{ item.id }}/{{ pk }}/'>Edit</a> | <a class="monitoring" href='/workflow/documentation_agreement_delete/{{ item.id }}/' data-toggle="modal" data-target="#myModal">Delete</a>
                                </tr>
                                {% endfor %}
                              </table>
                          {% endif %}
                          <div class="panel-footer">
                            <a onclick="newPopup('/workflow/documentation_list/?project_id={{ id }}','Add documentation'); return false;" href="#" class="btn btn-link btn-add"><i class="fas fa-plus-circle"></i> Add documentation</a>
                          </div>
                        </div>
                         """),
                ),
                css_class='card mt-3',
            ),
        )
        super(ProjectCompleteForm, self).__init__(*args, **kwargs)

        # override the program queryset to use request.user for country
        countries = getCountry(self.request.user)
        #self.fields['program'].queryset = Program.objects.filter(funding_status="Funded", country__in=countries)
        self.fields['program'].widget = forms.HiddenInput()
        self.fields['program2'].initial = self.instance.program
        self.fields['program2'].label = "Program"


        self.fields['approved_by'].queryset = TolaUser.objects.filter(country__in=countries).distinct()


        # override the community queryset to use request.user for country
        self.fields['site'].queryset = SiteProfile.objects.filter(country__in=countries)


        if not 'Approver' in self.request.user.groups.values_list('name', flat=True):
            APPROVALS = (
                ('in progress', 'in progress'),
                ('awaiting approval', 'awaiting approval'),
                ('rejected', 'rejected'),
            )
            self.fields['approval'].choices = APPROVALS
            self.fields['approved_by'].widget.attrs['disabled'] = "disabled"
            self.fields['approval_submitted_by'].widget.attrs['disabled'] = "disabled"
            self.fields['approval_remarks'].widget.attrs['disabled'] = "disabled"
            self.fields['approval'].help_text = "Approval level permissions required"


class ProjectCompleteSimpleForm(forms.ModelForm):

    class Meta:
        model = ProjectComplete
        fields = '__all__'

        exclude = ['create_date', 'edit_date','project_activity', 'account_code', 'lin_code', 'mc_estimated_budget',
               'local_total_estimated_budget', 'local_estimated_budget', 'approval_submitted_by', 'finance_reviewed_by',
               'me_reviewed_by', 'exchange_rate', 'exchange_rate_date',
               'estimation_date', 'other_budget']

    map = forms.CharField(widget=GoogleMapsWidget(
        attrs={'width': 700, 'height': 400, 'longitude': 'longitude', 'latitude': 'latitude'}), required=False)

    expected_start_date = forms.DateField(widget=DatePicker.DateInput(), required=False)
    expected_end_date = forms.DateField(widget=DatePicker.DateInput(), required=False)
    actual_start_date = forms.DateField(widget=DatePicker.DateInput(), required=False)
    actual_end_date = forms.DateField(widget=DatePicker.DateInput(), required=False)

    program2 =  forms.CharField( widget=forms.TextInput(attrs={'readonly':'readonly'}) )
    project_agreement2 = forms.CharField( widget=forms.TextInput(attrs={'readonly': 'readonly'}))

    approval = forms.ChoiceField(
        choices=APPROVALS,
        initial='in progress',
        required=False,
    )

    budget_variance = forms.ChoiceField(
        choices=BUDGET_VARIANCE,
        initial='Over Budget',
        required=False,
    )

    def __init__(self, *args, **kwargs):
        #get the user object from request to check permissions
        self.request = kwargs.pop('request')
        self.helper = FormHelper()
        self.helper.form_method = 'post'
        self.helper.form_class = ''
        self.helper.label_class = ''
        self.helper.field_class = ''
        self.helper.form_error_title = 'Form Errors'
        self.helper.error_text_inline = True
        self.helper.help_text_inline = True
        self.helper.html5_required = True
        self.helper.layout = Layout(
            HTML("""<br/>"""),
            TabHolder(
                Tab('Executive Summary',
                    Fieldset('Program',
                        'program', 'program2', 'project_agreement', 'project_agreement2', 'activity_code', 'sector','project_name','site',
                    ),
                    Fieldset('Dates',
                        'expected_start_date','expected_end_date', 'actual_start_date', 'actual_end_date',
                        'on_time', 'no_explanation',
                    ),
                ),
                Tab('Components',
                    Fieldset("Project Components",
                        HTML("""
                            <div class='panel panel-default'>
                                <!-- Default panel contents -->
                                <div class='panel-heading'>Components</div>
                                {% if getBenchmark %}
                                    <table class="table">
                                        <tr>
                                            <th>Description</th>
                                            <th>Site</th>
                                            <th>Est. Start Date</th>
                                            <th>Est. End Date</th>
                                            <th>Actual Start Date</th>
                                            <th>Actual End Date</th>
                                            <th>Budget</th>
                                            <th>Actual Cost</th>
                                            <th>View</th>
                                        </tr>
                                        {% for item in getBenchmark %}
                                            <tr>
                                                <td>{{ item.description}}</td>
                                                <td>{{ item.site }}</td>
                                                <td>{{ item.est_start_date|date:"MEDIUM_DATE_FORMAT"}}</td>
                                                <td>{{ item.est_end_date|date:"MEDIUM_DATE_FORMAT"}}</td>
                                                <td>{{ item.actual_start_date|date:"MEDIUM_DATE_FORMAT"}}</td>
                                                <td>{{ item.actual_end_date|date:"MEDIUM_DATE_FORMAT"}}</td>
                                                <td>{{ item.budget}}</td>
                                                <td>{{ item.cost}}</td>
                                                <td><a class="benchmarks" data-toggle="modal" data-target="#myModal" href='/workflow/benchmark_complete_update/{{ item.id }}/'>Edit</a> | <a class="benchmarks" href='/workflow/benchmark_complete_delete/{{ item.id }}/' data-toggle="modal" data-target="#myModal">Delete</a></td>
                                            </tr>
                                        {% endfor %}
                                    </table>
                                {% endif %}
                                <div class="panel-footer">
                                    <a class="benchmarks btn btn-link btn-add" data-toggle="modal" data-target="#myModal" href="/workflow/benchmark_complete_add/{{ id }}/?is_it_project_complete_form=true" id="btn_bench"><i class="fas fa-plus-circle"></i> Add Component</a>
                                </div>
                            </div>
                        """),
                    ),
                ),
                Tab('Budget',
                    Fieldset('',
                        PrependedAppendedText('estimated_budget','$', '.00'), PrependedAppendedText('actual_budget','$', '.00')
                    ),
                    Fieldset("Other Budget Contributions:",
                         Div(
                            HTML("""
                                <div class='panel panel-default'>
                                    <div class='panel-heading'>Budget Contributions</div>
                                    <table class="table" id="budget_contributions_table">
                                        <tbody>
                                            {% if getBudget %}
                                                <tr>
                                                    <th>Contributor</th>
                                                    <th>Description</th>
                                                    <th>Value</th>
                                                    <th>View</th>
                                                </tr>
                                                {% for item in getBudget %}
                                                    <tr>
                                                        <td>{{ item.contributor}}</td>
                                                        <td>{{ item.contributor_description}}</td>
                                                        <td>{{ item.proposed_value}}</td>
                                                        <td><a class="output" data-toggle="modal" data-target="#myModal" href='/workflow/budget_update/{{ item.id }}/'>View</a> | <a class="output" href='/workflow/budget_delete/{{ item.id }}/' data-toggle="modal" data-target="#myModal" >Delete</a>
                                                    </tr>
                                                {% endfor %}
                                            {% endif %}
                                        </tbody>
                                    </table>
                                    <div class="panel-footer">
                                        <a class="output btn btn-link btn-add" data-toggle="modal" data-target="#myModal" href="/workflow/budget_add/{{ pk }}/?is_it_project_complete_form=true"><i class="fas fa-plus-circle"></i> Add Budget Contribution</a>
                                    </div>
                                </div>
                            """),
                        ),
                    ),
                ),
                Tab('Impact',
                    Fieldset('',
                        Div(
                             HTML("""
                                <div class='panel panel-default'>
                                    <h3>Related indicators</h3>
                                    {% if getQuantitative %}
                                        <table class="table">
                                            {% for item in getQuantitative %}
                                                {% ifchanged item.indicator.id %}
                                                    <tr>
                                                        <td><a href="/program/{{ item.indicator.program_id }}/#/indicator/{{ item.indicator_id }}/" target="_blank">{{ item.indicator}}<a/></td>
                                                    </tr>
                                                {% endifchanged %}
                                            {% endfor %}
                                        </table>
                                    {% endif %}
                                </div>
                            """),
                        ),
                    ),
                    Fieldset('',
                        AppendedText('progress_against_targets','%'), 'beneficiary_type', 'capacity_built', 'quality_assured','issues_and_challenges', 'lessons_learned'
                    ),
                ),
                Tab('Approval',
                    Fieldset('Approval',
                        'approval', 'approved_by', Field('approval_remarks', rows="3", css_class='input-xlarge')
                    ),
                ),
            ),
            Div(
                FormActions(
                    Submit('submit', 'Save changes', css_class=''),
                    Reset('reset', 'Reset', css_class='')
                ),
                css_class='form-actions',
            ),
            Fieldset(
                '',
                Div(
                    '',
                    HTML("""
                            <div class='card-header'><strong>Project Files</strong></div>

                            <div class='card-body'>
                              <!-- Default panel contents -->
                              <h4>Documentation</h4>
                            {% if getDocuments %}
                                <table class="table">
                                    <tr>
                                        <th>Name</th>
                                        <th>Link(URL)</th>
                                        <th>Description</th>
                                        <th>&nbsp;</th>
                                    </tr>
                                    {% for item in getDocuments %}
                                        <tr>
                                            <td>{{ item.name}}</td>
                                            <td><a href="{{ item.url}}" target="_new">{{ item.url}}</a></td>
                                            <td>{{ item.description}}</td>
                                            <td><a class="monitoring" data-toggle="modal" data-target="#myModal" href='/workflow/documentation_agreement_update/{{ item.id }}/{{ pk }}/'>Edit</a> | <a class="monitoring" href='/workflow/documentation_agreement_delete/{{ item.id }}/' data-toggle="modal" data-target="#myModal">Delete</a>
                                        </tr>
                                    {% endfor %}
                                </table>
                            {% endif %}
                            <div class="panel-footer">
                                <a onclick="newPopup('/workflow/documentation_list/?project_id={{ id }}','Add documentation'); return false;" href="#" class="btn btn-link btn-add"><i class="fas fa-plus-circle"></i> Add documentation</a>
                            </div>
                        </div>
                    """),
                ),
                css_class='card mt-3',
            ),
        )
        super(ProjectCompleteSimpleForm, self).__init__(*args, **kwargs)

        # override the program queryset to use request.user for country
        countries = getCountry(self.request.user)

        #self.fields['program'].queryset = Program.objects.filter(funding_status="Funded", country__in=countries)
        self.fields['program'].widget = forms.HiddenInput()
        self.fields['program2'].initial = self.instance.program
        self.fields['program2'].label = "Program"


        self.fields['approved_by'].queryset = TolaUser.objects.filter(country__in=countries).distinct()


        # override the community queryset to use request.user for country
        self.fields['site'].queryset = SiteProfile.objects.filter(country__in=countries)


        if not 'Approver' in self.request.user.groups.values_list('name', flat=True):
            APPROVALS = (
                ('in progress', 'in progress'),
                ('awaiting approval', 'awaiting approval'),
                ('rejected', 'rejected'),
            )
            self.fields['approval'].choices = APPROVALS
            self.fields['approved_by'].widget.attrs['disabled'] = "disabled"
            self.fields['approval_remarks'].widget.attrs['disabled'] = "disabled"
            self.fields['approval'].help_text = "Approval level permissions required"
            self.fields['project_agreement'].widget.attrs['readonly'] = "readonly"


class SiteProfileForm(forms.ModelForm):

    class Meta:
        model = SiteProfile
        exclude = ['create_date', 'edit_date']

    map = forms.CharField(widget=GoogleMapsWidget(
        attrs={'width': 700, 'height': 400, 'longitude': 'longitude', 'latitude': 'latitude','country': _('Find a city or village')}), required=False)

    date_of_firstcontact = forms.DateField(widget=DatePicker.DateInput(), required=False)

    approval = forms.ChoiceField(
        choices=APPROVALS,
        initial='in progress',
        required=False,
    )

    def __init__(self, *args, **kwargs):

        # needed because HTML template string below =(
        translations = {
            'projects_in_this_site': _('Projects in this Site'),
            'project_name': _('Project Name'),
            'program': _('Program'),
            'activity_code': _('Activity Code'),
            'view': _('View'),
        }

        # get the user object from request to check user permissions
        self.request = kwargs.pop('request')

        self.helper = FormHelper()
        self.helper.form_method = 'post'
        self.helper.form_class = ''
        self.helper.label_class = ''
        self.helper.field_class = ''
        self.helper.form_error_title = 'Form Errors'
        self.helper.error_text_inline = True
        self.helper.help_text_inline = True
        self.helper.html5_required = True

        submit_section = Div()
        if self.request.has_write_access:
            submit_section = Div(
                FormActions(
                    Submit('submit', _('Save changes'), css_class=''),
                    Reset('reset', _('Reset'), css_class='')
                ),
                css_class='form-actions',
            )

        # Organize the fields in the site profile form using a layout class
        self.helper.layout = Layout(

            HTML("""<br/>"""),
            TabHolder(
                Tab(_('Profile'),
                    Fieldset(_('Description'),
                        'name', 'type','status',
                    ),
                    Fieldset(_('Contact Info'),
                        'contact_leader', 'date_of_firstcontact', 'contact_number', 'num_members',
                    ),
                ),
                Tab(_('Location'),
                    Fieldset(_('Places'),
                        'country', Field('latitude', step="any"), Field('longitude', step="any"),
                    ),
                    Fieldset(_('Map'),
                        'map',
                    ),
                ),
                Tab(_('Demographic Information'),
                    Fieldset(_('Households'),
                        'total_num_households','avg_household_size', 'male_0_5', 'female_0_5', 'male_6_9', 'female_6_9',
                        'male_10_14', 'female_10_14','male_15_19', 'female_15_19', 'male_20_24', 'female_20_24', 'male_25_34', 'female_25_34', 'male_35_49', 'female_35_49', 'male_over_50', 'female_over_50', 'total_population',
                    ),
                    Fieldset(_('Land'),
                        'classify_land','total_land','total_agricultural_land','total_rainfed_land','total_horticultural_land',
                        'populations_owning_land', 'avg_landholding_size', 'households_owning_livestock','animal_type'
                    ),
                    Fieldset(_('Literacy'),
                        'literate_males','literate_females','literacy_rate',
                    ),
                    Fieldset(_('Demographic Info Data Source'),
                             'info_source'
                    ),
                ),

            ), submit_section,

             HTML(u"""
                  <div class='card mt-4'>

                  <!-- Default panel contents -->
                  <div class='card-header'><strong>{projects_in_this_site}</strong></div>
                  <div class='card-body'>
                    {{% if getProjects %}}
                      <!-- Table -->
                      <table class="table">
                       <tr>
                         <th>{project_name}</th>
                         <th>{program}</th>
                         <th>{activity_code}</th>
                         <th>{view}</th>
                       </tr>

                    {{% for item in getProjects %}}
                       <tr>
                        <td>{{{{ item.project_name }}}}</td>
                        <td>{{{{ item.program.name }}}}</td>
                        <td>{{{{ item.activity_code }}}}</td>
                        <td><a target="_new" href='/workflow/projectagreement_detail/{{{{ item.id }}}}/'>{view}</a>
                       </tr>
                    {{% endfor %}}
                     </table>
                    {{% endif %}}
                    </div>
                  </div>
             """.format(**translations)),
        )

        super(SiteProfileForm, self).__init__(*args, **kwargs)

        if not self.request.has_write_access:
            for name, field in self.fields.items():
                field.disabled = True

        #override the office queryset to use request.user for country
        countries = (
            self.request.user.tola_user.managed_countries.all()
            | Country.objects.filter(id__in=self.request.user.tola_user.programaccess_set.filter(role='high').values('country_id'))
        ).distinct()
        self.fields['date_of_firstcontact'].label = _("Date of First Contact")
        self.fields['approved_by'].queryset = TolaUser.objects.filter(country__in=countries).distinct()
        self.fields['filled_by'].queryset = TolaUser.objects.filter(country__in=countries).distinct()
        self.fields['country'].queryset = countries


class DocumentationForm(forms.ModelForm):

    class Meta:
        model = Documentation
        exclude = ['create_date', 'edit_date']


    def __init__(self, *args, **kwargs):
        self.helper = FormHelper()
        self.helper.form_method = 'post'
        self.request = kwargs.pop('request')
        self.helper.form_class = ''
        self.helper.label_class = ''
        self.helper.field_class = ''
        self.helper.form_error_title = 'Form Errors'
        self.helper.error_text_inline = True
        self.helper.help_text_inline = True
        self.helper.html5_required = True
        self.helper.layout = Layout(

            HTML("""<br/>"""),

                'name',
                FieldWithButtons('url', StrictButton("gdrive", onclick="onApiLoad();")),
                Field('description', rows="3", css_class='input-xlarge'),
                'project','program',

            FormActions(
                Submit('submit', 'Save', css_class='btn-primary'),
                Reset('reset', 'Reset', css_class='btn-reset')
            )
        )

        super(DocumentationForm, self).__init__(*args, **kwargs)

        #override the program queryset to use request.user for country
        self.fields['name'].required = True
        self.fields['url'].required = True
        self.fields['program'].queryset = Program.rf_aware_objects.filter(
            Q(id__in=self.request.user.tola_user.programaccess_set.filter(role='high').values('program_id'))
            | Q(id__in=self.request.user.tola_user.programaccess_set.filter(role='medium').values('program_id'))
        ).distinct()

        # only display Project field to existing users
        if not self.request.user.tola_user.allow_projects_access:
            self.fields.pop('project')


class BenchmarkForm(forms.ModelForm):

    class Meta:
        model = Benchmarks
        exclude = ['create_date', 'edit_date']

    def __init__(self, *args, **kwargs):
        self.helper = FormHelper()
        self.request = kwargs.pop('request')
        self.agreement = kwargs.pop('agreement')
        self.complete = kwargs.pop('complete')
        self.helper.form_method = 'post'
        self.helper.form_class = 'form-horizontal'
        self.helper.label_class = ''
        self.helper.field_class = ''
        self.helper.form_error_title = 'Form Errors'
        self.helper.error_text_inline = True
        self.helper.help_text_inline = True
        self.helper.html5_required = True
        self.helper.form_tag = False

        if "benchmark_complete" in self.request.path:
            self.helper.layout = Layout(
                Field('description', rows="3", css_class='input-xlarge'),'site','est_start_date','est_end_date',
                Field('actual_start_date', css_class="act_datepicker", id="actual_start_date_id"),
                 Field('actual_end_date', css_class="act_datepicker", id="actual_end_date_id"),'budget','cost','agreement','complete',
            )
        else:
            self.helper.layout = Layout(
                Field('description', rows="3", css_class='input-xlarge'),'site','est_start_date','est_end_date','budget','agreement',
            )
        super(BenchmarkForm, self).__init__(*args, **kwargs)

        countries = getCountry(self.request.user)
        # override the site queryset to use request.user for country
        self.fields['site'].queryset = SiteProfile.objects.filter(country__in=countries)

        self.fields['agreement'].widget = HiddenInput()
        self.fields['complete'].widget = HiddenInput()


class MonitorForm(forms.ModelForm):

    class Meta:
        model = Monitor
        exclude = ['create_date', 'edit_date']


    def __init__(self, *args, **kwargs):
        self.helper = FormHelper()
        self.helper.form_method = 'post'
        self.helper.form_class = 'form-horizontal'
        self.helper.label_class = 'col-sm-2'
        self.helper.field_class = 'col-sm-6'
        self.helper.form_error_title = 'Form Errors'
        self.helper.error_text_inline = True
        self.helper.help_text_inline = True
        self.helper.html5_required = True
        self.helper.form_tag = False
        self.helper.layout = Layout(

            HTML("""<br/>"""),

                'responsible_person', 'frequency', Field('type', rows="3", css_class='input-xlarge'), 'agreement',

        )

        super(MonitorForm, self).__init__(*args, **kwargs)


class ChecklistItemForm(forms.ModelForm):

    class Meta:
        model = ChecklistItem
        exclude = ['create_date', 'edit_date','global_item']

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request')
        self.helper = FormHelper()
        self.helper.form_method = 'post'
        self.helper.form_class = 'form-horizontal'
        self.helper.label_class = 'col-sm-2'
        self.helper.field_class = 'col-sm-6'
        self.helper.form_error_title = 'Form Errors'
        self.helper.error_text_inline = True
        self.helper.help_text_inline = True
        self.helper.html5_required = True
        self.helper.add_input(Submit('submit', 'Save'))

        super(ChecklistItemForm, self).__init__(*args, **kwargs)

        #countries = getCountry(self.request.user)
        #override the community queryset to use request.user for country
        #self.fields['item'].queryset = ChecklistItem.objects.filter(checklist__country__in=countries)


class FilterForm(forms.Form):
    def __init__(self, *args, **kwargs):
        # moving helper button description to init so translations will re-init on reload:
        self.helper.layout = Layout(FieldWithButtons('search', StrictButton(_('Submit'), type='submit', css_class='btn-primary')))
        super(FilterForm, self).__init__(*args, **kwargs)

    # Search filter
    # string translation doesn't work here
    fields = "search"
    search = forms.CharField(required=False, label=_('Search'))
    helper = FormHelper()
    helper.form_method = 'get'
    helper.form_class = 'form-inline'



class ProjectCompleteTable(forms.ModelForm):

    class Meta:
        model = ProjectComplete
        fields = '__all__'

class OneTimeRegistrationForm(forms.Form):
    """
    A form that lets a user change set their password without entering the old
    password
    """
    error_messages = {
        'password_mismatch': ("The two password fields didn't match."),
        }
    new_password1 = forms.CharField(label=("New password"),
                                    widget=forms.PasswordInput)
    new_password2 = forms.CharField(label=("New password confirmation"),
                                    widget=forms.PasswordInput)

    def clean_new_password2(self):
        password1 = self.cleaned_data.get('new_password1')
        password2 = self.cleaned_data.get('new_password2')
        if password1 and password2:
            if password1 != password2:
                raise forms.ValidationError(
                    self.error_messages['password_mismatch'],
                    code='password_mismatch',
                    )
        return password2
