import { observable, computed, action } from "mobx";

export default class ProgramPageUIStore {
    @observable currentIndicatorFilter;  // selected gas gauge filter
    @observable selectedIndicatorId; // indicators filter
    @observable groupByChain = true;

    constructor(rootStore) {
        this.setIndicatorFilter = this.setIndicatorFilter.bind(this);
        this.clearIndicatorFilter = this.clearIndicatorFilter.bind(this);
        this.setSelectedIndicatorId = this.setSelectedIndicatorId.bind(this);
        this.rootStore = rootStore;
    }

    @action
    setIndicatorFilter(indicatorFilter) {
        this.currentIndicatorFilter = indicatorFilter;
    }

    @action
    clearIndicatorFilter() {
        this.currentIndicatorFilter = null;
        this.selectedIndicatorId = null;
    }

    @action
    setSelectedIndicatorId(indicatorPk) {
        this.clearIndicatorFilter();
        this.selectedIndicatorId = indicatorPk;
        this.rootStore.program.updateResultsHTML(indicatorPk);
    }
    
    @computed
    get filterApplied() {
        return !(!this.currentIndicatorFilter && !this.selectedIndicatorId);
    }
    
    @computed
    get resultChainFilterLabel() {
        return this.rootStore.program.resultChainFilterLabel;
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