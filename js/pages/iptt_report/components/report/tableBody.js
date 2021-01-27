import React from 'react';
import { observer, inject } from 'mobx-react';

import { LevelGroup, IndicatorRow } from './tableRows';

@inject('rootStore', 'filterStore')
@observer
export default class ReportTableBody extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.filterStore.mounting();
    }

    render() {
        return (
            <tbody className={this.props.filterStore._mounted ? (this.props.filterStore?._shade) : null}>
                {
                    this.props.rootStore.levelRows ?
                        this.props.rootStore.levelRows.map(
                            (levelRow, index) => (
                                <LevelGroup
                                    level={ levelRow.level }
                                    indicators={ levelRow.indicators }
                                    key={ index } />
                            )
                        )
                    :
                        this.props.rootStore.indicatorRows.map(
                            (indicator, index) => (
                                <IndicatorRow indicator={ indicator } key={ index } />
                                                
                            )
                        )
                }
            </tbody>
        );
    }
}
