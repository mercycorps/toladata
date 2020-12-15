# -*- coding: utf-8 -*-
"""
    Indicator serializers - note that indicators.serializers_new directly supercedes these where they conflict
    currently - replacing without regressions is a longer term project
"""
from operator import attrgetter
from rest_framework import serializers
from django.utils import timezone, formats
from django.utils.translation import ugettext, ugettext_lazy

from tola.l10n_utils import l10n_date_medium

from workflow.models import Program
from indicators.models import (
    Indicator,
    Level,
    LevelTier,
    LevelTierTemplate,
    PeriodicTarget,
    Objective,
    DisaggregationLabel
)
from indicators.queries import IPTTIndicator
from indicators.export_renderers import EM_DASH




#######################
#      PROGRAM PAGE   #
#######################


class LevelSerializer(serializers.ModelSerializer):
    """
    Level serializer for Program Page
    """
    level_depth = serializers.IntegerField(source='get_level_depth', read_only=True)

    class Meta:
        model = Level
        fields = [
            'id',
            'parent',
            'name',
            'assumptions',
            'program',
            'customsort',
            'ontology',
            'level_depth'
        ]
        read_only_fields = ['level_depth', 'ontology']


class LevelTierSerializer(serializers.ModelSerializer):
    """
    LevelTier serializer for Program Page
    """
    class Meta:
        model = LevelTier
        fields = [
            'id',
            'name',
            'tier_depth'
        ]


class LevelTierTemplateSerializer(serializers.ModelSerializer):
    """
    LevelTierTemplate serializer for RF builder
    """
    names = serializers.SerializerMethodField()
    class Meta:
        model = LevelTierTemplate
        fields = [
            'id',
            'names',
        ]

    def get_names(self, obj):
        return list(obj.names)


class IndicatorSerializerMinimal(serializers.ModelSerializer):

    class Meta:
        model = Indicator
        fields = [
            'id',
            'name',
            'level',
            'level_order',
            'number',
        ]


class IndicatorSerializer(serializers.ModelSerializer):
    """
    Serializer specific to the Program Page
    """
    number_if_numbering = serializers.SerializerMethodField()
    reporting = serializers.BooleanField()
    all_targets_defined = serializers.IntegerField()
    results_count = serializers.IntegerField()
    results_with_evidence_count = serializers.IntegerField()
    over_under = serializers.IntegerField()
    target_period_last_end_date = serializers.DateField()
    level = LevelSerializer(read_only=True)
    lop_target_active = serializers.FloatField()
    old_level = serializers.SerializerMethodField()
    old_level_pk = serializers.IntegerField(read_only=True)

    class Meta:
        model = Indicator
        fields = [
            'id',
            'name',
            'number_display',
            'number',
            'level',
            'old_level',
            'old_level_pk',
            'level_order',
            'unit_of_measure',
            'unit_of_measure_type',
            'baseline',
            'baseline_na',
            'lop_target_active',
            'key_performance_indicator',
            'just_created',

            # DB annotations
            #  whether indicator progress towards targets is reported
            #  (min. one target period complete, one result reported):
            'reporting',
            'all_targets_defined',  # whether all targets are defined for this indicator
            'results_count',
            'results_with_evidence_count',
            'target_period_last_end_date', # last end date of last target period, for time-aware indicators
            'over_under',  # indicator progress towards targets (1: over, 0: within 15% of target, -1: under, "None": non reporting
            'number_if_numbering', # only a number if the program is on manual numbers
        ]

    def get_number_if_numbering(self, obj):
        if obj.results_framework and obj.program.auto_number_indicators:
            return None
        return obj.number

    def get_old_level(self, obj):
        return ugettext(obj.old_level) if obj.old_level else None



class ProgramSerializer(serializers.ModelSerializer):
    """
    Serializer specific to the Program Page
    """
    class Meta:
        model = Program
        fields = [
            'id',
            'pk',
            'name',
            'does_it_need_additional_target_periods',
            'reporting_period_start',
            'reporting_period_end',
            'results_framework',
            'auto_number_indicators'
        ]


