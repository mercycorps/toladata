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

function getPeriodData ({target = null, actual = null, met = null, disaggregations = {}} = {}) {
    let disaggregatedPeriodData = new Map(Object.entries(disaggregations).map(
                    ([disaggregationPk, disaggregationJSON]) => [parseInt(disaggregationPk),
                                                                 {actual: disaggregationJSON.actual}]));
    return {target: target, actual: actual, met: met, disaggregations: disaggregatedPeriodData};
}

const getIndicatorReport = (
    frequency,
    indicatorReportJSON = {}
) => observable({
    pk: parseInt(indicatorReportJSON.pk),
    frequency: parseInt(frequency),
    _lopPeriod: getPeriodData(indicatorReportJSON.lop_period),
    get lopTarget() {
        return this._lopPeriod.target;
    },
    get lopActual() {
        return this._lopPeriod.actual;
    },
    get lopMet() {
        return this._lopPeriod.met;
    },
    _reportData: observable(new Map((indicatorReportJSON.periods || [])
                                    .map(periodJSON => [parseInt(periodJSON.count), getPeriodData(periodJSON)]
        ))),
    get periodValues() {
        return Array.from(this._reportData.values());
    },
    _disaggregatedData: observable(new Map(Object.entries(indicatorReportJSON.disaggregated_data || {})
                                           .map(([disaggregationPk, disaggregationJSON]) => [parseInt(disaggregationPk), disaggregationJSON]))),
    disaggregatedLop(disaggregationPk) {
        return (!isNaN(parseInt(disaggregationPk)) && this._lopPeriod.disaggregations.has(parseInt(disaggregationPk))) ?
                this._lopPeriod.disaggregations.get(parseInt(disaggregationPk)).actual : null;
    },
    disaggregatedPeriodValues(disaggregationPk) {
        return !isNaN(parseInt(disaggregationPk)) ? this.periodValues.map(period => period.disaggregations.get(parseInt(disaggregationPk))) : [];
    }
    
});


export default getIndicatorReport;
