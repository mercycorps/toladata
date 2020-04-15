import string
import operator
from decimal import Decimal
from collections import defaultdict
from rest_framework import serializers
from indicators.models import Indicator, Level, LevelTier, DisaggregationLabel, DisaggregationType
from indicators.queries import IPTTIndicator
from workflow.models import Program
from tola.model_utils import get_serializer
from tola.l10n_utils import l10n_date_medium
from django.utils.translation import ugettext as _
from django.utils import timezone

def make_quantized_decimal(value, places=2):
    if value is None:
        return value
    try:
        value = Decimal(value)
    except (TypeError, ValueError):
        return None
    return value.quantize(Decimal(f".{'0'*(places-1)}1"))

class DecimalDisplayField(serializers.DecimalField):
    """
    A decimal field which strips trailing zeros and returns a string
    """
    def __init__(self, *args, **kwargs):
        self.multiplier = Decimal(kwargs.pop('multiplier', 1))
        kwargs.update({
            'decimal_places': 2,
            'max_digits': None,
            'localize': True
        })
        super(DecimalDisplayField, self).__init__(*args, **kwargs)

    def to_representation(self, value):
        if value is not None and value != '':
            value1 = Decimal(value) * self.multiplier
            value2 = value1.quantize(Decimal('.01'))
            value3 = value2.normalize()
            if value3.as_tuple().exponent > 0:
                self.decimal_places = 0
            else:
                self.decimal_places = min(2, abs(value3.as_tuple().exponent))
            return super(DecimalDisplayField, self).to_representation(value3)
        return None


class IndicatorBase:
    level_pk = serializers.SerializerMethodField()
    old_level_name = serializers.SerializerMethodField()

    class Meta:
        model = Indicator
        fields = [
            'pk',
            'name',
            'level_pk',
            'old_level_name',
            'means_of_verification'
        ]

    def get_old_level_name(self, indicator):
        if not indicator.results_framework and indicator.old_level:
            return _(indicator.old_level)
        return None

    def get_level_pk(self, indicator):
        if not indicator.results_framework and indicator.old_level:
            return {name: pk for (pk, name) in Indicator.OLD_LEVELS}.get(indicator.old_level, None)
        elif indicator.results_framework and indicator.level_id:
            return indicator.level_id
        return None

    def _get_level_order_display(self, indicator):
        if indicator.level_id and indicator.level_order is not None and indicator.level_order < 26:
            return str(string.ascii_lowercase[indicator.level_order])
        elif indicator.level_id and indicator.level_order and indicator.level_order >= 26:
            return str(
                string.ascii_lowercase[indicator.level_order/26 - 1] +
                string.ascii_lowercase[indicator.level_order % 26]
                )
        return None

    def _get_rf_long_number(self, indicator):
        return u"{} {}{}".format(
            indicator.leveltier_name, indicator.level_display_ontology, indicator.level_order_display
        )

    def _get_level_depth_ontology(self, level, level_set, depth=1, ontology=None):
        if ontology is None:
            ontology = []
        if level.parent_id is None:
            return depth, u'.'.join(ontology)
        ontology = [str(level.customsort)] + ontology
        parent = [l for l in level_set if l.pk == level.parent_id][0]
        return self._get_level_depth_ontology(parent, level_set, depth+1, ontology)

    def get_long_number(self, indicator):
        """Returns the number for i.e. Program Page, "1.1" (manual) or "Output 1.1a" (auto)"""
        if indicator.manual_number_display:
            return indicator.number if indicator.number else None
        if indicator.level_id:
            return self._get_rf_long_number(indicator)
        return None

IndicatorBaseSerializer = get_serializer(IndicatorBase)


class IndicatorMeasurementMixin:
    is_percent = serializers.SerializerMethodField()
    direction_of_change = serializers.CharField(source='get_direction_of_change')
    baseline = serializers.SerializerMethodField()
    
    unit_of_measure_type = serializers.SerializerMethodField()

    class Meta:
        fields = [
            'target_frequency',
            'unit_of_measure',
            'unit_of_measure_type',
            'is_percent',
            'is_cumulative',
            'direction_of_change',
            'baseline'
        ]

    def get_is_percent(self, indicator):
        return indicator.unit_of_measure_type == Indicator.PERCENTAGE

    def get_baseline(self, indicator):
        if indicator.baseline_na or not indicator.baseline:
            return None
        return indicator.baseline

    def get_unit_of_measure_type(self, indicator):
        if indicator.unit_of_measure_type == indicator.NUMBER:
            return '#'
        elif indicator.unit_of_measure_type == indicator.PERCENTAGE:
            return '%'
        return None


