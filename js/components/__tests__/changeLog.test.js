import React from 'react';
import {
    countryBaseAdminChange,
    countryDisaggTypeChanged,
    countryDisaggLabelsChanged,
    userChangeLog,
    organizationChangeLog,
    programChangeLog,
} from '../__fixtures__/changeLogFixtures';
import ChangeLog, { ChangeField, ChangeLogEntryHeader } from '../changelog'
import renderer from 'react-test-renderer';
import { render } from 'enzyme';

describe("Country change log", () => {

    it("lists all changes", () => {

        let logEntries =  JSON.parse(JSON.stringify(countryBaseAdminChange));
        logEntries[0]['diff_list'] = [countryDisaggTypeChanged, countryDisaggLabelsChanged];
        const expandedRows = new Set([logEntries[0].id]);
        let component = renderer.create(
            <ChangeLog
                data={logEntries}
                expanded_rows={expandedRows}
                toggle_expando_cb={function (){}}
            />
        );
        expect(component.toJSON()).toMatchSnapshot();
    });

    it("displays lists of changes in the correct order", () => {
        let logEntryData =  JSON.parse(JSON.stringify(countryDisaggLabelsChanged));

        let component = renderer.create(
            <ChangeField
                name={logEntryData.pretty_name}
                data={logEntryData.prev}
                change_type='country_disaggregation_created'
            />
        );
        const labelObjs = component.toJSON().filter( c => c.type === 'ul')[0].children;
        expect(labelObjs[0].children[0]).toBe("category 1");
        expect(labelObjs[1].children[0]).toBe("category 3");
        expect(labelObjs[2].children[0]).toBe("category 2");
    });

    it("displays lists of changes when label is in French", () => {
        let logEntryData =  JSON.parse(JSON.stringify(countryDisaggLabelsChanged));

        let component = renderer.create(
            <ChangeField
                name='Catégories de désagrégation'
                data={logEntryData.prev}
                change_type='country_disaggregation_created'
            />
        );
        const labelObjs = component.toJSON().filter( c => c.type === 'ul')[0].children;
        expect(labelObjs[0].children[0]).toBe("category 1");
        expect(labelObjs[1].children[0]).toBe("category 3");
        expect(labelObjs[2].children[0]).toBe("category 2");
    });
});

describe("Change log", () => {

    const changeLogTypes = [
        {fixture: userChangeLog, modelName: " User change log"},
        {fixture: organizationChangeLog, modelName: " Organization change log"},
        {fixture: programChangeLog, modelName: " Program change log"},
    ];

    changeLogTypes.forEach( ({fixture, modelName}) => {
        it(`should display all ${modelName} entries`, () => {
            let logEntries =  JSON.parse(fixture);
            const logIDs = logEntries.map( entry => entry.id);
            const expandedRows = new Set(logIDs);
            let component = renderer.create(
                <ChangeLog
                    data={logEntries}
                    expanded_rows={expandedRows}
                    toggle_expando_cb={function (){}}
                />
            );
            expect(component.toJSON()).toMatchSnapshot();
            expect(component.toJSON().children.filter( c => c.type === "tbody").length).toBe(logEntries.length)
        })
    })

    it("should handle a null admin_user value ", () => {
            let logEntry =  JSON.parse(programChangeLog);
            let wrapper = render(
                <ChangeLogEntryHeader
                    data={logEntry[0]}
                    is_expanded={false}
                    toggle_expando_cb={function (){}}
                />
            );
            expect(wrapper.text()).toContain("Pat Jones")

            logEntry[0].admin_user = null;
            wrapper = render(
                <ChangeLogEntryHeader
                    data={logEntry[0]}
                    is_expanded={false}
                    toggle_expando_cb={function (){}}
                />
            );
            expect(wrapper.text()).toContain("Unavailable -- user deleted")

        })
});
