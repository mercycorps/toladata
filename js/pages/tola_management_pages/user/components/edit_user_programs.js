import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import {AutoSizer, Table, Column, CellMeasurer, CellMeasurerCache} from 'react-virtualized';
import { CountryStore } from '../models';
import CheckboxedMultiSelect from 'components/checkboxed-multi-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// # Translators: an option in a list of country-level access settings, indicating no default access to the country's programs, but individually set access to individual programs within
const INDIVIDUAL_PROGRAM_ACCESS = gettext('Individual programs only');

// # Translators: An option for access level to a program, when no access is granted
const NO_ACCESS = gettext('No access');

//we need a pretty peculiar structure to accommodate the virtualized table
const create_country_objects = (countries, store) => Object.entries(countries)
                                                    .reduce((countries, [id, country]) => ({
                                                        ...countries,
                                                        [id]: {
                                                            ...country,
                                                            type: 'country',
                                                            options: [{label: INDIVIDUAL_PROGRAM_ACCESS, value: 'none'}, ...store.country_role_choices],
                                                            admin_access: store.is_superuser,
                                                            programs: new Set(country.programs)
                                                        }
                                                    }),{})

// generates the programs objects for the virtualized table, with appropriate menu options
const create_program_objects = (programs, store) => {
    // first get a list of programs to which the user has country-level access to:
    const programsWithCountryAccess = Object.entries(store.editing_target_data.access.countries)
            // only count objects with 'user' or 'basic_admin' access (should be only options, this is future-proofing)
            .filter(([countryId, country]) => country.role == 'basic_admin' || country.role == 'user')
            // filter out any that aren't in the country store for whatever reason (bug catcher)
            .filter(([countryId, country]) => store.countries[countryId])
            // just get the programs list for each country:
            .map(([countryId, country]) => store.countries[countryId].programs)
            .flat();
    return Object.entries(programs)
        .reduce((programs, [id, program]) => ({
            ...programs,
            [id]: {
                ...program,
                type: 'program',
                options: (programsWithCountryAccess.includes(parseInt(id)) ?
                            // if given country level access, do not include "no access" choice:
                            [...store.program_role_choices] :
                            // otherwise "no access" is a choice:
                            [{label: NO_ACCESS, value: 'none'}, ...store.program_role_choices]),
            }
        }),{});
}

/**
 * This function returns countries and programs as a flat ordered list as they will be displayed in the virtualized table.
 *
 * @param {Object[]} countries - the country objects created by create_country_objects (with program info)
 * @param {Object[]} programs - the program objects created by create_program_objects (with user role info)
 * @param {@callback} isExpanded - The callback which determines if a given country ID should be expanded, incorporating
 *                                filter states and previous user toggles
 * @returns {Object[]} - the countries and programs as rowData for the virtualized table
 */
const flattened_listing = (countries, programs, isExpanded) => countries.flatMap(country => //flatMap to return a flattened list
                                                        [
                                                            country, // country object itself displays, followed by programs
                                                            ...(isExpanded(country.id) ? Array.from(country.programs) //only show programs if country is expanded
                                                                .filter(program_id => programs[program_id]) // don't include programs we don't have information for (filtered out)
                                                                .map(program_id => ({...programs[program_id], id: `${country.id}_${program_id}`, country_id: country.id})) : [])
                                                        ]
                                                    )

const apply_program_filter = (programs, countries, filter_string) => {
    if(!filter_string) {
        return {
            programs,
            countries
        }
    }
    const filtered_programs = Object.entries(programs).filter(([_, program]) => program.name.toLowerCase().includes(filter_string.toLowerCase())).map(([_, p]) => p)
    const filtered_countries = Object.entries(countries).filter(([_, country]) => filtered_programs.some(program => country.programs.has(program.id))).map(([_, c]) => c)

    return {
        countries: filtered_countries.reduce((countries, country) => ({...countries, [country.id]: country}), {}),
        programs: filtered_programs.reduce((programs, program) => ({...programs, [program.id]: program}), {}),
    }
}

