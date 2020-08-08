import React from 'react';
import { observer } from "mobx-react"
import Pagination from '../../../components/pagination'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { toJS } from "mobx"
import classNames from "classnames";

import LoadingSpinner from '../../../components/loading-spinner'

const emptyValue = "—";

export const DisaggregationDiffs = ({disagg_type, disagg_diffs}) => {
    disagg_diffs.sort( (a, b) => a.custom_sort - b.custom_sort);
    return <div><h4 className="disagg-type__title text-small">{gettext(disagg_type)}</h4>
        {disagg_diffs.map( diff => {
            const displayValue = ["", null, undefined].includes(diff.value)
                ? emptyValue
                : localizeNumber(normalizeNumber(diff.value));
            const displayClasses = classNames("change__field__value", {"empty-value": displayValue===emptyValue});
            return <div className="change__field" key={diff.id}><span className="change__field__name">{diff.name}:</span> <span className={displayClasses}>{displayValue}</span></div>
        })}
    </div>
};

export const ResultChangeset = ({data, name, pretty_name}) => {
    let displayValue = "";
    if (["", null, undefined].includes(data)) {
        displayValue = emptyValue;
    }
    else if (isNaN(data)) {
        displayValue = data;
    }
    else {
        displayValue = localizeNumber(data);
    }
    if (name === 'id') {
        return null
    } else if(name === 'evidence_url') {
        return <div className="change__field"><strong className="change__field__name">{pretty_name}</strong>: {(data !== 'N/A' && data !== '')?<a className="change__field__value--evidence-url" href={displayValue} target="_blank">{displayValue}</a>:data}</div>
    } else if (name === 'disaggregation_values') {
        if (Object.entries(data).length) {
            let groupedDiffs = {};
            Object.values(data).forEach( entry => {
                const groupKey = entry.type || "__none__";
                if (entry.type in groupedDiffs) {
                    groupedDiffs[groupKey].push(entry);
                }
                else {
                    groupedDiffs[groupKey] = [entry];
                }
            });

            return <div className="changelog__change__targets">
                {Object.keys(groupedDiffs).sort().map( (typeName ) => {
                    return  <DisaggregationDiffs
                        key={typeName+'_diff'}
                        disagg_type={typeName === "__none__" ? "" : typeName } disagg_diffs={groupedDiffs[typeName]} />
                })}
            </div>
        } else {
            return null;
        }
    } else {
        const displayClasses = classNames("change__field__value", {"empty-value": displayValue===emptyValue});
        return <div className="change__field"><strong className="change__field__name">{pretty_name}</strong>: <span className={displayClasses}>{displayValue}</span></div>
    }
};

const ProgramDatesChangeset = ({data, name, pretty_name}) => {
    const displayValue = ["", null].includes(data)  ? "–" : data;
    return <p>{pretty_name}: {displayValue}</p>
}

const IndicatorChangeset = ({data, name, pretty_name, indicator}) => {
    if(name === "baseline_na"){
        return null;
    }
    if(name === 'targets') {
        return <div className="changelog__change__targets">
            <h4 className="text-small">{gettext('Targets changed')}</h4>
            {Object.entries(data).map(([id, target]) => {
                const displayValue = ["", null, undefined].includes(target.value) ? emptyValue : localizeNumber(target.value);
                const displayClasses = classNames({"empty-value": displayValue===emptyValue});
                return <div className="change__field" key={id}><strong className="change__field__name">{target.name}:</strong> <span className={displayClasses}>{displayValue}</span></div>
            })}
        </div>
    } else {
        let displayValue = "";
        if (["", null, undefined].includes(data)) {
            displayValue = emptyValue;
        }
        else if (isNaN(data)) {
            displayValue = data;
        }
        else {
            displayValue = localizeNumber(data);
        }
        if (name === "baseline_value" && displayValue === emptyValue) {
            displayValue = "N/A";
        }
        const displayClasses = classNames({"empty-value": displayValue===emptyValue});
        return <div className="change__field">
            <strong className="change__field__name">
                { name === 'name' ?
                    <span>{gettext('Indicator')} {indicator.results_aware_number}: </span> : <span>{pretty_name}: </span>}
            </strong>
            <span className={displayClasses}>{displayValue}</span>
        </div>
    }
}

