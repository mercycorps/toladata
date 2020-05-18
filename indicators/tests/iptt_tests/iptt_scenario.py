"""
Indicators:
    LoP - a - "1.1.1" - Numeric NC - baseline 0
        no sites - no types - sector 1
        No results
        standard disagg
    MID_END - b - "aaa" - Percent - baseline na
        site 1 - type 1 - no sector
        One result Mid (month 2)
        country disagg (no disagg results)
    ANNUAL - 1a - "x4.1" - Numeric Cum - baseline 100
        sites 1 and 2 - types 1 + 2 - sector 2
        Two results month 4,5
        no disaggs
    QUARTERLY - 2a - "4a" - Numeric NC - baseline 0
        no sites - type 2 - sector 1
        Two results month 2 One result month 10
        standard disagg and country disagg (all results disagg'd)
    TRI_ANNUAL - 2b - "4b" - Percent - baseline na
        no sites - no types - no sector
        No results
        no disaggs
    MONTHLY - 1.1a - "21.4" - Numeric Cum - baseline 100
        sites 1 and 2 - type 1 - sector 2
        One result month 3 One result month 6
        standard disagg (disagg'd result)
    EVENT - 1.1b - "19.1" - Numeric NC - baseline 0
        no sites - types 1 + 2 - sector 1
        One result month 1 event 1
        country disagg (disagg'd result) 
"""

import datetime
import operator
import itertools
from collections import defaultdict
from decimal import Decimal
from indicators.models import Indicator, PeriodicTarget
from factories.workflow_models import (
    CountryFactory,
    RFProgramFactory,
    TolaUserFactory,
    SectorFactory,
    SiteProfileFactory,
)
from factories.indicators_models import (
    RFIndicatorFactory,
    LevelFactory,
    LevelTierFactory,
    DisaggregationTypeFactory,
    IndicatorTypeFactory,
    PeriodicTargetFactory,
    ResultFactory,
    DisaggregatedValueFactory,
)

