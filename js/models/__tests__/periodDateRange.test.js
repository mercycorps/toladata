import { getPeriodDateRange } from '../periodDateRange';


describe('bare period date range', () => {
    const Range = getPeriodDateRange();
    it("handles a lop target frequency", () => {
        let data = {
            frequency: 1,
            periods: [
                {
                    start_label: 'May 1, 2017',
                    end_label: 'Nov 30, 2023',
                    past: null
                }
            ]
        };
        let range = Range(data);
        expect(range.frequency).toBe(1);
        expect(range.periodCount).toBe(1);
        expect(range.currentPeriod).toBeNull();
    });
    it("handles a larger frequency", () => {
        let data = {
            frequency: 4,
            periods: [
                {start_label: "Jan 1, 2016", end_label: "Jun 30, 2016", past: true},
                {start_label: "Jul 1, 2016", end_label: "Dec 31, 2016", past: true},
                {start_label: "Jan 1, 2017", end_label: "Jun 30, 2017", past: true},
                {start_label: "Jul 1, 2017", end_label: "Dec 31, 2017", past: true},
                {start_label: "Jan 1, 2018", end_label: "Jun 30, 2018", past: true},
                {start_label: "Jul 1, 2018", end_label: "Dec 31, 2018", past: true},
                {start_label: "Jan 1, 2019", end_label: "Jun 30, 2019", past: true},
                {start_label: "Jul 1, 2019", end_label: "Dec 31, 2019", past: true},
                {start_label: "Jan 1, 2020", end_label: "Jun 30, 2020", past: false},
                {start_label: "Jul 1, 2020", end_label: "Dec 31, 2020", past: false},
            ]
        };
        let range = Range(data);
        expect(range.frequency).toBe(4);
        expect(range.periodCount).toBe(10);
        expect(range.currentPeriod).toBe(7);
    });
})