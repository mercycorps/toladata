import { TVA, TIMEPERIODS, GROUP_BY_CHAIN, GROUP_BY_LEVEL } from '../../../constants';
import ProgramStore from '../models/programStore';

import programJSON from './fixtures/programStore';
import oneProgramFilter from './fixtures/oneProgramFilter';
import oneProgramData from './fixtures/oneProgram';
import otherProgramFilter from './fixtures/otherProgramFilter';
import otherProgramData from './fixtures/otherProgram';

var jsContext = {
    programs: programJSON
};

var mockAPI = {
    toReturn: null,
    callForReportData() {
        return Promise.resolve(this.toReturn);
    }
};

describe('programStore init', () => {
    it('initializes without crashing', () => {
        let instance = new ProgramStore(jsContext, mockAPI);
        expect(instance).not.toBeUndefined();
    });
    describe('initialied programstore', () => {
        var instance;
        beforeEach(() => {
            instance = new ProgramStore(jsContext, mockAPI);
        });
        it('validates program ids', () => {
            expect(instance.validProgramId( TVA )( 1 )).toBeTruthy();
            expect(instance.validProgramId( TVA )( 5 )).toBeFalsy();
            expect(instance.validProgramId( TVA )( 41 )).toBeFalsy();
            expect(instance.validProgramId( TIMEPERIODS )( 2 )).toBeTruthy();
            expect(instance.validProgramId( TIMEPERIODS )( 41 )).toBeTruthy();
            expect(instance.validProgramId( TIMEPERIODS )( 5 )).toBeFalsy();
        });
        it('returns programs list', () => {
            expect(instance.getPrograms( TVA ).length).toEqual(2);
            expect(instance.getPrograms( TIMEPERIODS ).length).toEqual(3);
        });
        it('returns single programs', () => {
            expect(instance.getProgram( 1 ).pk).toEqual(1);
            expect(instance.getProgram( 41 ).frequencies.length).toEqual(0);
            expect(instance.getProgram( 2 ).name).toEqual("A Test program 2");
        });
        it('returns a promise for a loaded program', done => {
            expect.assertions(2);
            const spyCall = jest.spyOn(mockAPI, 'callForReportData');
            mockAPI.toReturn = {id: 1, reportFrequency: 3, reportType: TVA, levels: []};
            return instance.getLoadedProgram( TVA, 1, 3 ).then(
                program => {
                    expect(spyCall).toHaveBeenCalled();
                    expect(program.isLoaded(TVA, 3)).toBeTruthy();
                    done();
                });
        });
    });
    describe('programstore with bad json options', () => {
        var instance;
        beforeEach(() => {
            let newContext = {
                programs: [
                    {
                        id: 1,
                        name: 'Test',
                        frequencies: [],
                        periodDateRanges: []
                    }, {
                        id: 2,
                        name: 'Test 2',
                        frequencies: [1, 3, 4],
                        periodDateRanges: {
                            1: [[
                                "Jan 1, 2018",
                                "Dec 31, 2019"
                               ]],
                           2: [[
                               "Jan 1, 2018",
                               "Dec 31, 2019",
                               "Midline"
                           ], [
                               "Jan 1, 2018",
                               "Dec 31, 2019",
                               "Endline"
                           ]],
                           3: [[
                               "Jan 1, 2018",
                               "Dec 31, 2018",
                               "False"
                           ], [
                               "Jan 1, 2019",
                               "Dec 31, 2019",
                               "False"
                           ]]
                        }
                    }
                ]
            };
            instance = new ProgramStore(newContext, mockAPI);
        });
        it('does not validate bad program ids', () => {
            expect(instance.validProgramId( TVA )(1)).toBeFalsy();
            expect(instance.validProgramId( TVA )(2)).toBeTruthy();
        });
    });
});

