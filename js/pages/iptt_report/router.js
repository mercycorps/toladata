import createRouter from 'router5';
import browserPlugin from 'router5-plugin-browser';
import { observable } from 'mobx';
import { TVA, TIMEPERIODS } from '../../constants';

const goodQueryParams = ['frequency', 'start', 'end', 'levels', 'types', 'sites',    
                         'sectors', 'indicators', 'tiers', 'groupby', 'mr'];
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

const parseArrayParams = (param) => {
    if (typeof param === 'string' || param instanceof String) {
        return [parseInt(param)];
    } else if (Array.isArray(param)) {
        return param.map(p => parseInt(p));
    } else if (Number.isInteger(param)) {
        return param;
    } else if (!isNaN(parseInt(param))) {
        return [parseInt(param)];
    }
    return [];
}

export default () => {
    const router = createRouter(routes, {trailingSlashMode: 'always'});
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
            return this._router.getState().params.mr == 1;
        },
        get groupBy() {
            return this._router.getState().params.groupby;
        },
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