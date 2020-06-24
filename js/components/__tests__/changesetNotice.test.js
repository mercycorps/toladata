import { create_unified_changeset_notice, testables } from '../changesetNotice';
const { create_rfc_dropdown, create_changeset_form } = testables;

//jest.mock('../changesetNotice', () => ({
jest.mock('../../constants.js', () => ({
    RFC_OPTIONS: [{label: 'Label 1', value: 4}, {label: 'Label 2', value: 3}, {label: 'Other', value: 1}]
}));

describe("RFC Dropdown creator", () => {
    describe("with default options", () => {
        var newNode;
        beforeAll(() => {
            newNode = document.createElement('div');
            newNode.appendChild(create_rfc_dropdown());
        });
        it("renders to snapshot", () => {
            expect(newNode).toMatchSnapshot();
        });
        it("renders default options", () => {
            const select = newNode.querySelector('select');
            expect(select).not.toBeNull();
            const options = select.querySelectorAll('option');
            expect(options.length).toBe(4);
        }); 
    });
    describe("with custom options", () => {
        var newNode;
        const newOptions = [{label: 'New label 1', value: 5}, {label: 'Other', value: 1}];
        beforeAll(() => {
            newNode = document.createElement('div');
            newNode.appendChild(create_rfc_dropdown({custom_rfc_options: newOptions}));
        });
        it("renders to snapshot", () => {
            expect(newNode).toMatchSnapshot();
        });
        it("renders custom options", () => {
            const select = newNode.querySelector('select');
            expect(select).not.toBeNull();
            const options = select.querySelectorAll('option');
            expect(options.length).toBe(3);
        });
    });
});

describe("RFC Form creator", () => {
    describe("")
})