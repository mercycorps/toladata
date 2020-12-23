import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, render } from 'enzyme';
import UserProgramsEditor from '../components/edit_user_programs';

const storeBase = {
    regions: {42: {id: 42, name: "TestRegion"}},
    countries: {1: {id: 1, name: "TestLand", region: 42, programs: [2, 3]}},
    ordered_country_ids: [1],
    programs: {2: {id: 2, name: "TestProgram2"}, 3: {id: 3, name: "TestProgram3"}},
    country_role_choices: [],
    editing_target_data: {
        access: {
            countries: [],
            programs: []
        },
    }
};

describe("user programs editor", () =>{
    const props = {
        store: storeBase,
        user: {
            name: "Test user"
        }
    };
    it("renders without crashing", () => {
        const component = render(
            <UserProgramsEditor {...props} />
        );
        expect(component).toMatchSnapshot();
    })
})
