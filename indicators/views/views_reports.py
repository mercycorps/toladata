# -*- coding: utf-8 -*-
""" View functions for generating IPTT Reports (HTML and Excel)"""

from workflow.models import Program
from workflow.serializers_new import (
    IPTTQSProgramSerializer,
    IPTTProgramSerializer
)
from indicators.models import Indicator, PinnedReport, PeriodicTarget
from indicators.forms import PinnedReportForm

from indicators.serializers_new import (
    IPTTJSONTVAReportIndicatorSerializer,
    IPTTJSONTPReportIndicatorSerializer
)
from indicators.export_renderers import IPTTExcelRenderer
from workflow.serializers_new import (
    IPTTTPReportSerializer,
    IPTTTVAReportSerializer,
    IPTTFullReportSerializer
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


@method_decorator(has_program_read_access, name='dispatch')
class IPTTReport(LoginRequiredMixin, TemplateView):
    template_name = 'indicators/iptt_report.html'

    def get(self, request, *args, **kwargs):
        program_id = kwargs.get('program')
        programs = request.user.tola_user.available_active_programs.annotate(
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
            targets_exist=True,
            reporting_period_end__isnull=False,
            indicators_count__gt=0
        ).order_by('name').values_list('pk', 'name', 'tva_indicators_count')
        program_data = IPTTProgramSerializer.load_for_pk(program_id).data
        react_data = {
            'programs_list': list(programs),
            'program_data': program_data,
        }
        return self.render_to_response({'react_context': react_data})

@login_required
@has_program_read_access
def api_iptt_report_data(request, program):
    if request.GET.get('report_type') == '1':
        data = IPTTJSONTVAReportIndicatorSerializer.load_report(
            program,
            int(request.GET.get('frequency'))
        ).data
    else:
        data = IPTTJSONTPReportIndicatorSerializer.load_report(
            program,
            int(request.GET.get('frequency'))
        ).data
    return JsonResponse(
        {'report_data': data,
         'report_frequency': int(request.GET.get('frequency')),
         'program_pk': int(program)})


@login_required
@has_program_read_access
def api_iptt_filter_data(request, program):
    return JsonResponse(IPTTProgramSerializer.load_for_pk(program).data)



class IPTTExcelReport(LoginRequiredMixin, View):
    filter_params = ['sites', 'types', 'sectors', 'indicators', 'levels', 'tiers']

    def dispatch(self, request, *args, **kwargs):
        self.fullTVA = request.GET.get('fullTVA', None) == 'true'
        self.report_type = int(request.GET.get('reportType', 0))
        self.program_pk = int(request.GET.get('programId', 0))
        if not self.fullTVA:
            self.frequency = int(request.GET.get('frequency', 0))
            self.filters = {param: list(map(int, request.GET.getlist(param))) for param in request.GET.keys() & self.filter_params}
            disaggregations = list(map(int, filter(str.isdigit, request.GET.getlist('disaggregations'))))
            if disaggregations:
                self.filters['disaggregations'] = disaggregations
            self.filters['hide_empty_disagg_categories'] = 'hide-categories' in request.GET.getlist('disaggregations')
            self.filters['groupby'] = int(request.GET.get('groupby', 1))
            start = request.GET.get('start', None)
            end = request.GET.get('end', None)
            self.filters['start'] = int(start) if start else None
            self.filters['end'] = int(end) if end else None
        return super().dispatch(request, *args, **kwargs)


    @property
    def serializer_class(self):
        if self.fullTVA:
            return IPTTFullReportSerializer
        elif self.report_type == 1:
            return IPTTTVAReportSerializer
        elif self.report_type == 2:
            return IPTTTPReportSerializer
        else:
            raise NotImplementedError('No report type specified')

    def get_params(self, request):
        params = {}
        if not self.fullTVA:
            columns = request.GET.getlist('columns')
            if columns:
                params['columns'] = list(map(int, columns))
            if self.filters.get('hide_empty_disagg_categories', False):
                params['hide_empty_disagg_categories'] = True
        return params

    def get(self, request):
        if self.fullTVA:
            serialized_report = self.serializer_class.load_report(self.program_pk)
        else:
            serialized_report = self.serializer_class.load_report(
                self.program_pk, frequency=self.frequency, filters=self.filters
            )
        renderer = IPTTExcelRenderer(serialized_report, params=self.get_params(request))
        if self.fullTVA:
            renderer.add_change_log(self.program_pk)
        response = renderer.render_to_response()
        return renderer.render_to_response()
