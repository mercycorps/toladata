# -*- coding: utf-8 -*-
"""
Workflow views - TODO: cut out intercision-invalidated views
"""

import operator
import unicodedata
import json
import logging
from datetime import timedelta
from dateutil.relativedelta import relativedelta
from dateutil import parser

from workflow.serializers import DocumentListProgramSerializer, DocumentListDocumentSerializer
from workflow.models import (
    Program,
    Country,
    Province,
    AdminLevelThree,
    District,
    ProjectAgreement,
    ProjectComplete,
    SiteProfile,
    Documentation,
    Monitor,
    Benchmarks,
    Budget,
    ApprovalAuthority,
    Checklist,
    ChecklistItem,
    Stakeholder,
)
from workflow.forms import (
    ProjectAgreementForm,
    ProjectAgreementSimpleForm,
    ProjectAgreementCreateForm,
    ProjectCompleteForm,
    ProjectCompleteSimpleForm,
    ProjectCompleteCreateForm,
    DocumentationForm,
    SiteProfileForm,
    MonitorForm,
    BenchmarkForm,
    BudgetForm,
    FilterForm,
    ChecklistItemForm,
    StakeholderForm,
)
from workflow.mixins import AjaxableResponseMixin
from workflow.export import ProjectAgreementResource, StakeholderResource
from workflow.tables import ProjectAgreementTable

from formlibrary.models import TrainingAttendance, Distribution
from indicators.models import Result, ExternalService

from django.utils.translation import gettext as _
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView, View
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.utils import timezone
from django.utils.datastructures import MultiValueDictKeyError
from django.urls import reverse
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.exceptions import PermissionDenied
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404, render
from django.contrib import messages
from django.db.models import Count, Q, Max

from tola.util import getCountry, emailGroup, group_excluded, group_required

from rest_framework.decorators import api_view
from rest_framework.response import Response

from tola_management.models import ProgramAuditLog
from tola_management.permissions import (
    user_has_program_roles,
    has_site_read_access,
    has_site_create_access,
    has_site_delete_access,
    has_site_write_access,
    has_program_write_access,
    has_projects_access,
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


@method_decorator(has_projects_access, name='dispatch')
class ProjectDash(LoginRequiredMixin, ListView):

    template_name = 'workflow/projectdashboard_list.html'

    def get(self, request, *args, **kwargs):

        countries = getCountry(request.user)
        getPrograms = self.request.user.tola_user.available_programs.filter(funding_status="Funded")
        project_id = int(self.kwargs['pk'])

        if project_id == 0:
            getAgreement = None
            getComplete = None
            getChecklist = None
            getDocumentCount = 0
            getCommunityCount = 0
            getTrainingCount = 0
            getDistributionCount = 0
            getChecklistCount = 0
        else:

            try:
                getAgreement = ProjectAgreement.objects.get(id=project_id, program__in=getPrograms)
            except ProjectAgreement.DoesNotExist:
                getAgreement = None

            try:
                getComplete = ProjectComplete.objects.get(project_agreement__id=self.kwargs['pk'], program__in=getPrograms)
            except ProjectComplete.DoesNotExist:
                getComplete = None
            getDocumentCount = Documentation.objects.all().filter(project_id=self.kwargs['pk'], program__in=getPrograms).count()
            getCommunityCount = SiteProfile.objects.all().filter(projectagreement__id=self.kwargs['pk'], projectagreement__program__in=getPrograms).count()
            getTrainingCount = TrainingAttendance.objects.all().filter(project_agreement_id=self.kwargs['pk'], program__in=getPrograms).count()
            getDistributionCount = Distribution.objects.all().filter(initiation_id=self.kwargs['pk'], program__in=getPrograms).count()
            getChecklistCount = ChecklistItem.objects.all().filter(checklist__agreement_id=self.kwargs['pk'], checklist__agreement__program__in=getPrograms).count()
            getChecklist = ChecklistItem.objects.all().filter(checklist__agreement_id=self.kwargs['pk'], checklist__agreement__program__in=getPrograms)

        if int(self.kwargs['pk']) == 0:
            getProgram = getPrograms.filter(funding_status="Funded").distinct()
        else:
            getProgram = get_object_or_404(Program, agreement__id=self.kwargs['pk'], id__in=getPrograms.values('id'))

        return render(request, self.template_name, {
            'getProgram': getProgram, 'getAgreement': getAgreement, 'getComplete': getComplete,
            'getPrograms':getPrograms, 'getDocumentCount':getDocumentCount, 'getChecklistCount': getChecklistCount,
            'getCommunityCount':getCommunityCount, 'getTrainingCount':getTrainingCount, 'project_id': project_id,
            'getChecklist': getChecklist, 'getDistributionCount': getDistributionCount
        })


@method_decorator(has_projects_access, name='dispatch')
class ProgramDash(LoginRequiredMixin, ListView):
    """
    Dashboard links for and status for each program with number of projects
    :param request:
    :param pk: program_id
    :param status: approval status of project
    :return:
    """
    template_name = 'workflow/programdashboard_list.html'

    def get(self, request, *args, **kwargs):

        getPrograms = self.request.user.tola_user.available_programs.filter(Q(agreement__isnull=False) | Q(complete__isnull=False), funding_status="Funded").distinct()
        filtered_program = None
        if int(self.kwargs['pk']) == 0:
            getDashboard = getPrograms.prefetch_related('agreement','agreement__projectcomplete','agreement__office').filter(funding_status="Funded").order_by('name').annotate(has_agreement=Count('agreement'),has_complete=Count('complete'))
        else:
            getDashboard = getPrograms.prefetch_related('agreement','agreement__projectcomplete','agreement__office').filter(id=self.kwargs['pk'], funding_status="Funded").order_by('name')
            filtered_program = getPrograms.only('name').get(pk=self.kwargs['pk']).name

        if self.kwargs.get('status', None):

            status = self.kwargs['status']
            if status == "in_progress":
                getDashboard.filter(Q(agreement__approval=self.kwargs['status']) | Q(agreement__approval=None))

            elif status == "new":
                getDashboard.filter(Q(Q(agreement__approval=None) | Q(agreement__approval="")))

            else:
                getDashboard.filter(agreement__approval=self.kwargs['status'])
        else:
            status = None

        return render(request, self.template_name, {'getDashboard': getDashboard, 'getPrograms': getPrograms, 'APPROVALS': APPROVALS, 'program_id':  self.kwargs['pk'], 'status': status, 'filtered_program': filtered_program})


@method_decorator(has_projects_access, name='dispatch')
class ProjectAgreementList(LoginRequiredMixin, ListView):
    """
    Project Agreement
    :param request:
    """
    model = ProjectAgreement
    template_name = 'workflow/projectagreement_list.html'

    def get(self, request, *args, **kwargs):
        getPrograms = request.user.tola_user.available_programs.filter(funding_status="Funded").distinct()

        if int(self.kwargs['pk']) != 0:
            getDashboard = ProjectAgreement.objects.all().filter(program__id=self.kwargs['pk'], program__in=getPrograms)
            getProgram =get_object_or_404(Program, id=self.kwargs['pk'], id__in=getPrograms.values('id'))
            return render(request, self.template_name, {'form': FilterForm(),'getProgram': getProgram, 'getDashboard':getDashboard,'getPrograms':getPrograms,'APPROVALS': APPROVALS})

        elif self.kwargs['status'] != 'none':
            getDashboard = ProjectAgreement.objects.all().filter(approval=self.kwargs['status'], program__in=getPrograms)
            return render(request, self.template_name, {'form': FilterForm(), 'getDashboard':getDashboard,'getPrograms':getPrograms,'APPROVALS': APPROVALS})

        else:
            getDashboard = ProjectAgreement.objects.all().filter(program__in=getPrograms)

            return render(request, self.template_name, {'form': FilterForm(),'getDashboard':getDashboard,'getPrograms':getPrograms,'APPROVALS': APPROVALS})


@method_decorator(has_projects_access, name='dispatch')
class ProjectAgreementImport(LoginRequiredMixin, ListView):
    """
    Import a project agreement from TolaData or other third party service
    """

    template_name = 'workflow/projectagreement_import.html'

    def get(self, request, *args, **kwargs):
        countries = getCountry(request.user)
        getPrograms = Program.objects.all().filter(funding_status="Funded", country__in=countries)
        getServices = ExternalService.objects.all()
        getCountries = Country.objects.all().filter(country__in=countries)

        return render(request, self.template_name, {'getPrograms': getPrograms, 'getServices': getServices , 'getCountries': getCountries})


@method_decorator(has_projects_access, name='dispatch')
class ProjectAgreementCreate(LoginRequiredMixin, CreateView):
    """
    Project Agreement Form
    :param request:
    :param id:
    This is only used in case of an error incomplete form submission from the simple form
    in the project dashboard
    """

    model = ProjectAgreement
    template_name = 'workflow/projectagreement_form.html'

    @method_decorator(group_excluded('ViewOnly', url='workflow/permission'))
    def dispatch(self, request, *args, **kwargs):
        self.guidance = None
        return super(ProjectAgreementCreate, self).dispatch(request, *args, **kwargs)

     # add the request to the kwargs
    def get_form_kwargs(self):
        kwargs = super(ProjectAgreementCreate, self).get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

    #get shared data from project agreement and pre-populate form with it
    def get_initial(self):

        initial = {
            'approved_by': self.request.user,
            'estimated_by': self.request.user,
            'checked_by': self.request.user,
            'reviewed_by': self.request.user,
            'approval_submitted_by': self.request.user,
            }

        return initial

    def get_context_data(self, **kwargs):
        context = super(ProjectAgreementCreate, self).get_context_data(**kwargs)
        return context

    def form_invalid(self, form):

        messages.error(self.request, 'Invalid Form', fail_silently=False)

        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):

        form.save()

        #save formset from context
        context = self.get_context_data()

        latest = ProjectAgreement.objects.latest('id')
        getAgreement = ProjectAgreement.objects.get(id=latest.id)

        #create a new dashbaord entry for the project
        getProgram = Program.objects.get(id=latest.program_id)

        create_checklist = Checklist(agreement=getAgreement)
        create_checklist.save()

        get_checklist = Checklist.objects.get(id=create_checklist.id)
        get_globals = ChecklistItem.objects.all().filter(global_item=True)
        for item in get_globals:
            ChecklistItem.objects.create(checklist=get_checklist, item=item.item)


        messages.success(self.request, 'Success, Initiation Created!')

        redirect_url = '/workflow/dashboard/project/' + str(latest.id)
        return HttpResponseRedirect(redirect_url)

    form_class = ProjectAgreementCreateForm


