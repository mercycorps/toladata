# -*- coding: utf-8 -*-
""" View functions for generating IPTT Reports (HTML and Excel)"""

import openpyxl
from openpyxl import styles
from workflow.models import Program
from workflow.serializers_new import IPTTQSProgramSerializer
from indicators.models import Indicator, PeriodicTarget, PinnedReport, Level, LevelTier
from indicators.forms import PinnedReportForm
from indicators.queries import IPTTIndicator
from indicators.serializers import IPTTSerializer, ProgramSerializer, IPTTProgramSerializer
from tola.l10n_utils import l10n_date_medium, l10n_date_long, l10n_monthname
from tola_management.permissions import verify_program_access_level

from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.views.decorators.http import require_POST
from django.views.generic import TemplateView, View
from django.shortcuts import get_object_or_404, render
from django.utils import timezone
from django.utils.translation import (
    ugettext,
    ugettext_lazy as _
)
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


def get_program_filter_data(request):
    """uses request user to populate program data for filter dropdowns in IPTT Quickstart / IPTT Reeport"""

    programs = []
    #countries = request.user.tola_user.available_countries
    programs_qs = request.user.tola_user.available_programs.filter(
        funding_status="Funded",
        reporting_period_start__isnull=False, reporting_period_end__isnull=False
    ).order_by('id')
    frequencies_qs = Indicator.objects.filter(
        program__in=programs_qs, target_frequency__isnull=False
    ).order_by('program_id', 'target_frequency').values(
        'program_id', 'target_frequency'
    ).distinct()
    for program in programs_qs:
        frequencies = [f['target_frequency'] for f in frequencies_qs if f['program_id'] == program.pk]
        if frequencies:
            start_formatted = l10n_date_medium(program.reporting_period_start)
            end_formatted = l10n_date_medium(program.reporting_period_end)
            programs.append({
                'id': program.pk,
                'name': program.name,
                'old_style_levels': not program.results_framework,
                'frequencies': frequencies,
                'reporting_period_start': start_formatted,
                'reporting_period_end': end_formatted,
                'result_chain_filter_label': program.rf_chain_sort_label,
                'short_result_chain_label': program.rf_chain_group_label,
                # blanks in below strings are placeholders until this moves to associative arrays:
                'periodDateRanges': {
                    '1': [[
                        start_formatted,
                        end_formatted,
                        '',
                        '',
                        '',
                        program.reporting_period_start.isoformat(),
                        program.reporting_period_end.isoformat(),
                        ]],
                    '2': [[
                        start_formatted,
                        end_formatted,
                        ugettext('Midline'),
                        '',
                        '',
                        program.reporting_period_start.isoformat(),
                        program.reporting_period_end.isoformat(),
                        ], [
                            start_formatted,
                            end_formatted,
                            ugettext('Endline'),
                            '',
                            '',
                            program.reporting_period_start.isoformat(),
                            program.reporting_period_end.isoformat(),
                        ]],
                    '3': [
                        [l10n_date_medium(period['start']),
                         l10n_date_medium(period['end']),
                         period['start'] > timezone.now().date(),
                         '',
                         '',
                         period['start'].isoformat(),
                         period['end'].isoformat(),
                        ]
                        for period in PeriodicTarget.generate_for_frequency(3)(
                            program.reporting_period_start,
                            program.reporting_period_end)],
                    '4': [
                        [l10n_date_medium(period['start']),
                         l10n_date_medium(period['end']),
                         period['start'] > timezone.now().date(),
                         '',
                         '',
                         period['start'].isoformat(),
                         period['end'].isoformat(),
                        ]
                        for period in PeriodicTarget.generate_for_frequency(4)(
                            program.reporting_period_start,
                            program.reporting_period_end)],
                    '5': [
                        [l10n_date_medium(period['start']),
                         l10n_date_medium(period['end']),
                         period['start'] > timezone.now().date(),
                         '',
                         '',
                         period['start'].isoformat(),
                         period['end'].isoformat(),
                        ]
                        for period in PeriodicTarget.generate_for_frequency(5)(
                            program.reporting_period_start,
                            program.reporting_period_end)],
                    '6': [
                        [l10n_date_medium(period['start']),
                         l10n_date_medium(period['end']),
                         period['start'] > timezone.now().date(),
                         '',
                         '',
                         period['start'].isoformat(),
                         period['end'].isoformat(),
                        ]
                        for period in PeriodicTarget.generate_for_frequency(6)(
                            program.reporting_period_start,
                            program.reporting_period_end)],
                    '7': [
                        [l10n_date_medium(period['start']),
                         l10n_date_medium(period['end']),
                         l10n_monthname(period['start']),
                         period['start'].year,
                         period['start'] > timezone.now().date(),
                         period['start'].isoformat(),
                         period['end'].isoformat()]
                        for period in PeriodicTarget.generate_for_frequency(7)(
                            program.reporting_period_start,
                            program.reporting_period_end)],
                }
            })
    return programs


