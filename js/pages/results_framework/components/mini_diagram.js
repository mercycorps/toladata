import React from 'react';
import { observer, inject } from "mobx-react";
import Tree from 'react-d3-tree';
import { useCenteredTree } from './tree_components';

const NODE_FILL = "#f5f5f5";
const SELECTED_FILL = "#ffd100";



const getRenderRectSvgNode = (onClickCallback) => {
    const getCallback = (id) => () => {onClickCallback(id);}

    // Here we're using `renderCustomNodeElement` to represent each node
    // as an SVG `rect` instead of the default `circle`.
    return ({ nodeDatum }) => (
       <g>
        <g>
          <rect width="40" height="30" x="-20" fill={nodeDatum.attributes?.selected ? SELECTED_FILL : NODE_FILL } onClick={ getCallback(nodeDatum.attributes.id) } />
          <text fill="black" strokeWidth="1" dominantBaseline="middle" textAnchor="middle" x="0" y="15" fontSize="0.7rem" onClick={ getCallback(nodeDatum.attributes.id) }>
            {nodeDatum.name}
          </text>
        </g>
      </g>
    );
}

const TreeWrapper = ({treeData, editLevelCallback, ...props}) => {
    const [translate, containerRef] = useCenteredTree();

    return (
        <div className="mini-rf-diagram" id="treeWrapper" style={{ width: '20rem', height: '40rem' }} ref={containerRef}>
            <Tree
                data={treeData}
                translate={translate}
                renderCustomNodeElement={ getRenderRectSvgNode(editLevelCallback) }
                collapsible={ false }
                zoomable={false}
                orientation="vertical"
                pathFunc="step"
                nodeSize={{x: 45, y: 70}}

            />
        </div>
    );
}

export default inject("rootStore")(observer(({rootStore, ...props}) => {
    const editLevel = (levelId) => rootStore.uiStore.editCard(levelId);
    return <TreeWrapper treeData={rootStore.levelStore.levelTreeData} editLevelCallback={ editLevel } />
}));
