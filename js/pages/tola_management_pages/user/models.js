import { observable, computed, action, runInAction } from 'mobx';
import api from './api';
import { sortObjectListByValue } from '../../../general_utilities'

const default_user = {
    id: null,
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone_number: "",
    organization_id: null,
    mode_of_contact: "",
    title: "",
    user_programs: 0,
    user: {is_active:true},
}

const default_editing_target_data = {
    profile: {...default_user},
    access: {country: {}, programs:[]},
    history: []
}

export class UserStore {
    @observable users = {}
    @observable users_listing = []
    @observable users_count = null
    @observable fetching_users_listing = false
    @observable current_page = 0
    @observable total_pages = null
    @observable bulk_targets = new Map()
    @observable bulk_targets_all = false
    @observable applying_bulk_updates = false

    @observable saving_user_profile = false
    @observable saving_user_programs = false

    @observable access = {countries: {}, programs: {}}
    @observable is_superuser = false

    @observable fetching_editing_target = false
    @observable editing_target = null
    @observable editing_target_data = {...default_editing_target_data}
    @observable editing_errors = {}

    @observable new_user = null

    //filter options
    @observable countries = {}
    @observable ordered_country_ids = []
    @observable organizations = {}
    @observable programs = {}
    @observable available_users = []

    @observable countries_selections = []
    @observable organization_selections = []
    @observable program_selections = []
    @observable user_selections = []
    @observable program_bulk_selections = []

    @observable unsaved_changes_actions = {
        save: () => {},
        discard: () => {}
    }

    @observable active_editor_pane = 'profile'

    active_pane_is_dirty = false

    country_role_choices = []
    program_role_choices = []

    user_status_options = [
        {value: 1, label: gettext('Active')},
        {value: 0, label: gettext('Inactive')}
    ]

    admin_role_options = [
        {value: 1, label: gettext('Yes')},
        {value: 0, label: gettext('No')}
    ]

    @observable filters = {
        countries: [],
        base_countries: [],
        organizations: [],
        programs: [],
        user_status: '',
        admin_role: '',
        users: []
    }

    @observable appliedFilters = {
    }

    // UI state - track what history rows are expanded
    @observable changelog_expanded_rows = new Set();

    constructor({
        regions,
        countries,
        organizations,
        programs,
        users,
        access,
        is_superuser,
        programs_filter,
        country_filter,
        organizations_filter,
        program_role_choices,
        country_role_choices,
    }) {
        this.regions = regions
        this.countries = countries
        this.ordered_country_ids = Object.values(countries).sort((a, b) => a.name.localeCompare(b.name)).map(country => country.id)
        this.organizations = organizations
        this.programs = programs
        this.available_users = users.filter(user => user.name)

        this.countries_selections = sortObjectListByValue(this.ordered_country_ids.map(id => this.countries[id])
                                                            .map(country => ({value: country.id, label: country.name})))

        this.organization_selections = sortObjectListByValue(Object.values(organizations).map(org => ({value: org.id, label: org.name})))

        this.program_selections = this.createProgramSelections(this.programs)

        this.user_selections = this.available_users.map(user => ({value: user.id, label: user.name}))

        this.program_bulk_selections = this.ordered_country_ids.map(id => this.countries[id]).map((country) => ({
            label: country.name,
            options: country.programs.map(program_id => ({
                label: country.name+": "+programs[program_id].name,
                value: country.id+"_"+program_id
            }))
        }))

        this.access = access
        this.is_superuser = is_superuser
        this.filters.programs = programs_filter.map(id => this.programs[id]).map(program => ({label: program.name, value: program.id}))
        this.filters.organizations = organizations_filter.map(id => this.organizations[id]).map(org => ({label: org.name, value: org.id}))
        this.filters.countries = country_filter.map(id => this.countries[id]).map(country => ({label: country.name, value: country.id}))

        this.country_role_choices = country_role_choices.map(([value, label]) => ({label, value}))
        this.program_role_choices = program_role_choices.map(([value, label]) => ({label, value}))
        this.appliedFilters = {...this.filters}
        this.fetchUsers()
    }