describe('program', () => {
    var store;
    beforeEach(() => {
        store = new ProgramStore(jsContext, mockAPI);
    });
    it('validates frequencies', () => {
        expect(store.getProgram( 1 ).frequencies).toEqual([1, 3]);
        expect(store.getProgram( 1 ).validFrequency(1)).toBeTruthy();
        expect(store.getProgram( 1 ).validFrequency(4)).toBeFalsy();
        expect(store.getProgram( 2 ).frequencies).toEqual([1, 4]);
        expect(store.getProgram( 2 ).validFrequency(4)).toBeTruthy();
        expect(store.getProgram( 2 ).validFrequency(7)).toBeFalsy();
    });
    it('returns the current period', () => {
        expect(store.getProgram( 1 ).currentPeriod( 3 ).index).toEqual(1); 
        expect(store.getProgram( 1 ).currentPeriod( 4 ).index).toEqual(2); 
        expect(store.getProgram( 2 ).currentPeriod( 3 ).index).toEqual(1); 
        expect(store.getProgram( 2 ).currentPeriod( 4 ).index).toEqual(2); 
    });
    it('returns the last period', () => {
        expect(store.getProgram( 1 ).lastPeriod( 3 ).index).toEqual(1);
        expect(store.getProgram( 1 ).lastPeriod( 4 ).index).toEqual(3);
        expect(store.getProgram( 2 ).lastPeriod( 3 ).index).toEqual(2);
        expect(store.getProgram( 2 ).lastPeriod( 4 ).index).toEqual(5);
    });
    it('returns the next start period after a date', () => {
        expect(store.getProgram( 1 ).periodsFor( 3 ).getPeriod({startAfter: new Date('2018-12-31')}).index).toEqual(1);
        expect(store.getProgram( 1 ).periodsFor( 3 ).getPeriod({startAfter: new Date('2019-01-01')}).index).toEqual(1);
        expect(store.getProgram( 1 ).periodsFor( 4 ).getPeriod({startAfter: new Date('2019-01-01')}).index).toEqual(2);
        expect(store.getProgram( 2 ).periodsFor( 4 ).getPeriod({startAfter: new Date('2019-12-10')}).index).toEqual(4);
        expect(store.getProgram( 2 ).periodsFor( 4 ).getPeriod({startAfter: new Date('2020-01-01')}).index).toEqual(4);
    });
    it('returns the most recent end period before a date', () => {
        expect(store.getProgram( 1 ).periodsFor( 3 ).getPeriod({endBefore: new Date('2018-12-31')}).index).toEqual(0);
        expect(store.getProgram( 1 ).periodsFor( 3 ).getPeriod({endBefore: new Date('2019-01-02')}).index).toEqual(0);
        expect(store.getProgram( 1 ).periodsFor( 4 ).getPeriod({endBefore: new Date('2018-12-31')}).index).toEqual(1);
        expect(store.getProgram( 2 ).periodsFor( 4 ).getPeriod({endBefore: new Date('2020-06-30')}).index).toEqual(4);
        expect(store.getProgram( 2 ).periodsFor( 4 ).getPeriod({endBefore: new Date('2020-09-15')}).index).toEqual(4);
    });
    it('returns the old level setting', () => {
        expect(store.getProgram( 1 ).oldLevels).toBeTruthy();
        expect(store.getProgram( 2 ).oldLevels).toBeFalsy();        
    });
});
describe('program with old-style level data loaded', () => {
    var program;
    beforeEach(() => {
        let multiProgramJSON = [...programJSON, oneProgramFilter];
        let store = new ProgramStore({programs: multiProgramJSON, reportData: oneProgramData}, mockAPI);
        program = store.getProgram( 542 );
    });
    it('should instance without crashing', () => {
        expect(program).not.toBeUndefined();
        expect(program.isLoaded(TIMEPERIODS, 5)).toBeTruthy();
    });
    it('should return old style level data', () => {
        expect(program.levels).not.toBeUndefined();
        expect(program.levels.length).toEqual(2);
        expect(program.validLevel(2)).toBeTruthy();
        expect(program.validLevel(4)).toBeFalsy();
        expect(program.validTier(1)).toBeFalsy();
    });
});
describe('program with new-style level data loaded', () => {
    var program;
    beforeEach(() => {
        let multiProgramJSON = [...programJSON, otherProgramFilter, oneProgramFilter];
        let store = new ProgramStore({programs: multiProgramJSON, reportData: otherProgramData}, mockAPI);
        program = store.getProgram( 442 );
    });
    it('should instance without crashing', () => {
        expect(program).not.toBeUndefined();
        expect(program.isLoaded(TIMEPERIODS, 7)).toBeTruthy();
    });
    it('should return new style level data', () => {
        expect(program.levels).not.toBeUndefined();
        expect(program.levels.length).toEqual(10);
        expect(program.validLevel(103)).toBeTruthy();
        expect(program.validLevel(98)).toBeFalsy();
        expect(program.validTier(3)).toBeTruthy();
        expect(program.validTier(48)).toBeFalsy();
    });
    it('should return levels with useful data', () => {
        expect(program.tiers[2].depth).toEqual(3);
        expect(program.getLevel(105).tier.pk).toEqual(3);
        expect(program.tiers[2].levels.length).toEqual(5);
        expect(program.tiers[1].levels[0].outcomeChainDisplay)
                .toEqual('Outcome 1 and sub-levels: Outcome Name (1.1.0.0)');
    });
});
describe('program without level data loaded', () => {
    var store;
    var program;
    beforeEach(() => {
        let multiProgramJSON = [...programJSON, oneProgramFilter];
        store = new ProgramStore({programs: multiProgramJSON}, mockAPI);
        program = store.getProgram( 542 );
    });
    it('should instance without crashing', () => {
        expect(program).not.toBeUndefined();
    });
    it('should report it is not loaded', () => {
        expect(program.isLoaded(TIMEPERIODS, 5)).toBeFalsy();
    });
    it('store should call for data', async () => {
        mockAPI.toReturn = oneProgramData;
        await store.loadProgram(TIMEPERIODS, 542, 5);
        expect(store.getProgram( 542 ).isLoaded(TIMEPERIODS, 5)).toBeTruthy();
    });
})
