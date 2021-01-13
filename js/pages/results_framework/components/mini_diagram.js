import React from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Generates a rectangle with given width, height, and label,
 * includes styling:
 * - active (default) is fill #FFF and stroke #000
 * - selected (props.selected: true) is fill #FFD100 and stroke #000
 * - inactive (props.inactive: true) is fill #FFF and stroke #DADADA
 * - inactive with children (props.inactive: true and props.inactiveWithChildren: true) is fill #FFF and stroke #DADADA
 *     with a descendent line containing arrowhead
 */
const TreeNode = ({className, width, height, ...props}) => {
    return (
            <g className={className} transform={`translate(${props.translate}, 0)`}>
                <rect width={width} height={height} x={-Math.floor(width/2)} y={0}/>;
                {props.label && <text dy={Math.floor(height/2) + 5}>{props.label}</text>}
                {props.inactive && props.inactiveWithChildren &&
                <line x1="0" x2="0" y1={height} y2={Math.floor(height*5/4)} markerEnd="url(#arrowhead)" />
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
        fill: ${props => props.selected ? '#FFD100' : '#FFF'};
        stroke: ${props => props.inactive ? '#DADADA' : '#000'};
        stroke-width: 2;
    }
    text {
        stroke: ${props => props.inactive ? '#DADADA' : '#000'};
        stroke-width: 1;
    }
`;


const TreeTier = ({className, nodeHeight, nodeWidth, containerWidth, tierDepth, node, prevNode, nextNode, ...props}) => {
    return (
        <g className={className} transform={`translate(${Math.floor(containerWidth/2)}, ${Math.floor((2.5 * tierDepth - 2) * nodeHeight)})`}>
            {// if previous node, add a previous node, inactive, with children and label defined by props:
                prevNode &&
                <StyledTreeNode width={nodeWidth} height={nodeHeight} label={prevNode?.label}
                                inactive={true} inactiveWithChildren={prevNode?.children}
                                translate={-Math.floor(1.5 * nodeWidth) }/>
            }
            {// if previous node, add a horizontal line connecting them:
                prevNode &&
                <line className="path__inactive" x1="0" x2={-Math.floor((prevNode?.more ? 2.5 : 1.5) * nodeWidth)}
                      y1={-Math.floor(.25 * nodeHeight)} y2={-Math.floor(.25 * nodeHeight)}
                      markerEnd={prevNode?.more && "url(#arrowhead)"} />
            }
            {// if previous node, add a vertical line connecting them:
                prevNode &&
                <line className="path__inactive" x1={-Math.floor(1.5 * nodeWidth)}
                      x2={-Math.floor(1.5 * nodeWidth)}
                      y1={-Math.floor(.25 * nodeHeight)} y2="0" />
            }
            {// if next node, add a horiztonal line connecting them:
                nextNode &&
                <line className="path__inactive" x1="0" x2={Math.floor((nextNode?.more ? 2.5 : 1.5) * nodeWidth)}
                        y1={-Math.floor(.25 * nodeHeight)} y2={-Math.floor(.25 * nodeHeight)}
                        markerEnd={nextNode?.more && "url(#arrowhead)"} />
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
                                translate={Math.floor(1.5 * nodeWidth) } />
            }
            {// if not top tier, add a line connecting this node to the parent node:
                tierDepth > 1 &&
                <line className="path__active" x1="0" x2="0" y1={ -Math.floor(1.5 * nodeHeight) } y2="0" />
            }
            <StyledTreeNode width={nodeWidth} height={nodeHeight} selected={node.selected} label={node?.label}/>
        </g>
    );
}

TreeTier.defaultProps = {
    nodeHeight: 40,
    nodeWidth: 40,
    containerWidth: 320,
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
    containerWidth: PropTypes.number,
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
        stroke: #DADADA;
    }
`;
