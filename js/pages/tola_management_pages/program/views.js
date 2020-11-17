import React from 'react'
import { observer } from "mobx-react"
import Select from 'react-select'
import CheckboxedMultiSelect from 'components/checkboxed-multi-select'
import ManagementTable from 'components/management-table'
import Pagination from 'components/pagination'
import ProgramEditor from './components/program_editor'
import EditProgramProfile from './components/edit_program_profile'
import ProgramSettings from './components/program_settings'
import ProgramHistory from './components/program_history'
import LoadingSpinner from 'components/loading-spinner'
import FoldingSidebar from 'components/folding-sidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { sortObjectListByValue } from '../../../general_utilities'

const UserFilter = observer(({store, filterOptions}) => {
    return <div className="form-group react-multiselect-checkbox">
        <label htmlFor="users_filter">{gettext("Users")}</label>
        <CheckboxedMultiSelect
            value={store.filters.users}
            options={filterOptions}
            onChange={(e) => store.changeFilter('users', e)}
            placeholder={gettext("None Selected")}
            id="users_filter" />
    </div>
})

const CountryFilter = observer(({store, filterOptions}) => {
    return <div className="form-group react-multiselect-checkbox">
        <label htmlFor="countries_filter">{gettext("Countries")}</label>
        <CheckboxedMultiSelect
            value={store.filters.countries}
            options={filterOptions}
            onChange={(e) => store.changeFilter('countries', e)}
            placeholder={gettext("None Selected")}
            id="countries_filter" />
    </div>
})

const OrganizationFilter = observer(({store, filterOptions}) => {
    return <div className="form-group react-multiselect-checkbox">
        <label htmlFor="organizations_filter">{gettext("Organizations")}</label>
        <CheckboxedMultiSelect
            value={store.filters.organizations}
            options={filterOptions}
            onChange={(e) => store.changeFilter('organizations', e)}
            placeholder={gettext("None Selected")}
            id="organizations_filter" />
    </div>
})

const SectorFilter = observer(({store, filterOptions}) => {
    return <div className="form-group react-multiselect-checkbox">
        <label htmlFor="sector-filter">{gettext("Sectors")}</label>
        <CheckboxedMultiSelect
            value={store.filters.sectors}
            options={filterOptions}
            onChange={(e) => store.changeFilter('sectors', e)}
            placeholder={gettext("None Selected")}
            id="sector-filter" />
    </div>
})

const ProgramStatusFilter = observer(({store}) => {
    const statusFilterOptions = [
        {value: 'Active', label: gettext('Active')},
        {value: 'Inactive', label: gettext('Inactive')},
    ]
    return <div className="form-group">
        <label htmlFor="program-status-filter">{gettext("Status")}</label>
        <Select
            isMulti={false}
            value={store.filters.programStatus}
            options={statusFilterOptions}
            onChange={(e) => store.changeFilter('programStatus', e)}
            placeholder={gettext("None Selected")}
            id="program-status-filter" />
    </div>
})

const ProgramFilter = observer(({store, filterOptions}) => {
    return <div className="form-group react-multiselect-checkbox">
        <label htmlFor="programs-filter">{gettext("Find a Program")}</label>
        <CheckboxedMultiSelect
            value={store.filters.programs}
            options={filterOptions}
            onChange={(e) => store.changeFilter('programs', e)}
            placeholder={gettext("None Selected")}
            id="programs-filter" />
    </div>
})


class BulkActions extends React.Component {
    constructor(props) {
        super(props)
        this.active_child = React.createRef()
        this.state = {
            current_action: null,
            current_vals: []
        }
    }

    onActionChanged(new_action) {
        this.setState({
            current_action: new_action.value
        })
    }

    onChange(vals) {
        this.setState({
            current_vals: vals
        })
    }

    onApply() {
        const selected = this.props.secondaryOptions[this.state.current_action]
        if(selected) {
            selected.onApply(this.state.current_vals)
        }
    }

    render() {
        const selected = this.props.secondaryOptions[this.state.current_action]
        const SecondaryComponent = selected && selected.component
        return <div className="controls__bulk-actions">
            <div className="bulk__select">
                <Select
                placeholder={gettext("Bulk Actions")}
                value={this.props.primaryOptions.find((o) => o.value == this.state.current_action)}
                options={this.props.primaryOptions} onChange={(val) => this.onActionChanged(val)} />
            </div>
            {selected &&
            <div className="bulk__select">
                <SecondaryComponent placeholder={gettext("Select...")} value={this.state.current_vals} onChange={(vals) => this.onChange(vals)}/>
            </div>
            }
            {!selected &&
            <div className="bulk__select">
                <Select placeholder="---"  noOptionsMessage={() => gettext('No options')}/>
            </div>
            }
            <button className="btn btn-secondary" disabled={!this.state.current_action} onClick={() => this.onApply()}>{gettext("Apply")}</button>
        </div>
    }
}

