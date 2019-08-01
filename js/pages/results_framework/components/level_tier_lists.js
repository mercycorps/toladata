import React from 'react';
import { observer, inject } from "mobx-react";
import { toJS } from "mobx";

import Select from 'react-select';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

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
        if (this.props.rootStore.levelStore.levels.length == 0) {
            apply_button =
                <div className="leveltier-list__actions">
                    <button
                        className="leveltier-button btn btn-primary btn-block"
                        onClick={this.props.rootStore.levelStore.createFirstLevel}>
                        {/* #Translators: this refers to an imperative verb on a button ("Apply filters")*/}
                        {gettext("Apply")}
                    </button>
                </div>
        }

        let settings_button = null;
        if (this.props.rootStore.levelStore.chosenTierSetKey == this.props.rootStore.levelStore.customTierSetKey &&
            this.props.rootStore.levelStore.useStaticTierList) {
            const style = {backgroundColor: "white", width: "100%", alignItems: "flex-end", textAlign: "right"}
            settings_button =
                <button
                        style={style}
                        className="btn btn-link"
                        onClick={this.props.rootStore.levelStore.editTierSet}>
                        {/* #Translators: this refers to an imperative verb on a button ("Apply filters")*/}
                        <i className="fa fa-cog" />
                    {gettext("Settings")}
                </button>

        }
        console.log('after settings use static', settings_button)


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

class EditableLevelTier extends React.Component {

    render() {
        const divStyle = {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: ".75rem"
        };
        const labelStyle = {
            marginBottom: ".25rem"
        };

        let deleteButton = null;
        if (this.props.showDeleteButton){
            deleteButton =
                <DeleteButton
                    buttonClasses='p-0'
                    type="button"
                    action={this.props.deleteFunc}/>
        }

        let lockIcon = null;
        if (this.props.showLockIcon){
            lockIcon = <button type="button" className='btn btn-small p-0'><i className='fa fa-lock' /></button>
        }

        return (
            <React.Fragment>
                <div>
                    <label style={labelStyle}>
                        Level {this.props.tierOrder + 1}
                    </label>
                </div>
                <div style={divStyle}>
                    <input
                        style={{width: "85%"}}
                        type="text"
                        maxLength={75}
                        data-tierorder={this.props.tierOrder}
                        value={this.props.tierName}
                        onChange={this.props.updateAction} />
                    {deleteButton}
                    {lockIcon}
                </div>
            </React.Fragment>
    )}
}

@inject('rootStore')
@observer
export class EditableLevelTierList extends React.Component{

    render() {

        const savedTiers  = this.props.rootStore.levelStore.chosenTierSet.map((tier, index) => {
            const showLockIcon = !this.props.rootStore.levelStore.tierIsDeletable(index+1)
            const showDeleteButton =
                index === this.props.rootStore.levelStore.chosenTierSet.length - 1 &&
                !showLockIcon;
            return <EditableLevelTier
                key={index}
                tierName={tier}
                showDeleteButton={showDeleteButton}
                showLockIcon={showLockIcon}
                deleteFunc={this.props.rootStore.levelStore.deleteCustomTier}
                tierOrder={index}
                updateAction={this.props.rootStore.levelStore.updateCustomTier}/>
        }) || null;

        let isAddTierButtonDisabled =
            this.props.rootStore.levelStore.chosenTierSet.slice(-1)[0].length === 0 ||
            !this.props.rootStore.levelStore.templateIsSavable;
        const addTierButton = savedTiers.length > 5 ? null :
            <button
                type="button"
                className="btn btn-link btn-add"
                disabled={isAddTierButtonDisabled}
                onClick={this.props.rootStore.levelStore.addCustomTier}>
                <i className="fa fa-plus-circle" />Add level
            </button>;



        const apply_button =
            <div className="leveltier-list__actions">
                <button
                    className="leveltier-button btn btn-primary btn-block"
                    disabled={!this.props.rootStore.levelStore.templateIsSavable}
                    onClick={this.props.rootStore.levelStore.applyTierSet}>
                    {/* #Translators: this refers to an imperative verb on a button ("Apply filters")*/}
                    {gettext("Apply")}
                </button>
            </div>


        return (
            <form>
                <div id="leveltier-list" className="leveltier-list">
                    {savedTiers}
                    {addTierButton}
                    {/*{newTier}*/}
                </div>
                {apply_button}

            </form>
        )
    }
}

const ChangeLogLink = ({programId}) => {
    const url = `/tola_management/audit_log/${programId}/`;

    return <div className="leveltier-picker__change-log-link-box">
        <a href={url} className="btn-link">
            <i className="fas fa-history" /> {gettext('Change log')}
        </a>
    </div>
}

export const LevelTierPicker = inject("rootStore")(observer(function (props) {
    let tierListType = <StaticLevelTierList />;
    if (this.props.rootStore.levelStore.chosenTierSetKey == this.props.rootStore.levelStore.customTierSetKey){
        tierListType = <EditableLevelTierList />;
    }

    return (
        <div id="leveltier-picker" className="leveltier-picker">
            <div className="leveltier-picker__panel">
                <Picker />
                <StaticLevelTierList />
            </div>

            <ChangeLogLink programId={props.rootStore.levelStore.program_id} />
        </div>
        /*<div id="alerts2" style={{minHeight:"50px", minWidth:"50px", backgroundColor:"red"}}></div>*/

    )
}));
