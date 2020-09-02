import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullseye, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { localizeNumber, localizePercent } from '../../../general_utilities';
import { EM_DASH } from '../../../constants';


// # Translators: short for Not Applicable
const N_A = gettext("N/A");


/* For passing the localizer function down to the various parts of the results table, we need a context item.
 * Note: this replaces the <provider>/@inject methods from mobx-react with a less-opinionated context.
 * Default value (just localizenumber, no percent) is only used for testing (when no Provider) exists.
 * Docs: https://reactjs.org/docs/context.html
 */
const LocalizerContext = React.createContext(localizeNumber);


/*
 * Creates a <span class="badge">xx%</span> component that when clicked pops up help text
 * using bootstraps popover library
 */
class ProgressPopover extends React.Component {
    componentDidMount() {
        // Enable popovers after mount (they break otherwise)
        $('*[data-toggle="popover"]').popover({
            html: true
        });
    }
    
    render() {
        const percent = localizePercent(this.props.val);
        var badgeClass, onTrackMsg, msg;
        
        msg = interpolate(
            // # Translators: Explains how performance is categorized as close to the target or not close to the target
            gettext("<p><strong>The actual value is %(percent)s of the target value.</strong> An indicator is on track if the result is no less than 85% of the target and no more than 115% of the target.</p><p><em>Remember to consider your direction of change when thinking about whether the indicator is on track.</em></p>"),
            {percent: percent}, true);

        if (percent && this.props.val > 0.85 && this.props.val < 1.15) {
            badgeClass = "badge-success-light";
            // # Translators: Label for an indicator that is within a target range
            onTrackMsg = gettext("On track");
        } else {
            badgeClass = "badge-warning-light";
            // # Translators: Label for an indicator that is above or below the target value
            onTrackMsg = gettext("Not on track");
        }
        const content = `<h4 class="badge ${badgeClass}">${onTrackMsg}</h4>${msg}`;
        return (
            <strong>
                <span tabIndex="0" className={`badge ${badgeClass}`} data-toggle="popover"
                    data-placement="right" data-trigger="focus" data-content={content}>
                    {percent}
                </span>
            </strong>
        )
    }
}

/**
 * the cells in the results table containing result date, value, and evidence link, with formatting
 */
const ResultCells = ({ result, noTarget, ...props }) => {
    const localizer = useContext(LocalizerContext);
    let noTargetsClass = noTarget ? " bg-danger-lighter" : "";
    return (
        <React.Fragment>
            <td className={`results__result--date ${noTargetsClass}`} >
                <a href={`/indicators/result_update/${ result.pk }/`} className="results__link">
                    { result.dateCollected }
                </a>
            </td>
            <td className={`results__result--value ${noTargetsClass}`}>
                { localizer(result.achieved) }
            </td>
            <td className="td--stretch results__result--url">
                {result.evidenceUrl &&
                    <a href={ result.evidenceUrl } target="_blank">{ result.recordName || result.evidenceUrl }</a>
                }
            </td>
        </React.Fragment>
    );
}

/**
 * row(s) in the results table
 *  - one instance per target period
 *  - includes supplemental result rows if more than one result for this target period
 *  - includes progress summation row if this target period is the most recently completed one
 */