def get_iptt_indicator(program_id, frequency, indicator_pk, tva=False):
    program_data = IPTTProgramSerializer(
        Program.objects.get(pk=program_id)
        ).data
    frequency = int(frequency)
    indicator_qs = IPTTIndicator.tva if tva else IPTTIndicator.timeperiods
    indicator_qs = indicator_qs.filter(
        pk=indicator_pk
    )
    return process_iptt_data(program_data, frequency, indicator_qs, tva)

def get_iptt_program(program_id, frequency, tva=False):
    frequency = int(frequency)
    program_data = IPTTProgramSerializer(
        Program.objects.get(pk=program_id)
        ).data
    if tva:
        indicator_qs = IPTTIndicator.tva.filter(program_id=program_id, target_frequency=frequency)
    else:
        indicator_qs = IPTTIndicator.timeperiods.filter(program_id=program_id)
    return process_iptt_data(program_data, frequency, indicator_qs, tva)


def process_iptt_data(program_data, frequency, indicator_qs, tva):
    indicator_qs = indicator_qs.with_frequency_annotations(
        frequency, program_data['reporting_period_start'], program_data['reporting_period_end'])
    level_data = []
    if program_data['results_framework']:
        results_framework = True
        levels = Level.objects.filter(program_id=program_data['pk'])
        for level in levels:
            level_item = {
                'pk': level.pk,
                'name': level.name,
                'tier': ugettext(level.leveltier.name) if level.leveltier else None,
                'tierPk': level.leveltier.pk if level.leveltier else None,
                'ontology': level.display_ontology,
                'sort_ontology': level.ontology,
                'parent': level.parent.pk if level.parent else None,
                'depth': level.get_level_depth(),
                'sort': level.customsort
                }
            if level_item['depth'] > 2:
                target = level
                while target.get_level_depth() > 2:
                    target = target.parent
                level_item['level2parent'] = target.pk
            else:
                level_item['level2parent'] = None
            level_data.append(level_item)
    else:
        results_framework = False
        levels = Indicator.objects.filter(
            program_id=program_data['pk']
            ).order_by('old_level').values('old_level').distinct()
        old_id_lookup = {name: old_pk for (old_pk, name) in Indicator.OLD_LEVELS}
        new_id = 7
        for level in levels:
            pk = old_id_lookup.get(level['old_level'], None)
            if pk is None:
                pk = new_id
                new_id += 1
            level_data.append({
                'pk': pk,
                'name': level['old_level'],
                'display_name': ugettext(level['old_level']) if level['old_level'] else '',
                'sort': pk
            })
    return indicator_qs, level_data, results_framework