IndicatorWithMeasurementSerializer = get_serializer(IndicatorMeasurementMixin, IndicatorBase)

class ProgramPageIndicatorMixin:
    number = serializers.SerializerMethodField('get_long_number')
    was_just_created = serializers.BooleanField(source="just_created")
    is_key_performance_indicator = serializers.BooleanField(source="key_performance_indicator")
    is_reporting = serializers.BooleanField(source="reporting")
    over_under = serializers.IntegerField()
    has_all_targets_defined = serializers.BooleanField()
    results_count = serializers.IntegerField()
    has_results = serializers.SerializerMethodField()
    results_with_evidence_count = serializers.IntegerField()
    missing_evidence = serializers.SerializerMethodField()
    most_recent_completed_target_end_date = serializers.DateField()
    target_period_last_end_date = serializers.DateField()
    lop_target = serializers.FloatField(source='lop_target_calculated')

    class Meta(IndicatorWithMeasurementSerializer.Meta):
        fields = IndicatorWithMeasurementSerializer.Meta.fields + [
            'number',
            'was_just_created',
            'is_key_performance_indicator',
            'is_reporting',
            'over_under',
            'has_all_targets_defined',
            'results_count',
            'has_results',
            'results_with_evidence_count',
            'missing_evidence',
            'most_recent_completed_target_end_date',
            'target_period_last_end_date',
            'lop_target',
        ]

    def get_has_results(self, indicator):
        return indicator.results_count > 0

    def get_missing_evidence(self, indicator):
        return indicator.results_count > 0 and indicator.results_with_evidence_count < indicator.results_count

    def _get_rf_long_number(self, indicator):
        level_set = getattr(indicator.program, 'prefetch_levels', indicator.program.levels.all())
        level = [l for l in level_set if l.pk == indicator.level_id]
        if not level:
            return None
        level_depth, display_ontology = self._get_level_depth_ontology(level[0], level_set)
        leveltier = [t for t in getattr(
            indicator.program, 'prefetch_leveltiers', indicator.program.level_tiers.all()
            ) if t.tier_depth == level_depth]
        if not leveltier:
            leveltier_name = u''
        else:
            leveltier_name = u'{} '.format(_(leveltier[0].name))
        return u"{}{}{}".format(
            leveltier_name, display_ontology, self._get_level_order_display(indicator)
        )


ProgramPageIndicatorSerializer = get_serializer(
    ProgramPageIndicatorMixin,
    IndicatorMeasurementMixin,
    IndicatorBase
)


class ProgramPageIndicatorUpdateSerializer(ProgramPageIndicatorSerializer):
    class Meta(ProgramPageIndicatorSerializer.Meta):
        fields = [
            'pk',
            'number'
        ]

class IPTTIndicatorMixin:
    sector_pk = serializers.IntegerField(source='sector_id')
    indicator_type_pks = serializers.SerializerMethodField()
    site_pks = serializers.SerializerMethodField()
    number = serializers.SerializerMethodField(method_name='get_long_number')
    disaggregation_pks = serializers.SerializerMethodField()

    class Meta:
        fields = [
            'sector_pk',
            'indicator_type_pks',
            'site_pks',
            'number',
            'disaggregation_pks',
        ]

    def get_indicator_type_pks(self, indicator):
        if hasattr(self, 'context') and 'indicator_types' in self.context:
            return sorted(
                set(it['pk'] for it in self.context['indicator_types'] if it['indicator__pk'] == indicator.pk)
                )
        return sorted(set(it.pk for it in indicator.indicator_type.all()))

    def get_site_pks(self, indicator):
        if hasattr(self, 'context') and 'sites' in self.context:
            return sorted(
                set(site['pk'] for site in self.context['sites'] if site['result__indicator__pk'] == indicator.pk)
            )
        return sorted(set(site.pk for result in indicator.result_set.all() for site in result.site.all()))

    def get_disaggregation_pks(self, indicator):
        if hasattr(self, 'context') and 'disaggregations' in self.context:
            return sorted(
                set(disaggregation['pk'] for disaggregation in self.context['disaggregations']
                    if disaggregation['indicator__pk'] == indicator.pk)
            )
        return sorted(set(disaggregation.pk for disaggregation in indicator.disaggregation.all()))

    def _get_rf_long_number(self, indicator):
        level_set = self.context.get('levels',
                                     getattr(indicator.program, 'prefetch_levels',
                                             indicator.program.levels.all()))
        level = [l for l in level_set if l.pk == indicator.level_id]
        if not level:
            return None
        level_depth, display_ontology = self._get_level_depth_ontology(level[0], level_set)
        leveltier = [t for t in self.context.get('tiers', getattr(
            indicator.program, 'prefetch_leveltiers', indicator.program.level_tiers.all()
        )) if t.tier_depth == level_depth]
        if not leveltier:
            leveltier_name = u''
        else:
            leveltier_name = u'{} '.format(_(leveltier[0].name))
        return u"{}{}{}".format(
            leveltier_name, display_ontology, self._get_level_order_display(indicator)
        )

