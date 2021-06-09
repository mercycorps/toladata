import React from 'react';
import classNames from 'classnames';
import { observer } from "mobx-react";
import eventBus from '../../../eventbus';
import { AddIndicatorButton, ExpandAllButton, CollapseAllButton } from '../../../components/indicatorModalComponents';
import {ImportIndicatorsButton} from "../../../components/ImportIndicatorsPopover"
import ResultsTable from './resultsTable';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import {IndicatorFilterType} from "../../../constants";
import Select from 'react-select';


library.add(faCaretDown, faCaretRight);


function getStatusIndicatorString(filterType, indicatorCount) {
    let fmts;
    switch (filterType) {
        case IndicatorFilterType.missingTarget:
            // # Translators: The number of indicators that do not have targets defined on them
            fmts = ngettext("%s indicator has missing targets", "%s indicators have missing targets", indicatorCount);
            return interpolate(fmts, [indicatorCount]);
        case IndicatorFilterType.missingResults:
            // # Translators: The number of indicators that no one has entered in any results for
            fmts = ngettext("%s indicator has missing results", "%s indicators have missing results", indicatorCount);
            return interpolate(fmts, [indicatorCount]);
        case IndicatorFilterType.missingEvidence:
            // # Translators: The number of indicators that contain results that are not backed up with evidence
            fmts = ngettext("%s indicator has missing evidence", "%s indicators have missing evidence", indicatorCount);
            return interpolate(fmts, [indicatorCount]);
        case IndicatorFilterType.aboveTarget:
            // # Translators: shows what number of indicators are a certain percentage above target. Example: 3 indicators are >15% above target
            fmts = ngettext("%s indicator is >15% above target", "%s indicators are >15% above target", indicatorCount);
            return interpolate(fmts, [indicatorCount]);
        case IndicatorFilterType.belowTarget:
            // # Translators: shows what number of indicators are a certain percentage below target. Example: 3 indicators are >15% below target
            fmts = ngettext("%s indicator is >15% below target", "%s indicators are >15% below target", indicatorCount);
            return interpolate(fmts, [indicatorCount]);
        case IndicatorFilterType.onTarget:
            // # Translators: shows what number of indicators are within a set range of target. Example: 3 indicators are on track
            fmts = ngettext("%s indicator is on track", "%s indicators are on track", indicatorCount);
            return interpolate(fmts, [indicatorCount]);
        case IndicatorFilterType.nonReporting:
            // # Translators: shows what number of indicators that for various reasons are not being reported for program metrics
            fmts = ngettext("%s indicator is unavailable", "%s indicators are unavailable", indicatorCount);
            return interpolate(fmts, [indicatorCount]);

        default:
            // # Translators: the number of indicators in a list. Example: 3 indicators
            fmts = ngettext("%s indicator", "%s indicators", indicatorCount);
            return interpolate(fmts, [indicatorCount]);
    }
}



@observer
export class StatusHeader extends React.Component {
    constructor(props) {
        super(props);
        this.onShowAllClick = (e) => {
            e.preventDefault();
            eventBus.emit('nav-clear-all-indicator-filters');
        };
    }

    render() {
        const {
            indicatorCount,
            programId,
            currentIndicatorFilter,
            filterApplied,
        } = this.props;

        return <div className="indicators-list__header">
            <h3 className="no-bold">
                <span id="indicators-list-title">
                    {getStatusIndicatorString(currentIndicatorFilter, indicatorCount)}
                </span>
                {filterApplied &&
                    <small className="ml-2 text-medium-dark text-nowrap">|
                        <a className="btn btn-sm btn-link btn-inline ml-2" href="#" id="show-all-indicators" onClick={this.onShowAllClick}>
                            {
                                // # Translators: A link that shows all the indicators, some of which are currently filtered from view
                                gettext('Show all indicators')
                            }
                        </a>
                    </small>
                }
            </h3>
        </div>
    }
}


@observer
export class IndicatorFilter extends React.Component{
    onIndicatorSelection = (selected) => {
        let selectedIndicatorId = selected ? selected.value : null;

        if (selectedIndicatorId) {
            eventBus.emit('nav-select-indicator-to-filter', selectedIndicatorId);
        }
    };

    onGroupingSelection = (selected) => {
        this.props.uiStore.setGroupBy(selected.value);
    }

