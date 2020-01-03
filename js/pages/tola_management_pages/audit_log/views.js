import React from 'react';
import { observer } from "mobx-react"
import Pagination from 'components/pagination'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

import LoadingSpinner from 'components/loading-spinner'

const ResultChangeset = ({data, name, pretty_name}) => {
    if (name === 'id') {
        return null
    } else if(name == 'Target_url') {
        return <div className="change__field"><strong>{pretty_name}</strong>: {(data != 'N/A' && data !== '')?<a href={data} target="_blank">Link</a>:data}</div>
    } else if (name === 'disaggregation_values') {
        if (Object.entries(data).length) {
            return <div className="changelog__change__targets">
                <h4 className="text-small">{gettext('Disaggregated values changed')}</h4>
                {Object.entries(data).map(([id, dv]) => {
                    return <div className="change__field" key={id}><strong>{dv.name}:</strong> {dv.value}</div>
                })}
            </div>
        } else {
            return null;
        }
    } else {
        return <div className="change__field"><strong>{pretty_name}</strong>: {data}</div>
    }
}

const ProgramDatesChangeset = ({data, name, pretty_name}) => {
    return <p>{pretty_name}: {data}</p>
}

const IndicatorChangeset = ({data, name, pretty_name}) => {
    if(name == 'targets') {
        return <div className="changelog__change__targets">
            <h4 className="text-small">{gettext('Targets changed')}</h4>
            {Object.entries(data).map(([id, target]) => {
                return <div className="change__field" key={id}><strong>{target.name}:</strong> {target.value}</div>
            })}
        </div>
    } else {
        return <div className="change__field">
            { name !== 'name' ? <strong>{pretty_name}: </strong>  : '' }
            {(data !== null && data !== undefined)?data.toString():gettext('N/A')}
        </div>
    }
}

const ResultLevelChangeset = ({data, name, pretty_name}) => {
    return <div className="change__field">
        { name !== 'name' ? <strong>{pretty_name}: </strong>  : '' }
        {(data !== null && data !== undefined)?data.toString():gettext('N/A')}
    </div>
}

class ChangesetEntry extends React.Component {
    renderType(type, data, name, pretty_name) {
        switch(type) {
            case 'indicator_changed':
            case 'indicator_created':
            case 'indicator_deleted':
                return <IndicatorChangeset data={data} name={name} pretty_name={pretty_name} />
                break
            case 'result_changed':
            case 'result_created':
            case 'result_deleted':
                return <ResultChangeset data={data} name={name} pretty_name={pretty_name} />
                break
            case 'program_dates_changed':
                return <ProgramDatesChangeset data={data} name={name} pretty_name={pretty_name} />
                break
            case 'level_changed':
                return <ResultLevelChangeset data={data} name={name} pretty_name={pretty_name} />
                break
        }
    }

    render() {
        const {data, type, name, pretty_name} = this.props
        return this.renderType(type, data, name, pretty_name)
    }
}

const ExpandAllButton = observer(
    ({store}) => {
        return <button className="btn btn-medium text-action btn-sm"
                       onClick={() => store.expandAllExpandos()}
                       disabled={store.log_rows.length === store.expando_rows.size}>
            <i className="fas fa-plus-square"></i>
            {
                /* # Translators: button label to show the details of all rows in a list */}
            {gettext('Expand all')}
        </button>
    }
);

const CollapseAllButton = observer(
    ({store}) => {
        return <button className="btn btn-medium text-action btn-sm"
                       onClick={() => store.collapsAllExpandos()}
                       disabled={store.expando_rows.size === 0}>
            <i className="fas fa-minus-square"></i>
            {
                /* # Translators: button label to hide the details of all rows in a list */}
            {gettext('Collapse all')}
        </button>
    }
);

const IndicatorNameSpan = ({indicator}) => {
    if (! indicator) {
        return <span>{gettext('N/A')}</span>
    }

    if (indicator.results_aware_number) {
        return <span>
            <strong>{gettext('Indicator')} {indicator.results_aware_number}:</strong> {indicator.name}
        </span>
    } else {
        return <span>
            <strong>{gettext('Indicator')}:</strong> {indicator.name}
        </span>
    }
};