##################################
#    Results Framework Builder   #
##################################


class ProgramObjectiveSerializer(serializers.ModelSerializer):

    class Meta:
        model = Objective
        fields = [
            'id',
            'name',
            'description',
        ]


#######################
#    INDICATOR PLAN   #
#######################


class IndicatorPlanIndicatorSerializerBase(serializers.ModelSerializer):
    """
    Serializer for the indicator plan page and excel export
    """
    tier_name_only = serializers.SerializerMethodField()
    disaggregation = serializers.StringRelatedField(many=True)
    is_cumulative = serializers.SerializerMethodField()
    baseline = serializers.SerializerMethodField()
    lop_target = serializers.SerializerMethodField()
    data_collection_frequency = serializers.StringRelatedField()
    reporting_frequency = serializers.StringRelatedField()

    class Meta:
        model = Indicator
        fields = [
            'id',
            'tier_name_only',
            'results_aware_number',
            'level_order',
            'name',
            'source',
            'definition',
            'disaggregation',
            'unit_of_measure',
            'get_direction_of_change_display',
            'get_unit_of_measure_type_display',
            'is_cumulative',
            'baseline',
            'lop_target',
            'rationale_for_target',
            'get_target_frequency_display',
            'means_of_verification',
            'data_collection_method',
            'data_collection_frequency',
            'data_points',
            'responsible_person',
            'method_of_analysis',
            'information_use',
            'reporting_frequency',
            'quality_assurance',
            'quality_assurance_techniques',
            'data_issues',
            'comments',
        ]

    def get_lop_target(self, obj):
        return obj.calculated_lop_target

    def get_tier_name_only(self, obj):
        if obj.results_framework and obj.level and obj.level.leveltier:
            return obj.level.leveltier.name
        elif not obj.results_framework and obj.old_level:
            return obj.old_level
        return None

    def get_is_cumulative(self, obj):
        if obj.target_frequency == Indicator.LOP:
            return None
        return obj.is_cumulative

    def get_baseline(self, obj):
        if obj.baseline_na:
            return None
        return obj.baseline

    def to_representation(self, instance):
        data = super(IndicatorPlanIndicatorSerializerBase, self).to_representation(instance)
        for field in data:
            data[field] = self.render_value(field, instance, data)
        return data


class IndicatorFormatsMixin:
    translateable_fields = (
        'tier_name_only',
        'get_direction_of_change_display',
        'get_unit_of_measure_type_display',
    )
    method_fields = (
        'is_cumulative',
        'disaggregation',
    )
    bullet_list_fields = (
        'disaggregation',
    )
    numeric_fields = (
        'baseline',
        'lop_target',
    )
    em_dash_fields = (
        'results_aware_number',
    )
    not_applicable_fields = (
        'baseline',
        'is_cumulative',
    )

    def format_is_cumulative(self, value, **kwargs):
        if value is True:
            # Translators: C stands for Cumulative (targets are summative)
            return self.get_translated('C')
        elif value is False:
            # Translators: NC stands for Not Cumulative (targets do not sum over time)
            return self.get_translated('NC')
        return value

    def format_disaggregation(self, value, **kwargs):
        return [self.get_translated(v) for v in value] if value else None

    def format_list(self, value):
        return value if value is None else "\n".join(u'-{}'.format(item) for item in value)

    def render_value(self, field, instance, data):
        value = data.get(field, None)
        if value == '' or value is False or value == []:
            value = None
        if field in self.translateable_fields:
            value = self.get_translated(value)
        if field in self.method_fields:
            if hasattr(self, 'format_{}'.format(field)):
                value = getattr(self, 'format_{}'.format(field))(
                    value, instance=instance, data=data
                    )
        if field in self.numeric_fields:
            value = self.format_numeric(value, instance)
        if field in self.bullet_list_fields:
            value = self.format_list(value)
        if value is None:
            if field in self.em_dash_fields:
                value = EM_DASH
            elif field in self.not_applicable_fields:
                value = self.get_translated('N/A')
            else:
                value = u''
        return value


