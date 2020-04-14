import IPTTProgram, { forIPTT } from '../models/ipttProgram';

describe("bare iptt program", () => {
    const Program = forIPTT;
    it("handles frequencies", () => {
        let program = Program({frequencies: [3, 4]});
        expect(program.validFrequency(3)).toBeTruthy();
        expect(program.validFrequency(2)).toBeFalsy();
        let program2 = Program({frequencies: []});
        expect(program2.validFrequency(3)).toBeFalsy();
    });
    it("handles disaggregations", () => {
        let program = Program({disaggregations: [{pk: 4, name: 'Test Disaggregation', labels: [{pk: '10', name: "banana"}]}]});
        expect(Array.from(program.disaggregations.values())).toStrictEqual([{pk: 4, name: 'Test Disaggregation', labels: [{pk: 10, name: "banana"}], country: null}]);
    });
    it("doesn't show category-less disaggregations", () => {
        let program = Program({disaggregations: [{pk: 4, name: 'Test Disaggregation', labels: []}]});
        expect(Array.from(program.disaggregations.values())).toStrictEqual([]);
    });
});