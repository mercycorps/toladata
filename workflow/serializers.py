# -*- coding: utf-8 -*-
"""Serializers for workflow model data, specific to view use cases."""
import json
import operator
from rest_framework import serializers
from django.shortcuts import reverse
from django.db import models
from django.utils.translation import ugettext_lazy as _, ugettext


from workflow.models import Program, Documentation, ProjectAgreement

from indicators.models import LevelTier, Level, Indicator, PeriodicTarget

class ProgramPagePeriodicTargetSerializer(serializers.ModelSerializer):
    class Meta:
        model = PeriodicTarget
        fields = [
            'pk',
            'target',
            'start_date',
            'end_date',
            'customsort'
        ]

    @classmethod
    def get_queryset(cls):
        return PeriodicTarget.objects.only(
            'indicator_id', 'target', 'start_date', 'end_date', 'customsort'
        )

class BaseIndicatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Indicator
        fields = [
            'pk',
            'name'
        ]

class ProgramPageIndicatorSerializer(BaseIndicatorSerializer):
    periodictargets = ProgramPagePeriodicTargetSerializer
    level = serializers.SerializerMethodField()

    class Meta(BaseIndicatorSerializer.Meta):
        fields = BaseIndicatorSerializer.Meta.fields + [
            'level',
            'number'
        ]

    @classmethod
    def get_queryset(cls):
        targets_prefetch = models.Prefetch(
            'periodictargets',
            ProgramPagePeriodicTargetSerializer.get_queryset(),
        )
        newest_end_date_annotation = models.Subquery(
            PeriodicTarget.objects.filter(
                indicator=models.OuterRef('pk')
            ).order_by('-end_date').values('end_date')[:1]
        )
        return Indicator.rf_aware_objects.select_related('program').annotate(
            using_results_framework=models.Case(
                models.When(
                    program___using_results_framework=Program.NOT_MIGRATED,
                    then=models.Value(False)
                    ),
                default=models.Value(True),
                output_field=models.BooleanField()
                )
        ).select_related(None).only(
            'pk', 'name', 'program_id', 'target_frequency', 'level_id', 'number', 'level_order'
        ).annotate(
            newest_end_date=newest_end_date_annotation
        ).prefetch_related(
            targets_prefetch
        )

    def get_level(self, indicator):
        if indicator.using_results_framework:
            return indicator.level_id or None
        else:
            return indicator.old_level_pk


class BaseLevelTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = LevelTier
        fields = [
            'name',
            'tier_depth'
        ]


class BaseProgramOptimizedSerializer(serializers.ModelSerializer):
    results_framework = serializers.BooleanField()
    levels = serializers.SerializerMethodField()

    class Meta:
        model = Program
        fields = [
            'pk',
            'name',
            'results_framework',
        ]

    @classmethod
    def get_program_fields(cls):
        return [
            'pk', 'name', '_using_results_framework', 'auto_number_indicators',
        ]

    @classmethod
    def get_prefetches(cls):
        return []

    @classmethod
    def load(cls, pk):
        program = Program.active_programs.only(
            *cls.get_program_fields()
        ).prefetch_related(
            *cls.get_prefetches()
        ).get(pk=pk)
        return cls(program)


    def get_rf_chain_sort_label(self, program):
        second_tier = [lt for lt in program.level_tiers.all() if lt.tier_depth == 2]
        if second_tier:
            # Translators: see note for %(tier)s chain, this is the same thing
            return _('by %(level_name)s chain') % {'level_name': _(second_tier[0].name)}
        return None

    def get_levels(self, program):
        if not program.results_framework:
            return [{'pk': depth, 'depth': depth, 'label': ugettext(label)} for (depth, label) in Indicator.OLD_LEVELS]
        return []

    @property
    def json(self):
        return json.dumps(self.data)


