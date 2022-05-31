"""Serializers which fetch, consolidate, and serialize data for an IPTT report to be consumed by an excel renderer"""

import operator
from collections import defaultdict
import dateutil.parser
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers
from indicators.models import (
    Indicator,
    PeriodicTarget,
    Result,
    DisaggregationType,
    DisaggregationLabel,
    DisaggregatedValue,
    Level,
    LevelTier,
)
from indicators.serializers_new import (
    IPTTExcelIndicatorSerializer,
    IPTTExcelTPReportIndicatorSerializer,
    IPTTExcelTVAReportIndicatorSerializer
)
from workflow.serializers_new.iptt_program_serializers import IPTTExcelProgramSerializer
from workflow.serializers_new.period_serializers import IPTTExcelPeriod
from tola.l10n_utils import l10n_date_medium


class IPTTReport:
    """Dummy object to provide a serializable object with IPTT Report qualities (title, name, etc.)"""
    def __init__(self, context):
        self.report_title = _('Indicator Performance Tracking Report')
        self.program_name = context['program']['name']
        self.results_framework = context['program']['results_framework']
        self.frequencies = context['frequencies']
        self.lop_period = IPTTExcelPeriod.lop_period()
        self.reporting_period_start_display = l10n_date_medium(
            dateutil.parser.isoparse(context['program']['reporting_period_start_iso']).date(),
            decode=True)
        self.reporting_period_end_display = l10n_date_medium(
            dateutil.parser.isoparse(context['program']['reporting_period_end_iso']).date(),
            decode=True)


