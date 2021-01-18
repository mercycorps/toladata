import React from 'react';
import { useCallback, useState } from "react";
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const INACTIVE_GRAY = '#71757b';

/**
 * Generates a rectangle with given width, height, and label,
 * includes styling:
 * - active (default) is fill #FFF and stroke #000
 * - selected (props.selected: true) is fill #FFD100 and stroke #000
 * - inactive (props.inactive: true) is fill #FFF and stroke #DADADA
 * - inactive with children (props.inactive: true and props.inactiveWithChildren: true) is fill #FFF and stroke #DADADA
 *     with a descendent line containing arrowhead
 */
const TreeNode = ({className, width, height, clickHandler, ...props}) => {
    return (
            <g className={className} transform={`translate(${props.translate}, 0)`}>
                <rect width={width} height={height} x={-Math.floor(width/2)} y={0} onClick={ clickHandler }/>
                {props.label && <text dy={Math.floor(height/2) + 5} onClick={ clickHandler }>{props.label}</text>}
                {props.inactive && props.inactiveWithChildren &&
                <line stroke={ INACTIVE_GRAY } opacity="0.5" x1="0" x2="0" y1={height} y2={Math.floor(height*5/4)} markerEnd="url(#arrowhead)" />
                }
            </g>
           );
}

TreeNode.defaultProps = {
    width: 40,
    height: 40,
    label: false,
    inactive: false,
    inactiveWithChildren: false,
    translate: 0
};

TreeNode.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    inactive: PropTypes.bool,
    inactiveWithChildren: PropTypes.bool,
    translate: PropTypes.number
}

export const StyledTreeNode = styled(TreeNode)`
    rect {
        fill: ${props => props.selected ? '#CCEFEE' : '#FFF'};
        stroke: ${props => props.inactive ? INACTIVE_GRAY : '#000'};
        opacity: ${props => props.inactive ? '0.5' : '1'};
        stroke-width: 2;
        cursor: ${props => props.selected ? 'default' : 'pointer'};
    }
    text {
        stroke: ${props => props.inactive ? INACTIVE_GRAY : '#000'};
        opacity: ${props => props.inactive ? '0.5' : '1'};
        stroke-width: 1;
        font-size: 14px;
        font-family: Arial;
        font-weight: 400;
        text-anchor: middle;
        cursor: ${props => props.selected ? 'default' : 'pointer'};
`;


const TreeTier = ({className, nodeHeight, nodeWidth, tierDepth, node, prevNode, nextNode, ...props}) => {
    return (
        <g className={className} transform={`translate(0, ${Math.floor((2.5 * tierDepth - 2) * nodeHeight)})`}>
            {// if previous node, add a horizontal line connecting them:
                prevNode &&
                <line className="path__inactive" x1="0" x2={-Math.floor((prevNode?.more ? 2.5 : 1.5) * nodeWidth)}
                      y1={-Math.floor(.25 * nodeHeight)} y2={-Math.floor(.25 * nodeHeight)}
                      markerEnd={prevNode?.more ? "url(#arrowhead)" : undefined} />
            }
            {// if previous node, add a vertical line connecting them:
                prevNode &&
                <line className="path__inactive" x1={-Math.floor(1.5 * nodeWidth)}
                      x2={-Math.floor(1.5 * nodeWidth)}
                      y1={-Math.floor(.25 * nodeHeight)} y2="0" />
            }
            {// if previous node, add a previous node, inactive, with children and label defined by props:
                prevNode &&
                <StyledTreeNode width={nodeWidth} height={nodeHeight} label={prevNode?.label}
                                inactive={true} inactiveWithChildren={prevNode?.children}
                                translate={-Math.floor(1.5 * nodeWidth) }
                                clickHandler={ prevNode.onclick } />
            }
            {// if next node, add a horiztonal line connecting them:
                nextNode &&
                <line className="path__inactive" x1="0" x2={Math.floor((nextNode?.more ? 2.5 : 1.5) * nodeWidth)}
                        y1={-Math.floor(.25 * nodeHeight)} y2={-Math.floor(.25 * nodeHeight)}
                        markerEnd={nextNode?.more ? "url(#arrowhead)" : undefined} />
            }
            {// if next node, add a veritcal line connecting them:
                nextNode &&
                <line className="path__inactive" x1={Math.floor(1.5 * nodeWidth)} x2={Math.floor(1.5 * nodeWidth)}
                        y1={-Math.floor(.25 * nodeHeight)} y2="0" />
            }
            {// if next node, add the next node, inactive, with children and label defined by props:
                nextNode &&
                <StyledTreeNode width={nodeWidth} height={nodeHeight} label={nextNode?.label}
                                inactive={true} inactiveWithChildren={nextNode?.children}
                                translate={Math.floor(1.5 * nodeWidth) }
                                clickHandler={ nextNode.onclick }/>
            }
            {// if not top tier, add a line connecting this node to the parent node:
                tierDepth > 1 &&
                <line className="path__active" x1="0" x2="0" y1={ -Math.floor(1.5 * nodeHeight) } y2="0" />
            }
            <StyledTreeNode width={nodeWidth} height={nodeHeight} selected={node.selected} label={node?.label}
                            clickHandler={ node.onclick } />
        </g>
    );
}