@method_decorator(has_projects_access, name='dispatch')
class ProjectAgreementUpdate(LoginRequiredMixin, UpdateView):
    """
    Project Initiation Form
    :param request:
    :param id: project_agreement_id
    """
    model = ProjectAgreement
    form_class = ProjectAgreementForm

    @method_decorator(group_excluded('ViewOnly', url='workflow/permission'))
    def dispatch(self, request, *args, **kwargs):
        self.guidance = None
        return super(ProjectAgreementUpdate, self).dispatch(request, *args, **kwargs)

    def get_form(self, form_class=None):
        check_form_type = ProjectAgreement.objects.get(id=self.kwargs['pk'])

        if check_form_type.short == True:
            form_class = ProjectAgreementSimpleForm
        else:
            form_class = ProjectAgreementForm

        return form_class(**self.get_form_kwargs())


    def get_context_data(self, **kwargs):
        context = super(ProjectAgreementUpdate, self).get_context_data(**kwargs)
        pk = self.kwargs['pk']
        context.update({'pk': pk})
        context.update({'program': pk})
        getAgreement = ProjectAgreement.objects.get(id=self.kwargs['pk'])
        context.update({'p_agreement': getAgreement.project_name})
        context.update({'p_agreement_program': getAgreement.program})


        try:
            getQuantitative = Result.objects.all().filter(agreement__id=self.kwargs['pk']).order_by('indicator')
        except Result.DoesNotExist:
            getQuantitative = None
        context.update({'getQuantitative': getQuantitative})

        try:
            getMonitor = Monitor.objects.all().filter(agreement__id=self.kwargs['pk']).order_by('type')
        except Monitor.DoesNotExist:
            getMonitor = None
        context.update({'getMonitor': getMonitor})

        try:
            getBenchmark = Benchmarks.objects.all().filter(agreement__id=self.kwargs['pk']).order_by('description')
        except Benchmarks.DoesNotExist:
            getBenchmark = None
        context.update({'getBenchmark': getBenchmark})

        try:
            getBudget = Budget.objects.all().filter(agreement__id=self.kwargs['pk']).order_by('description_of_contribution')
        except Budget.DoesNotExist:
            getBudget = None
        context.update({'getBudget': getBudget})

        try:
            getDocuments = Documentation.objects.all().filter(project__id=self.kwargs['pk']).order_by('name')
        except Documentation.DoesNotExist:
            getDocuments = None
        context.update({'getDocuments': getDocuments})

        return context

    # add the request to the kwargs
    def get_form_kwargs(self):
        kwargs = super(ProjectAgreementUpdate, self).get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

    def form_invalid(self, form):

        messages.error(self.request, 'Invalid Form', fail_silently=False)

        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):

        #get the approval status of the form before it was submitted and set vars for use in condtions
        check_agreement_status = ProjectAgreement.objects.get(id=str(self.kwargs['pk']))
        is_approved = str(form.instance.approval)
        getProgram = Program.objects.get(agreement__id=check_agreement_status.id)
        country = getProgram.country

        #convert form field unicode project name to ascii safe string for email content

        project_name = unicodedata.normalize('NFKD', form.instance.project_name).encode('ascii','ignore')
        #check to see if the approval status has changed
        if str(is_approved) == "approved" and check_agreement_status.approval != "approved":
            budget = form.instance.total_estimated_budget
            if getProgram.budget_check == True:
                try:
                    user_budget_approval = ApprovalAuthority.objects.get(approval_user__user=self.request.user)
                except ApprovalAuthority.DoesNotExist:
                    user_budget_approval = None
            #compare budget amount to users approval amounts

            if getProgram.budget_check:
                if not user_budget_approval or int(budget) > int(user_budget_approval.budget_limit):
                    messages.success(self.request, 'You do not appear to have permissions to approve this initiation')
                    form.instance.approval = 'awaiting approval'
                else:
                    messages.success(self.request, 'Success, Initiation and Budget Approved')
                    form.instance.approval = 'approved'
            else:
                messages.success(self.request, 'Success, Initiation Approved')
                form.instance.approval = 'approved'

            if form.instance.approval == 'approved':
                #email the approver group so they know this was approved
                link = "Link: " + "https://" + self.request.get_host() + "/workflow/projectagreement_detail/" + str(self.kwargs['pk']) + "/"
                subject = "Project Initiation Approved: " + project_name
                message = "A new initiation was approved by " + str(self.request.user) + "\n" + "Budget Amount: " + str(form.instance.total_estimated_budget) + "\n"
                getSubmiter = User.objects.get(username=self.request.user)
                emailGroup(submiter=getSubmiter.email, country=country,group=form.instance.approved_by,link=link,subject=subject,message=message)
        elif str(is_approved) == "awaiting approval" and check_agreement_status.approval != "awaiting approval":
            messages.success(self.request, 'Success, Initiation has been saved and is now Awaiting Approval (Notifications have been Sent)')
            #email the approver group so they know this needs approval
            link = "Link: " + "https://%s%s/" % (
                self.request.get_host(), reverse("project_dashboard", args=[self.kwargs['pk']]))
            subject = "Project Initiation Waiting for Approval: " + project_name
            message = "A new initiation was submitted for approval by %s\nBudget Amount: %s\n" % (
                str(self.request.user), str(form.instance.total_estimated_budget))
            emailGroup(country=country,group=form.instance.approved_by,link=link,subject=subject,message=message)
        else:
            messages.success(self.request, 'Success, form updated!')
        form.save()
        # Not in Use
        # save formset from context
        # context = self.get_context_data()
        self.object = form.save()

        return self.render_to_response(self.get_context_data(form=form))