class IPTTScenarioGeneral:
    program_name = "Nåmé of the Program its long and has Spécîal Characters"
    start_date = datetime.date(2016, 1, 1)
    end_date = datetime.date(2018, 12, 31)
    goal_level_row = "Tîér1: Lévël goal a"

    def __init__(self):
        self.get_program()
        self.get_levels()
        self.get_disaggregations()
        self.get_sectors()
        self.get_indicator_types()
        self.get_sites()
        self.get_indicators()

    def get_program(self):
        self.country = CountryFactory(country="TéstLand", code="TL")
        self.program = RFProgramFactory(
            name=self.program_name,
            reporting_period_start=self.start_date,
            reporting_period_end=self.end_date,
        )

    def get_levels(self):
        self.tiers = [
            LevelTierFactory(
                name=f"Tîér{c+1}",
                tier_depth=c+1,
                program=self.program
            ) for c in range(3)]
        goal_level = LevelFactory(
                name="Lévël goal a",
                parent=None,
                program=self.program,
                customsort=1
            )
        outcome_levels = [
            LevelFactory(
                name="Lévêl outcome 1a",
                parent=goal_level,
                program=self.program,
                customsort=1
            ),
            LevelFactory(
                name="Lévêl outcome 1b",
                parent=goal_level,
                program=self.program,
                customsort=2
            ),
        ]
        output_level = LevelFactory(
            name="Lévêl output 1.1a",
            parent=outcome_levels[0],
            program=self.program,
            customsort=1
        )
        self.levels = [goal_level, outcome_levels[0], outcome_levels[1], output_level]

    def get_disaggregations(self):
        self.standard_disagg = DisaggregationTypeFactory(
            standard=True,
            country=None,
            disaggregation_type="Ståndard Dîsäggregation",
            labels=["Label 1", "Låbél 2"]
        )
        self.country_disagg = DisaggregationTypeFactory(
            standard=False,
            country=self.country,
            disaggregation_type="Country Dîsäggregation with a VERY VERY VERY VERY VERY LONG NAME",
            labels=["Label 1", "Låbél 2", "Label 3"]
        )

    def get_sectors(self):
        self.sector1 = SectorFactory(sector="Test Séctor 1")
        self.sector2 = SectorFactory(sector="Test Séctor 2 with a very long name which doesn't matter at all")

    def get_sites(self):
        self.site1 = SiteProfileFactory(name="Site profile 1 with Spécîal Characters")
        self.site2 = SiteProfileFactory(name="Site profile 2 with a very long name which doesn't matter at all")

    def get_indicator_types(self):
        self.type1 = IndicatorTypeFactory(indicator_type="Typé 1")
        self.type2 = IndicatorTypeFactory(indicator_type="Typé 2 with a very long name which doesn't matter at all")

    def get_indicators(self):
        self.indicators = [
            self.get_indicator1(),
            self.get_indicator2(),
            self.get_indicator3(),
            self.get_indicator4(),
            self.get_indicator5(),
            self.get_indicator6(),
            self.get_indicator7(),
        ]

    def add_result(self, achieved, indicator, target, month):
        date_collected = datetime.date(
            self.start_date.year,
            self.start_date.month+month-1,
            1
        )
        return ResultFactory(
            indicator=indicator,
            periodic_target=target,
            achieved=achieved,
            date_collected=date_collected
        )

    def add_disagg(self, result, disagg):
        if len(disagg.labels) == 2:
            values = [1, result.achieved-1]
        elif len(disagg.labels) == 3:
            values = [1, 1, result.achieved-2]
        for value, label in zip(values, disagg.labels):
            DisaggregatedValueFactory(
                result=result,
                category=label,
                value=value
            )
        

    def get_indicator1(self):
        indicator = RFIndicatorFactory(
            program=self.program,
            target_frequency=Indicator.LOP,
            level=self.levels[0],
            level_order=1,
            name="Indicåtor Náme 1",
            number="1.1.1",
            unit_of_measure_type=Indicator.NUMBER,
            is_cumulative=False,
            baseline=0,
            baseline_na=False,
            sector=self.sector1,
            targets=1000,
        )
        return indicator

    def get_indicator2(self):
        indicator = RFIndicatorFactory(
            program=self.program,
            target_frequency=Indicator.MID_END,
            level=self.levels[0],
            level_order=2,
            name="Indicåtor Náme 2",
            number="aaa",
            unit_of_measure_type=Indicator.PERCENTAGE,
            baseline=None,
            baseline_na=True,
            sector=None,
            targets=100
        )
        mid_target = indicator.periodictargets.first()
        indicator.disaggregation.set([self.country_disagg])
        indicator.indicator_type.set([self.type1])
        result = self.add_result(95, indicator, mid_target, month=2)
        result.site.set([self.site1])
        return indicator

    def get_indicator3(self):
        indicator = RFIndicatorFactory(
            program=self.program,
            target_frequency=Indicator.ANNUAL,
            level=self.levels[1],
            level_order=1,
            name="Indicåtor Náme 3",
            number="x4.1",
            unit_of_measure_type=Indicator.NUMBER,
            is_cumulative=True,
            baseline=100,
            baseline_na=False,
            sector=self.sector2,
            targets=45
        )
        first_target = indicator.periodictargets.first()
        indicator.indicator_type.set([self.type1, self.type2])
        result = self.add_result(50, indicator, first_target, month=4)
        result.site.set([self.site1])
        result = self.add_result(20, indicator, first_target, month=5)
        result.site.set([self.site2])
        return indicator

    def get_indicator4(self):
        indicator = RFIndicatorFactory(
            program=self.program,
            target_frequency=Indicator.QUARTERLY,
            level=self.levels[2],
            level_order=1,
            name="Indicåtor Náme 4",
            number="4a",
            unit_of_measure_type=Indicator.NUMBER,
            is_cumulative=False,
            baseline=0,
            baseline_na=False,
            sector=self.sector1,
            targets=10
        )
        first_target = indicator.periodictargets.first()
        fourth_target = indicator.periodictargets.all()[3]
        indicator.indicator_type.set([self.type2])
        indicator.disaggregation.set([self.standard_disagg, self.country_disagg])
        result1 = self.add_result(4, indicator, first_target, month=2)
        self.add_disagg(result1, self.standard_disagg)
        self.add_disagg(result1, self.country_disagg)
        result2 = self.add_result(7, indicator, first_target, month=2)
        self.add_disagg(result2, self.standard_disagg)
        self.add_disagg(result2, self.country_disagg)
        result3 = self.add_result(9, indicator, fourth_target, month=10)
        self.add_disagg(result3, self.standard_disagg)
        self.add_disagg(result3, self.country_disagg)
        return indicator

    def get_indicator5(self):
        indicator = RFIndicatorFactory(
            program=self.program,
            target_frequency=Indicator.TRI_ANNUAL,
            level=self.levels[2],
            level_order=2,
            name="Indicåtor Náme 5",
            number="4b",
            unit_of_measure_type=Indicator.PERCENTAGE,
            baseline=None,
            baseline_na=True,
            sector=None,
            targets=15
        )
        indicator.indicator_type.set([])
        indicator.disaggregation.set([])
        return indicator

    def get_indicator6(self):
        indicator = RFIndicatorFactory(
            program=self.program,
            target_frequency=Indicator.MONTHLY,
            level=self.levels[3],
            level_order=1,
            name="Indicåtor Náme 6",
            number="21.4",
            unit_of_measure_type=Indicator.NUMBER,
            is_cumulative=True,
            baseline=100,
            baseline_na=False,
            sector=self.sector2,
            targets=80
        )
        targets = list(indicator.periodictargets.all())
        indicator.indicator_type.set([self.type1])
        indicator.disaggregation.set([self.standard_disagg])
        result1 = self.add_result(40, indicator, targets[2], month=3)
        result1.site.set([self.site1])
        result2 = self.add_result(70, indicator, targets[5], month=6)
        result2.site.set([self.site2])
        self.add_disagg(result2, self.standard_disagg)
        return indicator

    def get_indicator7(self):
        indicator = RFIndicatorFactory(
            program=self.program,
            target_frequency=Indicator.EVENT,
            level=self.levels[3],
            level_order=2,
            name="Indicåtor Náme 7",
            number="19.1",
            unit_of_measure_type=Indicator.NUMBER,
            is_cumulative=False,
            baseline=0,
            baseline_na=False,
            sector=self.sector1,
        )
        event_targets = [
            PeriodicTargetFactory(
                indicator=indicator,
                period=f"Evént {c}",
                target=40 + 10*c,
                start_date=self.start_date,
                end_date=self.end_date,
                customsort=c
            ) for c in range(4)
        ]
        first_target = event_targets[0]
        indicator.indicator_type.set([self.type1, self.type2])
        indicator.disaggregation.set([self.country_disagg])
        result = self.add_result(42, indicator, first_target, month=1)
        self.add_disagg(result, self.country_disagg)
        return indicator

