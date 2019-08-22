# -*- coding: utf-8 -*-
import string
from rest_framework import serializers
from indicators.models import Indicator
from django.utils.translation import ugettext as _



class IndicatorBaseSerializer(serializers.ModelSerializer):
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
            return unicode(string.lowercase[indicator.level_order])
        elif indicator.level_id and indicator.level_order and indicator.level_order >= 26:
            return unicode(
                string.lowercase[indicator.level_order/26 - 1] + string.lowercase[indicator.level_order % 26]
                )
        return None

    def _get_rf_long_number(self, indicator):
        return u"{} {}{}".format(
                indicator.leveltier_name, indicator.level_display_ontology, indicator.level_order_display
            )

    def get_long_number(self, indicator):
        """Returns the number for i.e. Program Page, "1.1" (manual) or "Output 1.1a" (auto)"""
        if indicator.manual_number_display:
            return indicator.number if indicator.number else None
        if indicator.level_id:
            return self._get_rf_long_number(indicator)
        return None


class IndicatorWithMeasurementSerializer(IndicatorBaseSerializer):
    is_percent = serializers.SerializerMethodField()
    direction_of_change = serializers.CharField(source='get_direction_of_change')
    baseline = serializers.SerializerMethodField()
    lop_target = serializers.FloatField(source='lop_target_calculated')

    class Meta(IndicatorBaseSerializer.Meta):
        fields = IndicatorBaseSerializer.Meta.fields + [
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


class ProgramPageIndicatorSerializer(IndicatorWithMeasurementSerializer):
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

    def _get_level_depth_ontology(self, level, level_set, depth=1, ontology=None):
        if ontology is None:
            ontology = []
        if level.parent_id is None:
            return depth, u'.'.join(ontology)
        ontology = [unicode(level.customsort)] + ontology
        parent = [l for l in level_set if l.pk == level.parent_id][0]
        return self._get_level_depth_ontology(parent, level_set, depth+1, ontology)

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

class ProgramPageIndicatorUpdateSerializer(ProgramPageIndicatorSerializer):
    class Meta(ProgramPageIndicatorSerializer.Meta):
        fields = [
            'pk',
            'number'
        ]
