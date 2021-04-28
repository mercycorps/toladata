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
    level_display_ontology = serializers.SerializerMethodField()

    class Meta:
        model = Indicator
        fields = [
            'name',
            'level_display_ontology',
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
    def get_level_display_ontology(obj):
        return obj.level_display_ontology


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