class IPTTScenarioSums:
    reporting_period_start = datetime.date(2016, 1, 1)
    reporting_period_end = datetime.date(2016, 12, 31)

    def __init__(self):
        self.get_program()
        self.get_levels()
        self.get_disaggregations()
        self.get_indicators()

    def get_program(self):
        self.country = CountryFactory(country="TéstLand", code="TL")
        self.program = RFProgramFactory(
            name="Test for data not for language",
            reporting_period_start=self.reporting_period_start,
            reporting_period_end=self.reporting_period_end
        )

    def get_levels(self):
        self.tier = LevelTierFactory(
            name="Tier for data not for language",
            tier_depth=1,
            program=self.program
        )
        self.level = LevelFactory(
            name="Level for data not for language",
            parent=None,
            program=self.program,
            customsort=1
        )

    def get_disaggregations(self):
        self.standard_disagg = DisaggregationTypeFactory(
            standard=True,
            country=None,
            disaggregation_type="Std Disagg for data not for language",
            labels=["Label 1", "Label 2"]
        )

    def get_indicators(self):
        self.indicators = []
        level_order = 0
        indicator_kwargs = {
            'program': self.program,
            'level': self.level,
            'target_frequency': Indicator.QUARTERLY,
            'targets': 1000,
            'baseline': 100,
            'baseline_na': False
        }
        for uom_type, cumulative in [
            (Indicator.NUMBER, False), (Indicator.NUMBER, True), (Indicator.PERCENTAGE, True)
            ]:
            these_kwargs = {
                **indicator_kwargs,
                'unit_of_measure_type': uom_type,
                'is_cumulative': cumulative
            }
            indicator_no_results = RFIndicatorFactory(
                **{
                    **these_kwargs,
                    'level_order': level_order,
                }
            )
            indicator_no_results.disaggregation.set([self.standard_disagg])
            self.indicators.append(indicator_no_results)
            level_order += 1
            indicator_one_result = RFIndicatorFactory(
                **{
                    **these_kwargs,
                    'level_order': level_order,
                }
            )
            indicator_one_result.disaggregation.set([self.standard_disagg])
            result = ResultFactory(
                indicator=indicator_one_result,
                periodic_target=indicator_one_result.periodictargets.first(),
                date_collected=self.program.reporting_period_start+datetime.timedelta(days=1),
                achieved=500
            )
            dv1 = DisaggregatedValueFactory(
                result=result,
                category=self.standard_disagg.labels[0],
                value=100
            )
            dv2 = DisaggregatedValueFactory(
                result=result,
                category=self.standard_disagg.labels[1],
                value=400
            )
            self.indicators.append(indicator_one_result)
            level_order += 1
            indicator_multi_result = RFIndicatorFactory(
                **{
                    **these_kwargs,
                    'level_order': level_order,
                }
            )
            indicator_multi_result.disaggregation.set([self.standard_disagg])
            for date_collected, target in [
                (datetime.date(2016, 1, 1), indicator_multi_result.periodictargets.first()),
                (datetime.date(2016, 5, 1), indicator_multi_result.periodictargets.all()[1]),
                (datetime.date(2016, 12, 30), indicator_multi_result.periodictargets.all()[3])
                ]:    
                result = ResultFactory(
                    indicator=indicator_multi_result,
                    periodic_target=target,
                    date_collected=date_collected,
                    achieved=500
                )
                dv1 = DisaggregatedValueFactory(
                    result=result,
                    category=self.standard_disagg.labels[0],
                    value=100
                )
                dv2 = DisaggregatedValueFactory(
                    result=result,
                    category=self.standard_disagg.labels[1],
                    value=400
                )
            self.indicators.append(indicator_multi_result)
            level_order += 1

