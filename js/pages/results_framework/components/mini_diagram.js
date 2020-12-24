import React from 'react';
import { observer, inject } from "mobx-react";
import Tree from 'react-d3-tree';
import { useCenteredTree } from './tree_components';


const levelTree = {
    name: '',
    attributes: {
        tier: 'Goal'
    },
    children: [
        {
            name: '1',
            attributes: {
                tier: 'Output'
            },
            children: [
                {
                    name: "1.1",
                    attributes: {
                        tier: 'Outcome'
                    }
                },
                {
                    name: "1.2",
                    attributes: {
                        selected: true
                    }
                },
            ]
        },
        {
            name: '2',
            children: [
                {
                    name: "2.1",
                    children: [
                        {
                            name: "2.1.1",
                            attributes: {
                                tier: 'Activity'
                            }
                        }
                    ]
                }
            ]
        }
    ]
}

const NODE_FILL = "#f5f5f5";
const SELECTED_FILL = "#ffd100";

// Here we're using `renderCustomNodeElement` to represent each node
// as an SVG `rect` instead of the default `circle`.
const renderRectSvgNode = ({ nodeDatum, toggleNode }) => {
    console.log(nodeDatum);
    return (
<React.Fragment>
    {nodeDatum.attributes?.tier && (
      <text fill="black" x="-110" dy="20" strokeWidth="1">
        {nodeDatum.attributes?.tier}
      </text>
    )}
   <g>
    <g>
      <rect width="50" height="30" x="-25" fill={nodeDatum.attributes?.selected ? SELECTED_FILL : NODE_FILL } />
      <text fill="black" strokeWidth="1" dominantBaseline="middle" textAnchor="middle" x="0" y="15" fontSize="1rem">
        {nodeDatum.name}
      </text>
    </g>

  </g>
  </React.Fragment>
    );
}

const TreeWrapper = ({treeData, ...props}) => {
    const [translate, containerRef] = useCenteredTree();
    const [renderRectSvgNode, container]
    return (
        <div className="mini-rf-diagram" id="treeWrapper" style={{ width: '20rem', height: '40rem' }} ref={containerRef}>
            <Tree
                data={treeData}
                translate={translate}
                renderCustomNodeElement={ renderRectSvgNode }
                zoomable={false}
                orientation="vertical"
                pathFunc="step"
                nodeSize={{x: 60, y: 80}}

            />
        </div>
    );
}

export default inject("rootStore")(observer(({rootStore, ...props}) => {
    let newTreeData = rootStore.levelStore.levelTreeData;
    return <TreeWrapper treeData={newTreeData} />
}));
