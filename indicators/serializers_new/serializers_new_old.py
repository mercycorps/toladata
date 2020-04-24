import operator
from decimal import Decimal
from collections import defaultdict
from rest_framework import serializers
from indicators.models import Indicator, Level, LevelTier, DisaggregationLabel, DisaggregationType
from indicators.queries import IPTTIndicator
from workflow.models import Program
from tola.model_utils import get_serializer
from tola.serializers import make_quantized_decimal, DecimalDisplayField
from django.utils.translation import ugettext as _
from .indicator_serializers import (
    IndicatorMeasurementMixin,
    IndicatorBaseSerializerMixin as IndicatorBase
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
