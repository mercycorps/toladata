import { extendObservable } from 'mobx';
import api from '../../apiv2';
import { getProgram, withRFLevelOrdering } from '../program';

jest.mock('../../apiv2');

const levelsTesting = (programJSON) => ({
    indicators: new Map([...new Set(
        Array.prototype.concat.apply((programJSON.unassigned_indicator_pks || []),
        (programJSON.indicator_pks_for_level || []).map(level => level.indicator_pks))
    )].map(pk => [pk, {pk: pk}])),
    levels: new Map([...new Set(
        (programJSON.level_pks_level_order || [])
            .concat(programJSON.level_pks_chain_order || [])
    )].map(pk => [pk, {pk: pk}]))
});

const bareLevelTest = (fn) => (programJSON) => {
    let program = extendObservable(extendObservable({}, levelsTesting(programJSON)), fn(programJSON));
    if (programJSON.indicator_pks_for_level) {
        program._updateLevelIndicatorsOrder(programJSON.indicator_pks_for_level);
    }
    return program;
}

describe("bare rf level ordering program", () => {
    const Program = bareLevelTest(withRFLevelOrdering);
    it("handles having no levels", () => {
        let program = Program({});
        expect(program.levelsInLevelOrder.length).toBe(0);
        expect(program.levelsInLevelOrder.length).toBe(0);
        expect(program.unassignedIndicators.length).toBe(0);
    });
    it("handles having two levels", () => {
        let program = Program({
            level_pks_level_order: [41, 12],
            level_pks_chain_order: [12, 41]
        });
        expect(program.levelsInLevelOrder.length).toBe(2);
        expect(program.levelsInLevelOrder[0].pk).toBe(41);
        expect(program.levelsInChainOrder.length).toBe(2);
        expect(program.levelsInChainOrder[0].pk).toBe(12);
        expect(program.unassignedIndicators.length).toBe(0);
    });
});

describe("RF Aware RFLevelOrdering program", () => {
    const Program = getProgram(levelsTesting, withRFLevelOrdering);
    const levelOrder = [14, 2, 3, 8];
    it("handles rf negative program", () => {
        let program = Program({
            results_framework: false,
            level_pks_level_order: levelOrder
        });
        expect(program.levelsInLevelOrder.length).toBe(4);
        expect(program.levelsInLevelOrder.map(i => i.pk)).toEqual(levelOrder);
        expect(program.levelsInChainOrder.map(i => i.pk)).toEqual(levelOrder);
        expect(program.unassignedIndicators.length).toBe(0);
    });
});

describe("program with unassigned indicators", () => {
    const Program = bareLevelTest(withRFLevelOrdering);
     it("handles having unassigned indicators", () => {
        let program = Program({
            level_pks_level_order: [41, 12, 13],
            level_pks_chain_order: [12, 41, 13],
            unassigned_indicator_pks: [431, 237]
        });
        expect(program.unassignedIndicators.length).toBe(2);
        expect(program.unassignedIndicators[0].pk).toBe(431);
     });
});

describe("program levels have correct indicator order", () => {
    const Program = bareLevelTest(withRFLevelOrdering);
    const indicator_pks_for_level = [
            {pk: 13, indicator_pks: [122, 18, 2]},
            {pk: 41, indicator_pks: []},
            {pk: 12, indicator_pks: [10]}
        ];
    var program;
    beforeEach(() => {
        program = Program({
            level_pks_level_order: [41, 12, 13],
            level_pks_chain_order: [13, 12, 41],
            unassigned_indicator_pks: [431, 237],
            indicator_pks_for_level: indicator_pks_for_level
        });
    });
    it("handles having level indicator orders", () => {
        expect(program.levels.get(13).indicatorOrder).toEqual([122, 18, 2]);
        expect(program.levels.get(41).indicatorOrder.length).toEqual(0);
        program._updateLevelIndicatorsOrder([
                indicator_pks_for_level[0],
                {pk: 41, indicator_pks: [422, 12]},
                {pk: 12, indicator_pks: []}
        ]);
        expect(program.levels.get(12).indicatorOrder.length).toEqual(0);
        expect(program.levels.get(41).indicatorOrder).toEqual([422, 12]);
    });
    it("lists all indicators in order", () => {
        expect(program.indicatorsInLevelOrder.map(indicator => indicator.pk)).toEqual([10, 122, 18, 2, 431, 237]);
        expect(program.indicatorsInChainOrder.map(indicator => indicator.pk)).toEqual([122, 18, 2, 10, 431, 237]);
    });
});

describe("program updates level order from api", () => {
    const Program = getProgram(levelsTesting, withRFLevelOrdering);
    const old_level_pks = [5, 3, 4, 2];
    const new_level_pks = [5, 3, 4];
    const old_chain_pks = [2, 5, 3, 4];
    const new_chain_pks = [4, 3, 5];
    const old_unassigned_indicators = [27, 422, 33];
    const new_unassigned_indicators = [27, 24];
    const old_indicator_pks_for_level = [
        {pk: 4, indicator_pks: [21, 3, 2]},
        {pk: 5, indicator_pks: []},
        {pk: 3, indicator_pks: [200, 203, 23]},
        {pk: 2, indicator_pks: [24, 25]},
    ];
    const new_indicator_pks_for_level = [
        {pk: 4, indicator_pks: [21, 203, 2, 23]},
        {pk: 5, indicator_pks: [422]},
        {pk: 3, indicator_pks: [200]},
    ];
    it("updates automatically", async () => {
        let program = Program({
            pk: 14,
            results_framework: true,
            level_pks_level_order: old_level_pks,
            level_pks_chain_order: old_chain_pks,
            indicator_pks_for_level: old_indicator_pks_for_level,
            unassigned_indicator_pks: old_unassigned_indicators
        });
        program._updateLevelIndicatorsOrder(old_indicator_pks_for_level);
        expect(program.indicatorsInChainOrder.map(i => i.pk)).toEqual([24, 25, 200, 203, 23, 21, 3, 2, 27, 422, 33]);
        api.rfLevelOrdering.mockResolvedValue({
            level_pks_level_order: new_level_pks,
            level_pks_chain_order: new_chain_pks,
            indicator_pks_for_level: new_indicator_pks_for_level,
            unassigned_indicator_pks: new_unassigned_indicators
        });
        await program.updateOrder();
        expect(program.indicatorsInChainOrder.map(i => i.pk)).toEqual([21, 203, 2, 23, 200, 422, 27, 24])
        expect(api.rfLevelOrdering).toBeCalledWith(14);
    });
});