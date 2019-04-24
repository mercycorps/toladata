import { observable, computed, action, runInAction } from "mobx";


export class ProgramStore {

    //filter options
    @observable countries = {}
    @observable allCountries = {}
    @observable organizations = {}
    @observable users = {}
    @observable sectors = []

    @observable filters = {
        countries: [],
        organizations: [],
        sectors: [],
        programStatus: null,
        programs: [],
        users: []
    }

    @observable appliedFilters = {
    }

    @observable programFilterPrograms = []
    @observable programs = []
    @observable program_count = 0
    @observable new_program = null
    @observable fetching_main_listing = false
    @observable current_page = 0
    @observable total_pages = null
    @observable bulk_targets = new Map()
    @observable bulk_targets_all = false

    @observable editing_target = null
    @observable editing_errors = {}
    @observable fetching_editing_history = true
    @observable editing_history = []
    @observable saving = false

    @observable applying_bulk_updates = false

    @observable active_editor_pane = 'profile'

    // UI state - track what history rows are expanded
    @observable changelog_expanded_rows = new Set();

    active_pane_is_dirty = false

    constructor(
        api,
        initialData,
    ) {
        this.api = api
        Object.assign(this, initialData)
        this.appliedFilters = {...this.filters}
        this.fetchPrograms()
    }

    marshalFilters(filters) {
        return Object.entries(filters).reduce((xs, [filterKey, filterValue]) => {
            if (Array.isArray(filterValue)) {
                xs[filterKey] = filterValue.map(x => x.value)
            } else if (filterValue) {
                xs[filterKey] = filterValue.value
            }
            return xs
        }, {})
    }

    dirtyConfirm() {
        return !this.active_pane_is_dirty || (this.active_pane_is_dirty && confirm(gettext("You have unsaved changes. Are you sure you want to discard them?")))
    }

    @action
    onProfilePaneChange(new_pane) {
        if(this.dirtyConfirm()) {
            this.active_editor_pane = new_pane
            this.active_pane_is_dirty = false
        }
    }

    setActiveFormIsDirty(is_dirty) {
        this.active_pane_is_dirty = is_dirty
    }

    setActivePaneSaveAction(action) {
        this.active_pane_save = action
    }

    @action
    fetchPrograms() {
        if(this.dirtyConfirm()) {
            this.fetching_main_listing = true
            this.api.fetchPrograms(this.current_page + 1, this.marshalFilters(this.appliedFilters)).then(results => {
                runInAction(() => {
                    this.fetching_main_listing = false
                    this.programs = results.results
                    this.program_count = results.total_results
                    this.total_pages = results.total_pages
                    this.next_page =results.next_page
                    this.previous_page = results.previous_page
                    this.active_editor_pane = 'profile'
                    this.active_pane_is_dirty = false
                })
            })
            this.api.fetchProgramsForFilter(this.marshalFilters(this.appliedFilters)).then(response => {
                runInAction(() => {
                    this.programFilterPrograms = response.data
                })
            })
        }

    }

    @action
    applyFilters() {
        this.appliedFilters = {...this.filters}
        this.current_page = 0
        this.fetchPrograms()
    }

    @action
    changePage(page) {
        if (page.selected == this.current_page) {
            return
        }
        this.current_page = page.selected
        this.bulk_targets = new Map()
        this.bulk_targets_all = false;
        this.fetchPrograms()
    }

    @action
    changeFilter(filterKey, value) {
        this.filters = Object.assign(this.filters, {[filterKey]: value})
    }

    @action
    clearFilters() {
        let clearFilters = {
            countries: [],
            organizations: [],
            sectors: [],
            programStatus: null,
            programs: [],
            users: []
        }
        this.filters = Object.assign(this.filters, clearFilters);
    }

    @action
    toggleEditingTarget(id) {
        if(this.dirtyConfirm()) {
            if(this.editing_target == 'new') {
                this.programs.shift()
                this.editing_errors = {}
            }
            this.active_editor_pane = 'profile'

            if(this.editing_target == id) {
                this.editing_target = false
                this.editing_errors = {}
            } else {
                this.editing_target = id
                this.fetching_editing_history = true
                this.api.fetchProgramHistory(id).then(resp => {
                    runInAction(() => {
                        this.fetching_editing_history = false
                        this.editing_history = resp.data
                    })
                })
            }
        }
    }

    updateLocalPrograms(updated) {
        this.programs = this.programs.reduce((acc, current) => {
            if (current.id == updated.id) {
                acc.push(updated)
            } else {
                acc.push(current)
            }
            return acc
        }, [])
    }

    onSaveSuccessHandler() {
        PNotify.success({text: gettext("Successfully Saved"), delay: 5000})
    }

    onSaveErrorHandler() {
        PNotify.error({text: gettext("Saving Failed"), delay: 5000})
    }

    @action
    createProgram() {
        if(this.dirtyConfirm()) {
            if(this.editing_target == 'new') {
                this.programs.shift()
            }
            this.active_editor_pane = 'profile'
            this.active_pane_is_dirty = false

            let new_program_data = {
                id: "new",
                name: "",
                gaitid: "",
                fundcode: "",
                funding_status: "",
                description: "",
                country: [],
                sector: [],
            }
            this.programs.unshift(new_program_data)
            this.editing_target = 'new'
        }
    }
    
