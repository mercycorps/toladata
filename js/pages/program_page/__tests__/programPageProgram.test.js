import api from '../../../apiv2';
import ProgramPageProgram, { forProgramPage } from '../models/programPageProgram';

jest.mock('../../../apiv2');

describe("bare program page program", () => {
    const Program = forProgramPage;
    it("handles t/f needs additional target periods", () => {
        let program = Program({needs_additional_target_periods: false});
        expect(program.needsAdditionalTargetPeriods).toBeFalsy();
        let program2 = Program({needs_additional_target_periods: true});
        expect(program2.needsAdditionalTargetPeriods).toBeTruthy();
    });
});

describe("with indicator data", () => {
    const Program = ProgramPageProgram;
    const programJSON = {
        pk: 100,
        results_framework: true,
        indicator_pks_level_order: [41, 14],
        indicator_pks_chain_order: [41, 14],
        indicators: {
            '41': {
                pk: 41,
                lop_target: 200,
                number: "Number1"
            },
            '14': {
                pk: 14,
                lop_target: 50,
                number: "Number2"
            }
        }
    };
    const resp = {
        indicator_pks_level_order: [14, 41],
        indicator_pks_chain_order: [14, 41],
        indicator: {
            pk: 41,
            lop_target: 155
        },
        indicators: {
            '41': {
                pk: 41,
                number: "New Number 1"
            },
            '14': {
                pk: 14,
                number: "New Number 2"
            }
        }
    };
    api.updateProgramPageIndicator.mockResolvedValue(resp);
    api.programLevelOrdering.mockResolvedValue(
        {indicator_pks_level_order: resp.indicator_pks_level_order,
         indicator_pks_chain_order: resp.indicator_pks_chain_order,
         indicators: resp.indicators});
    it("provides expanded/collapsed list", () => {
        let program = Program(programJSON);
        expect(program.isExpanded(41)).toBeFalsy();
        expect(program.isExpanded(14)).toBeFalsy();
        program.expand(41);
        expect(program.isExpanded(41)).toBeTruthy();
        expect(program.isExpanded(14)).toBeFalsy();
        program.expand(14);
        program.collapse(41);
        expect(program.isExpanded(41)).toBeFalsy();
        expect(program.isExpanded(14)).toBeTruthy();
        program.collapseAll();
        expect(program.isExpanded(41)).toBeFalsy();
        expect(program.isExpanded(14)).toBeFalsy();
        program.expandAll();
        expect(program.isExpanded(41)).toBeTruthy();
        expect(program.isExpanded(14)).toBeTruthy();
    })
    it("updates indicator and order", async () => {
        let program = Program(programJSON);
        expect.assertions(7);
        expect(program.indicatorsInLevelOrder[0].lopTarget).toEqual(200);
        expect(program.indicatorsInChainOrder[1].pk).toEqual(14);
        expect(program.indicators.get(14).number).toEqual("Number2");
        await program.updateIndicator(41);
        expect(api.updateProgramPageIndicator).toBeCalledWith(41);
        expect(program.indicatorsInLevelOrder[0].pk).toEqual(14);
        expect(program.indicatorsInChainOrder[1].lopTarget).toEqual(155);
        expect(program.indicators.get(14).number).toEqual("New Number 2");
    });
    it("updates indicator and order", async () => {
        let program = Program({
            pk: 100,
            results_framework: true,
            indicator_pks_level_order: [41, 22, 14],
            indicator_pks_chain_order: [22, 41, 14],
            indicators: {'41': {pk: 41, number: "Number"}, '14': {pk: 14}, '22': {pk: 22}}
        });
        expect.assertions(8);
        expect(program.indicatorsInLevelOrder[1].pk).toEqual(22);
        expect(program.indicatorsInChainOrder[1].pk).toEqual(41);
        expect(program.indicatorsInChainOrder.length).toEqual(3);
        expect(program.indicators.get(41).number).toEqual("Number");
        await program.deleteIndicator(22);
        expect(api.programLevelOrdering).toBeCalledWith(100);
        expect(program.indicatorsInLevelOrder[0].pk).toEqual(14);
        expect(program.indicatorsInChainOrder.length).toEqual(2);
        expect(program.indicators.get(41).number).toEqual("New Number 1");
    });
});