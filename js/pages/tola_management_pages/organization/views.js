import React from 'react';
import { observer } from "mobx-react"
import Select from 'react-select'
import ManagementTable from 'components/management-table'
import Pagination from 'components/pagination'
import CheckboxedMultiSelect from 'components/checkboxed-multi-select'

import OrganizationEditor from './components/organization_editor'
import EditOrganizationProfile from './components/edit_organization_profile'
import EditOrganizationHistory from './components/edit_organization_history'

import LoadingSpinner from 'components/loading-spinner'
import FoldingSidebar from 'components/folding-sidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const CountryFilter = observer(({store, selections}) => {
    return <div className="form-group react-multiselect-checkbox">
        <label htmlFor="countries_permitted_filter">{gettext("Countries")}</label>
        <CheckboxedMultiSelect
            value={store.filters.countries}
            options={selections}
            onChange={(e) => store.changeCountryFilter(e)}
            placeholder={gettext("None Selected")}
            id="countries_permitted_filter" />
    </div>
})

const ProgramFilter = observer(({store, selections}) => {
    return <div className="form-group react-multiselect-checkbox">
        <label htmlFor="programs_filter">{gettext("Programs")}</label>
        <CheckboxedMultiSelect
            value={store.filters.programs}
            options={selections}
            onChange={(e) => store.changeProgramFilter(e)}
            placeholder={gettext("None Selected")}
            id="programs_filter" />
    </div>
})

const OrganizationFilter = observer(({store, selections}) => {
    return <div className="form-group react-multiselect-checkbox">
        <label htmlFor="organizations_filter">{gettext("Find an Organization")}</label>
        <CheckboxedMultiSelect
            value={store.filters.organizations}
            options={selections}
            onChange={(e) => store.changeOrganizationFilter(e)}
            placeholder={gettext("None Selected")}
            id="organization_filter" />
    </div>
})

const SectorFilter = observer(({store, selections}) => {
    return <div className="form-group react-multiselect-checkbox">
        <label htmlFor="sector_filter">{gettext("Sectors")}</label>
        <CheckboxedMultiSelect
            value={store.filters.sectors}
            options={selections}
            onChange={(e) => store.changeSectorFilter(e)}
            placeholder={gettext("None Selected")}
            id="sector_filter" />
    </div>
})

