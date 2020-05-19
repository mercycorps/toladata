import React from 'react'
import { observer } from "mobx-react"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import HelpPopover from "../../../../components/helpPopover";
import { toJS } from 'mobx';

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
class CategoryForm extends React.Component {
    constructor(props) {
        super(props);
        this.disabledRef = React.createRef();
    }

    componentDidMount = () => {
        if (this.disabledRef.current) {
            $(this.disabledRef.current).popover({
                html: true
            });
        }
    };

    render() {
        const {index, category, listLength, ...props} = this.props;
        const isInvalid = props.errors
            && props.errors.labels
            && props.errors.labels.length > index
            && props.errors.labels[index].hasOwnProperty('label')
            && props.errors.labels[index]['label'].length;

        let deletionElement =
            <a
                tabIndex="0"
                onClick={() => props.deleteLabel(index)}
                className={classNames("btn btn-link btn-danger text-nowrap", {'disabled': category.in_use})}
            >
                <i className="fas fa-trash"/>{gettext('Remove')}
            </a>;

        if (props.disabled || category.in_use) {
            // In the case that there is only one category and it is in use or archived, preference the disabled
            // element over the null element
            deletionElement =
                <HelpPopover
                    key={1}
                    content={ gettext('This category cannot be edited or removed because it was used to disaggregate a result.') }
                    placement="bottom"
                    className='btn btn-link'
                    iconClass="fa fa-lock text-muted"
                    className="btn btn-link"
                    innerRef={ this.disabledRef }
                    ariaText={gettext('Explanation for absence of delete button')}
                />
        }
        else if(listLength === 1) {
            deletionElement = null;
        }

        return (
            <React.Fragment>
                <div className="form-group col-md-7">
                    <input
                        value={ category.label }
                        onChange={(e) => props.updateLabel(index, { label: e.target.value })}
                        className={classNames("form-control", {"is-invalid": isInvalid})}
                        disabled={category.in_use || props.disabled}
                    />
                    { props.errors.labels &&
                        <ErrorFeedback errorMessages={props.errors.labels.length > index
                            ? props.errors.labels[index]['label']
                            : null} />
                    }
                </div>
                <div className="form-group col-md-2">
                    <select
                        value={category.customsort}
                        onChange={ (e) => props.updateLabelOrder(index, e.target.value - 1) }
                        className="form-control" disabled={props.disabled}
                    >
                        {
                            Array.from(Array(listLength).keys()).map(value => <option value={value+1} key={value}>{value+1}</option>)
                        }
                    </select>
                </div>
                <div className="form-group">
                    {deletionElement}
                </div>
            </React.Fragment>
        );
    }
}


