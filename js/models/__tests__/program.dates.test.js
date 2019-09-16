import { withReportingPeriod } from '../program';

describe("reporting period alone", () => {
    const Program = withReportingPeriod;
    it("interprets start date correctly", () => {
        let program = Program({reporting_period_start_iso: '2018-01-04'});
        expect(program.reportingPeriodStart.getUTCFullYear()).toBe(2018);
        expect(program.reportingPeriodStart.getUTCMonth()).toBe(0);
        expect(program.reportingPeriodStart.getUTCDate()).toBe(4);
    });
    it("interprets end date correctly", () => {
        let program = Program({reporting_period_end_iso: '2021-12-02'});
        expect(program.reportingPeriodEnd.getUTCFullYear()).toBe(2021);
        expect(program.reportingPeriodEnd.getUTCMonth()).toBe(11);
        expect(program.reportingPeriodEnd.getUTCDate()).toBe(2);
    });
});