    /*******************
    we turn the complex intermediate filter objects into simple lists for
    transmission to the api, (while retaining their filter keys)

    eg

    {
    ...
    countries: [{label: 'Afghanistan', value: 1}]
    }

    becomes

    {
    ...
    countries: [1]
    }

    */
    marshalFilters(filters) {
        return Object.entries(filters).reduce((xs, x) => {
            if(Array.isArray(x[1])) {
                xs[x[0]] = x[1].map(x => x.value)
            } else {
                xs[x[0]] = x[1].value
            }
            return xs
        }, {})
    }

    @computed get countriesByRegion() {
        return Object.values(this.regions || {})
            .map(region => ({
                id: region.id,
                name: gettext(region.name),
                countries: Object.values(this.countries).filter(country => country.region == region.id)
            }))
            .filter(region => region.countries.length > 0)
            .sort((regionA, regionB) => (regionA.name.toUpperCase() < regionB.name.toUpperCase()) ? -1 : 1);
    }

    dirtyConfirm() {
        return !this.active_pane_is_dirty || (this.active_pane_is_dirty && confirm(gettext("You have unsaved changes. Are you sure you want to discard them?")))
    }

    getSelectedBulkTargetIDs() {
        return [...this.bulk_targets.entries()]
            .filter(([_, selected]) => selected)
            .map(([user_id, _]) => user_id)
    }

    onSaveErrorHandler(message) {
        // # Translators: Saving to the server failed
        window.unified_error_message(message || gettext('Saving failed'), {self_dismissing: true, dismiss_delay: 3000, dir1: 'left', dir2: 'down'});
    }

    onSaveSuccessHandler(message) {
        // # Translators: Saving to the server succeeded
        window.unified_success_message(message || gettext('Successfully saved'))
    }

