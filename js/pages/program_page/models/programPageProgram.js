import { observable, runInAction, computed, action } from 'mobx';

import api from '../../../apiv2';
import { getProgram, withReportingPeriod, withProgramLevelOrdering } from '../../../models/program';
import ProgramPageIndicator from './programPageIndicator';

/**
 *  Program Page specific model constructor
 *  JSON params:
 *      needs_additional_target_periods (boolean)
 *      indicators (ProgramPageIndicator)
 *  @return {Object}
 */

export const forProgramPage = (
    programJSON = {}
) => ({
        indicators: programJSON.indicators ? new Map(Object.values(programJSON.indicators).map(indicatorJSON => new ProgramPageIndicator(indicatorJSON))
                            .map(indicator => [indicator.pk, indicator])) : new Map(),
        needsAdditionalTargetPeriods: Boolean(programJSON.needs_additional_target_periods),
        _expandedIndicators: new Set(),
        isExpanded(indicatorPk) {
            return this._expandedIndicators.has(parseInt(indicatorPk));
        },
        expand: action(function(indicatorPk) {
            this._expandedIndicators.add(parseInt(indicatorPk));
        }),
        collapse: action(function(indicatorPk) {
            this._expandedIndicators.delete(parseInt(indicatorPk))
        }),
        expandAll: action(function() {
            this._expandedIndicators = new Set(this.indicators.keys());
        }),
        collapseAll: action(function() {
            this._expandedIndicators.clear();
        }),
        updateIndicator: action(function(rawIndicatorPk) {
            let indicatorPk = parseInt(rawIndicatorPk);
            return api.updateProgramPageIndicator(indicatorPk)
                   .then(results => {
                        if (results.indicator) {
                            let indicator = ProgramPageIndicator(results.indicator);
                            this.indicators.set(indicator.pk, indicator);
                        }
                        if (results.site_count !== undefined) {
                            this.siteCount = results.site_count;
                        }
                        return results;
                    }).then(this._applyOrderUpdate.bind(this));
        }),
        reloadIndicators: action(function() {
            return api.updateAllProgramPageIndicators(this.pk).then(results => {
                this.indicators = new Map((results.indicators || []).map(ProgramPageIndicator)
                                          .map(indicator => [indicator.pk, indicator]));
                return results;
            }).then(this._applyOrderUpdate.bind(this));
        }),
        deleteIndicator: action(function(indicatorPk) {
            return this.updateOrder().then(success => this.indicators.delete(parseInt(indicatorPk)));
        }),
        siteCount: programJSON.site_count || null
    });

export default getProgram(withReportingPeriod, withProgramLevelOrdering, forProgramPage);