const apply_country_filter = (countries, filtered) => {
    if(filtered.length > 0) {
        return filtered.filter(id => countries[id])
                       .map(id => countries[id])
                       .reduce((countries, country) => ({...countries, [country.id]: country}), {})
    } else {
        return countries
    }
}

const create_user_access = (user_access) => ({
    countries: Object.entries(user_access.countries).reduce((countries, [id, country]) => ({...countries, [id]: {...country, has_access: true}}), {}),
    programs: user_access.programs.reduce((programs, program) => ({...programs, [`${program.country}_${program.program}`]: {...program, has_access: true}}), {})
})

const country_has_all_access = (country, visible_programs, user_program_access) =>
    Array.from(country.programs)
            .filter(program_id => !!visible_programs[program_id])
            .every(program_id =>
                user_program_access.programs[`${country.id}_${program_id}`]
                && user_program_access.programs[`${country.id}_${program_id}`].has_access
            )

@observer
export default class EditUserPrograms extends React.Component {

    constructor(props) {
        super(props)
        const {store} = props

        const countries = create_country_objects(store.countries, store)
        this.countryStore = new CountryStore(store.regions, store.countries);

        const programs = create_program_objects(store.programs, store)
        // callback for determining if a country is expanded based on filter state (initial program filter of ''):
        const isExpanded = this.isExpanded.bind(this, '');
        this.state = {
            program_filter: '',
            countries,
            programs,
            filtered_countries: countries,
            filtered_programs: programs,
            ordered_country_ids: store.ordered_country_ids,
            flattened_programs: flattened_listing(store.ordered_country_ids.filter(id => id in countries).map(id => countries[id]), programs, isExpanded),
            original_user_program_access: create_user_access(store.editing_target_data.access),
            user_program_access: create_user_access(store.editing_target_data.access)
        }
    }


    saveForm() {
        //marshal the data back into the format we received it
        //filtering out all !has_access
        const access = this.state.user_program_access
        this.props.onSave({
            countries: Object.entries(access.countries)
                             .filter(([_, country]) => this.props.store.is_superuser)
                             .filter(([_, country]) => country.has_access)
                             .reduce((countries, [id, country]) => ({...countries, [id]: country}), {}),
            programs: Object.entries(access.programs)
                            .filter(([_, program]) => program.has_access)
                            .map(([_, program]) => program)
        })
        this.hasUnsavedDataAction()
    }

    hasUnsavedDataAction() {
        const access = {
            countries: Object.entries(this.state.user_program_access.countries).filter(([_, country]) => country.has_access).reduce((countries, [id, country]) => ({...countries, [id]: country}), {}),
            programs: Object.entries(this.state.user_program_access.programs).filter(([_, program]) => program.has_access).reduce((programs, [id, program]) => ({...programs, [id]: program}), {})
        }
        this.props.onIsDirtyChange(JSON.stringify(access) != JSON.stringify(this.state.original_user_program_access))
    }

    resetForm() {
        this.setState({
            user_program_access: {
                countries: {...this.state.original_user_program_access.countries},
                programs: {...this.state.original_user_program_access.programs}
            }
        }, () => this.hasUnsavedDataAction())


    }

    toggleProgramAccess(program_key) {
        const current_program_access = this.state.user_program_access.programs
        console.log(current_program_access[program_key]);
        const updated_program_access = (() => {
            if(current_program_access[program_key] && current_program_access[program_key].has_access) {
                // user has had their access removed, set the role to "none":
                return {...current_program_access[program_key], role: 'none', has_access: false};
            } else if (current_program_access[program_key] && current_program_access[program_key].role === 'none') {
                // user has had their access instated, assume default initial role of low:
                return {...current_program_access[program_key], role: 'low', has_access: true};
            } else if (current_program_access[program_key]) {
                // this state should be unreachable, but this was the default before the above modifications and will present
                // slightly unexpected but not buggy/crashing behavior in case this state is reachable by some combination of actions:
                return {...current_program_access[program_key], has_access: !(current_program_access[program_key].has_access)};
            } else {
                //TODO: want to find a more resilient way to handle a compound key
                const [country, program] = program_key.split('_');
                return {country, program, role: 'low', has_access: true};
            }
        })()

        this.setState({
            user_program_access: {
                ...this.state.user_program_access,
                programs: {
                    ...current_program_access,
                    [program_key]: updated_program_access
                }
            }
        }, () => this.hasUnsavedDataAction())
    }

