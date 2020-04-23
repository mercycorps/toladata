import operator
from decimal import Decimal
from collections import defaultdict
from rest_framework import serializers
from indicators.models import Indicator, Level, LevelTier, DisaggregationLabel, DisaggregationType
from indicators.queries import IPTTIndicator
from workflow.models import Program
from tola.model_utils import get_serializer
from django.utils.translation import ugettext as _
from .indicator_serializers import (
    IndicatorMeasurementMixin,
    IndicatorBaseSerializerMixin as IndicatorBase
)


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