@method_decorator(has_projects_access, name='dispatch')
class ProjectAgreementDetail(LoginRequiredMixin, DetailView):

    model = ProjectAgreement
    context_object_name = 'agreement'
    queryset = ProjectAgreement.objects.all()

    def get_context_data(self, **kwargs):
        context = super(ProjectAgreementDetail, self).get_context_data(**kwargs)
        context['now'] = timezone.now()
        context.update({'id': self.kwargs['pk']})

        try:
            getMonitor = Monitor.objects.all().filter(agreement__id=self.kwargs['pk'])
        except Monitor.DoesNotExist:
            getMonitor = None
        context.update({'getMonitor': getMonitor})

        try:
            getBenchmark = Benchmarks.objects.all().filter(agreement__id=self.kwargs['pk'])
        except Benchmarks.DoesNotExist:
            getBenchmark = None
        context.update({'getBenchmarks': getBenchmark})

        try:
            getBudget = Budget.objects.all().filter(agreement__id=self.kwargs['pk'])
        except Budget.DoesNotExist:
            getBudget = None
        context.update({'getBudget': getBudget})

        try:
            getDocuments = Documentation.objects.all().filter(project__id=self.kwargs['pk']).order_by('name')
        except Documentation.DoesNotExist:
            getDocuments = None
        context.update({'getDocuments': getDocuments})

        try:
            getQuantitativeOutputs = Result.objects.all().filter(agreement__id=self.kwargs['pk'])

        except Result.DoesNotExist:
            getQuantitativeOutputs = None
        context.update({'getQuantitativeOutputs': getQuantitativeOutputs})

        return context


@method_decorator(has_projects_access, name='dispatch')
class ProjectAgreementDelete(LoginRequiredMixin, DeleteView):
    """
    Project Agreement Delete
    """
    model = ProjectAgreement
    success_url = '/workflow/dashboard/0/'

    @method_decorator(group_required('Country',url='workflow/permission'))
    def dispatch(self, request, *args, **kwargs):
        return super(ProjectAgreementDelete, self).dispatch(request, *args, **kwargs)

    def form_invalid(self, form):

        messages.error(self.request, 'Invalid Form', fail_silently=False)

        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):

        form.save()

        return HttpResponseRedirect('/workflow/success')

    form_class = ProjectAgreementForm


@method_decorator(has_projects_access, name='dispatch')
class ProjectCompleteList(LoginRequiredMixin, ListView):
    """
    Project Complete
    :param request:
    :param pk: program_id
    """
    model = ProjectComplete
    template_name = 'workflow/projectcomplete_list.html'

    def get(self, request, *args, **kwargs):
        getPrograms = request.user.tola_user.available_programs.filter(funding_status="Funded")

        if int(self.kwargs['pk']) == 0:
            getDashboard = ProjectComplete.objects.all().filter(program__in=getPrograms)
            return render(request, self.template_name, {'getDashboard':getDashboard,'getPrograms':getPrograms})
        else:
            getDashboard = ProjectComplete.objects.all().filter(program__id=self.kwargs['pk'], program__in=getPrograms)
            getProgram =get_object_or_404(id=self.kwargs['pk'], id__in=getPrograms.values('id'))

            return render(request, self.template_name, {'getProgram': getProgram, 'getDashboard':getDashboard,'getPrograms':getPrograms})


@method_decorator(has_projects_access, name='dispatch')
class ProjectCompleteCreate(LoginRequiredMixin, CreateView):
    """
    Project Complete Form
    """
    model = ProjectComplete
    template_name = 'workflow/projectcomplete_form.html'

    def dispatch(self, request, *args, **kwargs):
        self.guidance = None
        return super(ProjectCompleteCreate, self).dispatch(request, *args, **kwargs)

    # add the request to the kwargs
    def get_form_kwargs(self):
        kwargs = super(ProjectCompleteCreate, self).get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

    #get shared data from project agreement and pre-populate form with it
    def get_initial(self):
        getProjectAgreement = ProjectAgreement.objects.get(id=self.kwargs['pk'])
        initial = {
            'approved_by': self.request.user,
            'approval_submitted_by': self.request.user,
            'program': getProjectAgreement.program,
            'office': getProjectAgreement.office,
            'sector': getProjectAgreement.sector,
            'project_agreement': getProjectAgreement.id,
            'project_name': getProjectAgreement.project_name,
            'activity_code': getProjectAgreement.activity_code,
            'expected_start_date': getProjectAgreement.expected_start_date,
            'expected_end_date': getProjectAgreement.expected_end_date,
            'expected_duration': getProjectAgreement.expected_duration,
            'estimated_budget': getProjectAgreement.total_estimated_budget,
            'short': getProjectAgreement.short,
        }

        try:
            getSites = SiteProfile.objects.filter(projectagreement__id=getProjectAgreement.id).values_list('id', flat=True)
            site = {'site': [o for o in getSites] }
            initial['site'] = getSites

        except SiteProfile.DoesNotExist:
            getSites = None

        try:
            getStakeholder = Stakeholder.objects.filter(projectagreement__id=getProjectAgreement.id).values_list('id',flat=True)
            stakeholder = {'stakeholder': [o for o in getStakeholder], }
            initial['stakeholder'] = stakeholder
        except Stakeholder.DoesNotExist:
            getStakeholder = None

        return initial

    def get_context_data(self, **kwargs):
        context = super(ProjectCompleteCreate, self).get_context_data(**kwargs)

        project_agreement = ProjectAgreement.objects.get(id=self.kwargs['pk'])
        pk = self.kwargs['pk']
        context.update({'pk': pk})
        context.update({'p_name': self.get_initial()['project_name']})
        context['p_agreement_pk'] = project_agreement.pk

        return context

    def form_invalid(self, form):

        messages.error(self.request, 'Invalid Form', fail_silently=False)
        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):

        form.save()
        context = self.get_context_data()
        self.object = form.save()

        latest = ProjectComplete.objects.latest('id')
        getComplete = ProjectComplete.objects.get(id=latest.id)
        getAgreement = ProjectAgreement.objects.get(id=self.request.POST['project_agreement'])

        #update the quantitative data fields to include the newly created complete
        Result.objects.filter(agreement__id=getComplete.project_agreement_id).update(complete=getComplete)

        #update the other budget items
        Budget.objects.filter(agreement__id=getComplete.project_agreement_id).update(complete=getComplete)

        #update the benchmarks
        Benchmarks.objects.filter(agreement__id=getComplete.project_agreement_id).update(complete=getComplete)

        #update main compelte fields
        ProjectComplete.objects.filter(id=getComplete.id).update(account_code=getAgreement.account_code, lin_code=getAgreement.lin_code)

        messages.success(self.request, 'Success, Tracking Form Created!')
        redirect_url = '/workflow/projectcomplete_update/' + str(latest.id)
        return HttpResponseRedirect(redirect_url)

    form_class = ProjectCompleteCreateForm


