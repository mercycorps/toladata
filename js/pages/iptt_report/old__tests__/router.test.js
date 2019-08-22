import ipttRouter from '../router';
import { TVA, TIMEPERIODS, GROUP_BY_CHAIN, GROUP_BY_LEVEL } from '../../../constants';


function getMockFilterStore() {
    return {
        reportType: null,
        programId: null,
        frequencyId: null,
        startPeriod: null,
        endPeriod: null,
        showAll: null,
        mostRecent: null,
        groupBy: null,
        levels: null,
        setStartPeriodFromDate() {
            return true;
        },
        setEndPeriodFromDate() {
            return true;
        },
        getLoadedProgram() {
            return Promise.resolve();
        }
    };
};

describe('router params processing initial url string', () => {
    var instance;
    var params = {name: 'iptt.tva', programId: '442', frequency: '4'};
    var mockFilterStore;
    beforeEach(() => {
        mockFilterStore = getMockFilterStore();
        instance = new ipttRouter(mockFilterStore);
    });
    it('processes report type from route name tva', () => {
        instance.processParams({...params, name: 'iptt.tva'});
        expect(mockFilterStore.reportType).toEqual(TVA);
    });
    it('processes report type from route name timeperiods', () => {
        instance.processParams({...params, name: 'iptt.timeperiods'});
        expect(mockFilterStore.reportType).toEqual(TIMEPERIODS);
    });
    it('handles nonsense report type', () => {
        instance.processParams({...params, name: 'iptt'});
        expect(mockFilterStore.reportType).toBeNull();
    });
    it('processes reportType, programID and frequency', () => {
        expect(mockFilterStore.reportType).toBeNull();
        expect(mockFilterStore.programId).toBeNull();
        expect(mockFilterStore.frequencyId).toBeNull();
        instance.processParams(params);
        expect(mockFilterStore.reportType).toEqual(TVA);
        expect(mockFilterStore.programId).toEqual(442);
        expect(mockFilterStore.frequencyId).toEqual(4);
    });
    it('processes targetperiods', () => {
        expect(mockFilterStore.frequencyId).toBeNull();
        instance.processParams({name: 'iptt.tva', programId: '442', targetperiods: '5'});
        expect(mockFilterStore.frequencyId).toEqual(5);
    });
    it('processes timeperiods', () => {
        expect(mockFilterStore.frequencyId).toBeNull();
        instance.processParams({name: 'iptt.timeperiods', programId: '442', timeperiods: '7'});
        expect(mockFilterStore.frequencyId).toEqual(7);
    });
    it('processes start', () => {
        expect(mockFilterStore.startPeriod).toBeNull();
        instance.processParams({...params, start: '2'});
        expect(mockFilterStore.startPeriod).toEqual(2);
    });
    it('processes end', () => {
        expect(mockFilterStore.endPeriod).toBeNull();
        instance.processParams({...params, end: '4'});
        expect(mockFilterStore.endPeriod).toEqual(4);
    });
    it('processes show all', () => {
        expect(mockFilterStore.showAll).toBeNull();
        instance.processParams({...params, timeframe: '1'});
        expect(mockFilterStore.showAll).toBeTruthy();
    });
    it('processes most recent', () => {
        expect(mockFilterStore.mostRecent).toBeNull();
        instance.processParams({...params, timeframe: '2', numrecentperiods: '3'});
        expect(mockFilterStore.mostRecent).toEqual(3);
    });
    it('processes most recent without timeperiods', () => {
        expect(mockFilterStore.mostRecent).toBeNull();
        instance.processParams({...params, timeframe: '2'});
        expect(mockFilterStore.mostRecent).toBeTruthy();
    });
    it('processes date range periods', () => {
        const startSpy = jest.spyOn(mockFilterStore, 'setStartPeriodFromDate');
        const endSpy = jest.spyOn(mockFilterStore, 'setEndPeriodFromDate');
        expect(mockFilterStore.startPeriod).toBeNull();
        expect(mockFilterStore.endPeriod).toBeNull();
        instance.processParams({...params, start_period: '2017-11-01', end_period: '2018-12-31'});
        expect(startSpy).toHaveBeenCalled();
        expect(startSpy.mock.calls[0][0].toISOString()).toEqual('2017-11-01T00:00:00.000Z');
        expect(endSpy).toHaveBeenCalled();
        expect(endSpy.mock.calls[0][0].toISOString()).toEqual('2018-12-31T00:00:00.000Z');
    });
    it('handles bad date range periods', () => {
        const startSpy = jest.spyOn(mockFilterStore, 'setStartPeriodFromDate');
        const endSpy = jest.spyOn(mockFilterStore, 'setEndPeriodFromDate');
        expect(mockFilterStore.startPeriod).toBeNull();
        expect(mockFilterStore.endPeriod).toBeNull();
        instance.processParams({...params, start_period: 'asdfasdf', end_period: ''});
        expect(startSpy).not.toHaveBeenCalled();
        expect(endSpy).not.toHaveBeenCalled();
    });
    it('handles group by value', () => {
        expect(mockFilterStore.groupBy).toBeNull();
        instance.processParams({...params, timeframe: '1', groupby: '1'});
        expect(mockFilterStore.groupBy).toEqual(GROUP_BY_CHAIN);
    });
    it('handles other group by value', () => {
        expect(mockFilterStore.groupBy).toBeNull();
        instance.processParams({...params, timeframe: '1', groupby: '2'});
        expect(mockFilterStore.groupBy).toEqual(GROUP_BY_LEVEL);
    });
    describe('initially processed filters', () => {
        let newParams = {...params, start: '0', end: '3', groupby: '1', };

        it('handles levels singular', async () => {
            let spy = jest.spyOn(mockFilterStore, 'getLoadedProgram');
            expect(mockFilterStore.levels).toBeNull();
            await instance.processParams({...newParams, levels: '1'});
            expect(mockFilterStore.levels).toEqual([1]);
        });
        it('handles levels array', async () => {
            let spy = jest.spyOn(mockFilterStore, 'getLoadedProgram');
            expect(mockFilterStore.levels).toBeNull();
            await instance.processParams({...newParams, levels: ['1', '2']});
            expect(mockFilterStore.levels).toEqual([1, 2]);
        });
    });
    //describe('after initial params processed', () => {
    //    var filterParams = {...params, levels: 1};
    //    it('calls for more data from program store', done => {
    //        instance.processParams(filterParams);
    //    });
    //})
    //it('processes single level filter', done => {
    //    expect(instance.processParams({...params, levels: '21'})
    //           .finally(() => {
    //            expect(instance.levels).toEqual([21]);
    //            done();
    //           })
    //    ).resolves.toBeTruthy();
    //});
    //it('processes multiple level filters', done => {
    //    expect(instance.processParams({...params, levels: ['21', '32', '45']})
    //           .finally(() => {
    //            expect(instance.levels).toEqual([21, 32, 45]);
    //            done();
    //           })
    //    ).resolves.toBeTruthy();
    //});
    //it('removes one tiers if set to levels', done => {
    //    expect.assertions(3);
    //    expect(instance.processParams({...params, levels: ['21', '32', '45'], tiers: '24'})
    //           .finally(() => {
    //            expect(instance.levels).toEqual([21, 32, 45]);
    //            expect(instance.tiers).toBeNull();
    //            done();
    //           })
    //    ).resolves.toBeTruthy();
    //});
    //it('removes many tiers if set to levels', done => {
    //    expect.assertions(3);
    //    expect(instance.processParams({...params, levels: ['21', '32', '45'], tiers: '24'})
    //           .finally(() => {
    //            expect(instance.levels).toEqual([21, 32, 45]);
    //            expect(instance.tiers).toBeNull();
    //            done();
    //           })
    //    ).resolves.toBeTruthy();
    //});
    //it('processes single tiers filter', done => {
    //    expect.assertions(2);
    //    expect(instance.processParams({...params, tiers: '21'})
    //           .finally(() => {
    //            expect(instance.tiers).toEqual([21]);
    //            done();
    //           })
    //    ).resolves.toBeTruthy();
    //});
    //it('processes multiple tiers filters', done => {
    //    expect.assertions(2);
    //    expect(instance.processParams({...params, tiers: ['21', '32', '45']})
    //           .finally(() => {
    //            expect(instance.tiers).toEqual([21, 32, 45]);
    //            done();
    //           })
    //    ).resolves.toBeTruthy();
    //});
    //it('processes single sites filter', done => {
    //    expect.assertions(2);
    //    expect(instance.processParams({...params, sites: '21'})
    //           .finally(() => {
    //            expect(instance.sites).toEqual([21]);
    //            done();
    //           })
    //    ).resolves.toBeTruthy();
    //});
    //it('processes multiple sites filters', done => {
    //    expect.assertions(2);
    //    expect(instance.processParams({...params, sites: ['21', '32', '45']})
    //           .finally(() => {
    //            expect(instance.sites).toEqual([21, 32, 45]);
    //            done();
    //           })
    //    ).resolves.toBeTruthy();
    //});
    //it('processes single types filter', done => {
    //    expect.assertions(2);
    //    expect(instance.processParams({...params, types: '21'})
    //           .finally(() => {
    //            expect(instance.types).toEqual([21]);
    //            done();
    //           })
    //    ).resolves.toBeTruthy();
    //});
    //it('processes multiple types filters', done => {
    //    expect.assertions(2);
    //    expect(instance.processParams({...params, types: ['21', '32', '45']})
    //           .finally(() => {
    //            expect(instance.types).toEqual([21, 32, 45]);
    //            done();
    //           })
    //    ).resolves.toBeTruthy();
    //});
    //it('processes single indicators filter', done => {
    //    expect.assertions(2);
    //    expect(instance.processParams({...params, indicators: '21'})
    //           .finally(() => {
    //            expect(instance.indicators).toEqual([21]);
    //            done();
    //           })
    //    ).resolves.toBeTruthy();
    //});
    //it('processes multiple indicators filters', done => {
    //    expect.assertions(2);
    //    expect(instance.processParams({...params, indicators: ['21', '32', '45']})
    //           .finally(() => {
    //            expect(instance.indicators).toEqual([21, 32, 45]);
    //            done();
    //           })
    //    ).resolves.toBeTruthy();
    //});
    //it('processes many filters', done => {
    //    expect.assertions(6);
    //    expect(instance.processParams({
    //        ...params,
    //        levels: ['22', '44'],
    //        tiers: '100',
    //        sites: '43',
    //        types: ['100', '99']})
    //        .finally(() => {
    //            expect(instance.levels).toEqual([22, 44]);
    //            expect(instance.tiers).toBeNull();
    //            expect(instance.sites).toEqual([43]);
    //            expect(instance.types).toEqual([100, 99]);
    //            expect(instance.indicators).toBeNull();
    //            done();
    //        })
    //    ).resolves.toBeTruthy();
    //});
    //it('gets params', done => {
    //    expect.assertions(2);
    //    let paramsToStart = {
    //        ...params,
    //        timeframe: '1',
    //        levels: ['22', '44'],
    //        tiers: '100',
    //        sites: '43',
    //        types: ['100', '99']
    //    };
    //    instance.processParams(paramsToStart)
    //        .finally(() => {
    //            let {name, timeframe, tiers, ...expectedParams} = paramsToStart;
    //            expectedParams.start = '0';
    //            expectedParams.end = '8';
    //            expectedParams.groupby = '1';
    //            expectedParams.sites = ['43'];
    //            expect(instance.routeName).toEqual(name);
    //            expect(instance.routeParams).toEqual(expectedParams);
    //            done();
    //    });
    //});
});