def indicators_to_iptt(indicator_qs, frequency, tva, results_framework, program_id):
    indicators = []
    for sort_index, indicator in enumerate(indicator_qs):
        indicator_data = {
            'pk': indicator.pk,
            'sortIndex': sort_index,
            'number': (
                (u'{}:'.format(indicator.number_display) if indicator.number_display else None)
                if results_framework else indicator.number
            ),
            'old_number': indicator.number,
            'name': indicator.name,
            'sites': indicator.sites,
            'indicatorTypes': indicator.indicator_types,
            'sector': {'pk': indicator.sector.pk, 'name': indicator.sector.sector} if indicator.sector else {},
            'frequency': indicator.target_frequency,
            'directionOfChange': indicator.get_direction_of_change,
            'unitOfMeasure': indicator.unit_of_measure,
            'is_cumulative': indicator.is_cumulative if indicator.target_frequency != Indicator.LOP else None,
            'unitType': indicator.get_unit_of_measure_type,
            'baseline': indicator.baseline,
            'baseline_na': indicator.baseline_na,
            'lopTarget': indicator.lop_target_real,
            'lopActual': indicator.lop_actual,
            'lopMet': indicator.lop_percent_met,
            'reportData': {}
        }
        if results_framework:
            indicator_data['level'] = ugettext(indicator.leveltier_name) if indicator.leveltier_name else None
            indicator_data['tierDepth'] = indicator.leveltier_depth
            indicator_data['levelpk'] = indicator.level.pk if indicator.level else None
            indicator_data['levelOrder'] = indicator.level_order_display
        else:
            indicator_data['level'] = indicator.old_level
            indicator_data['levelpk'] = {name: pk for (pk, name) in Indicator.OLD_LEVELS}.get(indicator.old_level)

        if frequency != Indicator.LOP:
            values_count = getattr(indicator, 'frequency_{0}_count'.format(frequency))
            if tva:
                indicator_data['reportData']['tva'] = {
                    frequency: [
                        {'target': getattr(indicator, 'frequency_{0}_period_{1}_target'.format(frequency, c)),
                         'value': getattr(indicator, 'frequency_{0}_period_{1}'.format(frequency, c))}
                        for c in range(values_count)
                    ]
                }
            else:
                indicator_data['reportData']['timeperiods'] = {
                    frequency: [
                        getattr(indicator, 'frequency_{0}_period_{1}'.format(frequency, c))
                        for c in range(values_count)]
                }
        indicators.append(indicator_data)
    reportData = {
        'reportFrequency': frequency,
        'reportType': 1 if tva else 2,
        'indicators': indicators,
        'programId': program_id
    }
    if results_framework:
        second_leveltier = LevelTier.objects.filter(program_id=program_id, tier_depth=2)
        if second_leveltier.exists():
            second_tier_name = second_leveltier.first().name
        else:
            second_tier_name = ugettext('Outcome')
        # Translators: This is a filtering option that allows users to select which Level Tier (hierarchy of levels) they want to look at.
        reportData['resultChainFilter'] = ugettext('by %(tier)s chain') % {'tier': second_tier_name}
        # Translators: This is a filtering option that allows users to select which Level Tier (hierarchy of levels) they want to look at.
        reportData['resultChainHeader'] = ugettext('%(tier)s chains') % {'tier': second_tier_name}
    return reportData


class IPTTQuickstart(LoginRequiredMixin, TemplateView):
    template_name = 'indicators/iptt_quickstart.html'

    def get(self, request, *args, **kwargs):
        programs_data = IPTTQSProgramSerializer.load_for_user(request.user)
        js_context = {
            #'programs': get_program_filter_data(request),
            'programs': programs_data.data,
            'iptt_url': '/indicators/iptt_report/',
            'initial_selected_program_id': request.GET.get('program_id'),
        }
        return self.render_to_response({'js_context': js_context})


class IPTTReport(LoginRequiredMixin, TemplateView):
    template_name = 'indicators/iptt_report.html'

    def get(self, request, *args, **kwargs):
        tva = kwargs.get('reporttype') == 'targetperiods'
        program_id = kwargs.get('program')
        frequency = request.GET.get('frequency')
        js_context = {
            'programs': get_program_filter_data(request),
            'api_url': reverse('iptt_ajax'),
            'pin_url': reverse('create_pinned_report')
        }
        return self.render_to_response({'js_context': js_context})


class IPTTReportData(LoginRequiredMixin, View):
    tva = False
    results_framework = True
    frequency = Indicator.LOP

    def get_context_data(self, request):        
        if self.update:
            indicator_qs, level_data, self.results_framework = get_iptt_indicator(
                self.program_id, self.frequency, self.indicator_id, self.tva
            )
        else:
            indicator_qs, level_data, self.results_framework = get_iptt_program(
                self.program_id, self.frequency, self.tva
            )
        reportData = indicators_to_iptt(
            indicator_qs, self.frequency, self.tva, self.results_framework, self.program_id
        )
        if self.update and reportData['indicators']:
            reportData['indicator'] = reportData['indicators'][0]
            reportData['update'] = True
        reportData['levels'] = level_data
        return reportData


    def get(self, request):
        self.program_id = int(request.GET.get('programId'))
        self.tva = request.GET.get('reportType') == '1'
        self.frequency = int(request.GET.get('frequency'))
        if request.GET.get('updateIndicator') == '1':
            self.indicator_id = int(request.GET.get('indicatorId'))
            self.update = True
        else:
            self.update = False            
        reportData = self.get_context_data(request)
        return JsonResponse(reportData)


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
        serialized = self.get_serialized_data(request)
        return serialized.render(request)
