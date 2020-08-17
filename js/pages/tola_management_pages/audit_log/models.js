import { observable, computed, action, runInAction, toJS } from "mobx"
import api from './api'

export class ProgramAuditLogStore {
    @observable program_id = null;
    @observable program_name = null;
    @observable log_rows = [];
    @observable fetching = false;
    @observable current_page = 0;

    @observable entries_count = 0;
    @observable total_pages = 0;
    @observable next_page = null;
    @observable previous_page = null;

    // UI state - track what history rows are expanded
    @observable expando_rows = new Set();

    constructor(program_id, program_name) {
        this.program_id = program_id;
        this.program_name = program_name;
        this.fetchProgramAuditLog();
    }

    @action
    fetchProgramAuditLog() {
        this.fetching = true

        api.fetchProgramAuditLogWithFilter(this.program_id, this.current_page + 1).then(results => {
            runInAction(() => {
                this.fetching = false;
                this.log_rows = results.logs;
                this.entries_count = results.total_entries;
                this.total_pages = results.total_pages;
                this.next_page = results.next_page;
                this.previous_page = results.previous_page;
            })
        })
    }

    @action
    changePage(page) {
        if(page.selected != this.current_page) {
            this.current_page = page.selected
            this.fetchProgramAuditLog()
        }
    }

    @action
    toggleRowExpando(row_id) {
        if (this.expando_rows.has(row_id)) {
            this.expando_rows.delete(row_id);
        } else {
            this.expando_rows.add(row_id);
        }
    }

    @action
    expandAllExpandos() {
        this.log_rows.forEach((row) => this.expando_rows.add(row.id));
    }

    @action
    collapsAllExpandos() {
        this.expando_rows.clear();
    }
}