@method_decorator(has_projects_access, name='dispatch')
class ProjectCompleteUpdate(LoginRequiredMixin, UpdateView):
    """
    Project Tracking Form
    """
    model = ProjectComplete
    template_name = 'workflow/projectcomplete_form.html'

    def dispatch(self, request, *args, **kwargs):
        self.guidance = None
        return super(ProjectCompleteUpdate, self).dispatch(request, *args, **kwargs)

    def get_form(self, form_class=None):
        check_form_type = ProjectComplete.objects.get(id=self.kwargs['pk'])

        if check_form_type.project_agreement.short == True:
            form_class = ProjectCompleteSimpleForm
        else:
            form_class = ProjectCompleteForm

        return form_class(**self.get_form_kwargs())

    def get_context_data(self, **kwargs):
        context = super(ProjectCompleteUpdate, self).get_context_data(**kwargs)
        getComplete = ProjectComplete.objects.get(id=self.kwargs['pk'])
        #id = getComplete.project_agreement_id

        context.update({'id': getComplete.pk})
        context.update({'p_name': getComplete.project_name})
        context.update({'p_complete_program': getComplete.program})
        pk = self.kwargs['pk']
        context.update({'pk': pk})
        context.update({'project_id':getComplete.project_agreement_id})
        context['p_agreement_pk'] = getComplete.project_agreement_id

        # get budget data
        try:
            getBudget = Budget.objects.all().filter(Q(agreement__id=getComplete.project_agreement_id) | Q(complete__id=getComplete.pk))
        except Budget.DoesNotExist:
            getBudget = None
        context.update({'getBudget': getBudget})

        # get Quantitative data
        try:
            getQuantitative = Result.objects.all().filter(Q(agreement__id=getComplete.project_agreement_id) | Q(complete__id=getComplete.pk)).order_by('indicator')
        except Result.DoesNotExist:
            getQuantitative = None
        context.update({'getQuantitative': getQuantitative})

        # get benchmark or project components
        try:
            getBenchmark = Benchmarks.objects.all().filter(Q(agreement__id=getComplete.project_agreement_id) | Q(complete__id=getComplete.pk)).order_by('description')
        except Benchmarks.DoesNotExist:
            getBenchmark = None
        context.update({'getBenchmark': getBenchmark})

        # get documents from the original agreement (documents are not seperate in complete)
        try:
            getDocuments = Documentation.objects.all().filter(project__id=getComplete.project_agreement_id).order_by('name')
        except Documentation.DoesNotExist:
            getDocuments = None
        context.update({'getDocuments': getDocuments})


        return context

    # add the request to the kwargs
    def get_form_kwargs(self):
        kwargs = super(ProjectCompleteUpdate, self).get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

    #get shared data from project agreement and pre-populate form with it
    def get_initial(self):
        initial = {
            'approval_submitted_by': self.request.user,
        }

        #update budget with new agreement
        try:
            getBudget = Budget.objects.all().filter(complete_id=self.kwargs['pk'])
            #if there aren't any budget try importing from the agreement
            if not getBudget:
                getComplete = ProjectComplete.objects.get(id=self.kwargs['pk'])
                Budget.objects.filter(agreement=getComplete.project_agreement_id).update(complete_id=self.kwargs['pk'])
        except Budget.DoesNotExist:
            getBudget = None

        return initial

    def form_invalid(self, form):

        messages.error(self.request, 'Invalid Form', fail_silently=False)

        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):

        form.save()
        self.object = form.save()

        messages.success(self.request, 'Success, form updated!')

        return self.render_to_response(self.get_context_data(form=form))

    form_class = ProjectCompleteForm


@method_decorator(has_projects_access, name='dispatch')
class ProjectCompleteDetail(LoginRequiredMixin, DetailView):

    model = ProjectComplete
    context_object_name = 'complete'

    def get_object(self, queryset=ProjectComplete.objects.all()):
        try:
            return queryset.get(project_agreement__id=self.kwargs['pk'])
        except ProjectComplete.DoesNotExist:
            return None

    def get_context_data(self, **kwargs):

        context = super(ProjectCompleteDetail, self).get_context_data(**kwargs)
        context['now'] = timezone.now()

        context.update({'id':self.kwargs['pk']})

        try:
            q_list = [Q(agreement__id=self.kwargs['pk'])]
            if self.get_object():
                q_list.append(Q(complete__id=self.get_object().pk))
            getBenchmark = Benchmarks.objects.filter(reduce(operator.or_, q_list))
        except Benchmarks.DoesNotExist:
            getBenchmark = None

        q_list = [Q(agreement__id=self.kwargs['pk']) ]
        if self.get_object():
            q_list.append( Q(complete__id=self.get_object().pk))
        budgetContribs = Budget.objects.filter(reduce(operator.or_, q_list))

        context['budgetContribs'] = budgetContribs
        context['getBenchmarks'] =  getBenchmark

        return context


@method_decorator(has_projects_access, name='dispatch')
class ProjectCompleteDelete(LoginRequiredMixin, DeleteView):
    """
    Project Complete Delete
    """
    model = ProjectComplete
    success_url = '/workflow/projectcomplete_list/0/'

    @method_decorator(group_required('Country',url='workflow/permission'))
    def dispatch(self, request, *args, **kwargs):
        return super(ProjectCompleteDelete, self).dispatch(request, *args, **kwargs)

    def form_invalid(self, form):

        messages.error(self.request, 'Invalid Form', fail_silently=False)

        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):

        form.save()

        return HttpResponseRedirect('/workflow/success')

    form_class = ProjectCompleteForm


@method_decorator(has_projects_access, name='dispatch')
class ProjectCompleteImport(LoginRequiredMixin, ListView):

    def get_context_data(self, **kwargs):
        context = super(ProjectCompleteImport, self).get_context_data(**kwargs)
        context['now'] = timezone.now()
        return context

    template_name = 'workflow/projectcomplete_import.html'


@login_required
def documentation_list(request):

    programs = request.user.tola_user.available_programs.filter(funding_status="Funded")

    # distinct() needed as a program in multiple countries causes duplicate documents returned
    documents = Documentation.objects.all().select_related('project').filter(program__in=programs).distinct()

    readonly = not user_has_program_roles(request.user, programs, ['medium', 'high'])

    js_context = {
        'allowProjectsAccess': request.user.tola_user.allow_projects_access,
        'programs': DocumentListProgramSerializer(programs, many=True).data,
        'documents': DocumentListDocumentSerializer(documents, many=True).data,
        'access': request.user.tola_user.access_data,
        'readonly': readonly,
    }

    return render(request, 'workflow/documentation_list.html', {
        'js_context': js_context,
    })


@method_decorator(has_projects_access, name='dispatch')
class DocumentationAgreementList(LoginRequiredMixin, AjaxableResponseMixin, CreateView):
    """
       Documentation Modal List
    """
    model = Documentation
    template_name = 'workflow/documentation_popup_list.html'

    def get(self, request, *args, **kwargs):

        countries = getCountry(request.user)
        getPrograms = Program.objects.all().filter(funding_status="Funded", country__in=countries)

        getDocumentation = Documentation.objects.all().prefetch_related('program', 'project')


        return render(request, self.template_name, {'getPrograms': getPrograms, 'getDocumentation': getDocumentation})


@method_decorator(has_projects_access, name='dispatch')
class DocumentationAgreementCreate(LoginRequiredMixin, AjaxableResponseMixin, CreateView):
    """
    Documentation Form
    """
    model = Documentation
    template_name = 'workflow/documentation_popup_form.html'

    @method_decorator(group_excluded('ViewOnly', url='workflow/permission'))
    def dispatch(self, request, *args, **kwargs):
        self.guidance = None
        return super(DocumentationAgreementCreate, self).dispatch(request, *args, **kwargs)

    # add the request to the kwargs
    def get_form_kwargs(self):
        kwargs = super(DocumentationAgreementCreate, self).get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

    def get_context_data(self, **kwargs):
        context = super(DocumentationAgreementCreate, self).get_context_data(**kwargs)
        getProject = ProjectAgreement.objects.get(id=self.kwargs['id'])
        context.update({'program': getProject.program})
        context.update({'project': getProject})
        context.update({'id': self.kwargs['id']})
        return context

    def get_initial(self):
        getProject = ProjectAgreement.objects.get(id=self.kwargs['id'])
        initial = {
            'project': self.kwargs['id'],
            'program': getProject.program,
            }

        return initial

    def form_invalid(self, form):

        messages.error(self.request, 'Invalid Form', fail_silently=False)

        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):

        form.save()

        messages.success(self.request, 'Success, Documentation Created!')
        return self.render_to_response(self.get_context_data(form=form))

    form_class = DocumentationForm


