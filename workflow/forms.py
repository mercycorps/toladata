
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
    Program, SiteProfile,
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
