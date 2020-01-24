# -*- coding: utf-8 -*-
""" View functions for generating IPTT Reports (HTML and Excel)"""

from workflow.models import Program
from workflow.serializers_new import (
    IPTTQSProgramSerializer,
    IPTTProgramSerializer
)
from indicators.models import Indicator, PinnedReport, PeriodicTarget
from indicators.forms import PinnedReportForm
from indicators.serializers import (
    IPTTSerializer,
)
from indicators.serializers_new import (
    IPTTTVAReportIndicatorSerializer,
    IPTTTPReportIndicatorSerializer
)
from tola_management.permissions import (
    verify_program_access_level,
    has_program_read_access
)
from django.utils.decorators import method_decorator
from django.db import models
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.views.generic import TemplateView, View
from django.shortcuts import get_object_or_404
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin



@login_required
@require_POST
def create_pinned_report(request):
    """
    AJAX call for creating a PinnedReport
    """
    try:
        Program.objects.get(pk=request.POST.get('program'))
    except Program.DoesNotExist:
        return HttpResponseBadRequest('program does not exist')
    verify_program_access_level(request, request.POST.get('program'), 'low', super_admin_override=True)
    form = PinnedReportForm(request.POST)
    if form.is_valid():
        pr = form.save(commit=False)
        pr.tola_user = request.user.tola_user
        pr.save()
    else:
        return HttpResponseBadRequest(str(form.errors.items()))

    return HttpResponse()


@login_required
@require_POST
def delete_pinned_report(request):
    """
    AJAX call for deleting a PinnedReport
    """
    pinned_report = get_object_or_404(PinnedReport, pk=request.POST.get('pinned_report_id'),
                                      tola_user_id=request.user.tola_user.id)
    verify_program_access_level(request, pinned_report.program.pk, 'low', super_admin_override=True)
    pinned_report.delete()
    return HttpResponse()



class IPTTQuickstart(LoginRequiredMixin, TemplateView):
    template_name = 'indicators/iptt_quickstart.html'

    def get(self, request, *args, **kwargs):
        programs_data = IPTTQSProgramSerializer.load_for_user(request.user)
        js_context = {
            'programs': programs_data.data,
            'iptt_url': '/indicators/iptt_report/',
            'initial_selected_program_id': request.GET.get('program_id'),
        }
        return self.render_to_response({'js_context': js_context})

from silk.profiling.profiler import silk_profile

@method_decorator(has_program_read_access, name='dispatch')
class IPTTReport(LoginRequiredMixin, TemplateView):
    template_name = 'indicators/iptt_report.html'

    @silk_profile(name='IPTT report get')
    def get(self, request, *args, **kwargs):
        program_id = kwargs.get('program')
        programs = request.user.tola_user.available_programs.annotate(
            indicators_count=models.Count('indicator'),
            targets_exist=models.Exists(
                PeriodicTarget.objects.filter(
                    indicator__program=models.OuterRef('pk')
                )
            ),
            tva_indicators_count=models.Subquery(
                Indicator.rf_aware_objects.filter(
                    program=models.OuterRef('pk'),
                    target_frequency__in=Indicator.REGULAR_TARGET_FREQUENCIES + (Indicator.LOP, Indicator.MID_END)
                ).order_by().values('program').annotate(tva_count=models.Count('pk')).values('tva_count')[:1],
                output_field=models.IntegerField()
            )
        ).filter(
            funding_status="Funded",
            targets_exist=True,
            reporting_period_start__isnull=False,
            reporting_period_end__isnull=False,
            indicators_count__gt=0
        ).order_by('name').values_list('pk', 'name', 'tva_indicators_count')
        program_data = IPTTProgramSerializer.get_for_pk(program_id).data
        react_data = {
            'programs_list': list(programs),
            'program_data': program_data,
        }
        return self.render_to_response({'react_context': react_data})

@login_required
@has_program_read_access
def api_iptt_report_data(request, program):
    with silk_profile(name='API IPTT Report Data program %s' % program):
        if request.GET.get('report_type') == '1':
            data = IPTTTVAReportIndicatorSerializer.load_report(
                program,
                int(request.GET.get('frequency'))
            )
        else:
            data = IPTTTPReportIndicatorSerializer.load_report(
                program,
                int(request.GET.get('frequency'))
            )
        return JsonResponse(
            {'report_data': data,
             'report_frequency': int(request.GET.get('frequency')),
             'program_pk': int(program)})


@login_required
@has_program_read_access
def api_iptt_filter_data(request, program):
    with silk_profile(name='API iptt filter data %s' % program):
        return JsonResponse(IPTTProgramSerializer.get_for_pk(program).data)


class IPTTExcelReport(LoginRequiredMixin, View):

    def get_serialized_data(self, request):
        if request.GET.get('fullTVA') == 'true':
            report_type = IPTTSerializer.TVA_FULL_EXCEL
        elif request.GET.get('reportType') == '1':
            report_type = IPTTSerializer.TVA_EXCEL
        elif request.GET.get('reportType') == '2':
            report_type = IPTTSerializer.TIMEPERIODS_EXCEL
        else:
            raise NotImplementedError('No report type specified')
        return IPTTSerializer(report_type, request.GET)

    def get(self, request):
        with silk_profile(name='get serialized excel data for program %s' % request.GET.get('programId')):
            serialized = self.get_serialized_data(request)
        with silk_profile(name='initialize serialized excel data for program %s' % request.GET.get('programId')):
            serialized.initialize()
        with silk_profile(name="render serialized data for program %s" % request.GET.get('programId')):
            return serialized.render(request)
