import ProgramPageIndicator, { forProgramPage } from '../models/programPageIndicator';


describe("bare program page indicator", () => {
    const Indicator = forProgramPage;
    it("returns t/f for just_created, kpi, reporting", () => {
        let indicator = Indicator(
            {was_just_created: true, is_key_performance_indicator: true,
             is_reporting: true, has_all_targets_defined: true}
        );
        expect(indicator.wasJustCreated).toBeTruthy();
        expect(indicator.isKeyPerformanceIndicator).toBeTruthy();
        expect(indicator.isReporting).toBeTruthy();
        expect(indicator.hasAllTargetsDefined).toBeTruthy();
        let indicator2 = Indicator(
            {was_just_created: false, is_key_performance_indicator: false,
             is_reporting: false, has_all_targets_defined: false}
        );
        expect(indicator2.wasJustCreated).toBeFalsy();
        expect(indicator2.isKeyPerformanceIndicator).toBeFalsy();
        expect(indicator2.isReporting).toBeFalsy();
        expect(indicator2.hasAllTargetsDefined).toBeFalsy();
    });
    it("handles 3 over under values", () => {
        let indicator = Indicator({is_reporting: true, over_under: -1});
        expect(indicator.belowTarget).toBeTruthy();
        expect(indicator.aboveTarget).toBeFalsy();
        expect(indicator.inScope).toBeFalsy();
        let indicator2 = Indicator({is_reporting: true, over_under: 1});
        expect(indicator2.belowTarget).toBeFalsy();
        expect(indicator2.aboveTarget).toBeTruthy();
        expect(indicator2.inScope).toBeFalsy();
        let indicator3 = Indicator({is_reporting: true, over_under: 0});
        expect(indicator3.belowTarget).toBeFalsy();
        expect(indicator3.aboveTarget).toBeFalsy();
        expect(indicator3.inScope).toBeTruthy();
        let indicator4 = Indicator({is_reporting: true, over_under: null});
        expect(indicator4.belowTarget).toBeFalsy();
        expect(indicator4.aboveTarget).toBeFalsy();
        expect(indicator4.inScope).toBeFalsy();
        let indicator5 = Indicator({is_reporting: false, over_under: 1});
        expect(indicator5.belowTarget).toBeFalsy();
        expect(indicator5.aboveTarget).toBeFalsy();
        expect(indicator5.inScope).toBeFalsy();
    });
    it("handles results count", () => {
        let indicator = Indicator({results_count: 5});
        expect(indicator.resultsCount).toBe(5);
        let indicator2 = Indicator({results_count: '12'});
        expect(indicator2.resultsCount).toBe(12);
        let indicator3 = Indicator({results_count: null});
        expect(indicator3.resultsCount).toBe(false);
        let indicator4 = Indicator();
        expect(indicator4.resultsCount).toBe(false);
    });
    it("handles results with evidence count", () => {
        let indicator = Indicator({results_with_evidence_count: 5});
        expect(indicator.resultsWithEvidenceCount).toBe(5);
        let indicator2 = Indicator({results_with_evidence_count: '12'});
        expect(indicator2.resultsWithEvidenceCount).toBe(12);
        let indicator3 = Indicator({results_with_evidence_count: null});
        expect(indicator3.resultsWithEvidenceCount).toBe(false);
        let indicator4 = Indicator();
        expect(indicator4.resultsWithEvidenceCount).toBe(false);
    });
});

