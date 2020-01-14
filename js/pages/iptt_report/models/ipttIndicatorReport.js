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
    },
    _disaggregatedData: observable(new Map(Object.entries(indicatorReportJSON.disaggregated_data || {})
                                           .map(([disaggregationPk, disaggregationJSON]) => [parseInt(disaggregationPk), disaggregationJSON]))),
    disaggregatedLop(disaggregationPk) {
        return (!isNaN(parseInt(disaggregationPk)) && this._disaggregatedData.has(parseInt(disaggregationPk))) ?
                this._disaggregatedData.get(parseInt(disaggregationPk)).lop_actual : null;
    },
    _disaggregatedReportData: observable(new Map(Object.entries(indicatorReportJSON.disaggregated_report_data || {})
                                                 .map(([disaggregationPk, disaggregationJSON]) => [parseInt(disaggregationPk), disaggregationJSON]))),
    disaggregatedPeriodValues(disaggregationPk) {
        return (!isNaN(parseInt(disaggregationPk)) && this._disaggregatedReportData.has(parseInt(disaggregationPk))) ?
                this._disaggregatedReportData.get(parseInt(disaggregationPk)) : [];
    }
    //_disaggregatedReportData: observable(new Map(Object.entries((indicatorReportJSON.disaggregated_report_data || {}))
    //                                             .map((disaggregationPk, disaggregatedJSON) => {
    //                                                return [parseInt(disaggregationPk),
    //                                                        new Map(disaggregatedJSON.map(disaggJSON => [parseInt(disaggJSON.index), disaggJSON]))];
    //                                             }))),
    
});


export default getIndicatorReport;