export const IndexView = observer(
    ({store}) => {
        return <div id="organization-management-index-view" className="row">
            <FoldingSidebar>
                <div className="filter-section">
                    <SectorFilter store={store} selections={store.sector_selections} />
                    <ProgramFilter store={store} selections={store.program_selections} />
                    <CountryFilter store={store} selections={store.country_selections} />
                    <div className="form-group">
                        <label htmlFor="status_filter">{gettext("Status")}</label>
                        <Select
                        value={store.filters.organization_status}
                        options={store.organization_status_options}
                        onChange={(e) => store.changeOrganizationStatusFilter(e)}
                        placeholder={gettext("None Selected")}
                        id="status_filter" />
                    </div>
                </div>
                <div className="filter-section filter-buttons">
                    <button className="btn btn-primary" onClick={() => store.applyFilters()}>{gettext("Apply")}</button>
                    <button className="btn btn-reset" onClick={() => store.clearFilters()}>{gettext("Reset")}</button>
                </div>
            </FoldingSidebar>
            <div className="col admin-list">
                <header className="page-title">
                    <h1>{gettext("Admin:")} <small>{gettext("Organizations")}</small></h1>
                </header>
                <div className="admin-list__controls">
                    <div className="controls__top-filter">
                        <OrganizationFilter store={store} selections={store.organization_selections} />
                    </div>
                    <div className="controls__buttons">
                        <a href="#" tabIndex="0" className="btn btn-link btn-add" onClick={() => store.createOrganization()}>
                            <i className="fas fa-plus-circle"/>{gettext("Add Organization")}
                        </a>
                    </div>
                </div>
                <LoadingSpinner isLoading={store.fetching}>
                    <div className="admin-list__table">
                        <ManagementTable
                            data={store.organizations_listing.map(id => store.organizations[id])}
                            keyField="id"
                            HeaderRow={({Col, Row}) =>
                                <Row>
                                    <Col size="0.15">
                                    </Col>
                                    <Col size="2" className="td--stretch">{gettext("Organization")}</Col>
                                    <Col>{gettext("Programs")}</Col>
                                    <Col size="1">{gettext("Users")}</Col>
                                    <Col size="0.25">{gettext("Status")}</Col>
                                </Row>
                            }
                            Row={({Col, Row, data}) =>
                                <Row
                                    expanded={data.id == store.editing_target}
                                    Expando={observer(({Wrapper}) =>
                                        <Wrapper>
                                            <OrganizationEditor
                                                active_pane={store.active_editor_pane}
                                                notifyPaneChange={(new_pane) => store.onProfilePaneChange(new_pane)}
                                                new={data.id == 'new'}
                                                    ProfileSection={observer(() =>
                                                        <LoadingSpinner isLoading={store.fetching_editing_target || store.saving}>
                                                            <EditOrganizationProfile
                                                                onIsDirtyChange={is_dirty => store.setActiveFormIsDirty(is_dirty)}
                                                                new={data.id == 'new'}
                                                                sectorSelections={store.sector_selections}
                                                                organizationData={store.editing_target_data}
                                                                errors={store.editing_errors}
                                                                key={store.editing_target_data.id}
                                                                onSave={(new_organization_data) => store.updateOrganizationProfile(data.id, new_organization_data)}
                                                                onSaveNew={(new_organization_data) => store.saveNewOrganization(new_organization_data)}
                                                                onSaveNewAndAddAnother={(new_organization_data) => store.saveNewOrganizationAndAddAnother(new_organization_data)} />
                                                        </LoadingSpinner>
                                                    )}
                                                    HistorySection={observer(() =>
                                                        <LoadingSpinner isLoading={store.fetching_editing_target || store.saving}>
                                                            <EditOrganizationHistory
                                                                store={store}
                                                                onIsDirtyChange={is_dirty => store.setActiveFormIsDirty(is_dirty)}
                                                                organizationData={store.editing_target_data}
                                                                organizationHistoryData={store.editing_target_history}
                                                                onSave={(new_organization_data) => store.updateOrganizationProfile(data.id, new_organization_data)}/>
                                                        </LoadingSpinner>
                                                    )}
                                            />
                                        </Wrapper>
                                )}>
                                    <Col size="0.15">
                                    </Col>
                                    <Col size="2" className="td--stretch">
                                        <div className="expando-toggle icon__clickable" onClick={() => store.toggleEditingTarget(data.id)} >
                                            <div className="expando-toggle__icon">
                                                <FontAwesomeIcon icon={(store.editing_target == data.id) ? 'caret-down' : 'caret-right'} />
                                            </div>
                                            <div className="expando-toggle__label">
                                                <i className="fas fa-building"/>&nbsp;
                                                {data.name || "---"}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col size="1" className="text-nowrap">
                                    {data.program_count ?
                                        <a href={`/tola_management/program/?organizations[]=${data.id}`}>
                                            <i className="fas fa-cubes"/>&nbsp;{
                                                // # Translators: preceded by a number, i.e. "3 programs" or "1 program"
                                                interpolate(ngettext("%s program", "%s programs", data.program_count), [data.program_count])
                                            }
                                        </a> 
                                        : <span><i className="fas fa-cubes"/>&nbsp;{
                                            // # Translators: when no programs are connected to the item
                                            gettext("0 programs")}</span>}
                                    </Col>
                                    <Col size="1" className="text-nowrap">
                                    { data.user_count ?
                                        <a href={`/tola_management/user/?organizations[]=${data.id}`}>
                                            <i className="fas fa-users"/>&nbsp;{
                                                // # Translators: preceded by a number, i.e. "3 users" or "1 user"
                                                interpolate(ngettext("%s user", "%s users", data.user_count), [data.user_count])
                                            }
                                        </a>
                                        : <span><i className="fas fa-users"/>&nbsp;{
                                            // # Translators: when no users are connected to the item
                                            gettext("0 users")
                                        }</span>}
                                    </Col>
                                    <Col size="0.25">{data.is_active ? gettext('Active') : gettext('Inactive')}</Col>
                                </Row>
                            }
                        />
                    </div>
                </LoadingSpinner>
                <div className="admin-list__metadata">
                    <div className="metadata__count text-small text-muted">{store.organizations_count?`${store.organizations_count} ${gettext("organizations")}`:`--`}</div>
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
