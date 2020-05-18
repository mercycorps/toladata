import { observer } from "mobx-react"
import React from 'react';
import classNames from 'classnames';

// TODO: "size" is no longer used
const ColumnComponent = ({className, size, ...props}) => <td className={["mgmt-table__col", className].join(' ')}  {...props}>{props.children}</td>

// TODO: this is redundant with ColumnComponent
const HeaderColumnComponent = ({className, size, ...props}) => <th className={["mgmt-table__col", `mgmt-table__col__width-${size}`, className].join(' ')}  {...props}>{props.children}</th>

const InnerRowComponent = ({className, ...props}) => <tr className={["mgmt-table__row", className].join(' ')} {...props}>{props.children}</tr>

// TODO: this is redundant with InnerRowComponent
const HeaderRowComponent = ({className, ...props}) => <tr className={["mgmt-table__row table-header", className].join(' ')} {...props}>{props.children}</tr>

/***
    A wrapper for the rendering of the given row renderer, it takes and expando
    renderer used to render expanded content

    Props:
    - expanded: whether the expando content is shown or not
    - Expando: The content to render when the expando is shown
*/
const RowComponent = observer(({className, expanded, Expando, ...props}) => {
    if(Expando) {
        const ObservedExpando = observer(Expando)
        return <tbody className={
                classNames(["mgmt-table__body", className].join(' '), { "is-expanded": expanded })
            } {...props} >
            <InnerRowComponent>{props.children}</InnerRowComponent>
            {expanded && <ObservedExpando Wrapper={ExpandoWrapper} />}
        </tbody>
    } else {
        return <tbody className={["mgmt-table__body", className].join(' ')} {...props} >
            <InnerRowComponent>{props.children}</InnerRowComponent>
        </tbody>
    }
})
const ExpandoWrapper = ({className, ...props}) => <tr className={["mgmt-table__row--expanded", className].join(' ')} {...props}><td colSpan="5">{props.children}</td></tr>

const RowList = observer(({data, Row, keyField, ...props}) => {
    const ObservedRow = observer(Row)
    return data.map(row_data => <ObservedRow key={row_data[keyField]} data={row_data} Col={ColumnComponent} Row={RowComponent} />)
})

/*
   Props:

   - HeaderRow: a function to render the header row. it receives a component
   prop to render the header column and row

   - Row: a function used to render each row. it receives a component prop to
    render the row (see RowComponent), it receives the relevant data for that
    row as a prop: data

   - data: the dataset used to render the table, it must be an array

   - keyField: field to use for key on rows and expando checking

 */
const ManagementTable = observer(({HeaderRow, className, ...props}) => {
    const ObservedHeaderRow = observer(HeaderRow)
    return <table className={['table bg-white', className].join(' ')} >
        <thead>
            <ObservedHeaderRow Col={HeaderColumnComponent} Row={HeaderRowComponent}/>
        </thead>
        <RowList {...props} />
    </table>
})
export default ManagementTable
