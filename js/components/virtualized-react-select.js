import React from 'react'
import {List, AutoSizer, CellMeasurer, CellMeasurerCache} from 'react-virtualized'
import Select, {components} from 'react-select'

export class VirtualizedMenuList extends React.PureComponent {
    constructor(props) {
        super(props)
        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 35,
        })
        this.filter_val = ""
    }

    render() {
        const {options, children, maxHeight, getValue, selectProps} = this.props
        const rowCount = children.length || 0

        //gotta be a way to improve this. it's ok after the first couple of
        //characters search, but it's slow prior to that
        if(selectProps.inputValue !== this.filter_val) {
            this.filter_val = selectProps.inputValue
            this.cache.clearAll()
        }

        return (
            <div style={{display: "flex", height: `100vh`, maxHeight: maxHeight+"px"}}>
                <div style={{flex: "1 1 auto"}}>
                    <AutoSizer>
                    {({width, height}) => {
                        return <List
                                height={height}
                                width={width}
                                deferredMeasurementCache={this.cache}
                                rowCount={rowCount}
                                rowHeight={this.cache.rowHeight}
                                noRowsRenderer={() => <div>No selections available</div>}
                                rowRenderer={
                                    ({index, parent, key, style}) =>
                                        <CellMeasurer key={key} cache={this.cache} parent={parent} columnIndex={0} rowIndex={index}>
                                            <div style={style, {whiteSpace: "normal", lineHeight: "1"}}>{children[index]}</div>
                                        </CellMeasurer>
                                }/>
                    }}
                    </AutoSizer>
                </div>
            </div>
        )
    }
}

const VirtualizedSelect = props => (
    <Select
        components={{
            VirtualizedMenuList,
        }}
        {...props} />
)

export default VirtualizedSelect
