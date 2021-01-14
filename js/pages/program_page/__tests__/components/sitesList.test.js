import SitesList from '../../components/sitesList';
import React from 'react';
import TestRenderer from 'react-test-renderer';

describe('Sites List', () => {
    it("shows add site button", () => {
        const rootStore = {program: {siteCount: 1}};
        const tree = TestRenderer.create(<SitesList rootStore={rootStore} />);
        expect(tree.toJSON()).toMatchSnapshot();
        expect(tree.root.findByProps({className: 'btn-link text-success'}).children).toContain("Add site");
    });
    it("shows no sites message when there are no sites", () => {
        const rootStore = {program: {siteCount: 0}};
        const tree = TestRenderer.create(<SitesList rootStore={rootStore} />);
        expect(tree.toJSON()).toMatchSnapshot();
        expect(tree.root.findByProps({className: 'text-muted'}).children).toContain("There are no program sites.");
    });
    it("shows view sites link when there are sites", () => {
        const rootStore = {program: {siteCount: 1}};
        const tree = TestRenderer.create(<SitesList rootStore={rootStore} />);
        expect(tree.toJSON()).toMatchSnapshot();
        expect(tree.root.findByType('ul').children[0].children[0].children[0]).toContain("View program sites");
    });
})
