import operator
import decimal
from collections import defaultdict
from rest_framework import serializers
from indicators.models import (
    Indicator,
    PeriodicTarget,
    IndicatorType,
    Result,
    DisaggregationLabel,
    DisaggregationType,
    DisaggregatedValue,
)
from workflow.models import (
    Program,
    SiteProfile
)
from tola.model_utils import get_serializer
from tola.serializers import make_quantized_decimal, DecimalDisplayField
from django.db import models
from django.utils.translation import ugettext as _
from .disaggregation_serializers import IPTTDisaggregationSerializer
from .iptt_period_data_serializers import (
    TPReportPeriodSerializer,
    TVAReportPeriodSerializer,
)
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
        purpose = "JSONFilters"
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


class IPTTExcelIndicatorFiltersMixin:
    program_pk = serializers.IntegerField(source='program_id')
    number = serializers.SerializerMethodField(method_name='get_long_number')
    disaggregations = serializers.SerializerMethodField()
    no_rf_level = serializers.SerializerMethodField()

    class Meta:
        purpose = "ExcelLabels"
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
        disaggregation_labels = {}
        disaggregation_objects = []
        disagg_list = self.context['disaggregations_indicators'].get(indicator.pk, {})
        for disaggregation_dict in [
            self.context['disaggregations'][d_pk] for d_pk in disagg_list.get('all', [])
        ]:
            disaggregation_objects.append(disaggregation_dict['disaggregation'])
            disaggregation_labels[disaggregation_dict['disaggregation'].pk] = disaggregation_dict.get('labels', [])
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



class IPTTIndicatorReportBase:
    """Base Serializer class for producing report data for a given frequency and program"""
    lop_period = serializers.SerializerMethodField()
    periods = serializers.SerializerMethodField()
    _lop_period_serializer = TVAReportPeriodSerializer
    _period_serializer = TPReportPeriodSerializer

    class Meta:
        model = Indicator
        purpose = "IPTTReportData"
        fields = [
            'pk',
            'lop_period',
            'periods',
            'level_id',
        ]

    @classmethod
    def _get_query_fields(cls):
        return ['program_id', 'pk', 'unit_of_measure_type', 'is_cumulative', 'level_id']

    def _disaggregations_dict(self, values={}):
        """Makes a dict with a default that will avoid key errors and return None for any unfilled dvs
            method instead of function to allow for overriding when disaggregated targets happen"""
        return defaultdict(lambda: {'actual': None}, values)

    def _get_all_results(self, indicator):
        results = [result for result in self.context.get('results').get(indicator.pk, [])
                   if result.date_collected is not None]
        return sorted(results, key=operator.attrgetter('date_collected'))

    def _get_period_results(self, indicator, period_dict):
        past_results = [result for result in self._get_all_results(indicator)
                        if result.date_collected <= period_dict['end']]
        period_results = [result for result in past_results
                          if result.date_collected >= period_dict['start']]
        if period_results and any(result.achieved is not None for result in period_results):
            return past_results if indicator.is_cumulative else period_results
        else:
            return []

    def _get_results_totals(self, indicator, results):
        if not results:
            return (None, self._disaggregations_dict())
        if indicator.unit_of_measure_type == Indicator.PERCENTAGE:
            results = [result for result in results if result.achieved is not None][-1:]
        get_dv = lambda result, category_id: next(
            (dv.value for dv in result.prefetch_disaggregated_values if dv.category_id == category_id), None
        )
        def get_value_sum(values_list):
            clean_values = list(filter(None.__ne__, values_list))
            if not clean_values:
                return None
            return sum(clean_values)
        return (get_value_sum([result.achieved for result in results]),
                self._disaggregations_dict(
                    {category_pk: {'actual': get_value_sum([get_dv(result, category_pk) for result in results])}
                     for category_pk in self.context.get('labels_indicators_map').get(indicator.pk, [])
                     })
                )

    def get_period_context(self, indicator):
        return {
            'categories': self.context['labels_indicators_map'].get(indicator.pk, []),
            'coerce_to_string': self.context.get('coerce_to_string', False)
        }

    def get_lop_period(self, indicator):
        results = self._get_all_results(indicator)
        actual, disaggregations = self._get_results_totals(indicator, results)
        return self._lop_period_serializer.from_dict(
            {'target': indicator.lop_target_calculated,
             'actual': actual,
             'disaggregations': disaggregations},
            context=self.get_period_context(indicator)).data


    def _get_period(self, indicator, period_dict):
        results = self._get_period_results(indicator, period_dict)
        actual, disaggregations = self._get_results_totals(indicator, results)
        return {
            'count': period_dict.get('customsort', None),
            'actual': actual,
            'disaggregations': disaggregations
        }

    def get_periods(self, indicator):
        context = self.get_period_context(indicator)
        return [self._period_serializer.from_dict(self._get_period(indicator, period), context=context).data
                for period in self.context['periods']]


class IPTTJSONReportMixin:
    """Adapts report data serializer for creating a React-consumable output"""

    class Meta:
        purpose = "JSON"
        fields = [
            'program_id',
        ]

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
        context['coerce_to_string'] = True
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
        targets_map = defaultdict(list)
        for target in PeriodicTarget.objects.select_related(None).prefetch_related(None).filter(
            indicator__program_id=program_data.pk
        ).only('indicator_id', 'pk', 'customsort', 'target'):
            targets_map[target.indicator_id].append(target)
        context['targets'] = targets_map
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
    def load_report(cls, program_pk, frequency, excel=None):
        filters = cls.get_filters(program_pk, frequency)
        context = cls.get_context(program_pk, frequency, filters, excel=excel)
        queryset = cls.get_queryset(filters)
        return cls(queryset, context=context, many=True)


class IPTTTVAReportMixin:
    """Adds targets to periods in IPTTJSONReport"""
    _period_serializer = TVAReportPeriodSerializer

    class Meta:
        purpose = "TvA"

    @classmethod
    def get_filters(cls, program_pk, frequency):
        filters = super().get_filters(program_pk, frequency)
        filters['target_frequency'] = frequency
        return filters

    def _get_all_results(self, indicator):
        results = [result for result in self.context['results'].get(indicator.pk, [])
                   if result.periodic_target is not None]
        dateless = [result for result in results if result.date_collected is None]
        if dateless:
            results = [result for result in results if result.date_collected is not None]
        return dateless + sorted(results, key=operator.attrgetter('periodic_target.customsort', 'date_collected'))

    def _get_all_targets(self, indicator):
        return self.context['targets'].get(indicator.pk) or []

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


IPTTJSONTPReportIndicatorSerializer = get_serializer(
    IPTTJSONReportMixin,
    IPTTIndicatorReportBase
)

IPTTJSONTVAReportIndicatorSerializer = get_serializer(
    IPTTTVAReportMixin,
    IPTTJSONReportMixin,
    IPTTIndicatorReportBase
)


IPTTExcelTPReportIndicatorSerializer = get_serializer(
    IPTTIndicatorReportBase,
)


IPTTExcelTVAReportIndicatorSerializer = get_serializer(
    IPTTTVAReportMixin,
    IPTTIndicatorReportBase
)