class IPTTReportSerializer(serializers.Serializer):
    """Serializer for an entire IPTT Report - contains report-level data and methods to instance sub-serializers

        Is meant to be abstract and overridden for TP/TvA/Full TvA use cases
        Currently only used by Excel exports (JSON serialization is handled by
            workflow.serializers_new.iptt_program_serializers and
            indicators.serializers_new.iptt_indicator_serializers &c. to allow portions of the Reactive IPTT
            to be updated individually.  These globular singular serializers for an entire (up to Full TvA) report
            are for excel only)
    """

    report_title = serializers.CharField()
    program_name = serializers.CharField()
    results_framework = serializers.BooleanField()
    report_date_range = serializers.SerializerMethodField()
    frequencies = serializers.ListField(child=serializers.IntegerField())
    lop_period = serializers.SerializerMethodField()
    periods = serializers.SerializerMethodField()
    level_rows = serializers.SerializerMethodField()

    class Meta:
        purpose = "IPTTReport"
        fields = [
            'report_title',
            'program_name',
            'report_date_range',
            'frequencies',
            'lop_period',
            'periods',
            'level_rows',
        ]

    # class methods to instantiate serializer with minimal queries:

    @classmethod
    def get_context(cls, program_pk, frequencies, **kwargs):
        """Loads context for all included serializers for one IPTT report with no additional queries"""
        if isinstance(frequencies, int):
            frequencies = [frequencies]
        filters = kwargs.get('filters', {})
        # base serializer context:
        context = cls._get_serializer_context(program_pk, frequencies, filters)
        # level and tier objects:
        context.update(cls._get_rf_context(context))
        # program data (and data required for context fields):
        context.update(cls._get_program_context(context))
        # filter data:
        context.update(cls._get_filter_context(context))
        # disaggregation context data, needed for indicators and report data:
        context.update(cls._get_disaggregation_context(context))
        # indicator label data (filters, names, numbers):
        context['indicators'] = IPTTExcelIndicatorSerializer.load_filtered(context).data
        # report data (quantitative data for indicator for this report type and frequency):
        context['report_data'] = cls.load_report_data(context)
        return context

    @classmethod
    def _get_serializer_context(cls, program_pk, frequencies, filters):
        """Portion of the context (fetched objects to simplify serialization) related to the whole report"""
        frequencies = [int(frequency) for frequency in frequencies]
        time_aware_frequencies = list(set(frequencies) & set(Indicator.REGULAR_TARGET_FREQUENCIES))
        return {
            'program_pk': program_pk,
            'frequencies': sorted(frequencies),
            'time_aware_frequencies': sorted(time_aware_frequencies),
            'filters': filters,
            'is_tva': cls.is_tva,
            'is_tva_full': cls.full_tva,
        }

    @staticmethod
    def _get_rf_context(context):
        """Portion of the context (fetched objects to simplify serialization) related to the Resuls Framework

            (for some reason it's model objects and not serialized objects, I can't remember why - cameron)
        """
        return {
            'levels': list(Level.objects.select_related(None).only(
                'pk', 'name', 'parent_id', 'customsort', 'program_id'
                ).filter(program_id=context['program_pk'])),
            'tiers': list(LevelTier.objects.select_related(None).only(
                'pk', 'name', 'program_id', 'tier_depth'
                ).filter(program_id=context['program_pk'])),
        }

    @staticmethod
    def _get_program_context(context):
        """Loads the serialized Program object directly into the context for use by other nested serializers"""
        program_context = {
            'tier_objects': context.get('tiers', []),
            'level_objects': context.get('levels', []),
            'level_order': context.get('filters', {}).get('groupby', None) == 2,
        }
        return {
            'program': IPTTExcelProgramSerializer.load_for_pk(context['program_pk'], context=program_context).data,
        }

    @staticmethod
    def _get_filter_context(context):
        """Portion of the context (fetched objects to simplify serialization) containing filters from the request"""
        filters = context.get('filters')
        if not filters or not isinstance(filters, dict):
            return {}
        start = filters.get('start', None)
        end = filters.get('end', None)
        filter_context = {}
        if start is not None and not context.get('is_tva_full') and context.get('time_aware_frequencies'):
            filter_context['start'] = start
        if end is not None and not context.get('is_tva_full') and context.get('time_aware_frequencies'):
            filter_context['end'] = end + 1
        return filter_context

    @staticmethod
    def _get_disaggregation_context(context):
        """Returns three dicts mapping indicators, disaggregations and labels

        Argument:
            {'program_pk': program_pk:int,
            'filters' (optional): {'disaggregations': [list of pks to include, filtering others out]}
            }
        Returns:
            {
                'disaggregations': {disaggregation_type_pk: {'disaggregation': name, 'labels': [label obj...]}},
                'disaggregations_indicators':
                    {indicator_pk: {'all': [all disaggregation_type pks for this indicator...],
                                    'has_results': [disaggregation_type pks with results for this indicator...]}}
                'labels_indicators_map': {indicator_pk: [all label pks for this indicator...]}
            }
        """
        disaggregations_map = {}
        disaggregations_indicators = defaultdict(
            lambda: {'all': [], 'with_results': []}
        )
        labels_indicators = defaultdict(list)
        disaggregation_type_filters = {
            'indicator__program_id': context['program_pk'],
            'indicator__pk__isnull': False
        }
        disaggregation_label_filters = {
            'disaggregation_type__indicator__program_id': context['program_pk']
        }
        if 'filters' in context and context['filters'] and 'disaggregations' in context['filters']:
            disaggregation_pks = list(map(int, context['filters']['disaggregations']))
            disaggregation_type_filters['pk__in'] = disaggregation_pks
            disaggregation_label_filters['disaggregation_type__pk__in'] = disaggregation_pks
        for label in DisaggregationLabel.objects.select_related('disaggregation_type').prefetch_related(None).filter(
                **disaggregation_label_filters
            ).distinct():
            if label.disaggregation_type.pk not in disaggregations_map:
                disaggregations_map[label.disaggregation_type.pk] = {'disaggregation': label.disaggregation_type,
                                                                     'labels': []}
            disaggregations_map[label.disaggregation_type.pk]['labels'].append(label)
        for d_i in DisaggregationType.objects.select_related(None).prefetch_related(None).filter(
                **disaggregation_type_filters
            ).values('pk', 'indicator__pk').annotate(has_results=models.Exists(
                DisaggregatedValue.objects.select_related(None).prefetch_related(None).filter(
                    category_id__disaggregation_type_id=models.OuterRef('pk'),
                    result__indicator_id=models.OuterRef('indicator__pk'),
                    value__isnull=False
                ))):
            if d_i['has_results'] or not context.get('filters', {}).get('hide_empty_disagg_categories', False):
                disaggregations_indicators[d_i['indicator__pk']]['all'].append(d_i['pk'])
                label_pks = [label.pk for label in disaggregations_map.get(d_i['pk'], {}).get('labels', [])]
                labels_indicators[d_i['indicator__pk']] += label_pks
                if d_i['has_results']:
                    disaggregations_indicators[d_i['indicator__pk']]['with_results'].append(d_i['pk'])
        return {
            'disaggregations': disaggregations_map,
            'disaggregations_indicators': disaggregations_indicators,
            'labels_indicators_map': labels_indicators
        }

    @classmethod
    def load_report_data(cls, context):
        """Portion of context containing indicator x frequency report data, serialized"""
        report_data_contexts = cls._report_data_context(context)
        filters = {'pk__in': [indicator['pk'] for indicator in context['indicators']]}
        report_indicators = list(
            Indicator.rf_aware_objects.select_related(None).prefetch_related(None).only(
                'pk', 'program_id', 'target_frequency', 'unit_of_measure_type',
                'is_cumulative', 'level_id', 'lop_target', 'direction_of_change').filter(**filters).order_by().distinct()
            )
        report_data = {}
        for frequency in context['frequencies']:
            report_context = report_data_contexts[frequency]
            indicators = list(report_indicators)
            if cls.is_tva:
                indicators = [indicator for indicator in indicators if indicator.target_frequency == frequency]
            data = cls.report_serializer(indicators, context=report_context, many=True).data
            report_data[frequency] = {report['pk']: report for report in data}
        return report_data

    @staticmethod
    def _report_data_context(context):
        """Loads frequency-specific context information for each frequency in the report"""
        filters = context.get('filters', {})
        reporting_period = (
            dateutil.parser.isoparse(context['program']['reporting_period_start_iso']).date(),
            dateutil.parser.isoparse(context['program']['reporting_period_end_iso']).date()
        )
        report_context = {'coerce_to_string': False}
        result_map = defaultdict(list)
        for result in Result.objects.select_related('periodic_target').prefetch_related(None).filter(
                indicator__program_id=context['program']['pk']
            ).order_by('indicator_id').prefetch_related(
                models.Prefetch(
                    'disaggregatedvalue_set',
                    queryset=DisaggregatedValue.objects.select_related(None).prefetch_related(None).filter(
                        **{'value__isnull': False,
                           **({'category__disaggregation_type__id__in': filters.get('disaggregations')}
                              if 'disaggregations' in filters else {}),}).only('result_id', 'category_id', 'value'),
                    to_attr='prefetch_disaggregated_values'
                )
            ):
            result_map[result.indicator_id].append(result)
        targets_map = defaultdict(list)
        for target in PeriodicTarget.objects.select_related(None).prefetch_related(None).filter(
                indicator__program_id=context['program']['pk']
            ).only('indicator_id', 'pk', 'customsort', 'target'):
            targets_map[target.indicator_id].append(target)
        for frequency in context['frequencies']:
            frequency_context = {
                'frequency': frequency,
                'labels_indicators_map': context['labels_indicators_map']
            }
            periods = (list(PeriodicTarget.generate_for_frequency(frequency)(*reporting_period))
                       if frequency != Indicator.LOP else [])
            end_period = (filters['end'] + 1) if (filters.get('end') is not None) else len(periods)
            frequency_context['periods'] = periods[filters.get('start', 0):end_period]
            frequency_context['results'] = result_map
            frequency_context['targets'] = targets_map
            report_context[frequency] = frequency_context
        return report_context

    # helper methods for serializer method fields / renderer use:

    @property
    def filename(self):
        return f"{self.report_name} {l10n_date_medium(timezone.localtime().date(), decode=True)}.xlsx"

    @property
    def reporting_periods(self):
        return (
            dateutil.parser.isoparse(self.context['program']['reporting_period_start_iso']).date(),
            dateutil.parser.isoparse(self.context['program']['reporting_period_end_iso']).date()
        )

    def _get_frequency_periods(self, frequency):
        """Returns all periods serialized as period headers for a given frequency"""
        periods = [IPTTExcelPeriod(frequency, period_dict, tva=self.is_tva)
                   for period_dict in PeriodicTarget.generate_for_frequency(frequency)(*self.reporting_periods)]
        if self.full_tva:
            return periods
        start = self.context.get('start', 0)
        end = self.context.get('end', len(periods))
        return periods[start:end]

    def _fetch_frequency_indicators(self, frequency, level_pk=None):
        """Returns all indicators for a given frequency and level"""
        if level_pk is None:
            return [indicator for indicator in self.context['indicators']
                    if indicator['no_rf_level'] and indicator['target_frequency'] == frequency]
        return [indicator for indicator in self.context['indicators']
                if (indicator['level_pk'] == level_pk and indicator['target_frequency'] == frequency
                    and not indicator['no_rf_level'])]

    def _get_frequency_indicators(self, frequency, level_pk=None):
        """sorts and returns indicators for a given frequency and level"""
        if not self.context['program']['results_framework']:
            if level_pk is None:
                indicators = self._fetch_frequency_indicators(frequency, level_pk=None)
                return sorted(
                    sorted(indicators, key=lambda i: (i['level_pk'] is None, i['level_pk'])),
                    key=lambda i: (i['level_order'] is None, i['level_order']))
            return []
        indicators = self._fetch_frequency_indicators(frequency, level_pk=level_pk)
        return sorted(indicators, key=operator.itemgetter('level_order'))

    def _get_level_rows_for_frequency(self, frequency):
        """Returns serialized level rows with indicator/report data for a given frequency"""
        has_levels = False
        goal_level = None
        has_indicators = False
        frequency_report_data = self.context.get('report_data', {}).get(frequency, {})
        for level_data in (self.context['program']['levels'] if self.context['program']['results_framework'] else []):
            indicators = self._get_frequency_indicators(frequency, level_pk=level_data['pk'])
            if indicators:
                has_indicators = True
                if goal_level:
                    yield goal_level
                    goal_level = None
                indicators = map(lambda i: {**i, **{'report_data': frequency_report_data.get(i['pk'])}}, indicators)
                yield {
                    'level': level_data,
                    'indicators': indicators
                }
                has_levels = True
            elif level_data['tier_depth'] == 1:
                goal_level = {
                    'level': level_data,
                    'indicators': indicators
                }
        indicators = self._get_frequency_indicators(frequency, level_pk=None)
        if indicators:
            has_indicators = True
            indicators = map(lambda i: {**i, **{'report_data': frequency_report_data.get(i['pk'])}}, indicators)
            if has_levels:
                yield {
                    'level': {
                        'full_name': _('Indicators unassigned to a results framework level'),
                        'pk': None
                    },
                    'indicators': indicators
                }
            else:
                yield {
                    'level': None,
                    'indicators': indicators
                }
        if not has_indicators:
            return

    # Serializer method fields:

    @staticmethod
    def get_lop_period(report):
        return report.lop_period

    def get_periods(self, report):
        frequencies = list(report.frequencies)
        periods = {}
        if Indicator.LOP in frequencies:
            frequencies = [f for f in frequencies if f is not Indicator.LOP]
            periods[Indicator.LOP] = []
        return {
            **periods,
            **{frequency: self._get_frequency_periods(frequency) for frequency in  frequencies}
        }

    def get_level_rows(self, report):
        return {
            frequency: self._get_level_rows_for_frequency(frequency)
            for frequency in report.frequencies
        }

    def get_report_date_range(self, report):
        start = report.reporting_period_start_display
        end = report.reporting_period_end_display
        if self.context.get('start') is not None:
            assert len(self.context.get('time_aware_frequencies')) == 1 # not a full report if has a start filter
            start = self._get_frequency_periods(self.context.get('time_aware_frequencies')[0])[0].start_display
        if self.context.get('end') is not None:
            assert len(self.context.get('time_aware_frequencies')) == 1 # not a full report if has an end filter
            end = self._get_frequency_periods(self.context.get('time_aware_frequencies')[0])[-1].end_display
        return f"{start} – {end}"