const ResultLevelChangeset = ({data, name, pretty_name, level}) => {
    const displayValue = ["", null, undefined].includes(data) ? emptyValue : data.toString();
    const displayClasses = displayValue === emptyValue ? "empty-value" : null;
    return <div className="change__field">
        { name !== 'name' ? <strong className="change__field__name">{pretty_name}: </strong>  : <strong><span className="field__level-tier">{level.tier} {level.display_ontology}: </span></strong> }
        <span className={displayClasses}>{displayValue}</span>
    </div>
}

class ChangesetEntry extends React.Component {
    renderType(type, data, name, pretty_name, indicator, level) {
        switch(type) {
            case 'indicator_changed':
            case 'indicator_created':
            case 'indicator_deleted':
                return <IndicatorChangeset data={data} name={name} pretty_name={pretty_name} indicator={indicator} level={level}/>
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
                return <ResultLevelChangeset
                    data={data} name={name} pretty_name={pretty_name} level={level} />
                break
        }
    }

    render() {
        const {data, type, name, pretty_name, indicator, level} = this.props;
        return this.renderType(type, data, name, pretty_name, indicator, level)
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

export const IndicatorNameSpan = ({indicator, result_info}) => {
    if (! indicator) {
        return <span>{gettext('N/A')}</span>
    }
    let indicator_output = ''
    if (indicator.results_aware_number) {
        indicator_output = <span>
            <strong>{gettext('Indicator')} {indicator.results_aware_number}:</strong> {indicator.name}
        </span>
    } else {
        indicator_output = <span>
            <strong>{gettext('Indicator')}:</strong> {indicator.name}
        </span>
    }

    // # Translators: This is part of a change log.  The result date of the Result that has been changed is being shown
    const result_output = result_info ? <p className="mt-2"><strong>{gettext("Result date:")}</strong> {result_info.date}</p> : null;

    return (
        <React.Fragment>
            {indicator_output}
            {result_output}
        </React.Fragment>
    )
};

const ResultLevel = ({indicator, level}) => {
    if (level) {
        return `${level.tier} ${level.display_ontology}`;
    }

    if (indicator) {

        if (indicator.leveltier_name && indicator.level_display_ontology)
            return `${indicator.leveltier_name} ${indicator.level_display_ontology}`;
        else if (indicator.leveltier_name)
            return indicator.leveltier_name;
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
                                {/* # Translators: This is a column heading. The column is in a change log and identifies the entities being changed. */}
                                <th className="text-nowrap">{gettext("Indicators and Results")}</th>
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
                                <tr
                                    className={is_expanded ? 'changelog__entry__header is-expanded' : 'changelog__entry__header'}
                                    onClick={() => store.toggleRowExpando(data.id)}>
                                    <td className="text-action">
                                        <FontAwesomeIcon icon={is_expanded ? 'caret-down' : 'caret-right'} />
                                        &nbsp;{data.date} (UTC)
                                    </td>
                                    <td><ResultLevel indicator={data.indicator} level={data.level} /></td>
                                    <td>{<IndicatorNameSpan indicator={data.indicator} result_info={data.result_info} />}</td>
                                    <td>{data.user}</td>
                                    <td>{data.organization}</td>
                                    <td className="text-nowrap">{data.pretty_change_type}</td>
                                    <td className="text-action">{is_expanded ? '' : '...'}</td>
                                    <td className="text-action">{is_expanded ? '' : '...'}</td>
                                    <td className="text-action">{is_expanded ? '' : '...'}</td>
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
                                                                   type={data.change_type} data={changeset.prev}
                                                                   indicator={data.indicator} level={data.level}/>
                                        })}
                                    </td>
                                    <td className="changelog__change--new">
                                        {data.diff_list.map(changeset => {
                                            return <ChangesetEntry key={changeset.name} name={changeset.name}
                                                                   pretty_name={changeset.pretty_name}
                                                                   type={data.change_type} data={changeset.new}
                                                                   indicator={data.indicator} level={data.level}/>
                                        })}
                                    </td>
                                    <td className="changelog__change--rationale">
                                    {data.rationale_selected_options &&
                                        data.rationale_selected_options.map(option => {
                                            return <React.Fragment key={option}><span className="changelog__change--rationale-option">{option}</span><br /></React.Fragment>;
                                        })
                                    }
                                    {(data.rationale_selected_options && data.rationale_selected_options.length > 0 && data.rationale) && <br/>}
                                        <span className="changelog__change--rationale-text">{data.rationale}</span>
                                    </td>
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
