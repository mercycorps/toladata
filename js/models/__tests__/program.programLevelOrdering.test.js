import { extendObservable } from 'mobx';
import api from '../../apiv2';
import { getProgram, withProgramLevelOrdering } from '../program';

jest.mock('../../apiv2');

const indicatorsTesting = (programJSON) => ({
    indicators: new Map([...new Set(
        (programJSON.indicator_pks_level_order || []).concat((programJSON.indicator_pks_chain_order || []))
    )].map(pk => [pk, {pk: pk}]))
});

const bareIndicatorsTest = (fn) => (programJSON) => extendObservable(extendObservable({}, indicatorsTesting(programJSON)), fn(programJSON));

describe("bare programLevelOrdering program", () => {
    const Program = bareIndicatorsTest(withProgramLevelOrdering);
    it("handles having no indicators", () => {
        let program = Program({});
        expect(program.indicatorsInLevelOrder.length).toBe(0);
        expect(program.indicatorsInChainOrder.length).toBe(0);
    });
    it("handles having two indicators", () => {
        let program = Program({
            indicator_pks_level_order: [41, 12],
            indicator_pks_chain_order: [12, 41]
        });
        expect(program.indicatorsInLevelOrder.length).toBe(2);
        expect(program.indicatorsInLevelOrder[0].pk).toBe(41);
        expect(program.indicatorsInChainOrder.length).toBe(2);
        expect(program.indicatorsInChainOrder[0].pk).toBe(12);
    });
});

describe("RF Aware programLevelOrdering program", () => {
    const Program = getProgram(indicatorsTesting, withProgramLevelOrdering);
    const levelOrder = [14, 2, 3, 8];
    it("handles rf negative program", () => {
        let program = Program({
            results_framework: false,
            indicator_pks_level_order: levelOrder
        });
        expect(program.indicatorsInLevelOrder.length).toBe(4);
        expect(program.indicatorsInLevelOrder.map(i => i.pk)).toEqual(levelOrder);
        expect(program.indicatorsInChainOrder.map(i => i.pk)).toEqual(levelOrder);
    });
});

describe("Updating programLevelOrdering program", () => {
    const Program = getProgram(indicatorsTesting, withProgramLevelOrdering);
    const resp = {
        indicator_pks_level_order: [14, 8, 12],
        indicator_pks_chain_order: [8, 14, 12]
    };
    api.programLevelOrdering.mockResolvedValue(resp);
    it("calls for update", async () => {
        let program = Program({
            pk: 44,
            results_framework: true,
            indicator_pks_level_order: [4, 8, 14, 12],
            indicator_pks_chain_order: [8, 4, 14, 12]
        });
        expect.assertions(6);
        expect(program.indicatorsInLevelOrder.length).toBe(4);
        await program.updateOrder();
        expect(program.indicatorsInLevelOrder.length).toBe(3);
        expect(program.indicatorsInChainOrder.length).toBe(3);
        expect(program.indicatorsInLevelOrder[0].pk).toBe(14);
        expect(program.indicatorsInChainOrder[1].pk).toBe(14);
        expect(api.programLevelOrdering).toBeCalledWith(44);
    });
})