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
            original_data: Object.assign({}, program_data),
            managed_data: Object.assign({}, program_data)
        }
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

    createDisplayList(listArray) {
        if (!listArray) return "null";        
        return listArray.reduce((list, item, i) => {
            let separator = i === 0 ? "" : ", ";
            item = item.label || item;
            return list + separator + item;
        }, "");
    }

    render() {
        const formdata = this.state.managed_data;
        const selectedCountries = formdata.country.map(x=>this.props.countryOptions.find(y=>y.value==x));
        const selectedSectors = formdata.sector.map(x=>this.props.sectorOptions.find(y=>y.value==x));
        let gaitFundDonor = formdata.gaitid.length > 0 ? formdata.gaitid : [{gaitid: null, fund_code: null, donor: null}];
        console.log('gaitFundDonor', gaitFundDonor)
        console.log('formdata', formdata);
        return (
            <div className="tab-pane--react">
                <h2 className="no-bold">{this.props.program_data.name ? this.props.program_data.name+': ' : ''}{gettext("Profile")}
                    <span className="ml-1">
                        <HelpPopover
                            className="popover-icon"
                            content={
                                gettext("The fields on this tab are auto-populated with data from Identification Assignment Assistant (IDAA). These fields cannot be edited in TolaData. If changes to this program information are required, then these changes must be reflected in IDAA first.")
                            }

                        />
                    </span>
                </h2>
                <form className="form">
                    <div className="form-group">
                        <label htmlFor="program-name-input">{gettext("Program name")}</label>
                        <input
                            type="text"
                            value={formdata.name}
                            onChange={(e) => this.updateFormField('name', e.target.value) }
                            className={classNames('form-control', { 'is-invalid': this.formErrors('name') })}
                            id="program-name-input"
                            disabled
                            />
                        <ErrorFeedback errorMessages={this.formErrors('name')} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="program-id-input">{gettext("Program ID")}</label>
                        <input
                            type="text"
                            value={formdata.id}
                            onChange={(e) => this.updateFormField('id', e.target.value) }
                            className={classNames('form-control', { 'is-invalid': this.formErrors('id') })}
                            id="program-id-input"
                            disabled
                            />
                        <ErrorFeedback errorMessages={this.formErrors('id')} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="program-start-date">{gettext("Program start date")}</label>
                        <input
                            type="text"
                            value={formdata.start_date}
                            onChange={(e) => this.updateFormField('start-date', e.target.value) }
                            className={classNames('form-control', { 'is-invalid': this.formErrors('start-date') })}
                            id="program-start-date"
                            disabled
                            />
                        <ErrorFeedback errorMessages={this.formErrors('start-date')} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="program-end-date">{gettext("Program end date")}</label>
                        <input
                            type="text"
                            value={formdata.end_date}
                            onChange={(e) => this.updateFormField('end-date', e.target.value) }
                            className={classNames('form-control', { 'is-invalid': this.formErrors('end-date') })}
                            id="program-end-date"
                            disabled
                            />
                        <ErrorFeedback errorMessages={this.formErrors('end-date')} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="program-funding_status-input">{gettext("Program funding status")}</label>
                        <input
                            type="text"
                            value={formdata.funding_status}
                            onChange={(e) => this.updateFormField('funding_status', e.target.value) }
                            className={classNames('form-control', { 'is-invalid': this.formErrors('funding_status') })}
                            id="program-funding_status-input"
                            disabled
                            />
                        <ErrorFeedback errorMessages={this.formErrors('funding_status')} />
                    </div>
                    <div className="form-group react-multiselect-checkbox">
                        <label htmlFor="program-county-input" >{gettext("Countries")}</label>
                        <input
                            type="text"                      
                            value={this.createDisplayList(selectedCountries) || ""}
                            className={classNames('form-control', { 'is-invalid': this.formErrors('country') })}
                            id="program-country-input"
                            readOnly
                            />
                        {/* <CheckboxedMultiSelect
                            value={selectedCountries}
                            options={this.props.countryOptions}
                            onChange={(e) => this.updateFormField('country', e.map(x=>x.value)) }
                            className={classNames('react-select', {'is-invalid': this.formErrors('country')})}
                            id="program-country-input"
                            /> */}
                        <ErrorFeedback errorMessages={this.formErrors('country')} />
                    </div>
                    <div className="form-group react-multiselect-checkbox">
                        <label htmlFor="program-sectors-input">{gettext("Sectors")}</label>
                        <input
                            type="text"                      
                            value={this.createDisplayList(selectedSectors)}
                            className={classNames('form-control', { 'is-invalid': this.formErrors('sector') })}
                            id="program-sector-input"
                            readOnly
                            />
                        {/* <CheckboxedMultiSelect
                            value={selectedSectors}
                            options={this.props.sectorOptions}
                            onChange={(e) => this.updateFormField('sector', e.map(x=>x.value)) }
                            className={classNames('react-select', {'is-invalid': this.formErrors('sector')})}
                            id="program-sectors-input"
                            /> */}
                        <ErrorFeedback errorMessages={this.formErrors('sector')} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="program-outcome_themes-input">{gettext("Outcome themes")}</label>
                        <input
                            type="text"
                            value={this.createDisplayList(formdata.idaa_outcome_theme)}
                            onChange={(e) => this.updateFormField('outcome_themes', e.target.value) }
                            className={classNames('form-control', { 'is-invalid': this.formErrors('outcome_themes') })}
                            id="program-outcome_themes-input"
                            disabled
                            />
                        <ErrorFeedback errorMessages={this.formErrors('outcome_themes')} />
                    </div>
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
                    {gaitFundDonor.map((gaitRow, index) => {
                        console.log('gaitRow', gaitRow, this.createDisplayList(gaitRow.fund_code));
                        let donorText = gaitRow.donor;
                        return(
                            <div key={index} className="profile__table">
                                    <div className="profile-table__column--left">
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                value={gaitRow.gaitid || "null"}
                                                onChange={(e) => this.updateFormField('gaitid', e.target.value) }
                                                className={classNames('form-control', "profile__text-input", { 'is-invalid': this.formErrors('gaitid') })}
                                                id="program-gait-input"
                                                disabled
                                                />
                                            <ErrorFeedback errorMessages={this.formErrors('gaitid')} />
                                        </div>
                                    </div>
                                    <div className="profile-table__column--middle">
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                value={this.createDisplayList(gaitRow.fund_code) || "null"}
                                                onChange={(e) => this.updateFormField('fundCode', e.target.value) }
                                                className={classNames('form-control', "profile__text-input", { 'is-invalid': this.formErrors('fundCode') })}
                                                id="program-fund-code-input"
                                                disabled
                                                />
                                            <ErrorFeedback errorMessages={this.formErrors('fundCode')} />
                                        </div>
                                    </div>
                                    <div className="profile-table__column--right">
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                value={donorText}
                                                // value="Corporation for National and Community Servie (CNCS), Corporation for National and Community Servie (CNCS)"
                                                onChange={(e) => this.updateFormField('fundCode', e.target.value) }
                                                className={classNames('form-control', "profile__text-input", { 'is-invalid': this.formErrors('fundCode') })}
                                                id="program-donor-input"
                                                disabled
                                                />
                                            <ErrorFeedback errorMessages={this.formErrors('fundCode')} />
                                        </div>
                                    </div>
                            </div>
                        )
                    })}

                </form>
            </div>
        )
    }
}