class IndicatorGenerator:
    default_program_kwargs = {
        'active': True,
        'months': 24,
        'closed': False,
        'tiers': ['Tier_name at depth 1 (i.e. Goal)',
                  'Tier_name at depth 2 (i.e. Outcome)',
                  'Tier_name at depth 3 (i.e. Output)'],
        'levels': [(1,), ((2,),), (((2, 1),),)],
        'levels__pks': [901, 902, 903, 904, 905, 906],
    }
    default_indicator_kwargs = {
        'lop_target': 1000,
        'targets': True,
    }

    def __init__(self, **kwargs):
        self.country = CountryFactory(code="TT", country="Test Tola Land")
        if kwargs.pop('sectors', False) is True:
            self.sectors = SectorFactory.create_batch(2)
        if kwargs.pop('indicator_types', False) is True:
            self.indicator_types = IndicatorTypeFactory.create_batch(2)
        if kwargs.pop('disaggregations', False) is True:
            self.standard_disaggs = DisaggregationTypeFactory.create_batch(2, standard=True)
            self.country_disaggs = DisaggregationTypeFactory.create_batch(2, standard=False, country=self.country)
        if kwargs.pop('sites', False):
            self.sites = SiteProfileFactory.create_batch(2, country=self.country)
        program_kwargs = {
            **self.default_program_kwargs,
            **kwargs
        }
        self.program = RFProgramFactory(**program_kwargs)
        self.program.country.set([self.country])
        self.tiers = list(self.program.level_tiers.all().order_by('tier_depth'))
        self.levels = sorted(
            list(self.program.levels.all()),
            key=operator.attrgetter('level_depth', 'customsort')
            )
        self.indicators_with_disaggregated_results = defaultdict(set)

    @property
    def levels_level_order(self):
        levels_in_order = []
        parents = sorted([level for level in self.levels if level.parent_id is None], key=operator.attrgetter('customsort'))
        children = []
        while parents:
            for parent in parents:
                children += sorted(
                    [level for level in self.levels if level.parent_id == parent.id],
                    key=operator.attrgetter('customsort'))
            levels_in_order += parents
            parents = children
            children = []
        for level in levels_in_order:
            yield level

    @property
    def levels_chain_order(self):
        def get_children(parent_level):
            for level in [level for level in self.levels if level.parent == parent_level]:
                yield level
                for child in get_children(level):
                    yield child
        levels = get_children(None)
        return levels
        

    def clear_after_test(self):
        Indicator.objects.all().delete()
        self.indicators_with_disaggregated_results = defaultdict(set)
        
        
    def add_indicator(self, **kwargs):
        disaggregations = kwargs.pop('disaggregations', [])
        disaggregations_with_results = kwargs.pop('disaggregated_results', [])
        indicator_types = kwargs.pop('indicator_types', [])
        sites = kwargs.pop('sites', [])
        indicator_kwargs = {
            'program': self.program,
            **self.default_indicator_kwargs,
            **kwargs
        }
        indicator = RFIndicatorFactory(**indicator_kwargs)
        indicator.indicator_type.set(indicator_types)
        indicator.disaggregation.set(disaggregations)
        if indicator.result_set.exists() and (sites or disaggregations_with_results):
            self.add_sites_and_disaggregations(indicator, sites, disaggregations_with_results)
        return indicator

    def add_result(self, indicator, result_kwargs):
        target = indicator.periodictargets.all()[result_kwargs.pop('target', 0)]
        return ResultFactory(
            indicator=indicator,
            periodic_target=target,
            achieved=result_kwargs.get('achieved', 10),
            program=self.program,
            date_collected=result_kwargs.get('date_collected', target.start_date),
        )

    def add_sites_and_disaggregations(self, indicator, sites, disaggregations_to_add):
        if not disaggregations_to_add:
            disaggregations_to_add = []
        for result in indicator.result_set.all():
            result.site.set(sites)
            for disaggregation in disaggregations_to_add:
                results_disaggregated = False
                disaggregation_label_set = disaggregation.labels
                if len(disaggregation_label_set) > 0:
                    values = [round(result.achieved/len(disaggregation_label_set), 2)]*(len(disaggregation_label_set)-1)
                    values.append(result.achieved - sum(values))
                    for label, value in zip(disaggregation_label_set, values):
                        DisaggregatedValueFactory(
                            category=label,
                            result=result,
                            value=value
                        )
                        results_disaggregated = True
                if results_disaggregated:
                    self.indicators_with_disaggregated_results[indicator.pk].add(disaggregation.pk)

    def _indicators_for_levels(self, levels, **kwargs):
        count = kwargs.pop('count', 2)
        for level_kwargs in levels_generator(levels, count, repeat=False):
            yield self.add_indicator(**{
                **kwargs,
                **level_kwargs,
            })

    def indicators_per_level(self, **kwargs):
        blank = kwargs.pop('blank', False)
        levels = self.levels
        if blank:
            levels = [None,] + levels
        return self._indicators_for_levels(levels, **kwargs)
    
    def indicators_for_non_goal_levels(self, **kwargs):
        blank = kwargs.pop('blank', False)
        levels = self.levels[1:]
        if blank:
            levels = [None,] + levels
        return self._indicators_for_levels(levels, **kwargs)

    def indicators_no_levels(self, **kwargs):
        levels = [None,]
        return self._indicators_for_levels([None], **kwargs)

    def indicators_some_levels(self, **kwargs):
        levels = [level for level, add in zip(
            self.levels_level_order, [False, False, True, False, True, False]
            ) if add]
        return self._indicators_for_levels(levels, **kwargs)

    def old_level_indicators(self, **kwargs):
        count = kwargs.pop('count', 1)
        number_gen = kwargs.pop('number_generator', number_generator())
        for _, old_level in Indicator.OLD_LEVELS:
            level_gen = next(number_gen)
            for c in range(count):
                yield self.add_indicator(**{
                    'level': None,
                    'old_level': old_level,
                    'number': next(level_gen),
                })

    def all_measurement_type_indicators(self, **kwargs):
        levels = levels_generator(self.levels, 1)
        measurements = measurements_generator()
        baselines = itertools.cycle(baselines_generator())
        for level_kwargs, measurement_kwargs, baseline_kwargs in zip(
            levels, measurements, baselines
        ):
            yield self.add_indicator(**{
                **level_kwargs,
                **measurement_kwargs,
                **baseline_kwargs,
                **kwargs
                })

    def all_frequencies_indicators(self, **kwargs):
        count = kwargs.pop('count', 2)
        event = kwargs.pop('event', True)
        levels = levels_generator(self.levels, 1)
        frequencies = frequencies_generator(count=count, event=event)
        for level_kwargs, frequency_kwargs in zip(
            levels, frequencies
        ):
            yield self.add_indicator(**{
                **level_kwargs,
                **frequency_kwargs,
                **kwargs,
                })

    def all_filters_indicators(self, **kwargs):
        sectors = itertools.cycle([None,] + self.sectors)
        indicator_types = itertools.cycle(powerset(self.indicator_types))
        disaggregations = powerset(self.standard_disaggs + self.country_disaggs)
        frequencies = itertools.cycle(frequencies_generator())
        levels = levels_generator(self.levels, 1)
        for sector, indicator_type_set, disaggregation_set, frequency_kwargs, level_kwargs in zip(
            sectors, indicator_types, disaggregations, frequencies, levels
        ):
            yield self.add_indicator(**{
                'sector': sector,
                **level_kwargs,
                **frequency_kwargs,
                'disaggregations': disaggregation_set,
                'indicator_types': indicator_type_set,
                **kwargs
            })

    def sites_indicators(self, **kwargs):
        sites = itertools.chain(powerset(self.sites), powerset(self.sites))
        levels = levels_generator(self.levels, 1)
        frequencies = itertools.cycle(frequencies_generator())
        for sites, level_kwargs, frequency_kwargs in zip(
            sites, levels, frequencies
        ):
            yield self.add_indicator(**{
                **level_kwargs,
                **frequency_kwargs,
                'results': True,
                'sites': sites,
                **kwargs
            })

    def disaggregations_indicators(self, **kwargs):
        disaggregations = powerset(self.standard_disaggs + self.country_disaggs)
        levels = levels_generator(self.levels, 1)
        frequencies = itertools.cycle(frequencies_generator())
        for disaggregation_set, level_kwargs, frequency_kwargs in zip(
            disaggregations, levels, frequencies
        ):
            for with_results in powerset(disaggregation_set):
                yield self.add_indicator(**{
                    **level_kwargs,
                    **frequency_kwargs,
                    'results': True,
                    'disaggregations': disaggregation_set,
                    'disaggregated_results': with_results
                })

    def one_indicator_with_one_result(self, **kwargs):
        return self.add_indicator(
            level=self.levels[0],
            target_frequency=Indicator.ANNUAL,
            lop_target=1500,
            targets=1500,
            results=100,
            results__count=1,
            **kwargs
            )

    def indicators_with_results_different_uoms(self, **kwargs):
        for measurements_kwargs, levels_kwargs in zip(
            levels_generator(self.levels, 1),
            measurements_generator()
        ):
            yield self.add_indicator(
                target_frequency=Indicator.ANNUAL,
                lop_target=1200,
                targets=1200,
                results=[20, 80, 50],
                results__count=3,
                **measurements_kwargs,
                **levels_kwargs
            )

    def mismatched_lop_target_indicators(self):
        for measurements_kwargs, levels_kwargs in zip(
            levels_generator(self.levels, 1),
            measurements_generator()
        ):
            yield self.add_indicator(
                target_frequency=Indicator.ANNUAL,
                lop_target=1400,
                targets=160,
                results=True,
                **measurements_kwargs,
                **levels_kwargs
            )

    def disaggregated_result_indicator(self):
        return self.add_indicator(
            target_frequency=Indicator.ANNUAL,
            targets=140,
            results=100,
            disaggregations=[self.standard_disaggs[0]],
            disaggregated_results=[self.standard_disaggs[0]]
        )

    def different_disaggregated_result_measurement_type_indicators(self):
        for measurements_kwargs, levels_kwargs in zip(
            levels_generator(self.levels, 1),
            measurements_generator()
        ):
            yield self.add_indicator(
                target_frequency=Indicator.SEMI_ANNUAL,
                targets=[50*c for c in range(1, 5)],
                results=[60, 105, 150, 195],
                disaggregations=[self.standard_disaggs[0]] + self.country_disaggs,
                disaggregated_results=[self.standard_disaggs[0], self.country_disaggs[0]],
                **measurements_kwargs,
                **levels_kwargs
            )

    def indicators_mixed_results(self, **kwargs):
        result_sets = results_generator(
            Indicator.QUARTERLY, self.program.reporting_period_start,
            self.program.reporting_period_end
        )
        for levels_kwargs, result_set in zip(
            levels_generator(self.levels, 1),
            result_sets,
        ):
            indicator = self.add_indicator(
                target_frequency=Indicator.QUARTERLY,
                targets=1000.2,
                disaggregations=[self.standard_disaggs[1]],
                **levels_kwargs,
                **kwargs
            )
            months = [[] for i in range(24)]
            for result_dict in result_set:
                if result_dict['date_collected'] <= datetime.date.today():
                    result = self.add_result(indicator, result_dict)
                    dvs = [
                        DisaggregatedValueFactory(result=result, category=category, value=value)
                        for value, category in zip([1, result.achieved - 1], self.standard_disaggs[1].labels)
                    ]
                    count = result.date_collected.month - self.program.reporting_period_start.month
                    count += 12*(result.date_collected.year - self.program.reporting_period_start.year)
                    months[count].append(result.achieved)
            yield indicator, months

    def two_results_per_semi_annual_indicators(self, **kwargs):
        common_kwargs = {
            'target_frequency': Indicator.SEMI_ANNUAL,
            'targets': [50, 100, 150, 200],
            'disaggregations': [self.standard_disaggs[0], self.country_disaggs[0]]
        }
        for is_cumulative, uom_type, level_kwargs in zip(
            [True, False, False], [Indicator.NUMBER, Indicator.NUMBER, Indicator.PERCENTAGE],
            levels_generator(self.levels, 1)
        ):
            indicator = self.add_indicator(
                is_cumulative=is_cumulative, unit_of_measure_type=uom_type,
                **level_kwargs,
                **common_kwargs,
                **kwargs
            )
            for target in indicator.periodictargets.all().order_by('customsort'):
                result = self.add_result(
                    indicator,
                    {'target': target.customsort, 'date_collected': target.start_date + datetime.timedelta(days=1),
                     'achieved': target.target-5}
                )
                DisaggregatedValueFactory(
                    result=result, category=self.standard_disaggs[0].labels[0], value=target.target-5
                )
                result2 = self.add_result(
                    indicator,
                    {'target': target.customsort, 'date_collected': target.start_date + datetime.timedelta(days=50),
                     'achieved': target.target+Decimal(5.15)}
                )
                for label, value in zip(self.country_disaggs[0].labels, [target.target, 5.15]):
                    DisaggregatedValueFactory(
                        result=result2, category=label, value=value
                    )
            yield indicator

    def one_indicator_with_one_result_per_frequency(self, **kwargs):
        for frequency_kwargs, level_kwargs in zip(
            frequencies_generator(), levels_generator(self.levels, 1)
        ):
            yield self.add_indicator(
                targets=100.25,
                unit_of_measure_type=Indicator.NUMBER,
                is_cumulative=False,
                results=[4.1,],
                **frequency_kwargs,
                **level_kwargs,
                **kwargs,
            )

    def lop_only_indicator_with_results(self, **kwargs):
        return self.add_indicator(
            target_frequency=Indicator.LOP,
            targets=1200,
            results=[100],
            level=self.levels[0],
        )
            
        
