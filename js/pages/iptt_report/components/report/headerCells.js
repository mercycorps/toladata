import React from 'react';

const HeaderCell = ( props ) => {
    let style = props.styleWidth ? {
        minWidth: `${props.styleWidth}px`
    } : {};
    return (
        <th
            scope="col"
            colSpan={ props.colSpan }
            className={ props.className }
            style={ style }>
            { props.label }
        </th>
    )
}


const PeriodHeader = ( props ) => {
    return (
        <td scope="colgroup" colSpan={ props.isTVA ? 3 : 1}
            className="iptt-period-header">
            <span className="text-uppercase">{ props.period.name }</span>
            { props.period.range &&
                <React.Fragment>
                    <br />
                    <small>{ props.period.range }</small>
                </React.Fragment>
            }
        </td>
    )
}

const TargetHeader = () => {
    return (
        <th
            scope="col"
            className="iptt-period-subheader"
            style={{minWidth: '110px'}}>
            {
                /* # Translators: Column header for a target value column */
                gettext('Target')
            }
        </th>
    )
}

const ActualHeader = () => {
    return (
        <th
            scope="col"
            className="iptt-period-subheader"
            style={{minWidth: '110px'}}>
            {
                /* # Translators: Column header for an "actual" or achieved/real value column */
                pgettext('report (long) header', 'Actual')
            }
        </th>
    )
}

const PercentMetHeader = () => {
    return (
        <th
            scope="col"
            className="iptt-period-subheader"
            style={{minWidth: '110px'}}>
            {
                /* # Translators: Column header for a percent-met column */
                gettext('% Met')
            }
        </th>
    )
}

const TVAHeader = () => {
    return (
        <React.Fragment>
            <TargetHeader />
            <ActualHeader />
            <PercentMetHeader />
        </React.Fragment>
    )
}

export { HeaderCell, PeriodHeader, TVAHeader, ActualHeader }
