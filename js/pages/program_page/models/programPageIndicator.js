import { getIndicator, withMeasurement } from '../../../models/indicator';
/**
 *  Program Page specific model constructor
 *  JSON params:
 *      number (str)
 *      was_just_created (boolean)
 *      is_key_performance_indicator (boolean)
 *      is_reporting (boolean)
 *      over_under (number)
 *      has_all_targets_defined (boolean)
 *      results_count (number)
 *      has_results (boolean)
 *      results_with_evidence_count (number)
 *      missing_evidence (boolean)
 *  @return {Object}
 */

export const forProgramPage = (
    indicatorJSON = {}
) => ({
    number: indicatorJSON.number || false,
    wasJustCreated: Boolean(indicatorJSON.was_just_created),
    isKeyPerformanceIndicator: Boolean(indicatorJSON.is_key_performance_indicator),
    isReporting: Boolean(indicatorJSON.is_reporting),
    hasAllTargetsDefined: Boolean(indicatorJSON.has_all_targets_defined),
    resultsCount: !isNaN(parseInt(indicatorJSON.results_count)) ? parseInt(indicatorJSON.results_count) : false,
    hasResults: Boolean(indicatorJSON.has_results),
    resultsWithEvidenceCount: !isNaN(parseInt(indicatorJSON.results_with_evidence_count)) ?
                parseInt(indicatorJSON.results_with_evidence_count) : false,
    missingEvidence: Boolean(indicatorJSON.missing_evidence),
    mostRecentlyCompletedTargetEndDate: (indicatorJSON.target_frequency &&
                                         indicatorJSON.most_recent_completed_target_end_date) ?
                                            new Date(indicatorJSON.most_recent_completed_target_end_date) : null,
    targetPeriodLastEndDate: (indicatorJSON.target_frequency &&
                              indicatorJSON.target_period_last_end_date) ?
                                new Date(indicatorJSON.target_period_last_end_date) : null,
    _overUnder: !isNaN(parseInt(indicatorJSON.over_under)) ? parseInt(indicatorJSON.over_under) : false,
    get belowTarget() { return (this.isReporting && this._overUnder !== false && this._overUnder < 0); },
    get aboveTarget() { return (this.isReporting && this._overUnder !== false && this._overUnder > 0); },
    get inScope() { return (this.isReporting && this._overUnder !== false && this._overUnder == 0); },
    updateData(updateJSON) {
        if (updateJSON.pk && !isNaN(parseInt(updateJSON.pk)) && parseInt(updateJSON.pk) === this.pk) {
            this.number = updateJSON.number || false;
        }
    }
});

export default getIndicator(withMeasurement, forProgramPage);