import React, { useState, useEffect } from 'react';
import api from '../../../apiv2';

const ProgramPeriod = ({programPk, heading, headingClass}) => {

    // Helper Functions
    function processDateString(datestr) {
        if (!datestr) return null;
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

    const INDICATOR_TRACKING_DESCRIPTION = {
        en: `Some programs may wish to customize the date range for time-based target periods to better correspond to the program’s implementation phase or the phase in which indicators are measured, tracked, and reported. In these cases, programs may adjust the indicator tracking start and end dates below. Indicator tracking dates must begin on the first day of the month and end on the last day of the month, and they may not fall outside of the official program start and end dates. Please note that the indicator tracking dates should be adjusted <span class="color-red">before indicator periodic targets are set up and the program begins submitting indicator results.</span> To adjust the indicator tracking start date or to move the end date earlier after targets are set up and results submitted, please refer to the
        <a href="https://mercycorpsemea.sharepoint.com/sites/TolaDataUserGuide"> TolaData User Guide.</a>`,
        es: `Algunos programas pueden desear personalizar el rango de fechas para los periodos objetivo basados en el tiempo para que se correspondan mejor con la fase de implementación del programa o con la fase en la que se miden, rastrean y reportan los indicadores. En estos casos, los programas pueden ajustar las fechas de inicio y fin del seguimiento de los indicadores que se indican a continuación. Las fechas de seguimiento de los indicadores deben comenzar el primer día del mes y terminar el último día del mes, y no pueden quedar fuera de las fechas oficiales de inicio y fin del programa. Tenga en cuenta que las fechas de seguimiento de los indicadores deben ajustarse <span class="color-red">antes de que se establezcan las metas periódicas de los indicadores y el programa comience a presentar los resultados de los indicadores.</span> Para ajustar la fecha de inicio del seguimiento de los indicadores o para adelantar la fecha de finalización después de que se hayan establecido los objetivos y se hayan presentado los resultados, consulte la
        <a href="https://mercycorpsemea.sharepoint.com/sites/TolaDataUserGuide"> Guía del Usuario de TolaData.</a>`,
        fr: `Certains programmes peuvent souhaiter personnaliser la plage de dates pour les périodes cibles temporelles afin de mieux correspondre à la phase de mise en œuvre du programme ou à la phase dans laquelle les indicateurs sont mesurés, suivis et rapportés. Dans ces cas, les programmes peuvent ajuster les dates de début et de fin de suivi des indicateurs ci-dessous. Les dates de suivi des indicateurs doivent commencer le premier jour du mois et se terminer le dernier jour du mois, et elles ne peuvent pas tomber en dehors des dates officielles de début et de fin du programme. Veuillez noter que les dates de suivi des indicateurs doivent être ajustées <span class="color-red">avant que les cibles périodiques des indicateurs soient établies et que le programme commence à soumettre les résultats des indicateurs.</span> Pour ajuster la date de début du suivi des indicateurs ou pour avancer la date de fin après la mise en place des cibles et la soumission des résultats, veuillez vous référer au
        <a href="https://mercycorpsemea.sharepoint.com/sites/TolaDataUserGuide"> Guide de l'Utilisateur de TolaData.</a>`,
    };


    const setupDatePickers = () => {
        // Setup Date pickers
        const commonOpts = {
            changeMonth: true,
            changeYear: true,
            showButtonPanel: true,
            dateFormat: 'yy-mm-dd',
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
            field.trigger("blur"); // Prevents users from clicking in and typing into the text field
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
                setProgramPeriodInputs( prevState => ({...prevState, indicator_tracking_start_date: field.val()}));
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
            field.trigger("blur"); // Prevents users from clicking in and typing into the text field
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
                setProgramPeriodInputs( prevState => ({...prevState, indicator_tracking_end_date: field.val()}));
            });
        });
    }

    // Handle validation of the editable start and end dates before sending them to the backend.
    const handleValidation = () => {
        let valid = true;
        let hasStartChanged = origData.start_date === programPeriodInputs.indicator_tracking_start_date;
        let hasEndChanged = origData.end_date === programPeriodInputs.indicator_tracking_end_date;

        if (hasStartChanged && programPeriodInputs.indicator_tracking_start_date === "") {
            createAlert(
                "danger",
                gettext("You must enter values for the indicator tracking period start date before saving."),
                false,
                "#div-id-reportingperiod-alert"
            )
            $(start_date_id).addClass('is-invalid')
            valid = false;
        }
        if (hasEndChanged && programPeriodInputs.indicator_tracking_end_date === "") {
            createAlert(
                "danger",
                gettext("You must enter values for the indicator tracking period end date before saving."),
                false,
                "#div-id-reportingperiod-alert"
            )
            $(end_date_id).addClass('is-invalid');
            valid = false;
        }
        if (programPeriodInputs.indicator_tracking_start_date > programPeriodInputs.indicator_tracking_end_date) {
            createAlert(
                "danger",
                gettext("The end date must come after the start date."),
                false,
                "#div-id-reportingperiod-alert"
            )
            $(start_date_id).addClass('is-invalid');
            $(end_date_id).addClass('is-invalid');
            valid = false;
        }
        if (hasStartChanged && idaaDates.start_date && programPeriodInputs.indicator_tracking_start_date < idaaDates.start_date) {
            createAlert(
                "danger",
                gettext("The indicator tracking start must be later than the IDAA start date."),
                false,
                "#div-id-reportingperiod-alert"
            )
            $(start_date_id).addClass('is-invalid');
            valid = false;
        }
        if (hasEndChanged && idaaDates.end_date && programPeriodInputs.indicator_tracking_end_date > idaaDates.end_date) {
            createAlert(
                "danger",
                gettext("The indicator tracking end dates must be earlier the IDAA end date."),
                false,
                "#div-id-reportingperiod-alert"
            )
            $(end_date_id).addClass('is-invalid');
            valid = false;
        }
        return valid;
    }

    // Component States
    const [lockForm, setLockForm] = useState(false);
    const [idaaDates, setIdaaDates] = useState({});
    const [programPeriodInputs, setProgramPeriodInputs] = useState({});
    const [origData, setOrigData] = useState({});
    const start_date_id = `#indicator-tracking__date--start-${programPk}`;
    const end_date_id = `#indicator-tracking__date--end-${programPk}`;

    // On component mount
    useEffect(() => {
        
        $(`#program-period__modal--${programPk}`).on('show.bs.modal', () => {
            
            $(".indicator-tracking__description").append(INDICATOR_TRACKING_DESCRIPTION[window.userLang]); // Adds the description text based on users language

            // Get data on mount with API Call
            api.getProgramPeriodData(programPk)
                .then(response => {
                    let {
                        start_date: idaa_start_date,
                        end_date: idaa_end_date,
                        reporting_period_start: indicator_tracking_start_date,
                        reporting_period_end: indicator_tracking_end_date
                    } = response;
                    // Update the state variables
                    setOrigData({
                        readOnly: response.readonly,
                        has_time_aware_targets: response.has_time_aware_targets,
                        indicator_tracking_start_date: indicator_tracking_start_date || null,
                        indicator_tracking_end_date: indicator_tracking_end_date || null,
                    });
                    setIdaaDates({...idaaDates,
                        start_date: idaa_start_date || null,
                        end_date: idaa_end_date || null,
                    });
                    setProgramPeriodInputs({...programPeriodInputs,
                        indicator_tracking_start_date: indicator_tracking_start_date || null,
                        indicator_tracking_end_date: indicator_tracking_end_date || null,
                    });

                    // Setting the datepicker values for the editable Indicator Tracking Start Date
                    $(start_date_id).datepicker("setDate", indicator_tracking_start_date);

                    // Setting the Min Start Date:
                    let startMinDate;
                    if (idaa_start_date) {
                        // If IDAA start date exist and the Indicator Tracking start date does not exist or is later than IDAA start date, then set min date to the IDAA start date
                        if (!indicator_tracking_start_date || idaa_start_date < indicator_tracking_start_date) {
                        startMinDate = processDateString(idaa_start_date);
                        // If IDAA start date exist and is later than Indicator Tracking start date, then set min date to the Indicator Tracking start date
                        } else {
                            startMinDate = processDateString(indicator_tracking_start_date);
                        }
                    } else {
                        // If IDAA start date does not exist but the Indicator Tracking start date does exist, set min date to the Indicator Tracking end date
                        if (indicator_tracking_start_date) {
                            startMinDate = processDateString(indicator_tracking_start_date);
                        // If the IDAA start date and the Indicator Tracking start date both do not exist, set min date to null.
                        } else {
                            startMinDate = null;
                        }
                    }
                    // If theres no selected min start date, set it to 10 years back from the current date.
                    if (!startMinDate) {
                        startMinDate = new Date()
                        startMinDate.setFullYear(startMinDate.getFullYear() - 10)
                    };
                    $(`#indicator-tracking__date--start-${programPk}`).datepicker("option", "minDate", new Date(startMinDate.getFullYear(), startMinDate.getMonth(), 1));

                    // Setting the datepicker values for the editable Indicator Tracking End Date
                    $(end_date_id).datepicker("setDate", indicator_tracking_end_date);
                    // Setting the Max End Date:
                    let endMaxDate;
                    if (idaa_end_date) {
                        // If IDAA end date exist and the Indicator Tracking end date does not exist or is earlier than IDAA end date, then set max date to the IDAA end date
                        if (!indicator_tracking_end_date || idaa_end_date > indicator_tracking_end_date) {
                        endMaxDate = processDateString(idaa_end_date);
                        // If IDAA end date exist and is earlier than Indicator Tracking end date, then set max date to the Indicator Tracking end date
                        } else {
                            endMaxDate = processDateString(indicator_tracking_end_date);
                        }
                    } else {
                        // If IDAA end date does not exist but the Indicator Tracking end date does exist, set max date to the Indicator Tracking end date
                        if (indicator_tracking_end_date) {
                            endMaxDate = processDateString(indicator_tracking_end_date);
                        // If the IDAA end date and the Indicator Tracking end date both do not exist, set max date to null.
                        } else {
                            endMaxDate = null;
                        }
                    }
                    // If theres no selected max start date, set it to 10 years up from the current date.
                    if (!endMaxDate) {
                        endMaxDate = new Date()
                        endMaxDate.setFullYear(endMaxDate.getFullYear() + 10)
                    };
                    $(`#indicator-tracking__date--end-${programPk}`).datepicker("option", "maxDate", new Date(endMaxDate.getFullYear(), endMaxDate.getMonth() + 1, 0));
                })
                .catch(() => {
                    createAlert(
                        "danger",
                        gettext("Error. Could not retrieve data from server. Please report this to the Tola team."),
                        false,
                        "#div-id-reportingperiod-alert"
                    );
                })
        })

        // Setup the Indicator tracking start and end dates datepicker
        setupDatePickers();
    }, [])

    $(`#program-period__modal--${programPk}`).on('hide.bs.modal', function () {
        // Need to remove the month-only class from the date-picker so it doesn't interfere with other datepickers
        // on the page.  Can't do it in the picker because it results in a calendar flash before picker is closed.
        $("#ui-datepicker-div").removeClass("month-only");
        $(".indicator-tracking__description").empty(); // Removes the description text when modal is closed

    })

    // Send updated data with API Call
    const handleUpdateData = () => {
        // setLockForm(true);
        $(".dynamic-alert").remove() // Removes all alert boxes
        $(start_date_id).removeClass("is-invalid")
        $(end_date_id).removeClass("is-invalid")

        // Text to display in the rationale popup.
        const INDICATOR_TRACKING_CHANGE_TEXT = gettext( 'This action may result in changes to your periodic targets. If you have already set up periodic targets for your indicators, you may need to enter additional target values to cover the entire indicator tracking period. For future reference, please provide a reason for modifying the indicator tracking period.' )

        // Only update if there has been a change in the editable dates.
        if (origData.indicator_tracking_start_date !== programPeriodInputs.indicator_tracking_start_date || origData.indicator_tracking_end_date !== programPeriodInputs.indicator_tracking_end_date) {
            if (handleValidation()) {
                window.create_unified_changeset_notice({
                    header: gettext("Reason for change"),
                    show_icon: true,
                    message_text: INDICATOR_TRACKING_CHANGE_TEXT,
                    include_rationale: true,
                    rationale_required: true,
                    context: document.getElementById(`program-period__content--${programPk}`),
                    on_submit: (rationale) => sendData(rationale)
                })
            }
        } else {
            // If there has not been a change in the editable dates, just close the modal when the save changes button is clicked.
            $(`#program-period__modal--${programPk}`).modal('hide');
        }

        // API calls function that sends the editable indicator tracking start and end dates along with the rationale for the update.
        let sendData = (rationale) => {
            let data = {
                reporting_period_start: programPeriodInputs.indicator_tracking_start_date,
                reporting_period_end: programPeriodInputs.indicator_tracking_end_date,
                rationale: rationale,
            };
            api.updateProgramPeriodData(programPk, data)
                .then(res => {
                    if (res.status === 200) {
                        window.unified_success_message( 
                            // # Translators: This is the text of an alert that is triggered upon a successful change to the the start and end dates of the reporting period
                            gettext('Indicator tracking period updated')
                        );
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    } else {
                        setLockForm(false);
                        let msg = res.failmsg || gettext('There was a problem saving your changes.');
                        window.unified_error_message( gettext('Saving Failed'));
                        createAlert(
                            "danger",
                            msg,
                            false,
                            "#div-id-reportingperiod-alert"
                        )
                    }
                })
        }
    }

    // Handle Cancel changes button click to restore indicator tracking start and end dates to original database dates
    const handleCancelChanges = () => {
        setProgramPeriodInputs({
            indicator_tracking_start_date: origData.indicator_tracking_start_date,
            indicator_tracking_end_date: origData.indicator_tracking_end_date
        });
        $(start_date_id).datepicker("setDate", origData.indicator_tracking_start_date)
        $(end_date_id).datepicker("setDate", origData.indicator_tracking_end_date)
    }

    return (
        <React.Fragment>
            <a
                className={headingClass}
                href="#"
                data-toggle="modal"
                data-target={`#program-period__modal--${programPk}`}
            >{heading}
            </a>

            <div id={`program-period__modal--${programPk}`} className="modal fade" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div id={`program-period__content--${programPk}`} className="modal-content">

                        <div className="modal-body" style={{pointerEvents: lockForm ? "none" : "all"}}>

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
                                    <div id="div-id-reportingperiod-alert" className="text-danger"></div>
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

                                        <div className="indicator-tracking__description"></div>
                                        <br/>
                                        <h3 className="mb-3">{ gettext('Indicator tracking period') }</h3>

                                        <div className="mb-3" style={{display: "flex"}}>
                                            <div className="mr-4">
                                                <label htmlFor={`indicator-tracking__date--start-${programPk}`} className="text-uppercase"><h4 className="mb-1">{ gettext("Start date") }</h4></label>
                                                <input 
                                                    type="text"
                                                    name={`indicator-tracking__date--start-${programPk}`}
                                                    id={`indicator-tracking__date--start-${programPk}`}
                                                    className="datepicker form-control rptMonthPicker"
                                                    autoComplete="off"
                                                    disabled={origData.readOnly || origData.has_time_aware_targets}
                                                    />
                                            </div>
                                            <div>
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