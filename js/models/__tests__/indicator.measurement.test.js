import { getIndicator, withMeasurement } from '../indicator';


describe("Bare measurement indicator", () => {
    const Indicator = getIndicator(withMeasurement);
    const specialChars = "sπécîal chars";
    const longName = "long name 12345678".repeat(25);

    it("handles string, long, bare, and special chars unit of measure", () => {
        let indicator = Indicator({unit_of_measure: "monkeys"});
        expect(indicator.unitOfMeasure).toBe("monkeys");
        let indicator2 = Indicator({unit_of_measure: longName});
        expect(indicator2.unitOfMeasure).toBe(longName);
        let indicator3 = Indicator({unit_of_measure: specialChars});
        expect(indicator3.unitOfMeasure).toBe(specialChars);
        let indicator4 = Indicator({unit_of_measure: ""});
        expect(indicator4.unitOfMeasure).toBeFalsy();
        let indicator5 = Indicator({unit_of_measure: null});
        expect(indicator5.unitOfMeasure).toBeFalsy();
    });
    it("handles true/false/bare percent/cumulative values", () => {
        let indicator = Indicator({is_percent: true, is_cumulative: true});
        expect(indicator.isPercent).toBeTruthy();
        expect(indicator.isCumulative).toBeTruthy();
        let indicator2 = Indicator({is_percent: false, is_cumulative: false});
        expect(indicator2.isPercent).toBeFalsy();
        expect(indicator2.isCumulative).toBeFalsy();
        let indicator3 = Indicator({is_percent: null, is_cumulative: null});
        expect(indicator3.isPercent).toBeFalsy();
        expect(indicator3.isCumulative).toBeFalsy();
        let indicator4 = Indicator();
        expect(indicator4.isPercent).toBeFalsy();
        expect(indicator4.isCumulative).toBeFalsy();
    });
    it("handles +/-/null direction of change", () => {
        let indicator = Indicator({direction_of_change: "+"});
        expect(indicator.directionOfChange).toBe("+");
        let indicator2 = Indicator({direction_of_change: "-"});
        expect(indicator2.directionOfChange).toBe("-");
        let indicator3 = Indicator({direction_of_change: ""});
        expect(indicator3.directionOfChange).toBeFalsy();
        let indicator4 = Indicator({direction_of_change: null});
        expect(indicator4.directionOfChange).toBeFalsy();
        let indicator5 = Indicator({});
        expect(indicator5.directionOfChange).toBeFalsy();
    });
    it("handles number, string, null lop values", () => {
        let indicator = Indicator({baseline: '150', lop_target: 250});
        expect(indicator.baseline).toBe('150');
        expect(indicator.lopTarget).toBe(250);
        let indicator2 = Indicator({baseline: '15%', lop_target: '20'});
        expect(indicator2.baseline).toBe('15%');
        expect(indicator2.lopTarget).toBe(20);
        let indicator3 = Indicator({baseline: null, lop_target: null});
        expect(indicator3.baseline).toBeFalsy();
        expect(indicator3.lopTarget).toBeFalsy();
        let indicator4 = Indicator();
        expect(indicator4.baseline).toBeFalsy();
        expect(indicator4.lopTarget).toBeFalsy();
        let indicator5 = Indicator({baseline: '0', lop_target: '0'});
        expect(indicator5.baseline).not.toBe(false);
        expect(indicator5.baseline).toBe('0');
        expect(indicator5.lopTarget).not.toBe(false);
        expect(indicator5.lopTarget).toBe(0);
    });
});

describe("Combined base / measurement indicator", () => {
    const Indicator = getIndicator(withMeasurement);
    it("gets values from both", () => {
        let indicator = Indicator({pk: 44, unit_of_measure: "bananas"});
        expect(indicator.pk).toBe(44);
        expect(indicator.unitOfMeasure).toBe("bananas");
    });
});