    render() {

        const indicatorSelectOptions = this.props.rootStore.allIndicators.map(i => {
            return {
                value: i.pk,
                label: i.fullName,
            }
        });

        const indicatorSelectValue = this.props.uiStore.selectedIndicatorId ? indicatorSelectOptions.find(i => i.value === this.props.uiStore.selectedIndicatorId) : null;

        const indicatorGroupingOptions = this.props.uiStore.groupByOptions;
        const groupingValue = this.props.uiStore.selectedGroupByOption;

        return <nav className="list__filters list__filters--block-label" id="id_div_indicators">
            <div className="form-group">
                <label className="">
                    {gettext("Find an indicator:")}
                </label>
                <div className="">
                    <Select
                        options={indicatorSelectOptions}
                        value={indicatorSelectValue}
                        isClearable={false}
                        placeholder={gettext('None')}
                        onChange={this.onIndicatorSelection}
                    />
                </div>
            </div>
            {// show Group By only if program is on results framework AND has two levels (filter label is not false)
                (this.props.uiStore.resultChainFilterLabel) &&
            <React.Fragment>
                <div className="form-group">
                    <label className="">
                        {gettext("Group indicators:")}
                    </label>
                    <div className="">
                        <Select
                               options={indicatorGroupingOptions}
                               value={groupingValue}
                               isClearable={false}
                               onChange={this.onGroupingSelection}
                        />
                    </div>
                </div>
            </React.Fragment>}
        </nav>;
    }
}


@observer
export class IndicatorListTable extends React.Component {
    constructor(props) {
        super(props);

        this.onIndicatorUpdateClick = this.onIndicatorUpdateClick.bind(this);
        this.onIndicatorResultsToggleClick = this.onIndicatorResultsToggleClick.bind(this);
    }

    onIndicatorUpdateClick(e, indicatorPk) {
        e.preventDefault();

        eventBus.emit('open-indicator-update-modal', indicatorPk);
    }

    onIndicatorResultsToggleClick(e, indicatorPk) {
        e.preventDefault();

        if (this.props.program.isExpanded(indicatorPk)) {
            this.props.program.collapse(indicatorPk);
        } else {
            this.props.program.expand(indicatorPk);
        }
    }

