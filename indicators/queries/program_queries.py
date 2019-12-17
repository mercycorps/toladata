"""Proxy models for Program annotations for Home Page and Program Page

    ProgramMetrics - superset of classes for shared program annotation functions
    ProgramForHomePage - classes to support the Country/Portfolio roll-up of Program metrics
    ProgramForProgramPage - classes to support in depth single-program queries
"""

import datetime
from indicators.queries import (
    indicators_queries as iq,
    utils
)
from indicators.models import (
    Indicator,
    PeriodicTarget,
    Result
)
from workflow.models import Program
from django.db import models
from django.utils.functional import cached_property


class ProgramMetricsQuerySet(models.QuerySet):
    def count(self):
        return self.values('id').aggregate(total=models.Count('id', distinct=True))['total']

    def add_target_annotations(self):
        """adds annotations for the target_period_info stats on the Program Page and Home Page"""
        lop_targets = Indicator.objects.filter(
            program=models.OuterRef('pk'),
            target_frequency=Indicator.LOP
        )
        midend_targets = Indicator.objects.filter(
            program=models.OuterRef('pk'),
            target_frequency=Indicator.MID_END
        )
        event_targets = Indicator.objects.filter(
            program=models.OuterRef('pk'),
            target_frequency=Indicator.EVENT
        )
        annual_targets = PeriodicTarget.objects.filter(
            indicator__program=models.OuterRef('pk'),
            indicator__target_frequency=Indicator.ANNUAL
        )
        semi_annual_targets = PeriodicTarget.objects.filter(
            indicator__program=models.OuterRef('pk'),
            indicator__target_frequency=Indicator.SEMI_ANNUAL
        )
        tri_annual_targets = PeriodicTarget.objects.filter(
            indicator__program=models.OuterRef('pk'),
            indicator__target_frequency=Indicator.TRI_ANNUAL
        )
        quarterly_targets = PeriodicTarget.objects.filter(
            indicator__program=models.OuterRef('pk'),
            indicator__target_frequency=Indicator.QUARTERLY
        )
        monthly_targets = PeriodicTarget.objects.filter(
            indicator__program=models.OuterRef('pk'),
            indicator__target_frequency=Indicator.MONTHLY
        )
        return self.annotate(
            has_lop=models.Exists(lop_targets),
            has_midend=models.Exists(midend_targets),
            has_event=models.Exists(event_targets),
            has_annual=models.Exists(annual_targets),
            annual_period=models.Subquery(
                annual_targets.filter(
                    # end_date__lte=models.functions.Now()
                    end_date__lt=utils.UTCNow()
                ).order_by('-end_date').values('end_date')[:1],
                output_field=models.DateField()
            ),
            has_semi_annual=models.Exists(semi_annual_targets),
            semi_annual_period=models.Subquery(
                semi_annual_targets.filter(
                    # end_date__lte=models.functions.Now()
                    end_date__lt=utils.UTCNow()
                ).order_by('-end_date').values('end_date')[:1],
                output_field=models.DateField()
            ),
            has_tri_annual=models.Exists(tri_annual_targets),
            tri_annual_period=models.Subquery(
                tri_annual_targets.filter(
                    # end_date__lte=models.functions.Now()
                    end_date__lt=utils.UTCNow()
                ).order_by('-end_date').values('end_date')[:1],
                output_field=models.DateField()
            ),
            has_quarterly=models.Exists(quarterly_targets),
            quarterly_period=models.Subquery(
                quarterly_targets.filter(
                    # end_date__lte=models.functions.Now()
                    end_date__lt=utils.UTCNow()
                ).order_by('-end_date').values('end_date')[:1],
                output_field=models.DateField()
            ),
            has_monthly=models.Exists(monthly_targets),
            monthly_period=models.Subquery(
                monthly_targets.filter(
                    # end_date__lte=models.functions.Now()
                    end_date__lt=utils.UTCNow()
                ).order_by('-end_date').values('end_date')[:1],
                output_field=models.DateField()
            ),
        )

# ProgramForHomePage:

