import React, { useState, useEffect } from 'react';
import { HelpText } from '../components/HelpText.js'

const ActualValueFields = ({ disaggregationData, setDisaggregationData, formErrors, setFormErrors, readOnly, handleSADDActualsValidation }) => {

    let handleDataEntry = (value, inputDisagg, inputLabelIndex) => {
        let update = {...disaggregationData};
        update[inputDisagg].labels[inputLabelIndex] = {...disaggregationData[inputDisagg].labels[inputLabelIndex], value: value};
        setDisaggregationData(update);
    }
    
    let handleValdiation = () => {
        let detectedErrors = {...formErrors};
        let valid = true;
        disaggregationData['Actual with double counting'].labels.map((label, i) => {
            if (disaggregationData['Actual without double counting'].labels[i].value &&
                parseInt(disaggregationData['Actual without double counting'].labels[i].value) > parseInt(disaggregationData['Actual with double counting'].labels[i].value) ) {
                    valid = false;
                    detectedErrors = ({...detectedErrors, totals_error: gettext("Direct/indirect without double counting should be equal or lower than Direct/indirect with double counting.")})
            }
        })
        valid ? delete detectedErrors.totals_error : null;
        setFormErrors(detectedErrors)
        handleSADDActualsValidation();
    }
    
    return (
        <fieldset>
            <ul className="list-group form-list-group">
                <li className="list-group-item heading-row">
                    <div className="item__value--header">
                        <div className="item__label">
                            <label className="label--required">{gettext('Total Participant Actual Values')}</label>

                            <HelpText 
                                text={gettext('Include the participants with double counting on the left and participants without double counting across programs on the right. If two programs share participants, only discount double counting in one program!<br/><br/><strong>Direct participants</strong> – are those who have received a tangible benefit from the program, either as the actual program participants or the intended recipients of the program benefits.<br/><br/><strong>Indirect participants</strong> – are those who received a tangible benefit through their proximity to or contact with program participants or activities.')}
                            />

                        </div>
                        <div className="item__value--container">
                            <div className="bin heading">{gettext("Without double counting")}</div>
                            <div className="bin heading">{gettext("With double counting")}</div>
                        </div>
                    </div>
                </li>

                <li className="list-group-item">
                    <div className="item__label">{gettext("Actual direct value")}</div>
                    <div className="item__value--container">
                        <input 
                            type="number" 
                            className="bin form-control input-value"
                            id="id_Actual-without-double-counting--Direct"
                            name="Actual-without-double-counting--Direct"
                            disabled={readOnly}
                            value={Math.round(disaggregationData["Actual without double counting"].labels[0].value) || ""}
                            onChange={(e) => handleDataEntry(e.target.value, "Actual without double counting", 0)}
                            onBlur={() => handleValdiation()}
                        />
                        <input 
                            type="number" 
                            className="bin form-control input-value"
                            id="id_Actual-with-double-counting--Direct"
                            name="Actual-with-double-counting--Direct"
                            disabled={readOnly}
                            value={Math.round(disaggregationData["Actual with double counting"].labels[0].value) || ""}
                            onChange={(e) => handleDataEntry(e.target.value, "Actual with double counting", 0)}
                            onBlur={() => handleValdiation()}

                        />
                    </div>
                </li>

                <li className="list-group-item">
                    <div className="item__label">{gettext("Actual indirect value")}</div>
                    <div className="item__value--container">
                        <input 
                            type="number" 
                            className="bin form-control input-value" 
                            id="id_Actual-without-double-counting--Indirect"
                            name="Actual-without-double-counting--Indirect"
                            disabled={readOnly}
                            value={Math.round(disaggregationData["Actual without double counting"].labels[1].value) || ""}
                            onChange={(e) => handleDataEntry(e.target.value, "Actual without double counting", 1)}
                            onBlur={() => handleValdiation()}
                        />
                        <input 
                            type="number" 
                            className="bin form-control input-value" 
                            id="id_Actual-with-double-counting--Indirect"
                            name="Actual-with-double-counting--Indirect"
                            disabled={readOnly}
                            value={Math.round(disaggregationData["Actual with double counting"].labels[1].value) || ""}
                            onChange={(e) => handleDataEntry(e.target.value, "Actual with double counting", 1)}
                            onBlur={() => handleValdiation()}
                        />
                    </div>
                </li>

                <li className="list-group-item reference-row">
                    <div className="item__label">{gettext("Actual total value")}</div>
                    <div className="item__value--container">
                        <div className="bin">{parseInt(disaggregationData["Actual without double counting"].labels[0].value || 0) + parseInt(disaggregationData["Actual without double counting"].labels[1].value || 0)}</div>
                        <div className="bin">{parseInt(disaggregationData["Actual with double counting"].labels[0].value || 0) + parseInt(disaggregationData["Actual with double counting"].labels[1].value || 0)}</div>
                    </div>
                </li>
                {
                    formErrors.totals_error &&
                        <span id={`validation_id_totals_error`} className="has-error">{formErrors.totals_error}</span>
                }
            </ul>
        </fieldset>
    )
}

export { ActualValueFields };