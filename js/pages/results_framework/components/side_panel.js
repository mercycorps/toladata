import React from 'react';
import {LevelTierPicker} from './leveltier_picker';
import MiniRFDiagram from './mini_diagram';


export default (props) => {
    return (
        <div className="rf-builder-side-panel">
            <LevelTierPicker />
            <MiniRFDiagram />
        </div>
    )
}
