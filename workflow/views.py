# -*- coding: utf-8 -*-
"""
Workflow views - TODO: cut out intercision-invalidated views
"""

import logging
from datetime import timedelta
from dateutil.relativedelta import relativedelta
from dateutil import parser

from workflow.models import (
    Program,
    SiteProfile,
)
from workflow.forms import (
    SiteProfileForm,
    FilterForm,
)

from indicators.models import Result

from django.utils.translation import gettext as _
from django.views.generic.list import ListView
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.utils import timezone
from django.utils.datastructures import MultiValueDictKeyError
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import HttpResponseRedirect, JsonResponse
from django.utils.decorators import method_decorator
from django.shortcuts import render
from django.contrib import messages
from django.db.models import Q, Max

from tola.util import getCountry, group_excluded

from rest_framework.decorators import api_view
from rest_framework.response import Response

from tola_management.models import ProgramAuditLog
from tola_management.permissions import (
    has_site_read_access,
    has_site_create_access,
    has_site_delete_access,
    has_site_write_access,
    has_program_write_access,
    verify_program_access_level,
    verify_program_access_level_of_any_program
)

# Get an instance of a logger
logger = logging.getLogger(__name__)


APPROVALS = (
    ('in_progress', ('in progress')),
    ('awaiting_approval', 'awaiting approval'),
    ('approved', 'approved'),
    ('rejected', 'rejected'),
)



def date_handler(obj):
    return obj.isoformat() if hasattr(obj, 'isoformat') else obj


class IndicatorDataBySite(LoginRequiredMixin, ListView):
    template_name = 'workflow/site_indicatordata.html'
    context_object_name = 'results'

    def get_context_data(self, **kwargs):
        context = super(IndicatorDataBySite, self).get_context_data(**kwargs)
        context['site'] = SiteProfile.objects.get(pk=self.kwargs.get('site_id'))
        return context

    def get_queryset(self):
        q = Result.objects.filter(
            site__id=self.kwargs.get('site_id'),
            program__in=self.request.user.tola_user.available_programs
        ).order_by('program', 'indicator')
        return q


@method_decorator(login_required, name='dispatch')
class SiteProfileList(ListView):
    """
    SiteProfile list creates a map and list of sites by user country access and filters
    by either direct link from project or by program dropdown filter
    """
    model = SiteProfile
    template_name = 'workflow/site_profile_list.html'

    def dispatch(self, request, *args, **kwargs):
        if 'report' in request.GET:
            template_name = 'workflow/site_profile_report.html'

        return super(SiteProfileList, self).dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        activity_id = int(self.kwargs['activity_id'])
        program_id = int(self.kwargs['program_id'])

        countries = request.user.tola_user.available_countries
        getPrograms = request.user.tola_user.available_programs.all() # or filter(funding_status="Funded") ?

        #this date, 3 months ago, a site is considered inactive
        inactiveSite = timezone.now() - relativedelta(months=3)

        #Filter SiteProfile list and map by activity or program
        if activity_id != 0:
            getSiteProfile = SiteProfile.objects.prefetch_related(\
                    'country')\
                .distinct()
        elif program_id != 0:
            getSiteProfile = SiteProfile.objects.prefetch_related(\
                    'country')\
                .filter(result__program__id=program_id)\
                .distinct()
        else:
            getSiteProfile = SiteProfile.objects.prefetch_related(\
                    'country')\
                .filter(country__in=countries)\
                .distinct()
        if request.method == "GET" and "search" in request.GET:
            getSiteProfile = SiteProfile.objects.filter(\
                    Q(country__in=countries),\
                    Q(name__contains=request.GET["search"])\
                    | Q(type__profile__contains=request.GET['search']))\
                .select_related()\
                .distinct()
        #paginate site profile list
        default_list = 10 # default number of site profiles per page
        user_list = request.GET.get('user_list') # user defined number of site profiles per page, 10, 20, 30

        if user_list:
            default_list = int(user_list)
        else:
            # add a value (the default) if there was no "user_list" parameter, to avoid "None" being
            # treated as string by JS
            user_list = default_list
        paginator = Paginator(getSiteProfile, default_list)
        page = request.GET.get('page')
        try:
            getSiteProfile = paginator.page(page)
        except PageNotAnInteger:
            getSiteProfile = paginator.page(1)
        except EmptyPage:
            getSiteProfile = paginator.page(paginator.num_pages)
        return render(request, self.template_name, {
            'inactiveSite': inactiveSite,
            'default_list': default_list,
            'getSiteProfile': getSiteProfile,
            'project_agreement_id': activity_id,
            'country': countries,
            'getPrograms':getPrograms,
            'form': FilterForm(),
            'helper': FilterForm.helper,
            'user_list': user_list})


