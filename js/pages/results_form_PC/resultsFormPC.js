import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CommonFields } from './components/CommonFields.js';
import { ActualValueFields } from './components/ActualValueFields.js';
import { EvidenceFields } from './components/EvidenceFields.js';
import { DisaggregationFields } from './components/DisaggregationFields.js'
import api from '../../apiv2';


const PCResultsForm = ({indicatorID="", resultID="", readOnly}) => {
    const helptext = {
        "649-648": gettext("Only include SADD for Direct participants."),
        650: gettext("Provide a disaggregation of participants reached by sector. Only provide the figure with double counting. Refer to MEL Tip Sheet: Guidelines on Counting and Reporting Participant Numbers <a href='https://library.mercycorps.org/record/16929?ln=en' target='_blank'>[link: https://library.mercycorps.org/record/16929?ln=en]</a> for a description of outcome themes."),
        651: gettext("Provide a disaggregation of participants reached by sector. Only provide the figure with double counting. Refer to MEL Tip Sheet: Guidelines on Counting and Reporting Participant Numbers <a href='https://library.mercycorps.org/record/16929?ln=en' target='_blank'>[link: https://library.mercycorps.org/record/16929?ln=en]</a> for a description of outcome themes."),
        652: gettext("Direct participants – are those who have received a tangible benefit from the program, either as the actual program participants or the intended recipients of the program benefits. Indirect participants – are those who received a tangible benefit through their proximity to or contact with program participants or activities."),
        653: gettext("Direct participants – are those who have received a tangible benefit from the program, either as the actual program participants or the intended recipients of the program benefits. Indirect participants – are those who received a tangible benefit through their proximity to or contact with program participants or activities."),
    };

    let handleReceivedDisaggregations = (disaggregations_data) => {
        return disaggregations_data.reduce((formated, disagg, i) => {
            formated[disagg.pk] = {...disagg, sort_order: i};
            return formated;
        }, {});
    }

    let formatOutcomeThemsData = (outcomeThemes) => {
       return outcomeThemes.reduce((themesArray, theme, i) => {
            themesArray[i] = {value: i, label: theme[1]};
            return themesArray;
        }, [])
    }

    let validateForm = () => {
        let detectedErrors = {};
        if (!commonFieldsInput.date_collected || commonFieldsInput.date_collected === "") {
            detectedErrors = {...detectedErrors, date_collected: gettext("This date should be within the fiscal year of the reporting period.")}
        };

        if (!commonFieldsInput.periodic_target || commonFieldsInput.periodic_target === "") {
            detectedErrors = {...detectedErrors, fiscal_year: gettext("You cannot change the fiscal year during the current reporting period. ")}
        };

        if (!commonFieldsInput.outcome_theme || commonFieldsInput.outcome_theme === []) {
            detectedErrors = {...detectedErrors, outcome_theme: gettext("Please complete this field. You can select more than one outcome theme.")}
        };

        let sumSADDwithout = disaggregationData["648"].labels.reduce((sum, label) => {
            sum+= parseInt(label.value) || 0;
            return sum}, 0);
        if (parseInt(sumSADDwithout) !== parseInt(disaggregationData["652"].labels[0].value || 0)) {
            detectedErrors = {...detectedErrors, "649-648": gettext("The sum of 'SADD without double counting' should be equal to the sum of 'Direct without double counting'.")}
        };
        let sumSADDwith = disaggregationData["649"].labels.reduce((sum, label) => {
            sum+= parseInt(label.value) || 0;
            return sum}, 0);
        if (parseInt(sumSADDwith) !== parseInt(disaggregationData["653"].labels[0].value || 0)) {
            detectedErrors = {...detectedErrors, "649-648": gettext("The sum of 'SADD with double counting' should be equal to the sum of 'Direct with double counting'.")}
        };

        if (!disaggregationData['653'].labels[0].value || !disaggregationData['653'].labels[1].value) {
            detectedErrors = {...detectedErrors, totals_error: gettext("Direct/indirect total participants with double counting is required. Please complete these fields.")}
        };

        if (
            parseInt(disaggregationData['652'].labels[0].value || 0) > parseInt(disaggregationData['653'].labels[0].value || 0) ||
            parseInt(disaggregationData['652'].labels[1].value || 0) > parseInt(disaggregationData['653'].labels[1].value || 0)
            ) {
                detectedErrors = {...detectedErrors, totals_error: gettext("Direct/indirect without double counting should be equal or lower than Direct/indirect with double counting.")}
        }

        if (evidenceFieldsInput.evidence_url ) {
            if (!evidenceFieldsInput.evidence_url.match(/^(http(s)?|file):\/\/.+/)) {
                detectedErrors = {...detectedErrors, evidence_url: gettext("Please enter a valid evidence link.")}
            }
        }

        setFormErrors(detectedErrors);
        return Object.keys(detectedErrors).length === 0 ? true: false;
    }

    let formatFields = (data) => {
        let formatedData = [];
        Object.keys(data).map(key => {
            formatedData.push({name: key, value: data[key]})
        })
        return formatedData;
    }

    let formatDisaggregations = () => {
        return Object.keys(disaggregationData).reduce((disaggArr, currentDisagg) => {
            disaggregationData[currentDisagg].labels.map((label, i) => {
                disaggArr.push({name: `disaggregation-formset-${disaggregationData[currentDisagg].pk}-${i}-label_pk`, value: label.value})
            })
            return disaggArr;
        }, []);
    }

    useEffect(() => {

        $(`#resultModal_${formID}`).on('shown.bs.modal', function () {
            $(`#resultModal_${formID}`).on('hidden.bs.modal', function () {
                setDisaggregationArray([])
                setDisaggregationData([])
                setCommonFieldsInput({})
                setEvidenceFieldsInput({})
                setOutcomeThemesData([])
                setFormErrors({})
            })

            $(document).on("keyup", function(event) {
                if(event.key === 'Escape') {
                    $(`#resultModal_${formID}`).modal('hide');
                }
            })
            if (indicatorID) {
                api.getPCountResultsData(indicatorID)
                    .then(response => {
                        console.log("Form received data!", response);
                        setOutcomeThemesData(formatOutcomeThemsData(response.outcome_themes));
                        setDisaggregationData(handleReceivedDisaggregations(response.disaggregations));
                        setDisaggregationArray(handleDataArray(response.disaggregations))
                        setCommonFieldsInput({program_start_date: response.program_start_date, program_end_date: response.program_end_date, periodic_target: response.periodic_target});
                        // setEvidenceFieldsInput();
                    })
            } else {
                // TODO get data using the resultID
                // api.getPCountResultsData(indicatorID)
                // .then(response => {
                //     console.log("Form received data!", response);
                //     setOutcomeThemesData(formatOutcomeThemsData(response.outcome_themes));
                //     setDisaggregationData(handleReceivedDisaggregations(response.disaggregations));
                //     setDisaggregationArray(handleDataArray(response.disaggregations))
                //     // TODO: Update the commonFieldInputs and EvidenceFieldInputs with received data for an UPDATE request
                //     setCommonFieldsInput({...commonFieldsInput, program_start_date: response.program_start_date, program_end_date: response.program_end_date});
                //     // setEvidenceFieldsInput();
                // })
            }
        })
    }, [])

    let handleDataArray = (dataArray) => {
        return dataArray.reduce((arr, currentDisagg, i) => {
            currentDisagg.disaggregation_type.includes('without') ? arr[i] = {...currentDisagg, double_counting: false} : arr[i] = {...currentDisagg, double_counting: true};
            currentDisagg.disaggregation_type.includes('Indirect') ? arr[i] = {...arr[i], count_type: "Indirect"} : arr[i] = {...arr[i], count_type: "Direct"};
            return arr;
        }, []);
    }

    let formID = indicatorID ? indicatorID : resultID;
    const [outcomeThemesData, setOutcomeThemesData] = useState([]);
    const [disaggregationData, setDisaggregationData] = useState([]);
    const [disaggregationArray, setDisaggregationArray] = useState([]);
    const [evidenceFieldsInput, setEvidenceFieldsInput] = useState({});
    const [commonFieldsInput, setCommonFieldsInput] = useState({}); // TODO: receive start, and end dates from GET request. Calculate fiscal year based on those dates.
    const [formErrors, setFormErrors] = useState({});

    let handleSubmit = (e) => {
        e.preventDefault();
        if ( validateForm() ) {

            let data = [];
            data = {...data, indicator: indicatorID, ...commonFieldsInput, ...evidenceFieldsInput, disaggregation: disaggregationData};
            let form_data = new FormData;
            Object.keys(data).map(key => {
                form_data.append(key, data[key]);
            })

            if (indicatorID) {
                api.createPCountResult(indicatorID, form_data)
                    .then(response => {
                        console.log("Saved Form Data!", response);
                        // TODO: Add action after the form is sent
                    })
                } else {
                api.updatePCountResult(resultID, form_data)
                    .then(response => {
                        console.log("Saved Form Data!", response);
                        // TODO: Add action after the form is sent
                    })
            }
        }

    }
    // if (Object.keys(disaggregationData).length > 0) {
    if (disaggregationArray.length > 0) {
        return (
            <div style={{textAlign: "left"}}>
                <h2>
                    {
                        gettext('Result')
                    }
                </h2>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <h3 className="no-bold indicator_name">
                    {
                        gettext('Participant Count')
                    }
                </h3>

                <CommonFields
                    commonFieldsInput={commonFieldsInput}
                    setCommonFieldsInput={setCommonFieldsInput}
                    outcomeThemesData={outcomeThemesData}
                    formErrors={formErrors}
                    setFormErrors={setFormErrors}
                    readOnly={readOnly}
                />

                <ActualValueFields
                    disaggregationData={disaggregationData}
                    disaggregationArray={disaggregationArray}
                    setDisaggregationData={setDisaggregationData}
                    formErrors={formErrors}
                    readOnly={readOnly}
                />
                {/* {console.log(disaggregationData, disaggregationArray)} */}
                {/* {
                    disaggregationArray.map(disagg => {
                        if (disagg.disaggregation_type === "Actual with double counting" || disagg.disaggregation_type === "Actual without double counting") {
                            return;
                        }else if (disagg.disaggregation_type.includes("SADD (including unknown)")) {
                            console.log(disagg.disaggregation_type);
                        } else {
                            console.log("else", disagg.disaggregation_type);
                        }
                    })
                } */}



                {/* <DisaggregationFields
                    disagg={[disaggregationData["649"],disaggregationData["648"]]}
                    total={[disaggregationData["652"].labels[0], disaggregationData["653"].labels[0]]}
                    title={"SADD (including unknown)"}
                    indicatorID={indicatorID}
                    readOnly={readOnly}
                    helptext={helptext}
                    formErrors={formErrors}
                    disaggregationData={disaggregationData}
                    setDisaggregationData={setDisaggregationData}
                /> */}
                {
                    disaggregationArray.map((disagg) => {
                        if (disagg.disaggregation_type.includes('SADD') && disagg.double_counting === true) {
                            let disaggsSADD = disaggregationArray.reduce((arrSADD, currentDisagg) => {
                                if (currentDisagg.disaggregation_type.includes("SADD")) {
                                    arrSADD.push(currentDisagg);
                                }
                                return arrSADD;
                            }, []);
                            return (
                                <DisaggregationFields
                                    key={disagg.disaggregation_type}
                                    disagg={disaggsSADD}
                                    total={[disaggregationData["652"].labels[0], disaggregationData["653"].labels[0]]}
                                    title={"SADD (including unknown)"}
                                    indicatorID={formID}
                                    readOnly={readOnly}
                                    helptext={helptext}
                                    formErrors={formErrors}
                                    disaggregationArray={disaggregationArray}
                                    disaggregationData={disaggregationData}
                                    setDisaggregationData={setDisaggregationData}
                                />
                            )
                        }
                        if (disagg.disaggregation_type.includes('Sectors')) {
                            return (
                                <DisaggregationFields
                                    key={disagg.disaggregation_type}
                                    disagg={[disagg]}
                                    total={[disaggregationData["653"].labels[0]]}
                                    indicatorID={formID}
                                    readOnly={readOnly}
                                    helptext={helptext}
                                    formErrors={formErrors}
                                    disaggregationArray={disaggregationArray}
                                    disaggregationData={disaggregationData}
                                    setDisaggregationData={setDisaggregationData}
                                />
                            )
                        }
                    })
                }
                {/* <DisaggregationFields
                    disagg={[disaggregationData["650"]]}
                    total={[disaggregationData["653"].labels[0]]}
                    indicatorID={indicatorID}
                    readOnly={readOnly}
                    helptext={helptext}
                    formErrors={formErrors}
                    disaggregationData={disaggregationData}
                    setDisaggregationData={setDisaggregationData}
                />
                <DisaggregationFields
                    disagg={[disaggregationData["651"]]}
                    total={[disaggregationData["653"].labels[1]]}
                    indicatorID={indicatorID}
                    readOnly={readOnly}
                    helptext={helptext}
                    formErrors={formErrors}
                    disaggregationData={disaggregationData}
                    setDisaggregationData={setDisaggregationData}
                /> */}

                <EvidenceFields
                    evidenceFieldsInput={evidenceFieldsInput}
                    setEvidenceFieldsInput={setEvidenceFieldsInput}
                    formErrors={formErrors}
                    readOnly={readOnly}
                />
                {!readOnly &&
                <div className="form-actions">
                    <div>
                        <button
                            type="button"
                            className="btn btn-primary result-group"
                            id="result-submit-create"
                            onClick={(e) => handleSubmit(e)}
                        >{gettext('Save and close')}
                        </button>
                        <button
                            type="button"
                            className="btn btn-reset result-group"
                            id="result-cancel-btn"
                            data-dismiss="modal"
                        >{gettext('Cancel')}
                        </button>
                    </div>
                </div>
                }
            </div>
        )
    } else {
        return (
            <React.Fragment></React.Fragment> //TODO: Add a waiting spinner/indicator will waiting for API response for data
        )
    }
}


export { PCResultsForm };