class ProgramPageProgramSerializer(BaseProgramOptimizedSerializer):
    id = serializers.IntegerField(read_only=True, source='pk')
    rf_chain_sort_label = serializers.SerializerMethodField()
    does_it_need_additional_target_periods = serializers.SerializerMethodField()
    indicators = serializers.SerializerMethodField()

    class Meta(BaseProgramOptimizedSerializer.Meta):
        fields = BaseProgramOptimizedSerializer.Meta.fields + [
            'id',
            'reporting_period_start',
            'reporting_period_end',
            'rf_chain_sort_label',
            'does_it_need_additional_target_periods',
            'indicators',
            'levels',
        ]

    @classmethod
    def get_program_fields(cls):
        return super(ProgramPageProgramSerializer, cls).get_program_fields() + [
            'reporting_period_start', 'reporting_period_end'
        ]

    @classmethod
    def get_prefetches(cls):
        prefetches = super(ProgramPageProgramSerializer, cls).get_prefetches()
        levels_prefetch = models.Prefetch(
            'levels',
            queryset=Level.objects.select_related(None).only(
                'pk', 'name', 'parent', 'customsort', 'program'
            )
        )
        indicators_prefetch = models.Prefetch(
            'indicator_set',
            queryset=ProgramPageIndicatorSerializer.get_queryset(),
            to_attr='annotated_indicators'
        )
        return prefetches + [
            levels_prefetch,
            'level_tiers',
            indicators_prefetch,
        ]

    def get_indicators(self, program):
        annotated_indicators = sorted(program.annotated_indicators, key=lambda i: (i.sort_number is None, i.sort_number))
        indicators_data = ProgramPageIndicatorSerializer(annotated_indicators, many=True).data
        if program.results_framework:
            return indicators_data
        formatted_data = []
        for depth, label in Indicator.OLD_LEVELS + [(None, '')]:
            level_indicators = [dict(data, **{'level_order': count}) for count, data in enumerate([d for d in indicators_data if d['level'] == depth])]
            formatted_data += level_indicators
        return {data['pk']: data for data in formatted_data}

    def get_does_it_need_additional_target_periods(self, program):
        if program.reporting_period_end is None:
            return False
        end_dates = [i.newest_end_date for i in program.annotated_indicators if i.newest_end_date]
        if not end_dates:
            return False
        min_end_date_across_all_indicators = min(end_dates)
        if not min_end_date_across_all_indicators:
            return False
        if program.reporting_period_end > min_end_date_across_all_indicators:
            return True
        return False


class DocumentListProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = [
            'id',
            'gaitid',
            'name',
        ]


class DocumentListProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectAgreement
        fields = [
            'id',
            'project_name',
        ]


class DocumentListDocumentSerializer(serializers.ModelSerializer):
    project = DocumentListProjectSerializer(read_only=True)

    class Meta:
        model = Documentation
        fields = [
            'id',
            'name',
            'create_date',
            'program',
            'project',
            'url',
        ]

class LogframeIndicatorSerializer(serializers.ModelSerializer):
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
    display_name = serializers.SerializerMethodField()
    level_depth = serializers.SerializerMethodField()
    indicators = LogframeIndicatorSerializer(many=True, read_only=True, source='indicator_set')
    child_levels = serializers.SerializerMethodField()
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

    def get_child_levels(self, obj):
        return [lvl.pk for lvl in obj.program.levels.all() if lvl.parent_id == obj.pk]

    def get_parent(self, obj):
        if obj.parent_id is not None:
            return [lvl for lvl in obj.program.levels.all() if lvl.pk == obj.parent_id][0]

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
            parts.append(unicode(_(leveltier.name)))
        display_ontology = self.get_display_ontology(obj)
        if display_ontology:
            parts.append(display_ontology)
        label = u'{}: '.format(u' '.join(parts)) if parts else u''
        return u'{}{}'.format(label, obj.name)


class ResultsFrameworkProgramSerializer(serializers.ModelSerializer):
    manual_numbering = serializers.BooleanField(read_only=True)

    class Meta:
        model = Program
        fields = ['id', 'manual_numbering']


class LogframeProgramSerializer(serializers.ModelSerializer):
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
        indicator_prefetch = models.Prefetch(
            'indicator_set',
            queryset=Indicator.objects.filter(level__isnull=True).only(
                'pk', 'name', 'means_of_verification', 'program', 'sector', 'number'
            ),
            to_attr='unassigned_indicators'
        )
        program = Program.active_programs.only(
            'pk', 'name', '_using_results_framework', 'auto_number_indicators'
        ).prefetch_related(
            'level_tiers',
            'levels',
            'levels__indicator_set',
            indicator_prefetch
        ).get(pk=pk)
        return cls(program)

    def get_results_framework_url(self, obj):
        return reverse('results_framework_builder', kwargs={'program_id': obj.pk})

    def get_rf_chain_sort_label(self, obj):
        second_tier = [lt for lt in obj.level_tiers.all() if lt.tier_depth == 2]
        if second_tier:
            # Translators: see note for %(tier)s chain, this is the same thing
            return _('by %(level_name)s chain') % {'level_name': _(second_tier[0].name)}
        return None
