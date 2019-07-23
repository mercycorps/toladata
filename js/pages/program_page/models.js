import { observable, computed, action } from "mobx";
import { indicatorManualNumberSort } from '../../general_utilities';

// Types of filters available on the program page
export const IndicatorFilterType = Object.freeze({
    noFilter: 0,
    missingTarget: 1,
    missingResults: 2,
    missingEvidence: 3,

    aboveTarget: 5,
    belowTarget: 6,
    onTarget: 7,
});


export class IndicatorStore {
    @observable indicators = [];

    constructor(indicators) {
        this.indicators = indicators;

        this.updateIndicator = this.updateIndicator.bind(this);
        this.removeIndicator = this.removeIndicator.bind(this);
        this.filterIndicators = this.filterIndicators.bind(this);
        this.setIndicators = this.setIndicators.bind(this);
    }

    @action
    updateIndicator(indicator) {
        let i = this.indicators.findIndex(e => e.id === indicator.id);
        if (i > -1) {
            this.indicators[i] = indicator;
        } else {
            this.indicators.push(indicator);
        }
    }

    @action
    setIndicators(indicators) {
        this.indicators = indicators;
    }

    @action
    removeIndicator(indicatorId) {
        this.indicators = this.indicators.filter(e => e.id != indicatorId);
    }

    @computed
    get getIndicatorsNeedingTargets() {
        return this.indicators.filter(i => i.all_targets_defined === 0);
    }

    @computed
    get getIndicatorsNeedingResults() {
        return this.indicators.filter(i => i.results_count === 0);
    }

    @computed
    get getIndicatorsNeedingEvidence() {
        return this.indicators.filter(i => i.results_count !== i.results_with_evidence_count);
    }

    @computed
    get getIndicatorsNotReporting() {
        return this.indicators.filter(i => i.over_under === null);
    }

    @computed
    get getIndicatorsAboveTarget() {
        return this.indicators.filter(i => i.over_under > 0);
    }

    @computed
    get getIndicatorsBelowTarget() {
        return this.indicators.filter(i => i.over_under < 0);
    }

    @computed
    get getIndicatorsOnTarget() {
        return this.indicators.filter(i => i.over_under === 0);
    }

    @computed
    get getIndicatorsReporting() {
        return this.indicators.filter(i => i.reporting === true);
    }
    
    sortIndicators(oldStyleLevels, sortByChain, indicators) {
        if (oldStyleLevels) {
            return indicators.slice().sort(
                indicatorManualNumberSort(indicator => indicator.old_level_pk, indicator => indicator.number_if_numbering)
            );
        } else if (!sortByChain) {
            return indicators.slice().sort(
                (a, b) => {
                    if (a.level && a.level.level_depth) {
                        if (b.level && b.level.level_depth) {
                            if (a.level.level_depth === b.level.level_depth) {
                                let a_ontology = a.level.ontology.split('.');
                                let b_ontology = b.level.ontology.split('.');
                                for (let i=0; i < a_ontology.length; i++) {
                                    if (a_ontology[i] != b_ontology[i]) {
                                        return a_ontology[i] - b_ontology[i]
                                    }
                                }
                                return (a.level_order || 0) - (b.level_order || 0);
                            }
                            return a.level.level_depth - b.level.level_depth;
                        }
                        return -1;
                    }
                    return (b.level && b.level.level_depth) ? 1 : 0;
                }
            );
        } else {
            return indicators.slice().sort(
                (a, b) => {
                    if (a.level && a.level.ontology) {
                        if (b.level && b.level.ontology) {
                            let a_ontology = a.level.ontology.split('.');
                            let b_ontology = b.level.ontology.split('.');
                            for (let i=0; i < a_ontology.length; i++) {
                                if (a_ontology[i] != b_ontology[i]) {
                                    return a_ontology[i] - b_ontology[i]
                                }
                            }
                            return 0;
                        }
                        return -1;
                    }
                    return (b.level && b.level.ontology) ? 1 : 0;
                }
            );
        }
    }

    filterIndicators(filterType) {
        let indicators;

        switch (filterType) {
            case IndicatorFilterType.missingTarget:
                indicators = this.getIndicatorsNeedingTargets;
                break;
            case IndicatorFilterType.missingResults:
                indicators = this.getIndicatorsNeedingResults;
                break;
            case IndicatorFilterType.missingEvidence:
                indicators = this.getIndicatorsNeedingEvidence;
                break;
            case IndicatorFilterType.aboveTarget:
                indicators = this.getIndicatorsAboveTarget;
                break;
            case IndicatorFilterType.belowTarget:
                indicators = this.getIndicatorsBelowTarget;
                break;
            case IndicatorFilterType.onTarget:
                indicators = this.getIndicatorsOnTarget;
                break;
            case IndicatorFilterType.noFilter:
            default:
                indicators = this.indicators;
        }

        return indicators
    }

    @computed
    get getTotalResultsCount() {
        return this.indicators.reduce((acc, i) => acc + i.results_count, 0);
    }

    @computed
    get getTotalResultsWithEvidenceCount() {
        return this.indicators.reduce((acc, i) => acc + i.results_with_evidence_count, 0);
    }
}

export class ProgramPageStore {
    indicatorStore;
    @observable program = {};
    @observable resultsMap = new Map(); // indicator id -> results HTML str

    constructor(indicators, program) {
        this.indicatorStore = new IndicatorStore(indicators);
        this.program = program;
        this.addResultsHTML = this.addResultsHTML.bind(this);
        this.deleteResultsHTML = this.deleteResultsHTML.bind(this);
    }

    @action
    addResultsHTML(indicatorId, htmlStr) {
        this.resultsMap.set(parseInt(indicatorId), htmlStr);
    }

    @action
    deleteResultsHTML(indicatorId) {
        this.resultsMap.delete(indicatorId);
    }

    @action
    deleteAllResultsHTML() {
        this.resultsMap.clear();
    }
    
    @computed
    get oldStyleLevels() {
        return !this.program.results_framework;
    }

}

export class ProgramPageUIStore {
    @observable currentIndicatorFilter;  // selected gas gauge filter
    @observable selectedIndicatorId; // indicators filter
    @observable groupByChain = true;

    constructor(resultChainFilterLabel) {
        this.resultChainFilterLabel = resultChainFilterLabel;
        this.setIndicatorFilter = this.setIndicatorFilter.bind(this);
        this.clearIndicatorFilter = this.clearIndicatorFilter.bind(this);
        this.setSelectedIndicatorId = this.setSelectedIndicatorId.bind(this);
    }

    @action
    setIndicatorFilter(indicatorFilter) {
        this.currentIndicatorFilter = indicatorFilter;
    }

    @action
    clearIndicatorFilter() {
        this.currentIndicatorFilter = null;
    }

    @action
    setSelectedIndicatorId(selectedIndicatorId) {
        this.selectedIndicatorId = selectedIndicatorId;
    }
    
    @computed
    get groupByOptions() {
        return [
            {
                value: 1,
                label: this.resultChainFilterLabel
            },
            {
                value: 2,
                label: gettext('by Level')
            }
        ];
    }
    
    @computed
    get selectedGroupByOption() {
        return this.groupByChain ? this.groupByOptions[0] : this.groupByOptions[1];
    }
    
    @action
    setGroupBy(value) {
        this.groupByChain = value == 1;
    }

}