@method_decorator(has_projects_access, name='dispatch')
class DocumentationAgreementUpdate(LoginRequiredMixin, AjaxableResponseMixin, UpdateView):
    """
    Documentation Form
    """
    model = Documentation
    template_name = 'workflow/documentation_popup_form.html'

    @method_decorator(group_excluded('ViewOnly', url='workflow/permission'))
    def dispatch(self, request, *args, **kwargs):
        self.guidance = None
        return super(DocumentationAgreementUpdate, self).dispatch(request, *args, **kwargs)

    # add the request to the kwargs
    def get_form_kwargs(self):
        kwargs = super(DocumentationAgreementUpdate, self).get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

    def get_context_data(self, **kwargs):
        context = super(DocumentationAgreementUpdate, self).get_context_data(**kwargs)
        getProject = ProjectAgreement.objects.get(id=self.kwargs['id'])
        context.update({'project': getProject})
        context.update({'id': self.kwargs['id']})
        context.update({'pk': self.kwargs['pk']})
        return context

    def form_invalid(self, form):

        messages.error(self.request, 'Invalid Form', fail_silently=False)

        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):

        form.save()

        messages.success(self.request, 'Success, Documentation Updated!')
        return self.render_to_response(self.get_context_data(form=form))

    form_class = DocumentationForm


@method_decorator(has_projects_access, name='dispatch')
class DocumentationAgreementDelete(LoginRequiredMixin, AjaxableResponseMixin, DeleteView):
    """
    Documentation Delete popup window
    """
    model = Documentation
    template_name = 'workflow/documentation_agreement_confirm_delete.html'
    success_url = "/"

    def get_context_data(self, **kwargs):
        context = super(DocumentationAgreementDelete, self).get_context_data(**kwargs)
        context.update({'id': self.kwargs['pk']})
        return context

    def form_invalid(self, form):

        messages.error(self.request, 'Invalid Form', fail_silently=False)

        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):

        form.save()

        messages.success(self.request, 'Success, Documentation Deleted!')
        return self.render_to_response(self.get_context_data(form=form))

    form_class = DocumentationForm


class DocumentationCreate(CreateView):
    """
    Documentation Form
    """
    model = Documentation

    @method_decorator(login_required)
    @method_decorator(group_excluded('ViewOnly', url='workflow/permission'))
    def dispatch(self, request, *args, **kwargs):
        if not user_has_program_roles(request.user, request.user.tola_user.available_programs, ['medium', 'high']):
            raise PermissionDenied

        self.guidance = None
        return super(DocumentationCreate, self).dispatch(request, *args, **kwargs)

    # add the request to the kwargs
    def get_form_kwargs(self):
        kwargs = super(DocumentationCreate, self).get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

    def get_initial(self):
        return {
            'program': self.request.GET.get('program_id'),
        }

    def form_invalid(self, form):

        messages.error(self.request, 'Invalid Form', fail_silently=False)

        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):

        form.save()

        messages.success(self.request, 'Success, Documentation Created!')
        latest = Documentation.objects.latest('id')
        redirect_url = '/workflow/documentation_update/' + str(latest.id)
        return HttpResponseRedirect(redirect_url)

    form_class = DocumentationForm


class DocumentationUpdate(UpdateView):
    """
    Documentation Form
    """
    model = Documentation
    queryset = Documentation.objects.select_related()

    @method_decorator(login_required)
    @method_decorator(group_excluded('ViewOnly', url='workflow/permission'))
    def dispatch(self, request, *args, **kwargs):
        if not user_has_program_roles(request.user, Program.objects.filter(id=Documentation.objects.get(id=kwargs['pk']).program.id), ['medium', 'high']):
            raise PermissionDenied

        self.guidance = None
        return super(DocumentationUpdate, self).dispatch(request, *args, **kwargs)

    # add the request to the kwargs
    def get_form_kwargs(self):
        kwargs = super(DocumentationUpdate, self).get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

    def form_invalid(self, form):

        messages.error(self.request, 'Invalid Form', fail_silently=False)

        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):

        form.save()
        messages.success(self.request, 'Success, Documentation Updated!')

        return self.render_to_response(self.get_context_data(form=form))

    form_class = DocumentationForm


class DocumentationDelete(DeleteView):
    """
    Documentation Form
    """
    model = Documentation
    success_url = '/workflow/documentation_list/'

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):

        if not user_has_program_roles(request.user, Program.objects.filter(id=Documentation.objects.get(id=kwargs['pk']).program.id), ['medium', 'high']):
            raise PermissionDenied

        return super(DocumentationDelete, self).dispatch(request, *args, **kwargs)

    def form_invalid(self, form):

        messages.error(self.request, 'Invalid Form', fail_silently=False)

        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):

        form.save()

        messages.success(self.request, 'Success, Documentation Deleted!')
        return self.render_to_response(self.get_context_data(form=form))

    form_class = DocumentationForm

class IndicatorDataBySite(LoginRequiredMixin, ListView):
    template_name = 'workflow/site_indicatordata.html'
    context_object_name = 'results'

    def get_context_data(self, **kwargs):
        context = super(IndicatorDataBySite, self).get_context_data(**kwargs)
        context['site'] = SiteProfile.objects.get(pk=self.kwargs.get('site_id'))
        return context

    def get_queryset(self):
        q = Result.objects.filter(site__id=self.kwargs.get('site_id'), program__in=self.request.user.tola_user.available_programs).order_by('program', 'indicator')
        return q


class ProjectCompleteBySite(LoginRequiredMixin, ListView):
    template_name = 'workflow/site_projectcomplete.html'
    context_object_name = 'projects'

    def get_context_data(self, **kwargs):
        context = super(ProjectCompleteBySite, self).get_context_data(**kwargs)
        context['site'] = SiteProfile.objects.get(pk=self.kwargs.get('site_id'))
        return context

    def get_queryset(self):
        q = ProjectComplete.objects.filter(site__id=self.kwargs.get('site_id'), program__in=self.request.user.tola_user.available_programs).order_by('program')
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
                    'country','district','province')\
                .filter(projectagreement__id=activity_id)\
                .distinct()
        elif program_id != 0:
            getSiteProfile = SiteProfile.objects.prefetch_related(\
                    'country','district','province')\
                .filter(Q(projectagreement__program__id=program_id)\
                        | Q(result__program__id=program_id))\
                .distinct()
        else:
            getSiteProfile = SiteProfile.objects.prefetch_related(\
                    'country','district','province')\
                .filter(country__in=countries)\
                .distinct()
        if request.method == "GET" and "search" in request.GET:
            getSiteProfile = SiteProfile.objects.filter(\
                    Q(country__in=countries),\
                    Q(name__contains=request.GET["search"])\
                    | Q(office__name__contains=request.GET["search"])\
                    | Q(type__profile__contains=request.GET['search'])\
                    | Q(province__name__contains=request.GET["search"])\
                    | Q(district__name__contains=request.GET["search"])\
                    | Q(village__contains=request.GET['search'])
                    | Q(projectagreement__project_name__contains=request.GET["search"])\
                    | Q(projectcomplete__project_name__contains=request.GET['search']))\
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
                'getSiteProfile':getSiteProfile,
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
            getSiteProfile = SiteProfile.objects.all().prefetch_related('country','district','province').filter(country__in=countries).filter(status=1)
            getSiteProfileIndicator = SiteProfile.objects.all().prefetch_related('country','district','province').filter(Q(result__program__country__in=countries)).filter(status=1)
        else:
            getSiteProfile = SiteProfile.objects.all().prefetch_related('country','district','province').filter(projectagreement__id=self.kwargs['pk']).filter(status=1)
            getSiteProfileIndicator = None

        id=self.kwargs['pk']

        return render(request, self.template_name, {'getSiteProfile':getSiteProfile, 'getSiteProfileIndicator':getSiteProfileIndicator,'project_agreement_id': project_agreement_id,'id':id,'country': countries})


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
        getProjects = ProjectAgreement.objects.all().filter(site__id=self.kwargs['pk'])
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


