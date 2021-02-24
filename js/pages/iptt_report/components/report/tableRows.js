import React from 'react';
import { inject, observer } from 'mobx-react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import {BLANK_TABLE_CELL} from '../../../../constants';

library.add(faCaretDown, faCaretRight);

function ipttRound(value, percent) {
    if (value == gettext('N/A')) {
        return value;
    }
    if (value !== '' && !isNaN(parseFloat(value))) {
        if (!Number.isInteger(value)) {
            value = Number.parseFloat(value).toFixed(2);
            value = value.endsWith('00') ? parseInt(value) : value.endsWith('0') ? value.slice(0, -1) : value;
        } else {
            value = String(value);
        }
        return percent === true ? `${value}%` : value;
    }
    return null;
}

const IndicatorEditModalCell = inject('rootStore')(
    observer(({ rootStore, indicator }) => {
        const loadModal = (e) => {
            e.preventDefault();
            let url = `/indicators/indicator_update/${indicator.pk}/?modal=true`;
            $("#indicator_modal_content").empty();
            $("#modalmessages").empty();
            $("#indicator_modal_content").load(url);
            $("#indicator_modal_div").modal('show')
                .on('updated.tola.indicator.save', rootStore.indicatorUpdate.bind(rootStore))
                .on('deleted.tola.indicator.save', rootStore.indicatorDelete.bind(rootStore))
                .one('hidden.bs.modal', (ev) => {
                    $(ev.target).off('.tola.save');
                });
        }
        return (
            <td className="indicator-edit-modal-cell ">
                <button type="button" className="btn btn-link px-1 pt-0 float-right"
                        onClick={ loadModal }>
                    <i className="fas fa-cog"></i>
                </button>
            </td>
        );
    })
);

// **** Component to add results from the IPTT ****
const IndicatorAddResults = inject("rootStore", "filterStore")(
    observer(({ indicator, rootStore, filterStore }) => {
        const loadModal = (e) => {
            e.preventDefault();
            let url = `/indicators/result_add/${indicator.pk}/?modal=true`;
            $("#indicator_modal_content").empty();
            $("#modalmessages").empty();
            $("#indicator_results_modal_content").load(url);
            $("#indicator_results_div").modal('show')
                .on('save.tola.result_form', () => rootStore.indicatorUpdate(e, {indicatorId: indicator.pk}))
                .on('hidden.bs.modal', (ev) => {
                    $(ev.target).off('.tola.save');
                })
        }

        return (
            <td className="indicator-add-results-modal-cell">
                <div id="id_periodic_target"></div>
                
                <div //Added this element to mimic the Program Page. It seemed like the template was pulling some data from this element. 
                    style={{ visibility: 'hidden'}}
                    id={`id_link_reporting_period_${filterStore._selectedProgramId}`}
                    className=""
                    href="#"
                    data-toggle="modal"
                    data-program={filterStore._selectedProgramId}
                    data-rptstart={filterStore.programFilterData.reportingPeriodStart.toISODate()}
                    data-rptend={filterStore.programFilterData.reportingPeriodEnd.toISODate()}
                    data-indicator_count={filterStore.programFilterData.indicators.size}
                ></div>

                <button type="button" className={"btn btn-link px-1 pt-0 mx-auto"}
                    onClick={ loadModal }>
                    <FontAwesomeIcon icon={ faPlusCircle } />
                        {
                            // # Translators: a button that lets the user add a `new result
                            gettext('Add result')
                        }
                </button>
            </td>
        )
    })
)

const IndicatorResultModalCell = inject("rootStore")(
    observer(({ indicator, rootStore }) => {
        const loadModal = (e) => {
            e.preventDefault();
            rootStore.loadResultsModal(indicator.pk);
        }
        return (
            <td className="indicator-result-modal-cell ">
                <button type="button" className="btn btn-link px-1 pt-0 indicator-ajax-popup indicator-data"
                        onClick={ loadModal }>
                    <i className="fas fa-table"></i>
                </button>
            </td>
        )
    })
);

const IndicatorCell = ({ value, resultCell, ...props }) => {
    const displayValue = (value || value === 0) ? value : <span className="empty-value">{BLANK_TABLE_CELL}</span>;
    if (resultCell && resultCell === true) {
        return <td className="indicator-cell result-cell" { ...props }>{ displayValue }</td>;
    }
    return (
        <td className="indicator-cell " { ...props }>{ displayValue }</td>
    );
}

const ExpandoCell = observer(({ value, expanded, clickHandler, ...props }) => {
    const displayValue = (value || value === 0) ? value : <span className="empty-value">{BLANK_TABLE_CELL}</span>;
    return (
        <td className="expando-cell " { ...props } onClick={ clickHandler }>
            <FontAwesomeIcon icon={expanded ? 'caret-down' : 'caret-right'} />&nbsp;
            { displayValue }
        </td>
    );
})