export const IndexView = observer(
    ({store}) => {

        const allCountryOptions = sortObjectListByValue(Object.entries(store.allCountries).map(([id, country]) => ({value: country.id, label: country.name})))
        const countryFilterOptions = sortObjectListByValue(Object.entries(store.countries).map(([id, country]) => ({value: country.id, label: country.name})))
        const organizationFilterOptions = sortObjectListByValue(Object.entries(store.organizations).map(([id, org]) => ({value: org.id, label: org.name})))
        const sectorFilterOptions = sortObjectListByValue(store.sectors.map(x => ({value: x.id, label: x.name})))
        const programFilterOptions = sortObjectListByValue(Object.entries(store.programFilterPrograms).map(([id, program]) => ({value: program.id, label: program.name})))
        const userFilterOptions = sortObjectListByValue(Object.entries(store.users).map(([id, user]) => ({value: user.id, label: user.name})))
        const bulkProgramStatusOptions = [
            {value: 'Funded', label: gettext('Active')},
            {value: 'Completed', label: gettext('Inactive')},
        ]

        // See #1479 as to why this makes sense
        const fundingStatusDisplayStr = (funding_status_str) =>
            funding_status_str.toLowerCase() === 'funded' ? gettext('Active') : gettext('Inactive');

        const bulk_actions = {
            primary_options: [
                {label: gettext('Set program status'), value: 'set_program_status'},
            ],
            secondary_options: {
                set_program_status: {
                    component: (props) => <Select options={bulkProgramStatusOptions} {...props} />,
                    onApply: (option) => store.bulkUpdateProgramStatus(option.value)
                },
            }
        };

        const organizationColumn = (data) => {
            if (data.organizations) {
                return (
                    <a href={`/tola_management/organization/?programs[]=${data.id}`}>
                        <i className="fas fa-building"/>&nbsp;
                        { data.onlyOrganizationId ? store.organizations[data.onlyOrganizationId].name : `${data.organizations} organizations` }
                    </a>
                )
            }
            return "---"
        };

        return <div id="program-management-index-view" className="row">
            <FoldingSidebar>
                <div className="filter-section">
                    <CountryFilter store={store} filterOptions={countryFilterOptions} />
                    <UserFilter store={store} filterOptions={userFilterOptions} />
                    <OrganizationFilter store={store} filterOptions={organizationFilterOptions} />
                    <SectorFilter store={store} filterOptions={sectorFilterOptions} />
                    <ProgramStatusFilter store={store} />
                </div>
                <div className="filter-section filter-buttons">
                    <button className="btn btn-primary" onClick={() => store.applyFilters()}>{gettext("Apply")}</button>
                    <button className="btn btn-reset" onClick={() => store.clearFilters()}>{gettext("Reset")}</button>
                </div>
            </FoldingSidebar>
            <div className="col admin-list">
                <header className="page-title">
                    <h1>{gettext("Admin:")} <small>{gettext("Programs")}</small></h1>
                </header>
                <div className="admin-list__controls">
                    <BulkActions primaryOptions={bulk_actions.primary_options} secondaryOptions={bulk_actions.secondary_options}/>
                    <div className="controls__buttons">
                        <a href="#" className="btn btn-link btn-add" tabIndex="0" onClick={() => store.createProgram()}>
                            <i className="fas fa-plus-circle"/>{gettext("Add Program")}
                        </a>
                    </div>
                </div>
                <div className="admin-list__top-filter">
                    <ProgramFilter store={store} filterOptions={programFilterOptions} />
                </div>
                <LoadingSpinner isLoading={store.fetching_main_listing || store.applying_bulk_updates }>
                    <div className="admin-list__table">
                        <ManagementTable
                            newData={store.new_program}
                            data={store.programs}
                            keyField="id"
                            HeaderRow={({Col, Row}) =>
                                <Row>
                                    <Col size="0.5">
                                        <input type="checkbox" checked={store.bulk_targets_all} onChange={() => store.toggleBulkTargetsAll()}/>
                                    </Col>
                                    <Col size="2" className="td--stretch">{gettext("Program")}</Col>
                                    <Col>{gettext("Organizations")}</Col>
                                    <Col>{gettext("Users")}</Col>
                                    <Col>{gettext("Status")}</Col>
                                </Row>
                            }
                            Row={({Col, Row, data}) =>
                            <Row
                                expanded={data.id == store.editing_target}
                                Expando={observer(({Wrapper}) =>
                                    <Wrapper>
                                        <ProgramEditor
                                            new={data.id == 'new'}
                                            active_pane={store.active_editor_pane}
                                            notifyPaneChange={(new_pane) => store.onProfilePaneChange(new_pane)}
                                            ProfileSection={observer(() =>
                                                <LoadingSpinner isLoading={store.saving}>
                                                    <EditProgramProfile
                                                        onIsDirtyChange={is_dirty => store.setActiveFormIsDirty(is_dirty)}
                                                        new={data.id == 'new'}
                                                            program_data={data}
                                                            onUpdate={(id, data) => store.updateProgram(id, data)}
                                                            onCreate={(new_program_data) => store.saveNewProgram(new_program_data)}
                                                            sectorOptions={sectorFilterOptions}
                                                            countryOptions={allCountryOptions}
                                                            errors={store.editing_errors} />
                                                </LoadingSpinner>
                                            )}
                                            SettingsSection={observer(() =>
                                                <LoadingSpinner isLoading={store.saving}>
                                                    <ProgramSettings
                                                        program_data={data}
                                                        store={store}
                                                        onSave={ (id, data) => store.updateProgram(id, data) } />
                                                </LoadingSpinner>
                                            )}
                                            HistorySection={observer(() =>
                                                <LoadingSpinner isLoading={store.saving}>
                                                    <ProgramHistory
                                                        store={store}
                                                        onIsDirtyChange={is_dirty => store.setActiveFormIsDirty(is_dirty)}
                                                        program_data={data}
                                                        fetching_history={store.fetching_editing_history}
                                                        history={store.editing_history}
                                                        saving={store.saving}
                                                        onSave={(id, data) => store.updateProgram(id, data)} />
                                                </LoadingSpinner>
                                            )}
                                        />
                                    </Wrapper>
                                )}>
                                    <Col size="0.5">
                                            <input type="checkbox" disabled={data.id=='new'} checked={store.bulk_targets.get(data.id) || false} onChange={() => store.toggleBulkTarget(data.id) }/>
                                    </Col>
                                    <Col size="2" className="td--stretch">
                                        {data.id == 'new' &&
                                            <div className="expando-toggle icon__disabled">
                                                <div className="expando-toggle__icon">
                                                    <FontAwesomeIcon icon={(store.editing_target == data.id) ? 'caret-down' : 'caret-right'} />
                                                </div>
                                                <div className="expando-toggle__label">
                                                    <i className="fas fa-cube"/>&nbsp;
                                                    {data.name ||
                                                    // # Translators: Label for a freshly created program before the name is entered
                                                    gettext("New Program")}
                                                </div>
                                            </div>
                                        }
                                        {data.id != 'new' &&
                                            <div className="expando-toggle icon__clickable" onClick={() => store.toggleEditingTarget(data.id)} >
                                                <div className="expando-toggle__icon">
                                                    <FontAwesomeIcon icon={(store.editing_target == data.id) ? 'caret-down' : 'caret-right'} />
                                                </div>
                                                <div className="expando-toggle__label">
                                                    <i className="fas fa-cube"/>&nbsp;
                                                    {data.name ||
                                                    // # Translators: Label for a freshly created program before the name is entered
                                                    gettext("New Program")}
                                                </div>
                                            </div>
                                        }
                                    </Col>
                                    <Col>
                                        { organizationColumn(data)}
                                    </Col>
                                    <Col className="text-nowrap">
                                        {data.program_users ?
                                            <a href={`/tola_management/user/?programs[]=${data.id}`}>
                                                <i className="fas fa-users"/>&nbsp;{data.program_users} {
                                                    // # Translators: preceded by a number, i.e. "3 users" or "1 user"
                                                    interpolate(ngettext("%d user", "%d users", data.program_users), [data.program_users])
                                                }</a>
                                    : <span><i className="fas fa-users" />&nbsp;{
                                        // # Translators: when no users are connected to the item
                                        gettext("0 users")
                                    }</span>}
                                    </Col>
                                    <Col>{fundingStatusDisplayStr(data.funding_status)}</Col>
                                </Row>
                            }
                        />
                    </div>
                </LoadingSpinner>
                <div className="admin-list__metadata">
                    <div className="metadata__count text-small text-muted">{store.program_count ? `${store.program_count} ${gettext("programs")}`:`---`}</div>
                    <div className="metadata__controls">
                        {store.total_pages &&
                         <Pagination
                            pageCount={store.total_pages}
                            initialPage={store.current_page}
                            onPageChange={page => store.changePage(page)} />
                        }
                    </div>
                </div>
            </div>
        </div>
    }
)
