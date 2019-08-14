import React from 'react';
import { observer, inject } from "mobx-react";
import { toJS } from "mobx";

import Select from 'react-select';
import HelpPopover from "../../../components/helpPopover";
import { EditableLevelTierList, StaticLevelTierList } from './level_tier_lists'

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

        const { custom, ...templateVals } = tierTemplates;
        let options = Object.keys(templateVals).sort().map(key => {
            return {value:key, label:tierTemplates[key]['name']};
        });

        options.push({
            label: "-----------------------------------------------------------",
            options: [{
                value: this.props.rootStore.levelStore.customTierSetKey,
                label: custom['name']
            }]
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
                        isSearchable={false}
                        onChange={this.handleChange}
                    />
                </div>
            </div>
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
    if (this.props.rootStore.levelStore.chosenTierSetKey == this.props.rootStore.levelStore.customTierSetKey &&
        this.props.rootStore.levelStore.useStaticTierList === false){
        tierListType = <EditableLevelTierList />;
    }

    return (
        <div id="leveltier-picker" className="leveltier-picker">
            <div className="leveltier-picker__panel">
                <Picker />
                {tierListType}
            </div>

            <ChangeLogLink programId={props.rootStore.levelStore.program_id} />
        </div>
    )
}));
