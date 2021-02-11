import React from 'react';
import { observer, inject } from 'mobx-react';
import { PinButton, ExcelButton, ExcelPopoverButton } from './buttons';


const IPTTHeader = inject('filterStore', 'rootStore')(
    observer(({ filterStore, rootStore }) => {
        return <React.Fragment>
            <div className="page-subheader">
                    <div id="id_span_iptt_date_range" className="subheader__title">
                        <h2 className="text-title-case">{
                            gettext('Indicator Performance Tracking Table')
                        }</h2>
                        <h4>{ (filterStore.startPeriod && filterStore.endPeriod)
                            ? filterStore.startPeriod.startLabel + " - " + filterStore.endPeriod.endLabel
                            : "" }
                        </h4>
                    </div>
                    <div className="subheader__actions">
                        <div className="btn-row">
                            <PinButton />
                            {filterStore.isTVA ? <ExcelPopoverButton { ...rootStore.excelAPI }/> :
                            <ExcelButton excelUrl={ rootStore.excelAPI.excelUrl } />}
                        </div>
                    </div>
                </div>
                { rootStore.currentProgram &&
                    <h3><a href={ rootStore.currentProgramPageUrl }>
                    { rootStore.currentProgram.name }</a>
                    </h3>
                }
            </React.Fragment>
    })
);


export default IPTTHeader;
