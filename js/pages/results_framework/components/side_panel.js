import React from 'react';
import {LevelTierPicker} from './leveltier_picker';
import MiniRFDiagram, { useCenteredTree } from './mini_diagram';


export default (props) => {
    const [width, containerRef] = useCenteredTree();
    return (
        <div className="rf-builder-side-panel" ref={ containerRef }>
            <LevelTierPicker />
            <MiniRFDiagram width={ width } />
        </div>
    )
}
