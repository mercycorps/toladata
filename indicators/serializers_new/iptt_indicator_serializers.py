import operator
from rest_framework import serializers
from indicators.models import (
    IndicatorType,
    Result,
    DisaggregationLabel,
    DisaggregationType
)
from indicators.queries import IPTTIndicator
from workflow.models import (
    Program,
    SiteProfile
)
from tola.model_utils import get_serializer
from django.db import models
from django.utils.translation import ugettext as _
from .indicator_serializers import (
    IndicatorOrderingMixin,
    IndicatorMeasurementMixin,
    IndicatorBaseSerializerMixin
)

class IPTTIndicatorFiltersMixin:
    """ provides pks for filterable items for the web IPTT (sector, type, site, disaggregation)
    """

    sector_pk = serializers.IntegerField(source='sector_id')
    indicator_type_pks = serializers.SerializerMethodField()
    site_pks = serializers.SerializerMethodField()
    disaggregation_pks = serializers.SerializerMethodField()

    class Meta:
        fields = [
            'sector_pk',
            'indicator_type_pks',
            'site_pks',
            'disaggregation_pks',
        ]

    @classmethod
    def _get_query_fields(cls):
        return super()._get_query_fields() + [
            'sector_id'
        ]

    @classmethod
    def get_queryset(cls, **kwargs):
        qs = super().get_queryset(**kwargs)
        qs = qs.prefetch_related(
            models.Prefetch(
                'indicator_type',
                queryset=IndicatorType.objects.select_related(None).prefetch_related(None).only('pk'),
                to_attr='prefetch_indicator_type_pks'
            ),
            models.Prefetch(
                'result_set',
                queryset=Result.objects.select_related(None).prefetch_related(None).only(
                    'pk', 'indicator_id'
                ).prefetch_related(models.Prefetch(
                    'site', queryset=SiteProfile.objects.select_related(None).prefetch_related(None).only('pk'),
                    to_attr='prefetch_site_pks')), to_attr='prefetch_results'
            ),
            models.Prefetch(
                'disaggregation',
                queryset=DisaggregationType.objects.select_related(None).prefetch_related(None).only('pk'),
                to_attr='prefetch_disaggregation_pks'
            )
        )
        return qs

    def get_indicator_type_pks(self, indicator):
        return sorted(set(it.pk for it in indicator.prefetch_indicator_type_pks))

    def get_site_pks(self, indicator):
        return sorted(set(site.pk for result in indicator.prefetch_results for site in result.prefetch_site_pks))

    def get_disaggregation_pks(self, indicator):
        return sorted(set(disaggregation_type.pk for disaggregation_type in indicator.prefetch_disaggregation_pks))


# used in JSON endpoint for iPTT (react data) to provide labels, configuration, and filter items for indicators
IPTTJSONIndicatorLabelsSerializer = get_serializer(
    IPTTIndicatorFiltersMixin,
    IndicatorOrderingMixin,
    IndicatorMeasurementMixin,
    IndicatorBaseSerializerMixin
)

# EXCEL export specific serializers:


class DisaggregationBase:
    name = serializers.CharField(source='disaggregation_type')
    labels = serializers.SerializerMethodField()

    class Meta:
        model = DisaggregationType
        fields = [
            'pk',
            'name',
            'labels',
        ]

    def get_labels(self, disagg):
        labels = self.context.get('labels_map', {}).get(disagg.pk, None)
        if labels is None:
            raise NotImplementedError("no prefetch disaggs")
        return [{'pk': label.pk, 'name': label.label} for label in labels]

class IPTTDisaggregationMixin:
    has_results = serializers.SerializerMethodField()

    class Meta:
        fields = [
            'has_results',
        ]

    def get_has_results(self, disagg):
        if disagg.pk in self.context.get('with_results', []):
            return True
        return False

IPTTDisaggregationSerializer = get_serializer(
    IPTTDisaggregationMixin,
    DisaggregationBase,
)


class IPTTExcelIndicatorMixin:
    program_pk = serializers.IntegerField(source='program_id')
    number = serializers.SerializerMethodField(method_name='get_long_number')
    disaggregations = serializers.SerializerMethodField()
    no_rf_level = serializers.SerializerMethodField()

    class Meta:
        fields = [
            'program_pk',
            'number',
            'is_cumulative_display',
            'disaggregations',
            'no_rf_level',
        ]

    def _get_rf_long_number(self, indicator):
        level_set = self.context.get('levels', indicator.program.levels.all())
        level = [l for l in level_set if l.pk == indicator.level_id]
        if not level:
            return None
        level_depth, display_ontology = self._get_level_depth_ontology(level[0], level_set)
        leveltier = [t for t in self.context.get(
            'tiers', indicator.program.level_tiers.all()
            ) if t.tier_depth == level_depth]
        if not leveltier:
            leveltier_name = u''
        else:
            leveltier_name = u'{} '.format(_(leveltier[0].name))
        return u"{}{}{}".format(
            leveltier_name, display_ontology, self._get_level_order_display(indicator)
        )

    def get_disaggregations(self, indicator):
        disaggregation_map = self.context.get('disaggregations')
        disaggregation_labels = {}
        disaggregation_objects = []
        disagg_list = self.context.get('disaggregations_indicators').get(indicator.pk, {})
        for disaggregation_dict in [
            disaggregation_map.get(d_pk) for d_pk in disagg_list.get('all', [])
        ]:
            disaggregation = disaggregation_dict.get('disaggregation', None)
            labels = disaggregation_dict.get('labels', [])
            disaggregation_objects.append(disaggregation)
            disaggregation_labels[disaggregation.pk] = labels
        disaggregation_context = {
            **self.context.get('disaggregation_context', {}),
            'labels_map': disaggregation_labels,
            'with_results': disagg_list.get('with_results', []),
        }
        return sorted(
            IPTTDisaggregationSerializer(
                disaggregation_objects, context=disaggregation_context, many=True
                ).data,
            key=operator.itemgetter('name')
        )


    def get_no_rf_level(self, indicator):
        return (not indicator.results_framework or not indicator.level_id)


IPTTExcelIndicatorSerializer = get_serializer(
    IPTTExcelIndicatorMixin,
    IndicatorOrderingMixin,
    IndicatorMeasurementMixin,
    IndicatorBaseSerializerMixin
)