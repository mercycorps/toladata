import operator
import decimal
from collections import defaultdict
from rest_framework import serializers
from indicators.models import (
    PeriodicTarget,
    IndicatorType,
    Result,
    DisaggregationLabel,
    DisaggregationType,
    DisaggregatedValue,
)
from indicators.models import Indicator
from workflow.models import (
    Program,
    SiteProfile
)
from tola.model_utils import get_serializer
from tola.serializers import make_quantized_decimal, DecimalDisplayField
from django.db import models
from django.utils.translation import ugettext as _
from .indicator_serializers import (
    IndicatorOrderingMixin,
    IndicatorMeasurementMixin,
    IndicatorBaseSerializerMixin
)

class IPTTIndicatorFiltersMixin:
    """ provides pks for filterable items for the web IPTT (sector, type, site, disaggregation)
    """

    sector_pk = serializers.IntegerField(source='sector_id')
    indicator_type_pks = serializers.SerializerMethodField()
    site_pks = serializers.SerializerMethodField()
    disaggregation_pks = serializers.SerializerMethodField()

    class Meta:
        fields = [
            'sector_pk',
            'indicator_type_pks',
            'site_pks',
            'disaggregation_pks',
        ]

    @classmethod
    def _get_query_fields(cls):
        return super()._get_query_fields() + [
            'sector_id'
        ]

    @classmethod
    def get_queryset(cls, **kwargs):
        qs = super().get_queryset(**kwargs)
        qs = qs.prefetch_related(
            models.Prefetch(
                'indicator_type',
                queryset=IndicatorType.objects.select_related(None).prefetch_related(None).only('pk'),
                to_attr='prefetch_indicator_type_pks'
            ),
            models.Prefetch(
                'result_set',
                queryset=Result.objects.select_related(None).prefetch_related(None).only(
                    'pk', 'indicator_id'
                ).prefetch_related(models.Prefetch(
                    'site', queryset=SiteProfile.objects.select_related(None).prefetch_related(None).only('pk'),
                    to_attr='prefetch_site_pks')), to_attr='prefetch_results'
            ),
            models.Prefetch(
                'disaggregation',
                queryset=DisaggregationType.objects.select_related(None).prefetch_related(None).only('pk'),
                to_attr='prefetch_disaggregation_pks'
            )
        )
        return qs

    def get_indicator_type_pks(self, indicator):
        return sorted(set(it.pk for it in indicator.prefetch_indicator_type_pks))

    def get_site_pks(self, indicator):
        return sorted(set(site.pk for result in indicator.prefetch_results for site in result.prefetch_site_pks))

    def get_disaggregation_pks(self, indicator):
        return sorted(set(disaggregation_type.pk for disaggregation_type in indicator.prefetch_disaggregation_pks))


# used in JSON endpoint for iPTT (react data) to provide labels, configuration, and filter items for indicators
IPTTJSONIndicatorLabelsSerializer = get_serializer(
    IPTTIndicatorFiltersMixin,
    IndicatorOrderingMixin,
    IndicatorMeasurementMixin,
    IndicatorBaseSerializerMixin
)

# EXCEL export specific serializers:


class DisaggregationBase:
    name = serializers.CharField(source='disaggregation_type')
    labels = serializers.SerializerMethodField()

    class Meta:
        model = DisaggregationType
        fields = [
            'pk',
            'name',
            'labels',
        ]

    def get_labels(self, disagg):
        labels = self.context.get('labels_map', {}).get(disagg.pk, None)
        if labels is None:
            raise NotImplementedError("no prefetch disaggs")
        return [{'pk': label.pk, 'name': label.label} for label in labels]

class IPTTDisaggregationMixin:
    has_results = serializers.SerializerMethodField()

    class Meta:
        fields = [
            'has_results',
        ]

    def get_has_results(self, disagg):
        if disagg.pk in self.context.get('with_results', []):
            return True
        return False

IPTTDisaggregationSerializer = get_serializer(
    IPTTDisaggregationMixin,
    DisaggregationBase,
)


