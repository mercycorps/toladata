import React from 'react';
import { observer, inject } from "mobx-react"

import Select from 'react-select';

@inject('uiStore')
@observer
class Picker extends React.Component {
    handleChange = selectedPreset => {
        this.props.uiStore.changePreset(selectedPreset.value);
    };

    render() {
        const options = Object.keys(this.props.uiStore.tierPresets).map(val=>{
            return {value:val, label:val};
        });
        const selectedOption = {value:this.props.uiStore.selectedPreset, label: this.props.uiStore.selectedPreset};

        return <Select
            options={options}
            value={selectedOption}
            onChange={this.handleChange}
        />
    }
}

class LevelTier extends React.Component {

    render() {
        return (
            <div> {this.props.tierName} </div>
    )}
}

@inject('uiStore')
@observer
class LevelTierList extends React.Component{
    render() {
        return (
            <div id="leveltier-list">
                {this.props.uiStore.tierList.map((tier, index) => {
                    return <LevelTier key={index} tierName={tier}/>
                    }
                )}
            </div>
        )
    }
}

export const LevelTierPicker = observer(function (props) {

    return (
        <div id="leveltier-picker" style={{marginRight:"3em"}}>
            <Picker />
            <LevelTierList />
        </div>
    )
});
