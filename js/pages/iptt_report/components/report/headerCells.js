import React from 'react';
import { FaRegQuestionCircle } from 'react-icons/fa';

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

class LopHeaderWithPopover extends React.Component {
    render() {
        // # Translators: label on a report, column header for a column of values that have been rounded
        const msg = gettext('All values in this report are rounded to two decimal places.');
        return (
            <span className="text-uppercase">
            { this.props.children }
                <a href="#"
                    className="popover-icon"
                    tabIndex="0"
                    data-toggle="popover"
                    data-placement="right"
                    data-trigger="focus"
                    data-content={msg} >
                    < FaRegQuestionCircle />
                </a>
            </span>        
        );
    }
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

export { HeaderCell, LopHeaderWithPopover, PeriodHeader, TVAHeader, ActualHeader }
