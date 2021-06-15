from rest_framework import serializers
from workflow.serializers_new.iptt_program_serializers import (ProgramBaseSerializerMixin, ProgramRFOrderingMixin)
from indicators.serializers_new.tier_and_level_serializers import LevelBaseSerializerMixin
from tola.model_utils import get_serializer
from indicators.models import Indicator, Level
from workflow.models import Program


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

    @staticmethod
    def get_display_ontology_letter(obj):
        return obj.level_order_display

    @staticmethod
    def get_direction_of_change(obj):
        return dict(Indicator.DIRECTION_OF_CHANGE)[obj.direction_of_change]

    @staticmethod
    def get_target_frequency(obj):
        return None if obj.target_frequency is None else dict(Indicator.TARGET_FREQUENCIES)[obj.target_frequency]

    @staticmethod
    def get_unit_of_measure_type(obj):
        return dict(Indicator.UNIT_OF_MEASURE_TYPES)[obj.unit_of_measure_type]

    @staticmethod
    def get_sector(obj):
        return None if not obj.sector else obj.sector.sector

    def to_internal_value(self, data):
        """Handle special values of indicator fields"""
        values = super().to_internal_value(data)

        if 'baseline' not in values or values['baseline'] is None:
            raise serializers.ValidationError({'baseline': ['Baseline should be a number or N/A']})

        baseline = values['baseline']
        try:
            baseline = int(baseline)
        except ValueError:
            null_equivalents = ['n/a', 'na', 'not applicable']
            if baseline.lower in null_equivalents:
                baseline = None
            else:
                raise serializers.ValidationError({'baseline': ['Baseline should be a number or N/A']})
        values['baseline'] = baseline

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
