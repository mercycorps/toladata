import React from 'react';
import ReactDOM from 'react-dom';
import eventBus from '../../eventbus';
import createRouter from 'router5';
import browserPlugin from 'router5-plugin-browser';

import IndicatorList from './components/indicator_list';
import { ProgramMetrics } from './components/program_metrics';
import ProgramPageRootStore from './models/programPageRootStore';
import { reloadPageIfCached } from '../../general_utilities';
import { IndicatorFilterType } from '../../constants';

import setupPinningDelete from './pinned_reports';

if (reactContext.deletePinnedReportURL) {
    setupPinningDelete(reactContext.deletePinnedReportURL);
}

/*
 * Model/Store setup
 */
const rootStore = new ProgramPageRootStore(reactContext);
const uiStore = rootStore.uiStore;


/*
 * Event Handlers
 */

// open indicator update modal with form loaded from server
eventBus.on('open-indicator-update-modal', (indicatorId) => {
    // Note: depends on indicator_list_modals.html

    let url = `/indicators/indicator_update/${indicatorId}/`;

    $("#indicator_modal_content").empty();
    $("#modalmessages").empty();

    $("#indicator_modal_content").load(url);
    $("#indicator_modal_div").modal('show');
});

// Indicator filters are controlled through routes
// these should no longer be called directly from components

// apply a gas gauge filter. Takes in IndicatorFilterType enum value
eventBus.on('apply-gauge-tank-filter', indicatorFilter => {
    // reset all filters
    eventBus.emit('clear-all-indicator-filters');

    uiStore.setIndicatorFilter(indicatorFilter);
});

// clear all gas tank and indicator select filters
eventBus.on('clear-all-indicator-filters', () => {
    uiStore.clearIndicatorFilter();
    rootStore.program.collapseAll();
});

// filter down by selecting individual indicator
eventBus.on('select-indicator-to-filter', (selectedIndicatorPk) => {
    // clear gauge tank filters
    uiStore.clearIndicatorFilter();

    uiStore.setSelectedIndicatorId(selectedIndicatorPk);
});


/*
 * React components on page
 */

ReactDOM.render(<IndicatorList rootStore={rootStore} uiStore={uiStore} />,
    document.querySelector('#indicator-list-react-component'));

ReactDOM.render(<ProgramMetrics rootStore={rootStore} uiStore={uiStore} />,
    document.querySelector('#program-metrics-react-component'));


/*
 * Copied and modified JS from indicator_list_modals.js to allow modals to work
 * without being completely converted to React
 */

function openResultsModal(url) {
    url += "?modal=1";
    $("#indicator_modal_content").empty();
    $("#modalmessages").empty();

    $("#indicator_results_modal_content").load(url);
    $("#indicator_results_div").modal('show');
}

// Open the CollectDataUpdate (update results) form in a modal
$("#indicator-list-react-component").on("click", ".results__link", function(e) {
    e.preventDefault();
    let url = $(this).attr("href");
    openResultsModal(url);
});

$('#indicator_results_div').on('review.tola.results.warning', (e, params) => {
    let url = params.url;
    openResultsModal(url);
})


// Open the IndicatorUpdate (Add targets btn in results section (HTML)) Form in a modal
$("#indicator-list-react-component").on("click", ".indicator-link[data-tab]", function(e) {
    e.preventDefault();
    let url = $(this).attr("href");
    url += "?modal=1";
    let tab = $(this).data("tab");
    if (tab && tab != '' && tab != undefined && tab != 'undefined') {
        url += "&targetsactive=true";
    }
    $("#indicator_modal_content").empty();
    $("#modalmessages").empty();

    $("#indicator_modal_content").load(url);
    $("#indicator_modal_div").modal('show');

});

// when indicator creation modal form completes a save
$('#indicator_modal_div').on('created.tola.indicator.save', (e, params) => {
    rootStore.program.updateIndicator(parseInt(params.indicatorId));
});

// when indicator update modal form completes a save or change to periodic targets
$('#indicator_modal_div').on('updated.tola.indicator.save', (e, params) => {
    let indicatorId = parseInt(params.indicatorId);

    rootStore.program.updateIndicator(indicatorId);

});

// when indicator is deleted from modal
$('#indicator_modal_div').on('deleted.tola.indicator.save', (e, params) => {
    rootStore.program.deleteIndicator(params.indicatorId);
});

// When "add results" modal is closed, the targets data needs refreshing
// the indicator itself also needs refreshing for the gas tank gauge
$('#indicator_results_div').on('save.tola.result_form', function (e) {
    let indicatorPk = parseInt($(this).find('form #id_indicator').val());
    rootStore.program.updateIndicator(indicatorPk);
});




/*
 * Routes setup:
 */

const routes = [
    { name: 'all', path: '/', filterType: IndicatorFilterType.noFilter },
    { name: 'targets', path: '/targets', filterType: IndicatorFilterType.missingTarget },
    { name: 'results', path: '/results', filterType: IndicatorFilterType.missingResults },
    { name: 'evidence', path: '/evidence', filterType: IndicatorFilterType.missingEvidence },
    { name: 'scope', path: '/scope', forwardTo: 'scope.on' },
    { name: 'scope.on', path: '/on', filterType: IndicatorFilterType.onTarget },
    { name: 'scope.above', path: '/above', filterType: IndicatorFilterType.aboveTarget },
    { name: 'scope.below', path: '/below', filterType: IndicatorFilterType.belowTarget },
    { name: 'scope.nonreporting', path: '/nonreporting', filterType: IndicatorFilterType.nonReporting },
    { name: 'indicator', path: '/indicator/:indicator_id<\\d+>', filterType: IndicatorFilterType.noFilter }
];

const router = createRouter(routes, {
    defaultRoute: 'all', //unrouted: show all indicators
    defaultParams: {},
    trailingSlashMode: 'always'
});

const onNavigation = (navRoutes) => {
    let routeName = navRoutes.route.name;
    let params = navRoutes.route.params;

    if (routeName === 'indicator') {
        eventBus.emit('select-indicator-to-filter', parseInt(params.indicator_id));
        return;
    }

    let routeObj = routes.find(r => r.name === routeName);
    eventBus.emit('apply-gauge-tank-filter', routeObj.filterType);
};
router.usePlugin(browserPlugin({useHash: true, base:'/program/'+rootStore.program.pk+'/'}));
router.subscribe(onNavigation);
router.start();


// nav events

eventBus.on('nav-apply-gauge-tank-filter', indicatorFilter => {
    // Find route based on filter type and go
    let routeObj = routes.find(r => r.filterType === indicatorFilter);
    router.navigate(routeObj.name);
});

eventBus.on('nav-clear-all-indicator-filters', () => {
    router.navigate('all')
});

eventBus.on('nav-select-indicator-to-filter', (selectedIndicatorId) => {
    router.navigate('indicator', {'indicator_id': selectedIndicatorId})
});



reloadPageIfCached();
