import React from 'react';
// import { localizeNumber } from "../../../../base"
import { resultLogChanged, resultLogDisaggs } from '../__fixtures__/resultLogFixtures';
import { auditLogIndicator, auditLogResult } from "../__fixtures__/indicator_result_fixtures";
import { ProgramAuditLogStore } from "../models"
import { ResultChangeset, DisaggregationDiffs, IndicatorNameSpan, IndicatorChangeset } from "../views"
import renderer from 'react-test-renderer';

window.localizeNumber = function (number) { return number };
window.normalizeNumber = function (number) { return number };

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

    it("displays only one component object in indicator column when no result has changed", () => {
        const component = renderer.create(
            <IndicatorNameSpan
                indicator={auditLogIndicator}
                result_info={null}
            />
        ).toJSON();
        expect(component['children'][2]).toEqual("A test indicator");
    })

    it("displays two components in indicator column - one for indicator and one for result", () => {
        const component = renderer.create(
            <IndicatorNameSpan
                indicator={auditLogIndicator}
                result_info={auditLogResult}
            />
        ).toJSON();
        expect(component).toHaveLength(2);
        expect(component).toMatchSnapshot();

    })

    it("displays an em-dash for the empty prev entry baseline when type is indicator created", () => {
        const component = renderer.create(
            <IndicatorChangeset data={""} name={"baseline_value"} pretty_name={"Baseline"} indicator={{}} />
        )
        expect(component.toJSON().children[1].children[0]).toEqual("—")
        expect(component).toMatchSnapshot();
    })

    it("displays N/A when the baseline not-applicable checkbox has been selected", () => {
        const component = renderer.create(
            <IndicatorChangeset data={null} name={"baseline_value"} pretty_name={"Baseline"} indicator={{}} />
        )
        expect(component.toJSON().children[1].children[0]).toEqual("N/A")
        expect(component).toMatchSnapshot();
    })

    it("displays the baseline number when a baseline has been entered", () => {
        const component = renderer.create(
            <IndicatorChangeset data="4" name={"baseline_value"} pretty_name={"Baseline"} indicator={{}} />
        )
        expect(component.toJSON().children[1].children[0]).toEqual("4")
        expect(component).toMatchSnapshot();
    })
});