def results_generator(frequency, start_date, end_date):
    target_periods = list(PeriodicTarget.generate_for_frequency(frequency)(start_date, end_date))
    # one per target:
    yield [{
        'achieved': 100,
        'date_collected': tp['start']+datetime.timedelta(days=1),
        'target': tp['customsort']
        } for tp in target_periods]
    # two per target:
    yield [{
        'achieved': 45.5 * c,
        'date_collected': tp['start']+datetime.timedelta(days=1),
        'target': tp['customsort']
    } for c, tp in enumerate(target_periods)] + [{
        'achieved': 12.05 * c,
        'date_collected': tp['start']+datetime.timedelta(days=20),
        'target': tp['customsort']
    } for c, tp in enumerate(target_periods)]
    # monthly
    results = []
    for tp in target_periods:
        collect_date = tp['start'] + datetime.timedelta(days=1)
        while collect_date < tp['end']:
            results.append({
                'achieved': 50.15,
                'date_collected': collect_date,
                'target': tp['customsort']
            })
            if collect_date.month == 12:
                year = collect_date.year + 1
                month = 1
            else:
                year = collect_date.year
                month = collect_date.month + 1
            collect_date = datetime.date(year, month, 2)
    yield results
    # only first target:
    yield [{
        'achieved': 10,
        'date_collected': target_periods[0]['start']+datetime.timedelta(days=1),
        'target': target_periods[0]['customsort']
    }]
    # only last target:
    yield [{
        'achieved': 10,
        'date_collected': target_periods[-1]['start']+datetime.timedelta(days=1),
        'target': target_periods[-1]['customsort']
    }]
    # only middle target:
    period = len(target_periods)//2
    yield [{
        'achieved': 400,
        'date_collected': target_periods[period]['start']+datetime.timedelta(days=1),
        'target': target_periods[period]['customsort']
    }]
    # every other:
    yield [{
        'achieved': 100,
        'date_collected': tp['start']+datetime.timedelta(days=1),
        'target': tp['customsort']
        } for tp in target_periods[::2]]
    
        
    

