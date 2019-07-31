import React from 'react';
import { observer, inject } from "mobx-react";
import { toJS } from "mobx";

import Select from 'react-select';
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
        let apply_button = null
        if (this.props.rootStore.levelStore.levels.length == 0) {
            apply_button =
                <button
                    className="leveltier-button btn btn-primary btn-block"
                    onClick={this.props.rootStore.levelStore.createFirstLevel}>
                    {/* #Translators: this refers to an imperative verb on a button ("Apply filters")*/}
                    {gettext("Apply")}
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
                {
                    apply_button ?
                        <div className="leveltier-list__actions">
                            {apply_button}
                        </div>
                    : null
                }
            </React.Fragment>
        )
    }
}

class EditableLevelTier extends React.Component {

    render() {
        const divStyle = {
            display: 'flex',
            justifyContent: 'space-between'
        };
        const labelStyle = {
            flexGrow: "3",
            paddingLeft: "29px"
        };
        let deleteButton = null;
        if (this.props.tierOrder == 0){
            deleteButton = <DeleteButton action={function(){console.log('exectured')}}/>
        }

        return (
            <div style={divStyle} >
                <input
                    type="text"
                    data-tierorder={this.props.tierOrder}
                    value={this.props.tierName}
                    onChange={this.props.updateAction} />
                {deleteButton}
            </div>
    )}
}

@inject('rootStore')
@observer
export class EditableLevelTierList extends React.Component{

    render() {

        const savedTiers  = this.props.rootStore.levelStore.chosenTierSet.map((tier, index) => {
            return <EditableLevelTier
                key={index}
                tierName={tier}
                tierOrder={index}
                updateAction={this.props.rootStore.levelStore.updateCustomTier}/>
        }) || null;

        // const newTier = savedTiers.length > 5 ? null :
        //     <EditableLevelTier
        //         key={savedTiers.length}
        //         tierName={''}
        //         tierOrder={savedTiers.length}
        //         updateAction={this.props.rootStore.levelStore.updateCustomTier}/>;

        let apply_button = null;
        if (this.props.rootStore.levelStore.levels.length == 0) {
            apply_button =
                <button
                    className="leveltier-button btn btn-primary btn-block"
                    onClick={this.props.rootStore.levelStore.createFirstLevel}>
                    {/* #Translators: this refers to an imperative verb on a button ("Apply filters")*/}
                    {gettext("Apply")}
                </button>
        }

        return (
            <form>
                <div id="leveltier-list" className="leveltier-list">
                    {savedTiers}
                    {/*{newTier}*/}
                </div>
                {
                    apply_button ?
                        <div className="leveltier-list__actions">
                            {apply_button}
                        </div>
                    : null
                }
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
