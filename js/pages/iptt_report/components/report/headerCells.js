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

class LopActualHeaderCell extends React.Component {
    constructor( props ) {
        super(props);
        this.style = props.styleWidth ? {
            minWidth: `${props.styleWidth}px`
        } : {};
    }
    componentDidMount() {
        // Enable popovers after mount (they break otherwise)
        $('*[data-toggle="popover"]').popover();
    }
    render() {
        // # Translators: label on a report, column header for a column of values that have been rounded
        const msg = gettext('All actual values in this report are rounded to two decimal places.');
        return (
            <th
                scope="col"
                colSpan={ this.props.colSpan }
                className={ this.props.className }
                style={ this.style }>
                { this.props.label }
                <a href="#"
                    className="popover-icon"
                    tabIndex="0"
                    data-toggle="popover"
                    data-placement="right"
                    data-trigger="focus"
                    data-content={msg} >
                    < FaRegQuestionCircle />
                </a>
            </th>        
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
                gettext('Actual')
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

export { HeaderCell, LopActualHeaderCell, PeriodHeader, TVAHeader, ActualHeader }
