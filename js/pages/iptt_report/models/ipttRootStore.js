import { observable, reaction } from 'mobx';

import getFilterStore from './filterStore';
import getReportStore from './reportStore';

import { TVA, TIMEPERIODS } from '../../../constants';
import api from '../../../apiv2';


export default (
    reactContext = {}
) => {
    let rootStore = observable({
        _filterStore: getFilterStore(reactContext),
        get filterStore() {return this._filterStore},
        _reportStore: getReportStore(reactContext.report || {}),
        _expandoRows: [],
        expandAllRows() {
            this._expandoRows.forEach(row => {row.expandRow()});
        },
        get allExpanded() {
            return this._expandoRows.every(row => row.state.expanded);
        },
        get allCollapsed() {
            return this._expandoRows.every(row => !row.state.expanded)
        },
        collapseAllRows() {
            this._expandoRows.forEach(row => {row.collapseRow()});
        },
        get reportStore() {return this._reportStore},
        get currentReport() {
            return this.reportStore.getReport(this.filterStore.selectedFrequency);
        },
        loadReportData({update = false} = {}) {
            return this.reportStore.callForReportData({programPk: this.filterStore.selectedProgramId,
                                                  frequency: this.filterStore.selectedFrequency,
                                                  reportType: this.filterStore.isTVA ? TVA : TIMEPERIODS,
                                                  update: update
                                                  });
        },
        get pinParams() {
            return {
                program: this.filterStore.selectedProgramId,
                report_type: this.filterStore.isTVA ? 'targetperiods' : 'timeperiods',
                query_string: this.filterStore.queryString
            };
        },
        get pinAPI() {
            return {
                programPageUrl: api.getProgramPageUrl(this.filterStore.selectedProgramId),
                pinReady: true,
                pinParams: this.pinParams,
                savePin(params) {
                    return api.savePinnedReport(params);
                }
            };
        },
        get excelAPI() {
            return {
                excelUrl: this.filterStore.excelUrl,
                fullExcelUrl: this.filterStore.fullExcelUrl
            };
        },
        get currentProgram() {
            return this.filterStore.programFilterData;
        },
        get currentProgramPageUrl() {
            return this.currentProgram ? api.getProgramPageUrl(this.currentProgram.pk) : null;
        },
        get isTVA() {
            return this.filterStore.isTVA;
        },
        get resultsFramework() {
            return this.filterStore.resultsFramework;
        },
        get levelRows() {
            return this.filterStore.resultsFramework && this.filterStore.allLevels.length > 0 ?
                this.filterStore.getLevelIndicatorGroups().filter(
                    levelGroup => ((levelGroup.indicators.length > 0) ||
                                  (!this.filterStore.filtersActive &&
                                   (levelGroup.level !== null) &&
                                   (levelGroup.level.tierDepth === 1)))
                ) :
                false;
        },
        get indicatorRows() {
            return this.filterStore.getAllIndicators();
        },
        get reportPeriods() {
            return (this.currentProgram && this.filterStore.selectedFrequency && this.filterStore.selectedFrequency !== 1) ?
                    (this.filterStore.selectedFrequency == 2 ?
                        this.currentProgram.periodRanges.get(this.filterStore.selectedFrequency).periods :
                        this.currentProgram.periodRanges.get(this.filterStore.selectedFrequency).periods
                            .slice(this.filterStore.startPeriodValue, this.filterStore.endPeriodValue + 1)) :
                [];
        },
        getReportData(indicatorPk) {
            return (this.currentReport && this.currentReport.has(parseInt(indicatorPk))) ?
                    this.currentReport.get(parseInt(indicatorPk)) : {};
        },
        periodValues(indicatorPk) {
            let periodValues = this.currentReport.has(parseInt(indicatorPk)) ?
                    (this.filterStore.selectedFrequency == 2 ?
                        this.currentReport.get(parseInt(indicatorPk)).periodValues :
                        this.currentReport.get(parseInt(indicatorPk)).periodValues
                            .slice(this.filterStore.startPeriodValue, this.filterStore.endPeriodValue + 1)) : [];
            if (periodValues && !this.isTVA) {
                periodValues = periodValues.map(periodValue => periodValue.actual);
            }
            return periodValues;
        },
        disaggregatedLop(indicatorPk, disaggregationPk) {
            return this.currentReport.has(parseInt(indicatorPk)) ?
                this.currentReport.get(parseInt(indicatorPk)).disaggregatedLop(parseInt(disaggregationPk)) : null;
        },
        disaggregatedPeriodValues(indicatorPk, disaggregationPk) {
            let periodValues = this.currentReport.has(parseInt(indicatorPk)) ? this.currentReport.get(parseInt(indicatorPk)).disaggregatedPeriodValues(parseInt(disaggregationPk)) : null;
            if (periodValues && this.filterStore.selectedFrequency != 2) {
                periodValues = periodValues.slice(this.filterStore.startPeriodValue, this.filterStore.endPeriodValue + 1);
            }
            if (periodValues && !this.isTVA) {
                periodValues = periodValues.map(periodValue => periodValue.actual);
            }
            return periodValues || [];
        },
        get hiddenCategories() {
            return this.filterStore._hiddenCategories === true;
        },
        get baseColumns() {
            return 8 + (this.filterStore.resultsFramework ? 0 : 1) - (this.filterStore._hiddenColumns.length);
        },
        get reportColumnWidth() {
            return this.baseColumns + (!this.resultsFramework && 1) + 3 + (this.reportPeriods.length) * (this.isTVA ? 3 : 1);
        },
        get activeDisaggregationPks() {
            return this.filterStore.currentDisaggregations;
        },
        indicatorHasActiveDisaggregations(indicator) {
            if (!indicator.hasDisaggregations(this.activeDisaggregationPks)) {
                return false;
            }
            if (this.hiddenCategories) {
                return this.activeDisaggregationPks.map(pk => (this.getDisaggregationLabels(pk).labels || []))
                                                           .reduce((a, b) => a.concat(b), [])
                                                           .filter(label => this.disaggregatedLop(indicator.pk, label.pk)).length > 0;
            }
            return true;
        },
        getDisaggregationLabels(disaggregationPk) {
            return (this.currentProgram && this.currentProgram.disaggregations.has(disaggregationPk)) ?
                this.currentProgram.disaggregations.get(disaggregationPk) : false;
        },
        get hasUOMColumn() {
            return !this.filterStore._hiddenColumns.includes(0);
        },
        get hasChangeColumn() {
            return !this.filterStore._hiddenColumns.includes(1);
        },
        get hasCNCColumn() {
            return !this.filterStore._hiddenColumns.includes(2);
        },
        get hasUOMTypeColumn() {
            return !this.filterStore._hiddenColumns.includes(3);
        },
        get hasBaselineColumn() {
            return !this.filterStore._hiddenColumns.includes(4);
        },
        loadResultsModal(indicatorPk) {
            api.indicatorResultsTable(indicatorPk, false).then(
                (data) => {
                    $('#indicator_modal_content').empty();
                    $('#modalmessages').empty();
                    $('#indicator_modal_content').html(data);
                    $('#indicator_modal_div').modal('show');
                }
            );
        },
        indicatorUpdate(e, {indicatorId, ...data}) {
            return this.filterStore.updateProgramFilterData().then(
                () => {this.loadReportData({update: true});}
            );
        },
        indicatorDelete(e, {indicatorId, ...data}) {
            this.filterStore.programFilterData.deleteIndicator(indicatorId);
        },
    });
    const _updateReportData = reaction(
        () => [rootStore.filterStore.selectedProgramId, rootStore.filterStore.selectedFrequency],
        ([programId, frequency]) => {
            if (programId && frequency) {
                rootStore.loadReportData();
            }
        },
        {fireImmediately: true}
    );
    return rootStore;
}
