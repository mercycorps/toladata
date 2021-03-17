# -*- coding: utf-8 -*-
"""Serializers for workflow model data, specific to view use cases."""
from rest_framework import serializers

from workflow.models import Program
from indicators.models import Level, Indicator
from django.shortcuts import reverse
from django.db import models
from django.utils.translation import ugettext_lazy as _


class LogframeIndicatorSerializer(serializers.ModelSerializer):
    """Nested serializer for indicators in LogFrame web/excel views

        Called by LogframeLevelSerializer as a child serializer
    """
    level = serializers.PrimaryKeyRelatedField(read_only=True)
    level_order_display = serializers.CharField(read_only=True)
    auto_number_indicators = serializers.BooleanField(read_only=True)

    class Meta:
        model = Indicator
        fields = [
            'pk',
            'name',
            'means_of_verification',
            'level',
            'level_order_display',
            'level_order',
            'number',
            'auto_number_indicators'
        ]

class LogframeUnassignedIndicatorSerializer(serializers.ModelSerializer):
    """Nested serializer for indicators which have no RF Level in LogFrame web/excel views

        Called by LogframeProgramSerializer
    """
    class Meta:
        model = Indicator
        fields = [
            'pk',
            'name',
            'means_of_verification',
            'number',
            'auto_number_indicators',
        ]



class LogframeLevelSerializer(serializers.ModelSerializer):
    """Nested serializer for RF Levels in LogFrame web/excel views

        Called by LogframeProgramSerializer
        includes child serializer for indicators assigned to this level
    """
    display_name = serializers.SerializerMethodField()
    level_depth = serializers.SerializerMethodField()
    indicators = LogframeIndicatorSerializer(many=True, read_only=True, source='indicator_set')
    child_levels = serializers.SerializerMethodField() # list of ints, pks of child levels
    display_ontology = serializers.SerializerMethodField()
    ontology = serializers.SerializerMethodField()

    class Meta:
        model = Level
        fields = [
            'pk',
            'display_name',
            'level_depth',
            'ontology',
            'display_ontology',
            'indicators',
            'assumptions',
            'child_levels'
        ]

    # serializer method fields and helper fields for serializer method fields:

    @staticmethod
    def get_child_levels(this_level):
        return [lvl.pk for lvl in this_level.program.levels.all() if lvl.parent_id == this_level.pk]

    @staticmethod
    def get_parent(this_level):
        if this_level.parent_id is not None:
            return [lvl for lvl in this_level.program.levels.all() if lvl.pk == this_level.parent_id][0]
        return None

    def get_level_depth(self, obj):
        depth = 1
        target = self.get_parent(obj)
        while target is not None:
            depth += 1
            target = self.get_parent(target)
        return depth

    def get_leveltier(self, obj):
        tiers = obj.program.level_tiers.all()
        if len(tiers) > self.get_level_depth(obj) - 1:
            return tiers[self.get_level_depth(obj) - 1]
        return None

    def get_display_ontology(self, obj):
        target = obj
        ontology = []
        while self.get_parent(target) is not None:
            ontology = [str(target.customsort)] + ontology
            target = self.get_parent(target)
        return '.'.join(ontology)

    def get_ontology(self, obj):
        target = obj
        ontology = []
        while True:
            ontology = [str(target.customsort)] + ontology
            target = self.get_parent(target)
            if not target:
                break
        tier_count = len(obj.program.level_tiers.all())
        missing_tiers = tier_count - self.get_level_depth(obj)
        ontology += missing_tiers * ['0']
        return '.'.join(ontology)

    def get_display_name(self, obj):
        parts = []
        leveltier = self.get_leveltier(obj)
        if leveltier is not None:
            parts.append(str(_(leveltier.name)))
        display_ontology = self.get_display_ontology(obj)
        if display_ontology:
            parts.append(display_ontology)
        label = '{}: '.format(' '.join(parts)) if parts else ''
        return '{}{}'.format(label, obj.name)


class ResultsFrameworkProgramSerializer(serializers.ModelSerializer):
    """Lightweight serializer for RF Builder web view"""
    manual_numbering = serializers.BooleanField(read_only=True)

    class Meta:
        model = Program
        fields = ['id', 'manual_numbering']


class LogframeProgramSerializer(serializers.ModelSerializer):
    """Main serializer for LogFrame web/excel views

        Child serializers:
            - LogframeLevelSerializer for all RF levels (includes subordinate indicators)
            - LogframeUnassignedIndicatorSerialiszer for all indicators with no RF level
    """
    results_framework_url = serializers.SerializerMethodField()
    program_page_url = serializers.CharField()
    results_framework = serializers.BooleanField()
    manual_numbering = serializers.BooleanField(read_only=True)
    rf_chain_sort_label = serializers.SerializerMethodField()
    levels = LogframeLevelSerializer(many=True, read_only=True)
    unassigned_indicators = LogframeUnassignedIndicatorSerializer(many=True, read_only=True)


    class Meta:
        model = Program
        fields = [
            'pk',
            'name',
            'results_framework_url',
            'program_page_url',
            'results_framework',
            'manual_numbering',
            'rf_chain_sort_label',
            'levels',
            'unassigned_indicators'
        ]

    @classmethod
    def load(cls, pk):
        """Main entry point for both web and excel views, takes program pk and returns serialized data"""
        indicator_prefetch = models.Prefetch(
            'indicator_set',
            queryset=Indicator.objects.filter(level__isnull=True).only(
                'pk', 'name', 'means_of_verification', 'program', 'sector', 'number'
            ),
            to_attr='unassigned_indicators'
        )
        program = Program.rf_aware_objects.only(
            'pk', 'name', '_using_results_framework', 'auto_number_indicators'
        ).prefetch_related(
            'level_tiers',
            'levels',
            'levels__indicator_set',
            indicator_prefetch
        ).get(pk=pk)
        return cls(program)

    @staticmethod
    def get_results_framework_url(program):
        return reverse('results_framework_builder', kwargs={'program_id': program.pk})

    @staticmethod
    def get_rf_chain_sort_label(program):
        second_tier = [leveltier for leveltier in program.level_tiers.all() if leveltier.tier_depth == 2]
        if second_tier:
            # Translators: see note for %(tier)s chain, this is the same thing
            return _('by %(level_name)s chain') % {'level_name': _(second_tier[0].name)}
        return None