@method_decorator(login_required, name='dispatch')
@method_decorator(has_site_read_access, name='dispatch')
class SiteProfileReport(ListView):
    """
    SiteProfile Report filtered by project
    """
    model = SiteProfile
    template_name = 'workflow/site_profile_report.html'

    def get(self, request, *args, **kwargs):
        countries = getCountry(request.user)
        project_agreement_id = self.kwargs['pk']

        if int(self.kwargs['pk']) == 0:
            getSiteProfile = SiteProfile.objects.all().prefetch_related(
                'country'
            ).filter(country__in=countries).filter(status=1)
            getSiteProfileIndicator = SiteProfile.objects.all().prefetch_related(
                'country'
            ).filter(Q(result__program__country__in=countries)).filter(status=1)
        else:
            getSiteProfile = SiteProfile.objects.all().prefetch_related('country').filter(status=1)
            getSiteProfileIndicator = None

        site_id=self.kwargs['pk']

        return render(request, self.template_name,
                      {'getSiteProfile':getSiteProfile, 'getSiteProfileIndicator' : getSiteProfileIndicator,
                       'project_agreement_id' : project_agreement_id,
                       'id' : site_id, 'country': countries})


@method_decorator(login_required, name='dispatch')
@method_decorator(has_site_create_access, name='dispatch')
class SiteProfileCreate(CreateView):
    """
    Using SiteProfile Form, create a new site profile
    """
    model = SiteProfile

    @method_decorator(group_excluded('ViewOnly', url='workflow/permission'))
    def dispatch(self, request, *args, **kwargs):
        self.guidance = None
        return super(SiteProfileCreate, self).dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        # permission check that includes checking the user is associated with the sites Country
        verify_program_access_level_of_any_program(request, 'high', country_id=request.POST['country'])

        return super(SiteProfileCreate, self).post(request, *args, **kwargs)

    # add the request to the kwargs
    def get_form_kwargs(self):
        kwargs = super(SiteProfileCreate, self).get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

    def get_initial(self):
        countries = getCountry(self.request.user)
        default_country = None
        if countries:
            default_country = countries[0]
        initial = {
            'approved_by': self.request.user,
            'filled_by': self.request.user,
            'country': default_country
        }

        return initial

    def form_invalid(self, form):

        messages.error(self.request, 'Invalid Form', fail_silently=False)

        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):
        form.save()
        messages.success(self.request, 'Success, Site Profile Created!')
        latest = SiteProfile.objects.latest('id')
        redirect_url = '/workflow/siteprofile_update/' + str(latest.id)
        return HttpResponseRedirect(redirect_url)

    form_class = SiteProfileForm


@method_decorator(login_required, name='dispatch')
@method_decorator(has_site_write_access, name='dispatch')
class SiteProfileUpdate(UpdateView):
    """
    SiteProfile Form Update an existing site profile
    """
    model = SiteProfile

    @method_decorator(group_excluded('ViewOnly', url='workflow/permission'))
    def dispatch(self, request, *args, **kwargs):
        self.guidance = None
        return super(SiteProfileUpdate, self).dispatch(request, *args, **kwargs)

    # add the request to the kwargs
    def get_form_kwargs(self):
        kwargs = super(SiteProfileUpdate, self).get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

    def get_context_data(self, **kwargs):
        context = super(SiteProfileUpdate, self).get_context_data(**kwargs)
        getProjects = []
        context.update({'getProjects': getProjects})
        return context

    def form_invalid(self, form):
        messages.error(self.request, 'Invalid Form', fail_silently=False)
        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):
        form.save()
        messages.success(self.request, 'Success, SiteProfile Updated!')

        return self.render_to_response(self.get_context_data(form=form))

    form_class = SiteProfileForm