class ProgramForHomePageQuerySet(ProgramMetricsQuerySet):
    @property
    def program_count(self):
        return self.count()

    @property
    def all_targets_defined_for_all_indicators_count(self):
        return len([program for program in self if program.all_targets_defined_for_all_indicators])

    @property
    def indicators_count(self):
        return sum([program.indicator_count for program in self])

    @property
    def results_count(self):
        return sum([program.total_results_count for program in self])

    @property
    def indicators_with_results_count(self):
        return sum([program.reported_results_count for program in self])

    @property
    def results_with_evidence_count(self):
        return sum([program.results_evidence_count for program in self])

    def with_annotations(self, *annotations):
        if not annotations:
            annotations = ['targets', 'results', 'evidence', 'scope']
        qs = self
        # this needs to be cleaned up if we want queries to be lightning fast again
        #nondeleted_indicators = Indicator.objects.filter(deleted__isnull=True, program_id=models.OuterRef('pk'))
        if any(key in annotations for key in ['count', 'targets', 'results', 'evidence', 'reporting', 'scope']):
            qs = qs.annotate(
                indicator_count=models.functions.Coalesce(
                    models.Subquery(
                        Indicator.objects.filter(
                            deleted__isnull=True
                        ).filter(
                            program_id=models.OuterRef('pk')
                        ).order_by().values('program').annotate(
                            i_cnt=models.Count('id')
                        ).values('i_cnt')[:1],
                        output_field=models.IntegerField()
                    ), 0)
            )
        if any(key in annotations for key in ['results_count', 'results', 'evidence']):
            qs = qs.annotate(reported_results_sum=program_results_annotation(False))
        if 'targets' in annotations:
            qs = qs.annotate(program_months=program_get_program_months_annotation())
            qs = qs.annotate(targets_defined_count=program_all_targets_defined_annotation())
        if 'results' in annotations:
            qs = qs.annotate(total_results_count=program_results_annotation(False))
            qs = qs.annotate(reported_results_count=program_results_annotation(True))
        if 'evidence' in annotations:
            qs = qs.annotate(results_evidence_count=program_evidence_annotation())
        if 'reporting' in annotations or 'scope' in annotations:
            qs = qs.prefetch_related(program_scope_annotations(*annotations))
        return qs


class ProgramForHomePageManager(models.Manager):
    def get_queryset(self):
        qs = ProgramForHomePageQuerySet(self.model, using=self._db)
        # add target_info annotations (for determining helptext on indicator reporting explainers):
        qs = qs.add_target_annotations()
        return qs

    def with_annotations(self, *annotations):
        return self.get_queryset().with_annotations(*annotations)

# ProgramForProgramPage:

class ProgramForProgramPageManager(models.Manager):
    def get_queryset(self):
        qs = ProgramMetricsQuerySet(self.model, using=self._db)
        # add target_info annotations (for determining helptext on indicator reporting explainers):
        qs = qs.add_target_annotations()
        return qs

# Main Program query model:

class ProgramWithMetrics(Program):
    metrics_set = None
    cached_annotated_indicators = None
    program_page = ProgramForProgramPageManager()
    home_page = ProgramForHomePageManager()
    indicator_filters = {}

    class Meta:
        proxy = True

    def set_metrics(self, indicators=None):
        if indicators is None:
            indicators = self.annotated_indicators
        self.metrics_set = {
            'indicator_count': len(indicators),
            'targets_defined': len(
                [indicator for indicator in indicators
                 if indicator.all_targets_defined]
            ),
            'reported_results': len(
                [indicator for indicator in indicators
                 if indicator.has_reported_results]
            ),
            'results_evidence': sum(
                [indicator.results_with_evidence_count for indicator in indicators]
            ),
            'results_count': sum(
                [indicator.results_count for indicator in indicators]
            ),
            'needs_evidence': len(
                [indicator for indicator in indicators
                 if indicator.results_count > indicator.results_with_evidence_count]
            ),
        }

    @property
    def reporting_period_correct(self):
        """a bug allowed reporting period dates not on the first/last of the month into the db, this lets us check and
        advise users to handle it"""
        if not self.reporting_period_start or not self.reporting_period_end or self.reporting_period_start.day != 1:
            return False
        next_day = self.reporting_period_end + datetime.timedelta(days=1)
        if next_day.day != 1:
            return False
        return True


    @cached_property
    def all_targets_defined_for_all_indicators(self):
        """note: we define a program with 0 indicators as _not_ having all targets defined"""
        return self.indicator_count == self.metrics['targets_defined'] and self.indicator_count != 0

    @cached_property
    def indicator_count(self):
        return self.indicator_set.filter(deleted__isnull=True).count()

    @cached_property
    def annotated_indicators(self):
        if self.cached_annotated_indicators is None:
            self.indicator_filters['program'] = self
            self.indicator_filters['deleted'] = None
            program_page_annotations = ['targets', 'results', 'evidence', 'scope', 'table']
            self.cached_annotated_indicators = iq.MetricsIndicator.objects.filter(
                **self.indicator_filters
            ).with_annotations(
                *program_page_annotations
            ).with_logframe_sorting()
        return self.cached_annotated_indicators


    @property
    def percent_complete(self):
        if self.reporting_period_end is None or self.reporting_period_start is None:
            return -1 # otherwise the UI might show "None% complete"
        if self.reporting_period_start > datetime.datetime.utcnow().date():
            return 0
        total_days = (self.reporting_period_end - self.reporting_period_start).days
        complete = (datetime.datetime.utcnow().date() - self.reporting_period_start).days
        return int(round(float(complete)*100/total_days)) if complete < total_days else 100

    @property
    def metrics(self):
        """ 'reported_results': # of indicators with any results
            'targets_defined': # of indicators with all targets defined
            'indicator_count': # of indicators total
            'results_evidence': # of _results_ with evidence provided
            'results_count': # of_results_ total for all indicators in the program
        """
        if not hasattr(self, 'targets_defined_count'):
            if self.metrics_set is None:
                self.set_metrics()
            return self.metrics_set
        if self.indicator_count == 0:
            return {
                'reported_results': 0,
                'targets_defined': 0,
                'indicator_count': 0,
                'results_evidence': 0,
                'results_count': 0,
                'needs_evidence': 0
            }
        return {
            'reported_results': getattr(self, 'reported_results_count', None),
            'targets_defined': getattr(self, 'targets_defined_count', None),
            'indicator_count': getattr(self, 'indicator_count', None),
            'results_evidence': getattr(self, 'results_evidence_count', None),
            'results_count': getattr(self, 'reported_results_sum', None),
            'needs_evidence': getattr(self, 'needs_evidence_count', None)
        }

    @property
    def scope_counts(self):
        if self.indicator_count == 0:
            return {
                'indicator_count': 0,
                'nonreporting_count': 0,
                'reporting_count': 0,
                'low': 0,
                'on_scope': 0,
                'high': 0
            }
        if hasattr(self, 'scope_indicators'):
            scope_indicators = self.scope_indicators
        else:
            scope_indicators = self.annotated_indicators
        return {
            'indicator_count': len(scope_indicators),
            'nonreporting_count': len(
                [indicator for indicator in scope_indicators if not indicator.reporting]
            ),
            'reporting_count': len(
                [indicator for indicator in scope_indicators if indicator.reporting]
            ),

            'low': len(
                [indicator for indicator in scope_indicators
                 if indicator.reporting and hasattr(indicator, 'over_under') and indicator.over_under == -1]
                ),
            'on_scope': len(
                [indicator for indicator in scope_indicators
                 if indicator.reporting and hasattr(indicator, 'over_under') and indicator.over_under == 0]
                ),
            'high': len(
                [indicator for indicator in scope_indicators
                 if indicator.reporting and hasattr(indicator, 'over_under') and indicator.over_under == 1]
                ),
        }

    @property
    def target_period_info(self):
        """for determining help text on program page:
            - has_lop/midend/event: T/F whether a program has any lop indicators
            - time_targets: T/F whether a program has any time-based indicators
            - annual/semi_annual/tri_annual/quarterly/monthly: date that most recently completed period ended for each
                frequency
        """
        return {
            'lop': self.has_lop,
            'midend': self.has_midend,
            'event': self.has_event,
            'time_targets': any(
                [self.has_annual, self.has_semi_annual, self.has_tri_annual, self.has_quarterly, self.has_monthly]
            ),
            'annual': self.annual_period,
            'semi_annual': self.semi_annual_period,
            'tri_annual': self.tri_annual_period,
            'quarterly': self.quarterly_period,
            'monthly': self.monthly_period
        }



# utils:

def program_results_annotation(total=True):
    """annotates a program with the count of indicators which have any reported results
        or the count of reported results for the program in total
        Total=True: all results for program, Total=False: number of indicators with results"""
    data_subquery = Result.objects.filter(
        indicator__deleted__isnull=True,
        indicator__program=models.OuterRef('pk')
    ).order_by().values('indicator__program').annotate(
        data_count=models.Count('indicator_id', distinct=total)).values('data_count')[:1]
    return models.functions.Coalesce(
        models.Subquery(
            data_subquery,
            output_field=models.IntegerField()
        ), 0)

def program_get_program_months_annotation():
    """annotates a program with the number of months in the associated program"""
    return utils.MonthsCount('reporting_period_end', 'reporting_period_start')

def program_all_targets_defined_annotation():
    """annotates a queryset of programs with whether all targets are defined for all indicators for that program"""
    targets_subquery = PeriodicTarget.objects.filter(
        indicator__deleted__isnull=True,
        indicator_id=models.OuterRef('pk')
    ).order_by().values('indicator_id').annotate(
        target_count=models.Count('pk')
    ).values('target_count')[:1]
    target_subquery = Indicator.objects.filter(
        deleted__isnull=True,
        program_id=models.OuterRef('pk')
    ).order_by().values('program_id').annotate(
        defined_targets=models.Subquery(
            targets_subquery,
            output_field=models.IntegerField()
        )
    ).annotate(defined_targets_months=indicator_defined_targets_months())
    return models.functions.Coalesce(
        models.Subquery(
            target_subquery.filter(
                program_get_defined_targets_filter()
            ).order_by().values('program_id').annotate(
                all_defined_targets_count=models.Count('id')
            ).values('all_defined_targets_count')[:1],
            output_field=models.IntegerField()
        ), 0)

def program_evidence_annotation():
    """annotates a program with the count of results for any of the program's indicators which have evidence"""
    rs = Result.objects.filter(
        indicator__deleted__isnull=True,
        indicator__program_id=models.OuterRef('pk')
    ).filter(
        models.Q(evidence_url__isnull=False) & ~models.Q(evidence_url='')
    ).order_by().values('indicator__program').annotate(evidence_count=models.Count('pk')).values('evidence_count')[:1]
    return models.functions.Coalesce(
        models.Subquery(
            rs,
            output_field=models.IntegerField()
        ), 0)


def program_scope_annotations(*annotations):
    """annotates a program's indicators prefetch query with the required annotations to report their on scope status"""
    indicators_subquery = iq.MetricsIndicator.objects.filter(
        deleted__isnull=True
    ).select_related('program').with_annotations(*annotations)
    return models.Prefetch(
        'indicator_set', queryset=indicators_subquery, to_attr='scope_indicators'
    )


def indicator_defined_targets_months():
    """annotates a queryset of indicators with the number of months their targets cover
        (number of targets * months in period) for time-aware target frequencies
        used by the program level get_defined_targets filter"""
    cases = []
    for frequency, month_count in utils.TIME_AWARE_FREQUENCIES:
        cases.append(
            models.When(
                target_frequency=frequency,
                then=models.ExpressionWrapper(
                    (models.F('defined_targets') * month_count),
                    output_field=models.IntegerField()
                )
            )
        )
    return models.Case(
        *cases, default=models.Value(None, output_field=models.IntegerField(null=True))
        )


def program_get_defined_targets_filter():
    """returns a set of filters that filter out indicators that do not have all defined targets
        this version of the filter is for a program prefetch-related queryset, which does not have
        the program_months annotation, and instead requires the get_defined_targets_months annotation"""
    filters = []
    # LOP indicators require a defined lop_target:
    filters.append(models.Q(target_frequency=Indicator.LOP) & models.Q(lop_target__isnull=False))
    # MID_END indicators require 2 defined targets (mid and end):
    filters.append(models.Q(target_frequency=Indicator.MID_END) &
                   models.Q(defined_targets__isnull=False) &
                   models.Q(defined_targets__gte=2))
    # EVENT indicators require at least 1 defined target:
    filters.append(models.Q(target_frequency=Indicator.EVENT) &
                   models.Q(defined_targets__isnull=False) &
                   models.Q(defined_targets__gte=1))
    filters.append(models.Q(defined_targets_months__isnull=False) &
                   models.Q(defined_targets_months__gte=models.OuterRef('program_months')))
    combined_filter = filters.pop()
    for filt in filters:
        combined_filter |= filt
    return combined_filter
