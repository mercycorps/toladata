import { observable, computed, action, runInAction, toJS } from "mobx";
import {create_unified_changeset_notice} from '../../../components/changesetNotice';


const new_objective_data = {
    id: 'new',
    name: '',
    description: '',
    status: '',
};


export class CountryStore {

    //filter options
    @observable organizations = {};
    @observable users = [];
    @observable sectors = [];

    @observable filters = {
        countries: [],
        organizations: [],
        sectors: [],
        programStatus: null,
        programs: [],
    }

    @observable appliedFilters = {};

    @observable is_superuser = false;
    @observable allCountries = [];
    @observable countries = [];
    @observable country_count = 0;
    @observable new_country = null;
    @observable fetching_main_listing = false;
    @observable current_page = 0;
    @observable total_pages = null;
    @observable bulk_targets = new Map();
    @observable bulk_targets_all = false;

    @observable editing_target = null;
    @observable editing_errors = {};
    @observable fetching_editing_data = false;
    @observable editing_objectives_data = [];
    @observable editing_objectives_errors = {};
    @observable editing_disaggregations_data = [];
    @observable editing_disaggregations_errors = {};
    @observable fetching_editing_history = false;
    @observable editing_history = [];
    @observable saving = false;

    @observable bulk_targets = new Map();
    @observable applying_bulk_updates = false;
    @observable bulk_targets_all = false;

    @observable changelog_expanded_rows = new Set();