const ResultLevel = ({indicator, level}) => {
    if (indicator) {

        if (indicator.leveltier_name && indicator.level_display_ontology)
            return `${indicator.leveltier_name} ${indicator.level_display_ontology}`;
        else if (indicator.leveltier_name)
            return indicator.leveltier_name;
    }

    if (level) {
        return `${level.name} ${level.display_ontology}`;
    }

    return <span>{gettext('N/A')}</span>
};

export const IndexView = observer(
    ({store}) => {
        return <div id="audit-log-index-view">
            <header className="page-title">
                <h1 className="page-title h2">
                    <a href={`/program/${store.program_id}/`}>{store.program_name}</a>: <span className="font-weight-normal text-muted text-nowrap">{gettext("Indicator change log")}&nbsp;<small><i className="fa fa-history" /></small></span>
                </h1>
            </header>

            <div className="admin-list__controls">
                <div className="controls__bulk-actions">
                    <div className="btn-group">
                        <ExpandAllButton store={store} />
                        <CollapseAllButton store={store} />
                    </div>
                </div>
                <div className="controls__buttons">
                    <a className="btn btn-secondary btn-sm" href={`/api/tola_management/program/${store.program_id}/export_audit_log`}>
                        <i className="fas fa-download" />
                        {gettext("Excel")}
                    </a>
                </div>
            </div>

            <div className="admin-list__table">
                <LoadingSpinner isLoading={store.fetching}>
                    <table className="table table-sm table-bordered bg-white text-small changelog">
                        <thead>
                            <tr>
                                <th className="text-nowrap">{gettext("Date and time")}</th>
                                <th className="text-nowrap">{gettext("Result level")}</th>
                                <th className="text-nowrap">{gettext("Indicator")}</th>
                                <th className="text-nowrap">{gettext("User")}</th>
                                <th className="text-nowrap">{gettext("Organization")}</th>
                                <th className="text-nowrap">{gettext("Change type")}</th>
                                <th className="text-nowrap">{gettext("Previous entry")}</th>
                                <th className="text-nowrap">{gettext("New entry")}</th>
                                <th className="text-nowrap">{gettext("Reason for change")}</th>
                            </tr>
                        </thead>
                        {store.log_rows.map(data => {
                                let is_expanded = store.expando_rows.has(data.id);
                                return <tbody key={data.id}>
                                <tr className={is_expanded ? 'changelog__entry__header is-expanded' : 'changelog__entry__header'} onClick={() => store.toggleRowExpando(data.id)}>
                                    <td className="text-action">
                                        <FontAwesomeIcon icon={is_expanded ? 'caret-down' : 'caret-right'} />&nbsp;{data.date}
                                    </td>
                                    <td><ResultLevel indicator={data.indicator} level={data.level} /></td>
                                    <td>{<IndicatorNameSpan indicator={data.indicator} />}</td>
                                    <td>{data.user}</td>
                                    <td>{data.organization}</td>
                                    <td className="text-nowrap">{data.pretty_change_type}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                {is_expanded &&
                                <tr className="changelog__entry__row" key={data.id}>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td className="changelog__change--prev">
                                        {data.diff_list.map(changeset => {
                                            return <ChangesetEntry key={changeset.name} name={changeset.name}
                                                                   pretty_name={changeset.pretty_name}
                                                                   type={data.change_type} data={changeset.prev}/>
                                        })}
                                    </td>
                                    <td className="changelog__change--new">
                                        {data.diff_list.map(changeset => {
                                            return <ChangesetEntry key={changeset.name} name={changeset.name}
                                                                   pretty_name={changeset.pretty_name}
                                                                   type={data.change_type} data={changeset.new}/>
                                        })}
                                    </td>
                                    <td className="changelog__change--rationale">{data.rationale}</td>
                                </tr>
                                }
                                </tbody>
                            })}
                    </table>
                </LoadingSpinner>
                <div className="admin-list__metadata">
                    <div className="metadata__count text-muted text-small">{store.entries_count?`${store.entries_count} ${gettext("entries")}`:`--`}</div>
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
