import React, { useState, useEffect } from 'react';
import CheckboxedMultiSelect from 'components/checkboxed-multi-select';
import { HelpText } from '../components/HelpText.js'


const CommonFields = ({ commonFieldsInput, setCommonFieldsInput, outcomeThemesData, formErrors, setFormErrors, readOnly, setWasUpdated }) => {

    const [maxDate, setMaxDate] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    useEffect(() => {
        // Setting the max date than can be select, the lesser of the current date or the date the program ends
        formatDate(localdate()) < commonFieldsInput.program_end_date ? setMaxDate(formatDate(localdate())) : setMaxDate(commonFieldsInput.program_end_date);

        $(document).ready(() => { // Needed for localization to translate the calendars month names
            // Use these dates to restrict the result form date fields range. 
            // The maxResultDate should the lesser date of the end of the program or end of the current fiscal year. This is for when a program ends within the current fiscal year.
            // The minResultDate is the greater date of the start of the program or start of the current fiscal year. This is for when a program starts within the current fiscal year.
            let maxResultDate = commonFieldsInput.program_end_date < commonFieldsInput.pt_end_date ? commonFieldsInput.program_end_date : commonFieldsInput.pt_end_date;
            let minResultDate = commonFieldsInput.program_start_date > commonFieldsInput.pt_start_date ? commonFieldsInput.program_start_date : commonFieldsInput.pt_start_date;
            
            $('.datepicker').datepicker({
                dateFormat: "yy-mm-dd",
                maxDate: formatDate(localdate()) < maxResultDate ? formatDate(localdate()) : maxResultDate, // Only allow results for the past so if the current date is less than the maxResultDate, use the current date as the max date allowed.
                minDate: minResultDate,
            });
            if (commonFieldsInput.date_collected) {
                $('.datepicker').datepicker("setDate", commonFieldsInput.date_collected);
                setSelectedDate(commonFieldsInput.date_collected);
            }
            // Capture the value of the datepicker and triggers an update of state
            $('.datepicker').on('change', () => {
                setWasUpdated(true);
                var date = $('.datepicker').datepicker('getDate');
                setSelectedDate(date);
            })
        })
    }, []);

    useEffect(() => {
        setCommonFieldsInput({...commonFieldsInput, date_collected: formatDate(selectedDate)});
        // Validation on date selection
        let detectedErrors = {...formErrors};
        let valid = true;
        if (commonFieldsInput.date_collected !== "" && formatDate(selectedDate) !== "" && formatDate(selectedDate) < commonFieldsInput.program_start_date || formatDate(selectedDate) > maxDate) {
            valid = false;
            detectedErrors = {...detectedErrors, date_collected: gettext("This date should be within the fiscal year of the reporting period.")};
        }
        valid ? delete detectedErrors.date_collected : null;
        setFormErrors(detectedErrors);
    }, [selectedDate]);
    
    let handleValidation = () => {
        let detectedErrors = {...formErrors};
        if (!commonFieldsInput.outcome_theme || commonFieldsInput.outcome_theme.length === 0) {
            detectedErrors = {...detectedErrors, outcome_theme: gettext("Please complete this field. You can select more than one outcome theme.")};
        } else { delete detectedErrors.outcome_theme };
        setFormErrors(detectedErrors);
    }

    return (
        <fieldset>
            <div className="form-group" id="div_id_date_collected--pc">
                <label htmlFor="id_date_collected--pc" className="label--required">{gettext('Result date')}</label>

                <HelpText text={gettext('If data collection occurred within the fiscal year, enter the date when data was collected. If data collection occurred after the end of the fiscal year, enter the last day of the fiscal year (June 30).')}/>

                <input 
                    type="text" 
                    name="date_collected--pc" 
                    id="id_date_collected--pc" 
                    className={`datepicker form-control ${formErrors.date_collected && "is-invalid"}`}
                    required
                    autoComplete="off"
                    disabled={readOnly}
                />
                {
                    formErrors.date_collected &&
                        <span id="validation_id_date_collected--pc" className="has-error">{formErrors.date_collected}</span>
                }
            </div>

            <div className="form-group" id="div_id_periodic_target--pc">
                <label htmlFor="id_periodic_target--pc" className="label--required">{gettext('Fiscal year')}</label>

                <HelpText text={gettext('Fiscal years run from July 1 to June 30 of the following year.')}/>

                <input 
                    type="text" 
                    name="periodic_target--pc" 
                    id="id_periodic_target--pc" 
                    className="form-control" 
                    required
                    autoComplete="off" 
                    disabled
                    value={commonFieldsInput.periodic_target && commonFieldsInput.periodic_target.period || ""}
                />
                  {
                    formErrors.periodic_target &&
                        <span id="validation_id_periodic_target--pc" className="has-error">{formErrors.periodic_target}</span>
                }
            </div>

            <div className="form-group react-multiselect-checkbox" id="div_id_outcome_theme--pc">
                <label htmlFor="outcome_themes_multiselect" className="label--required">{gettext('Outcome theme')}</label>

                <HelpText text={gettext('Outcome themes are the main areas of a program. Refer to MEL Tip Sheet: Guidelines on Counting and Reporting Participant Numbers <a tabIndex="1" href="https://library.mercycorps.org/record/16929?ln=en" target="_blank">[link: https://library.mercycorps.org/record/16929?ln=en]</a> for a description of outcome themes.<span>')}/>

                <CheckboxedMultiSelect 
                    options={outcomeThemesData}
                    placeholder={gettext("None Selected")}
                    className={`${formErrors.outcome_theme && "is-invalid"}`}
                    id="outcome_themes_multiselect"
                    isDisabled={readOnly}
                    value={commonFieldsInput.outcome_theme}
                    onChange={(e) => {
                        setWasUpdated(true);
                        setCommonFieldsInput({...commonFieldsInput, outcome_theme: e});
                    }}
                    onBlur={() => handleValidation()}
                />
                {
                    formErrors.outcome_theme &&
                        <span id="validation_id_outcome_theme--pc" className="has-error">{formErrors.outcome_theme}</span>
                }
            </div>

        </fieldset>
    )
}

export { CommonFields };