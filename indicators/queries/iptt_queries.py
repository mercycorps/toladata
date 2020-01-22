"""Querymanagers and proxymodels to abstract complex queries on indicator models

"""

from indicators.models import (
    Indicator,
    Level,
    PeriodicTarget,
    Result,
    DisaggregationType,
    DisaggregationLabel,
    IndicatorSortingManagerMixin,
    IndicatorSortingQSMixin
)
from indicators.queries import utils
from workflow.models import Program
from django.db import models
from django.db.models.functions import Concat


class IPTTIndicatorQueryset(models.QuerySet, IndicatorSortingQSMixin):

    def with_prefetch(self):
        qs = self.all()
        qs = qs.select_related(
            'level'
        ).prefetch_related(
            'result_set',
            'result_set__site',
            'indicator_type',
            'program__level_tiers',
            models.Prefetch(
                'disaggregation',
                queryset=DisaggregationType.objects.select_related(None).prefetch_related(
                    models.Prefetch('disaggregationlabel_set', to_attr='prefetch_labels')
                ),
                to_attr="prefetch_disaggregations"
            )
        )
        return qs

    def annotate_old_level(self, qs):
        old_level_whens = [
            models.When(
                models.Q(
                    models.Q(using_results_framework=True) &
                    models.Q(level_id__isnull=False)
                ),
                then=models.Value(0)
            )
        ] + [
            models.When(
                old_level=level_name,
                then=level_pk
            ) for (level_pk, level_name) in Indicator.OLD_LEVELS
        ] + [
            models.When(
                old_level__isnull=True,
                then=None
            ),
        ]
        return qs.annotate(
            old_level_pk=models.Case(
                *old_level_whens,
                default=None,
                output_field=models.IntegerField()
            )
        )

    def with_annotations(self):
        qs = self.with_prefetch()
        qs = qs.annotate(using_results_framework=models.Case(
            models.When(
                program___using_results_framework=Program.NOT_MIGRATED,
                then=models.Value(False)
            ),
            default=models.Value(True),
            output_field=models.BooleanField()
        ))
        # add lop_target_calculated annotation (not used yet, but will replace deprecated lop_target value):
        qs = qs.annotate(lop_target_calculated=utils.indicator_lop_target_calculated_annotation())
        # add lop_actual annotation
        qs = qs.annotate(lop_actual=utils.indicator_lop_actual_annotation())
        # add lop_met_real annotation (this is a float, formatting delivered on front end): 
        qs = qs.annotate(lop_percent_met=utils.indicator_lop_percent_met_annotation())
        qs = self.annotate_old_level(qs).order_by(models.F('old_level_pk').asc(nulls_last=True))
        return qs

    def with_disaggregation_lop_annotations(self, disaggregation_category_pks=[]):
        qs = self.all()
        # add one lop_actual annotation for each disaggregation (targets/percent met to come with a later release)
        annotations = {
            'disaggregation_{}_lop_actual'.format(
                disaggregation_category_pk
            ): utils.indicator_disaggregated_lop_actual_annotation(disaggregation_category_pk)
        for disaggregation_category_pk in disaggregation_category_pks
        }
        qs = qs.annotate(**annotations)
        return qs

    def with_disaggregation_frequency_annotations(self, frequency, start, end, disaggregations=[]):
        qs = self
        if frequency in [Indicator.LOP, Indicator.EVENT]:
            # LOP target timeperiods require no annotations
            pass
        elif frequency == 'all':
            for freq in Indicator.REGULAR_TARGET_FREQUENCIES + tuple([Indicator.MID_END,]):
                qs = qs.with_disaggregation_frequency_annotations(freq, start, end, disaggregations=disaggregations)
        elif frequency == Indicator.MID_END:
            qs = qs.annotate(**{'frequency_{0}_count'.format(frequency): models.Value(2, output_field=models.IntegerField())})
            annotations = {}
            for c in range(2):
                for category_pk in disaggregations:
                    annotations['disaggregation_{0}_frequency_{1}_period_{2}'.format(
                        category_pk, frequency, c
                        )] = utils.mid_end_disaggregated_value_annotation(category_pk, c)
            qs = qs.annotate(**annotations)
        else:
            periods = self.get_periods(frequency, start, end)
            qs = qs.annotate(
                **{'frequency_{0}_count'.format(frequency): models.Value(len(periods), output_field=models.IntegerField())})
            annotations = {}
            for c, period in enumerate(periods):
                for category_pk in disaggregations:
                    annotations['disaggregation_{0}_frequency_{1}_period_{2}'.format(
                        category_pk, frequency, c
                    )] = utils.timeaware_disaggregated_value_annotation(category_pk, period)
            qs = qs.annotate(**annotations)
        return qs


    def apply_filters(self, levels=None, sites=None, types=None,
                      sectors=None, indicators=None, old_levels=False):
        qs = self.all()
        if not any([levels, sites, types, sectors, indicators]):
            return qs
        # if levels (add after Satsuma integration)
        if sites:
            sites_subquery = Result.objects.filter(
                indicator_id=models.OuterRef('pk'),
                site__in=[int(s) for s in sites]
            )
            qs = qs.annotate(
                sites_in_filter=models.Exists(sites_subquery)
                ).filter(sites_in_filter=True)
        if types:
            qs = qs.filter(indicator_type__in=[int(t) for t in types])
        if sectors:
            qs = qs.filter(sector__in=[int(s) for s in sectors])
        if indicators:
            qs = qs.filter(pk__in=[int(i) for i in indicators])
        if old_levels:
            if levels:
                old_level_names = [name for (pk, name) in Indicator.OLD_LEVELS if str(pk) in levels]
                qs = qs.filter(old_level__in=old_level_names)
        else:
            if levels:
                qs = qs.filter(level__in=levels)
        qs = qs.distinct()
        return qs

    def get_periods(self, frequency, start, end):
        return [{'start': p['start'], 'end': p['end']} for p in PeriodicTarget.generate_for_frequency(frequency)(start, end)]