const IndicatorNameExpandoCell = observer(({ value, expanded, clickHandler, ...props }) => {
    const displayValue = (value || value === 0) ? value : BLANK_TABLE_CELL;
    return (
        <td className="indicator-cell expando-cell " { ...props } onClick={ clickHandler }>
            { displayValue }
        </td>
    );
})


const localizeFunc = window.localizeNumber;


const PercentCell = ({ value, ...props }) => {
    value = (value !== undefined && value !== null) ? `${localizeFunc(value)}%` : null;
    return <IndicatorCell className="indicator-cell percent-cell" value={ value } { ...props } />;
}

const NumberCell = ({ value, ...props }) => {
    value = (value !== undefined && value !== null) ? localizeFunc(value) : null;
    return <IndicatorCell className="indicator-cell number-cell" value={ value } { ...props } />;
}

const TVAResultsGroup = ({ value, resultCell, ...props }) => {
    return (
        <React.Fragment>
            <NumberCell value={ value.target } />
            <NumberCell value={ value.actual } />
            <PercentCell value={ value.met }/>
        </React.Fragment>
    );
}

const TVAResultsGroupPercent = ({ value, resultCell, ...props }) => {
    return (
        <React.Fragment>
            <PercentCell value={ value.target } />
            <PercentCell value={ value.actual } />
            <PercentCell value={ value.met }/>
        </React.Fragment>
    );
}

const DisaggregationTable = inject('rootStore')(
    observer(({indicator, disaggregationPk, rootStore}) => {
        let disaggregation = rootStore.getDisaggregationLabels(disaggregationPk);
        if (!disaggregation) {
            return null;
        }
        var ValueCell = NumberCell;
        if (indicator.isPercent) {
            ValueCell = PercentCell;
        }
        let labels = rootStore.hiddenCategories ? disaggregation.labels.filter(label => rootStore.disaggregatedLop(indicator.pk, label.pk)) : disaggregation.labels;
        if (!labels) {
            return <React.Fragment></React.Fragment>;
        }
        return (
            <React.Fragment>
                {
                    labels.map(
                        (label, idx) => (
                            <tr
                                className={ (idx == labels.length - 1) ?
                                    "disaggregation-end-row" :
                                    ""
                                }
                                key={idx}>
                                {idx == 0 &&
                                <td className="disaggregation-name-cell"
                                    colSpan={ 2 }
                                    rowSpan={labels.length}>
                                    {disaggregation.name}</td>
                                }
                                <td colSpan={ rootStore.hasBaselineColumn ? rootStore.baseColumns - 2 : rootStore.baseColumns - 1 } className="disaggregation-label-cell">{ label.name }</td>
                                { rootStore.hasBaselineColumn &&
                                    <td className="disaggregation-value-cell base-column empty-value">—</td>
                                }
                                <td className="disaggregation-value-cell lop-column empty-value">—</td>
                                <ValueCell className="disaggregation-value-cell lop-column" value={ ipttRound(rootStore.disaggregatedLop(indicator.pk, label.pk), false) } />
                                <td className="disaggregation-value-cell lop-column empty-value">—</td>
                                {
                                    rootStore.disaggregatedPeriodValues(indicator.pk, label.pk).map(
                                        (periodValue, idx) => {
                                            return rootStore.isTVA ?
                                                <React.Fragment key={idx}>
                                                    <td className="disaggregation-value-cell empty-value">—</td>
                                                    <ValueCell key={idx} value={ periodValue.actual } />
                                                    <td className="disaggregation-value-cell empty-value">—</td>
                                                </React.Fragment> :
                                                <ValueCell key={idx} value={ periodValue } />
                                        })
                                }
                            </tr>
                        )
                    )
                }
            </React.Fragment>
        );
    }
))


