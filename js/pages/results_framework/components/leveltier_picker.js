import React from 'react';
import { observer, inject } from "mobx-react";
import { toJS } from "mobx";

import Select from 'react-select';
import HelpPopover from "../../../components/helpPopover";

@inject('rootStore')
@observer
class Picker extends React.Component {
    handleChange = selectedTemplate => {
        this.props.rootStore.levelStore.changeTierSet(selectedTemplate.value);
    };

    componentDidUpdate() {
        // Enable popovers after update (they break otherwise)
        $('*[data-toggle="popover"]').popover({
            html: true
        });
    }

    render() {
        let helpIcon = null;
        if (this.props.rootStore.uiStore.tierLockStatus == "locked"){

            helpIcon = <HelpPopover
                key={1}
                content={gettext('<span class="text-danger"><strong>The results framework template cannot be changed after levels are saved.</strong></span> To change templates, all saved levels first must be deleted.  A level can be deleted when it has no sub-levels and no linked indicators.')}
            />

        }
        else if (this.props.rootStore.uiStore.tierLockStatus == "primed"){

            helpIcon = <HelpPopover
                key={2}
                content={gettext('<span class="text-danger"><strong>Choose your results framework template carefully!</strong></span> Once you begin building your framework, it will not be possible to change templates without first deleting all saved levels.')}
            />
        }

        const tierTemplates = this.props.rootStore.levelStore.tierTemplates;

        const options = Object.keys(tierTemplates).sort().map(key => {
            return {value:key, label:tierTemplates[key]['name']};
        });

        const selectedOption = {value:this.props.rootStore.levelStore.chosenTierSetKey, label: this.props.rootStore.levelStore.chosenTierSetName};

        let classes = "leveltier-picker__selectbox ";
        classes += this.props.rootStore.uiStore.tierLockStatus == "locked" ? "leveltier-picker__selectbox--disabled" : "";

        return (
              <div className={classes}>
                  <div className="form-group">
                    <label>{gettext('Results framework template')}</label>&nbsp;<small>{helpIcon}</small>
                    <Select
                        options={options}
                        value={selectedOption}
                        isDisabled={this.props.rootStore.uiStore.tierLockStatus == "locked" ? true : false}
                        onChange={this.handleChange}
                    />
                </div>
            </div>
        )
    }
}

class LevelTier extends React.Component {

    render() {
        return (
            <div className={'leveltier leveltier--level-' + this.props.tierLevel}>{this.props.tierName} </div>
    )}
}

@inject('rootStore')
@observer
class LevelTierList extends React.Component{

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
                                return <LevelTier key={index} tierLevel={index} tierName={tier}/>
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

const ChangeLogLink = ({programId}) => {
    const url = `/tola_management/audit_log/${programId}/`;

    return <div className="leveltier-picker__change-log-link-box">
        <a href={url} className="btn-link">
            <i className="fas fa-history" /> {gettext('Change log')}
        </a>
    </div>
}

export const LevelTierPicker = inject("rootStore")(observer(function (props) {

    return (
        <div id="leveltier-picker" className="leveltier-picker">
            <div className="leveltier-picker__panel">
                <Picker />
                <LevelTierList />
            </div>

            <ChangeLogLink programId={props.rootStore.levelStore.program_id} />
        </div>
        /*<div id="alerts2" style={{minHeight:"50px", minWidth:"50px", backgroundColor:"red"}}></div>*/

    )
}));