const TargetPeriodRows = ({target, indicator, ...props}) => {
    const localizer = useContext(LocalizerContext);
    let rowspan = target.results.length || 1;
    return (
        <React.Fragment>
            {/* First row has target period info, and first result (if there is a first result)
              * rowSpan property on target period info cells so they are the height of all associated result rows
              **/}
            <tr className={(indicator.timeAware && target.completed) ? "results__row--main pt-ended" : "results__row--main"} >
                <td rowSpan={ rowspan } className="results__row__target-period">
                    <div>
                        <strong className="text-uppercase">{target.periodName}</strong>
                    </div>
                    {target.dateRange &&
                        <div className="text-nowrap">
                            <small>{target.dateRange}</small>
                        </div>
                    }
                </td>
                <td rowSpan={ rowspan } className="text-right">
                    { localizer(target.target) || EM_DASH }
                </td>
                <td rowSpan={ rowspan } className="text-right">
                    { localizer(target.actual) || EM_DASH }
                </td>
                <td rowSpan={ rowspan } className="text-right td--pad">
                {(target.percentMet && target.completed) ?
                    <ProgressPopover val={ target.percentMet } /> :
                    <span className="badge">{ localizePercent(target.percentMet) || N_A }</span>
                }
                </td>
                {(target.results && target.results.length > 0) ?
                    <ResultCells result={ target.results[0] } noTarget={ false }/> :
                    <React.Fragment>
                        <td className="results__result--nodata" colSpan="2">
                        {
                            // # Translators: Shown in a results cell when there are no results to display
                            gettext("No results reported")
                        }
                        </td>
                        <td></td>
                    </React.Fragment>
                }
                
            </tr>
            {/* If there are multiple results, add "supplemental" rows - target period cells are rowspan'd to
              * fill this row also, so just add the result cells for the 2nd->nth results
              **/}
            {target.results.length > 1 && target.results.slice(1).map((result, idx) => (
                <tr key={idx} className={(indicator.timeAware && target.completed) ? "results__row--supplemental pt-ended" : "results__row--supplemental"} >
                    <ResultCells result={ result } noTarget={ false } />
                </tr>
            ))}
            {/* If this was the "most recently completed" target period, add a progress row
              * Note: rules for what period is considered "most recently completed" to show progress row in
              * only the correct (time-aware, program not completed, etc.) situations all done at the back-end
              * (in the program page indicator serializer)
              * */}
            {target.mostRecentlyCompleted &&
                <tr className="results__row--subtotal">
                    <td>
                        <div><em><strong>{
                            // # Translators: Label for a row showing totals from program start until today
                            gettext("Program to date")
                        }</strong></em></div>
                        <div className="text-nowrap"><small>{ indicator.reportingPeriod }</small></div>
                    </td>
                    <td className="text-right"><strong>
                        { localizer(indicator.lopTargetProgress) || EM_DASH }
                    </strong></td>
                    <td className="text-right"><strong>
                        { localizer(indicator.lopActualProgress) || EM_DASH }
                    </strong></td>
                    <td className="text-right">{indicator.lopMetProgress ?
                        <ProgressPopover val={indicator.lopMetProgress} /> :
                        <span className="badge">{ N_A }</span>
                    }</td>
                    <td colSpan="3" className="bg-medium"></td>
                </tr>
            }
        </React.Fragment>
    )
}

/*
 * Row for orphaned results - target period cells are blank, Result cells render with a warning background
 *  - noTarget={true} produces the warning background
 */
const NoTargetResultRow = ({result, ...props}) => {
    return (
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <ResultCells result={ result } noTarget={ true }/>
        </tr>
    );
}


/*
 *  Summative row at the bottom of a results table.  Always shown if table is shown, even if all cells are blank
 *  Contains a message (stretched across result/evidence columns) explaining summation rules
 */
const LoPRow = ({indicator, ...props}) => {
    const localizer = useContext(LocalizerContext);
    var lopMessage;
    if (indicator.noTargets) {
        // if no targets, don't explain summing, it competes with the "add targets" messaging
        lopMessage = "";
    }
    else if (indicator.isPercent || indicator.isCumulative) {
        // # Translators: explanation of the summing rules for the totals row on a list of results
        lopMessage = gettext("Results are cumulative. The Life of Program result mirrors the latest period result.");
    } else {
        // # Translators: explanation of the summing rules for the totals row on a list of results
        lopMessage = gettext("Results are non-cumulative. The Life of Program result is the sum of target period results.");
    }
    return (
        <tr className="bg-white">
            <td><strong>{
                // # Translators: identifies a results row as summative for the entire life of the program
                gettext('Life of Program')
                }</strong></td>
            <td className="text-right"><strong>{ localizer(indicator.lopTarget) || EM_DASH }</strong></td>
            <td className="text-right"><strong>{ localizer(indicator.lopActual) || EM_DASH }</strong></td>
            <td className="text-right"><span className="badge">{ localizePercent(indicator.lopMet) || N_A }</span></td>
            <td colSpan="3"><div className="help-text">{ lopMessage }</div></td>
        </tr>
    )
}

