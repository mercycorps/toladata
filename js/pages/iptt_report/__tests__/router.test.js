jest.mock('router5');
import ipttRouter from '../router';
import { __setState } from 'router5';

/**
 *  IPTT Router for interfacing with browser query string in IPTT Report pages
 *  invoked by IPTT Filter Store
 *      router = IPTTRouter()
 */

describe("IPTT Router", () => {
    let router;
    beforeEach(() => {
        router = ipttRouter();
    });
    it("reports tva or timeperiods", () => {
        __setState({name: 'iptt.tva'});
        expect(router.isTVA).toBeTruthy();
        __setState({name: 'iptt.timeperiods'});
        expect(router.isTVA).toBeFalsy();
    });
    it("reports program id", () => {
        __setState({params: {programId: 4}});
        expect(router.programId).toBe(4);
    });
    it("reports frequency", () => {
        __setState({params: {frequency: 2}});
        expect(router.frequency).toBe(2);
        __setState({params: {timeperiods: 4}});
        expect(router.frequency).toBe(4);
        __setState({params: {targetperiods: 7}});
        expect(router.frequency).toBe(7);
    });
    it("reports start and end period count", () => {
        __setState({params: {start: 4, end: 18}});
        expect(router.start).toBe(4);
        expect(router.end).toBe(18);
    });
    it("reports timeframe (old query params)", () => {
        __setState({params: {timeframe: 1}});
        expect(router.timeframe.showAll).toBeTruthy();
        __setState({params: {timeframe: 2, numrecentperiods: 3}});
        expect(router.timeframe.mostRecent).toBe(3);
    });
    it("reports most recent (new query params)", () => {
        __setState({params: {mr: 0}});
        expect(router.mr).toBeFalsy();
        __setState({params: {}});
        expect(router.mr).toBeFalsy();
        __setState({params: {mr: 1}});
        expect(router.mr).toBeTruthy();
    });
    it("reports group by", () => {
        __setState({params: {groupby: 1}});
        expect(router.groupBy).toBe(1);
        __setState({params: {groupby: 2}});
        expect(router.groupBy).toBe(2);
    });
    it("reports level params", () => {
        __setState({params: {}});
        expect(router.levels).toStrictEqual([]);
        __setState({params: {levels: 1}});
        expect(router.levels).toStrictEqual([1]);
        __setState({params: {levels: [3, 4, 5]}});
        expect(router.levels).toStrictEqual([3, 4, 5]);
    });
    it("reports tiers params", () => {
        __setState({params: {}});
        expect(router.tiers).toStrictEqual([]);
        __setState({params: {tiers: 1}});
        expect(router.tiers).toStrictEqual([1]);
        __setState({params: {tiers: [3, 4, 5]}});
        expect(router.tiers).toStrictEqual([3, 4, 5]);
    });
    it("reports sectors params", () => {
        __setState({params: {}});
        expect(router.sectors).toStrictEqual([]);
        __setState({params: {sectors: 1}});
        expect(router.sectors).toStrictEqual([1]);
        __setState({params: {sectors: [3, 4, 5]}});
        expect(router.sectors).toStrictEqual([3, 4, 5]);
    });
    it("reports sites params", () => {
        __setState({params: {}});
        expect(router.sites).toStrictEqual([]);
        __setState({params: {sites: 1}});
        expect(router.sites).toStrictEqual([1]);
        __setState({params: {sites: [3, 4, 5]}});
        expect(router.sites).toStrictEqual([3, 4, 5]);
    });
    it("reports disaggregations params", () => {
        __setState({params: {}});
        expect(router.disaggregations).toStrictEqual([]);
        __setState({params: {disaggregations: 1}});
        expect(router.disaggregations).toStrictEqual([1]);
        __setState({params: {disaggregations: [3, 4, 5]}});
        expect(router.disaggregations).toStrictEqual([3, 4, 5]);
    });
    it("reports types params", () => {
        __setState({params: {}});
        expect(router.types).toStrictEqual([]);
        __setState({params: {types: 1}});
        expect(router.types).toStrictEqual([1]);
        __setState({params: {types: [3, 4, 5]}});
        expect(router.types).toStrictEqual([3, 4, 5]);
    });
    it("reports indicators params", () => {
        __setState({params: {}});
        expect(router.indicators).toStrictEqual([]);
        __setState({params: {indicators: 1}});
        expect(router.indicators).toStrictEqual([1]);
        __setState({params: {indicators: [3, 4, 5]}});
        expect(router.indicators).toStrictEqual([3, 4, 5]);
    });
});