import IPTTQSProgram, { forIpttQs } from '../models/ipttQSProgram';

describe("bare iptt qs program", () => {
    const Program = forIpttQs;
    it("handles frequencies", () => {
        let program = Program({frequencies: [3, 4]});
        expect(program.validFrequency(3)).toBeTruthy();
        expect(program.validFrequency(2)).toBeFalsy();
        let program2 = Program({frequencies: []});
        expect(program2.validFrequency(3)).toBeFalsy();
    });
    it("handles date ranges", () => {
        let data = {
            period_date_ranges: {
                4: [
                    {start_label: "Jul 1, 2018", end_label: "Dec 31, 2018", past: true},
                    {start_label: "Jan 1, 2019", end_label: "Jun 30, 2019", past: true},
                    {start_label: "Jul 1, 2019", end_label: "Dec 31, 2019", past: true},
                    {start_label: "Jan 1, 2020", end_label: "Jun 30, 2020", past: false},
                    {start_label: "Jul 1, 2020", end_label: "Dec 31, 2020", past: false},
                ]
            }
        };
        let program = Program(data);
        expect(program.periodCount(4)).toBe(5);
        expect(program.currentPeriod(4)).toBe(3);
    });
});