    /*
     * if there is no GAIT Id, resolve and move on,
     * if there is a GAIT ID, call to see if it is unique, and if not confirm that the user wants to enter a
     * duplicate GAIT ID for this program (displaying the link to view programs with the same ID in GAIT)
     */
    
    validateGaitId(program_data) {
        if (program_data.gaitid) {
            let id = program_data.id || 0;
            return new Promise((resolve, reject) => {
                    this.api.validateGaitId(program_data.gaitid, id).then(response => {
                        if (response.data.unique === false) {
                        let message_intro = gettext('The GAIT ID for this program is shared with at least one other program.')
                        let link_text = gettext('View programs with this ID in GAIT.');
                        let preamble_text = `${message_intro} <a href="${response.data.gait_link}" target="_blank">${link_text}</a>`;
                        window.create_no_rationale_changeset_notice({
                            message_text: gettext('Are you sure you want to continue?'),
                            on_submit: resolve,
                            on_cancel: reject,
                            preamble: preamble_text
                        });
                        } else {
                            resolve();
                        }
                    }
                )
            });
        } else {
            return new Promise((resolve, reject) => resolve());
        }
    }

    @action
    saveNewProgram(program_data) {
        program_data.id = null
        this.saving = true
        // TODO: I think there's a chance that errors may be swallowed in the nested promises
        // see http://jamesknelson.com/are-es6-promises-swallowing-your-errors/
        this.validateGaitId(program_data).then(() => {
            this.api.createProgram(program_data)
                .then(response => this.api.fetchProgramHistory(response.data.id)
                    .then(history => {
                        runInAction(() => {
                            this.saving = false;
                            this.editing_target = response.data.id;
                            this.editing_target_data = response.data;
                            this.editing_history = history.data;
                            this.programs.shift();
                            this.programs.unshift(response.data);
                            this.programFilterPrograms.unshift(response.data);
                            this.active_pane_is_dirty = false;
                            this.onSaveSuccessHandler();
                        });
                    }).then(() => this.api.syncGAITDates(response.data.id).then(
                        (gaitSyncResponse) => console.log(gaitSyncResponse)
                    ))
                ).catch(error => {
                    runInAction(() => {
                        let errors = error.response.data
                        this.saving = false
                        this.editing_errors = errors
                    })
                })
        }).catch(() => {
            //user canceled because of GAIT ID validation failure
            runInAction(() => {
                this.saving = false;
            })
        });
    }

    @action updateProgram(id, program_data) {
        this.saving = true
        this.api.updateProgram(id, program_data)
            .then(response => this.api.fetchProgramHistory(id)
                .then(history =>
                    runInAction(() => {
                        this.saving = false;
                        this.active_pane_is_dirty = false;
                        this.editing_target_data = program_data;
                        this.updateLocalPrograms(response.data);
                        this.editing_history = history.data;
                        this.onSaveSuccessHandler();
                    })))
            .catch((errors) => {
                runInAction(() => {
                    this.saving = false
                    this.editing_errors = errors.response.data
                    this.onSaveErrorHandler()
                })
            })
    }

    @action
    toggleBulkTarget(target_id) {
        this.bulk_targets.set(target_id, !this.bulk_targets.get(target_id))
    }

    @action
    toggleBulkTargetsAll() {
        this.bulk_targets_all = !this.bulk_targets_all
        this.bulk_targets = new Map(this.programs.map(program => [program.id, this.bulk_targets_all]))
    }

    postBulkUpdateLocalPrograms(updatedPrograms) {
        let updatedProgramsById = new Map(updatedPrograms.map(program => [program.id, program]))
        this.programs = this.programs.reduce((acc, current) => {
            let updated = updatedProgramsById.get(current.id)
            if (updated) {
                acc.push(Object.assign(current, updated))
            } else {
                acc.push(current)
            }
            return acc
        }, [])
    }

    @action
    bulkUpdateProgramStatus(new_status) {
        let ids = Array.from(this.bulk_targets.entries()).filter(([id, targeted]) => targeted).map(([id, targeted]) => id)
        if (ids.length && new_status) {
            this.applying_bulk_updates = true
            this.api.updateProgramFundingStatusBulk(ids, new_status).then(response => {
                let updatedPrograms = response.data
                runInAction(() => {
                    this.postBulkUpdateLocalPrograms(updatedPrograms)
                    this.applying_bulk_updates = false
                    this.onSaveSuccessHandler()
                })
            }).catch(error => {
                runInAction(() => {
                    this.applying_bulk_updates = false
                    this.onSaveErrorHandler()
                })
            })
        }
    }

    @action
    toggleChangeLogRowExpando(row_id) {
        if (this.changelog_expanded_rows.has(row_id)) {
            this.changelog_expanded_rows.delete(row_id);
        } else {
            this.changelog_expanded_rows.add(row_id);
        }
    }
}
