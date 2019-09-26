/**
 * IPTT Quickstart React data models
 * @module: iptt_quickstart/models
 */

import { observable, computed, action, reaction } from 'mobx';
import QSProgramStore from './QSProgramStore';

export const BLANK_LABEL = '---------';
export const TVA = 1;
export const TIMEPERIODS = 2;

const BLANK_OPTION = {
    value: null,
    label: BLANK_LABEL
};


export default class QSRootStore {
    @observable tvaProgramId = null;
    @observable timeperiodsProgramId = null;
    @observable frequencyId = null;
    @observable showAll = true;
    @observable mostRecent = false;
    @observable mostRecentCount = '';

    constructor(contextData) {
        this.programStore = new QSProgramStore(this, contextData.programs);
        this.periodLabels = {
            1: gettext("Life of Program (LoP) only"),
            2: gettext("Midline and endline"),
            3: gettext("Annual"),
            4: gettext("Semi-annual"),
            5: gettext("Tri-annual"),
            6: gettext("Quarterly"),
            7: gettext("Monthly")
        };
        this.iptt_url = contextData.iptt_url;
        const resetFrequency = reaction(
            () => this.tvaProgramId,
            programId => {
                if (programId !== null && this.frequencyId !== null &&
                    !this.programStore.getProgram(programId).frequencies.has(this.frequencyId)) {
                    this.setFrequency(null);
                }
            }
        )

        this.setTVAProgram(contextData.initial_selected_program_id);
        this.setTimeperiodsProgram(contextData.initial_selected_program_id);
    }
    
    /* options for program selection in TIMEPERIODS form */
    get timeperiodsProgramOptions() {
        return this.programStore.programList.map(
            program => ({value: program.pk, label: program.name})
        );
    }
    
    /* options for program selection in TVA form (must have available frequencies) */
    get tvaProgramOptions() {
        return this.programStore.programList.filter(
            program => program.frequencies.size > 0
        ).map(program => ({value: program.pk, label: program.name}));
    }
    
    /* options for frequency selection in TVA form (must be TVA program, only shows that program's frequencies */
    @computed get frequencyOptions() {
        if (this.tvaProgramId === null) {
            return [BLANK_OPTION];
        }
        return [...this.programStore.getProgram(this.tvaProgramId).frequencies]
                .map( id => ({value: id, label: this.periodLabels[id]})
        );
    }
    
    /* GET select option (value/label) for selected Program in TVA form */
    @computed get selectedTVAProgram() {
        if (this.tvaProgramId === null) {
            return BLANK_OPTION;
        }
        return {
            value: this.tvaProgramId, label: this.programStore.getProgram(this.tvaProgramId).name
        }
    }
    
    /* GET select option (value/label) for selected Program in Timeperiods form */
    @computed get selectedTimeperiodsProgram() {
        if (this.timeperiodsProgramId === null) {
            return BLANK_OPTION;
        }
        return {
            value: this.timeperiodsProgramId,
            label: this.programStore.getProgram(this.timeperiodsProgramId).name
        }
    }
    
    /* GET select option (value/label) for selected Frequency in TVA form */
    @computed get selectedFrequency() {
        if (this.tvaProgramId === null || this.frequencyId === null) {
            return BLANK_OPTION;
        }
        return {
            value: this.frequencyId,
            label: this.periodLabels[this.frequencyId]
        }
    }
    
    /* Whether to disable the most recent and show all radio buttons */
    @computed get periodCountDisabled() {
        return this.tvaProgramId === null || [3, 4, 5, 6, 7].indexOf(this.frequencyId) == -1;
    }
    
    /* GET most recent display - only show value if most recent is selected */
    @computed get mostRecentCountDisplay() {
        if (!this.periodCountDisabled && this.mostRecent) {
            return this.mostRecentCount;
        }
        return '';
    }
    
    /* SET tva program to the designated ID, and make the report type TVA */
    @action setTVAProgram(programId) {
        if (isNaN(parseInt(programId))) {
            this.tvaProgramId = null;
        } else {
            this.tvaProgramId = parseInt(programId);
        }
    }
    
    /* SET tva program to the designated ID, and make the report type Timeperiods */
    @action setTimeperiodsProgram(programId) {
        if (isNaN(parseInt(programId))) {
            this.timeperiodsProgramId = null;
        } else {
            this.timeperiodsProgramId = parseInt(programId);
        }
    }
    
    /* SET frequency in TVA form */
    @action setFrequency(id) {
        this.frequencyId = id;
    }
    
    
    @action setMostRecent = ()  => {
        this.showAll = false;
        this.mostRecent = true;
        this.mostRecentCount = '';
    }

    @action setMostRecentCount = (count) => {
        this.setMostRecent();
        count = Math.min(count, this.programStore.getProgram(this.tvaProgramId).currentPeriod(this.frequencyId));
        this.mostRecentCount = count;
    }
    
    @action setShowAll = () => {
        this.mostRecent = false;
        this.showAll = true;
        this.mostRecentCount = '';
    }
    
    @computed get tvaURL() {
        if (this.tvaProgramId !== null && this.frequencyId !== null) {
            let program = this.programStore.getProgram(this.tvaProgramId);
            let url = `${this.iptt_url}${program.pk}/targetperiods/?frequency=${this.frequencyId}`;
            if (this.frequencyId == 1 || this.frequencyId == 2) {
                return url;
            } else if (this.showAll) {
                return `${url}&start=0&end=${program.periodCount(this.frequencyId)-1}`;
            }
            let current = program.currentPeriod(this.frequencyId);
            let past = current - Math.max(this.mostRecentCount, 1) + 1;
            return `${url}&start=${past}&end=${current}`;
        }
        return false;
    }
    
    @computed get timeperiodsURL() {
        if (this.timeperiodsProgramId !== null) {
            let current = this.programStore.getProgram(this.timeperiodsProgramId).currentPeriod(7)-1;
            return `${this.iptt_url}${this.timeperiodsProgramId}/timeperiods/` +
                    `?frequency=7&start=${current-1}&end=${current}`;
        }
        return false;
    }
}
