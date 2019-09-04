import { observable, action, runInAction, extendObservable } from 'mobx';
import api from '../apiv2';
const _gettext = (typeof gettext !== 'undefined') ?  gettext : (s) => s;

/**
 *  Base program constructor
 *  JSON params:
 *      pk (string|number)
 *      name (string)
 *      results_framework (boolean)
 *      by_result_chain (string)
 *  @return {Object}
 */

const bareProgram = (
    programJSON = {}
) => ({
    pk: parseInt(programJSON.pk),
    name: programJSON.name,
    resultsFramework: Boolean(programJSON.results_framework),
    _resultChainFilterLabel: programJSON.by_result_chain || _gettext("by Outcome chain"),
    get resultChainFilterLabel() {
        return this.resultsFramework ? this._resultChainFilterLabel : null
    }
});

export const getProgram = (
    ...programConstructors
) => ( programJSON = {} ) => [bareProgram, ...programConstructors].reduce(
        (acc, fn) => extendObservable(acc, fn(programJSON)), {});

/**
 * Extends program with reporting date start/end processing
 * JSON params:
 *      reporting_period_start_iso (string - ISO date format e.g. "2018-01-14")
 *      reporting_period_end_iso (string - ISO date format e.g. "2018-12-02")
 */

export const withReportingPeriod = (
    programJSON = {}
) => ({
        reportingPeriodStart: new Date(programJSON.reporting_period_start_iso),
        reportingPeriodEnd: new Date(programJSON.reporting_period_end_iso)
    });

/**
 *  Extends program with program-wide indicator ordering (rf-aware)
 *  JSON params:
 *      indicator_pks_level_order ([int])
 *      indicator_pks_chain_order ([int])
 */

export const withProgramLevelOrdering = (
    programJSON = {}
) => {
    return {
        _indicatorsLevelOrder: observable((programJSON.indicator_pks_level_order || [])),
        _indicatorsChainOrder: observable((programJSON.indicator_pks_chain_order || [])),
        _applyOrderUpdate(results) {
            runInAction(() => {
                this._indicatorsLevelOrder = results.indicator_pks_level_order || [];
                this._indicatorsChainOrder = results.indicator_pks_chain_order || [];
                Object.entries(results.indicators || {}).forEach(([pk, indicatorJSON]) => {
                    if (!isNaN(parseInt(pk)) && this.indicators.has(parseInt(pk))) {
                        this.indicators.get(parseInt(pk)).updateData(indicatorJSON);
                    }
                });
                return results;
            });
        },
        updateOrder() {
            return api.programLevelOrdering(this.pk).then(this._applyOrderUpdate.bind(this));
        },
        get indicatorsInLevelOrder() {
            return this._indicatorsLevelOrder.map(pk => this.indicators.get(pk));
        },
        get indicatorsInChainOrder() {
            if (this.hasOwnProperty('resultsFramework') && this.resultsFramework === false) {
                return this.indicatorsInLevelOrder;   
            }
            return this._indicatorsChainOrder.map(pk => this.indicators.get(pk));
        }
    };
}


/**
 *  Extends program with level-by-level indicator ordering (rf-aware)
 *  JSON params:
 *      level_pks_level_order ([int])
 *      level_pks_chain_order ([int])
 *      indicator_pks_for_level ([{pk: int, indicator_pks; [int]}])
 *      unassigned_indicator_pks ([int])
 */

export const withRFLevelOrdering = (
    programJSON = {}
) => {
    return {
        _levelsLevelOrder: observable((programJSON.level_pks_level_order || [])),
        _levelsChainOrder: observable((programJSON.level_pks_chain_order || [])),
        _unassignedIndicators: observable((programJSON.unassigned_indicator_pks || [])),
        levelIndicators: observable(new Map(
            (programJSON.indicator_pks_for_level || []).map(
                levelMapJSON => [levelMapJSON.pk, levelMapJSON.indicator_pks]
            ))),
        updateOrder() {
            return api.rfLevelOrdering(this.pk).then(results => {
                runInAction(() => {
                    this._levelsLevelOrder = results.level_pks_level_order || [];
                    this._levelsChainOrder = results.level_pks_chain_order || [];
                    this._unassignedIndicators = results.unassigned_indicator_pks || [];
                    this._updateLevelIndicatorsOrder(results.indicator_pks_for_level);
                    return true;
                });
            });
        },
        get levelsInLevelOrder() {
            return this._levelsLevelOrder.map(pk => this.levels.get(pk)) || [];
        },
        get levelsInChainOrder() {
            if (this.hasOwnProperty('resultsFramework') && this.resultsFramework === false) {
                return this.levelsInLevelOrder;   
            }
            return this._levelsChainOrder.map(pk => this.levels.get(pk)) || [];
        },
        get unassignedIndicators() {
            return this._unassignedIndicators.map(pk => this.indicators.get(pk)) || [];
        },
        get indicatorsInLevelOrder() {
            if (!this.resultsFramework) {
                return this.unassignedIndicators;
            }
            return Array.prototype.concat
                .apply([], this.levelsInLevelOrder
                                .map(level => this.levelIndicators.get(level.pk).filter(pk => this.indicators.has(pk))
                                                            .map(pk => this.indicators.get(pk))))
                .concat(this.unassignedIndicators);
        },
        get indicatorsInChainOrder() {
            if (!this.resultsFramework) {
                return this.unassignedIndicators;
            }
            return Array.prototype.concat
                .apply([], this.levelsInChainOrder
                                .map(level => this.levelIndicators.get(level.pk).filter(pk => this.indicators.has(pk))
                                                            .map(pk => this.indicators.get(pk))))
                .concat(this.unassignedIndicators);
        },
        _updateLevelIndicatorsOrder(orderByLevel=[]) {
            runInAction(() => {
                this.levelIndicators.clear();
                orderByLevel.forEach(({pk, indicator_pks}) => {
                    this.levelIndicators.set(pk, indicator_pks);
                });
            });
        }
    };
}