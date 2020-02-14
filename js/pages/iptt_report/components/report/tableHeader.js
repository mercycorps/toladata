import React from 'react';
import { observer, inject } from 'mobx-react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusSquare, faMinusSquare } from '@fortawesome/free-solid-svg-icons'

library.add(faPlusSquare, faMinusSquare)

import * as HeaderCells from './headerCells';

const ColGroups = inject('rootStore')(
    observer(({ rootStore }) => {
        return (
            <React.Fragment>
                <colgroup
                    span={ rootStore.baseColumns + 1 }
                    className="iptt-base-columns" />
                <colgroup
                    span={ 3 }
                    className="iptt-lop-columns" />
                {
                    rootStore.reportPeriods.map(
                        (period, index) => (
                            <colgroup
                                key={ index }
                                span={ rootStore.isTVA ? 3 : 1 }
                                className="iptt-period-columns"
                                id={ 'period-' + index }
                            />
                        )
                    )
                }
            </React.Fragment>
        )
    })
);


const ProgramNameRow = inject('rootStore')(
    observer(({ rootStore }) => {
        const program = rootStore.currentProgram;
        if (!program) {
            return (<tr><td>Loading</td></tr>);
        }
        return (
            <tr className="title-row">
                <td
                    colSpan={ rootStore.baseColumns + 1 }
                    className="base-column">
                    <button className="btn btn-medium text-action btn-sm"
                        onClick={rootStore.expandAllRows.bind(rootStore)}
                        disabled={ rootStore.allExpanded }>
                        <FontAwesomeIcon icon="plus-square" />
                        { gettext('Expand all') }
                    </button>
                    <button className="btn btn-medium text-action btn-sm"
                        onClick={rootStore.collapseAllRows.bind(rootStore)}
                        disabled={ rootStore.allCollapsed }>
                        <FontAwesomeIcon icon="minus-square" />
                        { gettext('Collapse all') }
                    </button>
                </td>
                <td
                    colSpan={ 3 }
                    // centered under LOP superheader
                    className="iptt-period-header">
                    <span className="text-uppercase">
                    {
                        /* # Translators: header for a group of columns showing totals over the life of the program */
                        gettext('Life of program')
                    }
                    </span>
                </td>
                {
                    rootStore.reportPeriods.map(
                        (period, index) => (
                            <HeaderCells.PeriodHeader isTVA={ rootStore.isTVA} key={ index }
                                                      period={ period } />
                        )
                    )
                }
            </tr>
        );
    })
);

const ColumnHeaderRow = inject('rootStore')(
    observer(({ rootStore }) => {
        return (
            <tr>
                <HeaderCells.HeaderCell
                    styleWidth={110}
                    className='base-column'
                    label={
                        /* # Translators: Abbreviation as column header for "number" column */
                        gettext('No.')
                    } />
                <HeaderCells.HeaderCell
                    className='base-column'
                    styleWidth={600}
                    colSpan={2}
                    label={
                        /* # Translators: Column header for indicator Name column */
                        gettext('Indicator')
                    } />
                <HeaderCells.HeaderCell
                    className='base-column'
                    // empty cell above gear widget column
                    />
                { !rootStore.filterStore.resultsFramework && <HeaderCells.HeaderCell
                    className='base-column'
                    styleWidth={90}
                    label={
                        /* # Translators: Column header for indicator Level name column */
                        gettext('Level')
                    } />
                }
                { rootStore.hasUOMColumn && <HeaderCells.HeaderCell
                    className='base-column'
                    styleWidth={250}
                    label={
                        /* # Translators: Column header */
                        gettext('Unit of measure')
                    } /> }
                { rootStore.hasChangeColumn && <HeaderCells.HeaderCell
                    className='base-column'
                    label={
                        /* # Translators: Column header for "direction of change" column (increasing/decreasing) */
                        gettext('Change')
                    } /> }
                { rootStore.hasCNCColumn && <HeaderCells.HeaderCell
                    className='base-column'
                    styleWidth={130}
                    label={
                        /* # Translators: Column header, stands for "Cumulative"/"Non-cumulative" */
                        gettext('C / NC')
                    } /> }
                { rootStore.hasUOMTypeColumn && <HeaderCells.HeaderCell
                    className='base-column'
                    styleWidth={50}
                    label={
                        /* # Translators: Column header, numeric or percentage type indicator */
                        gettext('# / %')
                    } /> }
                { rootStore.hasBaselineColumn && <HeaderCells.HeaderCell
                    className='base-column'
                    label={
                        /* # Translators: Column header */
                        gettext('Baseline')
                    } /> }
                <HeaderCells.HeaderCell
                    styleWidth={110}
                    className='lop-column'
                    label={
                        /* # Translators: Column header for a target value column */
                        gettext('Target')
                    } />
                <HeaderCells.HeaderCell
                    styleWidth={110}
                    className='lop-column'
                    label={
                        /* # Translators: Column header for an "actual" or achieved/real value column */
                        gettext('Actual')
                    } />
                <HeaderCells.HeaderCell
                    styleWidth={110}
                    className='lop-column'
                    label={
                        /* # Translators: Column header for a percent-met column */
                        gettext('% met')
                    } />
                { rootStore.reportPeriods.map(
                    (period, index) => (rootStore.isTVA ?
                                <HeaderCells.TVAHeader key={ index } /> :
                                <HeaderCells.ActualHeader key={ index } />
                              )
                )}
            </tr>
        )
    })
);

const ReportTableHeader = () => {
    return (
        <React.Fragment>
            <ColGroups />
            <thead>
                <ProgramNameRow />
                <ColumnHeaderRow />
            </thead>
        </React.Fragment>
        );
}

export default ReportTableHeader;
