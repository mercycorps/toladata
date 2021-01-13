import React from "react";
import { StyledTreeNode, StyledTreeTier } from "../../components/mini_diagram";
import renderer from 'react-test-renderer';
import { shallow, render, mount } from 'enzyme';
import 'jest-styled-components';

const ACTIVE_NODE_FILL = '#FFF';
const ACTIVE_NODE_STROKE = '#000';
const SELECTED_NODE_FILL = '#FFD100';
const INACTIVE_NODE_FILL = '#FFF';
const INACTIVE_NODE_STROKE = '#DADADA';

const ViewBox = ({children}) => (
    <svg>{children}</svg>
)

/*
 * Tests for TreeNode component, currently a square with text in it, can render in one of four states:
 *  - Active (in the selected / default chain)
 *  - Selected (active + highlighting)
 *  - Inactive (outside of the selected / default chain)
 *  - InactiveParent (outside of the selected / default chain, with visual indication of hidden child levels)
 */
describe("TreeNode", () => {
    describe("given a width and height", () => {
        test.each([
            [40, 40, -20],
            [20, 20, -10],
            [100, 50, -50]
        ])("returns a rectangle with that width and height", (w, h, exx) => {
            const props = {width: w, height: h};
            const rect = render(<ViewBox><StyledTreeNode {...props} /></ViewBox>).find('rect').first();
            expect(rect.attr('width')).toEqual(w.toString());
            expect(rect.attr('height')).toEqual(h.toString());
            expect(rect.attr('x')).toEqual(exx.toString());
            expect(rect.attr('y')).toEqual("0");
        });
    });
    describe("given a label", () => {
        test.each([
            [40, 25, "1"], [80, 45, "3"], [30, 20, "banana"]
        ])("returns a rect wtih that text centered inside it", (height, dy, label) => {
            const props = {width: 40, height: height, label: label};
            const textNode = render(<ViewBox><StyledTreeNode {...props} /></ViewBox>).find('text').first();
            expect(textNode.attr('dy')).toEqual(dy.toString());
            expect(textNode.text()).toEqual(label);
        });
    });
    describe("given no status (default active)", () => {
        const props = {width: 40, height: 40, label: "1"}
        test("returns elements with active styling", () => {
            const tree = renderer.create(<StyledTreeNode {...props} />).toJSON();
            expect(tree).toHaveStyleRule('fill', ACTIVE_NODE_FILL, {modifier: 'rect'});
            expect(tree).toHaveStyleRule('stroke', ACTIVE_NODE_STROKE, {modifier: 'rect'});
            expect(tree).toHaveStyleRule('stroke-width', "2", {modifier: 'rect'});
            expect(tree).toHaveStyleRule('stroke-width', "1", {modifier: 'text'});
            expect(tree).toHaveStyleRule('stroke', ACTIVE_NODE_STROKE, {modifier: 'text'});
        });
    });
    describe("given a selected status (+default active)", () => {
        const props = {width: 40, height: 40, label: "1", selected: true}
        test("returns elements with active styling and selected highlighting", () => {
            const tree = renderer.create(<StyledTreeNode {...props} />).toJSON();
            expect(tree).toHaveStyleRule('fill', SELECTED_NODE_FILL, {modifier: 'rect'});
            expect(tree).toHaveStyleRule('stroke', ACTIVE_NODE_STROKE, {modifier: 'rect'});
            expect(tree).toHaveStyleRule('stroke-width', "2", {modifier: 'rect'});
            expect(tree).toHaveStyleRule('stroke-width', "1", {modifier: 'text'});
            expect(tree).toHaveStyleRule('stroke', ACTIVE_NODE_STROKE, {modifier: 'text'});
        });
    });
    describe("given an inactive status", () => {
        const props = {width: 40, height: 40, label: "1", inactive: true}
        test("returns elements with inactive styling", () => {
            const tree = renderer.create(<StyledTreeNode {...props} />).toJSON();
            expect(tree).toHaveStyleRule('fill', INACTIVE_NODE_FILL, {modifier: 'rect'});
            expect(tree).toHaveStyleRule('stroke', INACTIVE_NODE_STROKE, {modifier: 'rect'});
            expect(tree).toHaveStyleRule('stroke-width', "2", {modifier: 'rect'});
            expect(tree).toHaveStyleRule('stroke-width', "1", {modifier: 'text'});
            expect(tree).toHaveStyleRule('stroke', INACTIVE_NODE_STROKE, {modifier: 'text'});
        });
    });
    describe("given an inactive status with children", () => {
        const props = {width: 40, height: 40, label: "1", inactive: true, inactiveWithChildren: true}
        test("returns elements with inactive styling and an arrowhead underneath", () => {
            const tree = renderer.create(<StyledTreeNode {...props} />).toJSON();
            expect(tree).toHaveStyleRule('fill', INACTIVE_NODE_FILL, {modifier: 'rect'});
            expect(tree).toHaveStyleRule('stroke', INACTIVE_NODE_STROKE, {modifier: 'rect'});
            expect(tree).toHaveStyleRule('stroke-width', "2", {modifier: 'rect'});
            expect(tree).toHaveStyleRule('stroke-width', "1", {modifier: 'text'});
            expect(tree).toHaveStyleRule('stroke', INACTIVE_NODE_STROKE, {modifier: 'text'});
            const descendantsNode = render(<ViewBox><StyledTreeNode {...props} /></ViewBox>).find('line').first();
            expect(descendantsNode.attr('x1')).toEqual("0");
            expect(descendantsNode.attr('x2')).toEqual("0");
            expect(descendantsNode.attr('y1')).toEqual("40");
            expect(descendantsNode.attr('y2')).toEqual("50");
            expect(descendantsNode.attr('marker-end')).toEqual("url(#arrowhead)");
        });
    });
});

