import { observable, action, computed } from 'mobx';
import React from 'react';
import ReactDOM from 'react-dom';
import getProgramStore from './programPageProgram';
import ProgramPageUIStore from './programPageUIStore';
import { IndicatorFilterType } from '../../../constants';

export default class ProgramPageRootStore {
    @observable program;
    @observable uiStore;

    constructor(
        {
            programJSON = {},
            onScopeMargin = 0.15,
            deletePinnedReportURL = null,
            readOnly = true
        } = {}
    ) {
        this.readOnly = readOnly;
        this.onScopeMargin = onScopeMargin;
        this.deletePinnedReportURL = deletePinnedReportURL;
        this.program = getProgramStore(programJSON);
        this.uiStore = new ProgramPageUIStore(this);
    }

    @computed
    get _sortedIndicators() {
        if (this.program.resultsFramework && this.uiStore.groupByChain) {
            return this.program.indicatorsInChainOrder;
        }
        return this.program.indicatorsInLevelOrder;
    }
    
    @computed
    get getIndicatorsNeedingTargets() {
        return this._sortedIndicators.filter(i => !i.hasAllTargetsDefined);
    }
    @computed
    get getIndicatorsNeedingResults() {
        return this._sortedIndicators.filter(i => !i.hasResults);
    }
    @computed
    get getIndicatorsNeedingEvidence() {
        return this._sortedIndicators.filter(i => i.missingEvidence);
    }
    @computed
    get getIndicatorsNotReporting() {
        return this._sortedIndicators.filter(i => !i.isReporting);
    }
    @computed
    get getIndicatorsAboveTarget() {
        return this._sortedIndicators.filter(i => i.aboveTarget);
    }
    @computed
    get getIndicatorsBelowTarget() {
        return this._sortedIndicators.filter(i => i.belowTarget);
    }
    @computed
    get getIndicatorsOnTarget() {
        return this._sortedIndicators.filter(i => i.inScope);
    }
    @computed
    get getIndicatorsReporting() {
        return this._sortedIndicators.filter(i => i.isReporting);
    }
    
    @computed
    get getTotalResultsCount() {
        return this.allIndicators.reduce((acc, i) => acc + i.resultsCount, 0);
    }
    
    @computed
    get getTotalResultsWithEvidenceCount() {
        return this.allIndicators.reduce((acc, i) => acc + i.resultsWithEvidenceCount, 0);
    }
    
    @computed
    get indicators() {
        return this.filterIndicators(this.uiStore.currentIndicatorFilter, this.uiStore.selectedIndicatorId);
    }
    
    @computed
    get allIndicators() {
        return this._sortedIndicators;
    }
    
    filterIndicators(filterType, indicatorPk=null) {
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
                indicators = this._sortedIndicators;
        }
        
        if (indicatorPk && !isNaN(parseInt(indicatorPk))) {
            indicators = indicators.filter(i => i.pk == parseInt(indicatorPk))
        }
        return indicators
    }
    
}