IPTTIndicatorSerializer = get_serializer(
    IPTTIndicatorMixin,
    IndicatorMeasurementMixin,
    IndicatorBase
)

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

class IPTTExcelIndicatorMixin:
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
    IPTTExcelIndicatorMixin,
    IndicatorMeasurementMixin,
    IndicatorBase
)

class IPTTExcelReportIndicatorBase:
    lop_period = serializers.SerializerMethodField()
    periods = serializers.SerializerMethodField()
    

    class Meta:
        model = Indicator
        fields = [
            'pk',
            'level_id',
            'lop_period',
            'periods',
        ]

    def _get_all_results(self, indicator):
        results = [result for result in self.context.get('results').get(indicator.pk, [])]
        dateless = [result for result in results if result.date_collected is None]
        if dateless:
            results = [result for result in results if result.date_collected is not None]
        return dateless + sorted(results, key=operator.attrgetter('date_collected'))

    def _get_period_results(self, indicator, period_dict):
        past_results = [result for result in self._get_all_results(indicator)
                        if (result.date_collected is not None and
                            result.date_collected <= period_dict['end'])]
        period_results = [result for result in past_results
                          if result.date_collected >= period_dict['start']]
        if period_results and any(result.achieved is not None for result in period_results):
            return past_results if indicator.is_cumulative else period_results
        else:
            return []

    def _get_all_targets(self, indicator):
        return self.context.get('targets').get(indicator.pk) or []

    def _disaggregations_dict(self, values={}):
        """Makes a dict with a default that will avoid key errors and return None for any unfilled dvs
        
            method instead of function to allow for overriding when disaggregated targets happen"""
        return defaultdict(lambda: {'actual': None}, values)

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
        period = {
            'target': make_quantized_decimal(indicator.lop_target_calculated),
            'actual': actual,
            'disaggregations': disaggregations,
            'count': None
        }
        if period['target'] and period['actual']:
            period['met'] = make_quantized_decimal(period['actual'] / period['target'], places=4)
        else:
            period['met'] = None
        return period

    def _get_period(self, indicator, period_dict):
        results = self._get_period_results(indicator, period_dict)
        actual, disaggregations = self._get_results_totals(indicator, results)
        return {
            'count': period_dict.get('customsort', None),
            'actual': actual,
            'disaggregations': disaggregations
            
        }

    def get_periods(self, indicator):
        return [self._get_period(indicator, period) for period in self.context.get('periods')]

class TVAMixin:
    class Meta:
        pass

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
                return midline_results + endline_result if indicator.is_cumulative else endline_results
        else:
            return super()._get_period_results(indicator, period_dict)
            
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
    IPTTExcelReportIndicatorBase
)

IPTTExcelTVAReportIndicatorSerializer = get_serializer(
    TVAMixin,
    IPTTExcelReportIndicatorBase
)    

