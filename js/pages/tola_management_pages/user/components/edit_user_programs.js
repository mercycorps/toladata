import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import {AutoSizer, Table, Column, CellMeasurer, CellMeasurerCache} from 'react-virtualized';
import { CountryStore } from '../models';
import CheckboxedMultiSelect from 'components/checkboxed-multi-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



//we need a pretty peculiar structure to accommodate the virtualized table
const create_country_objects = (countries, store) => Object.entries(countries)
                                                    .reduce((countries, [id, country]) => ({
                                                        ...countries,
                                                        [id]: {
                                                            ...country,
                                                            type: 'country',
                                                            options: [{label: gettext('Individual programs only'), value: 'none'}, ...store.country_role_choices],
                                                            admin_access: store.is_superuser,
                                                            programs: new Set(country.programs),
                                                            expanded: true
                                                        }
                                                    }),{})

const create_program_objects = (programs, store) => Object.entries(programs)
                                                           .reduce((programs, [id, program]) => ({
                                                               ...programs,
                                                               [id]: {
                                                                   ...program,
                                                                   type: 'program',
                                                                   options: store.program_role_choices,
                                                               }
                                                           }),{})

//we need to flatten the country -> program heirarchy to support the virtualized table
const flattened_listing = (countries, programs) => countries.flatMap(country =>
                                                        [
                                                            country,
                                                            ...(country.expanded ? Array.from(country.programs)
                                                                .filter(program_id => programs[program_id])
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
        const programs = create_program_objects(store.programs, store)
        this.countryStore = new CountryStore(store.regions, store.countries);
        
        this.state = {
            program_filter: '',
            countries,
            programs,
            filtered_countries: countries,
            filtered_programs: programs,
            ordered_country_ids: store.ordered_country_ids,
            flattened_programs: flattened_listing(store.ordered_country_ids.filter(id => id in countries).map(id => countries[id]), programs),
            original_user_program_access: create_user_access(store.editing_target_data.access),
            user_program_access: create_user_access(store.editing_target_data.access)
        }
    }

    componentWillReceiveProps(next_props) {
        const {store} = next_props
        const countries_obj = create_country_objects(store.countries, store)
        const programs_obj = create_program_objects(store.programs, store)
    
        const filtered_countries = apply_country_filter(
            countries_obj,
            this.countryStore.selectedCountries
        )

        const {countries, programs}= apply_program_filter(
            programs_obj,
            filtered_countries,
            this.state.program_filter
        )


        this.setState({
            countries: countries_obj,
            programs: programs_obj,
            filtered_countries: countries,
            filtered_programs: programs,
            ordered_country_ids: store.ordered_country_ids,
            flattened_programs: flattened_listing(store.ordered_country_ids.filter(id => id in countries).map(id => countries[id]), programs),
            original_user_program_access: create_user_access(store.editing_target_data.access),
            user_program_access: create_user_access(store.editing_target_data.access)
        }, () => this.hasUnsavedDataAction())
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
        const updated_program_access = (() => {
            if(current_program_access[program_key]) {
                return {...current_program_access[program_key], has_access: !current_program_access[program_key].has_access}
            } else {
                //TODO: want to find a more resilient way to handle a compound key
                const [country, program] = program_key.split('_')
                return {country, program, role: 'low', has_access: true}
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
        const country = {...this.state.user_program_access.countries[country_id]}
        const new_country_access = (() => {
            if(new_val != 'none') {
                return {...country, role: new_val, has_access: true}
            } else {
                return {...country, role: new_val, has_access: false}
            }
        })()

        this.setState({
            user_program_access: {
                ...this.state.user_program_access,
                countries: {
                    ...this.state.user_program_access.countries,
                    [country_id]: new_country_access
                }
            },
        }, () => this.hasUnsavedDataAction())

    }

    changeProgramRole(program_key, new_val) {
        const [country_id, program_id] = program_key.split('_')
        const access = this.state.user_program_access


        const new_program_access = (() => {
            if(access[country_id] && access[country_id].has_access && new_val == 'low') {
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
                    has_access: true
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

        this.setState({
            program_filter: val,
            filtered_programs: programs,
            filtered_countries: countries,
            flattened_programs: flattened_listing(this.state.ordered_country_ids.filter(id => id in countries).map(id => countries[id]), programs),
        })
    }

    updateProgramFilter(val) {
        const filtered_countries = apply_country_filter(this.state.countries, this.countryStore.selectedCountries)
        const {countries, programs} = apply_program_filter(
            this.state.programs,
            filtered_countries,
            val
        )

        this.setState({
            program_filter: val,
            filtered_programs: programs,
            filtered_countries: countries,
            flattened_programs: flattened_listing(this.state.ordered_country_ids.filter(id => id in countries).map(id => countries[id]), programs),
        })
    }

    changeCountryFilter(e) {
        this.countryStore.updateSelected(e);
        const filtered_countries = apply_country_filter(this.state.countries, this.countryStore.selectedCountries)
        
        const {countries, programs} = apply_program_filter(
            this.state.programs,
            filtered_countries,
            this.state.program_filter
        )

        this.setState({
            filtered_countries: countries,
            flattened_programs: flattened_listing(this.state.ordered_country_ids.filter(id => id in countries).map(id => countries[id]), this.state.filtered_programs),
        })
    }

    toggleCountryExpanded(id) {
        let updatedCountries = Object.assign({}, this.state.countries);
        updatedCountries[id].expanded = !updatedCountries[id].expanded;
        const filtered_countries = apply_country_filter(updatedCountries, this.countryStore.selectedCountries);
        const {countries, programs} = apply_program_filter(
            this.state.programs,
            filtered_countries,
            this.state.program_filter
        )

        this.setState({
            countries: updatedCountries,
            filtered_countries: countries,
            flattened_programs: flattened_listing(this.state.ordered_country_ids.filter(id => id in countries).map(id => countries[id]), this.state.filtered_programs),
        });
    }

    render() {
        const {user, onSave} = this.props

        const is_checked = (data) => {
            const access = this.state.user_program_access
            if(data.type == 'country') {
                return (access.countries[data.id] && access.countries[data.id].has_access) || false
            } else {
                if(this.state.user_program_access.countries[data.country_id] && this.state.user_program_access.countries[data.country_id].has_access) {
                    return true
                }
                return (access.programs[data.id] && access.programs[data.id].has_access) || false
            }
        }

        const is_check_disabled = (data) => {
            if(data.type == 'country') {
                return !(this.state.countries[data.id].programs.size > 0)
                    || !(
                        this.props.store.access.countries[data.id]
                        && this.props.store.access.countries[data.id].role == 'basic_admin'
                    )
                    || (
                        this.state.user_program_access.countries[data.id]
                        && this.state.user_program_access.countries[data.id].has_access
                    )

            } else {
                if(this.state.user_program_access.countries[data.country_id] && this.state.user_program_access.countries[data.country_id].has_access) {
                    return true
                }
                return !this.props.store.access.countries[data.country_id] || this.props.store.access.countries[data.country_id].role != 'basic_admin'
            }
        }

        const is_role_disabled = (data) => {
            if(data.type == 'country') {
                return !this.props.store.is_superuser
            } else {
                return (
                    !this.props.store.access.countries[data.country_id]
                    || this.props.store.access.countries[data.country_id].role != 'basic_admin'
                    || (
                        !(
                            this.state.user_program_access.programs[data.id]
                            && this.state.user_program_access.programs[data.id].has_access
                        ) && !(
                            this.state.user_program_access.countries[data.country_id]
                            && this.state.user_program_access.countries[data.country_id].has_access
                        )
                    )
                )
            }
        }

        const get_role = (data) => {
            if(data.type == 'country') {
                const country_access = this.state.user_program_access.countries
                if(!country_access[data.id]) {
                    return 'none'
                } else {
                    return country_access[data.id].role
                }
            } else {
                const program_access = this.state.user_program_access.programs
                if(!program_access[data.id]) {
                    return this.props.store.program_role_choices[0].value
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
                                    expanded: (rowData.type == "country") ? rowData.expanded : false,
                                    programsCount: (rowData.type == "country") ? rowData.programs.size : null,
                                    expandoAction: (rowData.type == "country") ? this.toggleCountryExpanded.bind(this, rowData.id):null,
                                    action: (rowData.type == "country")?this.toggleAllProgramsForCountry.bind(this):this.toggleProgramAccess.bind(this)
                                })}
                                cellRenderer={({cellData}) => {
                                    if (cellData.type == 'country') {
                                        const country_has_all_checked = country_has_all_access(
                                            this.state.countries[cellData.id],
                                            this.state.filtered_programs,
                                            this.state.user_program_access
                                        )
                                        const expandoIcon = cellData.expanded ? 'caret-down' : 'caret-right';
                                        const expandoButton = cellData.programsCount ? <a className="edit-user-programs__expando"><FontAwesomeIcon icon={expandoIcon} onClick={cellData.expandoAction}/></a> : null;
                                        const button_label = (country_has_all_checked)?gettext('Deselect All'):gettext('Select All')
                                        const selectAllButton = cellData.disabled ? null : <a className="edit-user-programs__select-all" onClick={(e) => cellData.action(cellData.id)}>{button_label}</a>
                                        return <div className="check-column">{expandoButton}{selectAllButton}</div>;
                                    } else {
                                        return <div className="check-column"><input type="checkbox" checked={cellData.checked} disabled={cellData.disabled} onChange={() => cellData.action(cellData.id)} /></div>
                                    }
                                }}/>

                                <Column
                                dataKey="not_applicable_but_required"
                                label={gettext("Countries and Programs")}
                                width={200}
                                flexGrow={2}
                                cellDataGetter={({rowData}) => ({bold: rowData.type == "country", name: rowData.name})}
                                cellRenderer={({cellData}) => {
                                    if(cellData.bold) {
                                        return <strong>{cellData.name}</strong>
                                    } else {
                                        return <span>{cellData.name}</span>
                                    }
                                }} />

                                <Column
                                width={100}
                                flexGrow={1}
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
