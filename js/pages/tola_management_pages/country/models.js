import { observable, computed, action, runInAction } from "mobx";


const new_objective_data = {
    id: 'new',
    name: '',
    description: '',
    status: '',
}


export class CountryStore {

    //filter options
    @observable organizations = {}
    @observable users = []
    @observable sectors = []

    @observable filters = {
        countries: [],
        organizations: [],
        sectors: [],
        programStatus: null,
        programs: [],
    }

    @observable appliedFilters = {
    }

    @observable is_superuser = false
    @observable allCountries = []
    @observable countries = []
    @observable country_count = 0
    @observable new_country = null
    @observable fetching_main_listing = false
    @observable current_page = 0
    @observable total_pages = null
    @observable bulk_targets = new Map()
    @observable bulk_targets_all = false

    @observable editing_target = null
    @observable editing_errors = {}
    @observable fetching_editing_data = false
    @observable editing_objectives_data = []
    @observable editing_objectives_errors = {}
    @observable editing_disaggregations_data = []
    @observable editing_disaggregations_errors = {}
    @observable saving = false

    @observable bulk_targets = new Map()
    @observable applying_bulk_updates = false
    @observable bulk_targets_all = false

    constructor(
        api,
        initialData,
    ) {
        this
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
    }

    @action
    clearFilters() {
        let clearFilters = {
            countries: [],
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
            if(this.editing_target == 'new') {
                this.countries.shift()
                this.editing_errors = {}
            }

            this.active_editor_pane = 'profile'
            this.active_pane_is_dirty = false

            if(this.editing_target == id) {
                this.editing_target = false
                this.editing_errors = {}
            } else {
                this.editing_target = id
                this.fetching_editing_data = true
                Promise.all([
                    this.api.fetchCountryObjectives(id),
                    this.api.fetchCountryDisaggregations(id),
                ]).then(([objectives_resp, disaggregations_resp]) => {
                    runInAction(() => {
                        this.fetching_editing_data = false
                        this.editing_objectives_data = objectives_resp.data
                        this.editing_disaggregations_data = disaggregations_resp.data
                    })
                })
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

    onSaveSuccessHandler() {
        PNotify.success({text: gettext("Successfully Saved"), delay: 5000})
    }

    onSaveErrorHandler(message) {
        PNotify.error({text: message || gettext("Saving Failed"), delay: 5000})
    }

    onDeleteSuccessHandler() {
        PNotify.success({text: gettext("Successfully Deleted"), delay: 5000})
    }

    @observable active_editor_pane = 'profile'

    active_pane_is_dirty = false

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
        country_data.id = null
        this.saving = true
        this.api.createCountry(country_data).then(response => {
            runInAction(()=> {
                this.saving = false
                this.editing_errors = {};
                this.editing_target = response.data.id;
                this.active_pane_is_dirty = false
                this.countries.shift()
                this.countries.unshift(response.data)
                this.allCountries.unshift(response.data)
                this.onSaveSuccessHandler();
            })
        }).catch(errors => {
            runInAction(()=> {
                this.saving = false
                this.editing_errors = errors.response.data
                this.onSaveErrorHandler(errors.response.data.detail)
            })
        })
    }

    @action updateCountry(id, country_data) {
        this.saving = true
        this.api.updateCountry(id, country_data).then(response => {
            runInAction(() => {
                this.saving = false
                this.editing_errors = {};
                this.active_pane_is_dirty = false
                this.updateLocalList(response.data)
                this.onSaveSuccessHandler()
            })
        }).catch((errors) => {
            runInAction(() => {
                this.saving = false
                this.editing_errors = errors.response.data
                this.onSaveErrorHandler(errors.response.data.detail)
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
            labels: [{id: 'new', label: ''}],
        }
        if (this.editing_disaggregations_data.find(disaggregation => disaggregation.id=='new')) {
            return
        }
        this.editing_disaggregations_data = [...this.editing_disaggregations_data, new_disaggregation_data]
    }

    @action deleteDisaggregation(id) {
        if (id=='new') {
            this.editing_disaggregations_data = this.editing_disaggregations_data.filter(disagg=>disagg.id!='new')
            this.active_pane_is_dirty = false;
            return
        }
        this.api.deleteDisaggregation(id).then(response => {
            runInAction(() => {
                this.editing_disaggregations_data = this.editing_disaggregations_data.filter(disagg => disagg.id!=id)
                this.active_pane_is_dirty = false;
                this.onDeleteSuccessHandler()
            })
        })
    }

    @action updateDisaggregation(id, data) {
        this.editing_disaggregations_errors = {}
        this.api.updateDisaggregation(id, data).then(response => {
            runInAction(() => {
                this.onSaveSuccessHandler()
                let updatedDisaggregation = response.data
                this.active_pane_is_dirty = false
                this.editing_disaggregations_data = this.editing_disaggregations_data.map(disaggregation => {
                    if (disaggregation.id == updatedDisaggregation.id) {
                        return updatedDisaggregation
                    }
                    return disaggregation
                })
            })
        }).catch((errors) => {
            this.saving = false
            this.editing_disaggregations_errors = errors.response.data
            this.onSaveErrorHandler()
        })
    }

    @action createDisaggregation(data) {
        this.editing_disaggregations_errors = {}
        this.api.createDisaggregation(data).then(response => {
            runInAction(() => {
                this.onSaveSuccessHandler()
                const newDisaggregation = response.data
                this.active_pane_is_dirty = false
                this.editing_disaggregations_data = [...this.editing_disaggregations_data.filter(disaggregation => disaggregation.id!='new'), newDisaggregation]
            })
        }).catch((errors) => {
            runInAction(() => {
                this.saving = false
                this.editing_disaggregations_errors = errors.response.data
                this.onSaveErrorHandler()
            })
        })
    }

}
