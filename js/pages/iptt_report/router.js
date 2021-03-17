import createRouter from 'router5';
import browserPlugin from 'router5-plugin-browser';
import { observable } from 'mobx';
import { TVA, TIMEPERIODS } from '../../constants';


// Building these in place to allow for the fact that these change semi-frequently as new filters are added:
// these are the parameters we expect in queries built in the Reaact paradigm:
const goodQueryParams = ['frequency', 'start', 'end', 'levels', 'types', 'sites', 'disaggregations',
                         'sectors', 'indicators', 'tiers', 'groupby', 'mr', 'columns'];
// these are still accepted for backwards compatibility with our previous static IPTT queries (could be pinned, bookmarked, etc.)
const oldQueryParams = ['timeframe', 'numrecentperiods', 'numrecentcount', 'start_period', 'end_period'];

const queryParams = '?' + [...goodQueryParams, ...oldQueryParams].join('&');

const routes =  [
    {
        name: 'iptt',
        path: '/iptt_report/:programId<\\d+>',
        children: [
            {
                name: 'timeperiods',
                path: '/timeperiods?timeperiods'
            },
            {
                name: 'tva',
                path: '/targetperiods?targetperiods'
            }
        ]
    },
    {
        name: 'ipttExcel',
        path: '/iptt_api/iptt_excel?fullTVA&reportType&programId'
    }
];

// helper function for making sure the parameter read out of the URL is provided in a format expected by the domain stores:
const parseArrayParams = (param) => {
    if (typeof param === 'string' || param instanceof String) {
        return [parseInt(param)];
    } else if (Array.isArray(param)) {
        return param.map(p => parseInt(p));
    } else if (Number.isInteger(param)) {
        return [param];
    } else if (!isNaN(parseInt(param))) {
        return [parseInt(param)];
    }
    return [];
}

/*
 * Constructs a router wrapper which provides helper methods acting on the underlying router5 router specific to the IPTT
 * Used to extract information from the initial URL and hydrate the filter store, and for updating the URL as the filter store
 * is interacted with by the user
 */
export default () => {
    const router = createRouter(routes, {trailingSlashMode: 'always'});
    // this marks all query params above as available:
    router.setRootPath(queryParams);
    router.usePlugin(browserPlugin({useHash: false, base: '/indicators'}));
    router.start();
    return observable.object({
        _router: router,
        get isTVA() {
            return this._router.getState().name === 'iptt.tva';
        },
        get programId() {
            return this._router.getState().params.programId;
        },
        get frequency() {
            let {frequency, timeperiods, targetperiods, ...params} = this._router.getState().params;
            if (!isNaN(parseInt(frequency))) { return parseInt(frequency); }
            if (!isNaN(parseInt(timeperiods))) { return parseInt(timeperiods); }
            if (!isNaN(parseInt(targetperiods))) { return parseInt(targetperiods); }
            return null;
        },
        get start() {
            return this._router.getState().params.start;
        },
        get end() {
            return this._router.getState().params.end;
        },
        get timeframe() {
            if (this._router.getState().params.timeframe == 2) {
                return {mostRecent: this._router.getState().params.numrecentperiods};
            } else if (this._router.getState().params.timeframe == 1) {
                return {showAll: true};
            }
            return false;
        },
        get mr() {
            // this param was added for when Most Recent <x> periods is the same data as show all, to make sure "most recent" is checked
            return this._router.getState().params.mr == 1;
        },
        get groupBy() {
            return this._router.getState().params.groupby;
        },
        // the following all refer to filters (i.e. indicators is 'indicator pks we are filtering to')
        get levels() {
            return parseArrayParams(this._router.getState().params.levels);
        },
        get tiers() {
            return parseArrayParams(this._router.getState().params.tiers);
        },
        get sectors() {
            return parseArrayParams(this._router.getState().params.sectors);
        },
        get sites() {
            return parseArrayParams(this._router.getState().params.sites);
        },
        get disaggregations() {
            return parseArrayParams(this._router.getState().params.disaggregations);
        },
        get hiddenCategories() {
            let disaggParams = this._router.getState().params.disaggregations;
            return Array.isArray(disaggParams) ? disaggParams.includes('hide-categories') : disaggParams && disaggParams == 'hide-categories';
        },
        get columns() {
            return parseArrayParams(this._router.getState().params.columns);
        },
        get types() {
            return parseArrayParams(this._router.getState().params.types);
        },
        get indicators() {
            return parseArrayParams(this._router.getState().params.indicators);
        },
        updateParams({tva, ...params}) {
            let routeName = tva ? 'iptt.tva' : 'iptt.timeperiods'
            let path = this._router.buildPath(routeName, params);
            if (path !== this._router.getState().path) {
                this._router.navigate(routeName, params, {replace: true});
            }
        },
        get queryParams() {
            return this._router.getState().params;
        },
        getExcelUrl({tva, ...params}) {
            return this._router.buildUrl('ipttExcel',
                                         {...params,
                                         reportType: tva ? TVA : TIMEPERIODS,
                                         fullTVA: false});
        },
        getFullExcelUrl({programId, groupby, ...params}) {
            return this._router.buildUrl('ipttExcel',
                                         {programId: programId,
                                         groupBy: groupby,
                                         fullTVA: true});
        },
    });
}
