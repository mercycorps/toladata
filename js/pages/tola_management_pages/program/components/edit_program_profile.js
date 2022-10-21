import React from 'react';
import Select from 'react-select';
import { observer } from "mobx-react";
import CheckboxedMultiSelect from 'components/checkboxed-multi-select';
import classNames from 'classnames';
import HelpPopover from '../../../../components/helpPopover.js';


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
            original_data: $.extend(true, {}, program_data),
            managed_data: $.extend(true, {}, program_data),
            formErrors: {},
            gaitRowErrors: {},
            gaitRowErrorsFields: {},
        }
    }

    componentDidMount() {
        // Set the form to editable for demo, dev, dev2, and localhost servers
        let editableEnv = ["demo", "dev", "local"].reduce((editable, env) => {
            if (!editable) editable = window.location.href.includes(env);
            return editable;
        }, false)
        this.setState({
            formEditable: editableEnv
        })

        // If there are no GAIT IDs on mount, add a empty Gait Row
        this.state.managed_data.gaitid.length === 0 && this.appendGaitRow();

        $(document).ready(() => {
            let startDate = this.state.managed_data.start_date;
            let endDate = this.state.managed_data.end_date;
            let today = new Date();
            let latest = new Date();
            latest.setHours(0,0,0,0);
            latest.setFullYear(today.getFullYear() + 1);
            let earliest = new Date();
            earliest.setHours(0,0,0,0);
            earliest.setFullYear(today.getFullYear() - 1);

            // Program Start Date setup
            $("#program-start-date").datepicker({
                dateFormat: "yy-mm-dd",
                minDate: earliest,
            });
            if (this.state.managed_data) {
                $('#program-start-date').datepicker("setDate", startDate);
            };
            $('#program-start-date').on('change', () => {
                let updatedDate = $('#program-start-date').datepicker('getDate');
                this.updateFormField('start_date', window.formatDate(updatedDate));
            });
            // Program End Date setup
            $("#program-end-date").datepicker({
                dateFormat: "yy-mm-dd",
                maxDate: latest,
            });
            if (this.state.managed_data) {
                $('#program-end-date').datepicker("setDate", endDate);
            };
            $('#program-end-date').on('change', () => {
                let updatedDate = $('#program-end-date').datepicker('getDate');
                this.updateFormField('end_date', window.formatDate(updatedDate));
            });
        });
    }


    // ***** Action functions *****

    hasUnsavedDataAction() {
        this.props.onIsDirtyChange(JSON.stringify(this.state.managed_data) != JSON.stringify(this.state.original_data))
    }

    save() {
        if (this.validate()) this.props.onUpdate(this.props.program_data.id, this.state.managed_data);
    }

    saveNew() {
        if (this.validate()) this.props.onCreate(this.state.managed_data);
    }

    resetForm() {
        this.setState({
            managed_data: $.extend(true, {}, this.state.original_data),
            formErrors: {},
            gaitRowErrors: {},
            gaitRowErrorsFields: {}
        }, () => this.hasUnsavedDataAction())
    }

    updateFormField(fieldKey, val) {
        this.setState({
            managed_data: Object.assign(this.state.managed_data, {[fieldKey]: val})
        }, () => this.hasUnsavedDataAction())
    }

    formErrors(fieldKey) {
        return this.state.formErrors[fieldKey];
    }

    formErrorsGaitRow(index) {
        if (this.state.gaitRowErrors[index] ) {
            let errorMessages = new Set();
            this.state.gaitRowErrors[index].map((msg) => errorMessages.add(Object.values(msg)[0]) )
            return [...errorMessages];
        }
    }

    // ***** Gait row functions *****

    // Function to update the fields in a gait row
    updateGaitRow(label, val, index) {
        let updatedRows = [...this.state.managed_data.gaitid];
        updatedRows[index][label] = val;
        this.updateFormField("gaitid", updatedRows);
    }

    // Function to add a new gait row
    appendGaitRow() {
        const newRow = {
            gaitid: "",
            donor: "",
            donor_dept: "",
            fund_code: [],
        };
        this.setState({
            managed_data: $.extend(true, this.state.managed_data, {gaitid: [...this.state.managed_data.gaitid, newRow]})
        })
    }

    // Function to delete a gait row
    deleteGaitRow(index) {
        let updatedRow = [...this.state.managed_data.gaitid];
        updatedRow.splice(index, 1);
        this.updateFormField("gaitid", updatedRow);
    }

    // Function to handle updating the fund code field
    updateFundCode(label, value, index) {
        let val = value.split(/[, ]+/);
        val = val.map((code) => {
            if (!code) {
                return '';
            } else if ( /\D+/.test(code)) {
                return parseInt(code.slice(0, code.length - 1)) || "";
            }
            return parseInt(code);
        });
        this.updateGaitRow(label, val, index);
    }

    // Function to create a comma separated list to display converted from an array of items
    createDisplayList(listArray) {
        if (!listArray) return null;
        listArray = [...listArray];
        if (Array.isArray(listArray)) {
            listArray = listArray.reduce((list, item, i) => {
                let separator = i === 0 ? "" : ", ";
                item = item.label || item[1] || item;
                return list + separator + item;
            }, "");
        }
        return listArray;
    }

    // Function to create a alphabetically (by index order from backend) sorted selected list to display data from thier options
    handleSelected = (selected, options) => {
        let resultsObj = {};
        selected.map((id) => {
            let index;
            let foundOption = options.find((option, idx) => {
                index = idx;
                return option.value == id;
            });
            resultsObj[index] = foundOption;
        })
        return Object.values(resultsObj);
    }
    

    // ***** Validations *****
    validate() {
        let isValid = true;
        let detectedErrors = {};
        let formdata = this.state.managed_data;

        // Adds error message text to the detected errors object
        let addErrorMessage = (type, field, msg, idx) => {
            if (type === 'normal') {
                detectedErrors[field] ? detectedErrors[field].push(msg) : detectedErrors[field] = [msg];
            } else if (type === 'gaitRow') {
                detectedGaitRowErrors[idx] ? detectedGaitRowErrors[idx].push({[field]: msg}) : detectedGaitRowErrors[idx] = [{[field]: msg}];
            }
        }

        // Required fields validations
        let requiredFields = ['name', 'external_program_id', 'start_date', 'end_date', 'funding_status', 'country'];
        requiredFields.map(field => {
            if (!formdata[field] || formdata[field].length === 0) {
                isValid = false;
                addErrorMessage("normal", field, gettext('This field may not be left blank.'));
            }
        })

        // Start and End date validations
        let startDate = window.localDateFromISOStr(formdata.start_date);
        let endDate = window.localDateFromISOStr(formdata.end_date);
        let currentYear = new Date().getFullYear();
        let earliest = new Date();
        let latest = new Date();
        earliest.setFullYear(currentYear - 10);
        latest.setFullYear(currentYear + 10);
        if (formdata.start_date.length > 0) {
            if (startDate < earliest) {
                isValid = false;
                addErrorMessage("normal", "start_date", gettext("The program start date may not be more than 10 years in the past."));
            }
            if (formdata.end_date.length > 0 && startDate > endDate) {
                isValid = false;
                addErrorMessage("normal", "start_date", gettext("The program start date may not be after the program end date."));
            }
        }
        if (formdata.end_date.length > 0) {
            if (endDate > latest) {
                isValid = false;
                addErrorMessage("normal", "end_date", gettext("The program end date may not be more than 10 years in the future."));
            }
            if (formdata.start_date.length > 0 && endDate < startDate) {
                isValid = false;
                addErrorMessage("normal", "end_date", gettext("The program end date may not be before the program start date."))
            }
        }

        // Gait ID, Fund code, Donor, and Donor dept section validations
        let detectedGaitRowErrors = {};
        let gaitRowErrorsFields = {};
        let uniqueGaitIds = {};
        let hasDuplicates = false;
        
        formdata.gaitid.map((currentRow, idx) => {
            
            // The first row's GAIT ID is required
            if (idx === 0) {
                if (currentRow.gaitid.length === 0) {
                    isValid = false;
                    addErrorMessage("gaitRow", 'gaitid', gettext('GAIT IDs may not be left blank.'), idx);
                }
            }

            // Duplicate Gait Ids validation
            if (currentRow.gaitid) {
                if (uniqueGaitIds.hasOwnProperty(currentRow.gaitid)) {
                    hasDuplicates = true;
                    addErrorMessage('gaitRow', 'gaitid', gettext('Duplicate GAIT ID numbers are not allowed.'), uniqueGaitIds[currentRow.gaitid]);
                    addErrorMessage('gaitRow', 'gaitid', gettext('Duplicate GAIT ID numbers are not allowed.'), idx);
                } else {
                    uniqueGaitIds[currentRow.gaitid] = idx;
                }
            }
            
            // Validation for if fund codes, donor, or donor dept is filled in but GAIT ID is left blank
            if (idx > 0 && currentRow.gaitid.length === 0) {
                if (currentRow.fund_code.length > 0 || currentRow.donor.length > 0 || currentRow.donor_dept.length > 0) {
                isValid = false;
                addErrorMessage('gaitRow', "gaitid", gettext('GAIT IDs may not be left blank.'), idx);
                }
            }

            // Validation for each Fund code
            currentRow.fund_code.map(currentFundCode => {
                currentFundCode = currentFundCode.toString();
                let firstDigit = parseInt(currentFundCode.slice(0, 1));
                if (currentFundCode.length !== 5) {
                    isValid = false;
                    addErrorMessage("gaitRow", "fund_code", gettext("Fund codes may only be 5 digits long."), idx);
                }
                if ([3, 7, 9].indexOf(firstDigit) === -1) {
                    isValid = false;
                    addErrorMessage("gaitRow", "fund_code", gettext("Fund codes may only begin with a 3, 7, or 9 (e.g., 30000)."), idx);
                }
            })

            // Create the invalid field arrays for the GAIT Rows to highlight
            Object.keys(detectedGaitRowErrors).map((index) => {
                let fieldNames = new Set();
                detectedGaitRowErrors[index].map((msg) => {
                    fieldNames.add(Object.keys(msg)[0]);
                })
                gaitRowErrorsFields = {...gaitRowErrorsFields, [index]: [...fieldNames]};          
            })
        });

        this.setState({
            formErrors: detectedErrors,
            gaitRowErrors: detectedGaitRowErrors,
            gaitRowErrorsFields: gaitRowErrorsFields
        });
        return isValid;
    }

    // ***** Render Componenent *****
    render() {
        const formdata = this.state.managed_data;
        const selectedCountries = this.handleSelected(formdata.country, this.props.countryOptions);
        const selectedIDAASectors = this.handleSelected(formdata.idaa_sector, this.props.idaaSectorOptions);
        const selectedOutcomeThemes = this.handleSelected(formdata.idaa_outcome_theme, this.props.idaaOutcomeThemesOptions);

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
                            id="program-name-input"
                            className={classNames('form-control', { 'is-invalid': this.state.formErrors['name'] })}
                            type="text"
                            placeholder={ !this.state.formEditable ? gettext("None") : "" }
                            maxLength={255}
                            required
                            disabled={!this.state.formEditable}
                            value={formdata.name || ""}
                            onChange={(e) => this.updateFormField('name', e.target.value) }
                        />
                        <ErrorFeedback errorMessages={this.state.formErrors['name']} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="program-id-input" className="label--required">{gettext("Program ID")}</label>
                        <input
                            id="program-id-input"
                            className={classNames('form-control', { 'is-invalid': this.state.formErrors['external_program_id'] })}
                            type="text"
                            placeholder={ !this.state.formEditable ? gettext("None") : "" }
                            maxLength={4}
                            required
                            disabled={!this.state.formEditable}
                            value={formdata.external_program_id || ""}
                            onChange={(e) => this.updateFormField('external_program_id', e.target.value.replace(/[^0-9]/g, "")) }
                        />
                        <ErrorFeedback errorMessages={this.state.formErrors['external_program_id']} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="program-start-date" className="label--required">{gettext("Program start date")}</label>
                        <div className={ classNames( {'is-invalid': this.state.formErrors['start_date']} )}>
                            <input
                                id="program-start-date"
                                className={classNames('datepicker form-control', { 'is-invalid': this.state.formErrors['start_date'] })}                
                                type="text"
                                autoComplete="off"
                                disabled={!this.state.formEditable}
                            />
                        </div>
                        <ErrorFeedback errorMessages={this.state.formErrors['start_date']} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="program-end-date" className="label--required">{gettext("Program end date")}</label>
                        <div className={ classNames( {'is-invalid': this.state.formErrors['end_date']} )}>
                            <input
                                id="program-end-date"
                                className={classNames('datepicker form-control', { 'is-invalid': this.state.formErrors['end_date'] })}                
                                type="text"
                                autoComplete="off"
                                disabled={!this.state.formEditable}
                            />
                        </div>
                        <ErrorFeedback errorMessages={this.state.formErrors['end_date']} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="program-funding_status-input" className="label--required">{gettext("Program funding status")}</label>
                        <Select
                            id="program-funding_status-input"
                            className={classNames('react-select', { 'is-invalid': this.state.formErrors['funding_status'] })}
                            placeholder={ gettext("Select...") }
                            isDisabled={!this.state.formEditable}
                            options={this.props.fundingStatusOptions}
                            value={this.props.fundingStatusOptions.find(y=>y.label===formdata.funding_status) || ""}
                            onChange={(e) => this.updateFormField('funding_status', e.label) }
                        />
                        <ErrorFeedback errorMessages={this.state.formErrors['funding_status']} />
                    </div>
                    <div className={classNames("form-group react-multiselect-checkbox", {'is-invalid': this.state.formErrors['country']})} data-toggle="tooltip" title={this.createDisplayList(selectedCountries)}>
                        <label htmlFor="program-country-input" className="label--required">{gettext("Countries")}</label>
                        {!this.state.formEditable ?
                            <input
                                id="program-country-input"
                                className={classNames('form-control', { 'is-invalid': this.state.formErrors['country'] })}
                                type="text"                      
                                value={this.createDisplayList(selectedCountries) || gettext("None selected")}
                                disabled={!this.state.formEditable}
                            />
                        :
                            <CheckboxedMultiSelect
                                id="program-country-input"
                                className={classNames('react-select', {'is-invalid': this.state.formErrors['country']})}
                                placeholder={gettext('None selected')}
                                options={this.props.countryOptions}
                                value={selectedCountries}
                                onChange={(e) => this.updateFormField('country', e.map(x=>x.value)) }
                            />
                        }
                        <ErrorFeedback errorMessages={this.state.formErrors['country']} />
                    </div>
                    <div className="form-group react-multiselect-checkbox" data-toggle="tooltip" title={this.createDisplayList(selectedIDAASectors)}>
                        <label htmlFor="program-sectors-input">{gettext("Sectors")}</label>
                        {!this.state.formEditable ? 
                            <input
                                id="program-sector-input"
                                className={classNames('form-control')}
                                type="text"                      
                                disabled={!this.state.formEditable}
                                value={this.createDisplayList(selectedIDAASectors) || gettext("None selected")}
                            />
                        :
                            <CheckboxedMultiSelect
                                id="program-sectors-input"
                                className={classNames('react-select')}
                                placeholder={gettext('None selected')}
                                options={this.props.idaaSectorOptions}
                                value={selectedIDAASectors}
                                onChange={(e) => this.updateFormField('idaa_sector', e.map(x=>x.value)) }
                            />
                        }
                    </div>
                    <div className="form-group react-multiselect-checkbox" data-toggle="tooltip" title={this.createDisplayList(selectedOutcomeThemes)}>
                        <label htmlFor="program-outcome_themes-input">{gettext("Outcome themes")}</label>
                        {!this.state.formEditable ? 
                            <input
                                id="program-outcome_themes-input"
                                className={classNames('form-control')}
                                type="text"
                                disabled={!this.state.formEditable}
                                value={this.createDisplayList(selectedOutcomeThemes) || gettext("None selected")}
                            />
                        :
                            <CheckboxedMultiSelect
                                id="program-outcome_themes-input"
                                className={classNames('react-select')}
                                placeholder={gettext('None selected')}
                                options={this.props.idaaOutcomeThemesOptions}
                                value={selectedOutcomeThemes}
                                onChange={(e) => this.updateFormField('idaa_outcome_theme', e.map(x=>x.value)) }
                            />
                        }
                    </div>

                    <table className="form-group table profile__table m-0">
                        <thead>
                            <tr>
                                <th className="profile-table__thead p-0">
                                    <label htmlFor="program-gait-input" className="label--required">{gettext("GAIT IDs")}</label>
                                </th>
                                <th className="profile-table__thead p-0 pl-1">
                                    <label htmlFor="program-fund-code-input">{gettext("Fund codes")}</label>
                                </th>
                                <th className="profile-table__thead p-0 pl-1">
                                    <label htmlFor="program-donor-input">{gettext("Donor")}</label>
                                </th>
                                {this.state.formEditable && 
                                    <th className="profile-table__thead p-0 pl-1">
                                        <label htmlFor="program-donor-dept-input">{gettext("Donor dept")}</label>
                                    </th>
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {formdata.gaitid.map((gaitRow, index) => {
                                let donorText = gaitRow.donor || "";
                                
                                // If form is not editable, concatenate and display the donor and donor dept text in the donor field
                                if (!this.state.formEditable) { 
                                    donorText = gaitRow.donor_dept ? donorText + " - " + gaitRow.donor_dept : donorText;
                                }

                                return (
                                    <React.Fragment  key={index}>
                                        <tr>
                                            <td className="profile-table__td gaitid">
                                                <input
                                                    id="program-gait-input"
                                                    className={classNames('form-control', "profile__text-input", { 'is-invalid': this.state.gaitRowErrorsFields[index] && this.state.gaitRowErrorsFields[index].includes('gaitid') })}
                                                    type="text"
                                                    placeholder={ this.state.formEditable ? "" : gettext("None")}
                                                    maxLength={5}
                                                    disabled={!this.state.formEditable}
                                                    value={gaitRow.gaitid !== null ? gaitRow.gaitid : ""}
                                                    onChange={(e) => this.updateGaitRow('gaitid', e.target.value.replace(/[^0-9]/g, ""), index) }
                                                />
                                            </td>
                                            <td className="profile-table__td fund-code pl-1" data-toggle="tooltip" title={this.createDisplayList(gaitRow.fund_code) !== null ? gaitRow.fund_code : gettext("None")}>
                                                <input
                                                    id="program-fund-code-input"
                                                    className={classNames('form-control', "profile__text-input", { 'is-invalid': this.state.gaitRowErrorsFields[index] && this.state.gaitRowErrorsFields[index].includes('fund_code') })}
                                                    type="text"
                                                    placeholder={ this.state.formEditable ? "" : gettext("None")}
                                                    disabled={!this.state.formEditable}
                                                    value={ this.createDisplayList(gaitRow.fund_code) || "" }
                                                    onChange={(e) => this.updateFundCode('fund_code', e.target.value, index)}
                                                    onKeyUp={(e) => {
                                                        if (e.key === "Backspace" && !gaitRow.fund_code[gaitRow.fund_code.length - 1]) {
                                                            let updatedFundCode = [...gaitRow.fund_code];
                                                            updatedFundCode.pop();
                                                            this.updateGaitRow('fund_code', updatedFundCode, index);
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td className="profile-table__td pl-1" data-toggle="tooltip" title={donorText !== null ? donorText : gettext("None")}>
                                                <input
                                                    id="program-donor-input"
                                                    className={classNames('form-control', "profile__text-input")}
                                                    type="text"
                                                    placeholder={ this.state.formEditable ? "" : gettext("None")}
                                                    maxLength={255}
                                                    disabled={!this.state.formEditable}
                                                    value={donorText !== null ? donorText : ""}
                                                    onChange={(e) => this.updateGaitRow('donor', e.target.value, index) }
                                                />
                                            </td>
                                            {this.state.formEditable &&
                                                <td className="profile-table__td pl-1" data-toggle="tooltip" title={gaitRow.donor_dept || gettext("None")}>
                                                    <input
                                                        id="program-donor-dept-input"
                                                        className={classNames('form-control', "profile__text-input")}
                                                        type="text"
                                                        placeholder={""}
                                                        maxLength={255}
                                                        disabled={!this.state.formEditable}
                                                        value={gaitRow.donor_dept || ""}
                                                        onChange={(e) => this.updateGaitRow('donor_dept', e.target.value, index) }
                                                    />
                                                </td>
                                            }
                                            {this.state.formEditable && formdata.gaitid.length > 1 &&
                                                <td className="profile-table__td--trash" >
                                                    <a
                                                        tabIndex="0"
                                                        onClick={() => this.deleteGaitRow(index)}
                                                        className={classNames("btn btn-link btn-danger text-nowrap")}
                                                    >
                                                        <i className="fas fa-trash"/>
                                                    </a>
                                                </td>
                                            }
                                        </tr>
                                        <tr>
                                            <td className="profile-table__td invalid" colSpan="4">
                                                <ErrorFeedback errorMessages={this.formErrorsGaitRow(index)} />
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                )                             
                            })}
                        </tbody>
                    </table>
                    {this.state.formEditable && 
                        <div className="mt-2">
                            <div tabIndex="0" onClick={() => this.appendGaitRow()} className="btn btn-link btn-add">
                                <i className="fas fa-plus-circle"/>{gettext('Add another row')}
                            </div>
                        </div>
                    }
                    {this.state.formEditable &&
                        <div className="form-group btn-row mt-4">
                            <button className="btn btn-primary" type="button" disabled={this.props.isLoading} onClick={() => formdata.id === 'new' ? this.saveNew() : this.save()}>{gettext("Save changes")}</button>
                            <button className="btn btn-reset" type="button" disabled={this.props.isLoading} onClick={() => this.resetForm()}>{gettext("Cancel changes")}</button>
                        </div>
                    }
                </form>
            </div>
        )
    }
}