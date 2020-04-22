from indicators.models import LevelTier, Level
from tola.model_utils import get_serializer
from rest_framework import serializers
from django.utils.translation import ugettext as _

class TierBaseSerializerMixin:
    name = serializers.SerializerMethodField()

    class Meta:
        model = LevelTier
        fields = [
            'program_id',
            'pk',
            'name',
            'tier_depth'
        ]

    @classmethod
    def _get_query_fields(cls):
        return ['pk', 'name', 'tier_depth', 'program_id']

    @classmethod
    def _get_queryset(cls):
        return LevelTier.objects.select_related(None).prefetch_related(None).only(*cls._get_query_fields())

    @classmethod
    def load_for_program(cls, program_pk, **kwargs):
        context = kwargs.get('context', {})
        return cls(cls._get_queryset().filter(program_id=program_pk), context=context, many=True)

    def get_name(self, tier):
        return _(tier.name)


class LevelBaseSerializerMixin:
    ontology = serializers.SerializerMethodField()
    tier_name = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()

    class Meta:
        model = Level
        fields = [
            'program_id',
            'pk',
            'name',
            'ontology',
            'tier_name',
            'parent_id'
        ]

    @classmethod
    def _get_query_fields(cls):
        return ['pk', 'name', 'customsort', 'parent_id', 'program_id']

    @classmethod
    def _get_queryset(cls, **kwargs):
        filters = kwargs.get('filters', {})
        return Level.objects.select_related(None).prefetch_related(None).only(
            *cls._get_query_fields()).filter(**filters)

    @classmethod
    def load_for_program(cls, program_pk, **kwargs):
        context = kwargs.get('context', {})
        filters = {**kwargs.get('filters', {}), 'program_id': program_pk}
        return cls(cls._get_queryset(filters=filters), context=context, many=True)

    def _get_tiers(self, level):
        if hasattr(self, 'context') and 'tiers' in self.context:
            return self.context['tiers']
        return level.program.level_tiers.all()

    def _get_levels(self, level):
        if hasattr(self, 'parent'):
            return self.parent.instance
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
            return _(self._get_level_tier(level).get('name', ''))
        return None

    def get_name(self, level):
        return level.name


TierBaseSerializer = get_serializer(TierBaseSerializerMixin)

LevelBaseSerializer = get_serializer(LevelBaseSerializerMixin)