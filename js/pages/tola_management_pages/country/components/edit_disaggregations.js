import React from 'react'
import { observer } from "mobx-react"
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import HelpPopover from "../../../../components/helpPopover";


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
class DisaggregationType extends React.Component {
    constructor(props) {
        super(props)

        const {disaggregation} = this.props
        const labels = disaggregation.labels.map(x => ({...x}))
        this.state = {
            managed_data: {...disaggregation, labels: [...labels]},
        }
        this.selectedByDefaultPopup = React.createRef();
    }

    hasUnsavedDataAction() {
        const labels = this.props.disaggregation.labels.map(x => ({...x}));
        this.props.onIsDirtyChange(JSON.stringify(this.state.managed_data) != JSON.stringify({...this.props.disaggregation, labels: [...labels]}))
    }
    
    componentDidUpdate = () => {
        if (this.selectedByDefaultPopup.current) {
            $(this.selectedByDefaultPopup.current).popover({
                html: true
            });
        }
    }

    resetForm() {
        this.props.clearErrors()
        const {disaggregation} = this.props
        const labels = disaggregation.labels.map(x => ({...x}))
        this.setState({
            managed_data: {...disaggregation, labels: [...labels]},
        }, () => this.hasUnsavedDataAction())
    }

    formErrors(fieldKey) {
        return this.props.errors[fieldKey]
    }

    updateDisaggregationTypeField(value) {
        this.setState({
            managed_data: {
                ...this.state.managed_data,
                disaggregation_type: value,
            },
        }, () => this.hasUnsavedDataAction())
    }
    
    updateSelectedByDefault(checked) {
        this.setState({
            managed_data: {
                ...this.state.managed_data,
                selected_by_default: checked == true
            }
        }, () => this.hasUnsavedDataAction());
    }

    updateLabel(labelIndex, value) {
        const {managed_data} = this.state
        const updatedLabels = this.state.managed_data.labels.map((label, idx) => {
            if (idx==labelIndex) {
                return Object.assign(label, {label: value})
            }
            return label
        })
        this.setState({
            managed_data: {...managed_data, labels: [...updatedLabels]}
        }, () => this.hasUnsavedDataAction())
    }

    appendLabel() {
        const newLabel = {
            id: 'new',
            label: '',
        }
        const {managed_data} = this.state
        this.setState({
            managed_data: {...managed_data, labels: [...managed_data.labels, newLabel]}
        }, () => this.hasUnsavedDataAction())
    }

    deleteLabel(labelIndex) {
        const {managed_data} = this.state
        const updatedLabels = managed_data.labels.filter((label,idx) => idx!=labelIndex || label.in_use)
        this.setState({
            managed_data: {...managed_data, labels: [...updatedLabels]}
        }, () => this.hasUnsavedDataAction())
    }

    save() {
        const {managed_data} = this.state
        this.props.saveDisaggregation(managed_data)
    }