class IPTTReportIndicatorMixin:
    lop_actual = DecimalDisplayField()
    lop_percent_met = DecimalDisplayField(multiplier=100)
    lop_target = DecimalDisplayField(source='lop_target_calculated')
    disaggregated_data = serializers.SerializerMethodField()
    report_data = serializers.SerializerMethodField()
    disaggregated_report_data = serializers.SerializerMethodField()

    class Meta:
        fields = [
            'lop_actual',
            'lop_percent_met',
            'lop_target',
            'disaggregated_data',
            'report_data',
            'disaggregated_report_data'
        ]

    @classmethod
    def load_report(cls, program_id, frequency):
        """Primary entry point into serializer, prefetches, annotates, runs query, returns data"""
        program_data = Program.rf_aware_objects.only(
            'pk', 'reporting_period_start', 'reporting_period_end'
        ).get(pk=program_id)
        disaggregation_categories = DisaggregationLabel.objects.select_related(
            None
        ).prefetch_related(None).order_by().filter(
            disaggregation_type__indicator__program_id=program_id
        ).distinct().values_list('pk', flat=True)
        indicators = cls.get_queryset(program_id, frequency).with_disaggregation_lop_annotations(
            disaggregation_categories
        ).with_frequency_annotations(
            frequency, program_data.reporting_period_start, program_data.reporting_period_end,
        )
        # get the disaggregation categories _actually_ in use (lop_actual isn't 0)
        active_disaggregations = list(set(
            category_pk for indicator in indicators for category_pk in indicator.active_disaggregation_category_pks
        ))
        # disaggregation period annotations broken out into their own query due to MySQL temp table size limit:
        disaggregated_indicators = cls.get_disaggregations_queryset(
            program_id, frequency
        ).with_disaggregation_frequency_annotations(
            frequency, program_data.reporting_period_start, program_data.reporting_period_end,
            disaggregations=active_disaggregations,
        )
        return cls(indicators, many=True, context={
            'frequency': frequency,
            'disaggregated_indicators': {di.pk: di for di in disaggregated_indicators}}
                   ).data

    def get_disaggregated_data(self, indicator):
        """lop_actual value for each disaggregation category assigned to the indicator"""
        return {
            disaggregation_pk: {'lop_actual': getattr(indicator, f'disaggregation_{disaggregation_pk}_lop_actual')}
            for disaggregation_pk in indicator.disaggregation_category_pks
        }

    def get_report_data(self, indicator):
        """period data for each period in frequency (actual for TP, actual/target/% met for TvA)"""
        count = getattr(indicator, 'frequency_{0}_count'.format(self.context.get('frequency')), 0)
        report_data = self.period_serializer_class(
            [self.get_period_data(indicator, c) for c in range(count)], many=True
            ).data
        return report_data

    def get_disaggregated_period_data(self, indicator, disaggregation_pk, count):
        """disaggregated period data - only TP (actuals) data currently spec'd - may include targets later"""
        return {
            'index': count,
            'actual': getattr(
                self.context['disaggregated_indicators'][indicator.pk],
                'disaggregation_{0}_frequency_{1}_period_{2}'.format(
                    disaggregation_pk,
                    self.context.get('frequency'),
                    count),
                None
                )
            }

    def get_disaggregated_report_data(self, indicator):
        """disaggregated period data for each period in frequency, only actuals, uses get_disaggregated_period_data"""
        count = getattr(indicator, 'frequency_{0}_count'.format(self.context.get('frequency')), 0)
        # note: filter here means only the periods with values and the final period (null or not) get sent
        # this is to minimize the size of the JSON transfers going back and forth
        disaggregated_report_data = {
            **{category_pk: self.disaggregated_period_serializer_class(
                filter(
                    lambda period_data: (period_data['index'] == count-1 or period_data['actual'] is not None),
                    [self.get_disaggregated_period_data(indicator, category_pk, c) for c in range(count)]
                ), many=True
                ).data for category_pk in indicator.active_disaggregation_category_pks},
            **{category_pk: [{'index': count-1, 'actual': None}]
               for category_pk in indicator.inactive_disaggregation_category_pks}
        }
        return disaggregated_report_data


class TVAPeriod(serializers.Serializer):
    index = serializers.IntegerField()
    actual = DecimalDisplayField()
    target = DecimalDisplayField()
    percent_met = DecimalDisplayField()


class TimeperiodsPeriod(serializers.Serializer):
    index = serializers.IntegerField()
    actual = DecimalDisplayField()


class IPTTTVAMixin:
    period_serializer_class = TVAPeriod
    disaggregated_period_serializer_class = TimeperiodsPeriod # until we add disaggregated targets, use TP serializer

    class Meta:
        fields = []

    @classmethod
    def get_queryset(cls, program_id, frequency):
        return IPTTIndicator.tva.filter(
            program_id=program_id, target_frequency=frequency
        )

    @classmethod
    def get_disaggregations_queryset(cls, program_id, frequency):
        return IPTTIndicator.timeperiods.filter(
            program_id=program_id, target_frequency=frequency
        )

    def get_period_data(self, indicator, count):
        period_data = {
            'index': count,
            'actual': getattr(
                indicator, 'frequency_{0}_period_{1}'.format(self.context.get('frequency'), count), None
                ),
            'target': getattr(
                indicator, 'frequency_{0}_period_{1}_target'.format(self.context.get('frequency'), count), None
                )
            }
        if period_data['actual'] and period_data['target'] and period_data['target'] != 0:
            period_data['percent_met'] = round(period_data['actual'] / period_data['target'] * 100, 2)
        else:
            period_data['percent_met'] = None
        return period_data


