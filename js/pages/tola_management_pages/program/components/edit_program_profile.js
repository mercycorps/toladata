import React from 'react'
import Select from 'react-select'
import { observer } from "mobx-react"
import CheckboxedMultiSelect from 'components/checkboxed-multi-select'
import classNames from 'classnames'


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

    render() {
        const formdata = this.state.managed_data
        const selectedCountries = formdata.country.map(x=>this.props.countryOptions.find(y=>y.value==x))
        const selectedSectors = formdata.sector.map(x=>this.props.sectorOptions.find(y=>y.value==x))
        return (
            <div className="tab-pane--react">
                <h2 className="no-bold">{this.props.program_data.name ? this.props.program_data.name+': ' : ''}{gettext("Profile")}</h2>
                <form className="form">
                    <div className="form-group">
                        <label className="label--required" htmlFor="program-name-input">{gettext("Program name")}</label>
                        <input
                            type="text"
                            value={formdata.name}
                            onChange={(e) => this.updateFormField('name', e.target.value) }
                            className={classNames('form-control', { 'is-invalid': this.formErrors('name') })}
                            id="program-name-input"
                            required />
                        <ErrorFeedback errorMessages={this.formErrors('name')} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="program-gait-input">{gettext("GAIT ID")}</label>
                        <input
                            type="tel"
                            value={formdata.gaitid}
                            onChange={(e) => this.updateFormField('gaitid', e.target.value) }
                            className={classNames('form-control', { 'is-invalid': this.formErrors('gaitid') })}
                            id="program-gait-input"
                            disabled={!this.props.new}
                            />
                        <ErrorFeedback errorMessages={this.formErrors('gaitid')} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="program-fund-code-input">{gettext("Fund Code")}</label>
                        <input
                            type="tel"
                            value={formdata.fundCode}
                            onChange={(e) => this.updateFormField('fundCode', e.target.value) }
                            className={classNames('form-control', { 'is-invalid': this.formErrors('fundCode') })}
                            id="program-fund-code-input"
                            disabled={!this.props.new}
                            />
                        <ErrorFeedback errorMessages={this.formErrors('fundCode')} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="program-description-input">{gettext("Description")}</label>
                        <textarea
                            value={formdata.description || ''}
                            onChange={(e) => this.updateFormField('description', e.target.value) }
                            className={classNames('form-control', { 'is-invalid': this.formErrors('description') })}
                            id="program-description-input"
                            />
                        <ErrorFeedback errorMessages={this.formErrors('description')} />
                    </div>
                    <div className="form-group react-multiselect-checkbox">
                        <label htmlFor="program-county-input" className="label--required">{gettext("Countries")}</label>
                        <CheckboxedMultiSelect
                            value={selectedCountries}
                            options={this.props.countryOptions}
                            onChange={(e) => this.updateFormField('country', e.map(x=>x.value)) }
                            className={classNames('react-select', {'is-invalid': this.formErrors('country')})}
                            id="program-country-input"
                            />
                        <ErrorFeedback errorMessages={this.formErrors('country')} />
                    </div>
                    <div className="form-group react-multiselect-checkbox">
                        <label htmlFor="program-sectors-input">{gettext("Sectors")}</label>
                        <CheckboxedMultiSelect
                            value={selectedSectors}
                            options={this.props.sectorOptions}
                            onChange={(e) => this.updateFormField('sector', e.map(x=>x.value)) }
                            className={classNames('react-select', {'is-invalid': this.formErrors('sector')})}
                            id="program-sectors-input"
                            />
                        <ErrorFeedback errorMessages={this.formErrors('sector')} />
                    </div>
                    {this.props.new &&
                    <div className="form-group btn-row">
                        <button className="btn btn-primary" type="button" onClick={(e) => this.saveNew(e)}>{gettext("Save Changes")}</button>
                        {/* <button className="btn btn-primary" onClick={(e) => this.saveNewAndAddAnother(e)}>Save And Add Another</button> */}
                        <button className="btn btn-reset" type="button" onClick={() => this.resetForm()}>{gettext("Reset")}</button>
                    </div>
                    }
                    {!this.props.new &&
                    <div className="form-group btn-row">
                        <button className="btn btn-primary" type="button" onClick={(e) => this.save(e)}>{gettext("Save Changes")}</button>
                        <button className="btn btn-reset" type="button" onClick={() => this.resetForm()}>{gettext("Reset")}</button>
                    </div>
                    }
                </form>
            </div>
        )
    }
}
