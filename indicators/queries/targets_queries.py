"""Queries for PeriodicTargets that roll up data for use in Program Page, Home Page, and eventually IPTT"""

from indicators.models import (
    PeriodicTarget,
    Result,
    Indicator
)
from indicators.queries import utils
from django.db import models


class ResultsTargetQuerySet(models.QuerySet):
    def with_annotations(self):
        qs = self.all()
        # add results count annotation (used for is_complete in some cases):
        qs = qs.annotate(results_count=target_results_count_annotation())
        # add is_complete annotation:
        qs = qs.annotate(is_complete=target_is_complete_annotation())
        # add an achieved_sum annotation (all results for this target combined with indicator number type logic):
        qs = qs.annotate(actual=target_actual_annotation())
        # combine target and achieved to determine percent met:
        qs = qs.annotate(percent_met=target_percent_met_annotation())
        return qs

class ResultsTargetManager(models.Manager):
    def get_queryset(self):
        return ResultsTargetQuerySet(self.model, using=self._db)

class ResultsTarget(PeriodicTarget):
    """A target for the Results table view, annotated with actual (combined Results values) and percent met"""
    class Meta:
        proxy = True

    objects = ResultsTargetManager()

def target_results_count_annotation():
    """number of results associated with this periodic target
        - used to determine active MID-END/EVENT targets
        - used to determine how many rows are needed in the results table
    """
    return models.functions.Coalesce(
        models.Subquery(
            Result.objects.filter(
                periodic_target=models.OuterRef('pk')
                ).order_by().values('periodic_target').annotate(
                    total_results=models.Count('id')
                ).values('total_results')[:1],
            output_field=models.IntegerField()
        ), 0)

def target_is_complete_annotation():
    """is_complete == active == reporting
        time-aware: the target period is over
        lop: the program reporting period is over
        event/mid-end: there is at least one data point entered
    """
    return models.Case(
        models.When(
            models.Q(
                models.Q(indicator__target_frequency=Indicator.LOP) &
                # models.Q(indicator__program__reporting_period_end__lte=models.functions.Now())
                models.Q(indicator__program__reporting_period_end__lt=utils.UTCNow())
                ),
            then=models.Value(True)
        ),
        models.When(
            models.Q(
                models.Q(indicator__target_frequency__in=[Indicator.MID_END, Indicator.EVENT]) &
                models.Q(results_count__gt=0)
            ),
            then=models.Value(True)
        ),
        models.When(
            models.Q(
                models.Q(indicator__target_frequency__in=[f[0] for f in utils.TIME_AWARE_FREQUENCIES]) &
                # models.Q(end_date__lte=models.functions.Now())
                models.Q(end_date__lt=utils.UTCNow())
            ),
            then=models.Value(True)
        ),
        default=models.Value(False),
        output_field=models.BooleanField()
    )

def target_actual_annotation():
    """ value for "actual" on this target's row in the Results Table:
        - NUMBER/cumulative: sum of results in this periodic target period,
        - NUMBER/noncumulative: sum of results from all periods up to and including this one
        - PERCENTAGE: latest result in this period
    """
    return models.Case(
        models.When(
            models.Q(
                models.Q(indicator__unit_of_measure_type=Indicator.PERCENTAGE) |
                models.Q(indicator__is_cumulative=Indicator.NON_SUMMING_CUMULATIVE)
            ),
            then=models.Subquery(
                Result.objects.filter(
                    periodic_target=models.OuterRef('pk')
                ).order_by('-date_collected').values('achieved')[:1],
            )
        ),
        models.When(
            models.Q(
                models.Q(indicator__unit_of_measure_type=Indicator.NUMBER) &
                models.Q(indicator__is_cumulative=True) &
                models.Q(indicator__target_frequency__in=[f[0] for f in utils.TIME_AWARE_FREQUENCIES]) &
                models.Q(results_count__gt=0)
                ),
            then=models.Subquery(
                Result.objects.filter(
                    models.Q(indicator=models.OuterRef('indicator')) &
                    models.Q(periodic_target__end_date__lte=models.OuterRef('end_date'))
                ).order_by().values('indicator').annotate(
                    achieved_sum=models.Sum('achieved')
                ).values('achieved_sum')[:1]
            )
        ),
        models.When(
            models.Q(
                models.Q(indicator__unit_of_measure_type=Indicator.NUMBER) &
                models.Q(indicator__is_cumulative=True) &
                ~models.Q(indicator__target_frequency__in=[f[0] for f in utils.TIME_AWARE_FREQUENCIES]) &
                models.Q(results_count__gt=0)
                ),
            then=models.Subquery(
                Result.objects.filter(
                    models.Q(indicator=models.OuterRef('indicator')) &
                    models.Q(periodic_target__customsort__lte=models.OuterRef('customsort'))
                ).order_by().values('indicator').annotate(
                    achieved_sum=models.Sum('achieved')
                ).values('achieved_sum')[:1]
            )
        ),
        default=models.Subquery(
            Result.objects.filter(
                periodic_target=models.OuterRef('pk')
            ).order_by().values('periodic_target').annotate(
                achieved_sum=models.Sum('achieved')
            ).values('achieved_sum')[:1]
        ),
        output_field=models.DecimalField(decimal_places=2)
    )

def target_percent_met_annotation():
    """ value for the % met column in the results table
        logic is explained in target_actual_annotation"""
    return models.Case(
        models.When(
            models.Q(
                models.Q(target=0) &
                models.Q(actual__isnull=False)
            ),
            then=models.Value(None)
        ),
        models.When(
            models.Q(
                models.Q(target__isnull=True) &
                models.Q(actual__isnull=True)
            ),
            then=models.Value(None)
        ),
        default=models.ExpressionWrapper(
            models.F('actual') / models.F('target'),
            output_field=models.FloatField()
        )
    )
