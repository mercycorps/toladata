from rest_framework import serializers
from django.utils.translation import gettext
from indicators.serializers_new.tier_and_level_serializers import LevelBaseSerializerMixin
from indicators.models import Indicator, Level
from tola.model_utils import get_serializer
from tola.serializers import make_quantized_decimal
from workflow.models import Program
from workflow.serializers_new.iptt_program_serializers import (ProgramBaseSerializerMixin, ProgramRFOrderingMixin)


BulkImportTemplateSerializer = get_serializer(
    LevelBaseSerializerMixin,
    ProgramRFOrderingMixin,
    ProgramBaseSerializerMixin,
)


class BulkImportIndicatorSerializer(serializers.ModelSerializer):
    display_ontology_letter = serializers.SerializerMethodField()
    unit_of_measure = serializers.CharField(required=True)
    unit_of_measure_type = serializers.SerializerMethodField()
    direction_of_change = serializers.SerializerMethodField()
    target_frequency = serializers.SerializerMethodField()
    sector = serializers.SerializerMethodField()

    class Meta:
        model = Indicator
        fields = [
            'name',
            'number',
            'display_ontology_letter',
            'sector',
            'source',
            'definition',
            'justification',
            'unit_of_measure',
            'unit_of_measure_type',
            'rationale_for_target',
            'baseline',
            'direction_of_change',
            'target_frequency',
            'means_of_verification',
            'data_collection_method',
            'data_points',
            'responsible_person',
            'method_of_analysis',
            'information_use',
            'quality_assurance',
            'data_issues',
            'comments'
        ]

    # These methods are testing for what type of object is being passed so the same serializer can be used
    # for serialization and deserialization.  This is useful for the baseline field.  Since we need to
    # process the value for the internal value calculation, we might as well be able to use it in the view.
    @staticmethod
    def get_display_ontology_letter(obj):
        return obj.level_order_display if type(obj) == Indicator else None

    @staticmethod
    def get_direction_of_change(obj):
        return dict(Indicator.DIRECTION_OF_CHANGE)[obj.direction_of_change] if type(obj) == Indicator else None

    @staticmethod
    def get_target_frequency(obj):
        if type(obj) == Indicator:
            return None if obj.target_frequency is None else dict(Indicator.TARGET_FREQUENCIES)[obj.target_frequency]
        else:
            return None

    @staticmethod
    def get_unit_of_measure_type(obj):
        return dict(Indicator.UNIT_OF_MEASURE_TYPES)[obj.unit_of_measure_type] if type(obj) == Indicator else None

    @staticmethod
    def get_sector(obj):
        if type(obj) == Indicator:
            return None if not obj.sector else obj.sector.sector
        else:
            return None

    def to_internal_value(self, data):
        """Handle special values of indicator fields"""
        from indicators.views.bulk_indicator_import_views import NULL_EQUIVALENTS  # Avoid circular import
        null_equivalents_with_translations = [ne.lower() for ne in NULL_EQUIVALENTS] + \
            [gettext(ne).lower() for ne in NULL_EQUIVALENTS]
        values = super().to_internal_value(data)

        if 'baseline' not in values or values['baseline'] is None:
            # Translators:  The is an error message presented to users when they have entered an invalid value in a form field that takes only numbers or some version of "Not applcable"
            raise serializers.ValidationError({'baseline': [gettext('Baseline should be a number or N/A')]})
        elif values['baseline'].lower() in null_equivalents_with_translations:
            values['baseline'] = None
        else:
            try:
                values['baseline'] = make_quantized_decimal(values['baseline'])
            except ValueError:
                raise serializers.ValidationError({'baseline': [gettext('Baseline should be a number or N/A')]})
            if values['baseline'] is None:
                # Translators:  This is a fallback error message provided to users when, for some unknown reason, the value they entered in a form can't be processed
                raise serializers.ValidationError({'baseline': [gettext('Could not process baseline value')]})

        return values

    def create(self, validated_data):
        return Indicator.objects.create(**validated_data)


class BulkImportProgramSerializer(serializers.ModelSerializer):
    indicator_set = BulkImportIndicatorSerializer(many=True)

    class Meta:
        model = Program
        fields = [
            'pk',
            'name',
            'indicator_set'
        ]


class BulkImportSerializer(serializers.ModelSerializer):
    """
    Must include an ordered tier list in context
    """
    tier_name = serializers.SerializerMethodField()
    ontology = serializers.SerializerMethodField()
    display_ontology = serializers.SerializerMethodField()
    level_name = serializers.CharField(source='name')
    indicator_set = BulkImportIndicatorSerializer(many=True)

    class Meta:
        model = Level
        fields = [
            'level_name',
            'tier_name',
            'customsort',
            'indicator_set',
            'ontology',
            'display_ontology'

        ]

    @staticmethod
    def get_tier_name(obj):
        return obj.leveltier.name

    @staticmethod
    def get_ontology(obj):
        return obj.ontology

    @staticmethod
    def get_display_ontology(obj):
        return obj.display_ontology
