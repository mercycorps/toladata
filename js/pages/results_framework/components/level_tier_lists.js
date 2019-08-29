import React from 'react';
import { observer, inject } from "mobx-react";
import { toJS } from "mobx";

import { DeleteButton } from "../../../components/actionButtons";



class StaticLevelTier extends React.Component {

    render() {
        return (
            <div className={'leveltier leveltier--level-' + this.props.tierLevel}>{this.props.tierName} </div>
    )}
}

@inject('rootStore')
@observer
export class StaticLevelTierList extends React.Component{

    render() {
        let apply_button = null;
        // Only show the Apply button if you haven't saved a level yet.
        if (this.props.rootStore.levelStore.levels.length === 0) {
            apply_button =
                <div className="leveltier-list__actions">
                    <button
                        className="leveltier-button btn btn-primary btn-block"
                        onClick={this.props.rootStore.levelStore.applyTierSet}>
                        {/* #Translators: this refers to an imperative verb on a button ("Apply filters")*/}
                        {gettext("Apply")}
                    </button>
                </div>
        }

        let settings_button = null;
        // Only show the settings button if you've selected to customize the tiers and you are not actively editing the tiers.
        if (this.props.rootStore.levelStore.chosenTierSetKey == this.props.rootStore.levelStore.customTierSetKey &&
            this.props.rootStore.levelStore.useStaticTierList) {
            settings_button =
                <button
                        className="btn btn-link leveltier-list leveltier--editable__settings"
                        onClick={this.props.rootStore.levelStore.editTierSet}>
                    <i className="fa fa-cog" />
                    {gettext("Settings")}
                </button>

        }

        return (
            <React.Fragment>
                <div id="leveltier-list" className="leveltier-list">
                    {
                        this.props.rootStore.levelStore.chosenTierSet.length > 0 ?
                            this.props.rootStore.levelStore.chosenTierSet.map((tier, index) => {
                                return <StaticLevelTier key={index} tierLevel={index} tierName={tier}/>
                            })
                            : null
                    }

                </div>
                {settings_button}
                {apply_button}
            </React.Fragment>
        )
    }
}

@inject('rootStore')
class EditableLevelTier extends React.Component {

    onBlur = (event) => {
        /*
        When the onBlur event is triggered, if the user has fixed errors in the level tiers, React/MobX will redraw the elements
        on the page.  When that onBlur event happens to be a button click (e.g. the Apply button), the onDraw redraw prevents the button's
        onClick from firing.  This code is required to make sure buttons don't need to be clicked twice.
        If the user is deleting a level, that should be called before the validation is called.
         */
        if (event.relatedTarget && event.relatedTarget.classList.contains("deletebtn")) {
            this.props.rootStore.levelStore.deleteCustomTier(event);
        }
        else {
            this.props.rootStore.uiStore.validateCustomTiers();
            if (event.relatedTarget && event.relatedTarget.id == "applyButton") {
                this.props.rootStore.levelStore.applyTierSet();
            }
            if (event.relatedTarget && event.relatedTarget.id == "addLevelButton") {
                this.props.rootStore.levelStore.addCustomTier();
            }
        }
    };

