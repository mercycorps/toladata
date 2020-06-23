import { create_unified_changeset_notice, testables } from '../changesetNotice';
const { create_rfc_dropdown } = testables;

describe('RFC Dropdown', () => {
    it("works when given options", () => {
        let options = [
            {value: 1, label: 'First label'},
            {value: 2, label: 'Second label'},
            {value: 3, label: 'Other label'}
        ];
        let rfc_dropdown = create_rfc_dropdown({rfc_options: options});
    })
})