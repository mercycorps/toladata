import React from 'react'
import { observer } from "mobx-react"
import Select from 'react-select'
import CheckboxedMultiSelect from 'components/checkboxed-multi-select'
import ManagementTable from 'components/management-table'
import UserEditor from './components/user_editor'
import EditUserProfile from './components/edit_user_profile'
import EditUserPrograms from './components/edit_user_programs'
import EditUserHistory from './components/edit_user_history'
import Pagination from 'components/pagination'
import LoadingSpinner from 'components/loading-spinner'
import FoldingSidebar from 'components/folding-sidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// # Translators: Nothing selected by user
const selection_placeholder = gettext("None Selected");
const UserFilter = observer(({store, selections}) => {
    return <div className="form-group react-multiselect-checkbox">
        <label htmlFor="users_filter">{gettext("Find a User")}</label>
        <CheckboxedMultiSelect
            value={store.filters.users}
            options={selections}
            onChange={(e) => store.changeUserFilter(e)}
            placeholder={selection_placeholder}
            id="users_filter" />
    </div>
})

const CountryFilter = observer(({store, selections}) => {
    return <div className="form-group react-multiselect-checkbox">
        {
            /* # Translators: The countries a user is allowed to access */}
        <label htmlFor="countries_permitted_filter">{gettext("Countries Permitted")}</label>
        <CheckboxedMultiSelect
            value={store.filters.countries}
            options={selections}
            onChange={(e) => store.changeCountryFilter(e)}
            placeholder={selection_placeholder}
            id="countries_permitted_filter" />
    </div>
})

const BaseCountryFilter = observer(({store, selections}) => {
    return <div className="form-group react-multiselect-checkbox">
        {
            /* # Translators: Primary country of the user */}
        <label htmlFor="base_country_filter">{gettext("Base Country")}</label>
        <CheckboxedMultiSelect
            value={store.filters.base_countries}
            options={selections}
            onChange={(e) => store.changeBaseCountryFilter(e)}
            placeholder={selection_placeholder}
            id="base_country_filter" />
    </div>
})

const ProgramFilter = observer(({store, selections}) => {
    return <div className="form-group react-multiselect-checkbox">
        <label htmlFor="programs_filter">{gettext("Programs")}</label>
        <CheckboxedMultiSelect
            value={store.filters.programs}
            options={selections}
            onChange={(e) => store.changeProgramFilter(e)}
            placeholder={selection_placeholder}
            id="programs_filter" />
    </div>
})

class SetUserStatusBulkAction extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: []
        }
    }

    onChange(new_val) {
        this.setState({
            value: new_val
        })
    }

    onApply() {
        this.props.onApply(this.state.value)
    }

    render() {
        return <Select options={this.props.options} value={this.state.value} onChange={(val) => this.onChange(val)} />
    }
}

class UpdateProgramsBulkAction extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            values: []
        }
    }

    onChange(new_vals) {
        this.setState({
            values: new_vals
        })
    }

    render() {
        return <CheckboxedMultiSelect options={this.props.options} value={this.state.values} onChange={(val) => this.onChange(val)} />
    }
}

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
            current_action: new_action.value,
            current_vals: [],
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
        const apply_disabled = !this.state.current_action || (Array.isArray(this.state.current_vals) && !this.state.current_vals.length) || !this.state.current_vals
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
                <Select placeholder="---" noOptionsMessage={() => gettext('No options')}/>
            </div>
            }
            <button className="btn btn-secondary" disabled={apply_disabled} onClick={() => this.onApply()}>{gettext('Apply')}</button>
        </div>
    }
}