@inject('rootStore')
@observer
class IndicatorRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        };
    }

    componentDidMount() {
        this.props.rootStore._expandoRows.push(this);
    }

    componentWillUnmount() {
        this.props.rootStore._expandoRows = this.props.rootStore._expandoRows.filter(row => row != this);
    }

    handleExpandoClick = (e) => {
        this.setState({expanded: !this.state.expanded});
    }

    expandRow = () => {
        this.setState({expanded: true});
    }

    collapseRow = () => {
        this.setState({expanded: false});
    }

    render() {
        let indicator = this.props.indicator;
        let rootStore = this.props.rootStore;
        var ValueCell;
        var PeriodCell;
        if (indicator.isPercent) {
            ValueCell = PercentCell;
            PeriodCell = rootStore.isTVA ? TVAResultsGroupPercent : PercentCell;
        } else {
            ValueCell = NumberCell;
            PeriodCell = rootStore.isTVA ? TVAResultsGroup : NumberCell;
        }
        let cumulative = indicator.isCumulative === null ? null
                : indicator.isCumulative ? gettext('Cumulative')
                            : gettext('Non-cumulative');
        let displayNumber = indicator.number;
        if (displayNumber && displayNumber.length > 0 && displayNumber.slice(-1) == ":") {
            displayNumber = displayNumber.slice(0, -1);
        }
        let reportData = rootStore.getReportData(indicator.pk);
        return (
            <React.Fragment>
                <tr>
                    {rootStore.indicatorHasActiveDisaggregations(indicator) ?
                    <ExpandoCell value={ displayNumber } expanded={ this.state.expanded } clickHandler={ this.handleExpandoClick } /> :
                    <IndicatorCell className="indicator-cell " value={ displayNumber } />
                    }
                    <IndicatorResultModalCell indicator={ indicator } />
                    <IndicatorEditModalCell indicator={ indicator } />
                    {rootStore.indicatorHasActiveDisaggregations(indicator) ?
                    <IndicatorNameExpandoCell value={ indicator.name } expanded={ this.state.expanded } clickHandler={ this.handleExpandoClick } /> :
                    <IndicatorCell className="indicator-cell " value={ indicator.name } />
                    }
                    <IndicatorAddResults indicator={ indicator } />
                    { !rootStore.resultsFramework && <IndicatorCell className="indicator-cell " value={ indicator.oldLevelDisplay } /> }
                    { rootStore.hasUOMColumn && <IndicatorCell className="indicator-cell " value={ indicator.unitOfMeasure } /> }
                    { rootStore.hasChangeColumn && <IndicatorCell className="indicator-cell center-cell" value={ indicator.directionOfChange || gettext('N/A') } /> }
                    { rootStore.hasCNCColumn && <IndicatorCell className="indicator-cell " value={ cumulative || gettext('N/A') } /> }
                    { rootStore.hasUOMTypeColumn && <IndicatorCell className="indicator-cell is-percent-column center-cell" value={ indicator.isPercent ? '%' : '#' } /> }
                    { rootStore.hasBaselineColumn && (indicator.baseline === null ? <IndicatorCell className="indicator-cell baseline-column" value={ gettext('N/A') } /> : <ValueCell value={ indicator.baseline } className="lop-column" /> ) }
                    { reportData && (
                    <React.Fragment>
                    <ValueCell value={ reportData.lopTarget } className="lop-column " />
                    <ValueCell value={ reportData.lopActual } className="lop-column" />
                    <PercentCell value={ reportData.lopMet } className="lop-column" />
                    {reportData.periodValues &&
                        (rootStore.periodValues(indicator.pk).map(
                            (value, index) => <PeriodCell value={ value } key={ index } resultCell={ true }/>
                        ))
                    }
                    </React.Fragment>
                    )}
                </tr>
                { this.state.expanded &&
                    <React.Fragment>
                    { rootStore.activeDisaggregationPks.filter(pk => indicator.hasDisaggregation(pk))
                        .map(pk => (
                            <React.Fragment key={ pk }>
                                <DisaggregationTable indicator={ indicator } disaggregationPk={ pk } />
                            </React.Fragment>
                        ))
                    }
                    </React.Fragment>
                }
            </React.Fragment>
        );
    }
}

const LevelTitleRow = inject('rootStore')(
    observer(({ rootStore, children }) => {
        return (
            <tr>
                <td colSpan={ rootStore.reportColumnWidth + 1 }
                    className="iptt-level-row">
                   { children }
                </td>
            </tr>
        )
    })
);

const LevelRow = ({ level }) => {
    return (
        <LevelTitleRow>
             { level.tierNumber }: { level.name }
        </LevelTitleRow>
    )
}

const BlankLevelRow = () => {
    return (
        <LevelTitleRow>
        {
            gettext('Indicators unassigned to a results framework level')
        }
        </LevelTitleRow>
    )
}

const LevelGroup = ({ level, indicators }) => {
    return (
        <React.Fragment>
            {
                level ? <LevelRow level={ level } />
                      : (indicators && indicators.length > 0) && <BlankLevelRow />
            }
            {
                indicators.map(
                    (indicator, index) => (
                        <IndicatorRow indicator={ indicator }
                                      levelCol={ false }
                                      key={ index } />
                                      )
                )
            }
        </React.Fragment>
    );
}


export { LevelGroup, IndicatorRow };
