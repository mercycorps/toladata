import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ResultRow = ({periodicTarget, ...props}) => {
    let rowspan = 1;
    return (
        <tr className="results__row--main">
            <td rowSpan={rowspan} className="results__row__target-period"></td>
            <td rowSpan={rowspan} className="text-right"></td>
            <td rowSpan={rowspan} className="text-right"></td>
            <td rowSpan={rowspan} className="text-right td--pad"></td>
            <td className="results__result--date"></td>
            <td className="results__result--value"></td>
            <td className="td--stretch results__result--url"></td>
        </tr>
    )
}

const ResultsTableActions = ({...props}) => {
    return (
        <div className="results-table__actions">
        </div>
    );
}


export default class ResultsTable extends React.Component {
    render() {
        return (
            <div className="results-table__wrapper">
            {this.props.indicator.frequency ? (<React.Fragment>
                <table className="table results-table">
                    <thead>
                        <tr className="table-header">
                            <th>{ gettext("Target period") }</th>
                            <th className="text-right">{ gettext("Target") }</th>
                            <th className="text-right">{ gettext("Actual") }</th>
                            <th className="td--pad text-right">{ gettext("% Met") }</th>
                            <th colSpan="2">{ gettext("Results") }</th>
                            <th className="td--stretch">{ gettext("Evidence") }</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.props.periodicTargets.map(periodicTarget => {
                        <ResultRow periodicTarget={periodicTarget} />
                    })}
                    </tbody>
                </table>
                <ResultsTableActions />
            </React.Fragment>) : (
                <div className="text-danger">
                    <FontAwesomeIcon icon="fa-bullseye" />&nbsp;{ gettext("This indicator has no targets.") }
                    {this.props.editable &&
                        <a href={`/indicators/indicator_update/${this.props.indicator.pk}/`}
                           data-tab="#targets"
                           className="indicator-link btn btn-success">
                            <FontAwesomeIcon icon="fa-plus-circle" />&nbsp;{ gettext("Add targets") }
                        </a>
                    }
                </div>
            )}
            </div>
        );
    }
}