export const IndexView = observer(
    ({store}) => {
        const programOptions = store.program_selections
        const bulk_actions = {
            primary_options: [
                // # Translators: Set an account to active or inactive
                {label: gettext('Set account status'), value: 'set_account_status'},
                // # Translators: Associate a user with a program granting permission
                {label: gettext('Add to program'), value: 'add_to_program'},
                // # Translators: Disassociate a user with a program removing permission
                {label: gettext('Remove from program'), value: 'remove_from_program'},
            ],
            secondary_options: {
                set_account_status: {
                    component: (props) => <Select options={store.user_status_options} {...props} />,
                    onApply: (option) => store.bulkUpdateUserStatus(option.value)
                },
                add_to_program: {
                    component: (props) => <CheckboxedMultiSelect options={store.program_bulk_selections} {...props} />,
                    onApply: (vals) => store.bulkAddPrograms(vals.map(option => option.value))
                },
                remove_from_program: {
                    component: (props) => <CheckboxedMultiSelect options={store.program_bulk_selections} {...props} />,
                    onApply: (vals) => store.bulkRemovePrograms(vals.map(option => option.value))
                },
            }
        }

        return <div id="user-management-index-view" className="row">
            <FoldingSidebar>
                <div className="filter-section">
                    <CountryFilter store={store} selections={store.countries_selections} />
                    <BaseCountryFilter store={store} selections={store.countries_selections} />
                    <ProgramFilter store={store} selections={store.program_selections} />
                    <div className="form-group react-multiselect-checkbox">
                        <label htmlFor="organization_filter">{gettext("Organization")}</label>
                        <CheckboxedMultiSelect
                        value={store.filters.organizations}
                        options={store.organization_selections}
                        onChange={(e) => store.changeOrganizationFilter(e)}
                        placeholder={selection_placeholder}
                        id="organization_filter" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="status_filter">{gettext("Status")}</label>
                        <Select
                        value={store.filters.user_status}
                        options={store.user_status_options}
                        onChange={(e) => store.changeUserStatusFilter(e)}
                        placeholder={selection_placeholder}
                        id="status_filter" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="admin_role_filter">{gettext("Administrator?")}</label>
                        <Select
                        value={store.filters.admin_role}
                        options={store.admin_role_options}
                        onChange={(e) => store.changeAdminRoleFilter(e)}
                        placeholder={selection_placeholder}
                        id="admin_role_filter" />
                    </div>
                </div>
                <div className="filter-section filter-buttons">
                    <button className="btn btn-primary" onClick={() => store.applyFilters()}>{gettext("Apply")}</button>
                    <button className="btn btn-reset" onClick={() => store.clearFilters()}>{gettext("Reset")}</button>
                </div>
            </FoldingSidebar>
            <div className="col admin-list">
                <header className="page-title">
                    <h1>{gettext("Admin:")} <small>{gettext("Users")}</small></h1>
                </header>
                <div className="admin-list__controls">
                    <BulkActions primaryOptions={bulk_actions.primary_options} secondaryOptions={bulk_actions.secondary_options}/>
                    <div className="controls__buttons">
                        <a href="#" tabIndex="0" className="btn btn-link btn-add" onClick={() => store.createUser()}>
                            <i className="fas fa-plus-circle"/>
                            {gettext("Add user")}
                        </a>
                    </div>
                </div>
                <div className="admin-list__top-filter">
                    <UserFilter store={store} selections={store.user_selections} />
                </div>
                <LoadingSpinner isLoading={store.fetching_users_listing || store.applying_bulk_updates}>
                    <div className="admin-list__table">
                        <ManagementTable
                            data={store.users_listing.map(id => store.users[id])}
                            keyField="id"
                            HeaderRow={({Col, Row}) =>
                                <Row>
                                    <Col size="0.5">
                                        <input type="checkbox" checked={store.bulk_targets_all} onChange={() => store.toggleBulkTargetsAll()}/>
                                    </Col>
                                    <Col size="2" className="td--stretch">{gettext("User")}</Col>
                                    <Col>{gettext("Organization")}</Col>
                                    <Col>{gettext("Programs")}</Col>
                                    {
                                        /* # Translators: Label for column identifying "active" or "inactive" user status */}
                                    <Col size="0.25">{gettext("Status")}</Col>
                                </Row>
                            }
                            Row={({Col, Row, data}) =>
                                <Row
                                expanded={data.id == store.editing_target}
                                Expando={observer(({Wrapper}) =>
                                    <Wrapper>
                                            <UserEditor
                                                notifyPaneChange={(new_pane) => store.onProfilePaneChange(new_pane)}
                                                new={data.id == 'new'}
                                                active_pane={store.active_editor_pane}
                                                ProfileSection={observer(() =>
                                                    <LoadingSpinner isLoading={store.fetching_editing_target || store.saving_user_profile || store.saving_user_programs}>
                                                        <EditUserProfile
                                                            disabled={data.organization_id == 1 && !store.is_superuser && data.id != 'new'}
                                                            is_superuser={store.is_superuser}
                                                            new={data.id == 'new'}
                                                            userData={store.editing_target_data.profile}
                                                            errors={store.editing_errors}
                                                            key={store.editing_target_data.profile.id}
                                                            onUpdate={(new_user_data) => store.updateUserProfile(data.id, new_user_data)}
                                                            onCreate={(new_user_data) => store.saveNewUser(new_user_data)}
                                                            onCreateAndAddAnother={(new_user_data) => store.saveNewUserAndAddAnother(new_user_data)}
                                                            organizations={store.organization_selections}
                                                            onIsDirtyChange={is_dirty => store.setActiveFormIsDirty(is_dirty)}
                                                        />
                                                    </LoadingSpinner>
                                                )}
                                                ProgramSection={observer(() =>
                                                    <LoadingSpinner isLoading={store.fetching_editing_target || store.saving_user_profile || store.saving_user_programs}>
                                                        <EditUserPrograms
                                                            store={store}
                                                            user={data}
                                                            adminUserProgramRoles={store.access.program}
                                                            adminUserCountryRoles={store.access.countries}
                                                            onSave={(new_program_data) => store.saveUserPrograms(data.id, new_program_data)}
                                                            onIsDirtyChange={is_dirty => store.setActiveFormIsDirty(is_dirty)}
                                                        />
                                                    </LoadingSpinner>
                                                )}
                                                HistorySection={observer(() =>
                                                    <LoadingSpinner isLoading={store.fetching_editing_target || store.saving_user_profile || store.saving_user_programs}>
                                                        <EditUserHistory
                                                            store={store}
                                                            disabled={data.organization_id == 1 && !store.is_superuser}
                                                            userData={store.editing_target_data.profile}
                                                            history={store.editing_target_data.history}
                                                            onResendRegistrationEmail={() => store.resendRegistrationEmail(data.id)}
                                                            onSave={(new_data) => store.updateUserIsActive(data.id, new_data)}
                                                            onIsDirtyChange={is_dirty => store.setActiveFormIsDirty(is_dirty)}
                                                        />
                                                    </LoadingSpinner>
                                                )}
                                            />
                                    </Wrapper>
                                )}>
                                    <Col size="0.5">
                                            <input type="checkbox" checked={store.bulk_targets.get(data.id) || false} onChange={() => store.toggleBulkTarget(data.id) }/>
                                    </Col>
                                    <Col size="2" className="td--stretch">
                                        <div className="expando-toggle icon__clickable" onClick={() => store.toggleEditingTarget(data.id)} >
                                            <div className="expando-toggle__icon">
                                                <FontAwesomeIcon icon={(store.editing_target == data.id) ? 'caret-down' : 'caret-right'} />
                                            </div>
                                            <div className="expando-toggle__label">
                                                <i className="fas fa-user"/>&nbsp;
                                                {
                                                    /* # Translators: The highest level of administrator in the system */}
                                                {data.name || "---"} {data.is_super && <span className="badge badge-danger">{gettext("Super Admin")}</span>}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col>
                                        <i className="fas fa-building"/>&nbsp;
                                        {data.organization_name || "---"}
                                    </Col>
                                    <Col className="text-nowrap">
                                    {data.user_programs ?
                                        <a href={`/tola_management/program/?users[]=${data.id}`}>
                                            <i className="fas fa-cubes"/>&nbsp;{
                                                // # Translators: preceded by a number, i.e. "3 programs" or "1 program"
                                                interpolate(ngettext("%s program", "%s programs", data.user_programs), [data.user_programs,])
                                            }
                                        </a>
                                        : <span><i className="fas fa-cubes" />&nbsp;{
                                            // # Translators: when no programs are connected to the item
                                            gettext("0 programs")
                                        }</span>}
                                    </Col>
                                    <Col size="0.25">{data.is_active?gettext('Active'):gettext('Inactive')}</Col>
                                </Row>
                            }
                        />
                    </div>
                </LoadingSpinner>
                <div className="admin-list__metadata">
                    <div className="metadata__count text-muted text-small">{store.users_count?`${store.users_count} ${gettext("users")}`:`--`}</div>
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
