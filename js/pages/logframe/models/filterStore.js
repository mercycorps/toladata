/**
 * Filters for the logframe web view
 */

import createRouter from 'router5';
import browserPlugin from 'router5-plugin-browser';
import { observable, computed } from 'mobx';
import { GROUP_BY_CHAIN, GROUP_BY_LEVEL } from '../../../constants';


class FilterStore {
    @observable groupBy = null;
    routes = [
        {
            name: 'logframe',
            path: '/:programId<\\d+>/logframe/?groupby',
            defaultParams: {
                'groupby': 1
            }
        },
        {
            name: 'logframe-excel',
            path: '/:programId<\\d+>/logframe_excel/?groupby'
        }
    ];

    constructor() {
        this.router = createRouter(this.routes, {trailingSlashMode: 'always'});
        this.router.usePlugin(browserPlugin({useHash: false, base: '/program'}));
        this.router.subscribe(this.updateState);
        this.router.start();
        this.headerColumns = [
            gettext('Result level'),
            gettext('Indicators'),
            gettext('Means of verification'),
            gettext('Assumptions')
        ];
    }
    
    @computed get programId() {
        let state = this.router.getState();
        return state.params.programId || null;
    }
    
    updateState = ({ route, prevRoute }) => {
        this.groupBy = route.params.groupby;
    }
    
    setGroupBy(groupBy) {
        groupBy = parseInt(groupBy);
        let { name, params } = this.router.getState();
        if ([GROUP_BY_CHAIN, GROUP_BY_LEVEL].includes(groupBy)) {
            params.groupby = groupBy;
        }
        this.router.navigate(name, params, {reload: true});
    }
    
    @computed get excelUrl() {
        let { name, params } = this.router.getState();
        return this.router.buildUrl('logframe-excel', params);
    }
}

export default FilterStore;