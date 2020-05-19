import React from 'react';
import { observer, inject } from 'mobx-react';

import { LevelGroup, IndicatorRow } from './tableRows';

const ReportTableBody = inject('rootStore', 'filterStore')(
    observer(({ rootStore, filterStore }) => {
        return (
        <tbody>
            {
                rootStore.levelRows ?
                    rootStore.levelRows.map(
                        (levelRow, index) => (
                            <LevelGroup
                                level={ levelRow.level }
                                indicators={ levelRow.indicators }
                                key={ index } />
                        )
                    )
                :
                    rootStore.indicatorRows.map(
                        (indicator, index) => (
                            <IndicatorRow indicator={ indicator } key={ index } />
                                            
                        )
                    )
            }
        </tbody>
        );
    })
);

export default ReportTableBody;