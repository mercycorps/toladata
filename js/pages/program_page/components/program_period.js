import React, { useState, useEffect } from 'react';
import api from '../../../apiv2';

const ProgramPeriod = ({programPk, readOnly}) => {

    let sampleData = {
        program: {
            id: 983,
            // start_date: "2020-09-01",
            // end_date: "2023-04-30",
            start_date: "unavailable",
            end_date: "unavailable",
            reporting_period_start: "2020-09-01", 
            reporting_period_end: "2023-04-30",
        },
        read_only: false,
    }

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

    const [idaaDates, setIdaaDates] = useState({});
    const [programPeriodInputs, setProgramPeriodInputs] = useState({});

    useEffect(() => {
        // Get data on mount with API Call
        api.getProgramPeriodData(programPk)
            .then(response => {
                console.log('Response:', response);
                setIdaaDates({...idaaDates,
                    start_date: response.start_date,
                    end_date: response.end_date
                })
                setProgramPeriodInputs({...programPeriodInputs,
                    indicator_tracking_start_date: response.reporting_period_start,
                    indicator_tracking_end_date: response.reporting_period_end,
                })
            })

        // Setup Date pickers
        const commonOpts = {
            changeMonth: true,
            changeYear: true,
            showButtonPanel: true,
            dateFormat: 'yy-mm-dd',
        };
        
        $('#indicator-tracking__date--end').datepicker(
            $.extend(true, commonOpts, {
                beforeShow: function(input, inst) {
                    $("#ui-datepicker-div").addClass("month-only");
                    // The datepicker will preserve the minDate option from its last use, so we need to reset it
                    // before we set the input field value.
                    $(this).datepicker('option', 'minDate', "-10y");
                    let datestr;
                    if ((datestr = $(this).val()).length > 0) {
                        var defaultDate = processDateString(datestr);
                        $(this).datepicker('option', 'defaultDate', defaultDate);
                        $(this).datepicker('setDate', defaultDate);
                    }
                    else {
                        $(this).datepicker('option', 'defaultDate', new Date());
                    }

                    // If there are dated periodic targets associated with the program, set the minDate to the maximum
                    // start value of all periodic target periods.  Otherwise, if the start date field has a value,
                    // set the minDate to that value.
                    if (max_target_start) {
                        dateParts = max_target_start.split('-')
                        year = parseInt(dateParts[0])
                        month = parseInt(dateParts[1])
                        $(this).datepicker('option', 'minDate', new Date(year, month, 0));
                    }
                    else if ((selectedDate = $(`#${start_date_id}`).val()).length > 0) {
                        let selectedStartDate = processDateString(selectedDate);
                        $(this).datepicker("option", "minDate", new Date(selectedStartDate.getFullYear(), selectedStartDate.getMonth()+1, 0));
                    }
                }
            })
        ).focus(function(){
            const field = $(this);
            // hide the days part of the calendar
            $(".ui-datepicker-calendar").hide();
            // hide the "Today" button
            $("#ui-datepicker-div button.ui-datepicker-current").hide();
            $("#ui-datepicker-div").position({
                my: "left top",
                at: "left bottom",
                of: $(this)
            });
            // detach it from the field so that onclose the field is not populated automatically
            $('.ui-datepicker-calendar').detach();
            $('.ui-datepicker-close').on("click", function() {
                // this is only called when the done button is clicked.
                const month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
                const year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
                field.datepicker('setDate', new Date(year, parseInt(month)+1, 0));
                field.trigger('change');
            });
        })

        $('#indicator-tracking__date--start').datepicker("setDate", programPeriodInputs.indicator_tracking_start_date)
        $('#indicator-tracking__date--end').datepicker("setDate", programPeriodInputs.indicator_tracking_end_date)

        $('#indicator-tracking__date--end').on('change', () => {
            let date = $('#indicator-tracking__date--end').datepicker('getDate');
            console.log("Datepicker:", date);
            // setProgramPeriodInputs({...programPeriodInputs, indicator_tracking_start_date})
        })
    }, [])

    // Send updated data with API Call

    // Validate data



    return (
        <React.Fragment>
            <a
                href="#"
                data-toggle="modal"
                data-target="#program-period__modal"
            >
                {
                    gettext("<Program Period>")
                }
            </a>

            <div id="program-period__modal" className="modal fade" role="dialog" aria-hidden="true">
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

                                    <div>
                                        { gettext("The program period is used in the setup of periodic targets and in Indicator Performance Tracking Tables (IPTT). TolaData initially sets the program period to include the program’s official start and end dates, as recorded in the Identification Assignment Assistant (IDAA) system. The program period may be adjusted to align with the program’s indicator plan.") }
                                    </div>
                                </div>
                            </div>

                            <div id="program-period__section--idaa-dates" className="mb-3">
                                <h3>{ gettext('IDAA program dates')}</h3>
                                <div style={{display: "flex"}}>
                                    <h4 className="mr-4">
                                        <label htmlFor="idaa__date--start" className="text-uppercase"><div className="mb-0">{ gettext("Start date") }</div></label>
                                        {idaaDates.start_date !== "unavailable" ? 
                                            <div className="idaa__date--start">{idaaDates.start_date}</div>
                                            : 
                                            <div className="idaa__date--start color-red">{ gettext("Unavailable")}</div>
                                        }
                                    </h4>
                                    <h4>
                                        <label htmlFor="idaa__date--start" className="text-uppercase"><div className="mb-0">{ gettext("End date") }</div></label>
                                        {idaaDates.end_date !== "unavailable" ? 
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
                                        <h3 className="mb-3">{ gettext('Indicator tracking start and end dates') }</h3>

                                        <div className="mb-3" style={{display: "flex"}}>
                                            <div className="mr-4" style={{display: "flex", flexDirection: "column"}}>
                                                <label htmlFor="indicator-tracking__date--start" className="text-uppercase"><h4 className="mb-1">{ gettext("Start date") }</h4></label>
                                                <input 
                                                    type="text"
                                                    name="indicator-tracking__date--start"
                                                    id="indicator-tracking__date--start"
                                                    className="datepicker form-control rptMonthPicker"
                                                    autoComplete="off"
                                                    disabled
                                                    />
                                            </div>
                                            <div style={{display: "flex", flexDirection: "column"}}>
                                                <label htmlFor="indicator-tracking__date--start" className="text-uppercase"><h4 className="mb-1">{ gettext("End date") }</h4></label>
                                                <input 
                                                    type="text"
                                                    name="indicator-tracking__date--end"
                                                    id="indicator-tracking__date--end"
                                                    className="datepicker form-control rptMonthPicker"
                                                    autoComplete="off"

                                                />
                                            </div>
                                        </div>

                                        <div className="indicator-tracking__description">
                                            { gettext("While a program may begin and end any day of the month, indicator tracking periods must begin on the first day of the month and end on the last day of the month. Please note that the indicator tracking dates should be adjusted before targets are set up and a program begins submitting indicator results. To adjust the Indicator tracking start date or to move the end date earlier after targets are setup and results submitted, refer to the ") }
                                            <a href={"https://mercycorpsemea.sharepoint.com/sites/TolaDataUserGuide"}>{ gettext('TolaData User Guide.')}</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="program-period__section--indicator-actions">
                                <button className="btn btn-primary mr-2">
                                    { gettext('Save Changes') }
                                </button>

                                <button className="btn btn-reset">
                                    { gettext('Reset') }
                                </button>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export { ProgramPeriod };
