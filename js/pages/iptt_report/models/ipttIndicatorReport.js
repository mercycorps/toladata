import { observable } from 'mobx';


/*
 * Take an array [{index: #, actual: #},] and fill in all indices from 0 to max with actual: null
 * Uncompresses serialized report data for IPTT
 */
const impliedNullValuesMapper = (values) => {
    // map of existing (non-null) indices to their actual value
    let valuesMap = new Map(values.map(v => [v.index, v.actual]));
    // iterate from 0 to largest index value provided
    let valuesArray = [...Array(Math.max(...values.map(v => v.index)) + 1).keys()]
    // for each either provide the value from the values Map if it exists (this value was provided) or default to null
        .map(i => ({index: i, actual: valuesMap.has(i) ? valuesMap.get(i) : null}))
    return valuesArray;
}

const getIndicatorReport = (
    frequency,
    indicatorReportJSON = {}
) => observable({
    pk: parseInt(indicatorReportJSON.pk),
    frequency: parseInt(frequency),
    _lopTarget: (indicatorReportJSON.lop_period || {}).target,
    get lopTarget() {
        return this._lopTarget;
    },
    _lopActual: (indicatorReportJSON.lop_period || {}).actual,
    get lopActual() {
        return this._lopActual;
    },
    _lopMet: (indicatorReportJSON.lop_period || {}).met,
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
                                                 .map(([disaggregationPk, disaggregationJSON]) => [parseInt(disaggregationPk), impliedNullValuesMapper(disaggregationJSON)]))),
    disaggregatedPeriodValues(disaggregationPk) {
        return (!isNaN(parseInt(disaggregationPk)) && this._disaggregatedReportData.has(parseInt(disaggregationPk))) ?
                this._disaggregatedReportData.get(parseInt(disaggregationPk)) : [];
    }
    
});


export default getIndicatorReport;