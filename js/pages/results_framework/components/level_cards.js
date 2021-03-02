import React from 'react';
import classNames from 'classnames';
import { observer, inject } from "mobx-react"
import { toJS, extendObservable, action } from 'mobx';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight, faCaretDown, faArrowsAlt, faMarsStrokeH } from '@fortawesome/free-solid-svg-icons'
import { SingleReactSelect } from "../../../components/selectWidgets";
import { AddIndicatorButton, UpdateIndicatorButton } from '../../../components/indicatorModalComponents';
import {sortableContainer, sortableElement, sortableHandle} from 'react-sortable-hoc';
import HelpPopover from "../../../components/helpPopover";
import TextareaAutosize from 'react-autosize-textarea';
import Select from "react-select"
import { create_unified_changeset_notice } from '../../../components/changesetNotice';



library.add(faCaretDown, faCaretRight, faArrowsAlt);

export class LevelTitle extends React.Component {

    render() {
        return (
            <h3 className={'level-title ' + this.props.classes}>
                {this.props.tierName}
                {/*if we don't check whether there is an ontology, there ill be an extra
                space before the colon */}
                {this.props.ontologyLabel ? " " + this.props.ontologyLabel : null}
            </h3>
        )
    }
}

class ProgramObjectiveImport extends React.Component {
    onChange = (item) => {
        this.props.onProgramObjectiveImport(item.value);
    }

    render() {
        const programObjectives = this.props.programObjectives;

        // hide if no objectives to import
        if (programObjectives.length === 0) return null;

        const options = programObjectives.map( entry => {return {value: entry.id, label: entry.name}});

        return (
            <div className="program-objective-import mb-3">
                <Select
                    // # Translators: Take the text of a program objective and import it for editing
                    placeholder={gettext('Import Program Objective')}
                    onChange={ this.onChange }
                    value={ "" }
                    className="tola-react-select"
                    options={ options }
                    isDisabled={this.props.isDisabled}
                />

                <a href="#"
                   className="program-objective-import__icon"
                   tabIndex="0"
                   data-html="true"
                   data-toggle="popover"
                   data-placement="bottom"
                   data-trigger="focus"
                   data-content={
                       /* # Translators: instructions to users containing some HTML */
                       gettext("Import text from a Program Objective. <strong class='program-objective-import__popover-strong-text'>Make sure to remove levels and numbers from your text, because they are automatically displayed.</strong>")
                   }
                   onClick={e => e.preventDefault()}>
                    <i className="far fa-question-circle"/>
                </a>
            </div>
        )
    }
}

@inject('rootStore')
@observer
export class LevelCardCollapsed extends React.Component {

    deleteLevel = () => {
        this.props.rootStore.uiStore.setDisableCardActions(true);
        const levelTitle = this.props.levelProps.tierName + " " + this.props.levelProps.ontologyLabel;
        create_unified_changeset_notice({
            header: gettext("Warning"),
            show_icon: true ,
            notice_type: 'error',
            preamble: gettext("This action cannot be undone."),
            /* # Translators:  This is a confirmation prompt that is triggered by clicking on a delete button. The code is a reference to the name of the specific item being deleted.  Only one item can be deleted at a time. */
            message_text: interpolate(gettext("Are you sure you want to delete %s?"), [levelTitle]),
            on_submit: () => this.props.rootStore.levelStore.deleteLevelFromDB(this.props.level.id),
            on_cancel: () => this.props.rootStore.uiStore.setDisableCardActions(false)
        });
    };

    editLevel = () => {
        this.props.rootStore.uiStore.editCard(this.props.level.id)
    };