@method_decorator(has_projects_access, name='dispatch')
class MonitorList(LoginRequiredMixin, ListView):
    """
    Monitoring Data
    """
    model = Monitor
    template_name = 'workflow/monitor_list.html'

    def get(self, request, *args, **kwargs):

        project_agreement_id = self.kwargs['pk']

        if int(self.kwargs['pk']) == 0:
            getMonitorData = Monitor.objects.all()
        else:
            getMonitorData = Monitor.objects.all().filter(agreement__id=self.kwargs['pk'])

        if int(self.kwargs['pk']) == 0:
            getBenchmarkData = Benchmarks.objects.all()
        else:
            getBenchmarkData = Benchmarks.objects.all().filter(agreement__id=self.kwargs['pk'])

        return render(request, self.template_name, {'getMonitorData': getMonitorData, 'getBenchmarkData': getBenchmarkData,'project_agreement_id': project_agreement_id})


@method_decorator(has_projects_access, name='dispatch')
class MonitorCreate(LoginRequiredMixin, AjaxableResponseMixin,CreateView):
    """
    Monitor Form
    """
    model = Monitor

    def dispatch(self, request, *args, **kwargs):
        return super(MonitorCreate, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(MonitorCreate, self).get_context_data(**kwargs)
        context.update({'id': self.kwargs['id']})
        return context

    def get_initial(self):
        initial = {
            'agreement': self.kwargs['id'],
            }

        return initial

    def form_invalid(self, form):

        messages.error(self.request, 'Invalid Form', fail_silently=False)

        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):
        form.save()
        messages.success(self.request, 'Success, Monitor Created!')
        return self.render_to_response(self.get_context_data(form=form))

    form_class = MonitorForm


@method_decorator(has_projects_access, name='dispatch')
class MonitorUpdate(LoginRequiredMixin, AjaxableResponseMixin, UpdateView):
    """
    Monitor Form
    """
    model = Monitor

    def get_context_data(self, **kwargs):
        context = super(MonitorUpdate, self).get_context_data(**kwargs)
        context.update({'id': self.kwargs['pk']})
        return context

    def form_invalid(self, form):
        messages.error(self.request, 'Invalid Form', fail_silently=False)
        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):
        form.save()
        messages.success(self.request, 'Success, Monitor Updated!')

        return self.render_to_response(self.get_context_data(form=form))

    form_class = MonitorForm


@method_decorator(has_projects_access, name='dispatch')
class MonitorDelete(LoginRequiredMixin, AjaxableResponseMixin, DeleteView):
    """
    Monitor Form
    """
    model = Monitor
    success_url = '/'

    def get_context_data(self, **kwargs):
        context = super(MonitorDelete, self).get_context_data(**kwargs)
        context.update({'id': self.kwargs['pk']})
        return context

    def form_invalid(self, form):

        messages.error(self.request, 'Invalid Form', fail_silently=False)

        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):

        form.save()

        messages.success(self.request, 'Success, Monitor Deleted!')
        return self.render_to_response(self.get_context_data(form=form))


@method_decorator(has_projects_access, name='dispatch')
class BenchmarkCreate(LoginRequiredMixin, AjaxableResponseMixin, CreateView):
    """
    Benchmark Form
    """
    model = Benchmarks

    # add the request to the kwargs
    def get_form_kwargs(self):
        kwargs = super(BenchmarkCreate, self).get_form_kwargs()
        try:
            getComplete = ProjectComplete.objects.get(project_agreement__id=self.kwargs['id'])
            kwargs['complete'] = getComplete.id
        except ProjectComplete.DoesNotExist:
            kwargs['complete'] = None

        kwargs['request'] = self.request
        kwargs['agreement'] = self.kwargs['id']
        return kwargs

    def dispatch(self, request, *args, **kwargs):
        return super(BenchmarkCreate, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(BenchmarkCreate, self).get_context_data(**kwargs)
        context.update({'id': self.kwargs['id']})
        try:
            getComplete = ProjectComplete.objects.get(id=self.kwargs['id'])
            context.update({'p_name': getComplete.project_name})
        except ProjectComplete.DoesNotExist:
            # do nothing
            context = context
        return context

    def get_initial(self):

        if self.request.GET.get('is_it_project_complete_form', None):
            initial = { 'complete': self.kwargs['id'] }
        else:
            initial = { 'agreement': self.kwargs['id'] }

        return initial

    def form_invalid(self, form):

        messages.error(self.request, 'Invalid Form', fail_silently=False)

        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):
        form.save()
        messages.success(self.request, 'Success, Component Created!')
        return self.render_to_response(self.get_context_data(form=form))

    form_class = BenchmarkForm


@method_decorator(has_projects_access, name='dispatch')
class BenchmarkUpdate(LoginRequiredMixin, AjaxableResponseMixin, UpdateView):
    """
    Benchmark Form
    """
    model = Benchmarks

    def get_context_data(self, **kwargs):
        context = super(BenchmarkUpdate, self).get_context_data(**kwargs)
        context.update({'id': self.kwargs['pk']})
        return context

    # add the request to the kwargs
    def get_form_kwargs(self):
        kwargs = super(BenchmarkUpdate, self).get_form_kwargs()
        getBenchmark = Benchmarks.objects.all().get(id=self.kwargs['pk'])

        kwargs['request'] = self.request
        kwargs['agreement'] = getBenchmark.agreement.id
        if getBenchmark.complete:
            kwargs['complete'] = getBenchmark.complete.id
        else:
            kwargs['complete'] = None

        return kwargs

    def form_invalid(self, form):
        messages.error(self.request, 'Invalid Form', fail_silently=False)
        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):
        form.save()
        messages.success(self.request, 'Success, Component Updated!')

        return self.render_to_response(self.get_context_data(form=form))

    form_class = BenchmarkForm


@method_decorator(has_projects_access, name='dispatch')
class BenchmarkDelete(LoginRequiredMixin, AjaxableResponseMixin, DeleteView):
    """
    Benchmark Form
    """
    model = Benchmarks
    success_url = '/'

    def get_context_data(self, **kwargs):
        context = super(BenchmarkDelete, self).get_context_data(**kwargs)
        context.update({'id': self.kwargs['pk']})
        return context

    def form_invalid(self, form):

        messages.error(self.request, 'Invalid Form', fail_silently=False)

        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):

        form.save()

        messages.success(self.request, 'Success, Component Deleted!')
        return self.render_to_response(self.get_context_data(form=form))

    form_class = BenchmarkForm



@method_decorator(has_projects_access, name='dispatch')
class StakeholderList(LoginRequiredMixin, ListView):
    """
    getStakeholders
    """
    model = Stakeholder
    template_name = 'workflow/stakeholder_list.html'

    def get(self, request, *args, **kwargs):
        # Check for project filter
        project_agreement_id = self.kwargs['pk']
        # Check for program filter
        if self.kwargs['program_id']:
            program_id = int(self.kwargs['program_id'])
        else:
            program_id = 0

        getPrograms = request.user.tola_user.available_programs.filter(funding_status="Funded")

        if program_id != 0:
            getStakeholders = Stakeholder.objects.all().filter(projectagreement__program__id=program_id, projectagreement__program__in=getPrograms).distinct()

        elif int(self.kwargs['pk']) != 0:
            getStakeholders = Stakeholder.objects.all().filter(projectagreement=self.kwargs['pk'], projectagreement__program__in=getPrograms).distinct()

        else:
            getStakeholders = Stakeholder.objects.all().filter(projectagreement__program__in=getPrograms).distinct()

        return render(request, self.template_name, {'getStakeholders': getStakeholders, 'project_agreement_id': project_agreement_id,'program_id':program_id, 'getPrograms': getPrograms})


@method_decorator(has_projects_access, name='dispatch')
class StakeholderCreate(LoginRequiredMixin, CreateView):
    """
    Stakeholder Form
    """
    model = Stakeholder

    @method_decorator(group_excluded('ViewOnly', url='workflow/permission'))
    def dispatch(self, request, *args, **kwargs):
        self.guidance = None
        return super(StakeholderCreate, self).dispatch(request, *args, **kwargs)

    # add the request to the kwargs
    def get_form_kwargs(self):
        kwargs = super(StakeholderCreate, self).get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

    def get_context_data(self, **kwargs):
        context = super(StakeholderCreate, self).get_context_data(**kwargs)
        context.update({'id': self.kwargs['id']})
        return context

    def get_initial(self):

        country = getCountry(self.request.user)[0]

        initial = {
            'agreement': self.kwargs['id'],
            'country': country,
            }

        return initial

    def form_invalid(self, form):

        messages.error(self.request, 'Invalid Form', fail_silently=False)

        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):
        form.save()
        messages.success(self.request, 'Success, Stakeholder Created!')
        latest = Stakeholder.objects.latest('id')
        redirect_url = '/workflow/stakeholder_update/' + str(latest.id)
        return HttpResponseRedirect(redirect_url)

    form_class = StakeholderForm


