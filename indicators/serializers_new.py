# -*- coding: utf-8 -*-
from __future__ import division
import string
import operator
from decimal import Decimal
from rest_framework import serializers
from indicators.models import Indicator, Level, LevelTier
from indicators.queries import IPTTIndicator
from workflow.models import Program
from tola.model_utils import get_serializer
from django.utils.translation import ugettext as _


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
                string.ascii_lowercase[indicator.level_order/26 - 1] + string.ascii_lowercase[indicator.level_order % 26]
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
    lop_target = serializers.FloatField(source='lop_target_calculated')

    class Meta:
        fields = [
            'target_frequency',
            'unit_of_measure',
            'is_percent',
            'is_cumulative',
            'direction_of_change',
            'baseline',
            'lop_target'
        ]

    def get_is_percent(self, indicator):
        return indicator.unit_of_measure_type == Indicator.PERCENTAGE

    def get_baseline(self, indicator):
        if indicator.baseline_na or not indicator.baseline:
            return None
        return indicator.baseline


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
            'target_period_last_end_date'
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

    class Meta(IndicatorWithMeasurementSerializer.Meta):
        fields = IndicatorWithMeasurementSerializer.Meta.fields + [
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
        return sorted(set([it.pk for it in indicator.indicator_type.all()]))

    def get_site_pks(self, indicator):
        if hasattr(self, 'context') and 'sites' in self.context:
            return sorted(
                set(site['pk'] for site in self.context['sites'] if site['result__indicator__pk'] == indicator.pk)
            )
        return sorted(set([site.pk for result in indicator.result_set.all() for site in result.site.all()]))

    def get_disaggregation_pks(self, indicator):
        if hasattr(self, 'context') and 'disaggregations' in self.context:
            return sorted(
                set(disaggregation['pk'] for disaggregation in self.context['disaggregations']
                    if disaggregation['indicator__pk'] == indicator.pk)
            )
        return sorted(set([disaggregation.pk for disaggregation in indicator.disaggregation.all()]))

    def _get_rf_long_number(self, indicator):
        level_set = self.context.get('levels',
                                     getattr(indicator.program, 'prefetch_levels',
                                             indicator.program.levels.all()))
        level = [l for l in level_set if l.pk == indicator.level_id]
        if not level:
            return None
        level_depth, display_ontology = self._get_level_depth_ontology(level[0], level_set)
        leveltier = [t for t in self.context.get('tiers', getattr(
            indicator.program, 'prefetch_tiers', indicator.program.level_tiers.all()
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


class IPTTReportIndicatorMixin:
    lop_actual = DecimalDisplayField()
    lop_percent_met = DecimalDisplayField(multiplier=100)
    lop_target = DecimalDisplayField(source='lop_target_calculated')
    report_data = serializers.SerializerMethodField()

    class Meta:
        fields = [
            'lop_actual',
            'lop_percent_met',
            'lop_target',
            'report_data'
        ]

    @classmethod
    def load_report(cls, program_id, frequency):
        program_data = Program.rf_aware_objects.only(
            'pk', 'reporting_period_start', 'reporting_period_end'
        ).get(pk=program_id)
        indicators = cls.get_queryset(program_id, frequency).with_frequency_annotations(
            frequency, program_data.reporting_period_start, program_data.reporting_period_end
        )
        return cls(indicators, many=True, context={'frequency': frequency}).data

    def get_report_data(self, indicator):
        count = getattr(indicator, 'frequency_{0}_count'.format(self.context.get('frequency')), 0)
        report_data = self.period_serializer_class(
            [self.get_period_data(indicator, c) for c in range(count)], many=True
            ).data
        return report_data


class TVAPeriod(serializers.Serializer):
    index = serializers.IntegerField()
    actual = DecimalDisplayField()
    target = DecimalDisplayField()
    percent_met = DecimalDisplayField()


class IPTTTVAMixin:
    period_serializer_class = TVAPeriod
    class Meta:
        fields = []

    @classmethod
    def get_queryset(cls, program_id, frequency):
        return IPTTIndicator.tva.filter(
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


class TimeperiodsPeriod(serializers.Serializer):
    index = serializers.IntegerField()
    actual = DecimalDisplayField()


class IPTTTPMixin:
    period_serializer_class = TimeperiodsPeriod
    class Meta:
        fields = []

    @classmethod
    def get_queryset(cls, program_id, frequency):
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