    render() {
        const {disaggregation, expanded, expandAction, deleteAction, archiveAction, unarchiveAction, errors} = this.props
        const {managed_data} = this.state
        return (
            <div className="accordion-row">
                <div className="accordion-row__content">
                    <a onClick={expandAction} className="btn accordion-row__btn btn-link" tabIndex='0'>
                        <FontAwesomeIcon icon={expanded ? 'caret-down' : 'caret-right'} />
                        {(disaggregation.id == 'new') ? "New disaggregation" : disaggregation.disaggregation_type}
                    </a>
                    {disaggregation.is_archived && <span className="text-muted font-weight-bold ml-2">(Archived)</span>}
                    {expanded && (
                        <form className="form card card-body bg-white">
                            <div className="form-group">
                                <label className="label--required" htmlFor="disaggregation-type-input">
                                    {gettext('Disaggregation')}
                                </label>
                                <input
                                    id="disaggregation-type-input"
                                    className={classNames('form-control', {'is-invalid':this.formErrors('disaggregation_type')})}
                                    value={managed_data.disaggregation_type}
                                    onChange={(e) => this.updateDisaggregationTypeField(e.target.value)}
                                    type="text"
                                    required
                                    disabled={disaggregation.is_archived}
                                />
                                <ErrorFeedback errorMessages={this.formErrors('disaggregation_type')} />
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" checked={managed_data.selected_by_default}
                                       onChange={(e) => {this.updateSelectedByDefault(e.target.checked)}} id="selected-by-default-checkbox"
                                        disabled={disaggregation.is_archived} />
                                <label className="form-check-label" htmlFor="selected-by-default-checkbox">
                                {
                                    // # Translators: This labels a checkbox, when checked, it will make the associated item "on" (selected) for all new indicators
                                    gettext('Selected by default')
                                }
                                </label>
                                <HelpPopover
                                    key={1}
                                    content={`<p>${gettext('When adding a program indicator, this disaggregation will be selected by default.  (It can be unselected for specific indicators)')}</p>
                                              <p>${gettext('This option is recommended for disaggregations that are required for all programs in a country, regardless of sector.')}</p>`}
                                    placement="right"
                                    innerRef={this.selectedByDefaultPopup}
                                    ariaText={gettext('More information on "selected by default"')}
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    {gettext('Categories')}
                                </label>
                                {managed_data.labels.map((label, labelIndex) =>
                                    <div key={labelIndex} className="form-group disaggregation-label-group">
                                        <input
                                            value={label.label}
                                            onChange={(e) => this.updateLabel(labelIndex, e.target.value)}
                                            className={classNames("form-control", {"is-invalid": (errors.labels ? Object.keys(errors.labels[labelIndex]).length : false)})}
                                            disabled={disaggregation.is_archived}
                                        />
                                        {!disaggregation.is_archived &&
                                        <a
                                            tabIndex="0"
                                            onClick={() => this.deleteLabel(labelIndex)}
                                            className={classNames("btn btn-link btn-danger", {'disabled': label.in_use})}
                                            disabled={label.in_use || disaggregation.is_archived}
                                        >
                                            <i className="fas fa-trash"/>{gettext('Remove')}
                                        </a>}
                                    </div>
                                )}
                                {!disaggregation.is_archived && <div>
                                    <a tabIndex="0" onClick={() => this.appendLabel()} className="btn btn-link btn-add">
                                        <i className="fas fa-plus-circle"/>{gettext('Add a category')}
                                    </a>
                                </div>}
                                <div className="disaggregation-form-buttons">
                                    <div className="form-row btn-row">
                                        <button className="btn btn-primary" onClick={(e) => this.save()}
                                            disabled={disaggregation.is_archived} type="button">{gettext('Save Changes')}</button>
                                        <button className="btn btn-reset" type="button" onClick={() => this.resetForm()}
                                            disabled={disaggregation.is_archived}>{gettext('Reset')}</button>
                                    </div>
                                    <div className="right-buttons">
                                    {(disaggregation.is_archived) ? (
                                        <a tabIndex="0" onClick={unarchiveAction} className="btn btn-link">
                                            <i className="fas fa-archive"/>{
                                                // # Translators: this is a verb (on a button that archives the selected item)
                                                gettext('Unarchive disaggregation')
                                                }
                                        </a>
                                    ) : ((disaggregation.id == 'new' || !disaggregation.has_indicators) ? (
                                            <a tabIndex="0" onClick={deleteAction} className="btn btn-link btn-danger">
                                                <i className="fas fa-trash"/>{gettext('Delete disaggregation')}
                                            </a>
                                            ) : (
                                            <a tabIndex="0" onClick={archiveAction} className="btn btn-link">
                                                <i className="fas fa-archive"/>{
                                                    // # Translators: this is a verb (on a button that archives the selected item)
                                                    gettext('Archive disaggregation')
                                                    }
                                            </a>
                                        )
                                    )}
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        )
    }
}


@observer
export default class EditDisaggregations extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            expanded_id: null,
            is_dirty: false
        }
    }

    handleDirtyUpdate(is_dirty) {
        this.setState({is_dirty: is_dirty})
        this.props.onIsDirtyChange(is_dirty)
    }

    dirtyConfirm() {
        return !this.state.is_dirty || (this.state.is_dirty && confirm(gettext("You have unsaved changes. Are you sure you want to discard them?")))
    }

    toggleExpand(id) {
        this.props.clearErrors()
        if(this.dirtyConfirm()) {
            const {expanded_id} = this.state
            if (id == expanded_id) {
                this.setState({expanded_id: null})
            } else {
                this.setState({expanded_id: id})
            }
            if(expanded_id == 'new') {
                this.props.onDelete(expanded_id)
            }
            this.handleDirtyUpdate(false)
        }
    }

    addDisaggregation() {
        if(this.dirtyConfirm()) {
            this.props.addDisaggregation()
            this.setState({expanded_id: 'new'})
        }
    }

    saveDisaggregation(data) {
        const withCountry = Object.assign(data, {country: this.props.country_id})
        if (data.id == 'new') {
            this.props.onCreate(withCountry).then(
                (success) => {if(success) {this.setState({expanded_id: null})}}
            );
        } else {
            this.props.onUpdate(data.id, withCountry)
        }
        this.setState({is_dirty: false})
    }

    render() {
        const {disaggregations} = this.props
        const {expanded_id} = this.state
        return (
            <div className="tab-pane--react">
            <div className="d-flex justify-content-between">
                <h3>{gettext('Country Disaggregations')}</h3>
                <div>
                    {!disaggregations.find(d=> d.id=='new') && (
                        <a tabIndex="0" className="btn btn-link btn-add" onClick={() => this.addDisaggregation()}>
                            <i className="fas fa-plus-circle"/>{gettext("Add country disaggregation")}
                        </a>
                    )}
                </div>
            </div>
                {disaggregations.map(disaggregation =>
                    <DisaggregationType
                        key={disaggregation.id}
                        disaggregation={disaggregation}
                        expanded={disaggregation.id==expanded_id}
                        expandAction={() => this.toggleExpand(disaggregation.id)}
                        updateLabel={(labelIndex, value) => this.updateLabel(disaggregation.id, labelIndex, value)}
                        deleteAction={() => this.props.onDelete(disaggregation.id)}
                        archiveAction={() => this.props.onArchive(disaggregation.id)}
                        unarchiveAction={() => this.props.onUnarchive(disaggregation.id)}
                        saveDisaggregation={(data) => this.saveDisaggregation(data)}
                        errors={this.props.errors}
                        clearErrors={this.props.clearErrors}
                        onIsDirtyChange={(is_dirty) => this.handleDirtyUpdate(is_dirty)}
                    />
                )}
            </div>
        )
    }
}
