import { observable, runInAction } from 'mobx';
import getIndicatorReport from './ipttIndicatorReport';
import { TIME_AWARE_FREQUENCIES, IRREGULAR_FREQUENCIES } from '../../../constants';
import api from '../../../apiv2';


/*
 * Report-specific data store for the IPTT report page
 * Responsible for storing, calling for, and serving report data.  Naive to other stores (bottom of the chain)
 * Initially attempts to populate report JSON data provided on initial react context
 * Note: report store stores INDICATOR PK data, without the extra step of program pk.  The only use of
 * program pks is for tracking loaded/loading status, otherwise all data is stored per indicator (which is also unique to program)
 * report data is accessed by indicator and frequency
 */
export default (
    reportJSON = {}
) => {
    const LOADING = 1;
    const LOADED = 2;

    let reportStore = observable({
        // initialize a map of all frequencies to empty maps, where indicator data will be stored (_reportMap[frequency][indicator_pk] = report data)
        _reportMap: observable.map([...TIME_AWARE_FREQUENCIES, ...IRREGULAR_FREQUENCIES].sort()
                                    .map(frequency => [frequency, observable.map()])),
        getReport(frequency) {
            return this._reportMap.get(frequency);
        },
        // initialize a map of all frequencies to empty maps, where program status will be stored (programStatus[frequency][program_pk] = LOADED/LOADING/null)
        programStatus: observable.map([...TIME_AWARE_FREQUENCIES, ...IRREGULAR_FREQUENCIES].sort()
                                      .map(frequency => [frequency, observable.map()])),
        callForReportData({update, ...params}) {
            // params provide report details (program, frequency)
            let programPk = parseInt(params.programPk);
            let frequency = parseInt(params.frequency);
            if (this.programStatus.get(frequency).get(programPk) === LOADING) {
                // already loading this data, does not need to update (the promise that set status to LOADING will update when complete)
                return Promise.resolve(false);
            }
            if (!update && this.programStatus.get(frequency).get(programPk) === LOADED) {
                // already loaded this data and update===false means we do not replace loaded data
                // note: update === false for when this is called to "check" if the data exists and only call if the data is missing
                return Promise.resolve(false);
            }
            // either data is not yet loaded or update === true (meaning we want to replace the data)
            // first set status to LOADING to prevent stacking calls:
            this.programStatus.get(frequency).set(programPk, LOADING);
            // this will return a promise (ajax fetch call) with report data in it (report data contains program pk and indicator pks):
            return api.getIPTTReportData(params)
                    .then(data => {
                        runInAction(() => {
                            this.updateReportData(data);
                        });
                    });
        },
        updateReportData(reportData) {
            // provided with report data, update map of indicator pks for this frequency with provided data:
            var frequency = parseInt(reportData.report_frequency);
            (reportData.report_data || [])
                .forEach(indicatorReportJSON => {
                    // getIndicatorReport returns observable model with indicator x frequency report data
                    let indicatorReport = getIndicatorReport(frequency, indicatorReportJSON);
                    this._reportMap.get(frequency).set(indicatorReport.pk, indicatorReport)
                });
            // having completed hydrating data, mark this program LOADED for this frequency (to prevent repeat calls)
            this.programStatus.get(frequency).set(parseInt(reportData.program_pk), LOADED);
            return reportData;
        }
    });
    // initialize report store with any provided report data:
    // NOTE: this could probably be moved to the update method on the object, not sure why it wasn't (maybe 'this' confusion?)
    if (reportJSON && reportJSON.report_data) {
        let frequency = parseInt(reportJSON.report_frequency);
        let initialReportData = reportStore.getReport(frequency);
        (reportJSON.report_data || [])
            .map(indicatorReportJSON => getIndicatorReport(frequency, indicatorReportJSON))
            .forEach(indicatorReport => initialReportData.set(indicatorReport.pk, indicatorReport))
        //mark this program x frequency as LOADED to prevent re-calling for this data
        reportStore.programStatus.get(frequency).set(parseInt(reportJSON.program_pk), LOADED);
    }
    return reportStore;
}
