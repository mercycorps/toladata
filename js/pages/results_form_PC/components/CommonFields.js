import React, { useState, useEffect } from 'react';
import CheckboxedMultiSelect from 'components/checkboxed-multi-select';
import { HelpText } from '../components/HelpText.js'


const CommonFields = ({ commonFieldsInput, setCommonFieldsInput, outcomeThemesData, formErrors, setFormErrors, readOnly }) => {

    return (
        <fieldset>
            <div className="form-group" id="div_id_date_collected">
                <label htmlFor="id_date_collected" className="label--required">{gettext('Result date')}</label>

                <HelpText text={gettext('If data collection occurred within the fiscal year, enter the date where data was collected. If data collection occurred after the end of the fiscal year, enter the last day of the fiscal year (June 30).')}/>

                <input 
                    type="date" 
                    name="date_collected" 
                    id="id_date_collected" 
                    className={`datepicker form-control hasDatepicker ${formErrors.date_collected && "is-invalid"}`}
                    required
                    autoComplete="off"
                    disabled={readOnly}
                    min={commonFieldsInput.program_start_date}
                    max={commonFieldsInput.program_end_date}
                    value={commonFieldsInput.date_collected || ""}
                    onChange={(e) => setCommonFieldsInput({...commonFieldsInput, [e.target.name]: e.target.value})}
                    onBlur={() => {
                        let detectedErrors = "";
                        if (commonFieldsInput.date_collected === "" || commonFieldsInput.date_collected === undefined || commonFieldsInput.date_collected < commonFieldsInput.program_start_date || commonFieldsInput.date_collected > commonFieldsInput.program_end_date) {
                            detectedErrors = gettext("This date should be within the fiscal year of the reporting period.")
                        } 
                        setFormErrors({...formErrors, date_collected: detectedErrors})
                    }}
                />
                {
                    formErrors.date_collected &&
                        <span id="validation_id_date_collected" className="has-error">{formErrors.date_collected}</span>
                }
            </div>

            <div className="form-group" id="div_id_periodic_target">
                <label htmlFor="id_periodic_target" className="label--required">{gettext('Fiscal year')}</label>

                <HelpText text={gettext('Fiscal years run from July 1 to June 30 of the following year.')}/>

                <input 
                    type="text" 
                    name="periodic_target" 
                    id="id_periodic_target" 
                    className="form-control" 
                    required autoComplete="off" 
                    disabled
                    value={commonFieldsInput.periodic_target && commonFieldsInput.periodic_target.period || ""}
                />
            </div>

            <div className="form-group react-multiselect-checkbox" id="div_id_outcome_theme">
                <label htmlFor="id_outcome_theme" className="label--required">{gettext('Outcome theme')}</label>

                <HelpText text={gettext('Outcome themes are the main areas of a program. Refer to MEL Tip Sheet: Guidelines on Counting and Reporting Participant Numbers <a tabIndex="1" href="https://library.mercycorps.org/record/16929?ln=en" target="_blank">[link: https://library.mercycorps.org/record/16929?ln=en]</a> for a description of outcome themes.<span>')}/>


                <CheckboxedMultiSelect 
                    options={outcomeThemesData}
                    placeholder={gettext("None Selected")}
                    className={`${formErrors.outcome_theme && "is-invalid"}`}
                    id="outcome_themes_multiselect"
                    disabled={readOnly}
                    value={commonFieldsInput.outcome_theme}
                    onChange={(e) => setCommonFieldsInput({...commonFieldsInput, outcome_theme: e})}
                />
                {
                    formErrors.outcome_theme &&
                        <span id="validation_id_outcome_theme" className="has-error">{formErrors.outcome_theme}</span>
                }
            </div>

        </fieldset>
    )
}

export { CommonFields };