    render() {
        const indicators = this.props.indicators;
        const program = this.props.program;
        const editable = !this.props.readOnly;
        const resultEditable = !this.props.resultReadOnly;
        return <table className="table indicators-list">
            <thead>
            <tr className="table-header">
                <th className="" id="id_indicator_name_col_header">{gettext("Indicator")}</th>
                <th className="" id="id_indicator_buttons_col_header">&nbsp;</th>
                <th className="" id="id_indicator_unit_col_header">{gettext("Unit of measure")}</th>
                <th className="text-right" id="id_indicator_baseline_col_header">{gettext("Baseline")}</th>
                <th className="text-right" id="id_indicator_target_col_header">{gettext("Target")}</th>
            </tr>
            </thead>

            <tbody>
            {indicators.map(indicator => {
                const targetPeriodLastEndDate = indicator.targetPeriodLastEndDate;
                const localizeFunc = window.localizeNumber;
                const displayFunc = indicator.isPercent ?
                        (val) => val ? `${localizeFunc(val)}%` : '' :
                        (val) => val ? `${localizeFunc(val)}` : '';
                const numberCellFunc = (val) => {
                    if (val == '' || isNaN(parseFloat(val))) {
                        return '';
                    }
                    val = parseFloat(val).toFixed(2);
                    if (val.slice(-2) == "00") {
                        return displayFunc(val.slice(0, -3));
                    } else if (val.slice(-1) == "0") {
                        return displayFunc(val.slice(0, -1));
                    }
                    return displayFunc(val);
                }
                const displayUnassignedWarning = indicator.noTargetResults.length > 0 && indicator.periodicTargets.length > 0
                const displayMissingTargetsWarning = indicator.periodicTargets.length === 0 || (targetPeriodLastEndDate && program.reportingPeriodEnd > targetPeriodLastEndDate)
                return <React.Fragment key={indicator.pk}>
                    <tr className={classNames("indicators-list__row", "indicators-list__indicator-header", {
                        "is-highlighted": indicator.wasJustCreated,
                        "is-expanded": program.isExpanded(indicator.pk)
                    })}>
                        <td>
                            <a href="#"
                               className="indicator_results_toggle btn text-action text-left"
                               tabIndex="0"
                               onClick={(e) => this.onIndicatorResultsToggleClick(e, indicator.pk)}
                            >
                                <FontAwesomeIcon icon={program.isExpanded(indicator.pk) ? 'caret-down' : 'caret-right'} />
                                <strong>{ indicator.number ? indicator.number + ':' : '' }</strong>&nbsp;
                                <span className="indicator_name">{ indicator.name }</span>
                            {indicator.isKeyPerformanceIndicator &&
                            <span className="kpi-badge badge badge-pill">KPI</span>
                            }
                            </a>
                            {displayUnassignedWarning &&
                                <span className="text-danger ml-4"><i className="fas fa-bullseye"/> {
                                    /* # Translators: Warning provided when a result is not longer associated with any target.  It is a warning about state rather than an action.  The full sentence might read "There are results not assigned to targets" rather than "Results have been unassigned from targets. */
                                    gettext('Results unassigned to targets')
                                }</span>
                            }
                            {displayMissingTargetsWarning &&
                                <span className="text-danger ml-4"><i className="fas fa-bullseye"/> {
                                        // # Translators: Warning message displayed when a critical piece of information (targets) have not been created for an indicator.
                                        gettext('Indicator missing targets')
                                }</span>
                            }
                            
                        </td>
                        <td>
                            <a href="#" className="indicator-link"
                               onClick={(e) => this.onIndicatorUpdateClick(e, indicator.pk)}><i
                                className="fas fa-cog"/></a>
                        </td>
                        <td>{indicator.unitOfMeasure}</td>
                        <td className="text-right">{ indicator.baseline === null ? gettext('N/A') : numberCellFunc(indicator.baseline) }</td>
                        <td className="text-right">{ numberCellFunc(indicator.lopTarget) }</td>
                    </tr>

                    {program.isExpanded(indicator.pk) &&
                    <tr className="indicators-list__row indicators-list__indicator-body">
                        <td colSpan="6">
                            {/* result_table.html container */}
                                <ResultsTable 
                                    indicator={ indicator } 
                                    editable={ editable } 
                                    resultEditable={ resultEditable } 
                                    displayMissingTargetsWarning={ displayMissingTargetsWarning }
                                />
                        </td>
                    </tr>
                    }
                </React.Fragment>

            })}
            </tbody>
        </table>
    }
}


const IndicatorListTableButtons = observer(function ({program, rootStore, ...props}) {
    let chosenTiers = rootStore.levelTiers.map(( level ) => level.name );
    return (
        <div className="indicator-list__buttons-row">
            <div className="expand-collapse-buttons">
                <ExpandAllButton clickHandler={ () => { program.expandAll(); }} disabled={ rootStore.allExpanded } />
                <CollapseAllButton clickHandler={ () => { program.collapseAll(); }} disabled={ rootStore.allCollapsed } />
            </div>
            {!rootStore.readOnly &&
                <div className="indicator-list__add-indicator-button">
                    {rootStore.levels.length > 0 &&
                        <ImportIndicatorsButton 
                            program_id={ program.pk }
                            chosenTiers={ chosenTiers }
                            levels={ rootStore.levels }
                            page={ "programPage" }
                        /> 
                    }
                    <AddIndicatorButton readonly={ rootStore.readOnly } programId={ program.pk }/>
                </div>
            }
        </div>
    );
})


const IndicatorList = observer(function (props) {
    const program = props.rootStore.program;

    return <React.Fragment>
        <StatusHeader indicatorCount={props.rootStore.indicators.length }
                      programId={program.pk}
                      currentIndicatorFilter={ props.uiStore.currentIndicatorFilter }
                      filterApplied={ props.uiStore.filterApplied }
                      />
        <IndicatorFilter uiStore={props.uiStore} rootStore={props.rootStore} />
        <IndicatorListTableButtons program={program} rootStore={props.rootStore} />

        {program.needsAdditionalTargetPeriods &&
            <div id="id_missing_targets_msg" className="color-red">
                <i className="fas fa-bullseye"/>&nbsp;
                {gettext('Some indicators have missing targets. To enter these values, click the target icon near the indicator name.')}
            </div>
        }

        <IndicatorListTable indicators={props.rootStore.indicators} program={program}
                                readOnly={ props.rootStore.readOnly }
                                resultReadOnly={ props.rootStore.resultReadOnly } />
    </React.Fragment>
});

export default IndicatorList;