class TVAIPTTQueryset(IPTTIndicatorQueryset):
    def with_frequency_annotations(self, frequency, start, end):
        qs = self
        if frequency == 'all':
            for freq in Indicator.REGULAR_TARGET_FREQUENCIES + tuple([Indicator.MID_END,]):
                qs = qs.with_frequency_annotations(freq, start, end)
            return qs
        if frequency == Indicator.LOP:
            return qs
        elif frequency in Indicator.REGULAR_TARGET_FREQUENCIES:
            periods = self.get_periods(frequency, start, end)
            qs = qs.annotate(
                **{'frequency_{0}_count'.format(frequency): models.Value(len(periods), output_field=models.IntegerField()),
                   'targets_count': utils.targets_count_annotation()})
            annotations = {}
            for c, period in enumerate(periods):
                annotations['frequency_{0}_period_{1}'.format(frequency, c)] = utils.timeaware_value_annotation(period)
                annotations['frequency_{0}_period_{1}_target'.format(frequency, c)] = utils.timeaware_target_annotation(c)
            qs = qs.annotate(**annotations)
        elif frequency == Indicator.MID_END:
            qs = qs.annotate(
                **{'frequency_{0}_count'.format(frequency): models.Value(2, output_field=models.IntegerField())}
            )
            annotations = {}
            for c in range(2):
                annotations['frequency_{0}_period_{1}'.format(frequency, c)] = utils.mid_end_value_annotation(c)
                annotations['frequency_{0}_period_{1}_target'.format(frequency, c)] = utils.mid_end_target_annotation(c)
            qs = qs.annotate(**annotations)
        return qs

class TimeperiodsIPTTQueryset(IPTTIndicatorQueryset):
    def with_frequency_annotations(self, frequency, start, end):
        qs = self
        if frequency in [Indicator.LOP, Indicator.MID_END, Indicator.EVENT]:
            # LOP target timeperiods require no annotations
            return qs
        periods = self.get_periods(frequency, start, end)
        qs = qs.annotate(
            **{'frequency_{0}_count'.format(frequency): models.Value(len(periods), output_field=models.IntegerField())})
        annotations = {}
        for c, period in enumerate(periods):
            annotations['frequency_{0}_period_{1}'.format(frequency, c)] = utils.timeaware_value_annotation(period)
        qs = qs.annotate(**annotations)
        return qs


class TVAManager(models.Manager):
    def get_queryset(self):
        return TVAIPTTQueryset(self.model, using=self._db).filter(deleted__isnull=True).with_annotations()


class TimeperiodsManager(models.Manager):
    def get_queryset(self):
        return TimeperiodsIPTTQueryset(self.model, using=self._db).filter(deleted__isnull=True).with_annotations()


class IPTTIndicator(Indicator):
    SEPARATOR = '/' # this is used by CSV output as a default joiner for multiple values
    class Meta:
        proxy = True

    tva = TVAManager()
    timeperiods = TimeperiodsManager()

    @property
    def levelname(self):
        return self.level.name if self.level else ''

    @property
    def sites(self):
        return [{'pk': site.pk, 'name': site.name} for result in self.result_set.all() for site in result.site.all()]

    @property
    def indicator_types(self):
        return [{'pk': indicator_type.pk,
                 'name': indicator_type.indicator_type} for indicator_type in self.indicator_type.all()]

    @property
    def disaggregation_category_pks(self):
        return [
            category.pk for disaggregation in getattr(self, 'prefetch_disaggregations', self.disaggregation.all())
            for category in getattr(disaggregation, 'prefetch_labels', disaggregation.disaggregationlabel_set.all())
        ]

    @property
    def active_disaggregation_category_pks(self):
        return [category_pk for category_pk in self.disaggregation_category_pks if getattr(
            self, f'disaggregation_{category_pk}_lop_actual', None
            )]

    @property
    def inactive_disaggregation_category_pks(self):
        return [category_pk for category_pk in self.disaggregation_category_pks if getattr(
            self, f'disaggregation_{category_pk}_lop_actual', None
            ) is None]

    @property
    def lop_met_target(self):
        return str(int(round(float(self.lop_actual_sum)*100/self.lop_target_sum))) + "%"

    @property
    def lop_target_real(self):
        if getattr(self, 'lop_target_calculated'):
            return self.lop_target_calculated
        return self.lop_target
