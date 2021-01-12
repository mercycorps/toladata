import React from "react";
import { StyledTreeNode } from "../../components/mini_diagram";
import renderer from 'react-test-renderer';
import { shallow, render, mount } from 'enzyme';
import 'jest-styled-components';

const ACTIVE_NODE_FILL = '#FFF';

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
    /*describe("given a width and height", () => {
        test.each([
            [40, 40, -20],
            [20, 20, -10],
            [100, 50, -50]
        ])("returns a rectangle with that width and height", (w, h, exx) => {
            const props = {width: w, height: h};
            const rect = render(<ViewBox><StyledTreeNode {...props} /></ViewBox>).children('rect').first();
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
            const textNode = render(<ViewBox><StyledTreeNode {...props} /></ViewBox>).children('text').first();
            expect(textNode.attr('dy')).toEqual(dy.toString());
            expect(textNode.text()).toEqual(label);
        });
    });*/
    describe("given no status (default active)", () => {
        const props = {width: 40, height: 40, label: "1"}
        test("returns elements with active classes", () => {
            const tree = renderer.create(<ViewBox><StyledTreeNode {...props} /></ViewBox>);
            console.log(tree.root.children[0].children[0])
            expect(1).toEqual(2);
            //expect(tree).toHaveStyleRule('fill', ACTIVE_NODE_FILL);
            //const wrapper = render(<ViewBox><TreeNode {...props} /></ViewBox>);
            //const rect = wrapper.children('rect').first();
            //expect(rect).toHaveStyleRule('fill', ACTIVE_NODE_FILL);
            //console.log(wrapper.html());
            //const rect = wrapper.find('rect').first();
            //console.log("HI");
            //console.log(wrapper.html());
            //expect(rect.css('fill')).toEqual('#FFF');
        });
    })
});