    constructor(
        api,
        initialData,
    ) {
        this.api = api
        Object.assign(this, initialData)
        this.appliedFilters = {...this.filters}
        this.fetchCountries()
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

    getCountryPrograms(countryID) {
        return this.allPrograms.filter((program) => program.country.includes(countryID))
    }

    @action
    fetchCountries() {
        if(this.dirtyConfirm()) {
            this.fetching_main_listing = true
            this.api.fetchCountries(this.current_page + 1, this.marshalFilters(this.appliedFilters)).then(results => {
                runInAction(() => {
                    this.active_editor_pane = 'profile'
                    this.active_pane_is_dirty = false
                    this.fetching_main_listing = false
                    this.countries = results.results
                    this.country_count = results.total_results
                    this.total_pages = results.total_pages
                    this.next_page =results.next_page
                    this.previous_page = results.previous_page
                })
            }).catch(errors => {
                // TODO: HANDLE THIS
            })
        }

    }

    @action
    applyFilters() {
        this.appliedFilters = {...this.filters}
        this.current_page = 0
        this.fetchCountries()
    }

    @action
    changePage(page) {
        if (page.selected == this.current_page) {
            return
        }
        this.current_page = page.selected
        this.bulk_targets = new Map()
        this.bulk_targets_all = false;
        this.fetchCountries()
    }

    @action
    changeFilter(filterKey, value) {
        this.filters = Object.assign(this.filters, {[filterKey]: value})
        if (filterKey === "countries") {
            // for "Find a country" filter, immediately apply filters when value changes:
            this.applyFilters();
        }
    }

    @action
    clearFilters() {
        let clearFilters = {
            countries: this.filters.countries || [],
            organizations: [],
            sectors: [],
            programStatus: null,
            programs: [],
        }
        this.filters = Object.assign(this.filters, clearFilters);
    }

    @action
    toggleEditingTarget(id) {
        if(this.dirtyConfirm()){
            if(this.editing_target === 'new') {
                this.countries.shift();
                this.editing_errors = {};
            }

            this.active_editor_pane = 'profile';
            this.active_pane_is_dirty = false;
            this.editing_disaggregations_errors = {};
            if(this.editing_target === id) {
                this.editing_target = false;
                this.editing_errors = {};
            } else {

                this.editing_target = id;
                this.fetching_editing_data = true;
                this.fetching_editing_history = true;
                Promise.all([
                    this.api.fetchCountryObjectives(id),
                    this.api.fetchCountryDisaggregations(id),
                ]).then(([objectives_resp, disaggregations_resp]) => {
                    runInAction(() => {
                        this.fetching_editing_data = false;
                        this.fetching_editing_history = true;
                        this.editing_objectives_data = objectives_resp.data;
                        this.editing_disaggregations_data = disaggregations_resp.data;
                        this.updateHistory(id)
                    })
                }).catch(errors => {
                    //TODO : HANDLE THIS
                });
            }
        }
    }

    updateLocalList(updated) {
        this.countries = this.countries.reduce((acc, current) => {
            if (current.id == updated.id) {
                acc.push(updated)
            } else {
                acc.push(current)
            }
            return acc
        }, [])
    }

    updateHistory(id) {
        if (id === "new") {
            this.editing_history = [];
        }
        else {
            this.api.fetchCountryHistory(id).then(response => {
                this.editing_history = response.data;
                this.fetching_editing_history = false;
            }).catch(errors => {
                this.fetching_editing_history = false;
            });
        }
    }

    onSaveSuccessHandler({retroProgramCount}={}) {
        if (retroProgramCount) {
            const message = interpolate(ngettext(
                // # Translators: Success message shown to user when a new disaggregation has been saved and associated with existing data.
                "Disaggregation saved and automatically selected for all indicators in %s program.",
                "Disaggregation saved and automatically selected for all indicators in %s programs.",
                retroProgramCount
            ), [retroProgramCount])
            // # Translators: Saving to the server succeeded
            window.unified_success_message(gettext("Successfully saved"), {message_text: message});
        }
        else {
           // # Translators: Saving to the server succeeded
            window.unified_success_message(gettext('Successfully Saved'))
        }

    }

    onSaveErrorHandler(message) {
        // # Translators: Saving to the server failed
        window.unified_error_message(message || gettext('Saving Failed'), {self_dismissing: true, dismiss_delay: 3000, dir1: 'left', dir2: 'down'});
    }

    onDeleteSuccessHandler() {
        // # Translators: Notification that a user has been able to delete a disaggregation
        window.unified_success_message(gettext('Successfully deleted'))
    }

    onArchiveSuccessHandler() {
        // # Translators: Notification that a user has been able to disable a disaggregation
        window.unified_success_message(gettext('Successfully archived'))
    }

    onUnarchiveSuccessHandler() {
        // # Translators: Notification that a user has been able to reactivate a disaggregation
        window.unified_success_message(gettext('Successfully unarchived'))
    }

    onDuplicatedDisaggLabelMessage(message) {
        // # Translators: error message generated when item names are duplicated but are required to be unqiue.
        window.unified_error_message(message || gettext("Saving failed: Disaggregation categories should be unique within a disaggregation."),
                                     {self_dismissing: true, dismiss_delay: 3000, dir1: 'left', dir2: 'down'});
    }

    onDuplicatedDisaggTypeMessage(message) {
        window.unified_error_message(message ||
            // # Translators: error message generated when item names are duplicated but are required to be unqiue.
            gettext("Saving failed: disaggregation names should be unique within a country."),
            {self_dismissing: true, dismiss_delay: 3000, dir1: 'left', dir2: 'down'});
    }

    @observable active_editor_pane = 'profile'

    active_pane_is_dirty = false

    dirtyConfirm() {
        return !this.active_pane_is_dirty || (this.active_pane_is_dirty && confirm(gettext("You have unsaved changes. Are you sure you want to discard them?")))
    }

    @action
    onProfilePaneChange(new_pane) {
        if(this.dirtyConfirm()) {
            this.active_editor_pane = new_pane;
            this.active_pane_is_dirty = false;
        }
    }

    setActiveFormIsDirty(is_dirty) {
        this.active_pane_is_dirty = is_dirty
    }

    @action
    addCountry() {
        if(this.dirtyConfirm()) {
            if(this.editing_target == 'new') {
                this.countries.shift()
            }

            this.active_editor_pane = 'profile'
            this.active_pane_is_dirty = false

            let new_country_data = {
                id: "new",
                country: "",
                description: "",
                code: "",
                organizations: [],
            }
            this.countries.unshift(new_country_data)
            this.editing_target = 'new'
        }
    }

    @action
    saveNewCountry(country_data) {
        country_data.id = null;
        this.saving = true;
        this.api.createCountry(country_data).then(response => {
            runInAction(()=> {
                this.saving = false;
                this.editing_errors = {};
                this.editing_target = response.data.id;
                this.active_pane_is_dirty = false;
                this.countries.shift();
                this.countries.unshift(response.data);
                this.allCountries.unshift(response.data);
                this.onSaveSuccessHandler();
                this.updateHistory(response.data.id);
            })
        }).catch(errors => {
            runInAction(()=> {
                this.saving = false;
                this.editing_errors = errors.response?.data;
                this.onSaveErrorHandler(errors.response?.data?.detail);
            })
        })
    }

    @action updateCountry(id, country_data) {
        this.saving = true;
        this.api.updateCountry(id, country_data)
            .then(response =>
                runInAction(() => {
                    this.saving = false;
                    this.editing_errors = {};
                    this.active_pane_is_dirty = false;
                    this.updateLocalList(response.data);
                    this.onSaveSuccessHandler();
                    this.updateHistory(id);
                }))
            .catch((errors) => {
                runInAction(() => {
                    this.saving = false;
                    this.editing_errors = errors.response?.data;
                    this.onSaveErrorHandler(errors.response?.data?.detail);
                })
            })
    }

    @action addObjective() {
        if (this.editing_objectives_data.find(objective => objective.id=='new')) {
            return
        }
        this.editing_objectives_data = [...this.editing_objectives_data, new_objective_data]
    }

    @action updateObjective(id, data) {
        this.editing_objectives_errors = {}
        this.api.updateObjective(id, data).then(response => {
            runInAction(() => {
                this.onSaveSuccessHandler()
                let updatedObjective = response.data
                this.active_pane_is_dirty = false
                this.editing_objectives_data = this.editing_objectives_data.map(objective => {
                    if (objective.id == updatedObjective.id) {
                        return updatedObjective
                    }
                    return objective
                })
            })
        }).catch((errors) => {
            runInAction(() => {
                this.saving = false
                this.editing_objectives_errors = errors.response.data
                this.onSaveErrorHandler(errors.response.data.detail)
            })
        })
    }

    @action createObjective(data) {
        this.editing_objectives_errors = {}
        this.api.createObjective(data).then(response => {
            runInAction(() => {
                this.onSaveSuccessHandler()
                this.active_pane_is_dirty = false
                let newObjective = response.data
                this.editing_objectives_data = [...this.editing_objectives_data.filter(objective => objective.id!='new'), newObjective]
            })
        }).catch((errors) => {
            runInAction(() => {
                this.saving = false
                this.editing_objectives_errors = errors.response.data
                this.onSaveErrorHandler(errors.response.data.detail)
            })
        })
    }

    @action deleteObjective(id) {
        if (id=='new') {
            this.editing_objectives_data = this.editing_objectives_data.filter(objective => objective.id!='new')
            return
        }
        this.api.deleteObjective(id).then(response => {
            runInAction(() => {
                this.editing_objectives_data = this.editing_objectives_data.filter(objective => objective.id!=id)
                this.onDeleteSuccessHandler()
            })
        }).catch((errors) => {
            runInAction(() => {
                this.onSaveErrorHandler(errors.response.data.detail)
            })
        })
    }

    @action clearObjectiveEditingErrors() {
        this.editing_objectives_errors = {}
    }

    @action clearDisaggregationEditingErrors() {
        this.editing_disaggregations_errors = {}
    }

    @action addDisaggregation() {
        const new_disaggregation_data = {
            id: 'new',
            disaggregation_type: "",
            selected_by_default: false,
            is_archived: false,
            labels: [{id: 'new', label: '', createdId: 'new-0'}],
        }
        if (this.editing_disaggregations_data.find(disaggregation => disaggregation.id=='new')) {
            return
        }
        this.editing_disaggregations_data = [...this.editing_disaggregations_data, new_disaggregation_data]
    }

    @action deleteDisaggregation(id, callback) {
        create_unified_changeset_notice({
            header: gettext("Warning"),
            show_icon: true,
            preamble: gettext("This action cannot be undone."),
            // # Translators: This is a confirmation prompt to confirm a user wants to delete an item
            message_text: gettext("Are you sure you want to delete this disaggregation?"),
            include_rationale: false,
            rationale_required: false,
            showCloser: true,
            modal: true,
            notice_type: 'error',
            on_submit: () => {
                if (id=='new') {
                    this.editing_disaggregations_data = this.editing_disaggregations_data.filter(disagg=>disagg.id!='new')
                    this.active_pane_is_dirty = false;
                    callback && callback();
                    return
                } else {
                    this.api.deleteDisaggregation(id).then(response => {
                        runInAction(() => {
                            this.editing_disaggregations_data = this.editing_disaggregations_data.filter(disagg => disagg.id!=id);
                            this.active_pane_is_dirty = false;
                            this.onDeleteSuccessHandler();
                            this.updateHistory(this.editing_target);
                            callback && callback();
                        })
                    });
                }
            },
            on_cancel: () => {},
            blocking: true
        });
    }

    @action archiveDisaggregation(id) {
        create_unified_changeset_notice({
            header: gettext("Warning"),
            show_icon: true,
            // # Translators: This is part of a confirmation prompt to archive a type of disaggregation (e.g. "gender" or "age")
            preamble: gettext("New programs will be unable to use this disaggregation. (Programs already using the disaggregation will be unaffected.)"),
            // # Translators: This is a confirmation prompt to confirm a user wants to archive an item
            message_text: gettext("Are you sure you want to continue?"),
            include_rationale: false,
            rationale_required: false,
            notice_type: 'notice',
            modal: true,
            showCloser: true,
            on_submit: () => {
                this.api.deleteDisaggregation(id).then(response => {
                    runInAction(() => {
                        this.editing_disaggregations_data.filter(disagg => disagg.id==id).forEach(
                            disagg => {disagg.is_archived = true;}
                        );
                        this.active_pane_is_dirty = false;
                        this.onArchiveSuccessHandler();
                        this.updateHistory(this.editing_target);
                    });
                });
            },
            on_cancel: () => {},
            blocking: true
        });
    }

    @action unarchiveDisaggregation(id) {
        let countryData = this.countries.find(country => country.id == this.editing_target);
        let countryName = countryData ? countryData.country : "this country";
        create_unified_changeset_notice({
            header: gettext("Warning"),
            show_icon: true,
            // # Translators: This is part of a confirmation prompt to unarchive a type of disaggregation (e.g. "gender" or "age")
            preamble: interpolate(gettext("All programs in %s will be able to use this disaggregation."), [countryName]),
            // # Translators: This is a confirmation prompt to confirm a user wants to unarchive an item
            message_text: gettext("Are you sure you want to continue?"),
            notice_type: 'notice',
            modal: true,
            showCloser: true,
            on_submit: () => {
                this.api.partialUpdateDisaggregation(id, {is_archived: false}).then(response => {
                    runInAction(() => {
                        this.editing_disaggregations_data.filter(disagg => disagg.id==id).forEach(
                            disagg => {disagg.is_archived = false;}
                        );
                        this.active_pane_is_dirty = false;
                        this.onUnarchiveSuccessHandler();
                        this.updateHistory(this.editing_target);
                    });
                });
            },
            on_cancel: () => {},
            blocking: true
        });
    }

    @action updateDisaggregation(id, data) {
        this.assignDisaggregationErrors(this.editing_disaggregations_data, data, id);
        const hasLabelErrors = this.editing_disaggregations_errors.hasOwnProperty('labels')
            && this.editing_disaggregations_errors['labels'].length > 0
            && this.editing_disaggregations_errors['labels'].some( entry => {
                    return entry.hasOwnProperty('label')
                });
        if (this.editing_disaggregations_errors['disaggregation_type'] || hasLabelErrors) {
            return;
        }

        delete data.is_archived;
        this.api.updateDisaggregation(id, data).then(response => {
            runInAction(() => {
                this.onSaveSuccessHandler();
                let updatedDisaggregation = response.data;
                this.active_pane_is_dirty = false;
                this.editing_disaggregations_data = this.editing_disaggregations_data.map(disaggregation => {
                    if (disaggregation.id == updatedDisaggregation.id) {
                        return updatedDisaggregation;
                    }
                    return disaggregation;
                });
                this.updateHistory(this.editing_target);
            })
        }).catch((errors) => {
            this.saving = false;
            this.editing_disaggregations_errors = errors.response.data
            this.onSaveErrorHandler(errors.response.data.detail);
        })
    }

    @action createDisaggregation(data) {
        this.assignDisaggregationErrors(this.editing_disaggregations_data, data, "new");
        const hasLabelErrors = this.editing_disaggregations_errors.hasOwnProperty('labels')
            && this.editing_disaggregations_errors['labels'].length > 0
            && this.editing_disaggregations_errors['labels'].some( entry => {
                    return entry.hasOwnProperty('label');
                });
        if (this.editing_disaggregations_errors['disaggregation_type'] || hasLabelErrors) {
            this.saving = false;
            return Promise.reject("Validation failed") ;
        }
        const retroProgramCount = data.hasOwnProperty('retroPrograms') ? data.retroPrograms.length : 0

        return this.api.createDisaggregation(data).then(response => {
            this.updateHistory(response.data.country);
            return runInAction(() => {
                this.onSaveSuccessHandler({retroProgramCount: retroProgramCount});
                const newDisaggregation = response.data;
                this.editing_history = history.data;
                this.active_pane_is_dirty = false;
                this.editing_disaggregations_data = [...this.editing_disaggregations_data.filter(disaggregation => disaggregation.id != 'new'), newDisaggregation];
                return newDisaggregation;
            });
        }).catch((errors) => {
            runInAction(() => {
                this.saving = false;
                this.editing_disaggregations_errors = errors.response.data;
                this.onSaveErrorHandler();
            });
            return Promise.reject("API handling error");
        })
    }

    @action
    toggleChangeLogRowExpando(row_id) {
        if (this.changelog_expanded_rows.has(row_id)) {
            this.changelog_expanded_rows.delete(row_id);
        } else {
            this.changelog_expanded_rows.add(row_id);
        }
    }

    @action
    assignDisaggregationErrors(existingDisagg, newDisagg, disaggId) {
        const existingDisaggTypes = existingDisagg.filter(disagg => disagg.id !== disaggId)
            .map(disagg => disagg.disaggregation_type);
        if (existingDisaggTypes.includes(newDisagg.disaggregation_type)) {
            const countryName = this.allCountries.filter( c => parseInt(c.id) === parseInt(newDisagg.country))[0] || "";
            // # Translators:  This error message appears underneath a user-input name if it appears more than once in a set of names.  Only unique names are allowed.
            this.editing_disaggregations_errors['disaggregation_type'] = [interpolate(gettext("There is already a disaggregation type called \"%(newDisagg)s\" in %(country)s. Please choose a unique name."),
                {newDisagg: newDisagg['disaggregation_type'], country: countryName.country},
                true)]
        }
        else{
            this.editing_disaggregations_errors = {}
        }
        this.assignDisaggregationLabelErrors(newDisagg)
    }

    @action
    assignDisaggregationLabelErrors = (newDisagg) => {
        const duplicateIndexes = this.findDuplicateLabelIndexes(newDisagg.labels.map(label => label.label));
        let labelErrors = Array(newDisagg.labels.length).fill().map( e => ({}));

        newDisagg.labels.forEach( (label, index) => {
            if (!label.label || label.label.length === 0) {
                // # Translators:  This error message appears underneath user-input labels that appear more than once in a set of labels.  Only unique labels are allowed.
                labelErrors[index]['label'] = [gettext("Categories must not be blank.")];
            }
            else if (duplicateIndexes.includes(index)) {
                // # Translators:  This error message appears underneath user-input labels that appear more than once in a set of labels.  Only unique labels are allowed.
                labelErrors[index]['label'] = [gettext("Categories must have unique names.")];
            }
        });
        this.editing_disaggregations_errors['labels'] = labelErrors;
    }

    findDuplicateLabelIndexes(label_list) {
        const lowerCaseList = label_list.map( label => label.toLowerCase())
        let dupeIndexes = new Set();
        lowerCaseList.forEach( (label, index) => {
            const dupeIndex = lowerCaseList.indexOf(label, index+1);
            if (dupeIndex > 0) {
                dupeIndexes.add(index).add(dupeIndex);
            }
        });
        return Array.from(dupeIndexes);

    };

}
