import getIndicatorReport from '../models/ipttIndicatorReport';
import tpData from './fixtures/tp_report_data.json';
import tvaData from './fixtures/tva_report_data.json';

describe("IPTT Indicator Report", () => {
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
    });
    describe("Reports from TP Data", () => {
        const indicator1 = getIndicatorReport(5, tpData.report_data[0]);
        const indicator2 = getIndicatorReport(5, tpData.report_data[1]);
        const indicator3 = getIndicatorReport(5, tpData.report_data[2]);
        it("returns basic info", () => {
            expect(indicator1.pk).toBe(8671);
            expect(indicator1.frequency).toBe(5)
            expect(indicator2.pk).toBe(8672);
            expect(indicator2.frequency).toBe(5)
            expect(indicator3.pk).toBe(8673);
            expect(indicator3.frequency).toBe(5)
        });
        it("returns a lop target", () => {
            expect(indicator1.lopTarget).toBe('100');
            expect(indicator2.lopTarget).toBe('420.1');
            expect(indicator3.lopTarget).toBeNull();
        });
        it("returns a lop actual", () => {
            expect(indicator1.lopActual).toBe('90');
            expect(indicator2.lopActual).toBe('400.04');
            expect(indicator3.lopActual).toBeNull();
        });
        it("returns a lop percent met", () => {
            expect(indicator1.lopMet).toBe('90');
            expect(indicator2.lopMet).toBe('95.22');
            expect(indicator3.lopMet).toBeNull();
        });
        it("returns disaggregated lop data", () => {
            expect(indicator1.disaggregatedLop(271)).toBe("62");
            expect(indicator1.disaggregatedLop(277)).toBeNull();
            expect(indicator1.disaggregatedLop(283)).toBe("1.2");
        });
        it("returns period data", () => {
            expect(indicator1.periodValues.length).toBe(8);
            expect(indicator1.periodValues[1].actual).toBeNull();
            expect(indicator1.periodValues[4].actual).toBe('90');
            expect(indicator2.periodValues.length).toBe(8);
            expect(indicator2.periodValues[7].actual).toBeNull();
            expect(indicator2.periodValues[4].actual).toBe('400.02');
            expect(indicator3.periodValues.length).toBe(8);
            expect(indicator3.periodValues[4].actual).toBeNull();
        });
        it("returns disaggregated period data", () => {
            expect(indicator1.disaggregatedPeriodValues(277).length).toBe(8);
            expect(indicator1.disaggregatedPeriodValues(277)[4].actual).toBe("22.14");
            expect(indicator1.disaggregatedPeriodValues(277)[5].actual).toBeNull();
        });
    });
    describe("Reports from TvA Data", () => {
        const indicator1 = getIndicatorReport(2, tvaData.report_data[0]);
        const indicator2 = getIndicatorReport(2, tvaData.report_data[1]);
        it("returns basic info", () => {
            expect(indicator1.pk).toBe(8678);
            expect(indicator1.frequency).toBe(2);
            expect(indicator2.pk).toBe(8719);
            expect(indicator2.frequency).toBe(2);
        });
        it("returns a lop target", () => {
            expect(indicator1.lopTarget).toBe('88');
            expect(indicator2.lopTarget).toBe('300');
        });
        it("returns a lop actual", () => {
            expect(indicator1.lopActual).toBe('92');
            expect(indicator2.lopActual).toBe('279');
        });
        it("returns a lop percent met", () => {
            expect(indicator1.lopMet).toBe('104.55');
            expect(indicator2.lopMet).toBe('93');
        });
    });
});