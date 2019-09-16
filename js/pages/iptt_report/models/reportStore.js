import { observable, runInAction } from 'mobx';

import { TIME_AWARE_FREQUENCIES, IRREGULAR_FREQUENCIES } from '../../../constants';
import api from '../../../apiv2';


const getIndicatorReport = (
    frequency,
    indicatorReportJSON = {}
) => observable({
    pk: parseInt(indicatorReportJSON.pk),
    frequency: parseInt(frequency),
    _lopTarget: indicatorReportJSON.lop_target,
    get lopTarget() {
        return this._lopTarget;
    },
    _lopActual: indicatorReportJSON.lop_actual,
    get lopActual() {
        return this._lopActual;
    },
    _lopMet: indicatorReportJSON.lop_percent_met,
    get lopMet() {
        return this._lopMet;
    },
    _reportData: observable(new Map((indicatorReportJSON.report_data || [])
                                    .map(periodJSON => [parseInt(periodJSON.index), periodJSON]
        ))),
    get periodValues() {
        return Array.from(this._reportData.values());
    }
});


export default (
    reportJSON = {}
) => {
    const LOADING = 1;
    const LOADED = 2;
    
    let reportStore = observable({
        _reportMap: observable.map([...TIME_AWARE_FREQUENCIES, ...IRREGULAR_FREQUENCIES].sort()
                                    .map(frequency => [frequency, observable.map()])),
        getReport(frequency) {
            return this._reportMap.get(frequency);
        },
        programStatus: observable.map([...TIME_AWARE_FREQUENCIES, ...IRREGULAR_FREQUENCIES].sort()
                                      .map(frequency => [frequency, observable.map()])),
        callForReportData({update, ...params}) {
            let programPk = parseInt(params.programPk);
            let frequency = parseInt(params.frequency);
            if (this.programStatus.get(frequency).get(programPk) === LOADING) {
                return Promise.resolve(false);
            }
            if (!update && this.programStatus.get(frequency).get(programPk) === LOADED) {
                return Promise.resolve(false);
            }
            this.programStatus.get(frequency).set(programPk, LOADING);
            return api.getIPTTReportData(params)
                    .then(data => {
                        runInAction(() => {
                            this.updateReportData(data);
                        });
                    });
        },
        updateReportData(reportData) {
            var frequency = parseInt(reportData.report_frequency);
            (reportData.report_data || [])
                .forEach(indicatorReportJSON => {
                    let indicatorReport = getIndicatorReport(frequency, indicatorReportJSON);
                    this._reportMap.get(frequency).set(indicatorReport.pk, indicatorReport)
                });
            this.programStatus.get(frequency).set(parseInt(reportData.program_pk), LOADED);
            return reportData;
        }
    });
    if (reportJSON && reportJSON.report_data) {
        let frequency = parseInt(reportJSON.report_frequency);
        let initialReportData = reportStore.getReport(frequency);
        (reportJSON.report_data || [])
            .map(indicatorReportJSON => getIndicatorReport(frequency, indicatorReportJSON))
            .forEach(indicatorReport => initialReportData.set(indicatorReport.pk, indicatorReport))
        reportStore.programStatus.get(frequency).set(parseInt(reportJSON.program_pk), LOADED);
    }
    return reportStore;
}