class IPTTExcelIndicatorFiltersMixin:
    program_pk = serializers.IntegerField(source='program_id')
    number = serializers.SerializerMethodField(method_name='get_long_number')
    disaggregations = serializers.SerializerMethodField()
    no_rf_level = serializers.SerializerMethodField()

    class Meta:
        fields = [
            'program_pk',
            'number',
            'is_cumulative_display',
            'disaggregations',
            'no_rf_level',
        ]

    def _get_rf_long_number(self, indicator):
        level_set = self.context.get('levels', indicator.program.levels.all())
        level = [l for l in level_set if l.pk == indicator.level_id]
        if not level:
            return None
        level_depth, display_ontology = self._get_level_depth_ontology(level[0], level_set)
        leveltier = [t for t in self.context.get(
            'tiers', indicator.program.level_tiers.all()
            ) if t.tier_depth == level_depth]
        if not leveltier:
            leveltier_name = u''
        else:
            leveltier_name = u'{} '.format(_(leveltier[0].name))
        return u"{}{}{}".format(
            leveltier_name, display_ontology, self._get_level_order_display(indicator)
        )

    def get_disaggregations(self, indicator):
        disaggregation_map = self.context.get('disaggregations')
        disaggregation_labels = {}
        disaggregation_objects = []
        disagg_list = self.context.get('disaggregations_indicators').get(indicator.pk, {})
        for disaggregation_dict in [
            disaggregation_map.get(d_pk) for d_pk in disagg_list.get('all', [])
        ]:
            disaggregation = disaggregation_dict.get('disaggregation', None)
            labels = disaggregation_dict.get('labels', [])
            disaggregation_objects.append(disaggregation)
            disaggregation_labels[disaggregation.pk] = labels
        disaggregation_context = {
            **self.context.get('disaggregation_context', {}),
            'labels_map': disaggregation_labels,
            'with_results': disagg_list.get('with_results', []),
        }
        return sorted(
            IPTTDisaggregationSerializer(
                disaggregation_objects, context=disaggregation_context, many=True
                ).data,
            key=operator.itemgetter('name')
        )


    def get_no_rf_level(self, indicator):
        return (not indicator.results_framework or not indicator.level_id)


IPTTExcelIndicatorSerializer = get_serializer(
    IPTTExcelIndicatorFiltersMixin,
    IndicatorOrderingMixin,
    IndicatorMeasurementMixin,
    IndicatorBaseSerializerMixin
)

class TPReportPeriodSerializer(serializers.Serializer):
    met = DecimalDisplayField(multiplier=100)
    actual = DecimalDisplayField()
    count = serializers.IntegerField(allow_null=True, default=None)
    disaggregations = serializers.SerializerMethodField()

    class PeriodObject:
        def __init__(self, period_dict):
            period_dict['count'] = period_dict.get('count', None)
            self.__dict__ = period_dict

    @classmethod
    def get_period_object(cls, period_dict):
        return cls.PeriodObject(period_dict)

    def _format_disagg(self, disaggregation):
        actual = disaggregation.pop('actual', None)
        try:
            actual = make_quantized_decimal(actual, coerce_to_string=True)
        except TypeError:
            pass
        return {
            'actual': actual
        }

    def get_disaggregations(self, period):
        return {label_pk: self._format_disagg(period.disaggregations[label_pk])
                for label_pk in self.context.get('categories', [])}


class TVAReportPeriodSerializer(TPReportPeriodSerializer):
    target = DecimalDisplayField()

    class PeriodObject:
        def __init__(self, period_dict):
            period_dict['count'] = period_dict.get('count', None)
            target = period_dict.get('target', None)
            actual = period_dict.get('actual', None)
            period_dict['met'] = None
            if target is not None and actual is not None and target != 0:
                try:
                    period_dict['met'] = make_quantized_decimal(
                        make_quantized_decimal(actual) / make_quantized_decimal(target), places=4
                    )
                except TypeError:
                    pass
            self.__dict__ = period_dict