def levels_generator(levels, count, repeat=True):
    for level in itertools.cycle(levels) if repeat else iter(levels):
        for level_order in range(count):
            yield {'level': level, 'level_order': level_order}

def number_generator():
    def _number_generator(number_base):
        count = 1
        while True:
            yield f'{number_base}{count}'
            count += 1
    number_base = ''
    while True:
        yield _number_generator(number_base)
        number_base = f'1.{number_base}'

def measurements_generator():
    generator = itertools.product(
        [doc for (doc, _) in Indicator.DIRECTION_OF_CHANGE],
        [uom for (uom, _) in Indicator.UNIT_OF_MEASURE_TYPES],
        [True, False]
    )
    for doc, uom, is_cumulative in generator:
        yield {
            'direction_of_change': doc,
            'unit_of_measure_type': uom,
            'is_cumulative': is_cumulative
        }

def baselines_generator():
    for baseline_na, baseline in [
        (True, None),
        (False, 100),
        (False, 0),
        (False, 99999)
    ]:
        yield {'baseline_na': baseline_na, 'baseline': baseline}

def frequencies_generator(count=1, event=True):
    for frequency, _ in Indicator.TARGET_FREQUENCIES:
        if event or frequency != Indicator.EVENT:
            for c in range(count):
                yield {'target_frequency': frequency}

def powerset(iterable):
    "powerset([1,2,3]) --> () (1,) (2,) (3,) (1,2) (1,3) (2,3) (1,2,3)"
    s = list(iterable)
    return itertools.chain.from_iterable(itertools.combinations(s, r) for r in range(len(s)+1))