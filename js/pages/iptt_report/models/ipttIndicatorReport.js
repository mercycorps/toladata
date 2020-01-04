import { observable } from 'mobx';

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


export default getIndicatorReport;