from django.db import models
from django.core.management.base import BaseCommand

from indicators.models import Indicator, Result, DisaggregationLabel, DisaggregationValue


class Command(BaseCommand):
    def handle(self, *args, **options):
        pks = []
        new_dvs = []
        value_problems = []
        disagg_set_problems = []
        disagg_set_empty_problems = []
        for result in Result.objects.exclude(disaggregation_value=None):
            for dv in result.disaggregation_value.all():
                if dv.disaggregation_label and dv.disaggregation_label.pk:
                    value = dv.value if dv.value else 0
                    try:
                        value = float(value)
                    except ValueError:
                        value_problems.append({
                            'pk': dv.pk,
                            'value': dv.value
                        })
                        pks.append(dv.pk)
                    else:
                        if round(value, 2) != float(value):
                            value_problems.append({
                                'pk': dv.pk,
                                'value': dv.value
                            })
                            pks.append(dv.pk)
                        else:
                            dt = dv.disaggregation_label.disaggregation_type
                            if dt not in result.indicator.disaggregation.all():
                                if dv.value:
                                    disagg_set_problems.append(
                                        {
                                            'result': result.pk,
                                            'label': dv.disaggregation_label.pk,
                                            'indicator': result.indicator.pk,
                                            'indicator dts': [dt.pk for dt in result.indicator.disaggregation.all()],
                                            'dt pk': dv.disaggregation_label.disaggregation_type.pk,
                                            'value': value
                                        }
                                    )
                                else:
                                    disagg_set_empty_problems.append(
                                        {
                                            'result': result.pk,
                                            'label': dv.disaggregation_label.pk,
                                            'indicator': result.indicator.pk,
                                            'indicator dts': [dt.pk for dt in result.indicator.disaggregation.all()],
                                            'dt pk': dv.disaggregation_label.disaggregation_type.pk,
                                            'value': value
                                        }
                                    )
                            else:
                                new_dvs.append(
                                    {'result': result.pk,
                                     'label': dv.disaggregation_label.pk,
                                     'value': value}
                                )
                            pks.append(dv.pk)
        unassigned = DisaggregationValue.objects.exclude(pk__in=pks)
        other_unassigned = DisaggregationValue.objects.filter(result=None)
        super_unassigned = DisaggregationValue.objects.filter(
            ~models.Q(pk__in=pks) & ~models.Q(result=None)
        )
        print("valid count {}".format(len(new_dvs)))
        print("value problems count {}".format(len(value_problems)))
        print("unassigned count {}".format(len(unassigned)))
        print("other unassigned count {}".format(len(other_unassigned)))
        print("super unassigned count {}".format(len(super_unassigned)))
        print("disagg set problems count {}".format(len(disagg_set_problems)))
        print("disagg set problems count {}".format(len(disagg_set_empty_problems)))
        for problem in disagg_set_problems[:10]:
            print(problem)