class IPTTTPMixin:
    period_serializer_class = TimeperiodsPeriod
    disaggregated_period_serializer_class = TimeperiodsPeriod
    class Meta:
        fields = []

    @classmethod
    def get_queryset(cls, program_id, frequency):
        return IPTTIndicator.timeperiods.filter(
            program_id=program_id
        )

    @classmethod
    def get_disaggregations_queryset(cls, program_id, frequency):
        return IPTTIndicator.timeperiods.filter(
            program_id=program_id
        )

    def get_period_data(self, indicator, count):
        return {
            'index': count,
            'actual': getattr(
                indicator, 'frequency_{0}_period_{1}'.format(self.context.get('frequency'), count), None
                )
            }



IPTTTVAReportIndicatorSerializer = get_serializer(
    IPTTTVAMixin,
    IPTTReportIndicatorMixin,
    IndicatorBase
)

IPTTTPReportIndicatorSerializer = get_serializer(
    IPTTTPMixin,
    IPTTReportIndicatorMixin,
    IndicatorBase
)

class LevelBase:
    ontology = serializers.SerializerMethodField()
    tier_name = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()

    class Meta:
        model = Level
        fields = [
            'pk',
            'name',
            'ontology',
            'tier_name',
            'parent_id'
        ]
        

    def _get_tiers(self, level):
        if hasattr(self, 'context') and 'tiers' in self.context:
            return self.context['tiers']
        return level.program.level_tiers.all()

    def _get_levels(self, level):
        if hasattr(self, 'context') and 'levels' in self.context:
            return self.context['levels']
        return level.program.levels.all()

    def _get_parent(self, level):
        if level.parent_id is not None:
            return [lvl for lvl in self._get_levels(level) if lvl.pk == level.parent_id][0]
        return None

    def _get_level_depth(self, level):
        depth = 1
        target = self._get_parent(level)
        while target is not None:
            depth += 1
            target = self._get_parent(target)
        return depth

    def _get_level_tier(self, level):
        tiers = self._get_tiers(level)
        if len(tiers) > self._get_level_depth(level) - 1:
            return tiers[self._get_level_depth(level) - 1]
        return None

    def get_ontology(self, level):
        target = level
        ontology = []
        while self._get_parent(target) is not None:
            ontology = [str(target.customsort)] + ontology
            target = self._get_parent(target)
        return '.'.join(ontology)

    def get_tier_name(self, level):
        if self._get_level_tier(level):
            return _(self._get_level_tier(level).name)
        return None

    def get_name(self, level):
        return level.name


class RFLevelOrderingLevelMixin:
    indicator_pks = serializers.SerializerMethodField()

    class Meta:
        override_fields = True
        fields = [
            'pk',
            'indicator_pks'
        ]

    def get_indicator_pks(self, level):
        if hasattr(self, 'context') and 'indicators' in self.context:
            indicators = self.context['indicators']
        else:
            indicators = level.program.indicator_set.all()
        indicators = sorted(
            [i for i in indicators if i.level_id == level.pk],
            key=operator.attrgetter('level_order')
            )
        return [i.pk for i in indicators]


RFLevelOrderingLevelSerializer = get_serializer(RFLevelOrderingLevelMixin, LevelBase)


class IPTTLevelMixin:
    tier_pk = serializers.SerializerMethodField()
    tier_depth = serializers.SerializerMethodField()
    chain_pk = serializers.SerializerMethodField()

    class Meta:
        fields = [
            'tier_pk',
            'tier_depth',
            'chain_pk'
        ]

    def get_tier_pk(self, level):
        if self._get_level_tier(level):
            return self._get_level_tier(level).pk
        return None

    def get_tier_depth(self, level):
        if self._get_level_tier(level):
            return self._get_level_tier(level).tier_depth
        return None

    def get_chain_pk(self, level):
        depth = self._get_level_depth(level)
        target = level
        if depth == 1:
            return 'all'
        while depth > 2:
            target = self._get_parent(target)
            depth = self._get_level_depth(target)
        return target.pk

IPTTLevelSerializer = get_serializer(IPTTLevelMixin, LevelBase)

class IPTTExcelLevelMixin:
    class Meta:
        fields = []
    def get_name(self, level):
        tier = self.get_tier_name(level) or ""
        ontology = self.get_ontology(level) or ""
        ontology = f' {ontology}' if ontology else ""
        return f'{tier}{ontology}: {level.name}' if tier else level.name


IPTTExcelLevelSerializer = get_serializer(IPTTExcelLevelMixin, IPTTLevelMixin, LevelBase)


class TierBase:
    name = serializers.SerializerMethodField()

    class Meta:
        model = LevelTier
        fields = [
            'pk',
            'name',
            'tier_depth'
        ]

    def get_name(self, tier):
        return _(tier.name)

IPTTTierSerializer = get_serializer(TierBase)


