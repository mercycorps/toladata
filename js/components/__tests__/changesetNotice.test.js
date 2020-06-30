import { create_unified_changeset_notice, testables } from '../changesetNotice';
const { create_rfc_dropdown, create_changeset_form, temp_create_notice } = testables;

//jest.mock('../changesetNotice', () => ({
jest.mock('../../constants.js', () => ({
    RFC_OPTIONS: [{label: 'Label 1', value: 4}, {label: 'Label 2', value: 3}, {label: 'Other', value: 1}]
}));

$.fn.multiselect = jest.fn();

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


/* notice_type = 'notice',
    header = null,
    show_icon = true,
    message_text = null,
    preamble = null,
    rfc_options = null,
    include_rationale = false
 *
 *if(indicatorHasResults() && hasTrackedFieldsChanged()) {
            if(hasTargetsChanged()) {
                window.create_unified_changeset_notice({
                    header: "Warning",
                    show_icon: false,
                    message_text: window.MODIFY_TARGETS_MESSAGE,
                    rationale_required: true,
                    include_rationale: true,
                    rfc_required: true,
                    rfc_options: ['first', 'second'],
                    validation_type: 1,
                    showCloser: false,
                    no_preamble: true,
                    context: document.getElementById('indicator_update_form'),
                    notice_type: 'error',
                    on_submit: (rationale, reasons_for_change, validation_type) => {
                        submitFormUpdate(rationale, reasons_for_change, validation_type);
                    }
                });
            } else {
                window.create_unified_changeset_notice({
                    header: "Reason for change",
                    show_icon: false,
                    message_text: window.DEFAULT_NONDESTRUCTIVE_MESSAGE,
                    rationale_required: true,
                    include_rationale: true,
                    rfc_required: true,
                    rfc_options: ['first', 'second'],
                    validation_type: 1,
                    showCloser: false,
                    no_preamble: true,
                    context: document.getElementById('indicator_update_form'),
                    on_submit: (rationale, reasons_for_change, validation_type) => {
                        submitFormUpdate(rationale, reasons_for_change, validation_type);
                    }
                });
            }
            scrollToIndicatorFormBottom();
        } else if (hasLevelBeenUpdatedOrCleared()) {
            window.create_unified_changeset_notice({
                header: "Reason for change",
                show_icon: false,
                message_text: window.DEFAULT_NONDESTRUCTIVE_MESSAGE,
                rationale_required: true,
                include_rationale: true,
                rfc_required: true,
                rfc_options: ['first', 'second'],
                validation_type: 1,
                showCloser: false,
                no_preamble: true,
                context: document.getElementById('indicator_update_form'),
                on_submit: (rationale, reasons_for_change, validation_type) => {
                    submitFormUpdate(rationale, reasons_for_change, validation_type);
                }
            });*/
describe("RFC Form creator", () => {
    describe("with indicator targets changed settings", () => {
        var defaults = {
            notice_type: 'error',
            header: "Warning",
            show_icon: false,
            message_text: "Message text here"
        }
    })
});

describe("When called from the indicator form", () => {
    describe("when targets have changed", () => {
        it("renders pnotify properly", done => {
            const contextNode = document.createElement('div');
            let options = {
                header: "Warning",
                show_icon: false,
                message_text: "Modify Targets Message",
                rationale_required: true,
                include_rationale: true,
                rfc_required: true,
                rfc_options: ['first', 'second'],
                validation_type: 1,
                showCloser: false,
                no_preamble: true,
                notice_type: 'error',
                context: contextNode,
                on_submit: (rationale, reasons_for_change, validation_type) => {
                    expect(rationale).toBe("test rationale");
                    expect(reasons_for_change).toBe([2, 3]);
                    done();
                }
            }
            create_unified_changeset_notice(options);
            console.log(contextNode);
            done();
        });
    })
});

describe('temp test', () => {
    test.only('only test to run', done => {
        const contextNode = document.createElement('div');
        let noticeOpen = (notice) => {
            console.log("context");
            console.log(contextNode);
            expect(1).toBe(2);
            done();
        }
        let notice = temp_create_notice({
            context: contextNode,
            afterOpen: noticeOpen
        });
        //expect(true).toBeFalsy();
    });
});