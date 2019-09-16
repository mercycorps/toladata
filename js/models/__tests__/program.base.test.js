import { getProgram } from '../program';


describe("Base program", () => {
    const Program = getProgram();
    const specialChars = "sπécîal chars";
    
    it("handles int or string pk", () => {
        let program = Program({pk: 4});
        expect(program.pk).toBe(4);
        let program2 = Program({pk: '555'});
        expect(program2.pk).toBe(555);
    });
    it("handles names with special characters", () => {
        let program = Program({name: specialChars});
        expect(program.name).toBe(specialChars);
    });
    it("handles long names", () => {
        let longName = "long name 12345678".repeat(25);
        let program = Program({name: longName});
        expect(program.name).toBe(longName);
    });
    it("handles results framework values", () => {
        let programRF = Program({results_framework: true});
        expect(programRF.resultsFramework).toBeTruthy();
        let programNonRF = Program({results_framework: false});
        expect(programNonRF.resultsFramework).toBeFalsy();
    });
    it("handles results chains with special chars", () => {
        let program = Program({results_framework: true, by_result_chain: specialChars});
        expect(program.resultChainFilterLabel).toBe(specialChars);
    });
    it("provides default result chain value", () => {
        let program = Program({results_framework: true});
        expect(program.resultChainFilterLabel).toBe("by Outcome chain");
    });
});