import React, { useState, useEffect } from 'react';
import { CommonFields } from './components/CommonFields.js';
import { ActualValueFields } from './components/ActualValueFields.js';
import { EvidenceFields } from './components/EvidenceFields.js';
import { DisaggregationFields } from './components/DisaggregationFields.js'
import api from '../../apiv2';


const PCResultsForm = ({indicatorID="", resultID="", readOnly}) => {
    // Helper Methods
    let handleReceivedDisaggregations = (disaggregations_data) => {
        return disaggregations_data.reduce((disaggObj, disagg, i) => {
            disaggObj[disagg.disaggregation_type] = {...disagg, sort_order: i, };
            disagg.disaggregation_type.includes('without') ? disaggObj[disagg.disaggregation_type] = {...disaggObj[disagg.disaggregation_type], double_counting: false} : disaggObj[disagg.disaggregation_type] = {...disaggObj[disagg.disaggregation_type], double_counting: true};
            disagg.disaggregation_type.includes('Indirect') ? disaggObj[disagg.disaggregation_type] = {...disaggObj[disagg.disaggregation_type], count_type: "Indirect"} : disaggObj[disagg.disaggregation_type] = {...disaggObj[disagg.disaggregation_type], count_type: "Direct"};
            return disaggObj;
        }, {});
    }

    let formatOutcomeThemesData = (outcomeThemes) => {
       return outcomeThemes.reduce((themesArray, theme, i) => {
            themesArray[i] = {value: theme[0], label: theme[1]};
            return themesArray;
        }, [])
    }

    let formatSelectedOutcomeThemes = (outcomeThemes) => {
       return outcomeThemes.reduce((themesArray, theme, i) => {
           if (theme[2]) {
               themesArray[i] = {value: theme[0], label: theme[1]};
           }
            return themesArray;
        }, [])
    }

    // Form Validations
    let validateForm = () => {
        let detectedErrors = {};

        // Common Fields Validation
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

        // Actual Fields Validation
        let actualsValid = true;
        if (!disaggregationData['Actual with double counting'].labels[0].value || !disaggregationData['Actual with double counting'].labels[1].value) {
            console.log("1");
            actualsValid = false;
            detectedErrors = {...detectedErrors, totals_error: gettext("Direct/indirect total participants with double counting is required. Please complete these fields.")}
        };

        disaggregationData['Actual with double counting'].labels.map((label, i) => {
            if (disaggregationData['Actual without double counting'].labels[i].value) {
                if ( parseInt(disaggregationData['Actual without double counting'].labels[i].value) > parseInt(disaggregationData['Actual with double counting'].labels[i].value) ) {
                    actualsValid = false;
                    detectedErrors = {...detectedErrors, totals_error: gettext("Direct/indirect without double counting should be equal or lower than Direct/indirect with double counting.")}
                }
            }
        })
        actualsValid ? delete detectedErrors.totals_error : null;

        // Disaggregation Fields Validation
        // let sumSADDwithout = disaggregationData["648"].labels.reduce((sum, label) => {
        //     sum+= parseInt(label.value) || 0;
        //     return sum}, 0);
        // if (parseInt(sumSADDwithout) !== parseInt(disaggregationData["652"].labels[0].value || 0)) {
        //     detectedErrors = {...detectedErrors, "649-648": gettext("The sum of 'SADD without double counting' should be equal to the sum of 'Direct without double counting'.")}
        // };
        // let sumSADDwith = disaggregationData["649"].labels.reduce((sum, label) => {
        //     sum+= parseInt(label.value) || 0;
        //     return sum}, 0);
        // if (parseInt(sumSADDwith) !== parseInt(disaggregationData["653"].labels[0].value || 0)) {
        //     detectedErrors = {...detectedErrors, "649-648": gettext("The sum of 'SADD with double counting' should be equal to the sum of 'Direct with double counting'.")}
        // };

        // Evidence Fields Validation
        let evidenceURL = evidenceFieldsInput.evidence_url || "";
        let recordName = evidenceFieldsInput.record_name || "";

        if(evidenceURL.length > 0) {
            if (!evidenceURL.match(/^(http(s)?|file):\/\/.+/)) {
                detectedErrors = {...detectedErrors, evidence_url: gettext("Please enter a valid evidence link.")}
            } else if (!recordName.length > 0) {
                detectedErrors = {...detectedErrors, record_name: gettext("A record name must be included along with the link.")}
            }
        } else if (recordName.length > 0) {
            detectedErrors = {...detectedErrors, evidence_url: gettext("A link must be included along with the record name.")}
        } else {
            delete detectedErrors.evidence_url;
            delete detectedErrors.record_name
        }
        

        setFormErrors(detectedErrors);
        return Object.keys(detectedErrors).length === 0 ? true: false;
    }

    // State Variables
    let formID = indicatorID ? indicatorID : resultID;
    const [outcomeThemesData, setOutcomeThemesData] = useState([]);
    const [disaggregationData, setDisaggregationData] = useState([]);
    const [evidenceFieldsInput, setEvidenceFieldsInput] = useState({});
    const [commonFieldsInput, setCommonFieldsInput] = useState({});
    const [formErrors, setFormErrors] = useState({});

    // On Mounting of the results form modal
    useEffect(() => {

        $(`#resultModal_${resultID || indicatorID}`).on('shown.bs.modal', function () {
            $(`#resultModal_${resultID || indicatorID}`).on('hidden.bs.modal', function () {
                setDisaggregationData([])
                setCommonFieldsInput({})
                setEvidenceFieldsInput({})
                setOutcomeThemesData([])
                setFormErrors({})
            })
            $(document).on("keyup", function(event) {
                if(event.key === 'Escape') {
                    $(`#resultModal_${resultID || indicatorID}`).modal('hide');
                }
            })
            if (indicatorID) {
                api.getPCountResultCreateData(indicatorID)
                    .then(response => {
                        console.log("Form received data!", response);
                        setOutcomeThemesData(formatOutcomeThemesData(response.outcome_themes));
                        setDisaggregationData(handleReceivedDisaggregations(response.disaggregations));
                        setCommonFieldsInput({
                            program_start_date: response.program_start_date,
                            program_end_date: response.program_end_date,
                            periodic_target: response.periodic_target
                        });
                    })
            } else {
                api.getPCountResultUpdateData(resultID)
                .then(response => {
                    console.log("Form received data!", response);
                    setOutcomeThemesData(formatOutcomeThemesData(response.outcome_themes));
                    setDisaggregationData(handleReceivedDisaggregations(response.disaggregations));
                    setCommonFieldsInput({
                        periodic_target: response.periodic_target,
                        date_collected: response.date_collected,
                        outcome_theme: formatSelectedOutcomeThemes(response.outcome_themes),
                        program_start_date: response.program_start_date,
                        program_end_date: response.program_end_date,
                    });
                    setEvidenceFieldsInput({
                        evidence_url: response.evidence_url,
                        record_name: response.record_name
                    });
                })
            }
        })
    }, [])

    let send_update_request = (rationale) => {
        let data = prepare_sumbission_data();
        data['rationale'] = rationale;
        api.updatePCountResult(resultID, data)
            .then(response => {
                if (response.status === 200) {
                    console.log("Updated Form Data!", response);
                    window.location.reload();
                }

            })
    }

    let prepare_sumbission_data = () => {
        let data = [];
        data = {...data, indicator: indicatorID, ...commonFieldsInput, ...evidenceFieldsInput, disaggregations: Object.values(disaggregationData)};
        data['outcome_theme'] = data['outcome_theme'].map((theme) => theme.value).filter(ot => ot !== null)
        data['periodic_target'] = data['periodic_target']['id']
        return data
    }

    // On Submission of the results form
    let handleSubmit = (e) => {
        e.preventDefault();
        if ( validateForm() ) {

            if (indicatorID) {
                let data = prepare_sumbission_data();
                console.log("Submit create data", data);
                api.createPCountResult(indicatorID, data)
                    .then(response => {
                        console.log("Saved Form Data!", response);
                        if (response.status === 200) {
                            window.location.reload();
                        }
                    })
            } else {
                window.create_unified_changeset_notice({
                    header: gettext("Reason for change"),
                    show_icon: true,
                    // context: document.getElementById('modal_dialog'),
                    message_text: gettext("Your changes will be recorded in a change log.  For future reference, please share your reason for these changes."),
                    include_rationale: true,
                    rationale_required: true,
                    notice_type: 'notice',
                    on_submit: send_update_request,
                    // on_cancel: () => this.props.rootStore.uiStore.setDisableCardActions(false),
                });
            }
        }
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
                    setFormErrors={setFormErrors}
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
                    setFormErrors={setFormErrors}
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
