# -*- coding: utf-8 -*-
"""
    Indicator serializers - note that indicators.serializers_new directly supercedes these where they conflict
    currently - replacing without regressions is a longer term project
"""
from operator import attrgetter
from rest_framework import serializers
from django.utils import timezone, formats
from django.utils.translation import gettext, gettext_lazy

from tola.l10n_utils import l10n_date_medium

from workflow.models import Program
from indicators.models import (
    Indicator,
    Level,
    LevelTier,
    LevelTierTemplate,
    Objective,
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
    key_performance_indicator = serializers.BooleanField()

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
        return gettext(obj.old_level) if obj.old_level else None



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
    """Lightweight serializer for program Objectives for use in the RF Builder"""

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
    """Serializer for the indicator plan page and excel export

       Requires a formatter derived from the IndicatorFormatterMixin to render values appropriately for web/excel
       Note: the formatting behavior occurs in to_representation
    """
    tier_name_only = serializers.SerializerMethodField()
    disaggregation = serializers.StringRelatedField(many=True)
    is_cumulative = serializers.SerializerMethodField()
    baseline = serializers.SerializerMethodField()
    lop_target = serializers.SerializerMethodField()
    data_collection_frequency = serializers.SerializerMethodField()
    reporting_frequency = serializers.SerializerMethodField()
    quality_assurance_techniques = serializers.SerializerMethodField()

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

    @staticmethod
    def get_quality_assurance_techniques(indicator):
        """returns the list of quality assurance techniques in alphabetical order in the display language"""
        return ", ".join(sorted([x.strip() for x in indicator.get_quality_assurance_techniques_display().split(',')]))

    @staticmethod
    def get_reporting_frequency(indicator):
        """returns a string with a comma separated list of reporting frequencies"""
        if indicator.reporting_frequencies.exists():
            frequency_list = indicator.reporting_frequencies.all().order_by('sort_order').values_list('frequency', flat=True)
            return ", ".join([gettext(frequency) for frequency in frequency_list])
        return None

    @staticmethod
    def get_data_collection_frequency(indicator):
        """returns a string with a comma separated list of data collection frequencies"""
        if indicator.data_collection_frequencies.exists():
            frequency_list = indicator.data_collection_frequencies\
                .all().order_by('sort_order').values_list('frequency', flat=True)
            return ", ".join([gettext(frequency) for frequency in frequency_list])
        return None

    @staticmethod
    def get_lop_target(indicator):
        return indicator.calculated_lop_target

    @staticmethod
    def get_tier_name_only(indicator):
        if indicator.results_framework and indicator.level and indicator.level.leveltier:
            return indicator.level.leveltier.name
        elif not indicator.results_framework and indicator.old_level:
            return indicator.old_level
        return None

    @staticmethod
    def get_is_cumulative(indicator):
        if indicator.target_frequency == Indicator.LOP:
            return None
        return indicator.is_cumulative

    @staticmethod
    def get_baseline(indicator):
        if indicator.baseline_na:
            return None
        return indicator.baseline

    def to_representation(self, instance):
        """Overrides to_representation to attempt to render (format) data for web/excel as needed"""
        data = super().to_representation(instance)
        for field in data:
            data[field] = self.render_value(field, instance, data)
        return data


class IndicatorFormatsMixin:
    """Base class for a formatter mixin to output web/excel data differently"""

    # field names which should be (attempted) translated
    translateable_fields = (
        'tier_name_only',
        'get_direction_of_change_display',
        'get_unit_of_measure_type_display',
    )

    # field names for which a custom formatter method is required:
    method_fields = (
        'is_cumulative',
        'disaggregation',
    )

    # fields which should be rendered as a bulleted list
    bullet_list_fields = (
        'disaggregation',
    )

    # fields which should be rendered as an output-appropriate number
    numeric_fields = (
        'baseline',
        'lop_target',
    )

    # fields for which an empty value should be rendered as "–"
    em_dash_fields = (
        'results_aware_number',
    )

    # fields for which an empty value should be rendered as "N/A"
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
        """Disaggregations should (attempt to be) translated individually"""
        return [self.get_translated(v) for v in value] if value else None

    def format_list(self, value):
        """returns a bulleted list"""
        return value if value is None else "\n".join('-{}'.format(item) for item in value)

    def render_value(self, field, instance, data):
        """formatter workhorse - called in to_representation, uses class property field lists to apply custom

            formatting to different fields as needed
        """
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
                value = ''
        return value


class IndicatorWebMixin(IndicatorFormatsMixin):
    """An implemetnation of the IndicatorFormatsMixin appropriate for web JSON output"""

    @staticmethod
    def get_translated(value):
        """For web, translation should be lazy, for performance reasons"""
        return value if value is None else gettext_lazy(value)

    @staticmethod
    def format_numeric(value, indicator, decimal_places=2):
        """For web, use formats.number_format locale-aware formatter to produce a unicode string formatted correctly"""
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
                value = '{}%'.format(value)
            return value


class IndicatorExcelMixin(IndicatorFormatsMixin):
    """An implementation of the IndicatorFormatsMixin appropriate for providing data to an Excel renderer"""

    @staticmethod
    def get_translated(value):
        """For excel, translation must be non-lazy so Excel renderer recognizes it as a string"""
        return value if value is None else gettext(value)

    def format_numeric(self, value, indicator, decimal_places=2):
        """For excel, produce rounded {value: number_format:} dict for Excel to format in place"""
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

    @staticmethod
    def format_percentage(value, indicator, decimal_places=2):
        """For excel, produce rounded {value: numberformat:} dict for Excel to format as percentage in place"""
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
        """Overrides render_value to handle special cases (dicts and Nones) and add 'field': field in case of dict"""
        value = super().render_value(field, instance, data)
        if type(value) == dict and 'value' in value:
            pass
        elif value is None:
            value = {
                'value': '',
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


# Combination of IP base serializer with the web (JSON) output formatter:
class IndicatorPlanIndicatorWebSerializer(IndicatorWebMixin, IndicatorPlanIndicatorSerializerBase):
    pass

# combination of IP base serializer with the Excel output formatter:
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

    @staticmethod
    def get_display_name(level):
        tier = gettext(level.leveltier.name) if level.leveltier else ''
        ontology = level.display_ontology if level.display_ontology else ''
        name = str(level.name)
        return '{tier}{tier_space}{ontology}{colon}{name}'.format(
            tier=tier,
            tier_space=' ' if tier and ontology else '',
            ontology=ontology,
            colon=': ' if (tier or ontology) else '',
            name=name
        )


# the only difference between the web and excel LEVEL serializer is which child indicator serializer is used:
class IndicatorPlanLevelWebSerializer(IndicatorPlanLevelSerializerBase):
    indicator_set = IndicatorPlanIndicatorWebSerializer(many=True, read_only=True)


class IndicatorPlanLevelExcelSerializer(IndicatorPlanLevelSerializerBase):
    indicator_set = IndicatorPlanIndicatorExcelSerializer(many=True, read_only=True)
