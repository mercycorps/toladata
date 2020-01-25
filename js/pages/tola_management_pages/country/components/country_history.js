import React from 'react'
import Select from 'react-select'
import {AutoSizer, Table, Column, CellMeasurer, CellMeasurerCache} from 'react-virtualized'
import { observer } from 'mobx-react';
import Expander from 'components/expander'
import ChangeLog from 'components/changelog'

@observer
export class CountryHistory extends React.Component {

    constructor(props) {
        super(props);
        const {country_data} = props;
        this.state = {
            managed_status: Object.assign({}, country_data),
            original_status: Object.assign({}, country_data)
        }
    }

    hasUnsavedDataAction() {
        this.props.onIsDirtyChange(JSON.stringify(this.state.managed_status) != JSON.stringify(this.state.original_status))
    }

    onStatusChange(selection) {
        let value = selection.value
        this.setState({
            managed_status: Object.assign(this.state.managed_status, {'funding_status': value})
        }, () => this.hasUnsavedDataAction())
    }

    onSave() {
        this.props.onSave(this.state.original_status.id, this.state.managed_status)
    }

    onReset() {
        this.setState({
            managed_status: this.state.original_status,
        }, () => this.hasUnsavedDataAction())
    }

    render() {
        const {history, store} = this.props
        const changelog_expanded_rows = store.changelog_expanded_rows;
        const currentStatusSelection = status_options.find(x=> x.value == this.state.managed_status.funding_status);
        return <div className="tab-pane--react admin-edit-pane">
            <h2 className="no-bold">{this.props.country_data.name ? this.props.country_data.name+': ' : ''}{gettext("Status and History")}</h2>
            <div className="form-group">
                <label htmlFor="status-input" className="label--required" required>{gettext("Status")}</label>
                <Select
                    isSearchable={false}
                    options={status_options}
                    value={currentStatusSelection}
                    onChange={(new_value) => this.onStatusChange(new_value)}
                />
            </div>
            <div className="row">
                <div className="col">
                    <div className="form-group btn-row">
                        <button className="btn btn-primary" type="button" onClick={() => this.onSave()}>{gettext("Save Changes")}</button>
                        <button className="btn btn-reset" type="button" onClick={() => this.onReset()}>{gettext("Reset")}</button>
                    </div>
                </div>
            </div>

            <ChangeLog data={history} expanded_rows={changelog_expanded_rows} toggle_expando_cb={(row_id) => store.toggleChangeLogRowExpando(row_id)} />

        </div>


    }
}

export default CountryHistory