class IPTTIndicatorReportBase:
    """Base Serializer class for producing report data for a given frequency and program"""
    lop_period = serializers.SerializerMethodField()
    periods = serializers.SerializerMethodField()
    _lop_period_serializer = TVAReportPeriodSerializer
    _period_serializer = TPReportPeriodSerializer

    class Meta:
        model = Indicator
        fields = [
            'pk',
            'lop_period',
            'periods',
        ]

    @classmethod
    def _get_query_fields(cls):
        return ['program_id', 'pk', 'unit_of_measure_type', 'is_cumulative']

    def _disaggregations_dict(self, values={}):
        """Makes a dict with a default that will avoid key errors and return None for any unfilled dvs
            method instead of function to allow for overriding when disaggregated targets happen"""
        return defaultdict(lambda: {'actual': None}, values)

    def _get_all_results(self, indicator):
        results = [result for result in self.context.get('results').get(indicator.pk, [])
                   if result.date_collected is not None]
        return sorted(results, key=operator.attrgetter('date_collected'))

    def _get_results_totals(self, indicator, results):
        if not results:
            return (None, self._disaggregations_dict())
        get_dv = lambda result, category_id: next(
            (dv.value for dv in result.prefetch_disaggregated_values if dv.category_id == category_id), None
        )
        def get_value_sum(values_list):
            clean_values = list(filter(None.__ne__, values_list))
            if not clean_values:
                return None
            if indicator.unit_of_measure_type == Indicator.PERCENTAGE:
                return clean_values[-1]
            return sum(clean_values)
        return (get_value_sum([result.achieved for result in results]),
                self._disaggregations_dict(
                    {category_pk: {'actual': get_value_sum([get_dv(result, category_pk) for result in results])}
                     for category_pk in self.context.get('labels_indicators_map').get(indicator.pk, [])
                     })
                )

    def get_lop_period(self, indicator):
        results = self._get_all_results(indicator)
        actual, disaggregations = self._get_results_totals(indicator, results)
        period_serialized = self._lop_period_serializer(
            self._lop_period_serializer.get_period_object(
                {'target': indicator.lop_target_calculated,
                 'actual': actual,
                 'disaggregations': disaggregations}),
            context={'categories': self.context.get('labels_indicators_map').get(indicator.pk, [])}).data
        return period_serialized

    def get_periods(self, indicator):
        return [self._get_period(indicator, period) for period in self.context.get('periods')]


class IPTTJSONReportMixin:
    """Adapts report data serializer for creating a React-consumable output"""

    class Meta:
        fields = [
            'program_id',
        ]

    @classmethod
    def _get_query_fields(cls):
        return super()._get_query_fields()

    @classmethod
    def get_filters(cls, program_pk, frequency):
        filters = {'program_id': program_pk}
        return filters

    @classmethod
    def get_context(cls, program_pk, frequency, filters, **kwargs):
        program_data = Program.rf_aware_objects.select_related(None).prefetch_related(None).only(
            'pk', 'reporting_period_start', 'reporting_period_end'
        ).get(pk=program_pk)
        context = {}
        context['program_pk'] = program_pk
        context['frequency'] = frequency
        if frequency == Indicator.LOP:
            context['periods'] = []
        else:
            context['periods'] = list(PeriodicTarget.generate_for_frequency(frequency)(
                program_data.reporting_period_start, program_data.reporting_period_end
                ))
        result_map = defaultdict(list)
        result_filters = {f"indicator__{key}": value for key, value in filters.items()}
        for result in Result.objects.select_related('periodic_target').prefetch_related(None).filter(
            **result_filters).order_by('indicator_id').prefetch_related(
            models.Prefetch(
                'disaggregatedvalue_set',
                queryset=DisaggregatedValue.objects.filter(value__isnull=False).select_related(None).only(
                    'result_id', 'category_id', 'value'),
            to_attr='prefetch_disaggregated_values')):
            result_map[result.indicator_id].append(result)
        context['results'] = result_map
        labels_indicators = defaultdict(list)
        for label in DisaggregationLabel.objects.select_related('disaggregation_type').prefetch_related(None).filter(
            disaggregation_type__indicator__program_id=program_pk
        ).values('pk', 'disaggregation_type__indicator__pk').distinct():
                labels_indicators[label['disaggregation_type__indicator__pk']].append(label['pk'])
        context['labels_indicators_map'] = labels_indicators
        return context

    @classmethod
    def get_queryset(cls, filters):
        return Indicator.rf_aware_objects.select_related(None).prefetch_related(None).only(
            *cls._get_query_fields()
        ).filter(**filters)

    @classmethod
    def load_report(cls, program_pk, frequency):
        filters = cls.get_filters(program_pk, frequency)
        context = cls.get_context(program_pk, frequency, filters)
        queryset = cls.get_queryset(filters)
        return cls(queryset, context=context, many=True)