TreeTier.defaultProps = {
    nodeHeight: 40,
    nodeWidth: 40,
    tierDepth: 1,
    node: {
        selected: false,
        label: false
    },
    prevNode: false,
    nextNode: false
}

TreeTier.propTypes = {
    nodeHeight: PropTypes.number,
    nodeWidth: PropTypes.number,
    tierDepth: PropTypes.number,
    node: PropTypes.shape({
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        selected: PropTypes.bool
    }),
    prevNode: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.shape({
            label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
            more: PropTypes.bool,
            children: PropTypes.bool
        })
    ]),
    nextNode: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.shape({
            label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
            more: PropTypes.bool,
            children: PropTypes.bool
        })
    ]),
}

export const StyledTreeTier = styled(TreeTier)`
    line {
        fill: #FFF;
        stroke-width: 2;
    }
    line.path__active {
        stroke: #000;
    }
    line.path__inactive {
        stroke: ${INACTIVE_GRAY};
        opacity: 0.5;
    }
`;

const TierLabel = ({className, tier, ...props}) => {
    // Arbitrary length after which we split into two spans (this might need to be expanded upon to handle even longer
    // custom tier names, for now it's just 1 line if less than this const, 2 lines if more)
    const MAX_LENGTH = 20;
    var spans = [];
    if (tier.length <= MAX_LENGTH) {
        // single tier, as not too long:
        spans.push(tier);
    } else {
        const words = tier.split(' ');
        let firstSpan = [];
        while (firstSpan.join(' ').length < MAX_LENGTH) {
            firstSpan.push(words.shift())
        }
        const overLength = Math.abs(firstSpan.join(' ').length - Math.floor(tier.length / 2));
        const balanceWord = firstSpan.pop();
        const underLength = Math.abs(firstSpan.join(' ').length - Math.floor(tier.length / 2));
        if (overLength < underLength) {
            firstSpan.push(balanceWord);
        } else {
            words.unshift(balanceWord);
        }
        spans.push(firstSpan.join(' '));
        spans.push(words.join(' '));
    }
    return (
        <text className={ className } >
        { spans.map((span, index) =>
            <tspan key={span} x="0" dy={index * 15}>{span}</tspan>
            )
        }
        </text>
    );
};

// styling per ticket copies style of "2 indicators" label bottom right of level cards:
const StyledLabel = styled(TierLabel)`
    text-anchor: middle;
    font-family: Arial;
    font-size: 14px;
    font-weight: 400;
`;


const TierLabels = ({centerline, nodeHeight, tiers, ...props}) => {
    // helper function for getting the y translate for each tier:
    const getHeightToCenter = (depth) => {
        // tier height to top of node boxes is defined as h * (2.5 * depth - 2) + half node height to hit center
        return Math.floor((2.5 * depth + 1) * nodeHeight);
    }
    return (
        <g className="tierLabels" transform={`translate(${centerline}, 0)`}>
            {
                tiers?.length > 1 && tiers.map((tier, depth) =>
                    <g key={`${tier}_${depth}`} transform={`translate(0, ${getHeightToCenter(depth)})`}>
                        <StyledLabel tier={tier} />
                    </g>
                )
            }
        </g>
    )
}

