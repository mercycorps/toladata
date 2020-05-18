"""Serializers for Level and LevelTier objects for various applications site-wide"""

from indicators.models import LevelTier, Level
from tola.model_utils import get_serializer
from rest_framework import serializers
from django.utils.translation import ugettext as _

class TierBaseSerializerMixin:
    """Serializer component for LevelTier objects for basic data needed in most applications"""
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

    @staticmethod
    def get_name(tier):
        return _(tier.name)


class LevelBaseSerializerMixin:
    """Serializer component for Level objects for basic data needed in most applications"""
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

    # class methods used to instantiate serializer with minimal queries

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

    # helper methods for serializer method fields - mostly to avoid querying database when traversing related objects

    def _get_tiers(self, level):
        if hasattr(self, 'context') and 'tiers' in self.context:
            return self.context['tiers']
        return level.program.level_tiers.all()

    def _get_levels(self, level):
        if hasattr(self, 'parent'): # initiated with "many=True" - parent instance will be levels queryset
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

    # serializer method fields:

    def get_ontology(self, level):
        target = level
        ontology = []
        while self._get_parent(target) is not None:
            ontology = [str(target.customsort)] + ontology
            target = self._get_parent(target)
        return '.'.join(ontology)

    def get_tier_name(self, level):
        if self._get_level_tier(level):
            return self._get_level_tier(level).get('name', '')
        return None

    @staticmethod
    def get_name(level):
        return level.name


class IPTTLevelMixin:
    """Mixin adding IPTT-specific level data to Level serializer object"""
    tier_pk = serializers.SerializerMethodField()
    tier_depth = serializers.SerializerMethodField(method_name='_get_level_depth')
    chain_pk = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()

    class Meta:
        fields = [
            'tier_pk',
            'tier_depth',
            'chain_pk',
            'full_name'
        ]

    def get_tier_pk(self, level):
        if self._get_level_tier(level):
            return self._get_level_tier(level).get('pk', None)
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

    def get_full_name(self, level):
        tier = self.get_tier_name(level) or ""
        ontology = self.get_ontology(level) or ""
        ontology = f' {ontology}' if ontology else ""
        return f'{tier}{ontology}: {level.name}' if tier else level.name



TierBaseSerializer = get_serializer(TierBaseSerializerMixin)

LevelBaseSerializer = get_serializer(LevelBaseSerializerMixin)

IPTTLevelSerializer = get_serializer(IPTTLevelMixin, LevelBaseSerializerMixin)
