import React from 'react';
import { observer } from 'mobx-react';

@observer
export default class ProgramSettings extends React.Component {
    constructor(props) {
        super(props);
        let grouping = props.program_data._using_results_framework === undefined ?
                false : props.program_data._using_results_framework;
        let autonumber = grouping === 1 ? null : props.program_data.auto_number_indicators;
        this.state = {
            autonumber: autonumber,
            grouping: grouping
        };
        const originalState = {
            autonumber: autonumber,
            grouping: grouping
        };
        this.resetForm = () => {
            this.setState(originalState);
        }
        this.formDirty = () => {
            return this.state.autonumber != originalState.autonumber || this.state.grouping != originalState.grouping;
        }
    }
    
    autonumberChange = (e) => {
        if (e.target.value == "2") {
            this.setState({
                autonumber: false
            });
        } else {
            this.setState({
                autonumber: true
            });
        } 
    }
    
    groupingChange = (e) => {
        if (e.target.checked) {
            this.setState({grouping: 2});
        } else {
            this.setState({grouping: 1});
        }
    }
    
    save = (e) => {
        e.preventDefault();
        let data = { ...this.props.program_data,
                     };
        if (this.state.grouping !== false) {
            data._using_results_framework = this.state.grouping;
        }
        if (this.state.autonumber !== null) {
            data.auto_number_indicators = this.state.autonumber;
        }
        this.props.onSave(this.props.program_data.id, data);
    }

    
    render() {
        return (
            <div className="tab-pane--react">
                <h2 className="no-bold">{this.props.program_data.name ? this.props.program_data.name+': ' : ''}{gettext("Settings")}</h2>
                <div className="d-flex flex-column w-75 pr-5">
                    <form className="form">
                        { this.state.grouping !== false &&
                        <React.Fragment>
                        <h4>{ gettext("Indicator grouping") }</h4>
                         <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name="grouping"
                                id="grouping"
                                checked={ this.state.grouping == 2 }
                                onChange={ this.groupingChange }
                                />
                            <label className="form-check-label" htmlFor="grouping">
                            <strong>{gettext('Group indicators according to the results framework')}:</strong>
                            <span>
                                &nbsp; {gettext('After you have set a results framework for this program and assigned indicators to it, ' +
                                'select this option to retire the original indicator levels and view indicators grouped by ' +
                                'results framework levels instead.  This setting affects the program page, indicator plan, ' +
                                'and IPTT reports.')}
                            </span>
                            </label>        
                        </div>
                        </React.Fragment>}
                        { this.state.autonumber !== null &&
                        <React.Fragment>
                        <h4>{ gettext("Indicator numbering") }</h4>
                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="radio"
                                value="1"
                                name="autonumber"
                                id="autonumber_on"
                                checked={ this.state.autonumber }
                                onChange={ this.autonumberChange }
                                />
                            <label className="form-check-label" htmlFor="autonumber_on">
                            <strong>{
                                // # Translators: Auto-number meaning the system will do this automatically
                                gettext('Auto-number indicators (recommended)')
                            }:</strong>
                            &nbsp; {gettext('Indicator numbers are automatically determined by their results framework assignments.')}
                            </label>        
                        </div>
                        <div className="form-check mb-5">
                            <input
                                className="form-check-input"
                                type="radio"
                                value="2"
                                name="autonumber"
                                id="autonumber_off"
                                checked={ !this.state.autonumber }
                                onChange={ this.autonumberChange }
                                />
                            <label className="form-check-label" htmlFor="autonumber_off">
                            <strong>{gettext('Manually number indicators')}:</strong>
                            &nbsp; {gettext('If your donor requires a special numbering convention, you can enter a custom number for each indicator.')}
                            <strong className="text-danger">&nbsp; {gettext('Manually entered numbers do not affect the order in which indicators are listed; they are purely for display purposes.')}</strong>
                            </label>        
                        </div>
                        </React.Fragment>
                        }
                        <div className="form-group btn-row">
                            <button disabled={!this.formDirty()} className="btn btn-primary" type="button" onClick={(e) => this.save(e)}>{gettext("Save Changes")}</button>
                            <button className="btn btn-reset" type="button" onClick={() => this.resetForm()}>{gettext("Reset")}</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}