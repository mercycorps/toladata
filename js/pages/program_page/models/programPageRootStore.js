import { observable, action, computed, toJS } from 'mobx';
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
            readOnly = true,
            resultReadOnly = true,
            levels = [],
            levelTiers = [],
            tierTemplates = [],
            englishTemplates = [],
            customTemplates = [],
        } = {}
    ) {
        this.readOnly = readOnly;
        this.resultReadOnly = resultReadOnly;
        this.onScopeMargin = onScopeMargin;
        this.deletePinnedReportURL = deletePinnedReportURL;
        this.program = getProgramStore(programJSON);
        this.uiStore = new ProgramPageUIStore(this);
        this.levels = levels;
        this.customTierSetKey = "custom";
        this.tierTemplates = JSON.parse(tierTemplates);
        this.englishTierTemplates = JSON.parse(englishTemplates);
        
        this.tierTemplates[this.customTierSetKey] = {name: gettext("Custom")};
        this.englishTierTemplates[this.customTierSetKey] = {name: gettext("Custom")};
        this.tierTemplates[this.customTierSetKey]['tiers'] = customTemplates.names || [""];
        this.englishTierTemplates[this.customTierSetKey]['tiers'] = customTemplates.names || [""];

        // Set the stored tier set key and the values, if they exist.  Use the default if they don't.
        if (levelTiers.length > 0) {
            const origLevelTiers = levelTiers.map( t => t.name);
            this.chosenTierSetKey = this.deriveTemplateKey(origLevelTiers);
        }
        else {
            this.chosenTierSetKey = this.defaultTemplateKey;
        }
    }

    deriveTemplateKey = (origLevelTiers) => {
        // Check each tier set in the templates to see if the tier order and content are exactly the same
        // If they are, return the template key
        const levelTierStr = JSON.stringify(toJS(origLevelTiers));
        for (let templateKey in this.englishTierTemplates){
            // not an eligable template if the key is inherited or if the lengths of the tier sets don't match.
            if (!this.englishTierTemplates.hasOwnProperty(templateKey) ||
                origLevelTiers.length != this.englishTierTemplates[templateKey]['tiers'].length) {
                continue;
            }
            const templateValuesStr = JSON.stringify(this.englishTierTemplates[templateKey]['tiers']);
            if (levelTierStr == templateValuesStr) {
                return templateKey;
            }
        }
        // If this has been reached, the db has stored tiers but they're not a match to a template
        return this.customTierSetKey;
    };

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
    get allExpanded() {
        return this.indicators.every(indicator => this.program.isExpanded(indicator.pk));
    }

    @computed
    get allCollapsed() {
        return this.indicators.every(indicator => !this.program.isExpanded(indicator.pk));
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
            case IndicatorFilterType.nonReporting:
                indicators = this.getIndicatorsNotReporting;
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