TierLabels.defaultProps = {
    centerline: 55,
    nodeHeight: 40,
    tiers: []

};

TierLabels.propTypes = {
    centerline: PropTypes.number,
    nodeHeight: PropTypes.number,
    tiers: PropTypes.array
};

export { TierLabels };


const RFTreeDiagram = ({levelTreeData, containerWidth, maxHeight, nodeHeight, nodeWidth, clickHandlerGetter, ...props}) => {
    if (!levelTreeData || !levelTreeData?.length > 1) {
        console.log(levelTreeData);
        return <svg />;
    }
    const containerHeight = Math.floor((2 + 2.5*(levelTreeData.length - 1)) * nodeHeight);
    const tiers = levelTreeData.map(treeTierData => treeTierData.tier);
    const tierTreeProps = levelTreeData.map((treeTierData, index) => ({
        nodeHeight: nodeHeight,
        nodeWidth: nodeWidth,
        tierDepth: index + 1, // depth is 1-indexed in TreeTier
        node: {
            label: treeTierData?.label || false,
            selected: treeTierData.selected || false,
            onclick: clickHandlerGetter(treeTierData.id)
        },
        prevNode: treeTierData.prevNode ? {...treeTierData.prevNode, onclick: clickHandlerGetter(treeTierData.prevNode.id)} : false,
        nextNode: treeTierData.nextNode ? {...treeTierData.nextNode, onclick: clickHandlerGetter(treeTierData.nextNode.id)} : false
    }));
    return (
        <svg width={containerWidth} height={containerHeight}>
            <defs>
                <marker id="arrowhead" markerWidth="5" markerHeight="3" refX="2.5" refY="1.5" orient="auto">
                    <polygon points="0 0, 3.5 1.5, 0 3" stroke={ INACTIVE_GRAY } fill={ INACTIVE_GRAY }  />
                </marker>
            </defs>
            <TierLabels centerline={ Math.floor(containerWidth/6) } nodeHeight={ nodeHeight } tiers={ tiers } />
            <g className="treeNodes" transform={`translate(${2 * Math.floor(containerWidth/3)}, 0)`}>
                {tierTreeProps.map(tierProps => <StyledTreeTier key={tierProps.tierDepth} {...tierProps} />)}
            </g>
        </svg>
    );
};

RFTreeDiagram.defaultProps = {
    containerWidth: 320,
    nodeHeight: 40,
    nodeWidth: 40
};

RFTreeDiagram.propTypes = {
    containerWidth: PropTypes.number,
    nodeHeight: PropTypes.number,
    nodeWidth: PropTypes.number
};

export { RFTreeDiagram };

// returns a callback to get the bounding box of the container, returns that width for centering SVG (and getting bounding box width)
export const useCenteredTree = (defaultMeasures = { width: 300 , height: 400 }) => {
  const [width, setWidth] = useState(defaultMeasures.width);
  const containerRef = useCallback((containerElem) => {
    if (containerElem !== null) {
      const { width, height } = containerElem.getBoundingClientRect();
      setWidth(width);
    }
  }, []);
  return [width, containerRef];
};



export default inject('rootStore')(observer(({rootStore, width, height, ...props}) => {
    const getClickHandler = (id) => () => {
        rootStore.uiStore.editCard(id);
        // timeout because the scroll won't work without letting the active card set first:
        setTimeout(() => $(`#level-card-${id}`)[0].scrollIntoView({behavior: 'smooth'}), 40);
    }
    if (rootStore.levelStore.levelTreeData === false) {
        return null;
    }
    return (
        <RFTreeDiagram levelTreeData={rootStore.levelStore.levelTreeData} clickHandlerGetter={getClickHandler} containerWidth={ width } />
    );
}));

