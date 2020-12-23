import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, render } from 'enzyme';
import UserProgramsEditor from '../components/edit_user_programs';

const storeBase = {
    regions: [],
    countries: [],
    ordered_country_ids: [],
    programs: [],
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