    toggleAllProgramsForCountry(country_id) {
        const country = this.state.countries[country_id]

        const new_program_access = (() => {
            const country_has_all_checked = country_has_all_access(
                country,
                this.state.filtered_programs,
                this.state.user_program_access
            )

            if(country_has_all_checked) {
                //toggle all off
                return Array.from(country.programs).filter(program_id => {
                    return !!this.state.filtered_programs[program_id]
                }).reduce((programs, program_id) => {
                    const program_key = `${country.id}_${program_id}`
                    const program = this.state.user_program_access.programs[program_key]
                    if(program) {
                        return {...programs, [program_key]: {...program, has_access: false}}
                    } else {
                        return programs
                    }
                }, {})
            } else {
                //toggle all on
                return Array.from(country.programs).filter(program_id => {
                    return !!this.state.filtered_programs[program_id]
                }).reduce((programs, program_id) => {
                    const program_key = `${country.id}_${program_id}`
                    const program = this.state.user_program_access.programs[program_key]
                    if(program) {
                        return {...programs, [program_key]: {...program, has_access: true}}
                    } else {
                        return {...programs, [program_key]: {program: program_id, country: country.id, role: 'low', has_access: true}}
                    }
                }, {})
            }
        })()
        this.setState({
            user_program_access: {
                ...this.state.user_program_access,
                programs: {...this.state.user_program_access.programs, ...new_program_access}
            }
        }, () => this.hasUnsavedDataAction())

    }

    changeCountryRole(country_id, new_val) {
        // user's country-level permissions have changed, first update the country access (actual DB value to be changed):
        const country = {...this.state.user_program_access.countries[country_id]}
        const new_country_access = (() => {
            if(new_val != 'none') {
                return {...country, role: new_val, has_access: true}
            } else {
                return {...country, role: new_val, has_access: false}
            }
        })()
        // using the form of setstate that receives the previous state/props as an argument, as we need
        // to update the programs (based on current state programs list and new country value)
        this.setState((state, props) => {
            // this is a reference to the _old_ state programs, so it's safe to modify:
            let statePrograms = state.programs;
            state.countries[country_id].programs.forEach(programId =>
            // for each program in this country, set the options
            statePrograms[programId].options = new_val == 'none' ?
                // if no country level access, NO ACCESS is an option:
                [{label: NO_ACCESS, value: 'none'}, ...props.store.program_role_choices] :
                // if country level access, just the base program role choices:
                [...props.store.program_role_choices]
            );
            // re-apply unchanged filter (to avoid clearing filter results):
            const {countries, programs} = apply_program_filter(
                statePrograms,
                state.filtered_countries,
                state.program_filter
            );
            const isExpanded = this.isExpanded.bind(this, state.program_filter);
            return {
                user_program_access: {
                    ...this.state.user_program_access,
                    countries: {
                        ...this.state.user_program_access.countries,
                        [country_id]: new_country_access
                    }
                },
                filtered_programs: programs,
                flattened_programs: flattened_listing(state.ordered_country_ids.filter(id => id in countries).map(id => countries[id]), programs, isExpanded)
            };

        }, () => this.hasUnsavedDataAction());
    }

    changeProgramRole(program_key, new_val) {
        const [country_id, program_id] = program_key.split('_')
        const access = this.state.user_program_access
        const new_program_access = (() => {
            if(access[country_id] && access[country_id].has_access && new_val == 'none') {
                return {
                    program: program_id,
                    country: country_id,
                    role: new_val,
                    has_access: false
                }
            } else {
                return {
                    program: program_id,
                    country: country_id,
                    role: new_val,
                    has_access: !(new_val === 'none')
                }
            }
        })()

        this.setState({
            user_program_access: {
                ...this.state.user_program_access,
                programs: {
                    ...this.state.user_program_access.programs,
                    [program_key]: new_program_access
                }
            }
        }, () => this.hasUnsavedDataAction())

    }