    render() {
        let deleteButton = null;
        if (this.props.showDeleteButton){
            deleteButton =
                <DeleteButton
                    buttonClasses='p-0'
                    type="button"
                    disabled={this.props.rootStore.uiStore.customFormErrors.hasErrors}
                    action={this.props.rootStore.levelStore.deleteCustomTier}/>
        }

        let lockButton = null;
        if (this.props.showLockButton){
            lockButton =
                <a
                    tabIndex="0"
                    className="btn btn-sm btn-link"
                    data-toggle="popover"
                    data-trigger="focus"
                    data-placement="bottom"
                    /* # Translators: This is the help text of an icon that indicates that this element can't be deleted */
                    data-content={gettext("This level is being used in the results framework")}
                >
                    <i className='fa fa-lock text-muted' />
                </a>
        }

        return (
            <React.Fragment>
                <div className="form-group">
                    <label className="leveltier--editable__label">
                        {
                            /* # Translators: This is one of several user modifiable fields, e.g. "Level 1", "Level 2", etc... Level 1 is the top of the hierarch, Level six is the bottom.*/
                             interpolate(gettext("Level %s"), [this.props.tierOrder + 1])
                        }
                    </label>
                    <div className="leveltier--editable">
                        <input
                            className="leveltier--editable__input form-control"
                            type="text"
                            maxLength={75}
                            data-tierorder={this.props.tierOrder}
                            value={this.props.tierName}
                            onChange={this.props.rootStore.levelStore.updateCustomTier}
                            onBlur={this.onBlur} />
                        {deleteButton}
                        {lockButton}
                    </div>
                    <span className='has-error'>{this.props.errorMsg}</span>
                </div>
            </React.Fragment>
    )}
}


@inject('rootStore')
@observer
export class EditableLevelTierList extends React.Component{

    componentDidMount() {
        // Enable popovers after update (they break otherwise)
        $('*[data-toggle="popover"]').popover({
            html: true
        });
        $(".leveltier--editable__input:last-of-type").focus()
    }

    // Need this just to ensure that the implicit submit that takes place for single input forms is blocked
    customTemplateFormSubmit = (event) => event.preventDefault();

    render() {
        const customKey = this.props.rootStore.levelStore.customTierSetKey;

        // Loop through each custom tier and build the input field, error message, and delete/lock icon
        const savedTiers  = this.props.rootStore.levelStore.chosenTierSet.map((tier, index) => {
            const errorObj = this.props.rootStore.uiStore.customFormErrors.errors.length > index ?
                this.props.rootStore.uiStore.customFormErrors.errors[index] : null;
            const errorMsg = errorObj && errorObj.hasError ? errorObj.msg : null;
            const showLockButton = !this.props.rootStore.levelStore.tierIsDeletable(index+1);
            const showDeleteButton =
                index === this.props.rootStore.levelStore.chosenTierSet.length - 1 &&
                !showLockButton &&
                !(this.props.rootStore.levelStore.chosenTierSet.length === 1 && tier.length === 0);
            return <EditableLevelTier
                key={index}
                tierName={tier}
                showDeleteButton={showDeleteButton}
                showLockButton={showLockButton}
                tierOrder={index}
                errorMsg={errorMsg} />
        }) || null;

        // At the bottom of the tier list, show the add level and apply buttons, if appropriate
        let isAddTierButtonDisabled =
            !this.props.rootStore.levelStore.tierTemplates[customKey]['tiers'].every( tierName => tierName.length > 0) ||
            this.props.rootStore.uiStore.addLevelButtonIsLocked;
        const addTierButton = savedTiers.length > 5 ? null :
            <button
                id="addLevelButton"
                type="button"
                className="btn btn-link btn-add"
                disabled={isAddTierButtonDisabled}
                onClick={this.props.rootStore.levelStore.addCustomTier}>
                <i className="fa fa-plus-circle" />Add level
            </button>;

        const apply_button =
            <div className="leveltier-list__actions">
                <button
                    id="applyButton"
                    className="leveltier-button btn btn-primary btn-block"
                    disabled={isAddTierButtonDisabled}
                    type="button"
                    onClick={this.props.rootStore.levelStore.applyTierSet}>
                    {/* #Translators: this refers to an imperative verb on a button ("Apply filters")*/}
                    {gettext("Apply")}
                </button>
            </div>;

        return (
            <form onSubmit={this.customTemplateFormSubmit}>
                <div id="leveltier-list" className="leveltier-list">
                    <div className="">
                        {savedTiers}
                    </div>
                    {addTierButton}
                </div>
                {apply_button}

            </form>
        )
    }
}
