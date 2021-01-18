import React from "react";
import WrappedDiagram, { RFTreeDiagram } from "../../components/mini_diagram";
import renderer from 'react-test-renderer';
import { shallow, render, mount } from 'enzyme';
import { Provider } from "mobx-react"

describe("Tree Diagram", () => {
    const clickHandlerGetter = jest.fn();
    describe("given a variety of container widths, node heights, and tier counts", () => {
        const levelData = [{tier: "Goal", label: "X1"}, {tier: "Outcome", label: "X2"}];
        test.each([[320], [150], [500]])("appropriately sizes svg width", (containerWidth) => {
            const svgNode = render(<RFTreeDiagram containerWidth={containerWidth} levelTreeData={ levelData } clickHandlerGetter={ clickHandlerGetter } />);
            expect(svgNode.is('svg')).toBeTruthy();
            expect(svgNode.attr('width')).toBe(`${containerWidth}`);
        });
            test.each([
                [333, "55", "222"],
                [150, "25", "100"],
                [500, "83", "332"]])("appropriately centers child groups", (containerWidth, labelsTranslate, nodesTranslate) => {
            const svgNode = render(<RFTreeDiagram containerWidth={containerWidth} levelTreeData={ levelData } clickHandlerGetter={ clickHandlerGetter } />);
            expect(svgNode.find('g.tierLabels').first().attr('transform')).toBe(`translate(${labelsTranslate}, 0)`);
            expect(svgNode.find('g.treeNodes').first().attr('transform')).toBe(`translate(${nodesTranslate}, 0)`);
        });
        test.each([[40], [60], [100]])("appropriately sizes svg height to 4.25 * node height", (nodeHeight) => {
            // .5 h for top spacing, 1h for top tier, 1.5h for space between teirs, 1h for second tier, .5h for bottom arrows
            // makes 4.5 node height
            const expectedHeight = `${4.5*nodeHeight}`;
            const svgNode = render(<RFTreeDiagram nodeHeight={ nodeHeight } levelTreeData={ levelData } clickHandlerGetter={ clickHandlerGetter } />);
            expect(svgNode.attr('height')).toBe(expectedHeight);
        });
        test.each([
            [[{tier: "Goal", label: "X1"}, {tier: "Outcome", label: "X2"}], "180"],
            [[{tier: "Goal", label: "X1"}, {tier: "Outcome", label: "X2"}, {tier: "Output", label: "X3"}], "280"]
        ])("appropriately sizes svg height based on number of tiers", (thisLevelData, expectedHeight) => {
            const svgNode = render(<RFTreeDiagram levelTreeData={ thisLevelData } clickHandlerGetter={ clickHandlerGetter }/>);
            expect(svgNode.attr('height')).toBe(expectedHeight);
        });
    });
});
