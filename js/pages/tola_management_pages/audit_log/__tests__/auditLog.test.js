import React from 'react';
import { resultLogChanged, resultLogDisaggs } from '../__fixtures__/resultLogFixtures';
import { auditLogIndicator, auditLogResult } from "../__fixtures__/indicator_result_fixtures";
import { ProgramAuditLogStore } from "../models"
import { ResultChangeset, DisaggregationDiffs, IndicatorNameSpan } from "../views"
import renderer from 'react-test-renderer';

window.localizeNumber = function (number) { number };
window.normalizeNumber = function (number) { number };

describe("Audit log", () => {

    it("orders disaggregations correctly", () => {
        let disaggList = Object.values(resultLogDisaggs);
        let component = renderer.create(
            <DisaggregationDiffs
                disagg_type={disaggList['1'].type}
                disagg_diffs={disaggList}
            />
        );
        let renderedLabels = [];
        for (let i=1; i<5; i++) {
            renderedLabels.push(component.toJSON().children[i].children[0].children[0]);
        }
        expect(renderedLabels).toEqual([ 'Value One', 'Value Two', 'Value Three', 'Value Four' ]);

        resultLogDisaggs["10"]["custom_sort"] = 4;
        resultLogDisaggs["20"]["custom_sort"] = 1;
        disaggList = Object.values(resultLogDisaggs);
        component = renderer.create(
            <DisaggregationDiffs
                disagg_type={disaggList['1'].type}
                disagg_diffs={disaggList}
            />
        );
        renderedLabels = [];
        for (let i=1; i<5; i++) {
            renderedLabels.push(component.toJSON().children[i].children[0].children[0]);
        }
        expect(renderedLabels).toEqual([ 'Value Four', 'Value Two', 'Value Three', 'Value One' ]);

    });

    it("orders disaggregations types correctly", () => {
        const component = renderer.create(
            <ResultChangeset
                name={resultLogChanged.name}
                pretty_name={resultLogChanged.pretty_name}
                data={resultLogChanged.new}
            />
        );
        let renderedLabels = [];
        for (let i=0; i<2; i++) {
            renderedLabels.push(component.toJSON().children[i].children[0].children[0]);
        }
        expect(renderedLabels).toEqual([ 'Another Disaggregation', 'Type of Leader' ]);
    })

    it("has one component object for indicator only, none for a result element", () => {
        const component = renderer.create(
            <IndicatorNameSpan
                indicator={auditLogIndicator}
                result_info={null}
            />
        ).toJSON();
        expect(component['children'][2]).toEqual("A test indicator");
    })

    it("has two components - one for indicator and one for result", () => {
        const component = renderer.create(
            <IndicatorNameSpan
                indicator={auditLogIndicator}
                result_info={auditLogResult}
            />
        ).toJSON();
        expect(component).toHaveLength(2);
        expect(component).toMatchSnapshot();

    })
});
