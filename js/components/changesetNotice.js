
const create_rfc_dropdown = ({
    rfc_options = [],
    rfc_default = false
} = {}) = {
    let rfc_section = '';
    if (rfc_options.length > 0) {
        let options_html = rfc_options.reduce( (acc, option) => acc += `<option value=${option}>${option}</option>`, '');
        options_html += "<option disabled>----------</option>";
        // # Translators: "Other" is an option in a dropdown menu that allows users to specify an alternative to the default options
        options_html += `<option value="other">${gettext("Other")}</option>`;
        // # Translators: This is a label for a dropdown that presents several possible justifications for changing a value
        const rfc_label = `<label>${gettext("Reason for change")}</label>`;
        rfc_section =
            `<section class="pnotify__reason-for-change">
                <div class="form-group">
                    ${rfc_label}
                    <select multiple class="form-control" name="reasons_for_change">
                      ${options_html}
                    </select>
                </div>
            </section>`;

    }
    return rfc_section;
}

/*
* Consider using this notification function rather than the more specific ones above.  It should be able to
* everything they can do. The configurable parameters are for the 4 sections of the notification and
* for other visual and functional elements. Leave any of these null or false to omit them.
* There is NO DEFAULT TEXT. You must explicitly provide text to text elements.
*/

const create_unified_changeset_notice = ({
    header = null, // text for the header
    show_icon = true, // show an appropriate icon in the header
    message_text = null, // appears in black (body color) text
    preamble = null, // appears in colored text below the header
    on_submit = () => {}, // action to trigger on submit
    on_cancel = () => {}, // action to trigger on cancel
    rfc_required = true, // is reason for change required (can be overridden by validation_type)
    rfc_options = [], // reason for change dropdown options
    rfc_default = false,
    rationale_required = true, // do not allow submission without writing a rationale (can be overridden by validation_type)
    include_rationale = false, // shows rationale textarea
    validation_type = 0, // Types - 0: use paramaters/defaults, 1: rationale is optional if rfc is chosen, unless rfc value is other
    showCloser = true, // show close box
    // # Translators: Button to approve a form
    confirm_text = gettext('Ok'),
    // # Translators: Button to cancel a form submission
    cancel_text = gettext('Cancel'),
    context = null,
    notice_type = 'notice', // possible values: error (danger/red), info (blue), success (green), notice (warning/yellow)
    blocking = true,
    self_dismissing = false, // automatically hides the notice after 8000 ms (default). NOTE: this is the OPPOSITE behavior as default PNotify
    dismiss_delay = 8000, // also PNotify default
} = {}) => {
    let header_icons = {
        'error': 'fa-exclamation-triangle',
        'info': 'fa-info-circle',
        'success': 'fa-check-circle',
        'notice': 'fa-exclamation-triangle',
    };
    let color_classes = {
        'error': 'danger',
        'info': 'info',
        'success': 'success',
        'notice': 'primary',
    };

    let icon = '';

    if (show_icon) {
        icon = `<i class="fas ${header_icons[notice_type]}"></i>`
    }

    const header_section = (header || icon) ?
        `<header class="pnotify__header">
            <h4>
                ${icon}
                ${header ? header : ''}
            </h4>
        </header>` : '';

    const preamble_section = !preamble ? '' :
        `<section class="pnotify__preamble">
            <p><b>${preamble}</b></p>
        </section>`;

    const message_section = ! message_text ? '' :
        `<section class="pnotify__message">
            <p>${message_text}</p>
        </section>`;

    let rfc_section = '';
    if (rfc_options.length > 0) {
        let options_html = rfc_options.reduce( (acc, option) => acc += `<option value=${option}>${option}</option>`, '');
        options_html += "<option disabled>----------</option>";
        // # Translators: "Other" is an option in a dropdown menu that allows users to specify an alternative to the default options
        options_html += `<option value="other">${gettext("Other")}</option>`;
        // # Translators: This is a label for a dropdown that presents several possible justifications for changing a value
        const rfc_label = `<label>${gettext("Reason for change")}</label>`;
        rfc_section =
            `<section class="pnotify__reason-for-change">
                <div class="form-group">
                    ${rfc_label}
                    <select multiple class="form-control" name="reasons_for_change">
                      ${options_html}
                    </select>
                </div>
            </section>`;

    }

    // # Translators: This is the label for a textbox where a user can provide details about their reason for selecting a particular option
    const rationale_label = rfc_options.length > 0 ?  `<label>${gettext("Details")}</label>` : '';
    const rationale_section = ! include_rationale ? '' :
        `<section class="pnotify__rationale">
            <div class="form-group">
                ${rationale_label}
                <textarea class="form-control" name="rationale" />
            </div>
        </section>`;

    const inner = `
        ${header_section}
        ${preamble_section}
        ${message_section}
        ${rfc_section}
        ${rationale_section}
    `;


    // IMPORTANT TODO
    // **************
    // Following code cribs from create_changeset_notice
    // I left create_changeset_notice untouched to avoid lots of regressions
    // I think we should deprecate create_changeset_notice entirely

    let confirm_button = {
        text: confirm_text,
        primary: true,
        addClass: 'btn-sm btn-' + color_classes[notice_type],
        click: function (notice) {
            let close = true;
            let textarea = $(notice.refs.elem).find('textarea[name="rationale"]');
            textarea.parent().find('.invalid-feedback').remove();
            let rationale = textarea.val();
            let rfc_select  = $(notice.refs.elem).find('select[name="reasons_for_change"]');
            let reasons_for_change = rfc_select.val();
            let is_valid = false;
            if (validation_type === 0 &&
                (!rationale && rationale_required) ||
                (reasons_for_change.length === 0 && rfc_required)) {
                    is_valid = false;
            }
            else {
                is_valid = true;
            }

            if (validation_type === 1 &&
                (!rationale && (reasons_for_change.length === 0 || reasons_for_change.indexOf("other") >= 0))) {
                    is_valid = false;
            }
            else {
                is_valid = true;
            }


            if (is_valid){
                textarea.removeClass('is-invalid');
            } else {
                textarea.addClass('is-invalid');
                textarea.parent().append(
                    '<div class="invalid-feedback">'
                    + gettext('A reason is required.')
                    + '</div>'
                );
                return false;
            }

            if(on_submit) {
                close = on_submit(rationale, reasons_for_change, validation_type);
                if(close === undefined) {
                    close = true;
                }
            }
            if(close) {
                document.getElementById('notification_blocking_div').style.display='none';
                notice.close();
            }
        }
    }

    let cancel_button = {
        text: cancel_text,
        addClass: 'btn-sm',
        click: function (notice) {
            close = on_cancel()
            if(close === undefined) {
                close = true;
            }

            if(close) {
                document.getElementById('notification_blocking_div').style.display='none';
                notice.close();
            }
        }
    }

    var changeset_buttons = []

    if (confirm_text) {
        changeset_buttons.push(confirm_button)
    }

    if (cancel_text) {
        changeset_buttons.push(cancel_button)
    }

    var notice = PNotify.alert({
        text: $(`<div><form action="" method="post" class="form">${inner}</form></div>`).html(),
        textTrusted: true,
        icon: false,
        width: '350px',
        hide: self_dismissing,
        delay: dismiss_delay,
        type: notice_type,
        addClass: 'program-page__rationale-form',
        stack: {
            'overlayClose': true,
            'dir1': 'right',
            'dir2': 'up',
            'firstpos1': 20,
            'firstpos2': 20,
            'context': context
        },
        modules: {
            Buttons: {
                closer: showCloser,
                closerHover: false,
                sticker: false
            },
            Confirm: {
                align: 'flex-start',
                confirm: true,
                buttons: changeset_buttons
            }
        }
    });

    $('.pnotify__reason-for-change select').multiselect();



    if (on_cancel) {
        notice.on('click', function(e) {
            if ($(e.target).is('.ui-pnotify-closer *')) {
                let close = on_cancel();
                if (close || close === undefined) {
                    document.getElementById('notification_blocking_div').style.display='none';
                    notice.close();
                }
        }});
    }

    // END CRIBBED CODE

}

export { create_unified_changeset_notice };

export const testables = {
    create_rfc_dropdown: create_rfc_dropdown
};