"""Serializers for Indicator objects used on the IPTT (JSON-React App and Excel for downloads)

    Labels Serializers (Labels = indicator data for all reports i.e. name/number/filter data):
        IPTTJSONIndicatorLabelsSerializer - serializes labels (not report-specific) data for the IPTT (filters/labels)
            IPTTJSONIndicatorLabelsSerializer.load_for_program(program_pk:int)
                returns indicators with name/number/measurement data, ordering, and filter pks for applying filters
                    for React Web App
        IPTTExcelIndicatorSerializer - serializes labels (not-report specific) data for the iPTT Excel download Ex:
            IPTTExcelIndicatorSerializer(queryset, many=True).data
                returns indicators with name/number/measurement data for filling in qualitative columns in excel IPTT
    Report Data Serializers (Report data = result totals with targets/met as needed for a frequency and report type):
        IPTTJSONReportIndicatorSerializer
        IPTTJSONTVAReportIndicatorSerializer
        IPTTExcelTPReportIndicatorSerializer
        IPTTExcelTVAReportIndicatorSerializer
"""

import operator
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
from tola.serializers import make_quantized_decimal
from django.db import models
from django.utils.translation import ugettext as _
from .disaggregation_serializers import IPTTExcelDisaggregationSerializer
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
    """Indicator Serializer component which provides pks for filterable items for the web IPTT

        (sector, type, site, disaggregation)
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
        """additional fields required for this serializer to return data without querying database again"""
        return super()._get_query_fields() + [
            'sector_id'
        ]

    @classmethod
    def get_queryset(cls, **kwargs):
        """based on required fields and filters kwarg, returns queryset of indicators, typ0es, results, and disaggs

                uses the bare indicator queryset from parent, and prefetches additional models for iptt filtering
        """
        qs = super().get_queryset(**kwargs)
        qs = qs.prefetch_related(
            # avoiding extra queries, each indicator needs a list of indicator type pks (prefetch because 1:many)
            models.Prefetch(
                'indicator_type',
                queryset=IndicatorType.objects.select_related(None).prefetch_related(None).only('pk'),
                to_attr='prefetch_indicator_type_pks'
            ),
            # avoiding extra queries, each indicator needs a list of site pks (prefetch because 1:many:many)
            models.Prefetch(
                'result_set',
                queryset=Result.objects.select_related(None).prefetch_related(None).only(
                    'pk', 'indicator_id'
                ).prefetch_related(models.Prefetch(
                    'site', queryset=SiteProfile.objects.select_related(None).prefetch_related(None).only('pk'),
                    to_attr='prefetch_site_pks')), to_attr='prefetch_results'
            ),
            # avoiding extra queries, each indicator needs a list of disaggregation type pks (prefetch because 1:many)
            models.Prefetch(
                'disaggregation',
                queryset=DisaggregationType.objects.select_related(None).prefetch_related(None).only('pk'),
                to_attr='prefetch_disaggregation_pks'
            )
        )
        return qs

    @staticmethod
    def get_indicator_type_pks(indicator):
        """All indicator type pks assigned to this indicator (for filtering on indicator type)"""
        return sorted(set(it.pk for it in indicator.prefetch_indicator_type_pks))

    @staticmethod
    def get_site_pks(indicator):
        """All site pks assigned to any result assigned to this indicator (for filtering on site)"""
        return sorted(set(site.pk for result in indicator.prefetch_results for site in result.prefetch_site_pks))

    @staticmethod
    def get_disaggregation_pks(indicator):
        """All disaggregation type pks assigned to this indicator (for filtering on disaggregation type)"""
        return sorted(set(disaggregation_type.pk for disaggregation_type in indicator.prefetch_disaggregation_pks))


# used in JSON endpoint for iPTT (react data) to provide labels, configuration, and filter items for indicators
IPTTJSONIndicatorLabelsSerializer = get_serializer(
    IPTTIndicatorFiltersMixin,
    IndicatorOrderingMixin,
    IndicatorMeasurementMixin,
    IndicatorBaseSerializerMixin
)


class IPTTExcelIndicatorFiltersMixin:
    """Indicator Serializer component which adds label/filter information for Excel IPTT downloads"""
    program_pk = serializers.IntegerField(source='program_id')
    number = serializers.SerializerMethodField(method_name='get_long_number')
    disaggregations = serializers.SerializerMethodField()
    no_rf_level = serializers.SerializerMethodField()

    class Meta:
        purpose = "ExcelLabels"
        fields = [
            'program_pk',
            'number',
            'disaggregations',
            'no_rf_level',
        ]

    # class methods to aid in instantiating with minimal queries:

    @staticmethod
    def _get_queryset_filters(context):
        """Called by IPTTExcelIndicatorFiltersMixin.load_filtered

            Due to how Excel indicators are instantiated (filters in the context object), this translates
            context items to queryset filters that can be **spread into a queryset.filter call
        """
        levels = context.get('levels', []) # all levels in program (as serializer objects, for query filter validation)
        tiers = context.get('tiers', []) # all tiers in program (as serializer objects, for query filter validation)
        filters = context.get('filters', {})
        # always filter on the program (all IPTT Excel reports are per-program)
        query_filters = {'program': context['program_pk']}
        # in the case of a TVA Full export, all indicators assigned to the program are included:
        if context['is_tva_full']:
            return query_filters
        elif context['is_tva']:
            # TvA reports only need indicators matching the frequency/ies called for (currently only 1 but room
            # for growth here in case a multi-frequency export is called for, also this matches other calling
            # signatures)
            query_filters['target_frequency__in'] = context['frequencies']
        for (filter_key, query_name) in [('sectors', 'sector__in'), ('types', 'indicator_type__in'),
            ('indicators', 'pk__in'), ('disaggregations', 'disaggregation__in'), ('sites', 'result__site__in')]:
            if filter_key in filters and isinstance(filters[filter_key], list):
                query_filters[query_name] = filters[filter_key]
        if 'levels' in filters and isinstance(filters['levels'], list):
            # 'levels' filter means different things for rf and non-rf programs:
            if context['program']['results_framework']:
                level_pks = []
                parent_pks = filters.get('levels')
                while parent_pks:
                    child_pks = [level.pk for level in levels if level.parent_id in parent_pks]
                    level_pks += parent_pks
                    parent_pks = child_pks
                query_filters['level__in'] = level_pks
            else:
                old_level_map = {pk: name for (pk, name) in Indicator.OLD_LEVELS}
                old_level_names = [old_level_map[pk] for pk in filters['levels']]
                query_filters['old_level__in'] = old_level_names
        elif 'tiers' in filters and isinstance(filters['tiers'], list):
            # impossible to filter on tiers given data schema, so find the levels corresponding to the provided
            # tier pks and filter on those levels:
            filter_levels = []
            tier_depths = sorted([tier.tier_depth for tier in tiers if tier.pk in filters.get('tiers')])
            this_tier_levels = [level.pk for level in levels if not level.parent_id]
            depth = 1
            while this_tier_levels:
                if depth in tier_depths:
                    filter_levels += this_tier_levels
                child_levels = [level.pk for level in levels if level.parent_id in this_tier_levels]
                this_tier_levels = child_levels
                depth += 1
            query_filters['level__in'] = filter_levels
        return query_filters

    @classmethod
    def load_filtered(cls, context):
        """Main entrypoint for loading indicators for excel export

            - instances queryset based on provided filters (from context) and returns serialized objects
        """
        queryset = Indicator.rf_aware_objects.select_related('program').prefetch_related(None).only(
            'pk', 'name', 'deleted', 'program_id', 'means_of_verification', 'level_id', 'level_order',
            'number', 'target_frequency', 'unit_of_measure', 'unit_of_measure_type', 'baseline', 'baseline_na',
            'direction_of_change', 'is_cumulative', 'old_level',
            'create_date', 'sector_id'
        ).filter(**cls._get_queryset_filters(context)).order_by().distinct()
        return cls(queryset, context=context, many=True)

    # helper methods for serializer method fields:

    def _get_level_depth_ontology(self, level, level_set, depth=1, ontology=None):
        """Cribbed from Level model logic, determines depth based only on levels and parent relationships"""
        if ontology is None:
            ontology = []
        if level.parent_id is None:
            return depth, u'.'.join(ontology)
        ontology = [str(level.customsort)] + ontology
        parent = [l for l in level_set if l.pk == level.parent_id][0]
        return self._get_level_depth_ontology(parent, level_set, depth+1, ontology)

    def _get_rf_long_number(self, indicator):
        """overrides parent _get_rf_long_number to use unserialized level/tier objects

            The base and JSON (web) serializers handle serialized versions of levels/tiers, but due to calling
            structure, the excel export serializer is given raw model objects in the context.  This method
            adapts the calling signature to dot notation instead of dict notation
        """
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

    # Serializer method fields:

    def get_disaggregations(self, indicator):
        """This context-driven structure is to prevent repeated calls to the database

            All disaggregations associated with a program are provided in context (so they are fetched from db
            once). Naive calls to indicator.disaggregations will disregard this and fetch from db anew.  This
            overrides that behavior and filters the disaggregations from context to provide the correct set for
            the given indicator"""
        disaggregation_labels = {}
        disaggregation_objects = []
        disagg_list = self.context['disaggregations_indicators'].get(indicator.pk, {})
        for disaggregation_dict in [self.context['disaggregations'].get(d_pk, None) for d_pk in disagg_list.get('all', [])]:
            if disaggregation_dict is not None:
                #  None catch here in case of a disaggregation with no labels (will not be in disaggregations context)
                disaggregation_objects.append(disaggregation_dict['disaggregation'])
                disaggregation_labels[disaggregation_dict['disaggregation'].pk] = disaggregation_dict.get('labels', [])
        disaggregation_context = {
            **self.context.get('disaggregation_context', {}),
            'labels_map': disaggregation_labels,
            'with_results': disagg_list.get('with_results', []),
        }
        return sorted(
            IPTTExcelDisaggregationSerializer(disaggregation_objects, context=disaggregation_context, many=True).data,
            key=operator.itemgetter('name'))

    @staticmethod
    def get_no_rf_level(indicator):
        return not (indicator.results_framework and indicator.level_id)


IPTTExcelIndicatorSerializer = get_serializer(
    IPTTExcelIndicatorFiltersMixin,
    IndicatorOrderingMixin,
    IndicatorMeasurementMixin,
    IndicatorBaseSerializerMixin
)


class IPTTIndicatorReportBase:
    """Base Serializer class for producing report data for a given frequency and program

        In this schema, "Report" refers to the actual derived data for a given indicator x frequency
        including LoP Target/actual/% met, and all relevant periods data.

        Default is TimePeriods report and Excel serialized.  Adapters provided below for both Web (JSON) and TvA output
    """
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

    # class method to instantiate serializer with minimal queries:

    @classmethod
    def _get_query_fields(cls):
        """additional fields required for this serializer to return data without querying database again"""
        return ['program_id', 'pk', 'unit_of_measure_type', 'is_cumulative', 'level_id']

    # Helper methods for serializer method fields:

    @staticmethod
    def _disaggregations_dict(values=None):
        """Makes a dict with a default that will avoid key errors and return None for any unfilled dvs
            method instead of function to allow for overriding when disaggregated targets happen"""
        if values is None:
            values = {}
        return defaultdict(lambda: {'actual': None}, values)

    def _get_all_results(self, indicator):
        """Return all results (sorted by date) for a given indicator"""
        results = [result for result in self.context.get('results').get(indicator.pk, [])
                   if result.date_collected is not None]
        return sorted(results, key=operator.attrgetter('date_collected'))

    def _get_period_results(self, indicator, period_dict):
        """Returns results for a given indicator for a specific period"""
        past_results = [result for result in self._get_all_results(indicator)
                        if result.date_collected <= period_dict['end']]
        period_results = [result for result in past_results
                          if result.date_collected >= period_dict['start']]
        if period_results and any(result.achieved is not None for result in period_results):
            return past_results if indicator.is_cumulative else period_results
        return []

    def _get_results_totals(self, indicator, results):
        """Return result totals (achieved/disaggregated-values) for a given set of results"""
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

    def _get_period_context(self, indicator):
        """context needed for serialized period of results (actuals or actuals/targets/met) and disaggregated data"""
        return {
            'categories': self.context['labels_indicators_map'].get(indicator.pk, []),
            'coerce_to_string': self.context.get('coerce_to_string', False)
        }

    def _get_period(self, indicator, period_dict):
        """returns serialized period results for a given indicator and period"""
        results = self._get_period_results(indicator, period_dict)
        actual, disaggregations = self._get_results_totals(indicator, results)
        return {
            'count': period_dict.get('customsort', None),
            'actual': actual,
            'disaggregations': disaggregations
        }

    # serializer method fields (populate fields on serializer):

    def get_lop_period(self, indicator):
        """Serializes lop data (as a period object with target/actual/met/disaggregated actuals)"""
        results = self._get_all_results(indicator)
        actual, disaggregations = self._get_results_totals(indicator, results)
        return self._lop_period_serializer.from_dict(
            {'target': indicator.lop_target_calculated,
             'actual': actual,
             'disaggregations': disaggregations},
            context=self._get_period_context(indicator)).data

    def get_periods(self, indicator):
        """Serializes all periods given in context as period objects"""
        context = self._get_period_context(indicator)
        return [self._period_serializer.from_dict(self._get_period(indicator, period), context=context).data
                for period in self.context['periods']]


class IPTTJSONReportMixin:
    """Adapts report data serializer for creating a React-consumable output"""

    class Meta:
        purpose = "JSON"
        fields = [
            'program_id',
        ]

    # Class methods to return serializer with minimal queries

    @classmethod
    def get_filters(cls, program_pk, frequency):
        """unused args to match overridden method signature"""
        filters = {'program_id': program_pk}
        return filters

    @classmethod
    def get_context(cls, program_pk, frequency, filters):
        """Context in this case is primarily used to prefetch all needed DB objects to complete serialization

            This includes any fields needed for filtering, any related objects required for display, etc.
            These objects are in the "context" dictionary which is then available to any serializer methods once
            instantiated
        """
        program_data = Program.rf_aware_objects.select_related(None).prefetch_related(None).only(
            'pk', 'reporting_period_start', 'reporting_period_end'
        ).get(pk=program_pk)
        context = {
            'program_pk': program_pk,
            'frequency': frequency, # the frequency of the specific IPTT report being serialized
            'coerce_to_string': True # JSON decimal-field output should be coerced to string
        }
        if frequency == Indicator.LOP:
            context['periods'] = []
        else:
            context['periods'] = list(PeriodicTarget.generate_for_frequency(frequency)(
                program_data.reporting_period_start, program_data.reporting_period_end
                ))
        result_map = defaultdict(list)
        result_filters = {f"indicator__{key}": value for key, value in filters.items()}
        for result in Result.objects.select_related('periodic_target').prefetch_related(None).filter(
                **result_filters
            ).order_by('indicator_id').prefetch_related(models.Prefetch(
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
        """Return all information needed to serialize this report with a minimal query"""
        return Indicator.rf_aware_objects.select_related(None).prefetch_related(None).only(
            *cls._get_query_fields()
        ).filter(**filters)

    @classmethod
    def load_report(cls, program_pk, frequency):
        """Main entrypoint for web api, gets filters, context data, and model objects, returns serialized objects"""
        filters = cls.get_filters(program_pk, frequency)
        context = cls.get_context(program_pk, frequency, filters)
        queryset = cls.get_queryset(filters)
        return cls(queryset, context=context, many=True)


class IPTTTVAReportMixin:
    """Adds targets to periods in IPTT report"""
    _period_serializer = TVAReportPeriodSerializer

    class Meta:
        purpose = "TvA"

    # class methods for instantiating with minimal queries:

    @classmethod
    def get_filters(cls, program_pk, frequency):
        """Extends parent filters for indicator pks to filter by frequency (for TvA report)"""
        filters = super().get_filters(program_pk, frequency)
        filters['target_frequency'] = frequency
        return filters

    # helper methods for serializer method fields:

    def _get_all_results(self, indicator):
        """overrides parent method to change sorting to by period target for TvA report"""
        results = [result for result in self.context['results'].get(indicator.pk, [])
                   if result.periodic_target is not None]
        dateless = [result for result in results if result.date_collected is None]
        if dateless:
            results = [result for result in results if result.date_collected is not None]
        return dateless + sorted(results, key=operator.attrgetter('periodic_target.customsort', 'date_collected'))

    def _get_all_targets(self, indicator):
        """(not needed by TP report as TP report does not load targets, only actuals)"""
        return self.context['targets'].get(indicator.pk, [])

    def _get_period_results(self, indicator, period_dict):
        """Overrides parent method to match results to period customsort instead of by date for TvA report"""
        if indicator.target_frequency == Indicator.MID_END:
            midline_target = [target for target in self._get_all_targets(indicator) if target.customsort == 0][0]
            midline_results = [result for result in self._get_all_results(indicator)
                               if result.periodic_target_id == midline_target.pk and result.achieved is not None]
            if period_dict['customsort'] == 0:
                return midline_results
            endline_target = [target for target in self._get_all_targets(indicator) if target.customsort == 1][0]
            endline_results = [result for result in self._get_all_results(indicator)
                               if result.periodic_target_id == endline_target.pk and result.achieved is not None]
            if not endline_results:
                return []
            return midline_results + endline_results if indicator.is_cumulative else endline_results
        targets = sorted(
            [target for target in self._get_all_targets(indicator) if target.customsort <= period_dict['customsort']],
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
        return [result for result in self._get_all_results(indicator)
                if (result.periodic_target.pk in [t.pk for t in targets] and result.achieved is not None)]

    def _get_period(self, indicator, period_dict):
        """overrides parent method to add target and % met data to serialized period data"""
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


# Web API, TP Report:
IPTTJSONTPReportIndicatorSerializer = get_serializer(
    IPTTJSONReportMixin,
    IPTTIndicatorReportBase
)

# Web API, TvA Report:
IPTTJSONTVAReportIndicatorSerializer = get_serializer(
    IPTTTVAReportMixin,
    IPTTJSONReportMixin,
    IPTTIndicatorReportBase
)

# Excel Download, TP Report:
IPTTExcelTPReportIndicatorSerializer = get_serializer(
    IPTTIndicatorReportBase,
)

# Excel Download, TvA Report:
IPTTExcelTVAReportIndicatorSerializer = get_serializer(
    IPTTTVAReportMixin,
    IPTTIndicatorReportBase
)
