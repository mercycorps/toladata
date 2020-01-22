import React from 'react';
import { resultLogChanged, resultLogDisaggs } from '../__fixtures__/resultLogFixtures';
import { ProgramAuditLogStore } from "../models"
import { ResultChangeset, DisaggregationDiffs } from "../views"
import renderer from 'react-test-renderer';

describe("Audit log", () => {

    it("orders disaggregations correctly", () => {
        let disaggList = Object.values(resultLogDisaggs);
        let component = renderer.create(
            <DisaggregationDiffs
                disagg_type={disaggList['1'].type}
                disagg_diffs={disaggList}
            />
        );
        expect(component.toJSON()).toMatchSnapshot();

        resultLogDisaggs["10"]["custom_sort"] = 4;
        resultLogDisaggs["20"]["custom_sort"] = 1;
        disaggList = Object.values(resultLogDisaggs);
        component = renderer.create(
            <DisaggregationDiffs
                disagg_type={disaggList['1'].type}
                disagg_diffs={disaggList}
            />
        );
        expect(component.toJSON()).toMatchSnapshot();
    });

    it("orders disaggregations types correctly", () => {
        const component = renderer.create(
            <ResultChangeset
                name={resultLogChanged.name}
                pretty_name={resultLogChanged.pretty_name}
                data={resultLogChanged.new}
            />
        );
        expect(component).toMatchSnapshot();
    })
});