@method_decorator(has_projects_access, name='dispatch')
class StakeholderUpdate(LoginRequiredMixin, UpdateView):
    """
    Stakeholder Form
    """
    model = Stakeholder

    @method_decorator(group_excluded('ViewOnly', url='workflow/permission'))
    def dispatch(self, request, *args, **kwargs):
        self.guidance = None
        return super(StakeholderUpdate, self).dispatch(request, *args, **kwargs)

    # add the request to the kwargs
    def get_form_kwargs(self):
        kwargs = super(StakeholderUpdate, self).get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

    def get_context_data(self, **kwargs):
        context = super(StakeholderUpdate, self).get_context_data(**kwargs)
        context.update({'id': self.kwargs['pk']})
        return context

    def form_invalid(self, form):
        messages.error(self.request, 'Invalid Form', fail_silently=False)
        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):
        form.save()
        messages.success(self.request, 'Success, Stakeholder Updated!')

        return self.render_to_response(self.get_context_data(form=form))

    form_class = StakeholderForm


@method_decorator(has_projects_access, name='dispatch')
class StakeholderDelete(LoginRequiredMixin, DeleteView):
    """
    Benchmark Form
    """
    model = Stakeholder
    success_url = '/workflow/stakeholder_list/0/0/'

    def get_context_data(self, **kwargs):
        context = super(StakeholderDelete, self).get_context_data(**kwargs)
        context.update({'id': self.kwargs['pk']})
        return context

    def form_invalid(self, form):

        messages.error(self.request, 'Invalid Form', fail_silently=False)

        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):

        form.save()

        messages.success(self.request, 'Success, Stakeholder Deleted!')
        return self.render_to_response(self.get_context_data(form=form))

    form_class = StakeholderForm


@method_decorator(has_projects_access, name='dispatch')
class BudgetList(LoginRequiredMixin, ListView):
    """
    Budget List
    """
    model = Budget
    template_name = 'workflow/budget_list.html'

    def get(self, request, *args, **kwargs):

        project_agreement_id = self.kwargs['pk']

        if int(self.kwargs['pk']) == 0:
            getBudget = Budget.objects.all()
        else:
            getBudget = Budget.objects.all().filter(project_agreement_id=self.kwargs['pk'])

        return render(request, self.template_name, {'getBudget': getBudget, 'project_agreement_id': project_agreement_id})


@method_decorator(has_projects_access, name='dispatch')
class BudgetCreate(LoginRequiredMixin, AjaxableResponseMixin, CreateView):
    """
    Budget Form
    """
    model = Budget
    template_name = 'workflow/budget_form.html'

    def get_context_data(self, **kwargs):
        context = super(BudgetCreate, self).get_context_data(**kwargs)
        context.update({'id': self.kwargs['id']})
        return context

    @method_decorator(group_excluded('ViewOnly', url='workflow/permission'))
    def dispatch(self, request, *args, **kwargs):
        return super(BudgetCreate, self).dispatch(request, *args, **kwargs)

    def get_initial(self):
        if self.request.GET.get('is_it_project_complete_form', None):
            initial = {'complete': self.kwargs['id']}
        else:
            initial = {'agreement': self.kwargs['id']}
        return initial

    def get_form_kwargs(self):
        kwargs = super(BudgetCreate, self).get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

    def form_invalid(self, form):

        messages.error(self.request, 'Invalid Form', fail_silently=False)

        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):
        obj = form.save()
        if self.request.is_ajax():
            data = serializers.serialize('json', [obj])
            return HttpResponse(data)

        messages.success(self.request, 'Success, Budget Created!')
        form = ""
        return self.render_to_response(self.get_context_data(form=form))


    form_class = BudgetForm