@method_decorator(login_required, name='dispatch')
@method_decorator(has_site_delete_access, name='dispatch')
class SiteProfileDelete(DeleteView):
    """
    SiteProfile Form Delete an existing community
    """
    model = SiteProfile
    success_url = "/workflow/siteprofile_list/0/0/"

    def dispatch(self, request, *args, **kwargs):
        return super(SiteProfileDelete, self).dispatch(request, *args, **kwargs)

    def form_invalid(self, form):

        messages.error(self.request, 'Invalid Form', fail_silently=False)

        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):

        form.save()

        messages.success(self.request, 'Success, SiteProfile Deleted!')
        return self.render_to_response(self.get_context_data(form=form))

    form_class = SiteProfileForm


@login_required
@has_program_write_access
def reportingperiod_update(request, pk):
    program = Program.objects.get(pk=pk)
    old_dates = program.dates_for_logging

    # In some cases the start date input will be disabled and won't come through POST
    reporting_period_start = False
    reporting_period_end = False
    try:
        reporting_period_start = parser.parse(request.POST['reporting_period_start'])
    except MultiValueDictKeyError as e:
        pass
    reporting_period_end = parser.parse(request.POST['reporting_period_end'])
    success = True
    failmsg = []
    failfields = []

    if not request.POST.get('rationale') and program.indicator_set.all().exists():
        success = False
        # Translators: Text of an error message that appears when a user hasn't provided a justification for the change they are making to some data
        failmsg.append(_('Reason for change is required'))

    if reporting_period_start:
        if reporting_period_start.day != 1:
            success = False
            failmsg.append(_('Reporting period must start on the first of the month'))
            failfields.append('reporting_period_start')
        elif reporting_period_start.date() == program.reporting_period_start:
            pass
        elif program.has_time_aware_targets:
            success = False
            failmsg.append(
                _('Reporting period start date cannot be changed while time-aware periodic targets are in place')
            )
        else:
            program.reporting_period_start = reporting_period_start
    if reporting_period_end:
        next_day = reporting_period_end + timedelta(days=1)
        if next_day.day != 1:
            success = False
            failmsg.append(_('Reporting period must end on the last day of the month'))
            failfields.append('reporting_period_end')
        elif reporting_period_end.date() == program.reporting_period_end:
            pass
        elif (program.last_time_aware_indicator_start_date and
              reporting_period_end.date() < program.last_time_aware_indicator_start_date):
            success = False
            failmsg.append(_('Reporting period must end after the start of the last target period'))
            failfields.append('reporting_period_end')
        else:
            program.reporting_period_end = reporting_period_end
        if reporting_period_start and reporting_period_start >= reporting_period_end:
            success = False
            failmsg.append(_('Reporting period must start before reporting period ends'))
            failfields.append('reporting_period_start')
            failfields.append('reporting_period_end')
    else:
        success = False
        failmsg.append(_('You must select a reporting period end date'))
        failfields.append('reporting_period_end')
    if success:
        program.save()
        ProgramAuditLog.log_program_dates_updated(
            request.user, program, old_dates, program.dates_for_logging, request.POST.get('rationale')
        )

    return JsonResponse({
        'msg': 'success' if success else 'fail',
        'failmsg': failmsg,
        'failfields': failfields,
        'program_id': pk,
        'rptstart': program.reporting_period_start,
        'rptend': program.reporting_period_end, },
        status=200 if success else 422)


@login_required
@api_view(['GET'])
def dated_target_info(request, pk):
    verify_program_access_level(request, pk, 'low')
    return Response({
        'max_start_date': Program.objects.filter(id=pk).annotate(
            ptd=Max('indicator__periodictargets__start_date')).values_list('ptd', flat=True)[0]})