class IndicatorWebMixin(IndicatorFormatsMixin):
    def get_translated(self, value):
        return value if value is None else ugettext_lazy(value)

    def format_numeric(self, value, indicator, decimal_places=2):
        if value is None:
            return value
        try:
            f_value = round(float(value), decimal_places)
            f_value = int(value) if f_value.is_integer() else f_value
        except ValueError:
            return value
        else:
            value = formats.number_format(f_value, use_l10n=True, force_grouping=True)
            if indicator.unit_of_measure_type == indicator.PERCENTAGE:
                value = u'{}%'.format(value)
            return value


class IndicatorExcelMixin(IndicatorFormatsMixin):
    def get_translated(self, value):
        return value if value is None else ugettext(value)

    def format_numeric(self, value, indicator, decimal_places=2):
        if value is None:
            return value
        if indicator.unit_of_measure_type == indicator.PERCENTAGE:
            return self.format_percentage(float(value)/100, indicator, decimal_places)
        try:
            f_value = round(float(value), decimal_places)
            if f_value.is_integer():
                return {
                    'value': int(value),
                    'number_format': '0'
                    }
            elif round(float(value), 1) == f_value:
                return {
                    'value': round(float(value), 1),
                    'number_format': '0.0'
                }
            return {
                'value': f_value,
                'number_format': '0.00'
            }
        except ValueError:
            return value

    def format_percentage(self, value, indicator, decimal_places=2):
        if value is None:
            return value
        try:
            f_value = round(float(value), decimal_places+2)
            if f_value == round(float(value), decimal_places):
                return {
                    'value': round(float(value), decimal_places),
                    'number_format': '0%'
                    }
            elif round(float(value), decimal_places+1) == f_value:
                return {
                    'value': round(float(value), decimal_places+1),
                    'number_format': '0.0%'
                }
            return {
                'value': f_value,
                'number_format': '0.00%'
            }
        except ValueError:
            return value

    def render_value(self, field, instance, data):
        value = super(IndicatorExcelMixin, self).render_value(field, instance, data)
        if type(value) == dict and 'value' in value:
            pass
        elif value is None:
            value = {
                'value': u'',
                'number_format': 'General'
            }
        else:
            value = {
                'value': str(value),
                'number_format': 'General'
            }
        value.update({
            'field': field
        })
        return value


class IndicatorPlanIndicatorWebSerializer(IndicatorWebMixin, IndicatorPlanIndicatorSerializerBase):
    pass


class IndicatorPlanIndicatorExcelSerializer(IndicatorExcelMixin, IndicatorPlanIndicatorSerializerBase):
    pass


class IndicatorPlanLevelSerializerBase(serializers.ModelSerializer):
    """
    Level serializer for the indicator plan page and excel export
    """
    display_name = serializers.SerializerMethodField()

    class Meta:
        model = Level
        fields = [
            'id',
            'display_name',
            'indicator_set'
        ]


    def get_display_name(self, obj):
        tier = ugettext(obj.leveltier.name) if obj.leveltier else u''
        ontology = obj.display_ontology if obj.display_ontology else u''
        name = str(obj.name)
        #return u' '.join([w for w in [tier, ontology, name] if w is not None])
        return u'{tier}{tier_space}{ontology}{colon}{name}'.format(
            tier=tier,
            tier_space=u' ' if tier and ontology else u'',
            ontology=ontology,
            colon=u': ' if (tier or ontology) else u'',
            name=name
        )


class IndicatorPlanLevelWebSerializer(IndicatorPlanLevelSerializerBase):
    indicator_set = IndicatorPlanIndicatorWebSerializer(many=True, read_only=True)


class IndicatorPlanLevelExcelSerializer(IndicatorPlanLevelSerializerBase):
    indicator_set = IndicatorPlanIndicatorExcelSerializer(many=True, read_only=True)
