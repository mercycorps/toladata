import getIndicatorReport from '../models/ipttIndicatorReport';

describe('bare IPTT Indicator Report Data', () => {
    const Indicator = getIndicatorReport;
    it('returns a pk', () => {
        let indicator = Indicator(1, {pk: '13'});
        expect(indicator.pk).toBe(13);
    });
    it('returns a frequency', () => {
        let indicator = Indicator('2', {pk: '13'});
        expect(indicator.frequency).toBe(2);
    });
    it('returns a lop target', () => {
        let indicator = Indicator(3, {lop_target: '140'});
        expect(indicator.lopTarget).toBe('140');
    });
    it('returns a decimal lop target', () => {
        let indicator = Indicator(3, {lop_target: '1.2'});
        expect(indicator.lopTarget).toBe('1.2');
    });
    it('returns a zero target', () => {
        let indicator = Indicator(3, {lop_target: '0'});
        expect(indicator.lopTarget).toBe('0');
    });
    it('returns a null target', () => {
        let indicator = Indicator(3, {lop_target: null});
        expect(indicator.lopTarget).toBeNull();
    });
    it('returns a lop actual', () => {
        let indicator = Indicator(3, {lop_actual: '140'});
        expect(indicator.lopActual).toBe('140');
    });
    it('returns a decimal lop actual', () => {
        let indicator = Indicator(3, {lop_actual: '1.2'});
        expect(indicator.lopActual).toBe('1.2');
    });
    it('returns a zero actual', () => {
        let indicator = Indicator(3, {lop_actual: '0'});
        expect(indicator.lopActual).toBe('0');
    });
    it('returns a null actual', () => {
        let indicator = Indicator(3, {lop_actual: null});
        expect(indicator.lopActual).toBeNull();
    });
    it("returns a lop percent met", () => {
        let indicator = Indicator(3, {lop_percent_met: '100'});
        expect(indicator.lopMet).toBe('100');
    });
    it("returns a decimal lop percent met", () => {
        let indicator = Indicator(3, {lop_percent_met: '90.4'});
        expect(indicator.lopMet).toBe('90.4');
    });
    it("returns a french decimal lop percent met", () => {
        let indicator = Indicator(3, {lop_percent_met: '5,3'});
        expect(indicator.lopMet).toBe('5,3');
    });
    describe("with report data", () => {
        const tpReportData = (periodValues) => periodValues.map((value, idx) => ({index: idx, actual: value}));
        const tvaReportData = (periodValues, targetValues, percentMetValues) => {
            return periodValues.map((value, idx) => ({index: idx, actual: value, target: targetValues[idx], percent_met: percentMetValues[idx]}));
        }
        const getIndicator = (reportData) => Indicator(3, {report_data: reportData});
        it('returns all null values', () => {
            let indicator = getIndicator(tpReportData([null, null, null]));
            expect(indicator.periodValues.length).toBe(3);
            expect(indicator.periodValues[1].actual).toBeNull();
        });
        it('returns non-null values', () => {
            let indicator = getIndicator(tpReportData(["100", "240"]));
            expect(indicator.periodValues.length).toBe(2);
            expect(indicator.periodValues[1].actual).toBe("240");
        });
        it("returns null tva report data", () => {
            let indicator = getIndicator(tvaReportData([null, null, null], [null, null, null], [null, null, null]));
            expect(indicator.periodValues.length).toBe(3);
            expect(indicator.periodValues[1].actual).toBeNull();
            expect(indicator.periodValues[1].target).toBeNull();
            expect(indicator.periodValues[1].percent_met).toBeNull();
        });
        it("returns non-null tva report data", () => {
            let indicator = getIndicator(tvaReportData(["14", "100"], ["28", "200"], ["50", "50"]));
            expect(indicator.periodValues.length).toBe(2);
            expect(indicator.periodValues[1].actual).toBe("100");
            expect(indicator.periodValues[1].target).toBe("200");
            expect(indicator.periodValues[1].percent_met).toBe("50");
        });
    });
    describe("with disaggregated lop data", () => {
        const getIndicator = (disaggregatedLop) => Indicator(3, {disaggregated_data: {14: {lop_actual: disaggregatedLop}}});
        it("returns a null lop", () => {
            let indicator = getIndicator(null);
            expect(indicator.disaggregatedLop(14)).toBeNull();
        });
        it("returns a non-null lop", () => {
            let indicator = getIndicator("100");
            expect(indicator.disaggregatedLop(14)).toBe("100");
        });
    });
    describe("with disaggregated tp report data", () => {
        const getIndicator = (disaggregatedActuals) => Indicator(3, {disaggregated_report_data: {14: disaggregatedActuals.map((value, idx) => ({index: idx, actual: value}))}});
        it("returns all null values", () => {
            let indicator = getIndicator([null, null]);
            expect(indicator.disaggregatedPeriodValues(14).length).toBe(2);
            expect(indicator.disaggregatedPeriodValues(14)[1].actual).toBeNull();
        });
        it("returns non-null values", () => {
            let indicator = getIndicator(["100", "4.51"]);
            expect(indicator.disaggregatedPeriodValues(14).length).toBe(2);
            expect(indicator.disaggregatedPeriodValues(14)[1].actual).toBe("4.51");
        });
        it("returns non-null values with implied nulls", () => {
            let disaggregatedData = [{index: 1, actual: "100"}, {index: 4, actual: "182"}];
            let indicator = Indicator(3, {disaggregated_report_data: {11: disaggregatedData}});
            expect(indicator.disaggregatedPeriodValues(11).length).toBe(5);
            expect(indicator.disaggregatedPeriodValues(11)[0].actual).toBeNull();
            expect(indicator.disaggregatedPeriodValues(11)[1].actual).toBe("100");
            expect(indicator.disaggregatedPeriodValues(11)[2].actual).toBeNull();
            expect(indicator.disaggregatedPeriodValues(11)[3].actual).toBeNull();
            expect(indicator.disaggregatedPeriodValues(11)[4].actual).toBe("182");
        });
        it("returns non-null values with implied nulls - last entry null", () => {
            let disaggregatedData = [{index: 2, actual: "75"}, {index: 6, actual: null}];
            let indicator = Indicator(3, {disaggregated_report_data: {11: disaggregatedData}});
            expect(indicator.disaggregatedPeriodValues(11).length).toBe(7);
            expect(indicator.disaggregatedPeriodValues(11)[0].actual).toBeNull();
            expect(indicator.disaggregatedPeriodValues(11)[1].actual).toBeNull();
            expect(indicator.disaggregatedPeriodValues(11)[2].actual).toBe("75");
            expect(indicator.disaggregatedPeriodValues(11)[3].actual).toBeNull();
            expect(indicator.disaggregatedPeriodValues(11)[4].actual).toBeNull();
            expect(indicator.disaggregatedPeriodValues(11)[5].actual).toBeNull();
            expect(indicator.disaggregatedPeriodValues(11)[6].actual).toBeNull();
        });
        it("returns null values with implied nulls", () => {
            let disaggregatedData = [{index: 3, actual: null}];
            let indicator = Indicator(3, {disaggregated_report_data: {142: disaggregatedData}});
            expect(indicator.disaggregatedPeriodValues(142).length).toBe(4);
            expect(indicator.disaggregatedPeriodValues(142)[0].actual).toBeNull();
            expect(indicator.disaggregatedPeriodValues(142)[1].actual).toBeNull();
            expect(indicator.disaggregatedPeriodValues(142)[2].actual).toBeNull();
            expect(indicator.disaggregatedPeriodValues(142)[3].actual).toBeNull();
        });
    });
});
