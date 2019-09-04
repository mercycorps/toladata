import React from 'react';
import { inject, observer } from 'mobx-react';
import {BLANK_TABLE_CELL} from '../../../../constants';

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
            <td className="td-no-side-borders">
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
            <td className="td-no-side-borders">
                <button type="button" className="btn btn-link p-1 indicator-ajax-popup indicator-data"
                        onClick={ loadModal }>
                    <i className="fas fa-table"></i>
                </button>
                { indicator.name }
            </td>
        )
    })
);

const IndicatorCell = ({ value, resultCell, ...props }) => {
    const displayValue = (value || value === 0) ? value : BLANK_TABLE_CELL;
    if (resultCell && resultCell === true) {
        return <td { ...props }>{ displayValue }</td>;
    }
    return (
        <td className="td-no-side-borders" { ...props }>{ displayValue }</td>
    );
}


const PercentCell = ({ value, ...props }) => {
    value = (value !== undefined && value !== null) ? `${value}%` : null;
    return <IndicatorCell value={ value } align="right" { ...props } />;
}

const NumberCell = ({ value, ...props }) => {
    return <IndicatorCell value={ value } align="right" { ...props } />;
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

const IndicatorRow = inject('rootStore', 'reportStore')(
    observer(({ rootStore, reportStore, indicator }) => {
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
            <tr>
                <IndicatorCell value={ displayNumber } />
                <IndicatorResultModalCell indicator={ indicator } />
                <IndicatorEditModalCell indicator={ indicator } />
                { !rootStore.resultsFramework && <IndicatorCell value={ indicator.oldLevelDisplay } /> }
                <IndicatorCell value={ indicator.unitOfMeasure } />
                <IndicatorCell value={ indicator.directionOfChange || gettext('N/A') } align="center" />
                <IndicatorCell value={ cumulative || gettext('N/A') } />
                <IndicatorCell value={ indicator.isPercent ? '%' : '#' } align="center" />
                { indicator.baseline === null ? <IndicatorCell value={ gettext('N/A') } align="right"/> : <ValueCell value={ indicator.baseline } /> }
                { reportData && (
                <React.Fragment>
                <ValueCell value={ reportData.lopTarget } />
                <ValueCell value={ reportData.lopActual } />
                <PercentCell value={ reportData.lopMet } />
                {reportData.periodValues &&
                    (rootStore.periodValues(indicator.pk).map(
                        (value, index) => <PeriodCell value={ value } key={ index } resultCell={ true }/>
                    ))
                }
                </React.Fragment>
                )}

            </tr>
        );
    })
);

const LevelTitleRow = inject('rootStore')(
    observer(({ rootStore, children }) => {
        return (
            <tr>
            <td colSpan={ rootStore.reportColumnWidth }
                className="iptt-level-row"
            >
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