describe("full program page indicator", () => {
    const Indicator = ProgramPageIndicator;
    let data = {
        pk: 23,
        target_frequency: 3,
        name: "Test name",
        number: "Output 1.1a",
        is_percent: false,
        is_cumulative: false,
        baseline: "444",
        is_reporting: true,
        over_under: 0,
        lop_target: 64,
        lop_actual: 42,
        lop_met: 0.65625,
        lop_target_progress: 15.5,
        lop_actual_progress: 31,
        lop_met_progress: 2,
        reporting_period: "Jan 1, 2019 – Dec 31, 2019",
        periodic_targets: [
            {
                period_name: "Year 1",
                date_range: "Jan 1, 2019 – Dec 31, 2019",
                completed: true,
                most_recently_completed: true,
                target: 15.5,
                actual: 31,
                percent_met: 2,
                results: [
                    {
                        pk: 101,
                        date_collected: "Feb 21, 2019",
                        achieved: 25,
                        evidence_url: "https://www.example.com/101/",
                        record_name: null
                    }, {
                        pk: 131,
                        date_collected: "Mar 2, 2019",
                        achieved: 6,
                        evidence_url: null,
                        record_name: null
                    }
                ]
            }, {
                period_name: "Year 2",
                date_range: "Jan 1, 2020 – Dec 31, 2020",
                completed: false,
                most_recently_completed: false,
                target: 48.5,
                actual: 11,
                percent_met: 0.226804124,
                results: [
                    {
                        pk: 121,
                        date_collected: "Mar 1, 2020",
                        achieved: 11,
                        evidence_url: "https://www.example.com/121/",
                        record_name: "A record name"
                    }
                ]
            }
        ],
        no_target_results: [
            {
                pk: 114,
                date_collected: "Jan 14, 2018",
                achieved: 5,
                evidence_url: null,
                record_name: null
            }
        ]
    };
    it("handles values from different elements", () => {
        let indicator = Indicator(data);
        expect(indicator.pk).toBe(23);
        expect(indicator.frequency).toBe(3);
        expect(indicator.name).toBe("Test name");
        expect(indicator.number).toBe("Output 1.1a");
        expect(indicator.isPercent).toBe(false);
        expect(indicator.isCumulative).toBe(false);
        expect(indicator.baseline).toBe('444');
        expect(indicator.isReporting).toBeTruthy();
        expect(indicator.aboveTarget).toBe(false);
        expect(indicator.inScope).toBe(true);
        expect(indicator.lopTarget).toBe(64);
        expect(indicator.lopActual).toBe(42);
        expect(indicator.lopMet).toBe(0.65625);
        expect(indicator.lopTargetProgress).toBe(15.5);
        expect(indicator.lopActualProgress).toBe(31);
        expect(indicator.lopMetProgress).toBe(2);
        expect(indicator.reportingPeriod).toBe("Jan 1, 2019 – Dec 31, 2019");
        expect(indicator.periodicTargets.length).toBe(2);
        let target = indicator.periodicTargets[0];
        expect(target.periodName).toBe("Year 1");
        expect(target.dateRange).toBe("Jan 1, 2019 – Dec 31, 2019");
        expect(target.completed).toBeTruthy();
        expect(target.mostRecentlyCompleted).toBeTruthy();
        expect(target.target).toBe(15.5);
        expect(target.actual).toBe(31);
        expect(target.percentMet).toBe(2);
        expect(target.results.length).toBe(2);
        let result = target.results[0];
        expect(result.pk).toBe(101);
        expect(result.dateCollected).toBe("Feb 21, 2019");
        expect(result.achieved).toBe(25);
        expect(result.evidenceUrl).toBe("https://www.example.com/101/");
        expect(result.recordName).toBeFalsy();
        expect(indicator.noTargetResults.length).toBe(1);
        result = indicator.noTargetResults[0];
        expect(result.pk).toBe(114);
        expect(result.dateCollected).toBe("Jan 14, 2018");
        expect(result.achieved).toBe(5);
        expect(result.evidenceUrl).toBeFalsy();
        expect(result.recordName).toBeFalsy();
    });
    it("handles updates", () => {
        let indicator = Indicator(data);
        expect(indicator.number).toBe("Output 1.1a");
        indicator.updateData({pk: 23, number: "Output 1.1b"});
        expect(indicator.number).toBe("Output 1.1b");
    });
    
})