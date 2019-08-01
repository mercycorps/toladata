import { observable, computed } from "mobx";
import { localDateFromISOString } from '../date_utils';

export default class BaseProgram {
    @observable pk = null;
    @observable name = null;
    @observable start = null;
    @observable end = null;
    @observable resultsFramework = null;
    @observable byOutcomeChain = null;

    constructor(programJSON) {
        this.pk = parseInt(programJSON.pk);
        this.name = programJSON.name;
        this.start = localDateFromISOString(programJSON.reporting_period_start);
        this.end = localDateFromISOString(programJSON.reporting_period_end);
        this.resultsFramework = programJSON.results_framework;
        this.byOutcomeChain = programJSON.rf_chain_sort_label || 'by Outcome chain';
    }
    
    @computed get id() {
        return this.pk;
    }
}
