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

from indicators.models import Indicator
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

class IPTTScenarioBuilder:
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