class IPTTTPReportSerializer(IPTTReportSerializer):
    """Implementation of base IPTT Report Serializer for Excel TP Exports"""

    is_tva = False
    full_tva = False
    report_serializer = IPTTExcelTPReportIndicatorSerializer

    @property
    def report_name(self):
        return _("IPTT Actuals only report")

    @classmethod
    def load_report(cls, program_pk, **kwargs):
        """Main entry point for producing a fully serialized report"""
        frequency = kwargs.get('frequency', Indicator.MONTHLY)
        filters = kwargs.get('filters', {})
        context = cls.get_context(program_pk, [frequency,], filters=filters)
        report = IPTTReport(context) # dummy object to provide a "serializable" object
        return cls(report, context=context)

    def _fetch_frequency_indicators(self, frequency, level_pk=None):
        if level_pk is None:
            return [indicator for indicator in self.context['indicators'] if indicator['no_rf_level']]
        return [indicator for indicator in self.context['indicators'] if (
            indicator['level_pk'] == level_pk and not indicator['no_rf_level'])]


class IPTTTVAReportSerializer(IPTTReportSerializer):
    is_tva = True
    full_tva = False
    report_serializer = IPTTExcelTVAReportIndicatorSerializer

    @property
    def report_name(self):
        return _("IPTT TvA report")

    @classmethod
    def load_report(cls, program_pk, **kwargs):
        """Main entry point for producing a fully serialized report"""
        frequency = kwargs.get('frequency', Indicator.LOP)
        filters = kwargs.get('filters', {})
        context = cls.get_context(program_pk, [frequency,], filters=filters)
        report = IPTTReport(context) # dummy object to provide a "serializable" object
        return cls(report, context=context)


class IPTTFullReportSerializer(IPTTReportSerializer):
    is_tva = True
    full_tva = True
    report_serializer = IPTTExcelTVAReportIndicatorSerializer

    all_frequencies = [
        frequency for frequency, name in Indicator.TARGET_FREQUENCIES
        if frequency is not Indicator.EVENT # EVENT frequency is not currently IPTT export-able
    ]

    @property
    def report_name(self):
        return _("IPTT TvA full program report")

    @classmethod
    def load_report(cls, program_pk, **kwargs):
        """Main entry point for producing a fully serialized report"""
        filters = kwargs.get('filters', {})
        context = cls.get_context(program_pk, cls.all_frequencies, filters=filters)
        report = IPTTReport(context) # dummy object to provide a "serializable" object
        return cls(report, context=context)