@method_decorator(has_projects_access, name='dispatch')
class BudgetUpdate(LoginRequiredMixin, AjaxableResponseMixin, UpdateView):
    """
    Budget Form
    """
    model = Budget

    @method_decorator(group_excluded('ViewOnly', url='workflow/permission'))
    def dispatch(self, request, *args, **kwargs):
        return super(BudgetUpdate, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(BudgetUpdate, self).get_context_data(**kwargs)
        context.update({'id': self.kwargs['pk']})
        return context

    def form_invalid(self, form):
        messages.error(self.request, 'Invalid Form', fail_silently=False)
        return self.render_to_response(self.get_context_data(form=form))

    # add the request to the kwargs
    def get_form_kwargs(self):
        kwargs = super(BudgetUpdate, self).get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

    def form_valid(self, form):
        obj = form.save()
        if self.request.is_ajax():
            data = serializers.serialize('json', [obj])
            return HttpResponse(data)

        messages.success(self.request, 'Success, Budget Output Updated!')

        return self.render_to_response(self.get_context_data(form=form))

    form_class = BudgetForm


@method_decorator(has_projects_access, name='dispatch')
class BudgetDelete(LoginRequiredMixin, AjaxableResponseMixin, DeleteView):
    """
    Budget Delete
    """
    model = Budget
    success_url = '/'

    @method_decorator(group_excluded('ViewOnly', url='workflow/permission'))
    def dispatch(self, request, *args, **kwargs):
        return super(BudgetDelete, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(BudgetDelete, self).get_context_data(**kwargs)
        context.update({'id': self.kwargs['pk']})
        return context

    def form_invalid(self, form):

        messages.error(self.request, 'Invalid Form', fail_silently=False)

        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):

        form.save()

        messages.success(self.request, 'Success, Budget Deleted!')
        return self.render_to_response(self.get_context_data(form=form))

    form_class = BudgetForm


@method_decorator(has_projects_access, name='dispatch')
class ChecklistItemList(LoginRequiredMixin, ListView):
    """
    Checklist List
    """
    model = ChecklistItem
    template_name = 'workflow/checklist_list.html'

    def get(self, request, *args, **kwargs):

        project_agreement_id = self.kwargs['pk']

        if int(self.kwargs['pk']) == 0:
            getChecklist = ChecklistItem.objects.all()
        else:
            getChecklist = ChecklistItem.objects.all().filter(checklist__agreement_id=self.kwargs['pk'])

        return render(request, self.template_name, {'getChecklist': getChecklist, 'project_agreement_id': self.kwargs['pk']})


@method_decorator(has_projects_access, name='dispatch')
class ChecklistItemCreate(LoginRequiredMixin, CreateView):
    """
    Checklist Form
    """
    model = ChecklistItem

    @method_decorator(group_excluded('ViewOnly', url='workflow/permission'))
    def dispatch(self, request, *args, **kwargs):
        self.guidance = None
        return super(ChecklistItemCreate, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(ChecklistItemCreate, self).get_context_data(**kwargs)
        context.update({'id': self.kwargs['id']})
        return context

    # add the request to the kwargs
    def get_form_kwargs(self):
        kwargs = super(ChecklistItemCreate, self).get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

    def get_initial(self):
        checklist = Checklist.objects.get(agreement=self.kwargs['id'])
        initial = {
            'checklist': checklist,
            }

        return initial

    def form_invalid(self, form):

        messages.error(self.request, 'Invalid Form', fail_silently=False)

        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):
        form.save()
        messages.success(self.request, 'Success, Checklist Item Created!')
        latest = ChecklistItem.objects.latest('id')
        redirect_url = '/workflow/checklistitem_update/' + str(latest.id)
        return HttpResponseRedirect(redirect_url)


    form_class = ChecklistItemForm


@method_decorator(has_projects_access, name='dispatch')
class ChecklistItemUpdate(LoginRequiredMixin, UpdateView):
    """
    Checklist Form
    """
    model = ChecklistItem

    @method_decorator(group_excluded('ViewOnly', url='workflow/permission'))
    def dispatch(self, request, *args, **kwargs):
        self.guidance = None
        return super(ChecklistItemUpdate, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(ChecklistItemUpdate, self).get_context_data(**kwargs)
        context.update({'id': self.kwargs['pk']})
        return context

    # add the request to the kwargs
    def get_form_kwargs(self):
        kwargs = super(ChecklistItemUpdate, self).get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

    def form_invalid(self, form):
        messages.error(self.request, 'Invalid Form', fail_silently=False)
        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):
        form.save()
        messages.success(self.request, 'Success, Checklist Item Updated!')

        return self.render_to_response(self.get_context_data(form=form))

    form_class = ChecklistItemForm


@login_required
@has_projects_access
def checklist_update_link(AjaxableResponseMixin,pk,type,value):
    """
    Checklist Update from Link
    """
    value = int(value)

    if type == "in_file":
        update = ChecklistItem.objects.filter(id=pk).update(in_file=value)
    elif type == "not_applicable":
        update = ChecklistItem.objects.filter(id=pk).update(not_applicable=value)

    return HttpResponse(value)


@method_decorator(has_projects_access, name='dispatch')
class ChecklistItemDelete(LoginRequiredMixin, DeleteView):
    """
    Checklist Delete
    """
    model = ChecklistItem
    success_url = '/'

    @method_decorator(group_excluded('ViewOnly', url='workflow/permission'))
    def dispatch(self, request, *args, **kwargs):
        return super(ChecklistItemDelete, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(ChecklistItemDelete, self).get_context_data(**kwargs)
        context.update({'id': self.kwargs['pk']})
        return context

    def form_invalid(self, form):

        messages.error(self.request, 'Invalid Form', fail_silently=False)

        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):

        form.save()

        messages.success(self.request, 'Success, Checklist Item Deleted!')
        return self.render_to_response(self.get_context_data(form=form))

    form_class = ChecklistItemForm


@method_decorator(has_projects_access, name='dispatch')
class Report(LoginRequiredMixin, View, AjaxableResponseMixin):
    """
    project agreement list report
    """
    def get(self, request, *args, **kwargs):
        countries=getCountry(request.user)
        if int(self.kwargs['pk']) != 0:
            getAgreements = ProjectAgreement.objects.filter(program__id=self.kwargs['pk'])

        elif self.kwargs['status'] != 'none':
            getAgreements = ProjectAgreement.objects.filter(approval=self.kwargs['status'])
        else:
            getAgreements = ProjectAgreement.objects.select_related().filter(program__country__in=countries)

        getPrograms = Program.objects.filter(funding_status="Funded", country__in=countries).distinct()
        filtered = getAgreements
        table = ProjectAgreementTable(filtered.queryset)
        table.paginate(page=request.GET.get('page', 1), per_page=20)

        if request.method == "GET" and "search" in request.GET:
            getAgreements = ProjectAgreement.objects.filter(\
                      Q(project_name__contains=request.GET["search"])\
                    | Q(activity_code__contains=request.GET["search"]))


        if request.GET.get('export'):
            dataset = ProjectAgreementResource().export(getAgreements)
            response = HttpResponse(dataset.csv, content_type='application/ms-excel')
            response['Content-Disposition'] = 'attachment; filename=activity_report.csv'
            return response


        # send the keys and vars
        return render(request, "workflow/report.html", {
                      'country': countries,
                      'form': FilterForm(),
                      'filter': filtered,
                      'helper': FilterForm.helper,
                      'APPROVALS': APPROVALS,
                      'getPrograms': getPrograms})


@method_decorator(has_projects_access, name='dispatch')
class ReportData(LoginRequiredMixin, View, AjaxableResponseMixin):
    """
    Render Agreements json object response to the report ajax call
    """

    def get(self, request, *args, **kwargs):

        countries=getCountry(request.user)
        filters = {}
        if int(self.kwargs['pk']) != 0:
            filters['program__id'] = self.kwargs['pk']
        elif self.kwargs['status'] != 'none':
            filters['approval'] = self.kwargs['status']
        else:
            filters['program__country__in'] = countries

        getAgreements = ProjectAgreement.objects.prefetch_related('sectors').select_related('program', 'project_type', 'office', 'estimated_by').filter(**filters).values('id', 'program__id', 'approval', \
                'program__name', 'project_name','site', 'activity_code', 'office__name', \
                'project_name', 'sector__sector', 'project_activity', 'project_type__name', \
                'account_code', 'lin_code','estimated_by__name','total_estimated_budget',\
                'mc_estimated_budget','total_estimated_budget')

        getAgreements = json.dumps(list(getAgreements), cls=DjangoJSONEncoder)

        final_dict = { 'get_agreements': getAgreements }

        return JsonResponse(final_dict, safe=False)


@login_required
def country_json(request, country):
    """
    For populating the province dropdown based  country dropdown value
    """
    selected_country = Country.objects.get(id=country)
    province = Province.objects.all().filter(country=selected_country)
    provinces_json = serializers.serialize("json", province)
    return HttpResponse(provinces_json, content_type="application/json")


@login_required
def province_json(request, province):
    """
    For populating the office district based  country province value
    """
    selected_province = Province.objects.get(id=province)
    district = District.objects.all().filter(province=selected_province)
    districts_json = serializers.serialize("json", district)
    return HttpResponse(districts_json, content_type="application/json")


@login_required
def district_json(request, district):
    """
    For populating the office dropdown based  country dropdown value
    """
    selected_district = District.objects.get(id=district)
    adminthree = AdminLevelThree.objects.all().filter(district=selected_district)
    adminthree_json = serializers.serialize("json", adminthree)
    return HttpResponse(adminthree_json, content_type="application/json")


@login_required
@has_projects_access
def export_stakeholders_list(request, **kwargs):

    program_id = int(kwargs['program_id'])
    programs = request.user.tola_user.available_programs

    if program_id != 0:
        getStakeholders = Stakeholder.objects.prefetch_related('sector').filter(projectagreement__program__id=program_id, projectagreement__program__in=programs).distinct()
    else:
        getStakeholders = Stakeholder.objects.prefetch_related('sector').filter(projectagreement__program__in=programs).distinct()

    dataset = StakeholderResource().export(getStakeholders)
    response = HttpResponse(dataset.csv, content_type='application/ms-excel')
    response['Content-Disposition'] = 'attachment; filename=stakeholders.csv'

    return response


#Ajax views for single page filtering
@method_decorator(has_projects_access, name='dispatch')
class StakeholderObjects(LoginRequiredMixin, View, AjaxableResponseMixin):
    """
    Render Agreements json object response to the report ajax call
    """

    def get(self, request, *args, **kwargs):

        # Check for project filter
        project_agreement_id = self.kwargs['pk']
        # Check for program filter

        if self.kwargs['program_id']:
            program_id = int(self.kwargs['program_id'])
        else:
            program_id = 0

        programs = request.user.tola_user.available_programs

        if program_id != 0:
            getStakeholders = Stakeholder.objects.all().filter(projectagreement__program__id=program_id, projectagreement__program__in=programs).distinct().values('id', 'create_date', 'type__name', 'name', 'sectors__sector')

        elif int(self.kwargs['pk']) != 0:
            getStakeholders = Stakeholder.objects.all().filter(projectagreement=self.kwargs['pk'], projectagreement__program__in=programs).distinct().values('id', 'create_date', 'type__name', 'name', 'sectors__sector')


        else:
            getStakeholders = Stakeholder.objects.all().filter(projectagreement__program__in=programs).values('id', 'create_date', 'type__name', 'name', 'sectors__sector').distinct()


        getStakeholders = json.dumps(list(getStakeholders), cls=DjangoJSONEncoder)

        final_dict = {'getStakeholders': getStakeholders}

        return JsonResponse(final_dict, safe=False)


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
        ProgramAuditLog.log_program_dates_updated(request.user, program, old_dates, program.dates_for_logging, request.POST.get('rationale'))

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


