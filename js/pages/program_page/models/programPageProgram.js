import { observable, runInAction, action } from 'mobx';

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
        resultsMap: observable(new Map()),
        needsAdditionalTargetPeriods: Boolean(programJSON.needs_additional_target_periods),
        getResultsHTML(indicatorPk) {
            return this.resultsMap.get(parseInt(indicatorPk)) || false;
        },
        updateResultsHTML(rawIndicatorPk) {
            let indicatorPk = parseInt(rawIndicatorPk);
            if (indicatorPk && !isNaN(indicatorPk)) {
                api.indicatorResultsTable(indicatorPk, true).then(resultsHTML => {
                    runInAction(() => {
                        this.deleteResultsHTML(indicatorPk);
                        this.resultsMap.set(indicatorPk, resultsHTML);
                        return true;
                    });
                });
            }
        },
        deleteResultsHTML: action(function(indicatorPk) {
            if (!isNaN(parseInt(indicatorPk)) && this.resultsMap.get(parseInt(indicatorPk))) {
                this.resultsMap.delete(parseInt(indicatorPk));
                return true;
            }
            return false;
        }),
        deleteAllResultsHTML: action(function() {
            this.resultsMap.clear();
        }),
        updateIndicator: action(function(rawIndicatorPk) {
            let indicatorPk = parseInt(rawIndicatorPk);
            return api.updateProgramPageIndicator(indicatorPk)
                   .then(results => {
                        if (results.indicator) {
                            let indicator = ProgramPageIndicator(results.indicator);
                            this.indicators.set(indicator.pk, indicator);
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
        
    });

export default getProgram(withReportingPeriod, withProgramLevelOrdering, forProgramPage);