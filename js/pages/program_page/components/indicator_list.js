import React from 'react';
import classNames from 'classnames';
import { observer } from "mobx-react"
import eventBus from '../../../eventbus';
import { AddIndicatorButton } from '../../../components/indicatorModalComponents';

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
            readonly,
        } = this.props;

        return <div className="indicators-list__header">
            <h3 className="no-bold">
                <span id="indicators-list-title">
                    {getStatusIndicatorString(currentIndicatorFilter, indicatorCount)}
                </span>
                {filterApplied &&
                <a className="ml-2" href="#" id="show-all-indicators" onClick={this.onShowAllClick}>
                    <small>{gettext('Show all')}</small>
                </a>
                }
            </h3>
            <div>
                {!readonly &&
                <AddIndicatorButton readonly={readonly} programId={programId}/>
                }
            </div>
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
                label: i.name,
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

    onIndicatorUpdateClick(e, indicatorId) {
        e.preventDefault();

        eventBus.emit('open-indicator-update-modal', indicatorId);
    }

    onIndicatorResultsToggleClick(e, indicatorId) {
        e.preventDefault();

        if (this.props.program.resultsMap.has(indicatorId)) {
            this.props.program.deleteResultsHTML(indicatorId);
        } else {
            this.props.program.updateResultsHTML(indicatorId);
        }
    }

    render() {
        const indicators = this.props.indicators;
        const program = this.props.program;
        const resultsMap = this.props.program.resultsMap;
        return <table className="table indicators-list">
            <thead>
            <tr className="table-header">
                <th className="" id="id_indicator_name_col_header">{gettext("Indicator")}</th>
                <th className="" id="id_indicator_buttons_col_header">&nbsp;</th>
                {!program.resultsFramework && <th className="" id="id_indicator_level_col_header">{gettext("Level")}</th>}
                <th className="" id="id_indicator_unit_col_header">{gettext("Unit of measure")}</th>
                <th className="text-right" id="id_indicator_baseline_col_header">{gettext("Baseline")}</th>
                <th className="text-right" id="id_indicator_target_col_header">{gettext("Target")}</th>
            </tr>
            </thead>

            <tbody>
            {indicators.map(indicator => {
                const resultsExist = resultsMap.has(indicator.pk);
                const resultsStr = resultsExist ? resultsMap.get(indicator.pk) : "";
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
                return <React.Fragment key={indicator.pk}>
                    <tr className={classNames("indicators-list__row", "indicators-list__indicator-header", {
                        "is-highlighted": indicator.wasJustCreated,
                        "is-expanded": resultsExist
                    })}>
                        <td>
                            <a href="#"
                               className="indicator_results_toggle btn text-action text-left"
                               tabIndex="0"
                               onClick={(e) => this.onIndicatorResultsToggleClick(e, indicator.pk)}
                            >
                                <FontAwesomeIcon icon={resultsExist ? 'caret-down' : 'caret-right'} />
                                <strong>{ indicator.number ? indicator.number + ':' : '' }</strong>&nbsp;
                                <span className="indicator_name">{ indicator.name }</span>
                            </a>

                            {indicator.isKeyPerformanceIndicator &&
                            <span className="badge">KPI</span>
                            }

                            {targetPeriodLastEndDate && program.reportingPeriodEnd > targetPeriodLastEndDate &&
                            <a href={`/indicators/indicator_update/${indicator.pk}/`}
                               className="indicator-link color-red missing_targets"
                               data-toggle="modal" data-target="#indicator_modal_div"
                               data-tab="targets">
                                <i className="fas fa-bullseye"/> {
                                    /* # Translators: Adj: labels this indicator as one which is missing one or more targets */
                                    gettext('Missing targets')
                                }
                            </a>
                            }
                        </td>
                        <td>
                            <a href="#" className="indicator-link"
                               onClick={(e) => this.onIndicatorUpdateClick(e, indicator.pk)}><i
                                className="fas fa-cog"/></a>
                        </td>
                        { !program.resultsFramework && <td>{ indicator.oldLevelDisplay }</td> }
                        <td>{indicator.unitOfMeasure}</td>
                        <td className="text-right">{ indicator.baseline === null ? gettext('N/A') : numberCellFunc(indicator.baseline) }</td>
                        <td className="text-right">{ numberCellFunc(indicator.lopTarget) }</td>
                    </tr>

                    {resultsExist &&
                    <tr className="indicators-list__row indicators-list__indicator-body">
                        <td colSpan="6" ref={el => $(el).find('[data-toggle="popover"]').popover({html:true})}>
                            {/* result_table.html container */}
                                <div dangerouslySetInnerHTML={{__html: resultsStr}} />
                        </td>
                    </tr>
                    }
                </React.Fragment>

            })}
            </tbody>
        </table>
    }
}


const IndicatorList = observer(function (props) {
    const program = props.rootStore.program;

    return <React.Fragment>
        <StatusHeader indicatorCount={props.rootStore.indicators.length }
                      programId={program.pk}
                      currentIndicatorFilter={ props.uiStore.currentIndicatorFilter }
                      filterApplied={ props.uiStore.filterApplied }
                      readonly={props.rootStore.readOnly}/>

        <IndicatorFilter uiStore={props.uiStore} rootStore={props.rootStore} />

        {program.needsAdditionalTargetPeriods &&
            <div id="id_missing_targets_msg" className="color-red">
                <i className="fas fa-bullseye"/>&nbsp;
                {gettext('Some indicators have missing targets. To enter these values, click the target icon near the indicator name.')}
            </div>
        }

        <IndicatorListTable indicators={props.rootStore.indicators} program={program} />
    </React.Fragment>
});

export default IndicatorList;
