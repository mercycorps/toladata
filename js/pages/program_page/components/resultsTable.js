import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullseye, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { localizeNumber, localizePercent } from '../../../general_utilities';


const EM_DASH = "—"

// # Translators: short for Not Applicable
const N_A = gettext("N/A");

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
        // # Translators: Explains how performance is categorized as close to the target or not close to the target
        let msg = gettext("<p><strong>The actual value is %(percent)s of the target value.</strong> An indicator is on track if the result is no less than 85% of the target and no more than 115% of the target.</p><p><em>Remember to consider your direction of change when thinking about whether the indicator is on track.</em></p>")
        msg = interpolate(msg, {percent: percent}, true);
        var badgeClass;
        var onTrackMsg;
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
const ResultCells = ({ result, localizer, ...props }) => {
    return (
        <React.Fragment>
            <td className="results__result--date">
                <a href={`/indicators/result_update/${ result.pk }/`} className="results__link">
                    { result.dateCollected }
                </a>
            </td>
            <td className="results__result--value">
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
 * row(s) in the results table (one instance per target period, includes supplemental result rows and progress row)
 */
const ResultRows = ({target, indicator, ...props}) => {
    let rowspan = target.results.length || 1;
    const localizer = (val) => {
        let localized = localizeNumber(val);
        if (localized && indicator.isPercent) {
            return `${localized}%`;
        }
        return localized;
    }
    
    return (
        <React.Fragment>
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
                    <ResultCells result={ target.results[0] } localizer={ localizer } /> :
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
            {target.results.length > 1 && target.results.slice(1).map((result, idx) => (
                <tr key={idx} className={(indicator.timeAware && target.completed) ? "results__row--supplemental pt-ended" : "results__row--supplemental"} >
                    <ResultCells result={ result } localizer={ localizer } />
                </tr>
            ))}
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

const LoPRow = ({indicator, ...props}) => {
    const localizer = (val) => {
        let localized = localizeNumber(val);
        if (localized && indicator.isPercent) {
            return `${localized}%`;
        }
        return localized;
    }
    var lopMessage;
    if (indicator.isPercent || indicator.isCumulative) {
        // # Translators: explanation of the summing rules for the totals row on a list of results
        lopMessage = gettext("Results are cumulative. The Life of Program result mirrors the latest period result.")
    } else if (indicator.isCumulative) {
        lopMessage = "cumulative"
    } else {
        // # Translators: explanation of the summing rules for the totals row on a list of results
        lopMessage = gettext("Results are non-cumulative. The Life of Program result is the sum of target period results.")
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

const ResultsTableTable = ({indicator, editable, ...props}) => {
    return (
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
                        gettext('Actual')
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
                {indicator.periodicTargets.map((periodicTarget, idx) => <ResultRows key={idx} target={periodicTarget} indicator={indicator} />)}
                <LoPRow indicator={indicator} />
            </tbody>
        </table>
    );
}

const ResultsTableActions = ({indicator, editable, ...props}) => {
    return (
        <div className="results-table__actions">
            <div className="cd-actions__message"></div>
            {editable &&
                <div className="cd-actions__button">
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

const NoTargetsWarning = ({indicator, editable, ...props}) => {
    return (
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
    )
}

export default class ResultsTable extends React.Component {
    render() {
        return (
            <div className="results-table__wrapper">
                {(this.props.indicator.frequency && this.props.indicator.periodicTargets.length) ?
                    <React.Fragment>
                        <ResultsTableTable indicator={this.props.indicator} editable={this.props.editable} />
                        <ResultsTableActions indicator={this.props.indicator} editable={this.props.editable}/>
                    </React.Fragment>:
                    <NoTargetsWarning indicator={this.props.indicator} editable={this.props.editable} />
                }
            </div>
        );
    }
}