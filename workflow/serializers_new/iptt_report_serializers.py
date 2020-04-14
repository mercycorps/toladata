import dateutil.parser
from collections import defaultdict
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext as _
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
from .iptt_program_serializers import IPTTExcelProgramSerializer
from .period_serializers import IPTTExcelPeriod
from tola.l10n_utils import l10n_date_medium


class IPTTReportSerializer(serializers.Serializer):
    """Serializer for an entire IPTT Report - contains report-level data and methods to instance sub-serializers"""
    report_title = serializers.SerializerMethodField()
    program_name = serializers.SerializerMethodField()
    results_framework = serializers.SerializerMethodField()
    frequencies = serializers.SerializerMethodField()
    report_date_range = serializers.SerializerMethodField()
    lop_period = serializers.SerializerMethodField()
    periods = serializers.SerializerMethodField()
    level_rows = serializers.SerializerMethodField()

    class Meta:
        fields = [
            'report_title',
            'program_name',
            'report_date_range',
            'frequencies',
            'lop_period',
            'periods',
            'level_rows',
        ]
    
    @property
    def filename(self):
        return f"{self.report_name} {l10n_date_medium(timezone.localtime().date(), decode=True)}.xlsx"

    @classmethod
    def load_program_data(cls, program_pk, program_context={}):
        return IPTTExcelProgramSerializer.get_for_pk(program_pk, context=program_context)

    @classmethod
    def load_indicator_data(cls, indicator_context={}, indicator_filters={}):        
        indicators = Indicator.rf_aware_objects.select_related('program').prefetch_related(None).only(
            'pk', 'name', 'deleted', 'program_id', 'means_of_verification', 'level_id', 'level_order',
            'number', 'target_frequency', 'unit_of_measure', 'unit_of_measure_type', 'baseline', 'baseline_na',
            'direction_of_change', 'is_cumulative', 'key_performance_indicator', 'old_level',
            'create_date', 'sector_id'
        ).filter(**indicator_filters).order_by().distinct()
        return IPTTExcelIndicatorSerializer(indicators, context=indicator_context, many=True)

    @classmethod
    def load_report_indicators(cls, report_filters={}):
        return Indicator.rf_aware_objects.select_related(None).prefetch_related(None).only(
            'pk', 'target_frequency', 'unit_of_measure_type', 'is_cumulative', 'level_id', 'lop_target',
        ).filter(**report_filters).order_by().distinct()

    @classmethod
    def load_report_data(cls, report_context={}, report_filters={}, indicators=None):
        if indicators is None:
            indicators = cls.load_report_indicators(report_filters=report_filters)
        data = cls.report_serializer(indicators, context=report_context, many=True).data
        return {report['pk']: report for report in data}

    @classmethod
    def get_indicator_filters(cls, filters, program_pk=None, **kwargs):
        indicator_filters = {}
        if program_pk:
            indicator_filters['program'] = program_pk
        if filters.get('sectors', None):
            indicator_filters['sector__in'] = filters.get('sectors')
        if filters.get('types', None):
            indicator_filters['indicator_type__in'] = filters.get('types')
        if filters.get('indicators', None):
            indicator_filters['pk__in'] = filters.get('indicators')
        if filters.get('disaggregations', None):
            indicator_filters['disaggregation__in'] = filters.get('disaggregations')
        if filters.get('sites', None):
            indicator_filters['result__site__in'] = filters.get('sites')
        if filters.get('levels', None):
            indicator_filters['level__in'] = filters.get('levels')
        if filters.get('tiers', None):
            levels = kwargs.get('context').get('levels')
            filter_levels = []
            tier_depths = sorted(
                [tier.tier_depth for tier in kwargs.get('context').get('tiers') if tier.pk in filters.get('tiers')]
            )
            this_tier_levels = [level.pk for level in levels if not level.parent_id]
            depth = 1
            while this_tier_levels:
                if depth in tier_depths:
                    filter_levels += this_tier_levels
                child_levels = [level.pk for level in levels if level.parent_id in this_tier_levels]
                this_tier_levels = child_levels
                depth += 1
            indicator_filters['level__in'] = filter_levels
        return indicator_filters

    @classmethod
    def get_report_filters(cls, *args, **kwargs):
        if 'frequency' in kwargs:
            kwargs['frequencies'] = [kwargs.pop('frequency')]
        return cls.get_indicator_filters(*args, **kwargs)

    @classmethod
    def _disaggregations_context(cls, program_pk, filters={}):
        disaggregations_map = {}
        disaggregation_filters = list(map(int, filters.get('disaggregations', [])))
        disaggregations_indicators = defaultdict(
            lambda: {'all': [], 'with_results': []}
        )
        labels_indicators = defaultdict(list)
        disaggregation_label_filters = {
            'disaggregation_type__indicator__program_id': program_pk
        }
        if disaggregation_filters:
            disaggregation_label_filters['disaggregation_type__pk__in'] = disaggregation_filters
        for label in DisaggregationLabel.objects.select_related(
            'disaggregation_type'
        ).prefetch_related(None).filter(**disaggregation_label_filters).distinct():
            if label.disaggregation_type.pk not in disaggregations_map:
                disaggregations_map[label.disaggregation_type.pk] = {
                    'disaggregation': label.disaggregation_type,
                    'labels': []
                }
            disaggregations_map[label.disaggregation_type.pk]['labels'].append(label)
        disaggregation_type_filters = {
            'indicator__program_id': program_pk,
            'indicator__pk__isnull': False
        }
        if disaggregation_filters:
            disaggregation_type_filters['pk__in'] = disaggregation_filters
        for d_i in DisaggregationType.objects.select_related(None).prefetch_related(None).filter(
            **disaggregation_type_filters
        ).values('pk', 'indicator__pk').annotate(has_results=models.Exists(
            DisaggregatedValue.objects.select_related(None).prefetch_related(
                None
            ).filter(
                category_id__disaggregation_type_id=models.OuterRef('pk'),
                result__indicator_id=models.OuterRef('indicator__pk'),
                value__isnull=False
            )
        )):
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
    def _get_base_context(cls, program_pk):
        return {
            'levels': list(Level.objects.select_related(None).only(
                'pk', 'name', 'parent_id', 'customsort', 'program_id'
                ).filter(program_id=program_pk)),
            'tiers': list(LevelTier.objects.select_related(None).only(
                'pk', 'name', 'program_id', 'tier_depth'
                ).filter(program_id=program_pk)),
        }

    @classmethod
    def _report_data_context(cls, frequencies, program_data, filters={}):
        reporting_period = (
            dateutil.parser.isoparse(program_data['reporting_period_start_iso']).date(),
            dateutil.parser.isoparse(program_data['reporting_period_end_iso']).date()
        )
        report_context = {}
        result_map = defaultdict(list)
        for result in Result.objects.select_related(None).prefetch_related(None).filter(
            indicator__program_id=program_data['pk']
        ).only(
            'indicator_id', 'pk', 'date_collected', 'achieved'
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
            indicator__program_id=program_data['pk']
        ).only('indicator_id', 'pk', 'customsort', 'target'):
            targets_map[target.indicator_id].append(target)
        for frequency in frequencies:
            frequency_context = {'frequency': frequency}
            periods = (list(PeriodicTarget.generate_for_frequency(frequency)(*reporting_period))
                       if frequency != Indicator.LOP else [])
            end_period = (filters['end'] + 1) if 'end' in filters else len(periods)
            frequency_context['periods'] = periods[filters.get('start', 0):end_period]
            frequency_context['results'] = result_map
            frequency_context['targets'] = targets_map
            report_context[frequency] = frequency_context
        return report_context

    @classmethod
    def get_context(cls, program_pk, frequencies, filters={}):
        if type(frequencies) == int:
            frequencies = [frequencies]
        context = {}
        base_context = cls._get_base_context(program_pk)
        program_context = {**base_context}
        if filters.get('groupby', None) == 2:
            program_context['level_order'] = True
        context['program'] = cls.load_program_data(program_pk, program_context=program_context).data
        context['frequencies'] = [int(frequency) for frequency in frequencies]
        disaggregations_context = cls._disaggregations_context(program_pk, filters=filters)
        indicator_context = {
            **base_context,
            **disaggregations_context
        }
        indicator_filters = cls.get_indicator_filters(
            filters, program_pk, frequencies=frequencies, context=base_context
        )
        context['indicators'] = cls.load_indicator_data(
            indicator_context=indicator_context,
            indicator_filters=indicator_filters
        ).data
        report_data_contexts = cls._report_data_context(frequencies, context['program'], filters=filters)
        report_indicators = list(cls.load_report_indicators(report_filters=indicator_filters))
        context['report_data'] = {}
        for frequency in frequencies:
            report_context = {
                **report_data_contexts[frequency],
                **disaggregations_context
            }
            indicators = list(report_indicators)
            if cls.is_tva:
                indicators = list(filter(lambda indicator: indicator.target_frequency == frequency, indicators))
            context['report_data'][frequency] = cls.load_report_data(
                report_context=report_context, indicators=indicators
            )
        return context

    def get_report_title(self, obj):
        return _('Indicator Performance Tracking Report')

    def get_program_name(self, obj):
        return self.context['program']['name']

    def get_results_framework(self, obj):
        return self.context['program']['results_framework']

    def get_frequencies(self, obj):
        return sorted(self.context['frequencies'])

    @property
    def reporting_periods(self):
        return (
            dateutil.parser.isoparse(self.context['program']['reporting_period_start_iso']).date(),
            dateutil.parser.isoparse(self.context['program']['reporting_period_end_iso']).date()
        )

    def get_report_date_range(self, obj):
        return u'{} – {}'.format(
            l10n_date_medium(self.reporting_periods[0], decode=True),
            l10n_date_medium(self.reporting_periods[1], decode=True)
        )

    def get_lop_period(self, obj):
        return IPTTExcelPeriod.lop_period()

    def get_periods(self, obj):
        frequencies = self.context['frequencies']
        periods = {}
        if Indicator.LOP in frequencies:
            frequencies = [f for f in frequencies if f is not Indicator.LOP]
            periods[Indicator.LOP] = []
        return {
            **periods,
            **{frequency: [
                IPTTExcelPeriod(frequency, period_dict, tva=self.is_tva)
                for period_dict in PeriodicTarget.generate_for_frequency(frequency)(
                    *self.reporting_periods
                )] for frequency in  frequencies
            }
        }

    def _get_frequency_indicators(self, frequency, level_pk=None):
        return [indicator for indicator in self.context['indicators']
                if indicator['level_pk'] == level_pk and indicator['target_frequency'] == frequency]

    def _get_level_rows_for_frequency(self, frequency):
        has_levels = False
        goal_level = None
        has_indicators = False
        frequency_report_data = self.context.get('report_data', {}).get(frequency, {})
        for level in self.context['program']['levels']:
            indicators = self._get_frequency_indicators(frequency, level_pk=level.data['pk'])
            if indicators:
                has_indicators = True
                if goal_level:
                    yield goal_level
                    goal_level = None
                indicators = map(lambda i: {**i, **{'report_data': frequency_report_data.get(i['pk'])}}, indicators)
                yield {
                    'level': level.data,
                    'indicators': indicators
                }
                has_levels = True
            elif level.data['tier_depth'] == 1:
                goal_level = {
                    'level': level.data,
                    'indicators': indicators
                }
        indicators = self._get_frequency_indicators(frequency, level_pk=None)
        if indicators:
            has_indicators = True
            indicators = map(lambda i: {**i, **{'report_data': frequency_report_data.get(i['pk'])}}, indicators)
            if has_levels:
                yield {
                    'level': {
                        'name': _('Indicators unassigned to a results framework level'),
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
            self.context['frequencies'].remove(frequency)

    def get_level_rows(self, obj):
        return {
            frequency: self._get_level_rows_for_frequency(frequency)
            for frequency in self.context['frequencies']
        }


class IPTTTPReportSerializer(IPTTReportSerializer):
    is_tva = False
    report_serializer = IPTTExcelTPReportIndicatorSerializer

    @property
    def report_name(self):
        return _("IPTT Actuals only report")

    @classmethod
    def load_report(cls, program_pk, frequency=Indicator.MONTHLY, filters={}):
        context = cls.get_context(program_pk, [frequency,], filters=filters)
        return cls({}, context=context)

    def _get_frequency_indicators(self, frequency, level_pk=None):
        return [indicator for indicator in self.context['indicators'] if indicator['level_pk'] == level_pk]


class IPTTTVAReportSerializer(IPTTReportSerializer):
    is_tva = True
    report_serializer = IPTTExcelTVAReportIndicatorSerializer

    @property
    def report_name(self):
        return _("IPTT TvA report")

    @classmethod
    def load_report(cls, program_pk, frequency=Indicator.LOP, filters={}):
        context = cls.get_context(program_pk, [frequency,], filters=filters)
        return cls({}, context=context)

    @classmethod
    def get_indicator_filters(cls, filters, program_pk=None, **kwargs):
        indicator_filters = super().get_indicator_filters(filters, program_pk, **kwargs)
        if 'frequencies' in kwargs:
            indicator_filters['target_frequency__in'] = kwargs.get('frequencies')
        return indicator_filters


class IPTTFullReportSerializer(IPTTReportSerializer):
    is_tva = True
    report_serializer = IPTTExcelTVAReportIndicatorSerializer

    all_frequencies = [
        frequency for frequency, name in Indicator.TARGET_FREQUENCIES
        if frequency is not Indicator.EVENT
    ]

    @property
    def report_name(self):
        return _("IPTT TvA full program report")

    @classmethod
    def load_report(cls, program_pk, filters={}):
        context = cls.get_context(program_pk, cls.all_frequencies, filters=filters)
        return cls({}, context=context)

    @classmethod
    def get_indicator_filters(cls, filters, program_pk=None, **kwargs):
        indicator_filters = {}
        if program_pk:
            indicator_filters['program'] = program_pk
        return indicator_filters