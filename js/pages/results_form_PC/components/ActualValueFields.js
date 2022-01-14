import React, { useState, useEffect } from 'react';
import { HelpText } from '../components/HelpText.js'

const ActualValueFields = ({ disaggregationData, disaggregationArray, setDisaggregationData, formErrors, readOnly }) => {

    const [actualWithDouble, setActualWithDouble] = useState({})
    const [actualWithoutDouble, setActualWithoutDouble] = useState({})
    // console.log('disaggregationArray', disaggregationArray);
    // useEffect(() => {
    //     disaggregationArray.map(disagg => {
    //         if (disagg.disaggregation_type === "Actual with double counting") {
    //             console.log('with', disagg);
    //             setActualWithDouble(disagg);
    //         } else if (disagg.disaggregation_type === "Actual without double counting") {
    //             console.log('without', disagg);
    //             setActualWithoutDouble(disagg);
    //         }
    //     })
    // }, [])

    let handleDataEntry = (value, inputDisaggPk, inputLabelIndex) => {
        // console.log(actualWithDouble, actualWithoutDouble);
        let update = {...disaggregationData};
        update[inputDisaggPk].labels[inputLabelIndex] = {...disaggregationData[inputDisaggPk].labels[inputLabelIndex], value: value};
        setDisaggregationData(update);
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
                            <div className="bin heading">{gettext("Without Double Counting")}</div>
                            <div className="bin heading">{gettext("With Double Counting")}</div>
                        </div>
                    </div>
                </li>

                <li className="list-group-item">
                    <div className="item__label">{gettext("Actual Direct value")}</div>
                    <div className="item__value--container">
                        <input 
                            type="number" 
                            className="bin form-control input-value"
                            // name={`${actualWithDouble.disaggregation_type}_${actualWithDouble.count_type}_doubleCounting-${actualWithDouble.double_counting}`}
                            // name={`id_${actualWithDouble.disaggregation_type}_${actualWithDouble.count_type}_doubleCounting-${actualWithDouble.double_counting}`}
                            name={`${disaggregationData["652"].disaggregation_type}-${disaggregationData["652"].labels[0]}`}
                            id={`id_${disaggregationData["652"].disaggregation_type}-${disaggregationData["652"].labels[0]}`}
                            disabled={readOnly}
                            value={disaggregationData["652"].labels[0].value || ""}
                            value={disaggregationData["652"].labels[0].value || ""}
                            onChange={(e) => handleDataEntry(e.target.value, 652, 0)}
                        />
                        <input 
                            type="number" 
                            className="bin form-control input-value" 
                            name={`${disaggregationData["653"].disaggregation_type}-${disaggregationData["653"].labels[0]}`}
                            id={`id_${disaggregationData["653"].disaggregation_type}-${disaggregationData["653"].labels[0]}`}
                            disabled={readOnly}
                            value={disaggregationData["653"].labels[0].value || ""}
                            onChange={(e) => handleDataEntry(e.target.value, 653, 0)}

                        />
                    </div>
                </li>

                <li className="list-group-item">
                    <div className="item__label">{gettext("Actual Indirect value")}</div>
                    <div className="item__value--container">
                        <input 
                            type="number" 
                            className="bin form-control input-value" 
                            name={`${disaggregationData["652"].disaggregation_type}-${disaggregationData["652"].labels[1]}`}
                            id={`id_${disaggregationData["652"].disaggregation_type}-${disaggregationData["652"].labels[1]}`}
                            disabled={readOnly}
                            value={disaggregationData["652"].labels[1].value || ""}
                            onChange={(e) => handleDataEntry(e.target.value, 652, 1)}
                        />
                        <input 
                            type="number" 
                            className="bin form-control input-value" 
                            name={`${disaggregationData["653"].disaggregation_type}-${disaggregationData["653"].labels[1]}`}
                            id={`id_${disaggregationData["653"].disaggregation_type}-${disaggregationData["653"].labels[1]}`}
                            disabled={readOnly}
                            value={disaggregationData["653"].labels[1].value || ""}
                            onChange={(e) => handleDataEntry(e.target.value, 653, 1)}
                        />
                    </div>
                </li>

                <li className="list-group-item reference-row">
                    <div className="item__label">{gettext("Actual Total value")}</div>
                    <div className="item__value--container">
                        <div className="bin">{parseInt(disaggregationData['652'].labels[0].value || 0) + parseInt(disaggregationData['652'].labels[1].value || 0)}</div>
                        <div className="bin">{parseInt(disaggregationData['653'].labels[0].value || 0) + parseInt(disaggregationData['653'].labels[1].value || 0)}</div>
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