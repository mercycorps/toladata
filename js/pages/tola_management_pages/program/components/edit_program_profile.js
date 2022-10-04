import React from 'react';
import Select, { NonceProvider } from 'react-select';
import { observer } from "mobx-react";
import CheckboxedMultiSelect from 'components/checkboxed-multi-select';
import classNames from 'classnames';
import HelpPopover from '../../../../components/helpPopover.js';
import 'react-datepicker/dist/react-datepicker.css';
import ReactDatepicker from "../../../../components/ReactDatepicker.js";


const ErrorFeedback = observer(({errorMessages}) => {
    if (!errorMessages) {
        return null
    }
    return (
    <div className="invalid-feedback">
        {errorMessages.map((message, index) =>
            <span key={index}>{message}</span>
        )}
    </div>
    )
})
@observer
export default class EditProgramProfile extends React.Component {
    constructor(props) {
        super(props)
        const {program_data} = props

        this.state = {
            formEditable: false,
            original_data: Object.assign({}, program_data),
            managed_data: Object.assign({}, program_data)
        }
    }

    componentDidMount() {
        // Set the form to editable for demo, devs, and local servers
        let editableEnv = ["demo", "dev", "local"].reduce((editable, env) => {
            if (!editable) editable = window.location.href.includes(env);
            return editable;
        }, false)
        this.setState({
            formEditable: editableEnv
        })
        this.state.managed_data.gaitid.length === 0 && this.appendGaitRow(); // If there are no GAIT IDs on mount, add a empty Gait Row
    }

    hasUnsavedDataAction() {
        this.props.onIsDirtyChange(JSON.stringify(this.state.managed_data) != JSON.stringify(this.state.original_data))
    }

    save() {
        const program_id = this.props.program_data.id
        const program_data = this.state.managed_data
        this.props.onUpdate(program_id, program_data)
    }

    saveNew(e) {
        e.preventDefault()
        const program_data = this.state.managed_data
        this.props.onCreate(program_data)
    }

    updateFormField(fieldKey, val) {
        this.setState({
            managed_data: Object.assign(this.state.managed_data, {[fieldKey]: val})
        }, () => this.hasUnsavedDataAction())
    }

    resetForm() {
        this.setState({
            managed_data: Object.assign({}, this.state.original_data)
        }, () => this.hasUnsavedDataAction())
    }

    formErrors(fieldKey) {
        return this.props.errors[fieldKey]
    }
    formErrorsGaitRow(fieldKey, index) {
        return this.props.errors.gaitid ? this.props.errors.gaitid[index][fieldKey] : null;
    }

    // Function to create a comma separated list to display from an array of items
    createDisplayList(listArray) {
        if (!listArray) return "null";
        listArray = [...listArray]
        if (Array.isArray(listArray)) {
            listArray = listArray.reduce((list, item, i) => {
                let separator = i === 0 ? "" : ", ";
                item = item.label || item[1] || item;
                return list + separator + item;
            }, "");
        }
        return listArray;
    }

    // Function to handle updating the fund code field.
    updateFundCode(e, index) {
        let val = e.target.value.split(/[, ]+/);
        val = val.map((value) => {
            if (!value) {
                return '';
            } else if ( /\D+/.test(value)) {
                return parseInt(value.slice(0, value.length - 1)) || "";
            }
            return parseInt(value);
        });
        this.updateGaitRow(e.target.name, val, index);
    }
    
    // Function to update the fields a gait row
    updateGaitRow(label, val, index) {
        let updateRow = [...this.state.managed_data.gaitid];
        updateRow[index][label] = val;
        this.updateFormField("gaitid", updateRow);
    }

    // Function to add a new gait row
    appendGaitRow() {
        const newRow = {
            gaitid: "",
            fund_code: "",
            donor: "",
            donor_dept: "",
        };
        this.updateFormField("gaitid", [...this.state.managed_data.gaitid, newRow]);
    }