/**
 * Tests for Tree Tier - each of which consists of:
 * required:
 *  - 1 active node, centered
 * optional:
 *  - 1 vertical connection to parent node
 *  - 1 text label for active node
 *  - 1 previous node, spaced 3/2*width to the left
 *  - 1 text label for previous node
 *  - 1 descendents arrow for previous node
 *  - 1 morePrevious arrow
 *  - 1 next node, spaced 3/2*width to the right
 *  - 1 text label for next node
 *  - 1 descendents arrow for next node
 *  - 1 moreNext arrow
 *  .5 3 5.5

 */
describe('TreeTier', () => {
   describe('given a top tier node', () => {
    test("returns an active centered node with no label and no other elements", () => {
        const props = {nodeHeight: 40, nodeWidth: 40, containerWidth: 320, tierDepth: 1};
        const wrapper = render(<ViewBox><StyledTreeTier {...props} /></ViewBox>);
        expect(wrapper.find('rect').length).toEqual(1);
        const rect = wrapper.find('rect').first()
        expect(rect.attr('width')).toEqual("40");
        expect(rect.attr('height')).toEqual("40");
        expect(rect.attr('x')).toEqual("-20");
        expect(wrapper.find('line').length).toEqual(0);
        expect(wrapper.find('text').length).toEqual(0);
        // should be 20 from top (.5 height) and 160 from left (centered)
        expect(wrapper.find('g').first().attr('transform')).toEqual('translate(160, 20)');
    });
    test("when node is selected, returns a selected node with no label and no other elements", () =>{
        const props = {nodeHeight: 60, nodeWidth: 30, containerWidth: 400, tierDepth: 1, node: {selected: true}};
        const wrapper = render(<ViewBox><StyledTreeTier {...props} /></ViewBox>);
        expect(wrapper.find('rect').length).toEqual(1);
        const rect = wrapper.find('rect').first()
        expect(rect.attr('width')).toEqual("30");
        expect(rect.attr('height')).toEqual("60");
        expect(rect.attr('x')).toEqual("-15");
        expect(wrapper.find('line').length).toEqual(0);
        expect(wrapper.find('text').length).toEqual(0);
        // should be 30 from top (.5 height) and 200 from left (centered)
        expect(wrapper.find('g').first().attr('transform')).toEqual('translate(200, 30)');
    });
   });
   describe("given a second tier node with a label", () => {
    test("returns an active centered node with a label and a line connecting to previous parent", () => {
        const props = {nodeHeight: 40, nodeWidth: 40, containerWidth: 320, tierDepth: 2, node: {label: "3"}};
        const wrapper = render(<ViewBox><StyledTreeTier {...props} /></ViewBox>);
        expect(wrapper.find('rect').length).toEqual(1);
        const rect = wrapper.find('rect').first();
        expect(rect.attr('width')).toEqual("40");
        expect(rect.attr('height')).toEqual("40");
        expect(rect.attr('x')).toEqual("-20");
        const nodeGroup = rect.parent();
        // node group should contain a label
        expect(nodeGroup.find('text').length).toEqual(1);
        // dy should be half height + 5
        expect(nodeGroup.find('text').attr('dy')).toEqual("25");
        expect(nodeGroup.find('text').text()).toEqual("3");
        const parentLine = wrapper.find('line').first();
        // parent line should extend vertically 60 (1.5*height)
        expect(parentLine.attr('x1')).toEqual("0");
        expect(parentLine.attr('x2')).toEqual("0");
        expect(parentLine.attr('y1')).toEqual("-60");
        expect(parentLine.attr('y2')).toEqual("0");
        // parent line should have no arrowhead
        expect(parentLine.attr('marker-end')).toBeFalsy();
        expect(parentLine.hasClass('path__active')).toBeTruthy();
        const tree = renderer.create(<StyledTreeTier {...props} />).toJSON();
        expect(tree).toHaveStyleRule('stroke', '#000', {modifier: 'line.path__active'});
    });
   });
    describe("given a second tier node with a previous node", () => {
        const defaultProps = {nodeHeight: 40, nodeWidth: 40, containerWidth: 320, tierDepth: 2, node: {label: "2"}};
        test("returns an active centered node with a label and a second node, with lines connecting them", () => {
            const props = {...defaultProps, prevNode: {label: "1"}};
            const wrapper = render(<ViewBox><StyledTreeTier {...props} /></ViewBox>);
            expect(wrapper.find('rect').length).toEqual(2);
            const prevNode = wrapper.find('rect').first().parent();
            // previous node should be moved 60 to the left (1.5 * width)
            expect(prevNode.attr('transform')).toEqual('translate(-60, 0)')
            expect(prevNode.find('text').first().text()).toEqual("1");
            const activeNode = wrapper.find('rect').eq(1).parent();
            expect(activeNode.find('text').first().text()).toEqual("2");
            // get inactive paths - connecting sibling elements
            expect(wrapper.find('line.path__inactive').length).toEqual(2);
            const horizontalLine = wrapper.find('line.path__inactive').first();
            expect(horizontalLine.attr('x1')).toEqual("0");
            // should travel 3/2 * width to center of previous node
            expect(horizontalLine.attr('x2')).toEqual("-60");
            // should be 1/4 * height over top of tier nodes:
            expect(horizontalLine.attr('y1')).toEqual("-10");
            expect(horizontalLine.attr('y2')).toEqual("-10");
            expect(horizontalLine.attr('marker-end')).toBeFalsy();
            const verticalLine = wrapper.find('line.path__inactive').eq(1);
            expect(verticalLine.attr('x1')).toEqual("-60");
            expect(verticalLine.attr('x2')).toEqual("-60");
            // should start 1/4 * height above previous node:
            expect(verticalLine.attr('y1')).toEqual("-10");
            // should end on top of previous node:
            expect(verticalLine.attr('y2')).toEqual("0");
            expect(verticalLine.attr('marker-end')).toBeFalsy();
        });
        test("with children, returns a previous node that has a child arrow protruding", () => {
            const props = {...defaultProps, prevNode: {label: "1", children: true}};
            const wrapper = render(<ViewBox><StyledTreeTier {...props} /></ViewBox>);
            const prevNode = wrapper.find('rect').first().parent();
            expect(prevNode.find('line').length).toEqual(1);
            expect(prevNode.find('line').first().attr('marker-end')).toEqual('url(#arrowhead)');
        });
        test("with additional previous nodes, returns a previous node which has an arrow pointing off left", () => {
            const props = {...defaultProps, prevNode: {label: "1", more: true}};
            const wrapper = render(<ViewBox><StyledTreeTier {...props} /></ViewBox>);
            const horizontalLine = wrapper.find('line.path__inactive').first();
            expect(horizontalLine.attr('x1')).toEqual("0");
            // horizontal line should extend half-width past the edge of the previous node
            expect(horizontalLine.attr('x2')).toEqual("-100")
            expect(horizontalLine.attr('y1')).toEqual("-10");
            expect(horizontalLine.attr('y2')).toEqual("-10");
            expect(horizontalLine.attr('marker-end')).toEqual("url(#arrowhead)");
        });
    })
    describe("given a fourth tier node, selected, with a previous node and next node", () => {
        const defaultProps = {nodeHeight: 60, nodeWidth: 30, containerWidth: 320, tierDepth: 4, node: {label: "27", selected: true}};
        test("returns an active centered node with a label and a second node, with lines connecting them", () => {
            const props = {...defaultProps, prevNode: {label: "1", children: true}, nextNode: {label: "38", more: true}};
            const wrapper = render(<ViewBox><StyledTreeTier {...props} /></ViewBox>);
            expect(wrapper.find('rect').length).toEqual(3);
            expect(wrapper.find('line.path__inactive').length).toEqual(4);
            const horizontalNext = wrapper.find('line.path__inactive').eq(2);
            [['x1', "0"], ['x2', "75"], ['y1', "-15"], ['y2', "-15"]].forEach(([attr, val]) => {
                expect(horizontalNext.attr(attr)).toEqual(val);
            })
            expect(horizontalNext.attr('marker-end')).toEqual('url(#arrowhead)');
            const verticallNext = wrapper.find('line.path__inactive').eq(3);
            [['x1', "45"], ['x2', "45"], ['y1', "-15"], ['y2', "0"]].forEach(([attr, val]) => {
                expect(verticallNext.attr(attr)).toEqual(val);
            })
            expect(verticallNext.attr('marker-end')).toBeFalsy();
        });
    });
});
