import React, { useState, useEffect } from 'react';
import { CommonFields } from './components/CommonFields.js';
import { ActualValueFields } from './components/ActualValueFields.js';
import { EvidenceFields } from './components/EvidenceFields.js';
import { DisaggregationFields } from './components/DisaggregationFields.js'
import api from '../../apiv2';


const PCResultsForm = ({indicatorID="", resultID="", readOnly, formType}) => {
    // Helper Methods
    let handleReceivedDisaggregations = (disaggregations_data) => {
        return disaggregations_data.reduce((disaggObj, disagg, i) => {
            disaggObj[disagg.disaggregation_type] = {...disagg, sort_order: i, };
            disagg.disaggregation_type.includes('without') ? disaggObj[disagg.disaggregation_type] = {...disaggObj[disagg.disaggregation_type], double_counting: false} : disaggObj[disagg.disaggregation_type] = {...disaggObj[disagg.disaggregation_type], double_counting: true};
            disagg.disaggregation_type.includes('Indirect') ? disaggObj[disagg.disaggregation_type] = {...disaggObj[disagg.disaggregation_type], count_type: "Indirect"} : disaggObj[disagg.disaggregation_type] = {...disaggObj[disagg.disaggregation_type], count_type: "Direct"};
            return disaggObj;
        }, {});
    }

    let formatOutcomeThemsData = (outcomeThemes) => {
       return outcomeThemes.reduce((themesArray, theme, i) => {
            themesArray[i] = {value: i, label: theme[1]};
            return themesArray;
        }, [])
    }

    let handleDataArray = (dataArray) => {
        return dataArray.reduce((arr, currentDisagg, i) => {
            currentDisagg.disaggregation_type.includes('without') ? arr[i] = {...currentDisagg, double_counting: false} : arr[i] = {...currentDisagg, double_counting: true};
            currentDisagg.disaggregation_type.includes('Indirect') ? arr[i] = {...arr[i], count_type: "Indirect"} : arr[i] = {...arr[i], count_type: "Direct"};
            return arr;
        }, []);
    }

    // Form Validations
    let validateForm = () => {
        let detectedErrors = {};

        let maxDate = formatDate(localdate()) < commonFieldsInput.program_end_date ? formatDate(localdate()) : commonFieldsInput.program_end_date;
        if (!commonFieldsInput.date_collected || commonFieldsInput.date_collected === "" || commonFieldsInput.date_collected < commonFieldsInput.program_start_date || commonFieldsInput.date_collected > maxDate) {
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

    // State Variables
    const [outcomeThemesData, setOutcomeThemesData] = useState([]);
    const [disaggregationData, setDisaggregationData] = useState([]);
    const [disaggregationArray, setDisaggregationArray] = useState([]);
    const [evidenceFieldsInput, setEvidenceFieldsInput] = useState({});
    const [commonFieldsInput, setCommonFieldsInput] = useState({});
    const [formErrors, setFormErrors] = useState({});
    
    // On Mounting of the results form modal
    useEffect(() => {
        $(`#resultModal_${indicatorID || resultID}`).on('shown.bs.modal', function () {
            $(`#resultModal_${indicatorID || resultID}`).on('hidden.bs.modal', function () {
                setDisaggregationArray([])
                setDisaggregationData([])
                setCommonFieldsInput({})
                setEvidenceFieldsInput({})
                setOutcomeThemesData([])
                setFormErrors({})
            })
            $(document).on("keyup", function(event) {
                if(event.key === 'Escape') {
                    $(`#resultModal_${indicatorID || resultID}`).modal('hide');
                }
            })
            api.getPCountResultsData(indicatorID || resultID, formType)
                .then(response => {
                    console.log("Form received data!", response);
                    let commonFields = {};
                    let evidenceFields = {};
                    Object.keys(response).map(dataType => {
                        dataType === "outcome_themes" && setOutcomeThemesData(formatOutcomeThemsData(response[dataType]));
                        dataType === "disaggregations" && setDisaggregationData(handleReceivedDisaggregations(response[dataType]));
                        dataType === "disaggregations" && setDisaggregationArray(handleDataArray(response[dataType]));
                        ["periodic_target", "program_end_date", "program_start_date", "date_collected"].indexOf(dataType) >= 0 ? commonFields = {...commonFields, [dataType]: response[dataType]} : null;
                        ["evidence_url", "record_name"].indexOf(dataType) >= 0 ? {...evidenceFields, [dataType]: response[dataType]} : null;
                    })
                    setCommonFieldsInput(commonFields);
                    setEvidenceFieldsInput(evidenceFields);
                })
        })
    }, [])

    // On Submission of the results form modal
    let handleSubmit = (e) => {
        e.preventDefault();
        // if ( validateForm() ) {
            let data = {};
            data = indicatorID ? {...data, indicator: indicatorID} : {...data, result: resultID};
            data = {...data, ...commonFieldsInput, ...evidenceFieldsInput, disaggregations: Object.values(disaggregationData)};
            data['outcome_theme'] = data['outcome_theme'].map((theme) => theme.value)
            data['periodic_target'] = data['periodic_target']['id']
            console.log("Submit Data", data);
            if (indicatorID) {
                api.createPCountResult(indicatorID, data)
                    .then(response => {
                        console.log("Saved Form Data!", response);
                        if (response.status === 200) {
                            $(`#resultModal_${indicatorID || resultID}`).modal('hide');
                        }
                        // TODO: Add action after the form is sent
                    })
            } else {
                api.updatePCountResult(resultID, data)
                    .then(response => {
                        if (response.status === 200) {
                            $(`#resultModal_${indicatorID || resultID}`).modal('hide');
                        }
                        console.log("Updated Form Data!", response);
                        // TODO: Add action after the form is sent
                    })
            }
        // }
    }

    if (Object.keys(disaggregationData).length > 0) {
        return (
            <div style={{textAlign: "left"}}>
                <h2>
                    {gettext('Result')}
                </h2>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <h3 className="no-bold indicator_name">
                    {gettext('Participant Count')}
                </h3>

                {Object.keys(commonFieldsInput).length > 0 &&
                    <CommonFields
                        commonFieldsInput={commonFieldsInput}
                        setCommonFieldsInput={setCommonFieldsInput}
                        outcomeThemesData={outcomeThemesData}
                        formErrors={formErrors}
                        setFormErrors={setFormErrors}
                        readOnly={readOnly}
                    />
                }

                <ActualValueFields
                    disaggregationData={disaggregationData}
                    setDisaggregationData={setDisaggregationData}
                    formErrors={formErrors}
                    readOnly={readOnly}
                />
                {
                    Object.keys(disaggregationData).map((disagg) => {
                        let disaggs = [];
                        if (disaggregationData[disagg].disaggregation_type.includes('SADD') && disaggregationData[disagg].double_counting === true) {
                            disaggs = Object.keys(disaggregationData).reduce((arrSADD, currentDisagg) => {
                                if (disaggregationData[currentDisagg].disaggregation_type.includes("SADD")) {
                                    arrSADD.push(disaggregationData[currentDisagg]);
                                }
                                return arrSADD;
                            }, []);
                        } else if (disaggregationData[disagg].disaggregation_type.includes('Sectors')) {
                            disaggs = [disaggregationData[disagg]]
                        } else { return; }

                        return (
                            <DisaggregationFields
                                key={disaggregationData[disagg].disaggregation_type}
                                disagg={disaggs}
                                formID={indicatorID || resultID}
                                readOnly={readOnly}
                                formErrors={formErrors}
                                disaggregationData={disaggregationData}
                                setDisaggregationData={setDisaggregationData}
                            />
                        )
                    })
                }
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