    // Function to delete a gait row
    deleteGaitRow(index) {
        let updatedRow = [...this.state.managed_data.gaitid];
        updatedRow.splice(index, 1);
        this.updateFormField("gaitid", updatedRow);
    }

    render() {
        const formdata = this.state.managed_data;
        const selectedCountries = formdata.country.map(x=>this.props.countryOptions.find(y=>y.value==x));
        const selectedIDAASectors = formdata.idaa_sector.map(x=>this.props.idaaSectorOptions.find(y=>y.value==x));
        const selectedOutcomeThemes = formdata.idaa_outcome_theme.map(x=>this.props.idaaOutcomeThemesOptions.find(y=>y.value==x));
        // console.log('formdata:', formdata);
        // console.log(this.props)

        return (
            <div className="tab-pane--react">
                <h2 className="no-bold">{this.props.program_data.name ? this.props.program_data.name+': ' : ''}{gettext("Profile")}
                    <span className="ml-1">
                        <HelpPopover
                            className="popover-icon"
                            content={ gettext("The fields on this tab are auto-populated with data from Identification Assignment Assistant (IDAA). These fields cannot be edited in TolaData. If changes to this program information are required, then these changes must be reflected in IDAA first.") }
                        />
                    </span>
                </h2>
                <form className="form" id="id_admin_program_profile-tab">
                    <div className="form-group" data-toggle="tooltip" title={formdata.name}>
                        <label htmlFor="program-name-input" className="label--required">{gettext("Program name")}</label>
                        <input
                            type="text"
                            id="program-name-input"
                            className={classNames('form-control', { 'is-invalid': this.formErrors('name') })}
                            maxLength={255}
                            required
                            disabled={!this.state.formEditable}
                            value={formdata.name}
                            onChange={(e) => this.updateFormField('name', e.target.value) }
                        />
                        <ErrorFeedback errorMessages={this.formErrors('name')} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="program-id-input" className="label--required">{gettext("Program ID")}</label>
                        <input
                            type="text"
                            id="program-id-input"
                            className={classNames('form-control', { 'is-invalid': this.formErrors('external_program_id') })}
                            maxLength={4}
                            required
                            placeholder={ !this.state.formEditable ? gettext("None") : "" }
                            disabled={!this.state.formEditable}
                            value={formdata.external_program_id || ""}
                            onChange={(e) => this.updateFormField('external_program_id', e.target.value.replace(/[^0-9]/g, "")) }
                        />
                        <ErrorFeedback errorMessages={this.formErrors('external_program_id')} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="program-start-date" className="label--required">{gettext("Program start date")}</label>
                        <div className={ classNames( {'is-invalid': this.formErrors('start_date')} )}>
                            <ReactDatepicker
                                customDatesSelector={false}
                                className={classNames('form-control', { 'is-invalid': this.formErrors('end_date') })}                
                                date={formdata.start_date}
                                maxDate={formdata.end_date}
                                onChange={(date) => this.updateFormField('start_date', `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`) }
                            />
                        </div>
                        <ErrorFeedback errorMessages={this.formErrors('start_date')} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="program-end-date" className="label--required">{gettext("Program end date")}</label>
                        <div className={ classNames( {'is-invalid': this.formErrors('start_date')} )}>
                            <ReactDatepicker
                                id="program-end-date"
                                customDatesSelector={false}
                                className={classNames('form-control', { 'is-invalid': this.formErrors('end_date') })}                
                                date={formdata.end_date}
                                minDate={formdata.start_date}
                                onChange={(date) => this.updateFormField('end_date', `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`) }
                            />
                        </div>
                        <ErrorFeedback errorMessages={this.formErrors('end_date')} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="program-funding_status-input" className="label--required">{gettext("Program funding status")}</label>
                        <Select
                            id="program-funding_status-input"
                            placeholder={ gettext("None Selected") }
                            className={classNames('react-select', { 'is-invalid': this.formErrors('funding_status') })}
                            isDisabled={!this.state.formEditable}
                            options={this.props.fundingStatusOptions}
                            value={this.props.fundingStatusOptions.find(y=>y.label===formdata.funding_status)}
                            onChange={(e) => this.updateFormField('funding_status', e.label) }
                        />
                        <ErrorFeedback errorMessages={this.formErrors('funding_status')} />
                    </div>
                    <div className="form-group react-multiselect-checkbox" data-toggle="tooltip" title={this.createDisplayList(selectedCountries)}>
                        <label htmlFor="program-country-input" className="label--required">{gettext("Countries")}</label>
                        {!this.state.formEditable ?
                            <input
                                type="text"                      
                                value={this.createDisplayList(selectedCountries) || gettext("None")}
                                className={classNames('form-control', { 'is-invalid': this.formErrors('country') })}
                                id="program-country-input"
                                disabled={!this.state.formEditable}
                            />
                        :
                            <CheckboxedMultiSelect
                                value={selectedCountries}
                                options={this.props.countryOptions}
                                onChange={(e) => this.updateFormField('country', e.map(x=>x.value)) }
                                className={classNames('react-select', {'is-invalid': this.formErrors('country')})}
                                id="program-country-input"
                            />
                        }
                        <ErrorFeedback errorMessages={this.formErrors('country')} />
                    </div>
                    <div className="form-group react-multiselect-checkbox" data-toggle="tooltip" title={this.createDisplayList(selectedIDAASectors)}>
                        <label htmlFor="program-sectors-input">{gettext("Sectors")}</label>
                        {!this.state.formEditable ? 
                            <input
                                id="program-sector-input"
                                type="text"                      
                                value={this.createDisplayList(selectedIDAASectors) || gettext("None Selected")}
                                className={classNames('form-control', { 'is-invalid': this.formErrors('idaa_sector') })}
                                disabled={!this.state.formEditable}
                            />
                        :
                            <CheckboxedMultiSelect
                                id="program-sectors-input"
                                value={selectedIDAASectors}
                                placeholder={gettext('None Selected')}
                                options={this.props.idaaSectorOptions}
                                onChange={(e) => this.updateFormField('idaa_sector', e.map(x=>x.value)) }
                                className={classNames('react-select', {'is-invalid': this.formErrors('idaa_sector')})}
                            />
                        }
                        <ErrorFeedback errorMessages={this.formErrors('idaa_sector')} />
                    </div>
                    <div className="form-group react-multiselect-checkbox" data-toggle="tooltip" title={this.createDisplayList(formdata.idaa_outcome_theme)}>
                        <label htmlFor="program-outcome_themes-input">{gettext("Outcome themes")}</label>
                        {!this.state.formEditable ? 
                            <input
                                type="text"
                                value={this.createDisplayList(formdata.idaa_outcome_theme) || gettext("None Selected")}
                                className={classNames('form-control', { 'is-invalid': this.formErrors('idaa_outcome_theme') })}
                                id="program-outcome_themes-input"
                                disabled={!this.state.formEditable}
                            />
                        :
                            <CheckboxedMultiSelect
                                value={selectedOutcomeThemes}
                                placeholder={gettext('None Selected')}
                                options={this.props.idaaOutcomeThemesOptions}
                                onChange={(e) => this.updateFormField('idaa_outcome_theme', e.map(x=>x.value)) }
                                className={classNames('react-select', {'is-invalid': this.formErrors('idaa_outcome_theme')})}
                                id="program-outcome_themes-input"
                            />
                        }
                        <ErrorFeedback errorMessages={this.formErrors('idaa_outcome_theme')} />
                    </div>
                    <div className="form-group">
                        <div className="profile-table__column">
                            <div className="profile-table__column--left header">
                                <label htmlFor="program-gait-input" className="label--required">{gettext("GAIT IDs")}</label>
                            </div>
                            <div className="profile-table__column--middle header">
                                <label htmlFor="program-fund-code-input">{gettext("Fund codes")}</label>
                            </div>
                            <div className="profile-table__column--right header">
                                <label htmlFor="program-donor-input">{gettext("Donors")}</label>
                            </div>
                        </div>
                        {formdata.gaitid.map((gaitRow, index) => {
                            let donorText = gaitRow.donor || "";
                            donorText = gaitRow.donor_dept ? donorText + " " + gaitRow.donor_dept : donorText;
                            return(
                                <div key={index} className="profile__table">
                                    <div className="profile-table__column">
                                        <div className="profile-table__column--left">
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    id="program-gait-input"
                                                    className={classNames('form-control', "profile__text-input", { 'is-invalid': this.formErrors('gaitid') })}
                                                    maxLength={5}
                                                    disabled={!this.state.formEditable}
                                                    value={gaitRow.gaitid !== null ? gaitRow.gaitid : gettext("None")}
                                                    onChange={(e) => this.updateGaitRow('gaitid', e.target.value.replace(/[^0-9]/g, ""), index) }
                                                    />
                                            </div>
                                        </div>
                                        <div className="profile-table__column--middle">
                                            <div data-toggle="tooltip" title={this.createDisplayList(gaitRow.fund_code) !== null ? gaitRow.fund_code : gettext("None")} className="form-group">
                                                <input
                                                    type="text"
                                                    id="program-fund-code-input"
                                                    name='fund_code'
                                                    className={classNames('form-control', "profile__text-input", { 'is-invalid': this.formErrors('fund_code') })}
                                                    disabled={!this.state.formEditable}
                                                    value={ this.createDisplayList(gaitRow.fund_code) }
                                                    onKeyUp={(e) => {
                                                        if (e.key === "Backspace" && !gaitRow.fund_code[gaitRow.fund_code.length - 1]) {
                                                            let updatedFundCode = [...gaitRow.fund_code];
                                                            updatedFundCode.pop();
                                                            this.updateGaitRow('fund_code', updatedFundCode, index);
                                                        }
                                                    }}
                                                    onChange={(e) => this.updateFundCode(e, index)}
                                                    />
                                            </div>
                                        </div>
                                        <div className="profile-table__column--right">
                                            <div className="form-group" data-toggle="tooltip" title={donorText !== null ? donorText : gettext("None")} >
                                                <input
                                                    type="text"
                                                    id="program-donor-input"
                                                    maxLength={255}
                                                    className={classNames('form-control', "profile__text-input", { 'is-invalid': this.formErrors('donor') })}
                                                    disabled={!this.state.formEditable}
                                                    value={donorText !== null ? donorText : gettext("None")}
                                                    onChange={(e) => this.updateGaitRow('donor', e.target.value, index) }
                                                    />
                                            </div>
                                        </div>
                                        {this.state.formEditable && 
                                            <a
                                                tabIndex="0"
                                                onClick={() => this.deleteGaitRow(index)}
                                                className={classNames("btn btn-link btn-danger text-nowrap")}
                                            >
                                                <i className="fas fa-trash"/>
                                            </a>
                                        }

                                    </div>
                                        <div className="profile-table__error">
                                            {/* <ErrorFeedback errorMessages={this.formErrorsGaitRow('gaitid', index)} /> */}
                                            {/* <ErrorFeedback errorMessages={this.formErrors[0]('fund_code')} />
                                            <ErrorFeedback errorMessages={this.formErrors[0]('donor')} /> */}
                                        </div>
                                </div>
                            )
                        })}
                        <div className="mt-0">

                            <div tabIndex="0" onClick={() => this.appendGaitRow()} className="btn btn-link btn-add">
                                {/* # Translators:  Button label.  Button allows users to add a GAIT ID, Fund code, Donors row.  */}
                                <i className="fas fa-plus-circle"/>{gettext('Add another row')}
                            </div>
                        </div>
                    </div>
                    <div className="form-group btn-row">
                        <button className="btn btn-primary" type="button" onClick={(e) => this.saveNew(e)}>{gettext("Save changes")}</button>
                        <button className="btn btn-reset" type="button" onClick={() => this.resetForm()}>{gettext("Cancel changes")}</button>
                    </div>
                </form>
            </div>
        )
    }
}
