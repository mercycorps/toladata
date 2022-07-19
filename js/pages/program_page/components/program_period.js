import React, { useState, useEffect } from 'react';
import api from '../../../apiv2';

const ProgramPeriod = ({programPk}) => {
    // Helper Functions
    function processDateString(datestr) {
        // take a date string, return a Date, for datepickers, handles iso dates and human input dates
        //check for an iso date, and if so parse it with regex (to avoid 0 padding glitches on chrome)
        var isodate = /(\d{4})\-(\d{1,2})\-(\d{1,2})/.exec(datestr);
        var defaultDate;
        if (isodate !== null) {
            //regex found an iso date, instance a date from the regex parsing:
            //note: month is 0-index in JS because reasons, so -1 to parse human iso date:
            defaultDate = new Date(isodate[1], isodate[2]-1, isodate[3]);
        } else {
            defaultDate = new Date(
                datestr.substring(datestr.length - 4, datestr.length),
                jQuery.inArray(datestr.substring(0, 3), $(this).datepicker('option', 'monthNamesShort')) + 1,
                0
            );
        }
        return defaultDate;
    }

    // Component States
    const [idaaDates, setIdaaDates] = useState({});
    const [programPeriodInputs, setProgramPeriodInputs] = useState({});
    const [origData, setOrigData] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const start_date_id = `#indicator-tracking__date--start-${programPk}`;
    const end_date_id = `#indicator-tracking__date--end-${programPk}`;

    // On component mount
    useEffect(() => {

        $(`#program-period__modal--${programPk}`).on('show.bs.modal', () => {
            // Get data on mount with API Call
            api.getProgramPeriodData(programPk)
                .then(response => {
                    
                    // Update the state variables
                    setOrigData({
                        readOnly: response.readOnly,
                        has_regular_target_frequencies: response.has_regular_target_frequencies,
                        start_date: response.reporting_period_start || null,
                        end_date: response.reporting_period_end || null,
                    })
                    setIdaaDates({...idaaDates,
                        start_date: response.idaa_start_date || null,
                        end_date: response.idaa_end_date || null,
                    })
                    setProgramPeriodInputs({...programPeriodInputs,
                        indicator_tracking_start_date: response.reporting_period_start || null,
                        indicator_tracking_end_date: response.reporting_period_end || null,
                    })

    
                    // Setting the datepicker values for the editable Indicator Tracking Start Date
                    $(start_date_id).datepicker("setDate", response.reporting_period_start)
                    // Setting the Min Start Date. If the existing program has a start date that is earlier than the IDAA start date, 
                    // allow it to keep it but restrict the date from being any earlier. Otherwise, set the min date to the IDAA Start Date.
                    let selectedStartDate;
                    if (response.reporting_period_start < response.idaa_start_date) {
                        selectedStartDate = processDateString(response.reporting_period_start);
                    } else {
                        selectedStartDate = processDateString(response.idaa_start_date);
                    }
                    let startYear = selectedStartDate.getFullYear();
                    let startMonth = selectedStartDate.getMonth();
                    $('#indicator-tracking__date--start').datepicker("option", "minDate", new Date(startYear, startMonth, 1));
    
    
                    // Setting the datepicker values for the editable Indicator Tracking End Date
                    $(end_date_id).datepicker("setDate", response.reporting_period_end)
                    // Setting the Max End Date. If the existing program has a end date that is later than the IDAA end date, 
                    // allow it to keep it but restrict the date from being any later. Otherwise, set the max date to the IDAA End Date.
                    let selectedEndDate;
                    if (response.reporting_period_end > response.idaa_end_date) {
                        selectedEndDate = processDateString(response.reporting_period_end);
                    } else {
                        selectedEndDate = processDateString(response.idaa_end_date);
                    }
                    let endYear = selectedEndDate.getFullYear();
                    let endMonth = selectedEndDate.getMonth() + 1;
                    $(`#indicator-tracking__date--end-${programPk}`).datepicker("option", "maxDate", new Date(endYear, endMonth, 0));
                })
                .catch(() => {
                    setErrorMessage(gettext("Error. Could not retrieve data from server. Please report this to the Tola team."))
                })
        })

        // Setup Date pickers
        const commonOpts = {
            changeMonth: true,
            changeYear: true,
            showButtonPanel: true,
            dateFormat: 'yy-mm-dd',
            onClose: function (dateText, inst) {
                // Without blurring, when the Done button is pressed, the cursor stays in the date input field
                // and the user can put whatever they want, without the controls implemented by the datepicker.
                $(this).trigger("blur");
            },
        };

        // Editable Indicator Tracking Start Date
        $(start_date_id).datepicker(
            $.extend(true, commonOpts, {
                beforeShow: function (input, inst) {
                    $("#ui-datepicker-div").addClass("month-only");
                    // The datepicker will preserve the maxDate and defaultDate options from its last use,
                    // so we need to reset them before we set the input field value.
                    $(this).datepicker('option', 'maxDate', "+10y");
                    let datestr;
                    if ((datestr = $(this).val()).length > 0) {
                        let defaultDate = processDateString(datestr);
                        $(this).datepicker('option', 'defaultDate', defaultDate);
                        $(this).datepicker('setDate', defaultDate);
                    }
                    else {
                        $(this).datepicker('option', 'defaultDate', new Date());
                    }

                    // If the end date field has a value, set the maxDate to that value.
                    let selectedDate;
                    if ((selectedDate = $(end_date_id).val()).length > 0) {
                        let selectedEndDate = processDateString(selectedDate);
                        let year = selectedEndDate.getFullYear();
                        let month = selectedEndDate.getMonth();
                        $(this).datepicker("option", "maxDate", new Date(year, month, 1));
                    }
                },
            })
        ).focus(function(){
            const field = $(this);
            setTimeout(() => {
            // hide the days part of the calendar
            $(".ui-datepicker-calendar").hide();
            // hide the "Today" button
            $("#ui-datepicker-div button.ui-datepicker-current").hide();
                $("#ui-datepicker-div").position({
                    my: "left top",
                    at: "left bottom",
                    of: $(this)
                });
            }, 1);
            // detach it from the field so that onclose the field is not populated automatically
            $('.ui-datepicker-calendar').detach();
            $('.ui-datepicker-close').on("click", function() {
                // this is only called when the done button is clicked.
                const month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
                const year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
                let newDate = new Date(year, month, 1);
                field.datepicker('setDate', newDate);
                field.trigger('change');
                setProgramPeriodInputs( prevState => ({...prevState, indicator_tracking_start_date: field.val()}))
            });
        });
        
        // Editable Indicator Tracking End Date
        $(end_date_id).datepicker(
            $.extend(true, commonOpts, {
                beforeShow: function(input, inst) {
                    $("#ui-datepicker-div").addClass("month-only");
                    // The datepicker will preserve the minDate option from its last use, so we need to reset it
                    // before we set the input field value.
                    $(this).datepicker('option', 'minDate', "-10y");
                    let datestr;
                    if ((datestr = $(this).val()).length > 0) {
                        let defaultDate = processDateString(datestr);
                        $(this).datepicker('option', 'defaultDate', defaultDate);
                        $(this).datepicker('setDate', defaultDate);
                    }
                    else {
                        $(this).datepicker('option', 'defaultDate', new Date());
                    }

                    // If the start date field has a value, set the minDate to that value.
                    let selectedDate;
                    if ((selectedDate = $(start_date_id).val()).length > 0) {
                        let selectedStartDate = processDateString(selectedDate);
                        let year = selectedStartDate.getFullYear();
                        let month = selectedStartDate.getMonth() + 1;
                        $(this).datepicker("option", "minDate", new Date(year, month, 0));
                    }
                }
            })
        ).focus(function(){
            const field = $(this);
            setTimeout(() => {
            // hide the days part of the calendar
            $(".ui-datepicker-calendar").hide();
            // hide the "Today" button
                $("#ui-datepicker-div button.ui-datepicker-current").hide();
                $("#ui-datepicker-div").position({
                    my: "left top",
                    at: "left bottom",
                    of: $(this)
                });
            }, 1);
            // detach it from the field so that onclose the field is not populated automatically
            $('.ui-datepicker-calendar').detach();
            $('.ui-datepicker-close').on("click", function() {
                // this is only called when the done button is clicked.
                const month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
                const year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
                let newDate = new Date(year, parseInt(month) + 1, 0);
                field.datepicker('setDate', newDate);
                field.trigger('change');
                setProgramPeriodInputs( prevState => ({...prevState, indicator_tracking_end_date: field.val()}))
            });
        });


        
    }, [])

    $(`#program-period__modal--${programPk}`).on('hide.bs.modal', function () {
        // Need to remove the month-only class from the date-picker so it doesn't interfere with other datepickers
        // on the page.  Can't do it in the picker because it results in a calendar flash before picker is closed.
        $("#ui-datepicker-div").removeClass("month-only");
    })

    // Send updated data with API Call
    const handleUpdateData = () => {
        // Text to display in the rationale popup.
        const INDICATOR_TRACKING_CHANGE_TEXT = gettext( 'This action may result in changes to your periodic targets. If you have already set up periodic targets for your indicators, you may need to enter additional target values to cover the entire indicator tracking period. For future reference, please provide a reason for modifying the indicator tracking period.' )

        // Only update if there has been a change in the editable dates.
        if (origData.start_date !== programPeriodInputs.indicator_tracking_start_date || origData.end_date !== programPeriodInputs.indicator_tracking_end_date) {
            if (handleValidation()) {
                window.create_unified_changeset_notice({
                    header: gettext("Reason for change"),
                    show_icon: true,
                    message_text: INDICATOR_TRACKING_CHANGE_TEXT,
                    include_rationale: true,
                    rationale_required: true,
                    context: document.getElementById('program-period__content'),
                    on_submit: (rationale) => sendData(rationale)
                })
            }
        } else {
            // If there has not been a change in the editable dates, just close the modal when the save changes button is clicked.
            $(`#program-period__modal--${programPk}`).modal('hide');
        }

        // API calls function that sends the editable indicator tracking start and end dates along with the rationale for the update.
        let sendData = (rationale) => {
            let data = {...programPeriodInputs, rationale: rationale};
            api.updateProgramPeriodData(programPk, data)
            .then(res => {
                if (res.status === 200) {
                    window.unified_success_message( 
                        // # Translators: This is the text of an alert that is triggered upon a successful change to the the start and end dates of the reporting period
                        gettext('Indicator tracking period updated')
                    );
                    window.location.reload();
                } else {
                    let msg = res.failmsg || gettext('There was a problem saving your changes.');
                    window.unified_error_message( gettext('Saving Failed'));
                    setErrorMessage(msg)
                }
            })
        }
    }

    // Handle validation of the editable start and end dates before sending them to the backend.
    const handleValidation = () => {
        let valid = true;
        if (programPeriodInputs.indicator_tracking_start_date === "" || programPeriodInputs.indicator_tracking_start_date === "") {
            setErrorMessage(
                gettext("You must enter values for the reporting start and end dates before saving.")
            )
            valid = false;
        } else {
            if (programPeriodInputs.indicator_tracking_start_date > programPeriodInputs.indicator_tracking_end_date) {
                setErrorMessage(
                    gettext("The end date must come after the start date.")
                )
                valid = false;
            }
            if (programPeriodInputs.indicator_tracking_start_date < idaaDates.start_date || programPeriodInputs.indicator_tracking_end_date > idaaDates.end_date) {
                setErrorMessage(
                    gettext("The indicator tracking start and end dates must be between the IDAA start and end dates.")
                )
                valid = false;
            }
        }
        return valid;
    }

    // Handle Cancel changes button click to restore indicator tracking start and end dates to original database dates
    const handleCancelChanges = () => {
        setProgramPeriodInputs({
            indicator_tracking_start_date: origData.start_date,
            indicator_tracking_end_date: origData.end_date
        });
        $(start_date_id).datepicker("setDate", origData.start_date)
        $(end_date_id).datepicker("setDate", origData.end_date)
    }

    return (
        <React.Fragment>
            <a
                href="#"
                data-toggle="modal"
                data-target={`#program-period__modal--${programPk}`}
            >
                {
                    gettext("<Program Period>")
                }
            </a>

            <div id={`program-period__modal--${programPk}`} className="modal fade" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div id="program-period__content" className="modal-content">

                        <div className="modal-body">

                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close">
                                <span>&times;</span>
                            </button>

                            <div id="program-period__section--heading" className="mb-4">
                                <div className="pt-3" style={{display: "inline-block", width: "90%"}}>

                                    <div className="mb-4"><h2>{ gettext("Program period")}</h2></div>
                                    <div id="div-id-reportingperiod-alert" className="text-danger">{errorMessage}</div>

                                    <br/>

                                    <div>
                                        { gettext("The program period is used as the default for the initial setup of time-based target periods (e.g., annually, quarterly, etc.) and in the Indicator Performance Tracking Tables (IPTTs). The Program Period is based on the program’s official start and end dates as recorded in the Identification Assignment Assistant (IDAA) system and cannot be adjusted in TolaData.") }
                                    </div>
                                </div>
                            </div>

                            <div id="program-period__section--idaa-dates" className="mb-3">
                                <h3>{ gettext('IDAA program dates')}</h3>
                                <div style={{display: "flex"}}>
                                    <h4 className="mr-4">
                                        <label htmlFor="idaa__date--start" className="text-uppercase"><div className="mb-0">{ gettext("Start date") }</div></label>
                                        {idaaDates.start_date ? 
                                            <div className="idaa__date--start">{idaaDates.start_date}</div>
                                            : 
                                            <div className="idaa__date--start color-red">{ gettext("Unavailable")}</div>
                                        }
                                    </h4>
                                    <h4>
                                        <label htmlFor="idaa__date--start" className="text-uppercase"><div className="mb-0">{ gettext("End date") }</div></label>
                                        {idaaDates.end_date ? 
                                            <div className="idaa__date--end">{idaaDates.end_date}</div>
                                            : 
                                            <div className="idaa__date--end color-red">{ gettext("Unavailable")}</div>
                                        }
                                    </h4>
                                </div>
                            </div>

                            <div id="program-period__section--indicator-dates" className="mb-4" style={{width: "90%"}}>
                                <div className="card inputs-in-a-box">
                                    <div className="card-body px-4 py-3">

                                        <div className="indicator-tracking__description">
                                            { gettext("Some programs may wish to customize the date range for time-based target periods to better correspond to the program’s implementation phase or the phase in which indicators are measured, tracked, and reported. In these cases, programs may adjust the indicator tracking start and end dates below. Indicator tracking dates must begin on the first day of the month and end on the last day of the month, and they may not fall outside of the official program start and end dates. Please note that the indicator tracking dates should be adjusted before indicator periodic targets are set up and the program begins submitting indicator results. To adjust the indicator tracking start date or to move the end date earlier after targets are set up and results submitted, please refer to the TolaData User Guide.") }
                                            <a href={"https://mercycorpsemea.sharepoint.com/sites/TolaDataUserGuide"}>{ gettext('TolaData User Guide.')}</a>
                                        </div>

                                        <br/>

                                        <h3 className="mb-3">{ gettext('Indicator tracking period') }</h3>

                                        <div className="mb-3" style={{display: "flex"}}>
                                            <div className="mr-4" style={{display: "flex", flexDirection: "column"}}>
                                                <label htmlFor={`indicator-tracking__date--start-${programPk}`} className="text-uppercase"><h4 className="mb-1">{ gettext("Start date") }</h4></label>
                                                <input 
                                                    type="text"
                                                    name={`indicator-tracking__date--start-${programPk}`}
                                                    id={`indicator-tracking__date--start-${programPk}`}
                                                    className="datepicker form-control rptMonthPicker"
                                                    autoComplete="off"
                                                    disabled={origData.readOnly || origData.has_regular_target_frequencies}
                                                    />
                                            </div>
                                            <div style={{display: "flex", flexDirection: "column"}}>
                                                <label htmlFor={`indicator-tracking__date--end-${programPk}`} className="text-uppercase"><h4 className="mb-1">{ gettext("End date") }</h4></label>
                                                <input 
                                                    type="text"
                                                    name={`indicator-tracking__date--end-${programPk}`}
                                                    id={`indicator-tracking__date--end-${programPk}`}
                                                    className="datepicker form-control rptMonthPicker"
                                                    autoComplete="off"
                                                    disabled={origData.readOnly}

                                                />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            { !origData.readOnly && 
                                <div id="program-period__section--indicator-actions">
                                    <button className="btn btn-primary mr-2" onClick={() => handleUpdateData()}>
                                        { gettext('Save Changes') }
                                    </button>

                                    <button className="btn btn-reset" onClick={() => handleCancelChanges()}>
                                        { gettext('Cancel changes') }
                                    </button>
                                </div>
                            }

                        </div>

                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export { ProgramPeriod };