const DisaggregationCategoryList = observer(
    ({id, categories, ...props}) => (
        <DragDropContext
            onDragEnd={ ({source: s = null, destination: d = null}) => { (s !== null && d !== null) && props.updateLabelOrder(s.index, d.index);} }
          >
            <Droppable
                droppableId={ `disaggregation-category-list-${ id }` }
                renderClone={(provided, snapshot, rubric) => (
                    <div className="form-group mb-0 disaggregation-label-group"
                        ref={ provided.innerRef }
                        {...provided.draggableProps}
                    >
                    <span className="draggable-arrow" {...provided.dragHandleProps}>
                        <i className="fas fa-arrows-alt fa-lg"></i>
                    </span>
                    <CategoryForm
                        index={ rubric.source.index }
                        category={ categories[rubric.source.index] }
                        listLength={ categories.length }
                        { ...props }
                    />
                    </div>
                )}
            >
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        {
                        categories.map((category, index) => (
                            <Draggable
                                draggableId={ category.id == 'new' ? category.createdId : String(category.id) }
                                index={ index }
                                isDragDisabled={props.disabled}
                                key={ category.id == 'new' ? category.createdId : category.id }>
                                {(provided, snapshot) => (
                                    <div className="form-group mb-0 disaggregation-label-group"
                                        ref={ provided.innerRef }
                                        {...provided.draggableProps}
                                    >
                                        <span className="draggable-arrow" {...provided.dragHandleProps}>
                                            <i className="fas fa-arrows-alt fa-lg"></i>
                                        </span>
                                        <CategoryForm
                                            index={ index }
                                            category={ category }
                                            listLength={ categories.length }
                                            { ...props }
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ))
                        }
                        { provided.placeholder }
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
);


@observer
class DisaggregationType extends React.Component {
    constructor(props) {
        super(props)
        const {disaggregation} = this.props
        this.state = {
            ...disaggregation,
            labels: this.orderLabels(disaggregation.labels)
        };
        this.labelsCreated = 0;
        this.selectedByDefaultPopup = React.createRef();
    }

    orderLabels(labels) {
        return labels.slice().map((label, index) => ({...label, customsort: index + 1}));
    }

    hasUnsavedDataAction() {
        const labels = this.props.disaggregation.labels.map(x => ({...x}));
        this.props.onIsDirtyChange(JSON.stringify(this.state) != JSON.stringify({...this.props.disaggregation, labels: [...labels]}))
    }

    componentDidUpdate = () => {
        /*
        This is a super ugly hack to fix a bug and avoid re-writing the state management of this component.
        Without this code block, if a new label is added and the form is saved, the id of "new"
        never gets replaced with the real id coming from the server.  So if the user tries to add
        another label and save, a validation error occurs because it looks like there are two
        new labels, one of which would be a duplicate.
         */
        if (this.state.labels) {
            const labelMap = this.props.disaggregation.labels.reduce((accum, labelObj) => {
                accum[labelObj.label] = labelObj.id;
                return accum;
            }, {});
            const a = new Set(Object.keys(labelMap));
            if (a.size === this.state.labels.length) {
                this.state.labels.forEach(labelInState => {
                    if (labelInState.id === "new") {
                        if (Object.keys(labelMap).includes(labelInState.label)) {
                            labelInState.id = labelMap[labelInState.label];
                        }
                    }
                });
            }
        }

        if (this.selectedByDefaultPopup.current) {
            $(this.selectedByDefaultPopup.current).popover({
                html: true
            });
        }
    };

    componentDidMount(){
        $('[data-toggle="popover"]').popover();
    }

    resetForm() {
        this.props.clearErrors();
        this.setState({
            ...this.props.disaggregation,
            labels: this.orderLabels(this.props.disaggregation.labels),
        }, () => this.hasUnsavedDataAction())
    }

    formErrors(fieldKey) {
        return this.props.errors[fieldKey]
    }

    updateDisaggregationTypeField(value) {
        this.setState({
            disaggregation_type: value,
        }, () => this.hasUnsavedDataAction())
    }

    updateSelectedByDefault(checked) {
        this.setState({
            selected_by_default: checked == true
        }, () => this.hasUnsavedDataAction());
    }

    updateLabel(labelIndex, updatedValues) {
        let labels = this.state.labels;
        labels[labelIndex] = { ...labels[labelIndex], ...updatedValues };
        this.setState({
            labels: this.orderLabels(labels)
        }, () => this.hasUnsavedDataAction())
    }

    updateLabelOrder(oldIndex, newIndex) {
        let labels = this.state.labels;
        let remainingLabels = [...labels.slice(0, oldIndex), ...labels.slice(oldIndex + 1)];
        const reorderedLabels = this.orderLabels(
            [...remainingLabels.slice(0, newIndex), labels[oldIndex], ...remainingLabels.slice(newIndex)]);
        this.setState({labels: reorderedLabels}, () => this.hasUnsavedDataAction());
        this.props.assignLabelErrors({labels: reorderedLabels});
    }

    appendLabel() {
        this.labelsCreated += 1;
        const newLabel = {
            id: 'new',
            label: '',
            createdId: `new-${this.labelsCreated}`
        };
        this.setState({
            labels: this.orderLabels([...this.state.labels, newLabel])
        }, () => {$('.disaggregation-label-group').last().find('input').first().focus(); this.hasUnsavedDataAction();})
    }

    deleteLabel(labelIndex) {
        const updatedLabels = this.orderLabels([...this.state.labels.slice(0, labelIndex),
                                                ...this.state.labels.slice(labelIndex + 1)]);
        this.setState({
            labels: updatedLabels
        }, () => this.hasUnsavedDataAction());
        this.props.assignLabelErrors({labels: updatedLabels});
    }

    save() {
        this.props.saveDisaggregation(this.state)
    }

    render() {
        const {disaggregation, expanded, expandAction, deleteAction, archiveAction, unarchiveAction, errors} = this.props
        const managed_data = this.state
        return (
            <div className="accordion-row">
                <div className="accordion-row__content">
                    <a onClick={() => {expandAction(this.resetForm.bind(this));}} className="btn accordion-row__btn btn-link" tabIndex='0'>
                        <FontAwesomeIcon icon={expanded ? 'caret-down' : 'caret-right'} />
                        {(disaggregation.id == 'new') ? "New disaggregation" : disaggregation.disaggregation_type}
                    </a>
                    {disaggregation.is_archived && <span className="text-muted font-weight-bold ml-2">(Archived)</span>}
                    {expanded && (
                        <form className="form card card-body bg-white">
                            <div className="form-group">
                                <label className="label--required" htmlFor="disaggregation-type-input">
                                    {/* # Translators: Form field label for the disaggregation name.*/}
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
                                <div className="form-check" style={ {marginTop: '8px'} }>
                                    <input className="form-check-input" type="checkbox" checked={managed_data.selected_by_default}
                                           onChange={(e) => {this.updateSelectedByDefault(e.target.checked)}} id="selected-by-default-checkbox"
                                            disabled={disaggregation.is_archived} />
                                    <nobr>
                                    <label className="form-check-label mr-2" htmlFor="selected-by-default-checkbox">
                                    {
                                        // # Translators: This labels a checkbox, when checked, it will make the associated item "on" (selected) for all new indicators
                                        gettext('Selected by default')
                                    }
                                    </label>
                                    <HelpPopover
                                        key={1}
                                        // # Translators: Help text for the "selected by default" checkbox on the disaggregation form
                                        content={`<p>${interpolate(gettext('When adding a new program indicator, this disaggregation will be selected by default for every program in %s. The disaggregation can be manually removed from an indicator on the indicator setup form.'), [gettext(this.props.countryName)])}</p>`}
                                        placement="right"
                                        innerRef={this.selectedByDefaultPopup}
                                        ariaText={gettext('More information on "selected by default"')}
                                    />
                                    </nobr>
                                </div>
                            </div>
                            <div className="form-group" style={ {marginTop: '8px'} }    >
                                <div className="row">
                                    <div className="col-md-7">
                                        <h4>
                                            {/* # Translators:  This is header text for a list of disaggregation categories*/}
                                            {gettext('Categories')}
                                        </h4>
                                    </div>
                                    <div style={ {marginLeft: '38px'} }>
                                    {/* Paul: I know this is gross, but trying to line up order with the fields below: */}
                                    {/* # Translators:  This a column header that shows the sort order of the rows below*/}
                                        <label>{gettext('Order')}</label>
                                    </div>
                                </div>
                                <DisaggregationCategoryList
                                    id={ disaggregation.id }
                                    categories={ this.state.labels }
                                    disabled={ disaggregation.is_archived }
                                    updateLabelOrder={ this.updateLabelOrder.bind(this) }
                                    updateLabel={ this.updateLabel.bind(this) }
                                    deleteLabel={ this.deleteLabel.bind(this) }
                                    errors={ errors }
                                    />
                                {!disaggregation.is_archived && <div style={ {marginTop: '-15px', marginLeft: '-5px'} }>
                                    <a tabIndex="0" onClick={() => this.appendLabel()} className="btn btn-link btn-add">
                                        {/* # Translators:  Button label.  Button allows users to add a disaggregation category to a list.  */}
                                        <i className="fas fa-plus-circle"/>{gettext('Add a category')}
                                    </a>
                                </div>}
                            </div>
                            <div className="disaggregation-form-buttons">
                                <div className="form-row btn-row">
                                    <button className="btn btn-primary" onClick={(e) => this.save()}
                                        disabled={disaggregation.is_archived} type="button">{gettext('Save Changes')}</button>
                                    <button className="btn btn-reset" type="button" onClick={() => this.resetForm()}
                                        // # Translators:  Button label.  Allows users to undo whatever changes they have made.
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
                                            {/* # Translators:  Button text that allows users to delete a disaggregation */}
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
            is_dirty: false,
            formReset: null,
            origSelectedByDefault: false
        }
    }

    handleDirtyUpdate(is_dirty) {
        this.setState({is_dirty: is_dirty})
        this.props.onIsDirtyChange(is_dirty)
    }

    dirtyConfirm() {
        return !this.state.is_dirty || (this.state.is_dirty && confirm(gettext("You have unsaved changes. Are you sure you want to discard them?")))
    }

    toggleExpand(id, formReset) {
        this.props.clearErrors();
        if(this.dirtyConfirm()) {
            const {expanded_id} = this.state;
            if (id == expanded_id) {
                (this.state.is_dirty && formReset) && formReset();
                this.setState({expanded_id: null, formReset: null, origSelectedByDefault: null});
            } else {
                if (this.state.formReset) {
                    (this.state.is_dirty && this.state.formReset());
                }
                const currentDisaggList = this.props.disaggregations.filter( disagg => disagg.id === id);
                let selectedByDefault = currentDisaggList.length > 0 ? currentDisaggList[0].selected_by_default : null;
                this.setState({
                    expanded_id: id,
                    formReset: formReset,
                    origSelectedByDefault: selectedByDefault
                });
            }
            if(expanded_id == 'new') {
                this.onDelete(expanded_id);
            }
            this.handleDirtyUpdate(false)
        }
    }

    addDisaggregation() {
        if(this.dirtyConfirm()) {
            this.props.addDisaggregation()
            this.setState({
                expanded_id: 'new',
                origSelectedByDefault: false,
            }, () => {$('#disaggregation-type-input').focus();});
        }
    }

    onDelete(id) {
        this.props.onDelete(id, () => {this.setState({is_dirty: false, expanded_id: null, formReset: null})});
        this.props.clearErrors();
    }

    onSaveChangesPress(data) {
        if ( this.state.origSelectedByDefault !== data.selected_by_default ){
            if (data.selected_by_default) {
                create_no_rationale_changeset_notice({
                    // # Translators:  This is a warning popup when the user tries to do something that has broader effects than they might anticipate
                    preamble: interpolate(gettext("This disaggregation will be automatically selected for all new indicators in %s. Existing indicators will be unaffected."), [gettext(this.props.countryName)]),
                    // # Translators: This is the prompt on a popup that has warned users about a change they are about to make that could have broad consequences
                    message_text: gettext("Are you sure you want to continue?"),
                    on_submit: () => this.saveDisaggregation(data),
                    on_cancel: () => {},
                    type: "notice"
                })
            }
            else {
                create_no_rationale_changeset_notice({
                    // # Translators:  This is a warning popup when the user tries to do something that has broader effects than they might anticipate
                    preamble: interpolate(gettext("This disaggregation will no longer be automatically selected for all new indicators in %s. Existing indicators will be unaffected."), [this.props.countryName]),
                    // # Translators: This is the prompt on a popup that has warned users about a change they are about to make that could have broad consequences
                    message_text: gettext("Are you sure you want to continue?"),
                    on_submit: () => this.saveDisaggregation(data),
                    on_cancel:()=>{},
                    type: "notice"
                })
            }

        }
        else{
            this.saveDisaggregation(data);
        }
    }

    saveDisaggregation(data) {
        const withCountry = Object.assign(data, {country: this.props.country_id});
        if (data.id === 'new') {
            this.props.onCreate(withCountry).then(
                (newDisaggregation) => {
                    this.setState({
                        expanded_id: newDisaggregation.id,
                        formReset: null,
                        origSelectedByDefault: data.selected_by_default
                    });
                },
                ()=>{}
            );
        } else {
            this.props.onUpdate(data.id, withCountry);
            this.setState({origSelectedByDefault: data.selected_by_default});
        }
        this.setState({is_dirty: false});
    }

    render() {
        const {disaggregations} = this.props;
        const {expanded_id} = this.state;
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
                        assignLabelErrors={this.props.assignLabelErrors}
                        expandAction={(callback) => this.toggleExpand(disaggregation.id, callback)}
                        updateLabel={(labelIndex, value) => this.updateLabel(disaggregation.id, labelIndex, value)}
                        deleteAction={this.onDelete.bind(this, disaggregation.id)}
                        archiveAction={() => this.props.onArchive(disaggregation.id)}
                        unarchiveAction={() => this.props.onUnarchive(disaggregation.id)}
                        saveDisaggregation={(data) => this.onSaveChangesPress(data)}
                        errors={this.props.errors}
                        clearErrors={this.props.clearErrors}
                        onIsDirtyChange={(is_dirty) => this.handleDirtyUpdate(is_dirty)}
                        countryName={this.props.countryName}
                    />
                )}
            </div>
        )
    }
}
