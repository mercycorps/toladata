import React, { useState, useEffect } from 'react';
import CheckboxedMultiSelect from 'components/checkboxed-multi-select';
import { HelpText } from '../components/HelpText.js'


const CommonFields = ({ commonFieldsInput, setCommonFieldsInput, outcomeThemesData, formErrors, readOnly }) => {

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
                />
                {
                    formErrors.date_collected &&
                        <span id="validation_id_date_collected" className="has-error">{formErrors.date_collected}</span>
                }
            </div>

            <div className="form-group" id="div_id_fiscal_year">
                <label htmlFor="id_fiscal_year" className="label--required">{gettext('Fiscal year')}</label>

                <HelpText text={gettext('Fiscal years run from July 1 to June 30 of the following year.')}/>

                <input 
                    type="text" 
                    name="fiscal_year" 
                    id="id_fiscal_year" 
                    className="form-control" 
                    required autoComplete="off" 
                    disabled
                    value={commonFieldsInput.fiscal_year}
                    onChange={(e) => setCommonFieldsInput({...commonFieldsInput, [e.target.name]: e.target.value})}
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