    clearFilter() {
        const val = ''
        const filtered_countries = apply_country_filter(this.state.countries, this.countryStore.selectedCountries)
        const {countries, programs} = apply_program_filter(
            this.state.programs,
            filtered_countries,
            val
        )

        // callback for determining if a country is expanded based on filter state:
        const isExpanded = this.isExpanded.bind(this, val);
        this.setState({
            program_filter: val,
            filtered_programs: programs,
            filtered_countries: countries,
            flattened_programs: flattened_listing(this.state.ordered_country_ids.filter(id => id in countries).map(id => countries[id]), programs, isExpanded),
        })
    }

    updateProgramFilter(val) {
        const filtered_countries = apply_country_filter(this.state.countries, this.countryStore.selectedCountries)
        const {countries, programs} = apply_program_filter(
            this.state.programs,
            filtered_countries,
            val
        )

        // callback for determining if a country is expanded based on filter state:
        const isExpanded = this.isExpanded.bind(this, val);

        this.setState({
            program_filter: val,
            filtered_programs: programs,
            filtered_countries: countries,
            flattened_programs: flattened_listing(this.state.ordered_country_ids.filter(id => id in countries).map(id => countries[id]), programs, isExpanded),
        })
    }

    changeCountryFilter(e) {
        this.countryStore.updateSelected(e);
        const filtered_countries = apply_country_filter(this.state.countries, this.countryStore.selectedCountries, true)
        const {countries, programs} = apply_program_filter(
            this.state.programs,
            filtered_countries,
            this.state.program_filter
        )

        // callback for determining if a country is expanded based on filter state:
        const isExpanded = this.isExpanded.bind(this, this.state.program_filter);

        this.setState({
            filtered_countries: countries,
            flattened_programs: flattened_listing(this.state.ordered_country_ids.filter(id => id in countries).map(id => countries[id]), this.state.filtered_programs, isExpanded),
        })
    }

    toggleCountryExpanded(id) {
        this.countryStore.toggleExpanded(id);
        const filtered_countries = apply_country_filter(this.state.countries, this.countryStore.selectedCountries);
        const {countries, programs} = apply_program_filter(
            this.state.programs,
            filtered_countries,
            this.state.program_filter
        )
        // callback for determining if a country is expanded based on filter state:
        const isExpanded = this.isExpanded.bind(this, this.state.program_filter);

        this.setState({
            filtered_countries: countries,
            flattened_programs: flattened_listing(this.state.ordered_country_ids.filter(id => id in countries).map(id => countries[id]), this.state.filtered_programs, isExpanded),
        });
    }

    isExpanded(program_filter, countryId) {
        // when bound with this and program_filter state (a string), and called with country ID, returns true if country should be expanded
        if (program_filter && program_filter.length > 0) {
            // all countries left showing given a program filter should be expanded to show the programs filtered to
            return true;
        }
        // countryStore tracks toggling of expanded/collapsed state
        return this.countryStore.isExpanded(countryId);
    }

