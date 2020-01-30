import React from 'react';
import { inject, observer } from 'mobx-react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
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
            <td className="indicator-edit-modal-cell base-column">
                <button type="button" className="btn btn-link p-1 float-right"
                        onClick={ loadModal }>
                    <i className="fas fa-cog"></i>
                </button>
            </td>
        );
    })
);


const IndicatorResultModalCell = inject("rootStore")(
    observer(({ indicator, rootStore }) => {
        const loadModal = (e) => {
            e.preventDefault();
            rootStore.loadResultsModal(indicator.pk);
        }
        return (
            <td className="indicator-result-modal-cell base-column">
                <button type="button" className="btn btn-link p-1 indicator-ajax-popup indicator-data"
                        onClick={ loadModal }>
                    <i className="fas fa-table"></i>
                </button>
            </td>
        )
    })
);

const IndicatorCell = ({ value, resultCell, ...props }) => {
    const displayValue = (value || value === 0) ? value : BLANK_TABLE_CELL;
    if (resultCell && resultCell === true) {
        return <td className="indicator-cell result-cell" { ...props }>{ displayValue }</td>;
    }
    return (
        <td className="indicator-cell base-column" { ...props }>{ displayValue }</td>
    );
}

const ExpandoCell = observer(({ value, expanded, clickHandler, ...props }) => {
    const displayValue = (value || value === 0) ? value : BLANK_TABLE_CELL;
    return (
        <td className="expando-cell base-column" { ...props } onClick={ clickHandler }>
            <FontAwesomeIcon icon={expanded ? 'caret-down' : 'caret-right'} />&nbsp;
            { displayValue }
        </td>
    );
})

const IndicatorNameExpandoCell = observer(({ value, expanded, clickHandler, ...props }) => {
    const displayValue = (value || value === 0) ? value : BLANK_TABLE_CELL;
    return (
        <td className="indicator-cell expando-cell base-column" { ...props } onClick={ clickHandler }>
            { displayValue }
        </td>
    );
})


const PercentCell = ({ value, ...props }) => {
    value = (value !== undefined && value !== null) ? `${value}%` : null;
    return <IndicatorCell className="indicator-cell percent-cell" value={ value } { ...props } />;
}

const NumberCell = ({ value, ...props }) => {
    return <IndicatorCell className="indicator-cell number-cell" value={ value } { ...props } />;
}

const TVAResultsGroup = ({ value, resultCell, ...props }) => {
    return (
        <React.Fragment>
            <NumberCell value={ value.target } />
            <NumberCell value={ value.actual } />
            <PercentCell value={ value.percent_met }/>
        </React.Fragment>
    );
}

const TVAResultsGroupPercent = ({ value, resultCell, ...props }) => {
    return (
        <React.Fragment>
            <PercentCell value={ value.target } />
            <PercentCell value={ value.actual } />
            <PercentCell value={ value.percent_met }/>
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
        return (
            <React.Fragment>
                {
                    disaggregation.labels.map(
                        (label, idx) => (
                            <tr key={idx}>
                                {idx == 0 &&
                                <td className="disaggregation-name-cell" rowSpan={disaggregation.labels.length}>
                                    {disaggregation.name}</td>
                                }
                                <td colSpan={ rootStore.hasBaselineColumn ? rootStore.baseColumns - 1 : rootStore.baseColumns } className="disaggregation-label-cell">{label.name}</td>
                                { rootStore.hasBaselineColumn &&
                                <td className="disaggregation-value-cell lop-column" >—</td>
                                }
                                <td className="disaggregation-value-cell lop-column" >—</td>
                                <ValueCell className="disaggregation-value-cell lop-column" value={ ipttRound(rootStore.disaggregatedLop(indicator.pk, label.pk), false) } />
                                <td className="disaggregation-value-cell lop-column" >—</td>
                                {
                                    rootStore.disaggregatedPeriodValues(indicator.pk, label.pk).map(
                                        (periodValue, idx) => {
                                            return rootStore.isTVA ?
                                                <React.Fragment key={idx}>
                                                    <td></td>
                                                    <ValueCell key={idx} value={ periodValue.actual } />
                                                    <td></td>
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
        this.props.rootStore._expandoRows.push(this);
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
                    {indicator.hasDisaggregations(rootStore.activeDisaggregationPks) ?
                    <ExpandoCell value={ displayNumber } expanded={ this.state.expanded } clickHandler={ this.handleExpandoClick } /> :
                    <IndicatorCell className="indicator-cell base-column" value={ displayNumber } />
                    }
                    <IndicatorResultModalCell indicator={ indicator } />
                    {indicator.hasDisaggregations(rootStore.activeDisaggregationPks) ?
                    <IndicatorNameExpandoCell value={ indicator.name } expanded={ this.state.expanded } clickHandler={ this.handleExpandoClick } /> :
                    <IndicatorCell className="indicator-cell base-column" value={ indicator.name } />
                    }
                    <IndicatorEditModalCell indicator={ indicator } />
                    { !rootStore.resultsFramework && <IndicatorCell className="indicator-cell base-column base-column" value={ indicator.oldLevelDisplay } /> }
                    { rootStore.hasUOMColumn && <IndicatorCell className="indicator-cell base-column" value={ indicator.unitOfMeasure } /> }
                    { rootStore.hasChangeColumn && <IndicatorCell className="indicator-cell base-column" value={ indicator.directionOfChange || gettext('N/A') } /> }
                    { rootStore.hasCNCColumn && <IndicatorCell className="indicator-cell base-column" value={ cumulative || gettext('N/A') } /> }
                    { rootStore.hasUOMTypeColumn && <IndicatorCell className="indicator-cell is-percent-column base-column" value={ indicator.isPercent ? '%' : '#' } /> }
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
                    <tr className="expando-table-row-spacer">
                        <td colSpan={ rootStore.reportColumnWidth }></td>
                    </tr>
                    { rootStore.activeDisaggregationPks.filter(pk => indicator.hasDisaggregation(pk))
                        .map(pk => (
                            <React.Fragment key={ pk }>
                                <DisaggregationTable indicator={ indicator } disaggregationPk={ pk } />
                                <tr className="expando-table-row-spacer">
                                    <td colSpan={ rootStore.reportColumnWidth }></td>
                                </tr>
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
                <td colSpan={ rootStore.reportColumnWidth + 1 /* TODO: might be off by one ? */}
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
