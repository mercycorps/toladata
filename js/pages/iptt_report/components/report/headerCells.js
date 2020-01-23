import React from 'react';

const BorderedHeader = ( { label, styleWidth } ) => {
    let style = styleWidth ? {
        minWidth: `${styleWidth}px`
    } : {};
    return (
        <th
            scope="col"
            className="align-bottom text-uppercase"
            style={style}
        >{ label }</th>
    );
}

const UnBorderedHeader = ( props ) => {
    let style = props.styleWidth ? {
        minWidth: `${props.styleWidth}px`
    } : {};
    return (
        <th
            scope="col"
            colSpan={ props.colSpan }
            className="align-bottom text-uppercase td-no-side-borders"
            style={style}
        >{ props.label }</th>
    );
}

const PeriodHeader = ( props ) => {
    return (
        <td scope="colgroup" colSpan={ props.isTVA ? 3 : 1}
            className="text-center title-row text-nowrap align-bottom">
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
            className="align-bottom text-uppercase text-right"
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
            className="align-bottom text-uppercase text-right"
            style={{minWidth: '110px'}}>
            {
                /* # Translators: Column header for an "actual" or achieved/real value column */
                gettext('Actual')
            }
        </th>
    )
}

const PercentMetHeader = () => {
    return (
        <th
            scope="col"
            className="align-bottom text-uppercase text-right"
            style={{minWidth: '110px'}}>
            {
                /* # Translators: Column header for a percent-met column */
                gettext('% met')
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

export { BorderedHeader, UnBorderedHeader, PeriodHeader, TVAHeader, ActualHeader }
