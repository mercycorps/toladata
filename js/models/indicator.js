import { observable, computed, extendObservable } from "mobx";

const _gettext = (typeof gettext !== 'undefined') ?  gettext : (s) => s;

/**
 *  Base indicator constructor
 *  JSON params:
 *      pk (string|number)
 *      name (string)
 *      level_pk (number)
 *      old_level_name (string)
 *      means_of_verification (string)
 *  @return {Object}
 */

const bareIndicator = (
    indicatorJSON = {}
) => ({
    pk: parseInt(indicatorJSON.pk),
    name: indicatorJSON.name,
    levelPk: !isNaN(parseInt(indicatorJSON.level_pk)) ? parseInt(indicatorJSON.level_pk) : false,
    oldLevelDisplay: indicatorJSON.old_level_name || false,
    meansOfVerification: indicatorJSON.means_of_verification || false
});

export const getIndicator = (
    ...indicatorConstructors
) => (indicatorJSON) => {
    return [bareIndicator, ...indicatorConstructors].reduce(
            (acc, fn) => extendObservable(acc, fn(indicatorJSON)), {});
}

/**
 *  indicator constructor where unit and measurement figures are recorded
 *  JSON params:
 *      unit_of_measure (string)
 *      is_percent (boolean)
 *      is_cumulative (boolean)
 *      direction_of_change (string)
 *      baseline (number)
 *      lop_target (number)
 *  @return {Object}
 */

export const withMeasurement = (
    indicatorJSON = {}
) => ({
        unitOfMeasure: indicatorJSON.unit_of_measure || false,
        isPercent: Boolean(indicatorJSON.is_percent),
        isCumulative: Boolean(indicatorJSON.is_cumulative),
        directionOfChange: indicatorJSON.direction_of_change || false,
        baseline: indicatorJSON.baseline || null,
        _lopTarget: !isNaN(parseFloat(indicatorJSON.lop_target)) ? parseFloat(indicatorJSON.lop_target) : false,
        get lopTarget() {
            if (this._lopTarget === false) { return false; }
            if (Number.isInteger(this._lopTarget)) { return parseInt(this._lopTarget); }
            return this._lopTarget;
        }
    });