import React from 'react';
import { computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import HeaderRow from './headers';
import { trimOntology } from '../../../level_utils'

const LevelNameCell = ({ name, rowCount }) => {
    return (
        <td className="logframe__cell--level" rowSpan={ rowCount < 1 ? 1 : rowCount }>
            { name }
        </td>
    )
}

const IndicatorCell = ({ indicator, ontology }) => {
    if (indicator == null){
      return (
        <td className="logframe__cell--indicator">
        </td>
    );
    }
    var name;
    var number = false;
    if (indicator.manualNumbering) {
        number = (indicator.number ? `${indicator.number}` : false);
    } else if (ontology || indicator.level_order_display) {
        number = `${trimOntology(ontology)}${indicator.level_order_display}`;
    }
    if (number) {
        name = `${gettext('Indicator')} ${number}: ${indicator.name}`;
    } else {
        name = indicator.name;
    }
    return (
        <td className="logframe__cell--indicator">
            { name }
        </td>
    );
}

const MeansCell = ({ indicator }) => {
    if (indicator == null) {
      return (
        <td className="logframe__cell--means">
        </td>
    );
    }
    return (
        <td className="logframe__cell--means">
            { indicator.means_of_verification }
        </td>
    );
}


const AssumptionsCell = ({ assumptions, rowCount }) => {
    return (
        <td className="logframe__cell--assumptions" rowSpan={ rowCount }>
            { assumptions }
        </td>
    )
}


const LevelSet = ({ level }) => {

    const firstIndicator = level.indicators[0] || null;
    const otherIndicators = level.indicators.slice(1) || null;
    const rowCount  = level.indicators.length;
    return (
        <tbody className="logframe__level-set">
            <tr>
                <LevelNameCell name={ level.display_name } rowCount={ rowCount } />
                <IndicatorCell indicator={ firstIndicator } ontology={ level.ontology } />
                <MeansCell indicator={ firstIndicator } />
                <AssumptionsCell assumptions={ level.assumptions } rowCount={ rowCount } />
            </tr>
            { otherIndicators.map((indicator, idx) => {
                return (
                    <tr key={ idx } >
                        <IndicatorCell indicator={ indicator } ontology={ level.ontology } key={ `ind${idx}` } />
                        <MeansCell indicator={ indicator } key={ `means${idx}` } />
                    </tr>
                )
            })}
        </tbody>
    )
}


@inject('dataStore', 'filterStore')
@observer
class LogframeTable extends React.Component {
    constructor(props) {
        super(props);
    }

    @computed
    get levels() {
        if (this.props.dataStore.results_framework) {
            return this.props.dataStore.getLevelsGroupedBy(this.props.filterStore.groupBy)
        }
        return [];
    }

    @computed
    get unassignedLevel() {
        if (this.props.dataStore.unassignedIndicators.length > 0) {
            return {
                display_name: gettext('Indicators unassigned to  a results framework level'),
                indicators: this.props.dataStore.unassignedIndicators,
                ontology: false,
                assumptions: null
            };
        }
        return false;
    }

    render() {
        return (
            <React.Fragment>
                <HeaderRow headers={ this.props.filterStore.headerColumns } />
                { this.levels.map((level, idx) => <LevelSet level={ level } key={ idx } />) }
                { this.unassignedLevel && <LevelSet level={ this.unassignedLevel } /> }
            </React.Fragment>
        );
    }
}

export default LogframeTable;