    createProgramSelections(programs) {
        return sortObjectListByValue(Object.values(programs).map(program => ({value: program.id, label: program.name})))
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
    fetchUsers() {
        if(this.dirtyConfirm()) {
            this.fetching_users_listing = true
            api.fetchUsersWithFilter(this.current_page + 1, this.marshalFilters(this.appliedFilters)).then(results => {
                runInAction(() => {
                    this.active_editor_pane = 'profile'
                    this.active_pane_is_dirty = false
                    this.fetching_users_listing = false
                    this.users = results.users.reduce((xs, x) => {
                        xs[x.id] = x
                        return xs
                    }, {})
                    this.users_listing = results.users.map(u => u.id)
                    this.bulk_targets_all = false
                    this.bulk_targets = new Map()
                    this.users_count = results.total_users
                    this.total_pages = results.total_pages
                    this.next_page = results.next_page
                    this.previous_page = results.previous_page
                })
            }).catch(errors => {
                // TODO: handle this?
            });
        }
    }

    @action
    applyFilters() {
        this.appliedFilters = {...this.filters}
        this.current_page = 0
        this.fetchUsers()
    }

    @action
    changePage(page) {
        if(page.selected != this.current_page) {
            this.current_page = page.selected
            this.fetchUsers()
        }
    }

    @action
    toggleBulkTargetsAll() {
        this.bulk_targets_all = !this.bulk_targets_all
        let user_ids = Object.values(this.users_listing)
        this.bulk_targets = new Map(user_ids.map(id => [id, this.bulk_targets_all]))
    }

    @action
    toggleBulkTarget(target_id) {
        this.bulk_targets.set(target_id, !this.bulk_targets.get(target_id))
    }

    @action
    changeCountryFilter(countries) {
        this.filters.countries = countries
        if(countries.length == 0) {
            this.program_selections = this.createProgramSelections(this.programs)
        } else {
            const candidate_programs = countries.map(selection => selection.value)
                                                .map(id => this.countries[id])
                                                .flatMap(country => country.programs)
            const selected_programs_set = new Set(candidate_programs)
            this.program_selections = this.createProgramSelections(Array.from(selected_programs_set).map(id => this.programs[id]))
        }
    }

    @action
    changeBaseCountryFilter(base_countries) {
        this.filters.base_countries = base_countries
    }

    @action
    changeOrganizationFilter(organizations) {
        this.filters.organizations = organizations
    }

    @action
    changeProgramFilter(programs) {
        this.filters.programs = programs
    }

    @action
    changeUserStatusFilter(status) {
        this.filters.user_status = status
    }

    @action
    changeAdminRoleFilter(role) {
        this.filters.admin_role = role
    }

    @action
    changeUserFilter(users) {
        this.filters.users = users;
        // "Find a user" filter should immediately activate filters:
        this.applyFilters();
    }

    @action
    toggleEditingTarget(user_id) {
        if(this.dirtyConfirm()) {
            this.editing_errors = {}
            this.editing_target_data = {...default_editing_target_data}
            this.active_pane_is_dirty = false
            if(this.editing_target == 'new') {
                this.users_listing.shift()
            }
            this.active_editor_pane = 'profile'

            if(this.editing_target == user_id) {
                this.editing_target = null
            } else {
                this.editing_target = user_id
                this.fetching_editing_target = true
                Promise.all([api.fetchUser(user_id), api.fetchUserProgramAccess(user_id), api.fetchUserHistory(user_id)]).then(([user, access_data, history_data]) => {
                    runInAction(() => {
                        this.fetching_editing_target = false
                        this.editing_target_data = {
                            profile: user,
                            access: access_data,
                            history: history_data
                        }
                    })
                })
            }
        }
    }

    @action
    updateActiveEditPage(section_name) {
        this.active_edit_page = section_name
        this.active_pane_is_dirty = false
    }

    @action
    createUser() {
        if(this.dirtyConfirm()) {
            this.editing_errors = {}
            this.active_pane_is_dirty = false
            this.active_editor_pane = 'profile'
            if(this.editing_target == 'new') {
                this.users_listing.shift()
            }

            this.editing_target_data = {...default_editing_target_data}

            this.users["new"] = {
                id: "new",
                name: "",
                organization_name: "",
                user_programs: 0,
                is_active: false
            }

            this.users_listing.unshift("new")
            this.editing_target = 'new'
        }
    }

    @action
    updateUserProfile(user_id, new_user_data) {
        this.saving_user_profile = true
        this.editing_errors = {}
        this.active_pane_is_dirty = false
        api.saveUserProfile(user_id, new_user_data).then(result => Promise.all([api.fetchUserAggregates(result.id), api.fetchUserHistory(result.id)]).then(([aggregates, history]) => {
            this.onSaveSuccessHandler()
            runInAction(() => {
                this.saving_user_profile = false
                this.users[result.id] = {
                    id: result.id,
                    name: result.name,
                    organization_name: this.organizations[result.organization_id].name,
                    user_programs: aggregates.program_count,
                    is_active: result.user.is_active
                }
                this.active_pane_is_dirty = false
                this.editing_target_data.profile = result
                this.editing_target_data.history = history
            })
        })).catch(errors => {
            this.onSaveErrorHandler(errors.response.data.detail)
            runInAction(() => {
                this.saving_user_profile = false
                this.editing_errors = errors.response.data
            })
        })
    }

    @action
    updateUserIsActive(user_id, new_user_data) {
        this.saving_user_profile = true
        this.editing_errors = {}
        this.active_pane_is_dirty = false
        api.updateUserIsActive(user_id, new_user_data).then(result => Promise.all([api.fetchUserAggregates(user_id), api.fetchUserHistory(user_id)]).then(([aggregates, history]) => {
            this.onSaveSuccessHandler()
            runInAction(() => {
                this.saving_user_profile = false
                this.users[result.id] = {
                    id: result.id,
                    name: result.name,
                    organization_name: this.organizations[result.organization_id].name,
                    user_programs: aggregates.program_count,
                    is_active: result.user.is_active
                }
                this.active_pane_is_dirty = false
                this.editing_target_data.profile = result
                this.editing_target_data.history = history
            })
        })).catch(errors => {
            this.onSaveErrorHandler(errors.response.data.detail)
            runInAction(() => {
                this.saving_user_profile = false
                this.editing_errors = errors.response.data
            })
        })
    }

    @action
    resendRegistrationEmail(user_id) {
        this.saving_user_profile = true
        api.resendRegistrationEmail(user_id).then(result => {
            runInAction(() => {
                this.saving_user_profile = false
                // # Translators: An email was sent to the user to verify that the email address is valid
                this.onSaveSuccessHandler(gettext("Verification email sent"))
            })
        }).catch(() => {
            // # Translators: Sending an email to the user did not work
            this.onSaveSuccessHandler(gettext("Verification email send failed"))
        })
    }

    @action
    saveNewUser(new_user_data) {
        this.saving_user_profile = true
        this.editing_errors = {}
        this.active_pane_is_dirty = false
        api.createUser(new_user_data).then(result => api.fetchUserAggregates(result.id).then(aggregates => {
            this.onSaveSuccessHandler()
            runInAction(() => {
                this.saving_user_profile = false
                this.users[result.id] = {
                    id: result.id,
                    name: result.name,
                    organization_name: this.organizations[result.organization_id].name,
                    user_programs: aggregates.program_count,
                    is_active: result.user.is_active
                }
                this.active_pane_is_dirty = false
                this.user_selections.push({value: result.id, label: result.name})
                this.users_listing[0] = result.id
                this.editing_target = null
                this.toggleEditingTarget(result.id)
                delete this.users["new"]
            })
        })).catch(errors => {
            this.onSaveErrorHandler(errors.response.data.detail)
            runInAction(() => {
                this.saving_user_profile = false
                this.editing_errors = errors.response.data
            })
        })
    }

    @action
    saveNewUserAndAddAnother(new_user_data) {
        this.saving_user_profile = true
        this.editing_errors = {}
        this.active_pane_is_dirty = false
        api.createUser(new_user_data).then(result => api.fetchUserAggregates(result.id).then(aggregates => {
            this.onSaveSuccessHandler()
            runInAction(() => {
                this.saving_user_profile = false
                this.users[result.id] = {
                    id: result.id,
                    name: result.name,
                    organization_name: this.organizations[result.organization_id].name,
                    user_programs: aggregates.program_count,
                    is_active: result.user.is_active
                }
                this.active_pane_is_dirty = false
                this.user_selections.push({value: result.id, label: result.name})
                this.users_listing[0] = result.id
                delete this.users["new"]
                this.createUser()
            })
        })).catch(errors => {
            this.onSaveErrorHandler(errors.response.data.detail)
            runInAction(() => {
                this.saving_user_profile = false
                this.editing_errors = errors.response.data
            })
        })
    }

    @action
    saveUserPrograms(user_id, new_user_programs_data) {
        this.saving_user_programs = true
        this.active_pane_is_dirty = false
        api.saveUserPrograms(user_id, new_user_programs_data).then(result => Promise.all([api.fetchUserAggregates(user_id), api.fetchUserHistory(user_id), api.fetchUserProgramAccess(user_id)]).then(([aggregates, history, access]) => {
            runInAction(() => {
                this.saving_user_programs = false
                this.users[user_id].user_programs = aggregates.program_count
                this.editing_target_data.history = history
                this.editing_target_data.access = access
                this.active_pane_is_dirty = false
            })
            this.onSaveSuccessHandler()
        })).catch(errors => {
            this.onSaveErrorHandler(errors.response.data.detail)
            runInAction(() => {
                this.saving_user_programs = false
            })
        })
    }

    @action
    bulkUpdateUserStatus(new_status) {
        this.applying_bulk_updates = true
        api.bulkUpdateUserStatus(
            this.getSelectedBulkTargetIDs(),
            new_status
        ).then(result => {
            runInAction(() => {
                result.forEach(updated => {
                    let user = Object.assign(this.users[updated.id], updated)
                    this.users[user.id] = user
                })
                this.applying_bulk_updates = false
            })
            this.onSaveSuccessHandler()
        }).catch(response => {
            runInAction(() => {
                this.applying_bulk_updates = false
            })
            this.onSaveErrorHandler()
        })
    }

    @action
    bulkAddPrograms(added_programs) {
        this.applying_bulk_updates = true
        api.bulkAddPrograms(
            this.getSelectedBulkTargetIDs(),
            added_programs.map(key => {
                const [country_id, program_id] = key.split('_')
                return {country: country_id, program: program_id, role: 'low'}
            })
        ).then(result => {
            //update open user programs
            const updated_users = this.getSelectedBulkTargetIDs()
            updated_users.forEach(id => {
                if(this.editing_target == id) {
                    api.fetchUserProgramAccess(id).then(access => {
                        runInAction(() => {
                            this.editing_target_data.access = access
                        })
                    })
                }
            })

            runInAction(() => {
                Object.entries(result).forEach(([id, count]) => {
                    this.users[id].user_programs = count
                })
                this.applying_bulk_updates = false
            })
            this.onSaveSuccessHandler()
        }).catch(response => {
            runInAction(() => {
                this.applying_bulk_updates = false
            })
            this.onSaveErrorHandler()
        })
    }

    @action
    bulkRemovePrograms(removed_programs) {
        this.applying_bulk_updates = true
        api.bulkRemovePrograms(
            this.getSelectedBulkTargetIDs(),
            removed_programs.map(key => {
                const [country_id, program_id] = key.split('_')
                return {country: country_id, program: program_id, role: 'low'}
            })
        ).then(result => {
            //update open user programs
            const updated_users = this.getSelectedBulkTargetIDs()
            updated_users.forEach(id => {
                if(this.editing_target == id) {
                    api.fetchUserProgramAccess(id).then(access => {
                        runInAction(() => {
                            this.editing_target_data.access = access
                        })
                    })
                }
            })

            runInAction(() => {
                Object.entries(result).forEach(([id, count]) => {
                    this.users[id].user_programs = count
                })
                this.applying_bulk_updates = false
            })

            this.onSaveSuccessHandler()
        }).catch(response => {
            runInAction(() => {
                this.applying_bulk_updates = false
            })
            this.onSaveErrorHandler()
        })
    }

    @action
    clearFilters() {
        this.filters = {
            countries: [],
            base_countries: [],
            organizations: [],
            programs: [],
            user_status: '',
            admin_role: '',
            users: this.filters.users || []
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


/**
 * To manage a list of countries and regions being selected and unselected,
 * this takes region data and country data (including country.region) and makes a store that
 * handles selecting and unselecting regions and countries intelligently:
 *   - if all countries in a region are selected, that region becomes automatically selected
 *   - if one country from a selected region is unselected, that region is automatically unselected
 *   - selecting a region automatically selects all countries from that region
 *   - unselecteding a region automatically unselects all countries from that region
 */

export class CountryStore {
    @observable regions;
    @observable countries;
    @observable _selectedCountryIds;
    @observable _expandedCountryIds;

    constructor(regions, countries) {
        this.regions = regions;
        this.countries = countries;
        this._selectedCountryIds = [];
        this._expandedCountryIds = new Set([...Object.keys(this.countries).map(id => parseInt(id))]);
        this.nameSort = (objA, objB) => (objA.name.toUpperCase() < objB.name.toUpperCase()) ? -1 : 1;
    }

    @computed
    get orderedRegions() {
        return Object.values(this.regions || {})
            .map(region => ({
                id: region.id,
                name: gettext(region.name),
                countries: Object.values(this.countries)
                                 .filter(country => country.region == region.id)
                                 .sort(this.nameSort)
            }))
            .filter(region => region.countries.length > 0)
            .sort(this.nameSort);
    }

    @computed
    get groupedOptions() {
        // in the following possible options listing, "selectable: false" ensures the group heading
        // will not have a checkbox adjacent to it
        return [
            {
                // # Translators: a list of groups of countries (i.e. "Asia")
                label: gettext("Regions"),
                value: null,
                selectable: false,
                options: this.orderedRegions.map(region => ({label: region.name, value: `r-${region.id}`}))
            },
            ...this.orderedRegions.map(region => (
                {
                    label: region.name,
                    value: null,
                    divider: true,
                    options: region.countries.map(country => ({label: country.name, value: country.id}))
                }))
        ];
    }

    @computed
    get selectedCountries() {
        return this._selectedCountryIds.map(countryId => parseInt(countryId));
    }

    @computed
    get selectedOptions() {
        // in the following selected option listing, "nolist" prevents counting the option in the
        // "n selected" (i.e. "4 selected") display on the multiselect:
        const isSelected = (country) => this.selectedCountries.includes(country.id)
        return [
            ...this.orderedRegions.filter(region => region.countries.every(isSelected))
                                  .map(region => ({value: `r-${region.id}`, label: region.name, noList: true})),
            ...this.selectedCountries.map(countryId => (
            {label: this.countries[countryId].name, value: this.countries[countryId].id}
        ))];
    }

    isExpanded(countryId) {
        return this._expandedCountryIds.has(parseInt(countryId));
    }

    @action
    toggleExpanded(countryId) {
        if (this._expandedCountryIds.has(parseInt(countryId))) {
            this._expandedCountryIds.delete(parseInt(countryId));
        } else {
            this._expandedCountryIds.add(parseInt(countryId));
        }
    }

    @action
    setExpanded(countryId) {
        this._expandedCountryIds.add(parseInt(countryId));
    }

    @action
    removeRegion(regionId) {
        let countryIds = Object.values(this.countries).filter(country => country.region == regionId)
                                .map(country => country.id);
        this._selectedCountryIds = this._selectedCountryIds.filter(id => !countryIds.includes(id));
    }

    @action
    addRegion(regionId) {
        let countryIds = Object.values(this.countries).filter(country => country.region == regionId)
                                .map(country => country.id);
        this._selectedCountryIds = [...new Set([...this._selectedCountryIds, ...countryIds])];
    }

    @action
    removeCountry(countryId) {
        this._selectedCountryIds = this._selectedCountryIds.filter(id => id !== countryId);
        this._expandedCountryIds.delete(parseInt(countryId))
    }

    @action
    addCountry(countryId) {
        this._selectedCountryIds = [...new Set([...this._selectedCountryIds, countryId])];
        this._expandedCountryIds.add(parseInt(countryId));
    }

    @action
    updateSelected(selected) {
        if (selected.length == 0) {
            // selection is cleared
            this._selectedCountryIds = [];
            this._expandedCountryIds = new Set([...Object.keys(this.countries).map(id => parseInt(id))]);
        }
        else if (selected.length < this.selectedOptions.length) {
            // user removed items
            const unSelected = (option) => !selected.map(option => option.value).includes(option.value);
            let missingOptions = this.selectedOptions.filter(unSelected);
            missingOptions.forEach(option => {
                if (option.value && `${option.value}`.includes('r')) {
                    this.removeRegion(option.value.slice(2));
                } else if (option.value) {
                    this.removeCountry(option.value);
                }
            });
            if (this.selectedOptions.length == 0) {
               // expand all countries (no selection means all expanded:)
               this._expandedCountryIds = new Set([...Object.keys(this.countries).map(id => parseInt(id))]);
            }
        } else {
            // user added items
            if (this.selectedOptions.length == 0) {
                this._expandedCountryIds = new Set([]);
            }
            const notYetSelected = (option) => !this.selectedOptions.map(option => option.value).includes(option.value);
            let addedOptions = selected.filter(notYetSelected);
            addedOptions.forEach(option => {
                if (option.value && `${option.value}`.includes('r')) {
                    this.addRegion(option.value.slice(2));
                } else if (option.value) {
                    this.addCountry(option.value);
                }
            });
        }
    }
}