IPTTJSONTPReportIndicatorSerializer = get_serializer(
    IPTTJSONReportMixin,
    IPTTIndicatorReportBase
)


class IPTTExcelReportMixin:
    """Adapts report data serializer for creating an Excel-renderer-consumable output"""

    class Meta:
        fields = [
            'level_id',
        ]

    def _get_period_results(self, indicator, period_dict):
        past_results = [result for result in self._get_all_results(indicator)
                        if result.date_collected <= period_dict['end']]
        period_results = [result for result in past_results
                          if result.date_collected >= period_dict['start']]
        if period_results and any(result.achieved is not None for result in period_results):
            return past_results if indicator.is_cumulative else period_results
        else:
            return []

    def _get_all_targets(self, indicator):
        return self.context.get('targets').get(indicator.pk) or []

    def _get_period(self, indicator, period_dict):
        results = self._get_period_results(indicator, period_dict)
        actual, disaggregations = self._get_results_totals(indicator, results)
        return {
            'count': period_dict.get('customsort', None),
            'actual': actual,
            'disaggregations': disaggregations
            
        }


class IPTTExcelTVAReportMixin:
    class Meta:
        pass

    def _get_all_results(self, indicator):
        results = [result for result in self.context.get('results').get(indicator.pk, [])
                   if result.periodic_target is not None]
        dateless = [result for result in results if result.date_collected is None]
        if dateless:
            results = [result for result in results if result.date_collected is not None]
        return dateless + sorted(results, key=operator.attrgetter('periodic_target.customsort', 'date_collected'))

    def _get_period_results(self, indicator, period_dict):
        if indicator.target_frequency == Indicator.MID_END:
            midline_target = [target for target in self._get_all_targets(indicator) if target.customsort == 0][0]
            midline_results = [result for result in self._get_all_results(indicator)
                               if result.periodic_target_id == midline_target.pk and result.achieved is not None]
            if period_dict['customsort'] == 0:
                return midline_results
            else:
                endline_target = [target for target in self._get_all_targets(indicator) if target.customsort == 1][0]
                endline_results = [result for result in self._get_all_results(indicator)
                                   if result.periodic_target_id == endline_target.pk and result.achieved is not None]
                if not endline_results:
                    return []
                return midline_results + endline_results if indicator.is_cumulative else endline_results
        else:
            targets = sorted([target for target in self._get_all_targets(indicator)
                              if target.customsort <= period_dict['customsort']],
                            key=operator.attrgetter('customsort'))
            if not targets:
                return []
            period_target = targets[-1]
            if period_target.customsort != period_dict['customsort']:
                return []
            period_results = [result for result in self._get_all_results(indicator)
                              if (result.periodic_target == period_target and result.achieved is not None)]
            if not period_results:
                return []
            if not indicator.is_cumulative:
                return period_results
            else:
                return [result for result in self._get_all_results(indicator)
                                 if (result.periodic_target.pk in [t.pk for t in targets]
                                     and result.achieved is not None)]

    def _get_period(self, indicator, period_dict):
        period = super()._get_period(indicator, period_dict)
        targets = [
            target for target in self._get_all_targets(indicator) if target.customsort == period_dict['customsort']
        ]
        period['target'] = targets[0].target if targets else None
        if period['target'] and period['actual']:
            period['met'] = make_quantized_decimal(period['actual'] / period['target'], places=4)
        else:
            period['met'] = None
        return period


IPTTExcelTPReportIndicatorSerializer = get_serializer(
    IPTTExcelReportMixin,
    IPTTIndicatorReportBase,
)


IPTTExcelTVAReportIndicatorSerializer = get_serializer(
    IPTTExcelTVAReportMixin,
    IPTTExcelReportMixin,
    IPTTIndicatorReportBase
)