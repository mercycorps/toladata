import FilterStore from '../models/filterStore';
import { TVA, TIMEPERIODS, GROUP_BY_CHAIN, GROUP_BY_LEVEL, BLANK_LABEL } from '../../../constants';

describe('filterStore basics (init)', () => {
    const getMockDataStore = () => ({
        isProgramValid: true,
        isFrequencyValid: true,
        lastPeriod: null,
        currentPeriod: null,
        getPeriodIndex: null,
        oldLevels: false,
        isLoaded: true,
        levels: [],
        tiers: [],
        levelOptions: [],
        tierOptions: [],
        programs: [],
        validProgramId()  {
            return () => this.isProgramValid;
        },
        getPrograms() {
            return this.programs;
        },
        loadProgram() {
            return Promise.resolve(true);
        },
        getProgram() {
            const validFreq = () => this.isFrequencyValid;
            const lastPeriod = () => ({index: this.lastPeriod});
            const currentPeriod = () => ({index: this.currentPeriod});
            const getPeriod = () => ({index: this.getPeriodIndex});
            const periodsFor = () => ({getPeriod: getPeriod});
            const isLoaded = () => this.isLoaded;
            const validLevel = (level) => this.levels.includes(level);
            const validTier = (tier) => this.tiers.includes(tier);
            const levelOptions = () => this.levelOptions;
            const tierOptions = () => this.tierOptions;
            const oldLevels = () => this.oldLevels;
            return {
                validFrequency: validFreq,
                lastPeriod: lastPeriod,
                currentPeriod: currentPeriod,
                periodsFor: periodsFor,
                get oldLevels() {
                    return oldLevels();
                },
                isLoaded: isLoaded,
                validLevel: validLevel,
                validTier: validTier,
                get levels() {
                    return levelOptions();
                },
                get tiers() {
                    return tierOptions();
                }
            };
        }
    });
    it('initializes without crashing', () => {
        let instance = new FilterStore(getMockDataStore());
        expect(instance).not.toBeUndefined();
    });
    describe('initialized filterstore', () => {
        var mockDataStore = getMockDataStore();
        var instance;
        beforeEach(() => {
            instance = new FilterStore(mockDataStore);
        });
        it('sets report type', () => {
            instance.reportType = TVA;
            expect(instance.reportType).toEqual(TVA);
            instance.reportType = TIMEPERIODS;
            expect(instance.reportType).toEqual(TIMEPERIODS);
            instance.reportType = null;
            expect(instance.reportType).toBeNull();
            instance.reportType = 'nonsense';
            expect(instance.reportType).toBeNull();
        });
        describe('with a reportType set', () => {
            beforeEach(() => {
                instance.reportType = TVA;
            });
            it('accepts a valid program ID', () => {
                mockDataStore.isProgramValid = true;
                instance.programId = 4;
                expect(instance.programId).toEqual(4);
            });
             it('rejects an invalid program ID', () => {
                mockDataStore.isProgramValid = false;
                instance.programId = 4;
                expect(instance.programId).toBeNull();
            });
            it('accepts a valid frequency', () => {
                mockDataStore.isProgramValid = true;
                mockDataStore.isFrequencyValid = true;
                instance.programId = 421;
                instance.frequencyId = 7;
                expect(instance.frequencyId).toEqual(7);
            });
            it('rejects an invalid frequency', () => {
                mockDataStore.isProgramValid = true;
                mockDataStore.isFrequencyValid = false;
                instance.programId = 421;
                instance.frequencyId = 7;
                expect(instance.frequencyId).toBeNull();
            });
            it('rejects a valid frequency if program is invalid', () => {
                mockDataStore.isProgramValid = false;
                mockDataStore.isFrequencyValid = true;
                instance.programId = 421;
                instance.frequencyId = 7;
                expect(instance.programId).toBeNull();
                expect(instance.frequencyId).toBeNull();
            });
            it('shows timeperiods and frequency disabled until program is selected', () => {
                mockDataStore.isProgramVald = true;
                expect(instance.programId).toBeNull();
                expect(instance.frequencyDisabled).toBeTruthy();
                expect(instance.periodsDisabled).toBeTruthy();
                expect(instance.filtersDisabled).toBeTruthy();
            });
            it('shows timeperiods but not frequency disabled until frequency is selected', () => {
                mockDataStore.isProgramValid = true;
                instance.programId = 421;
                expect(instance.frequencyId).toBeNull();
                expect(instance.frequencyDisabled).toBeFalsy();
                expect(instance.periodsDisabled).toBeTruthy();
                expect(instance.filtersDisabled).toBeTruthy();
            });
            it('shows timeperiods enabled when frequency is selected', () => {
                mockDataStore.isProgramValid = true;
                mockDataStore.isFrequencyValid = true;
                instance.programId = 421;
                instance.frequencyId = 7;
                expect(instance.frequencyDisabled).toBeFalsy();
                expect(instance.periodsDisabled).toBeFalsy();
                expect(instance.filtersDisabled).toBeFalsy();
            });
            it('shows timeperiods disabled when non timeaware frequency is selected', () => {
                mockDataStore.isProgramValid = true;
                mockDataStore.isFrequencyValid = true;
                instance.programId = 421;
                instance.frequencyId = 1;
                expect(instance.periodsDisabled).toBeTruthy();
                instance.frequencyId = 2;
                expect(instance.periodsDisabled).toBeTruthy();
                instance.frequencyId = 4;
                expect(instance.periodsDisabled).toBeFalsy();
                instance.frequencyId = 7;
                expect(instance.periodsDisabled).toBeFalsy();
            });
        });
        describe('with reportType, programId, and frequencyId loaded', () => {
            beforeEach(() => {
                mockDataStore.isProgramValid = true;
                mockDataStore.isFrequencyValid = true;
                instance.reportType = TVA;
                instance.programId = 4;
                instance.frequencyId = 7;
            });
            it('accepts a valid start period', () => {
                mockDataStore.lastPeriod = 6;
                instance.startPeriod = 3;
                expect(instance.startPeriod).toEqual(3);
            });
            it('rejects an invalid start period', () => {
                mockDataStore.lastPeriod = 3;
                instance.startPeriod = 4;
                expect(instance.startPeriod).toEqual(3);
            });
            it('accepts a valid end period', () => {
                mockDataStore.lastPeriod = 6;
                instance.endPeriod = 5;
                expect(instance.endPeriod).toEqual(5);
            });
            it('rejects an invalid end period', () => {
                mockDataStore.lastPeriod = 4;
                instance.endPeriod = 5;
                expect(instance.endPeriod).toEqual(4);
            });
            it('rejects an end before start', () => {
                mockDataStore.lastPeriod = 4;
                instance.startPeriod = 3;
                instance.endPeriod = 2;
                expect(instance.startPeriod).toEqual(3);
                expect(instance.endPeriod).toEqual(3);
            });
            it('accepts show all', () => {
                mockDataStore.lastPeriod = 4;
                instance.showAll = true;
                expect(instance.startPeriod).toEqual(0);
                expect(instance.endPeriod).toEqual(4);
            });
            it('reports true show all', () => {
                mockDataStore.lastPeriod = 6;
                instance.startPeriod = 0;
                instance.endPeriod = 6;
                expect(instance.showAll).toBeTruthy();
            });
            it('reports false show all (start)', () => {
                mockDataStore.lastPeriod = 6;
                instance.startPeriod = 1;
                instance.endPeriod = 6;
                expect(instance.showAll).toBeFalsy();
            });
            it('reports false show all (end)', () => {
                mockDataStore.lastPeriod = 6;
                instance.startPeriod = 0;
                instance.endPeriod = 5;
                expect(instance.showAll).toBeFalsy();
            });
            it('accepts most recent', () => {
                mockDataStore.currentPeriod = 3;
                mockDataStore.lastPeriod = 10;
                expect(instance.mostRecent).toBeFalsy();
                instance.mostRecent = 2;
                expect(instance.startPeriod).toEqual(2);
                expect(instance.endPeriod).toEqual(3);
            });
            it('handles invalid most recent', () => {
                mockDataStore.currentPeriod = 3;
                instance.mostRecent = 5;
                expect(instance.startPeriod).toEqual(0);
                expect(instance.endPeriod).toEqual(3);
                expect(instance.mostRecent).toEqual(4);
            });
            it('handles true most recent', () => {
                mockDataStore.currentPeriod = 5;
                instance.mostRecent = true;
                expect(instance.startPeriod).toEqual(4);
                expect(instance.endPeriod).toEqual(5);
                expect(instance.mostRecent).toEqual(2);
            });
            it('reports most recent', () => {
                mockDataStore.currentPeriod = 3;
                instance.startPeriod = 1;
                instance.endPeriod = 3;
                expect(instance.mostRecent).toEqual(3);
            });
            it('reports show all instead of most recent when both are true and show all clicked', () => {
                mockDataStore.currentPeriod = 10;
                mockDataStore.lastPeriod = 10;
                instance.showAll = true;
                expect(instance.startPeriod).toEqual(0);
                expect(instance.endPeriod).toEqual(10);
                expect(instance.showAll).toBeTruthy();
                expect(instance.mostRecent).toBeFalsy();
            });
            it('reports most recent instead of show all when both are true and most recent clicked', () => {
                mockDataStore.currentPeriod = 10;
                mockDataStore.lastPeriod = 10;
                instance.mostRecent = 11;
                expect(instance.startPeriod).toEqual(0);
                expect(instance.endPeriod).toEqual(10);
                expect(instance.showAll).toBeFalsy();
                expect(instance.mostRecent).toEqual(11);
            });
            it('handles start period from date', () => {
                mockDataStore.getPeriodIndex = 3;
                instance.setStartPeriodFromDate(new Date('2016-04-01'));
                expect(instance.startPeriod).toEqual(3);
            });
            it('handles end period from date', () => {
                mockDataStore.lastPeriod = 31;
                mockDataStore.getPeriodIndex = 31;
                instance.setEndPeriodFromDate(new Date('2016-04-01'));
                expect(instance.endPeriod).toEqual(31);
            });
            it('handles group by', () => {
                mockDataStore.oldLevels = false;
                expect(instance.groupBy).toEqual(GROUP_BY_CHAIN);
                instance.groupBy = GROUP_BY_LEVEL;
                expect(instance.groupBy).toEqual(GROUP_BY_LEVEL);
                instance.groupBy = GROUP_BY_CHAIN;
                expect(instance.groupBy).toEqual(GROUP_BY_CHAIN);
                expect(instance.groupByDisabled).toBeFalsy();
            });
            it('handles old style group by', () => {
                mockDataStore.oldLevels = true;
                expect(instance.groupBy).toBeNull();
                instance.groupBy = GROUP_BY_LEVEL;
                expect(instance.groupBy).toBeNull();
                instance.groupBy = GROUP_BY_CHAIN;
                expect(instance.groupBy).toBeNull();
                expect(instance.groupByDisabled).toBeTruthy();
            });
            describe('instance with program and periods set and old levels', () => {
                beforeEach(() => {
                    mockDataStore.lastPeriod = 6;
                    mockDataStore.oldLevels = true;
                    instance.startPeriod = 0;
                    instance.endPeriod = 5;
                });
                it('reports old levels through', () => {
                    expect(instance.oldLevels).toBeTruthy();
                });
                it('handles levels set', () => {
                    mockDataStore.levels = [1, 2];
                    instance.levels = [1, 2];
                    expect(instance.levels).toEqual([1, 2]);
                });
                it('handles invalid levels set', () => {
                    mockDataStore.levels = [1, 2];
                    instance.levels = [1, 3];
                    expect(instance.levels).toEqual([1]);
                });
                it('handles tiers set', () => {
                    instance.tiers = [1, 2, 3];
                    expect(instance.tiers).toEqual([]);
                });
                it('shows level options', () => {
                    let levelOptions = [
                        {pk: 1, name: "Level 1"},
                        {pk: 2, name: "D Level 2"},
                        {pk: 3, name: "B Level 3"}
                        ];
                    mockDataStore.levelOptions = levelOptions;
                    const spy = jest.fn(() => {
                        return levelOptions.map(
                            option => ({
                                level: {pk: option.pk}
                            })
                        );
                    });
                    instance.filterIndicators = spy;
                    expect(instance.levelOptions.length).toEqual(3);
                    expect(instance.levelOptions[2].label).toEqual("B Level 3");
                    expect(instance.levelOptions[0].value).toEqual(1);
                })
            });
            describe('instance with program and periods set and new levels', () => {
                beforeEach(() => {
                    mockDataStore.lastPeriod = 6;
                    mockDataStore.oldLevels = false;
                    instance.startPeriod = 0;
                    instance.endPeriod = 5;
                });
                it('reports old levels through', () => {
                    expect(instance.oldLevels).toBeFalsy();
                });
                it('handles levels set', () => {
                    mockDataStore.levels = [1, 2];
                    instance.levels = [1, 2];
                    expect(instance.levels).toEqual([1, 2]);
                });
                it('handles invalid levels set', () => {
                    mockDataStore.levels = [1, 2];
                    instance.levels = [1, 3];
                    expect(instance.levels).toEqual([1]);
                });
                it('handles tiers set', () => {
                    mockDataStore.tiers = [1, 2, 3];
                    instance.tiers = [1, 2, 3];
                    expect(instance.tiers).toEqual([1, 2, 3]);
                });
                it('handles invalid tiers set', () => {
                    mockDataStore.tiers = [1, 2];
                    instance.tiers = [1, 2, 3];
                    expect(instance.tiers).toEqual([1, 2]);
                });
                it('resets levels when tiers are set', () => {
                    mockDataStore.levels = [1, 2, 3];
                    mockDataStore.tiers = [1, 2, 3];
                    instance.levels = [1, 3];
                    expect(instance.levels).toEqual([1, 3]);
                    instance.tiers = [1];
                    expect(instance.levels).toEqual([]);
                    expect(instance.tiers).toEqual([1]);
                    instance.levels = [2, 3];
                    expect(instance.tiers).toEqual([]);
                    expect(instance.levels).toEqual([2, 3]);
                });
                it('shows level options', () => {
                    mockDataStore.tierOptions = [
                        {pk: 1, name: "Goal", depth: 1},
                        {pk: 2, name: "Output", depth: 2},
                        {pk: 3, name: "Outcome", depth: 3},
                        {pk: 4, name: "Activity", depth: 4}
                    ]
                    mockDataStore.levelOptions = [
                        {pk: 1, name: "Level 1", parent: null, level2parent: null, sort: 1, tier: {depth: 1}},
                        {pk: 2, name: "D Level 2", parent: 1, level2parent: null, sort: 1, tier: {depth: 2}},
                        {pk: 3, name: "B Level 3", parent: 2, level2parent: 2, sort: 1, tier: {depth: 3}},
                        {pk: 4, name: "B Level 4", parent: 3, level2parent: 2, sort: 1, tier: {depth: 4}},
                        {pk: 5, name: "C Level 3", parent: 2, level2parent: 2, sort: 2, tier: {depth: 3}},
                        {pk: 6, name: "C Level 4", parent: 5, level2parent: 2, sort: 1, tier: {depth: 4}},
                        {pk: 7, name: "B Level 2", parent: 1, level2parent: null, sort: 2, tier: {depth: 2}},
                        {pk: 8, name: "B Level 3", parent: 7, level2parent: 7, sort: 1, tier: {depth: 3}},
                        {pk: 9, name: "B Level 4", parent: 8, level2parent: 7, sort: 1, tier: {depth: 4}},
                        {pk: 10, name: "B Level 4", parent: 8, level2parent: 7, sort: 2, tier: {depth: 4}},
                        ];
                    const spy = jest.fn(() => {
                        return mockDataStore.levelOptions.map(
                            option => ({level: {pk: option.pk, tierPk: option.tier.depth}})
                        )
                    });
                    instance.filterIndicators = spy;
                    
                    expect(instance.levelOptions.length).toEqual(2);
                    expect(instance.levelOptions[0].label).toEqual('');
                    expect(instance.levelOptions[0].options.length).toEqual(4);
                    expect(instance.levelOptions[0].options[0].label).toEqual("Goal");
                    expect(instance.levelOptions[1].label).toEqual("Outcome Chains");
                    expect(instance.levelOptions[1].options[0].value).toEqual(2);
                    expect(instance.levelOptions[1].options[1].value).toEqual(7);
                });
            });
        });
    });
});
describe('fully initialized filterstore', () => {
    const getInitializedDataStore = () => ({
        programs: [
            {
                pk: 3,
                name: 'Test 3',
                frequencies: [4, 5, 6]
            }, {
                pk: 4,
                name: 'Test 4',
                frequencies: [4, 7]
            }, {
                pk: 5,
                name: 'Test 5',
                frequencies: [4, 5]
            }
        ],
        getPrograms() {
            return this.programs;
        },
        loadProgram() {
            return Promise.resolve(true);
        }
    });
    var mockDataStore;
    var instance;
    beforeEach(() => {
        mockDataStore = getInitializedDataStore();
        instance = new FilterStore(mockDataStore);
        instance.reportType = TVA;
    });
    it('shows program options', () => {
       expect(instance).not.toBeUndefined();
       expect(instance.programOptions.length).toEqual(3);
       expect(instance.programOptions[0].label).toEqual("Test 3");
       expect(instance.programOptions[2].value).toEqual(5);
    });
    it('shows blank program option', () => {
        mockDataStore.programs = [];
        expect(instance.programOptions.length).toEqual(1);
        expect(instance.programOptions[0].label).toEqual(BLANK_LABEL);
        expect(instance.programOptions[0].value).toBeNull()
    });
});
describe('dataStore with program selected', () => {
    const getProgramSelectedDataStore = () => ({
        validProgramId() { return () => true; },
        program: {
            periods: [
                {
                    year: 2018,
                    index: 0,
                    display: 'period 1 display',
                },
                {
                    year: 2018,
                    index: 1,
                    display: 'period 2 display',
                },
                {
                    year: 2019,
                    index: 2,
                    display: 'period 3 display',
                }, 
            ],
            pk: 3,
            name: 'Test 3',
            frequencies: [4, 5, 6],
            validFrequency() { return true; },
            initialized: {
                [TVA]: [4, 5],
                [TIMEPERIODS]: [5]
            },
            lastPeriod() {
                let index = this.periods.length - 1;
                return {index: index};
            },
            currentPeriod() {
                return this.lastPeriod();
            },
            isLoaded(rt, fr) {
                return this.initialized[rt].includes(fr);
            },
            periodsFor() {
                return this.periods;
            }
        },
        loadProgram() { return Promise.resolve(true);},
        getProgram() { return this.program; }
    });
    var mockDataStore;
    var instanceTVA;
    var instanceTIMEPERIODS;
    beforeEach(() => {
        mockDataStore = getProgramSelectedDataStore();
        instanceTVA = new FilterStore(mockDataStore);
        instanceTVA.reportType = TVA;
        instanceTVA.programId = 3;
        instanceTIMEPERIODS = new FilterStore(mockDataStore);
        instanceTIMEPERIODS.reportType = TIMEPERIODS;
        instanceTIMEPERIODS.programId = 3;        
    });
    it('shows frequency options', () => {
        expect(instanceTVA.frequencyOptions.length).toEqual(3);
        expect(instanceTIMEPERIODS.frequencyOptions.length).toEqual(5);
        expect(instanceTVA.frequencyOptions[2].value).toEqual(6);
        expect(instanceTVA.frequencyOptions[0].label).toEqual("Semi-annual");
        expect(instanceTIMEPERIODS.frequencyOptions[0].value).toEqual(3);
        expect(instanceTIMEPERIODS.frequencyOptions[3].label).toEqual("Quarters");
    });
    it('rejects programs with no frequency options', () => {
        mockDataStore.validProgramId = () => {return () => false;};
        instanceTVA.programId = 5;
        expect(instanceTVA.programId).toEqual(3);
    });
    it('reports initialized', () => {
        instanceTVA.frequencyId = 4;
        expect(instanceTVA.programIsLoaded).toBeTruthy();
        instanceTVA.frequencyId = 7;
        expect(instanceTVA.programIsLoaded).toBeFalsy();
        instanceTIMEPERIODS.frequencyId = 5;
        expect(instanceTIMEPERIODS.programIsLoaded).toBeTruthy();
        instanceTIMEPERIODS.frequencyId = 4;
        expect(instanceTIMEPERIODS.programIsLoaded).toBeFalsy();
    });
    it('shows start options', () => {
        instanceTVA.frequencyId = 4;
        expect(instanceTVA.startOptions.length).toEqual(2);
        expect(instanceTVA.startOptions[0].label).toEqual(2018);
        expect(instanceTVA.startOptions[0].options[1].label).toEqual('period 2 display');
        instanceTIMEPERIODS.frequencyId = 7;
        expect(instanceTIMEPERIODS.startOptions.length).toEqual(2);
        expect(instanceTIMEPERIODS.startOptions[1].options[0].value).toEqual(2);
    });
    it('shows end options', () => {
        instanceTVA.frequencyId = 4;
        instanceTVA.startPeriod = 1;
        expect(instanceTVA.endOptions.length).toEqual(2);
        expect(instanceTVA.endOptions[0].options.length).toEqual(1);
        expect(instanceTVA.endOptions[0].options[0].label).toEqual('period 2 display');
        instanceTIMEPERIODS.frequencyId = 7;
        instanceTIMEPERIODS.startPeriod = 2;
        expect(instanceTIMEPERIODS.endOptions.length).toEqual(1);
        expect(instanceTIMEPERIODS.endOptions[0].options[0].value).toEqual(2);
    });
 });
