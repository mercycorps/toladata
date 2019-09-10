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
        name: "Test name",
        number: "Output 1.1a",
        is_percent: false,
        baseline: "444",
        is_reporting: true,
        over_under: 0
    };
    it("handles values from different elements", () => {
        let indicator = Indicator(data);
        expect(indicator.pk).toBe(23);
        expect(indicator.name).toBe("Test name");
        expect(indicator.number).toBe("Output 1.1a");
        expect(indicator.isPercent).toBe(false);
        expect(indicator.baseline).toBe('444');
        expect(indicator.isReporting).toBeTruthy();
        expect(indicator.aboveTarget).toBe(false);
        expect(indicator.inScope).toBe(true);
    });
    it("handles updates", () => {
        let indicator = Indicator(data);
        expect(indicator.number).toBe("Output 1.1a");
        indicator.updateData({pk: 23, number: "Output 1.1b"});
        expect(indicator.number).toBe("Output 1.1b");
    });
})