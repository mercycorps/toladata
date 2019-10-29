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
            return this.resultsMap.get(indicatorPk) || false;
        },
        updateResultsHTML(indicatorPk) {
            if (indicatorPk) {
                api.indicatorResultsTable(indicatorPk).then(resultsHTML => {
                    runInAction(() => {
                        this.resultsMap.set(parseInt(indicatorPk), resultsHTML);
                        return true;
                    });
                });
            }
        },
        deleteResultsHTML: action(function(indicatorPk) {
            if (this.resultsMap.get(indicatorPk)) {
                this.resultsMap.delete(indicatorPk);
                return true;
            }
            return false;
        }),
        deleteAllResultsHTML: action(function() {
            this.resultsMap.clear();
        }),
        updateIndicator: action(function(indicatorPk) {
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
            return this.updateOrder().then(success => this.indicators.delete(indicatorPk));
        }),
        
    });

export default getProgram(withReportingPeriod, withProgramLevelOrdering, forProgramPage);