/*
 * Table section of the results table (rows are results)
 *  - Header (column headers)
 *  - Periodic Target row(s) for each target period provided (not shown if no targets assigned)
 *      - this includes supplemental rows for multiple results on one target period
 *      - this includes the "progress row" after the most recently completed period if applicable
 *  - Summative "LoP" row for life of program totals
 */
const ResultsTableTable = ({indicator, editable, ...props}) => {
    const localizer = (val) => {
        let localized = localizeNumber(val);
        if (localized && indicator.isPercent) {
            return `${localized}%`;
        }
        return localized;
    }
    return (
        <LocalizerContext.Provider value={ localizer }>
            <table className="table results-table">
                <thead>
                    <tr className="table-header">
                        <th>{
                            // # Translators: Header for a column listing periods in which results are grouped
                            gettext('Target period')
                        }</th>
                        <th className="text-right">{
                            // # Translators: Header for a column listing values defined as targets for each row
                            gettext('Target')
                        }</th>
                        <th className="text-right">{
                            // # Translators: Header for a column listing actual result values for each row
                            pgettext('table (short) header', 'Actual')
                        }</th>
                        <th className="td--pad text-right">{
                            // # Translators: Header for a column listing the progress towards the target value
                            gettext('% Met')
                        }</th>
                        <th colSpan="2">{
                            // # Translators: Header for a column listing actual results for a given period
                            gettext('Results')
                        }</th>
                        <th className="td--stretch">{
                            // # Translators: Header for a column listing supporting documents for results
                            gettext('Evidence')
                        }</th>
                    </tr>
                </thead>
                <tbody>
                    {indicator.periodicTargets.map((periodicTarget, idx) => <TargetPeriodRows key={`targetrow-${idx}`} target={periodicTarget} indicator={indicator} />)}
                    {indicator.noTargetResults.map((result, idx) => <NoTargetResultRow key={`notarget-${idx}`} result={ result } />)}
                    <LoPRow indicator={indicator} />
                </tbody>
            </table>
        </LocalizerContext.Provider>
    );
}

/*
 *  Actions/Messages section under the results table (shows even if no table is displayed)
 *      Actions:
 *          - add targets button (shown if targets are not set up && "editable" is true (permissions to edit))
 *          - add result button (shown if editable is true, disabled if targets are not set up)
 *      Messages:
 *          - "This indicator has no targets" - shown if true
 */
const ResultsTableActions = ({indicator, editable, resultEditable, ...props}) => {
    return (
        <div className="results-table__actions">
            <div className="cd-actions__message">
            {indicator.noTargets &&
                <div className="text-danger">
                    <FontAwesomeIcon icon={ faBullseye } />
                    {
                        // # Translators: Message displayed in place of a table that cannot be shown without targets having been set up
                        gettext('This indicator has no targets.')
                    }
                    { editable &&
                        <a href={`/indicators/indicator_update/${indicator.pk}/`}
                           data-tab="#targets" className="indicator-link btn btn-success">
                           <FontAwesomeIcon icon={ faPlusCircle } />
                           {
                                // # Translators: Button label which opens a form to add targets to a given indicator
                                gettext('Add targets')
                           }
                        </a>
                    }
                </div>    
            }
            </div>
            {resultEditable &&
                <div className={indicator.noTargets ? "cd-actions__button disable-span" : "cd-actions__button"}>
                    <a href={`/indicators/result_add/${indicator.pk}/`}
                        className="btn-link btn-add results__link">
                        <FontAwesomeIcon icon={ faPlusCircle } />
                        {
                            // # Translators: a button that lets the user add a new result
                            gettext('Add result')
                        }
                    </a>
                </div>
            }
        </div>
    );
}


/*
 * Results table consists of a table with rows for each target period, and an "Actions/messages" section below
 *  Table only shows if there are targets and/or results (an indicator with no targets and no results recorded
 *  only gets the "actions" section)
 */
export default class ResultsTable extends React.Component {
    render() {
        let showTable = (!this.props.indicator.noTargets || this.props.indicator.noTargetResults.length > 0);
        return (
            <div className="results-table__wrapper">
                {showTable &&
                    <ResultsTableTable indicator={this.props.indicator} editable={this.props.editable} />
                }
                <ResultsTableActions indicator={this.props.indicator} editable={this.props.editable}
                    resultEditable={ this.props.resultEditable } />
            </div>
        );
    }
}