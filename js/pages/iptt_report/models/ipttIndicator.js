import { observable } from 'mobx';

import { getIndicator, withMeasurement } from '../../../models/indicator';

/**
 * IPTT specific indicator model constructor:
 * JSON params:
 *    sector_pk int
 *    indicator_type_pks  [int]
 *    site_pks [int]
 */

export const forIPTT = (
    indicatorJSON = {}
) => ({
    number: indicatorJSON.number || null,
    sectorPk: indicatorJSON.sector_pk || null,
    _typePks: observable(new Set(indicatorJSON.indicator_type_pks || [])),
    hasIndicatorType(indicatorTypePk) {
        return !isNaN(parseInt(indicatorTypePk)) && this._typePks.has(parseInt(indicatorTypePk));
    },
    _sitePks: observable(new Set(indicatorJSON.site_pks || [])),
    hasSite(sitePk) {
        return !isNaN(parseInt(sitePk)) && this._sitePks.has(parseInt(sitePk));
    },
    _disaggregationPks: observable(new Set(indicatorJSON.disaggregation_pks || [])),
    hasDisaggregation(disaggregationPk) {
        return !isNaN(parseInt(disaggregationPk)) && this._disaggregationPks.has(parseInt(disaggregationPk));
    }
});

export default getIndicator(withMeasurement, forIPTT);