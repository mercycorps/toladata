import { ProgramPageProgram, ProgramPageStore } from '../models';
import programsData from './fixtures/programsData';
//import jsContext from './fixtures/jsContext';

describe('ProgramPageProgramStore', () => {
    it('initializes without crashing', () => {
        let ps = new ProgramPageProgram(programsData.unmigrated);
        expect(ps).not.toBeUndefined()
    });
    describe('initialized program store', () => {
        let stores = {};
        beforeAll(() => {
            Object.entries(programsData).forEach(
                ([key, jsonData]) => {
                    stores[key] = new ProgramPageProgram(jsonData);
                }
            );
        });
        it('gets ids correct', () => {
            expect(stores.rfAlways_indicatorsComplete.id).toEqual(999993);
            expect(stores.unmigrated.id).toEqual(1452);
        })
        it('gets names correct', () => {
            expect(stores.migratedNew.name).toBe("Migrated Program, Reporting period 4 years, one month open, custom tiers");
            expect(stores.frenchFilterLabel.name).toBe("Migrated, Reporting périod 1.5 years, open, MC Tiers");
            
        });
        it('gets dates correct', () => {
            expect(stores.unmigrated.start.getFullYear()).toEqual(2018);
            expect(stores.unmigrated.end.getMonth()).toEqual(5);
            expect(stores.migratedNew.end.getDate()).toEqual(31);
        });
        it('gets results framework correct', () => {
            expect(stores.migratedNew.resultsFramework).toBeTruthy();
            expect(stores.rfAlways_indicatorsIncomplete.resultsFramework).toBeTruthy();
            expect(stores.frenchFilterLabel.resultsFramework).toBeTruthy();
            expect(stores.unmigrated.resultsFramework).toBeFalsy();
        });
        it('gets chain sort labels correct', () => {
            expect(stores.unmigrated.resultChainFilterLabel).toBeFalsy();
            expect(stores.migratedNew.resultChainFilterLabel).toEqual("by Customóutput chain");
            expect(stores.migrated.resultChainFilterLabel).toEqual("by Outcome chain");
            expect(stores.frenchFilterLabel.resultChainFilterLabel).toEqual("par chaîne Résultat");
        });
        it('gets additional targets needed correct', () => {
            expect(stores.migratedNew.needsAdditionalTargetPeriods).toBeFalsy();
            expect(stores.rfAlways_indicatorsComplete.needsAdditionalTargetPeriods).toBeFalsy();
            expect(stores.frenchFilterLabel.needsAdditionalTargetPeriods).toBeFalsy();
            expect(stores.rfAlways_indicatorsIncomplete.needsAdditionalTargetPeriods).toBeTruthy();
        })
    });
});

describe('ProgramPageStore', () => {
    it('initializes without crashing', () => {
        let ps = new ProgramPageStore(programsData.unmigrated);
        expect(ps).not.toBeUndefined()
    });
    describe('unmigrated program page store', () => {
        var ps;
        beforeAll(() => {
            ps = new ProgramPageStore(programsData.unmigrated);
        });
        it('reflects old style levels', () => {
            expect(ps.oldStyleLevels).toBeTruthy();
        });
    });
    describe('migrated program page store - mc levels', () => {
        var ps;
        beforeAll(() => {
            ps = new ProgramPageStore(programsData.migrated);
        });
        it('reflects new style levels', () => {
            expect(ps.oldStyleLevels).toBeFalsy();
        });
    });
    describe('migrated program page store - custom levels', () => {
        var ps;
        beforeAll(() => {
            ps = new ProgramPageStore(programsData.migratedNew);
        });
        it('reflects new style levels', () => {
            expect(ps.oldStyleLevels).toBeFalsy();
        });
    });
});

//const indicators = jsContext.indicators;
//
//
//describe('IndicatorStore', () => {
//
//    it('filters by indicators needing targets', () => {
//        let is = new IndicatorStore(indicators);
//        let indicatorsNeedingTargets = is.getIndicatorsNeedingTargets;
//        expect(indicatorsNeedingTargets.length).toEqual(1);
//    });
//
//    it('find the sum of all results on all indicators in the store', () => {
//        let is = new IndicatorStore(indicators);
//        expect(is.getTotalResultsCount).toEqual(3);
//    });
//
//    it('find the sum of all results with evidence on all indicators in the store', () => {
//        let is = new IndicatorStore(indicators);
//        expect(is.getTotalResultsWithEvidenceCount).toEqual(2);
//    });
//
//});
//
//describe('')