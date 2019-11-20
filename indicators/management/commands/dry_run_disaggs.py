from django.db import models
from django.core.management.base import BaseCommand

from indicators.models import Indicator, Result, DisaggregationType, DisaggregationLabel, DisaggregationValue


class Command(BaseCommand):
    def handle(self, *args, **options):
        # disaggregations total:
        print("disaggregated values: {}".format(DisaggregationValue.objects.all().count()))
        # handle orphan disaggregations
        orphans = DisaggregationValue.objects.filter(result=None)
        print("orphans: {}".format(orphans.count()))
        non_orphans = DisaggregationValue.objects.exclude(result=None)
        print("non orphans: {}".format(non_orphans.count()))
        blank_non_orphans = non_orphans.filter(value='')
        print("blank non orphans: {}".format(blank_non_orphans.count()))
        SADD = DisaggregationType.objects.get(pk=109)
        disaggs = non_orphans.exclude(value='')
        sadd_disaggs = disaggs.filter(disaggregation_label__disaggregation_type__pk=109)
        print("SADD non-orphan disaggs: {}".format(sadd_disaggs.count()))
        non_sadd_disaggs = disaggs.exclude(disaggregation_label__disaggregation_type__pk=109)
        print("NON SADD non-orphan disaggs: {}".format(non_sadd_disaggs.count()))
        out_of_country_indicators = []
        for indicator in Indicator.rf_aware_objects.exclude(program=None).exclude(disaggregation=None):
            out_of_country_disaggs = indicator.disaggregation.exclude(
                country__in=[c.pk for c in indicator.program.country.all()]
            ).exclude(country=None)
            if out_of_country_disaggs:
                results = []
                for result in indicator.result_set.exclude(disaggregation_value=None):
                    if result.disaggregation_value.filter(disaggregation_label__disaggregation_type__in=[dt.pk for dt in out_of_country_disaggs]).count() > 0:
                        results.append(
                            {'result_pk': result.pk,
                             'dv_count': result.disaggregation_value.filter(disaggregation_label__disaggregation_type__in=[dt.pk for dt in out_of_country_disaggs]).count()}
                        )
                out_of_country_indicators.append(
                    {
                        'program_pk': indicator.program.pk,
                        'program': indicator.program.name,
                        'program_funding_status': indicator.program.funding_status,
                        'indicator_pk': indicator.pk,
                        'indicator_countries': [c.country for c in indicator.program.country.all()],
                        'disagg count': out_of_country_disaggs.count(),
                        'disagg countries': set([dt.country.country for dt in out_of_country_disaggs.exclude(country=None)]),
                        'result_count': len(results),
                        'results': results
                    }
                )
        print("out of country indicators {}".format(len(out_of_country_indicators)))
        active = [i for i in out_of_country_indicators if i['program_funding_status'] == 'Funded']
        print("active {}".format(len(active)))
        print("ids:\n{}".format([i['indicator_pk'] for i in active]))
        results = [i for i in active if i['result_count'] > 0]
        print("results {}".format(len(results)))
        print("ids:\n{}".format([i['indicator_pk'] for i in results]))
        print("result ids:\n{}".format([r['result_pk'] for i in results for r in i['results']]))
        # for result in Result.objects.exclude(disaggregation_value=None):
        #     dts = [dt.pk for dt in result.indicator.disaggregation.all()]
            
        # pks = []
        # new_dvs = []
        # value_problems = []
        # disagg_set_problems = []
        # disagg_set_empty_problems = []
        # for result in Result.objects.exclude(disaggregation_value=None):
        #     for dv in result.disaggregation_value.all():
        #         if dv.disaggregation_label and dv.disaggregation_label.pk:
        #             value = dv.value if dv.value else 0
        #             try:
        #                 value = float(value)
        #             except ValueError:
        #                 value_problems.append({
        #                     'pk': dv.pk,
        #                     'value': dv.value
        #                 })
        #                 pks.append(dv.pk)
        #             else:
        #                 if round(value, 2) != float(value):
        #                     value_problems.append({
        #                         'pk': dv.pk,
        #                         'value': dv.value
        #                     })
        #                     pks.append(dv.pk)
        #                 else:
        #                     dt = dv.disaggregation_label.disaggregation_type
        #                     if dt not in result.indicator.disaggregation.all():
        #                         if dv.value:
        #                             disagg_set_problems.append(
        #                                 {
        #                                     'result': result.pk,
        #                                     'label': dv.disaggregation_label.pk,
        #                                     'indicator': result.indicator.pk,
        #                                     'indicator dts': [dt.pk for dt in result.indicator.disaggregation.all()],
        #                                     'dt pk': dv.disaggregation_label.disaggregation_type.pk,
        #                                     'value': value
        #                                 }
        #                             )
        #                         else:
        #                             disagg_set_empty_problems.append(
        #                                 {
        #                                     'result': result.pk,
        #                                     'label': dv.disaggregation_label.pk,
        #                                     'indicator': result.indicator.pk,
        #                                     'indicator dts': [dt.pk for dt in result.indicator.disaggregation.all()],
        #                                     'dt pk': dv.disaggregation_label.disaggregation_type.pk,
        #                                     'value': value
        #                                 }
        #                             )
        #                     else:
        #                         new_dvs.append(
        #                             {'result': result.pk,
        #                              'label': dv.disaggregation_label.pk,
        #                              'value': value}
        #                         )
        #                     pks.append(dv.pk)
        # unassigned = DisaggregationValue.objects.exclude(pk__in=pks)
        # other_unassigned = DisaggregationValue.objects.filter(result=None)
        # super_unassigned = DisaggregationValue.objects.filter(
        #     ~models.Q(pk__in=pks) & ~models.Q(result=None)
        # )
        # print("valid count {}".format(len(new_dvs)))
        # print("value problems count {}".format(len(value_problems)))
        # print("unassigned count {}".format(len(unassigned)))
        # print("other unassigned count {}".format(len(other_unassigned)))
        # print("super unassigned count {}".format(len(super_unassigned)))
        # print("disagg set problems count {}".format(len(disagg_set_problems)))
        # print("disagg set problems count {}".format(len(disagg_set_empty_problems)))
        # for problem in disagg_set_problems[:10]:
        #     print(problem)