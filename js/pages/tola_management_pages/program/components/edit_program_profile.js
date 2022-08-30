import React from 'react'
import Select from 'react-select'
import { observer } from "mobx-react"
import CheckboxedMultiSelect from 'components/checkboxed-multi-select'
import classNames from 'classnames'
import HelpPopover from '../../../../components/helpPopover.js'


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

    // Function to create a comma separated list to display from an array of items
    createDisplayList(listArray) {
        if (!listArray) return "null";
        if (Array.isArray(listArray)) {
            return listArray.reduce((list, item, i) => {
                let separator = i === 0 ? "" : ", ";
                item = item.label || item[1] || item;
                return list + separator + item;
            }, "");
        }
        return listArray;
    }

    updateGaitRow(label, val, index) {
        let updateRow = [...this.state.managed_data.gaitid];
        updateRow[index][label] = val;
        this.updateFormField("gaitid", updateRow);
    }

    appendGaitRow() {
        const newRow = {
            gaitid: "",
            fund_code: "",
            donor: "",
            donor_dept: ""
        };
        this.updateFormField("gaitid", [...this.state.managed_data.gaitid, newRow]);
    }

    deleteGaitRow(index) {
        let updatedRow = [...this.state.managed_data.gaitid];
        updatedRow.splice(index, 1);
        this.updateFormField("gaitid", updatedRow);
    }

    render() {
        const formdata = this.state.managed_data;
        const selectedCountries = formdata.country.map(x=>this.props.countryOptions.find(y=>y.value==x));
        const selectedSectors = formdata.sector.map(x=>this.props.sectorOptions.find(y=>y.value==x));
        const fundingStatusOptions = [{value: 0, label: gettext("Funded")}, {value: 1, label: gettext("Completed")}];
        // let sectionGaitFundDonor = this.state.formEditable || formdata.gaitid.length === 0 ? Array(5).fill({gaitid: null, fund_code: null, donor: null, donor_dept: null}) : formdata.gaitid;
        let sectionGaitFundDonor = this.state.formEditable || formdata.gaitid.length === 0 ? [{gaitid: null, fund_code: null, donor: null, donor_dept: null}] : formdata.gaitid;
        console.log(formdata)

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
                            className={classNames('form-control', { 'is-invalid': this.formErrors('id') })}
                            maxLength={4}
                            required
                            disabled={!this.state.formEditable}
                            value={formdata.id}
                            onChange={(e) => this.updateFormField('id', e.target.value.replace(/[^0-9]/g, "")) }
                        />
                        <ErrorFeedback errorMessages={this.formErrors('id')} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="program-start-date">{gettext("Program start date")}</label>
                        <input
                            type="text"
                            id="program-start-date"
                            className={classNames('form-control', { 'is-invalid': this.formErrors('start-date') })}
                            disabled={!this.state.formEditable}
                            value={formdata.start_date}
                            onChange={(e) => this.updateFormField('start-date', e.target.value) }
                        />
                        <ErrorFeedback errorMessages={this.formErrors('start-date')} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="program-end-date">{gettext("Program end date")}</label>
                        <input
                            type="text"
                            id="program-end-date"
                            className={classNames('form-control', { 'is-invalid': this.formErrors('end-date') })}
                            disabled={!this.state.formEditable}
                            value={formdata.end_date}
                            onChange={(e) => this.updateFormField('end-date', e.target.value) }
                        />
                        <ErrorFeedback errorMessages={this.formErrors('end-date')} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="program-funding_status-input" className="label--required">{gettext("Program funding status")}</label>
                        <Select
                            id="program-funding_status-input"
                            className={classNames('react-select', { 'is-invalid': this.formErrors('funding_status') })}
                            isDisabled={!this.state.formEditable}
                            options={fundingStatusOptions}
                            value={fundingStatusOptions.find(y=>y.label===formdata.funding_status)}
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
                                readOnly
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
                    <div className="form-group react-multiselect-checkbox" data-toggle="tooltip" title={this.createDisplayList(selectedSectors)}>
                        <label htmlFor="program-sectors-input">{gettext("Sectors")}</label>
                        {!this.state.formEditable ? 
                            <input
                                type="text"                      
                                value={this.createDisplayList(selectedSectors) || gettext("None Selected")}
                                className={classNames('form-control', { 'is-invalid': this.formErrors('sector') })}
                                id="program-sector-input"
                                readOnly
                                disabled={!this.state.formEditable}
                            />
                        :
                            <CheckboxedMultiSelect
                                value={selectedSectors}
                                options={this.props.sectorOptions}
                                onChange={(e) => this.updateFormField('sector', e.map(x=>x.value)) }
                                className={classNames('react-select', {'is-invalid': this.formErrors('sector')})}
                                id="program-sectors-input"
                            />
                        }
                        <ErrorFeedback errorMessages={this.formErrors('sector')} />
                    </div>
                    <div className="form-group" data-toggle="tooltip" title={this.createDisplayList(formdata.idaa_outcome_theme)}>
                        <label htmlFor="program-outcome_themes-input">{gettext("Outcome themes")}</label>
                        {/* {!this.state.formEditable ?  */}
                            <input
                                type="text"
                                value={this.createDisplayList(formdata.idaa_outcome_theme) || gettext("None Selected")}
                                onChange={(e) => this.updateFormField('outcome_themes', e.target.value) }
                                className={classNames('form-control', { 'is-invalid': this.formErrors('outcome_themes') })}
                                id="program-outcome_themes-input"
                                disabled={!this.state.formEditable}
                            />
                        {/* :
                            <CheckboxedMultiSelect
                                value={selectedSectors}
                                options={[{value: 0, label: "Theme One"}]}
                                onChange={(e) => this.updateFormField('outcome_themes', e.map(x=>x.value)) }
                                className={classNames('react-select', {'is-invalid': this.formErrors('sector')})}
                                id="program-outcome_themes-input"
                            />
                        } */}
                        <ErrorFeedback errorMessages={this.formErrors('outcome_themes')} />
                    </div>
                    <div className="form-group">
                        <div className="profile__table">
                            <div className="profile-table__column--left header">
                                <label htmlFor="program-gait-input">{gettext("GAIT IDs")}</label>
                            </div>
                            <div className="profile-table__column--middle header">
                                <label htmlFor="program-fund-code-input">{gettext("Fund codes")}</label>
                            </div>
                            <div className="profile-table__column--right header">
                                <label htmlFor="program-donor-input">{gettext("Donors")}</label>
                            </div>
                        </div>
                        {/* {sectionGaitFundDonor.map((gaitRow) => { */}
                        {(formdata.gaitid.length > 0 ? formdata.gaitid : [{gaitid: "", fund_code: " ", donor: ""}]).map((gaitRow, index) => {
                            let donorText = gaitRow.donor || null + gaitRow.donor_dept || null;
                            return(
                                <div key={index} className="profile__table">
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
                                                    className={classNames('form-control', "profile__text-input", { 'is-invalid': this.formErrors('fund_code') })}
                                                    maxLength={5}
                                                    disabled={!this.state.formEditable}
                                                    value={Array.isArray(gaitRow.fund_code) ? this.createDisplayList(gaitRow.fund_code) : gaitRow.fund_code}
                                                    onChange={(e) => this.updateGaitRow('fund_code', e.target.value.replace(/[^0-9]/g, ""), index)}
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
                            )
                        })}
                        <div className="mt-0">
                            <ErrorFeedback errorMessages={this.formErrors('gaitid')} />
                            <ErrorFeedback errorMessages={this.formErrors('fund_code')} />
                            <ErrorFeedback errorMessages={this.formErrors('donor')} />

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