    componentDidMount() {
        // Enable popovers after update (they break otherwise)
        $('*[data-toggle="popover"]').popover({
            html: true
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Enable popovers after update (they break otherwise)
        $('*[data-toggle="popover"]').popover({
            html: true
        });
    }

    buildIPTTUrl = (indicator_ids) => {
        let url = `/indicators/iptt_report/${this.props.rootStore.levelStore.program_id}/timeperiods/?frequency=3&start=0&end=999`;
        indicator_ids.forEach( i => url += "&indicators="+i);
        return url
    };

    render(){
        // the level card shouldn't be displayed if it's parent level is not expandoed (except
        // if the level is the top level one).
        if (this.props.rootStore.uiStore.hasVisibleChildren.indexOf(this.props.level.parent) < 0 && this.props.level.parent != null){
            return null;
        }

        // Prepare the indicator links for the indicator popover
        let allIndicatorLinks = [];

        // Get indicator ids linked to this level and create a hyperlink for a filtered IPTT.
        let sameLevelIndicatorIds = this.props.levelProps.indicators.map( i => i.id);
        if (sameLevelIndicatorIds.length > 0) {
            /* # Translators: this link opens a view of all indicators linked to (associated with) a particular level (level name replaces %s) */
            const linkPreface = gettext('All indicators linked to %s');
            const linkText = interpolate(linkPreface, [`${this.props.levelProps.tierName} ${this.props.levelProps.ontologyLabel}`]);
            allIndicatorLinks.push(`<li class="nav-item level-card--iptt-links"><a href=${this.buildIPTTUrl(sameLevelIndicatorIds)}>${linkText}</a></li>`);
        }

        // Get indicator ids linked to the descendants of this level, add the indicator ids identified
        // above, and create a hyperlink for a filtered IPTT.  Only do this if the level has sublevels.
        if (this.props.levelProps.tierName != this.props.rootStore.levelStore.chosenTierSet.slice(-1)[0]) {
            let descendantIndicatorIds = this.props.levelProps.descendantIndicatorIds;
            if (descendantIndicatorIds.length > 0) {
                descendantIndicatorIds = descendantIndicatorIds.concat(sameLevelIndicatorIds);
                /* # Translators: this link opens a view of all indicators linked to (associated with) a particular level and its child levels (level name replaces %s) */
                const linkPreface = gettext('All indicators linked to %s and sub-levels');
                const linkText = interpolate(linkPreface, [`${this.props.levelProps.tierName} ${this.props.levelProps.ontologyLabel}`]);
                allIndicatorLinks.unshift(`<li class="nav-item level-card--iptt-links"><a href=${this.buildIPTTUrl(descendantIndicatorIds)}>${linkText}</a></li>`);
            }
        }

        // Create IPTT hyperlinks for each individual indicator linked to this level
        let individualLinks = this.props.levelProps.indicators
            .sort( (a, b) => a.level_order - b.level_order)
            .map( (indicator, index) => {
                let indicatorNumber = "";
                if (!this.props.rootStore.levelStore.manual_numbering) {
                    indicatorNumber = this.props.levelProps.ontologyLabel + String.fromCharCode(97 + index) + ": ";
                }
                else if (this.props.rootStore.levelStore.manual_numbering && indicator.number) {
                    indicatorNumber = indicator.number + ": ";
                }
                return `<li class="nav-item level-card--iptt-links"><a href=${this.buildIPTTUrl([indicator.id])}>${indicatorNumber}${indicator.name}</a></li>`;
            });

        allIndicatorLinks = allIndicatorLinks.concat(individualLinks);


        let indicatorMarkup = `<ul class="nav flex-column">${allIndicatorLinks.join("")}</ul>`;
        const iCount = this.props.levelProps.indicators.length;
        /* # Translators: This is a count of indicators associated with another object */
        const indicatorCountText = interpolate(ngettext("%s indicator", "%s indicators", iCount), [iCount]);

        // The expando caret is only applied to levels that:
        // 1. Aren't at the end of the leveltier hierarchy
        // 2. Actually have children
        // The expando click should be disabled when there is a card being edited
        let expando = null;
        if (this.props.levelProps.tierName != toJS(this.props.rootStore.levelStore.chosenTierSet.slice(-1)[0]) &&
            this.props.rootStore.levelStore.levels.filter( l => l.parent == this.props.level.id).length > 0){
            expando = <FontAwesomeIcon
                className={this.props.rootStore.uiStore.disabledActionsOrActiveCard ? "" : "text-action"}
                icon={this.props.rootStore.uiStore.hasVisibleChildren.indexOf(this.props.level.id) >= 0 ? 'caret-down' : 'caret-right'} />
        }
        const expandoClasses = expando && !this.props.rootStore.uiStore.disabledActionsOrActiveCard ? "level-card__toggle" : null;
        const expandoFunc = this.props.rootStore.uiStore.disabledActionsOrActiveCard ? null :
            (e) => this.props.rootStore.uiStore.updateVisibleChildren(this.props.level.id);

        let isIndicatorDropdownDisabled = allIndicatorLinks.length === 0 || this.props.rootStore.uiStore.disableCardActions;
        return (
            <div className="level-card level-card--collapsed" id={`level-card-${this.props.level.id}`}>
                <div
                    className={expandoClasses}
                    onClick={expandoFunc}>
                    {expando}
                    <span className="level-card--collapsed__name">
                        <LevelTitle
                            tierName={this.props.levelProps.tierName}
                            ontologyLabel={this.props.levelProps.ontologyLabel}
                            classes="level-title--collapsed"
                        />
                        &nbsp;{this.props.level.name}
                    </span>
                </div>
                <div className="level-card--collapsed__actions">
                    <div className="actions__top btn-row">
                        { this.props.levelProps.canDelete &&
                            <button
                                disabled={this.props.rootStore.uiStore.disableCardActions || this.props.rootStore.uiStore.activeCard}
                                className="btn btn-sm btn-link btn-danger"
                                onClick={this.deleteLevel}>
                                <i className="fas fa-trash-alt"></i>{gettext("Delete")}
                            </button>
                        }
                        {this.props.levelProps.canEdit &&
                            <button
                                disabled={this.props.rootStore.uiStore.disableCardActions}
                                className="btn btn-sm btn-link btn-text edit-button"
                                onClick={this.editLevel}>
                                <i className="fas fa-edit"/>{gettext("Edit")}
                            </button>
                        }
                    </div>
                    <div className="actions__bottom">
                        <a
                            tabIndex="0"
                            className={classNames("btn btn-sm btn-link no-bold", {disabled: isIndicatorDropdownDisabled})}
                            data-toggle="popover"
                            data-trigger="focus"
                            data-placement="bottom"
                            data-html="true"
                            title={
                                /* # Translators: this is the title of a button to open a popup with indicator performance metrics*/
                                gettext("Track indicator performance")
                            }
                            data-content={indicatorMarkup}>
                            {indicatorCountText}
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}


@inject('rootStore')
@observer
export class LevelCardExpanded extends React.Component {
    constructor(props){
        super(props);
        this.submitType = "saveOnly";
        this.indicatorWasReordered = false;

        // These 'base' vars will allow us to save orignalish data so we know whether to prompt users if they hit cancel.
        // baseIndicators will need to be updated on indicator changes other than reordering since we don't
        // want to warn for e.g. indicator creation, since users can't do anything about that.
        this.baseLevelString = JSON.stringify([props.level.name, props.level.assumptions]);
        this.baseIndicators = this.props.levelProps.indicators.slice().map( i => toJS(i));

        extendObservable(this, {
            name: props.level.name,
            assumptions: props.level.assumptions,
            indicators: props.levelProps.indicators.sort((a, b) => a.level_order - b.level_order),

            get dataHasChanged () {
                const baseData = this.baseLevelString + JSON.stringify(this.baseIndicators.sort( (a, b) => a.id - b.id));
                const currentData = JSON.stringify([this.name, this.assumptions]) + JSON.stringify(toJS(this.indicators).sort( (a, b) => a.id - b.id));
                return currentData != baseData;
            },

            addIndicator (data) {
                this.indicators.push(data);
                this.baseIndicators.push(data)
            },

            deleteIndicator (indicatorId) {
                this.indicators = this.indicators.filter( i => i.id != indicatorId);
                this.indicators.forEach( (indicator, index) => indicator.level_order = index);
                this.baseIndicators = this.baseIndicators.filter( i => i.id != indicatorId);
                this.baseIndicators.forEach( (indicator, index) => indicator.level_order = index);
            },

            updateIndicatorName (indicatorId, newName) {
                this.indicators.find( i => i.id == indicatorId).name = newName;
                this.baseIndicators.find( i => i.id == indicatorId).name = newName;
                this.props.rootStore.levelStore.updateIndicatorNameInStore(indicatorId, newName);
            }

        }, {
            addIndicator: action,
            deleteIndicator: action,
            updateIndicatorName: action
        });
    }

    onDragEnd = ({oldIndex, newIndex}) => {
        this.indicatorWasReordered = true;
        const indicatorId = this.indicators[oldIndex].id;
        const fakeChangeObj = {value: newIndex + 1, name: newIndex + 1};
        this.changeIndicatorOrder(indicatorId, fakeChangeObj)
    };

    // Updates the indicator order, resets level_order as necessary, sets updated data flag.
    changeIndicatorOrder = (indicatorId, changeObj) => {
        let oldIndex = this.indicators.find( i => i.id == indicatorId).level_order;
        let newIndex = changeObj.value - 1;
        let tempIndicators = this.indicators.slice();
        tempIndicators.splice(newIndex, 0, tempIndicators.splice(oldIndex, 1)[0]);
        tempIndicators.forEach( (indicator, index) => indicator.level_order = index);
        this.indicators.replace(tempIndicators)
        this.props.rootStore.uiStore.activeCardNeedsConfirm = this.dataHasChanged;
        this.indicatorWasReordered = true;
    };

    /*
    Using this allows us to use the same submit function for all three buttons.  Shame the function has to
    be passed all the way down to the button to work.
     */
    updateSubmitType = (newType) => {
        this.submitType = newType;
    };

    componentDidUpdate() {
        // Enable popovers after update.  This is needed for the help popover in the indicator list section.
        // Without this, the popover doesnt' pop.
        $('*[data-toggle="popover"]').popover({
            html: true
        });
    }

    componentDidMount() {
        // Enable popovers after load (they break otherwise)
        $('*[data-toggle="popover"]').popover({
            html: true
        });

        // Handle indicator creation.  Need to update rootStore and component store so if you close and reopen the card, you still see the new indicator
        $('#indicator_modal_div').on('created.tola.indicator.save', (e, params) => {
            const indicatorData = {
                id: params.indicatorId,
                name: params.indicatorName,
                level: this.props.level.id,
                level_order: this.indicators.length
            };
            this.props.rootStore.levelStore.addIndicatorToStore(indicatorData)
            this.addIndicator(indicatorData)

        });

        // Handle indicator deletion.  Need to update rootStore and component store so if you close and reopen the card, you still see the new indicator
        $('#indicator_modal_div').on('deleted.tola.indicator.save', (e, params) => {
            this.props.rootStore.levelStore.deleteIndicatorFromStore(params.indicatorId);
            this.deleteIndicator(params.indicatorId)

        });

        // Handle indicator update.  Need to update rootStore and component store so if you close and reopen the card, you still see the new indicator
        $('#indicator_modal_div').on('updated.tola.indicator.save', (e, params) => {

            this.updateIndicatorName(params.indicatorId, params.indicatorName);

            if (params.levelId != this.props.rootStore.uiStore.activeCard){
                // Only add the indicator to another level if it wasn't blanked out
                if (params.levelId){
                    this.props.rootStore.levelStore.moveIndicatorInStore(params.indicatorId, params.levelId)
                }
                this.deleteIndicator(params.indicatorId);
            }

            // Need to remount the tooltip so it reflects a potential new name.  It's a big janky, should probably use a react component instead.
            $('*[data-toggle="tooltip"]').tooltip('dispose');
            $('*[data-toggle="tooltip"]').tooltip();
        });
    }

    componentWillUnmount() {
        $('#indicator_modal_div').off('updated.tola.indicator.save');
        $('#indicator_modal_div').off('deleted.tola.indicator.save');
        $('#indicator_modal_div').off('created.tola.indicator.save');
    }

    saveLevel = (event) => {
        event.preventDefault();
        const saveFunc = (rationale) => {
            this.props.rootStore.levelStore.saveLevelToDB(
                this.submitType,
                this.props.level.id,
                this.indicatorWasReordered,
                {
                    name: this.name,
                    assumptions: this.assumptions,
                    rationale: rationale,
                    indicators: toJS(this.indicators)}
            )};

        const hasIndicators = this.indicators.length > 0;
        const hasUpdatedAssumptions = this.props.level.assumptions.length > 0 && this.assumptions != this.props.level.assumptions;
        const hasUpdatedName = this.name != this.props.level.name;

        if ( hasIndicators && (hasUpdatedAssumptions || hasUpdatedName)){
            create_unified_changeset_notice({
                header: gettext("Reason for change"),
                show_icon: true,
                message_text: gettext("Your changes will be recorded in a change log.  For future reference, please share your reason for these changes."),
                include_rationale: true,
                rationale_required: true,
                notice_type: 'notice',
                on_submit: saveFunc,
                on_cancel: () => this.props.rootStore.uiStore.setDisableCardActions(false),
            });
        }
        else {
            saveFunc('');
        }
    };

    cancelEdit = () => {
        if (this.props.rootStore.levelStore.levels.length == 1 && this.props.level.id == "new"){
            this.clearData();
        }
        else{
            this.props.rootStore.levelStore.cancelEdit(this.props.level.id);
        }
    };

    clearData = () => {
        this.name = "";
        this.assumptions = "";
    };

    onFormChange = (event) => {
        event.preventDefault();
        this[event.target.name] = event.target.value;
        // Add inline error message if name field is blanked out
        if (!this.name) {
            const target = $(`#level-name-${this.props.level.id}`);
            target.addClass("is-invalid");
            /* # Translators: This is a validation message given to the user when the user-editable name field has been deleted or omitted. */
            let feedbackText = gettext('Please complete this field.');
            target.after(`<p id=name-feedback-${this.props.level.id} class="invalid-feedback">${feedbackText}</p>`);
        }
        else{
            $(`#level-name-${this.props.level.id}`).removeClass("is-invalid");
            $(`#name-feedback-${this.props.level.id}`).remove();
        }
        this.props.rootStore.uiStore.activeCardNeedsConfirm = this.dataHasChanged;
    };

    onProgramObjectiveImport = (programObjectiveId) => {
        const programObjective = this.props.rootStore.levelStore.programObjectives.find(po => po.id === programObjectiveId);

        if (programObjective != null) {
            this.name = programObjective.name;
            this.assumptions = programObjective.description;
        }
    };

    render(){
        // Need to reference a couple of observed vars so they react to changes.
        // Simply passing the observables through to a child component or injecting them in
        // the child component doesn't work.  No doubt that there's a better way to do this.
        const tempIndicators = toJS(this.indicators);
        const disabledTrigger = this.props.rootStore.uiStore.disableCardActions;
        const programObjectives = this.props.rootStore.levelStore.programObjectives;

        let indicatorSection = "";
        if (this.props.level.id == "new"){
            indicatorSection = <div className="form-group">
                <button
                    type="submit"
                    disabled={this.name.length == 0 || disabledTrigger}
                    className="btn btn-link btn-lg "
                    onClick={e => {this.updateSubmitType("saveAndEnableIndicators")}}>
                        { /* # Translators: This is button text that allows users to save their work and unlock the ability to add indicators */ }
                        <i className="fas fa-plus-circle"/>{interpolate(gettext("Save %s and add indicators"), [this.props.levelProps.tierName])}
                </button>
            </div>

        }
        else {
            indicatorSection = <IndicatorList
                level={this.props.level}
                tierName={this.props.levelProps.tierName}
                indicators={this.indicators}
                disabled={!this.name || this.props.level.id == "new" || this.props.rootStore.uiStore.disableCardActions}
                reorderDisabled={this.indicators.length < 2 || this.props.rootStore.uiStore.disableCardActions}
                changeFunc={this.changeIndicatorOrder}
                dragEndFunc={this.onDragEnd}/>
        }



        return (
            <div className="level-card level-card--expanded" id={`level-card-${this.props.level.id}`}>
                <div className="d-flex justify-content-between">
                    <LevelTitle
                        tierName={this.props.levelProps.tierName}
                        ontologyLabel={this.props.levelProps.ontologyLabel}
                        classes="level-title--expanded"
                    />

                    <ProgramObjectiveImport
                        isDisabled = {this.props.rootStore.uiStore.disableCardActions}
                        programObjectives={programObjectives}
                        onProgramObjectiveImport={this.onProgramObjectiveImport} />
                </div>
                <form className="level-card--expanded__form" onSubmit={this.saveLevel}>
                    <div className="form-group">
                        <TextareaAutosize
                            className="form-control"
                            id={`level-name-${this.props.level.id}`}
                            name="name"
                            value={this.name || ""}
                            disabled={this.props.rootStore.uiStore.disableCardActions}
                            autoComplete="off"
                            rows={3}
                            onChange={this.onFormChange}
                            maxLength={500}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="assumptions">{gettext('Assumptions')}</label>
                        <TextareaAutosize
                            className="form-control"
                            id="level-assumptions"
                            disabled={!this.name || this.props.rootStore.uiStore.disableCardActions}
                            name="assumptions"
                            autoComplete="off"
                            value={this.assumptions || ""}
                            rows={3}
                            onChange={this.onFormChange}/>
                    </div>
                    {indicatorSection}
                    <ButtonBar
                        level={this.props.level}
                        levelProps={this.props.levelProps}
                        submitFunc={this.updateSubmitType}
                        cancelFunc={this.cancelEdit}
                        nameVal={this.name}
                        tierCount={this.props.rootStore.levelStore.chosenTierSet.length}
                    />
                </form>
            </div>

        )
    }
}


@inject('rootStore')
class ButtonBar extends React.Component {
    render() {
        let isDisabled = !this.props.nameVal || this.props.rootStore.uiStore.disableCardActions;

        // Build the button text with the right sibling level name, then build the button.
        let addAnotherButton = null;
        if (this.props.level.parent != null && this.props.level.parent != "root") {
            {/* # Translators: On a button, with a tiered set of objects, save current object and add another one in the same tier, e.g. "Save and add another Outcome" when the user is editing an Outcome */}
            const buttonText = interpolate(gettext("Save and add another %s"), [this.props.levelProps.tierName])
            addAnotherButton = <LevelButton disabled={isDisabled} classes="btn-primary" icon='plus-circle' text={buttonText} submitType="saveAndAddSibling"  submitFunc={this.props.submitFunc} />
        }

        // Build the button text with the right child level name, then build the button.
        let addAndLinkButton = null;
        const tierCount = this.props.rootStore.levelStore.chosenTierSet.length;
        if (this.props.level.level_depth < tierCount) {
            {/* # Translators: On a button, with a tiered set of objects, save current object and add another one in the next lower tier, e.g. "Save and add another Activity" when the user is editing a Goal */}
            const buttonText = interpolate(gettext("Save and link %s"), [this.props.levelProps.childTierName])
            addAndLinkButton = <LevelButton disabled={isDisabled} classes="btn btn-primary" icon='stream' text={buttonText} submitType="saveAndAddChild" submitFunc={this.props.submitFunc} />
        }
        return (
            <div className="button-bar btn-row">
                <LevelButton disabled={isDisabled} classes="btn-primary" text={gettext("Save and close")} icon='save' submitType="saveOnly" submitFunc={this.props.submitFunc} />
                {addAnotherButton}
                {addAndLinkButton}
                <LevelButton disabled={this.props.rootStore.uiStore.disableCardActions} classes="btn btn-reset" text={gettext("Cancel")} submitType="cancel" submitFunc={this.props.cancelFunc} />
            </div>
        )

    }
}

class LevelButton extends React.Component {

    render() {
        const buttonType = this.props.submitType == "cancel" ? "button" : "submit";
        return (
            <button
                disabled={this.props.disabled}
                type={buttonType}
                className={this.props.classes + ' level-button btn btn-sm'}
                onClick={() =>this.props.submitFunc(this.props.submitType)}>
                {this.props.text}
                {/*this.props.icon ?  <FontAwesomeIcon icon={this.props.icon} /> : ''*/}
            </button>
        )

    }
}

@inject('rootStore')
class IndicatorList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            width: 0,
        }
    }

    componentDidMount() {
        // Enable popovers after update (they break otherwise)
        $('*[data-toggle="popover"]').popover({
            html: true
        });

        $('*[data-toggle="tooltip"]').tooltip()

        this.setState({
            width: Math.floor((($(".sortable-list__item__label").width() - $(".sortable-list__item__select").width() - 50) * 0.125) * 2)
        })
    }

    componentDidUpdate() {
        $('*[data-toggle="tooltip"]').tooltip()
    }
    
    render() {

        // Create the list of indicators and the dropdowns for setting the indicator order
        let options = this.props.indicators.map( (entry, index) => {return {value: index+1, label: index+1}});

        console.log('State Width:', this.state.width);

        let indicatorMarkup = this.props.indicators.map ( (indicator) => {
            // let options = this.props.indicators.map( (entry, index) => <option value={index+1}>{index+1}</option>);
            const tipTemplate = '<div class="tooltip sortable-list__item__tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>';
            const indicator_label =
                <span data-toggle="tooltip" data-delay={900} data-template={tipTemplate} title={indicator.name}>
                    {/* <span className="indicator_label_truncate">{indicator.name.replace(/(.{100})..+/, "$1...")}</span> */}
                    <span className="indicator_label_truncate">{indicator.name.slice(0, this.state.width).concat("...")}</span>
                </span>
            return (
                <React.Fragment>
                    <SingleReactSelect
                        update={(value) => this.props.changeFunc(indicator.id, value)}
                        selectId={"ind"+indicator.id}
                        labelClasses=" "
                        formRowClasses="sortable-list__item__label"
                        selectClasses="sortable-list__item__select"
                        value={{value: indicator.level_order, label: indicator.level_order + 1}}
                        label={indicator_label}
                        options={options}
                        disabled={this.props.disabled || this.props.reorderDisabled}
                    />
                    <div className="sortable-list__item__actions">
                        { /* # Translators: A label for a button that allows the user to modify the settings of an object */}
                        <UpdateIndicatorButton
                            readonly={this.props.disabled || this.props.rootStore.uiStore.disableCardActions}
                            label={gettext("Settings")}
                            indicatorId={indicator.id}/>
                    </div>
                </React.Fragment>
            )
        });

        // Conditionally set the other elements that are only visible when there are indicators
        let order = null;
        let helpLink = null;
        const migratedProgramPopOverContent =
            /* # Translators: Popover for help link telling users how to associate an Indicator not yet linked to a Level */
            gettext('To link an already saved indicator to your results framework: Open the indicator from the program page and use the “Result level” menu on the Summary tab.');
        /* # Translators: Popover for help link, tell user how to disassociate an Indicator from the Level they are currently editing. */
        const popOverContent=gettext('To remove an indicator: Click “Settings”, where you can reassign the indicator to a different level or delete it.');

        const usingResultsFramework = this.props.rootStore.levelStore.usingResultsFramework;
        const popOverStr = !usingResultsFramework ? migratedProgramPopOverContent + '<br><br>' + popOverContent : popOverContent;

        if (this.props.indicators.length > 0 || !usingResultsFramework) {
            order = "Order";
            helpLink =
                <HelpPopover
                    content={popOverStr}
                    placement="bottom"/>
        }
        return(
            <div className={`level-card--indicator-links${this.props.disabled ? " disabled" : ""}`}>
                <div className="indicator-links__header">
                    { /* # Translators: Title for a section that lists the Indicators associated with whatever this.props.tiername is. */}
                    <h4>{interpolate(gettext("Indicators linked to this %s"), [this.props.tierName])}</h4>
                    <div>{helpLink}</div>
                </div>
                <div className="sortable-list-group">
                    { this.props.indicators.length > 0 ?
                        <div className="sortable-list-header">
                            { /* TODO: this header is super janky. See _sortable-list.scss for future proofing with css subgrid */ }
                            <div className="sortable-list-header__drag-handle"><FontAwesomeIcon icon={faArrowsAlt} /></div>
                            <div className="sortable-list-header__label">
                                {order}
                            </div>
                            <div className="sortable-list-header__actions">
                                <i className="fas fa-cog"></i> { gettext("Settings") }
                            </div>
                        </div>
                    :
                        null
                    }
                    <SortableContainer onSortEnd={this.props.dragEndFunc} useDragHandle lockAxis="y" lockToContainerEdges>
                        {indicatorMarkup.map((value, index) => (
                            <SortableItem
                                key={`item-${index}`}
                                index={index}
                                value={value}
                                disabled={this.props.disabled || this.props.reorderDisabled} />
                        ))}
                    </SortableContainer>
                    <div className="sortable-list-actions">
                        <AddIndicatorButton
                            readonly={ !this.props.level.id || this.props.level.id == 'new' || this.props.disabled || this.props.rootStore.uiStore.disableCardActions }
                            programId={ this.props.rootStore.levelStore.program_id }
                            levelId={ this.props.level.id }/>
                    </div>
                </div>
            </div>
        )
    }
}

const SortableItem = sortableElement(({value}) => <li className="sortable-list__item"><DragHandle/>{value}</li>);

const SortableContainer = sortableContainer(({children}) => {
    return <ul className="sortable-list">{children}</ul>;
});

const DragHandle = sortableHandle(() => <div className="sortable-list__item__drag-handle"><FontAwesomeIcon icon={faArrowsAlt} /></div>);
