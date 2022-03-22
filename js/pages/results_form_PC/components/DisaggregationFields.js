import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HelpText } from '../components/HelpText.js'

const DisaggregationFields = ({ formID, disagg, disaggregationData, setDisaggregationData, formErrors, setFormErrors, handleSADDActualsValidation, readOnly, setWasUpdated }) => {
    // Helptext Data
    const helptext = {
        ["SADD (including unknown) without double counting"]: gettext("Only include SADD for Direct participants."),
        ["Sectors Direct with double counting"]: gettext("Provide a disaggregation of participants reached by sector. Only provide the figure with double counting. Refer to MEL Tip Sheet: Guidelines on Counting and Reporting Participant Numbers <a href='https://library.mercycorps.org/record/16929?ln=en' target='_blank'>[link: https://library.mercycorps.org/record/16929?ln=en]</a> for a description of sectors."),
        ["Sectors Indirect with double counting"]: gettext("Provide a disaggregation of participants reached by sector. Only provide the figure with double counting. Refer to MEL Tip Sheet: Guidelines on Counting and Reporting Participant Numbers <a href='https://library.mercycorps.org/record/16929?ln=en' target='_blank'>[link: https://library.mercycorps.org/record/16929?ln=en]</a> for a description of sectors."),
    };

    // On Mount, add listener to set state for expanding and collapsing
    const [expanded, setExpanded] = useState(false);
    useEffect(() => {
        $(`#${formID}-${disagg[0].pk}`).on('show.bs.collapse', function() {
            setExpanded(true);
        })
        $(`#${formID}-${disagg[0].pk}`).on('hide.bs.collapse', function() {
            setExpanded(false);
        })
    }, [])

    // Method use to find the Actual Direct and Indirect values with and without double counting
    let totals = disagg.reduce((labelsArr, currentDisaggregation) => {
        let totalDisagg = Object.keys(disaggregationData).filter(currentDisagg => {
            return disaggregationData[currentDisagg].disaggregation_type.includes("Actual") &&
                disaggregationData[currentDisagg].double_counting === currentDisaggregation.double_counting;
        })
        let sumVal = disaggregationData[totalDisagg[0]].labels.filter(labelObj => labelObj.label === currentDisaggregation.count_type)[0];
        labelsArr.push(sumVal);
        return labelsArr;
    }, []);

    // Method to save data entry
    let handleDataEntry = (value, inputDisaggType, customsort) => {
        setWasUpdated(true);
        let update = {...disaggregationData};
        update[inputDisaggType].labels[customsort - 1] = {...disaggregationData[inputDisaggType].labels[customsort - 1], value: value};
        setDisaggregationData(update);
    }

    // Method to validate inputs
    let handleValidation = (inputDisaggType, customsort) => {
        let detectedErrors = {...formErrors};

        if (inputDisaggType.includes("SADD")) {
            let validSADD = true;
            // Validate SADD without values are less than or equal to SADD with values
            disaggregationData["SADD (including unknown) with double counting"].labels.map((label, i) => {
                let SADDWithValue = parseInt(disaggregationData["SADD (including unknown) without double counting"].labels[i].value || 0);
                let SADDWithoutValue = parseInt(disaggregationData["SADD (including unknown) with double counting"].labels[i].value || 0);
                if (SADDWithValue > SADDWithoutValue) {
                    validSADD = false;
                    detectedErrors = {...detectedErrors, [disaggregationData["SADD (including unknown) without double counting"].disaggregation_type]: gettext("The 'SADD without double counting' value should be less than or equal to the 'Direct without double counting' value.")};
                }
            })
            validSADD ? delete detectedErrors[disaggregationData["SADD (including unknown) without double counting"].disaggregation_type] : null;
            setFormErrors(detectedErrors);
            handleSADDActualsValidation(detectedErrors, validSADD);
        }

        if (inputDisaggType.includes("Sectors")) {
            let validSectors = true;
            let participantType = disaggregationData[inputDisaggType].count_type;

            disaggregationData[inputDisaggType].labels.map((label, i) => {
                let labelValue = parseInt(label.value || 0),
                    totalValue = parseInt(disaggregationData["Actual with double counting"].labels.filter((labelObj) => labelObj.label === participantType)[0].value || 0);
                if (labelValue > totalValue) {
                    validSectors = false;
                    detectedErrors = {...detectedErrors, [inputDisaggType]: gettext("Sector values should be less than or equal to the 'Direct/Indirect with double counting' value.")}
                }
            })
            validSectors ? delete detectedErrors[inputDisaggType] : null;
            setFormErrors(detectedErrors);
        }
    }
    return (
        <fieldset>
            <ul className="list-group form-list-group">
                <li className="list-group-item heading-row">
                    <div className="item__value--header">
                        <a className="item__label--accordion accordion-header collapsed" data-toggle="collapse" href={`#${formID}-${disagg[0].pk}`} aria-expanded={expanded} aria-controls={`#${formID}-${disagg[0].pk}`}>
                            <FontAwesomeIcon icon={ expanded ? 'caret-down' : 'caret-right' } />&nbsp;
                            {disagg[0].disaggregation_type.includes("SADD") ?
                                <label className="label--required">{gettext("SADD (including unknown)")}</label>
                            :
                                <label className="label">{gettext(disagg[0].disaggregation_type)}</label>
                            }
                        </a>

                        <HelpText text={helptext[disagg[0].disaggregation_type]}/>
                        {!expanded && formErrors[disagg[0].disaggregation_type] &&
                            <span className="needs-attention"><i className="fas fa-exclamation-triangle"></i>{gettext("Needs Attention")}</span>
                        }

                        <div className="item__value--container" style={{display: expanded ? "inherit" : "none"}}>
                            {disagg.length !== 1 &&
                                <div className="bin heading">{gettext("Without double counting across programs")}</div>
                            }
                            <div className="bin heading">{gettext("With double counting across programs")}</div>
                        </div>
                    </div>
                </li>
            </ul>
            <ul className="list-group form-list-group collapse" id={`${formID}-${disagg[0].pk}`}>
                {
                    disagg[0].labels.map((labelObj) => {
                        return (
                            <li key={`${disagg[0].pk}-${labelObj.customsort}`} className="list-group-item">
                                <div className="item__label">{gettext(labelObj.label)}</div>
                                <div className="item__value--container">
                                    {
                                        disagg.map((currentDisagg, i) => {
                                            return (
                                                <input
                                                    key={`id_${disagg[i].pk}-${labelObj.customsort}`}
                                                    id={`id_${disagg[i].pk}-${labelObj.customsort}`}
                                                    name={`${disagg[i].pk}-${labelObj.customsort}`}
                                                    type="number"
                                                    className="bin form-control input-value"
                                                    disabled={readOnly}
                                                    value={Math.round(disaggregationData[currentDisagg.disaggregation_type].labels[labelObj.customsort - 1].value) || ""}
                                                    onChange={(e) => handleDataEntry(e.target.value, currentDisagg.disaggregation_type, labelObj.customsort)}
                                                    onBlur={() => handleValidation(currentDisagg.disaggregation_type, labelObj.customsort)}
                                                />
                                            )
                                        })
                                    }
                                </div>
                            </li>
                        )
                    })
                }

                <li className="list-group-item sum-row">
                    <div className="item__label">{gettext("Sum")}</div>
                    <div className="item__value--container">
                        {
                            disagg.map(currentDisagg => {
                                return (
                                    <div key={currentDisagg.pk} className="bin">{disaggregationData[currentDisagg.disaggregation_type].labels.reduce((sum, label) => {
                                        sum+= parseInt(label.value) || 0;
                                        return sum}, 0)}
                                    </div>
                                )
                            })
                        }
                    </div>
                </li>

                <li className="list-group-item reference-row">
                    {totals[0].label === "Direct" ? <div className="item__label">{gettext("Total Direct Participants")}</div> : <div className="item__label">{gettext("Total Indirect Participants")}</div>}
                    <div className="item__value--container">
                        {
                            disagg.map((currentDisagg, i) => {
                                return (
                                    <div key={i} className="bin">{parseInt(totals[i].value || 0)}</div>
                                )
                            })
                        }
                    </div>
                </li>
                {formErrors[disagg[0].disaggregation_type] &&
                        <span id={disagg[0].disaggregation_type.includes("SADD") ? `validation_id_SADD--pc` : `validation_id_${disagg[0].disaggregation_type.replaceAll(" ", "-")}--pc`} className="has-error">{formErrors[disagg[0].disaggregation_type]}</span>
                }
            </ul>
        </fieldset>
    )
}

export { DisaggregationFields };
