import React from 'react';
import { observer, inject } from 'mobx-react';

import * as HeaderCells from './headerCells';


const ProgramNameRow = inject('rootStore')(
    observer(({ rootStore }) => {
        const program = rootStore.currentProgram;
        if (!program) {
            return (<tr><td>Loading</td></tr>);
        }
        return (
            <tr className="title-row">
                <td colSpan={ rootStore.baseColumns } className="base-column">
                </td>
                <td scope="colgroup" colSpan="4"
                    // centered under LOP superheader
                    className="text-center text-nowrap text-uppercase lop-column">
                    {
                        /* # Translators: header for a group of columns showing totals over the life of the program */
                        gettext('Life of program')
                    }
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

const ExpandAllRow = inject('rootStore')(observer(({ rootStore }) => {
    return (
        <tr className="title-row action-buttons">
            <td colSpan={ rootStore.reportColumnWidth }>
                <button className="btn btn-medium text-action btn-sm"
                onClick={rootStore.expandAllRows.bind(rootStore)}
                disabled={ rootStore.allExpanded }>{ gettext('Expand all') }</button>
                <button className="btn btn-medium text-action btn-sm"
                onClick={rootStore.collapseAllRows.bind(rootStore)}
                disabled={ rootStore.allCollapsed }>{ gettext('Collapse all') }</button>
            </td>
        </tr>
    )
}))

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
                    className='lop-column'
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
        <thead>
            <ProgramNameRow />
            { /* <ExpandAllRow /> // TODO: */ }
            <ColumnHeaderRow />
        </thead>
        );
}

export default ReportTableHeader;