    render() {
        const {user, onSave} = this.props

        const is_checked = (data) => {
            // consumes rowData, returns whether editor "has access?" checkbox should be checked:
            const access = this.state.user_program_access
            if(data.type == 'country') {
                // country access checkbox (not currently used):
                return (access.countries[data.id] && access.countries[data.id].has_access) || false
            } else {
                // program access checkbox:
                if (this.state.user_program_access.countries?.[data.country_id]?.has_access) {
                    // if the user has access to the country level, they have access to the program:
                    return true
                }
                // otherwise if the user has access to the program directly:
                return access.programs?.[data.id]?.has_access || false
            }
        }

        const is_check_disabled = (data) => {
            // consumes rowData, returns whether editor "has access?" checkbox should be disabled:
            if(data.type == 'country') {
                // country "checkbox" is now a select all button, so disable if there are no programs to select:
                return !(this.state.countries[data.id].programs.size > 0)
                    // or the operating user is not a basic admin for this country:
                    || 'basic_admin' != this.props.store.access.countries?.[data.id]?.role
                    // or the user has access to the country level (cannot select all if all already selected)
                    || this.state.user_program_access.countries?.[data.id]?.has_access
            } else {
                // program access checkbox:
                if(this.state.user_program_access.countries?.[data.country_id]?.has_access) {
                    return true
                }
                return 'basic_admin' != this.props.store.access.countries?.[data.country_id]?.role;
            }
        }

        const is_role_disabled = (data) => {
            // consumes rowData, returns whether row-selector is disabled
            if(data.type == 'country') {
                // country role (none = individual programs only, user or admin) can only be modified
                // by a superuser:
                return !this.props.store.is_superuser
            } else {
                // program access role dropdown
                return (
                    // if the operating user (not the user being modified) does not have access to the
                    // country or their access isn't 'basic_admin' then the checkbox cannot be
                    // modified by this user
                    !this.props.store.access.countries[data.country_id]
                    || this.props.store.access.countries[data.country_id].role != 'basic_admin'
                )
            }
        }

        const get_role = (data) => {
            // consumes rowData, returns the role currently assigned to a user (for role dropdown)
            if(data.type == 'country') {
                // country role dropdown ('none' = individual programs only, 'user', or 'basic_admin')
                const country_access = this.state.user_program_access.countries
                if(!country_access[data.id]) {
                    // none is the default (if they have no access) displays as "individual programs only"
                    return 'none'
                } else {
                    return country_access[data.id].role
                }
            } else {
                // program role dropdown

                const program_access = this.state.user_program_access.programs
                if(!program_access[data.id]) {
                    // if no access, show "No Access" option:
                    return 'none';
                } else {
                    return program_access[data.id].role
                }
            }
        }

        return (
            <div className="tab-pane--react edit-user-programs">
                <h2 className="no-bold">{user.name?user.name+': ':''}{gettext("Programs and Roles")}
                <sup>   <a target="_blank" href="https://learn.mercycorps.org/index.php/TOLA:Section_05/en#5.4_User_Roles_Matrix_.28Program_Permissions.29">
                        <i aria-label={
                            // # Translators: link to learn more about permissions-granting roles a user can be assigned
                            gettext('More information on Program Roles')} className="far fa-question-circle" />
                </a></sup></h2>

                <div className="edit-user-programs__filter-form">
                    <div className="edit-user-programs__country-filter form-group react-multiselect-checkbox">
                        <CheckboxedMultiSelect placeholder={
                            // # Translators: This is placeholder text on a dropdown of countries which limit the displayed programs
                            gettext("Filter countries")} isMulti={true} value={this.countryStore.selectedOptions} options={this.countryStore.groupedOptions} onChange={(e) => this.changeCountryFilter(e)} />
                    </div>
                    <div className="form-group edit-user-programs__program-filter">
                        <div className="input-group">
                            <input placeholder={
                                // # Translators: this is placeholder text on a dropdown of programs which limit the displayed results
                                gettext("Filter programs")} type="text" value={this.state.program_filter} className="form-control" onChange={(e) => this.updateProgramFilter(e.target.value)} />
                            <div className="input-group-append">
                                <a onClick={(e) => {e.preventDefault(); this.clearFilter()}}>
                                    <span className="input-group-text"><i className="fa fa-times-circle"></i></span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="virtualized-table__wrapper">
                    <AutoSizer>
                        {({height, width}) =>
                            <Table
                            height={height}
                            headerHeight={50}
                            width={width}
                            rowGetter={({index}) => this.state.flattened_programs[index]}
                            rowHeight={50}
                            rowCount={this.state.flattened_programs.length}>

                                <Column
                                dataKey="not_applicable_but_required"
                                label={
                                    /* # Translators: Column header for a checkbox indicating if a user has access to a program */
                                    gettext("Has access?")
                                }
                                width={100}
                                cellDataGetter={({rowData}) => ({
                                    checked: is_checked(rowData),
                                    disabled: is_check_disabled(rowData),
                                    id: rowData.id,
                                    type: rowData.type,
                                    expanded: (rowData.type == "country") ? this.state.program_filter || this.countryStore.isExpanded(rowData.id) : false,
                                    programsCount: (rowData.type == "country") ? rowData.programs.size : null,
                                    action: (rowData.type == "country")?this.toggleAllProgramsForCountry.bind(this):this.toggleProgramAccess.bind(this)
                                })}
                                cellRenderer={({cellData}) => {
                                    if (cellData.type == 'country') {
                                        const country_has_all_checked = country_has_all_access(
                                            this.state.countries[cellData.id],
                                            this.state.filtered_programs,
                                            this.state.user_program_access
                                        )
                                        const button_label = (country_has_all_checked)?gettext('Deselect All'):gettext('Select All')
                                        const selectAllButton = (cellData.disabled || !cellData.expanded) ? null : <a className="edit-user-programs__select-all" onClick={(e) => cellData.action(cellData.id)}>{button_label}</a>
                                        return <div className="check-column">{selectAllButton}</div>;
                                    } else {
                                        return <div className="check-column"><input type="checkbox" checked={cellData.checked} disabled={cellData.disabled} onChange={() => cellData.action(cellData.id)} /></div>
                                    }
                                }}/>

                                <Column
                                dataKey="not_applicable_but_required"
                                label={gettext("Countries and Programs")}
                                width={200}
                                flexGrow={2}
                                className='pl-0'
                                cellDataGetter={({rowData}) => ({
                                    expanded: (rowData.type == "country") ? this.state.program_filter || this.countryStore.isExpanded(rowData.id) : false,
                                    programsCount: (rowData.type == "country") ? rowData.programs.size : null,
                                    expandoAction: (rowData.type == "country") ? this.toggleCountryExpanded.bind(this, rowData.id):null,
                                    bold: rowData.type == "country", name: rowData.name
                                })}
                                cellRenderer={({cellData}) => {
                                    if(cellData.bold) {
                                        const expandoIcon = cellData.programsCount ? <FontAwesomeIcon icon={ cellData.expanded ? 'caret-down' : 'caret-right' } /> : null;
                                        const nameCellInner = <React.Fragment><div className="expando-toggle__icon">{ expandoIcon }</div><div className="expando-toggle__label"><strong>{cellData.name}</strong></div></React.Fragment>
                                        if (cellData.programsCount) {
                                            return <div className="edit-user-programs__expando expando-toggle icon__clickable" onClick={cellData.expandoAction}>{ nameCellInner }</div>;
                                        } else {
                                            return <div className="edit-user-programs__expando expando-toggle">{ nameCellInner }</div>;
                                        }
                                    } else {
                                        return <span>{cellData.name}</span>
                                    }
                                }} />

                                <Column
                                width={100}
                                flexGrow={1}
                                className='pl-0'
                                dataKey="not_applicable_but_required"
                                label={gettext("Roles and Permissions")}
                                cellDataGetter={({rowData}) => ({
                                    id: rowData.id,
                                    disabled: is_role_disabled(rowData),
                                    type: rowData.type,
                                    options: rowData.options,
                                    action: (rowData.type == "country")?this.changeCountryRole.bind(this):this.changeProgramRole.bind(this)
                                })}
                                cellRenderer={({cellData}) =>
                                    <select
                                    disabled={cellData.disabled}
                                    value={get_role(cellData)}
                                    onChange={(e) => cellData.action(cellData.id, e.target.value)}>
                                        {cellData.options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                                    </select>
                                }/>

                            </Table>
                        }
                    </AutoSizer>
                </div>

                <div className="form-group btn-row">
                    <button type="button" className="btn btn-primary" onClick={() => this.saveForm()}>Save Changes</button>
                    <button type="button" className="btn btn-reset" onClick={() => this.resetForm()}>Reset</button>
                </div>

            </div>
        )
    }
}
