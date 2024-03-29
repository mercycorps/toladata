import React, { useState, useEffect, useRef } from 'react';
import { CommonFields } from './components/CommonFields.js';
import { ActualValueFields } from './components/ActualValueFields.js';
import { EvidenceFields } from './components/EvidenceFields.js';
import { DisaggregationFields } from './components/DisaggregationFields.js';
import { DataLoading, ServerError } from '../../components/componentStatus.js';
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
        let sort_order = [1, 2, 3, 5, 4]; // Set the order to display the Outcome Themes in the dropdown.
        return outcomeThemes.reduce((themesArray, theme, i) => {
            themesArray[sort_order[i]] = {value: theme[0], label: gettext(theme[1])};
            return themesArray;
        }, [])
    }
    let formatSelectedOutcomeThemes = (outcomeThemes) => {
       return outcomeThemes.reduce((themesArray, theme, i) => {
           if (theme[2]) {
               themesArray[i] = {value: theme[0], label: gettext(theme[1])};
           }
            return themesArray;
        }, [])
    }
    let scrollToError = (errors) => {
        let firstError = Object.keys(errors)[0];
        if (firstError.includes("SADD")) firstError = 'SADD';
        setTimeout(() => {
            let el = document.querySelector(`#validation_id_${firstError.replaceAll(" ","-")}--pc`)
            if (el) {
                el.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        }, 1)
    }

    // Form Validations
    let handleSADDActualsValidation = (errors, valid = true) => {
        let detectedErrors = {...errors};
        let disaggValid = true;
        let actualWithDirect = disaggregationData["Actual with double counting"].labels[0].value || 0;
        let actualWithoutDirect = disaggregationData["Actual without double counting"].labels[0].value || 0;
        let SADDWithDirect = disaggregationData["SADD (including unknown) with double counting"].labels.reduce((sum, label) => {
            sum+= parseInt(label.value) || 0;
            return sum;
        }, 0);
        let SADDWithoutDirect = disaggregationData["SADD (including unknown) without double counting"].labels.reduce((sum, label) => {
            sum+= parseInt(label.value) || 0;
            return sum;
        }, 0);

        if (parseInt(SADDWithDirect) !== parseInt(actualWithDirect)) {
            disaggValid = false;
            detectedErrors = {...detectedErrors, [disaggregationData["SADD (including unknown) without double counting"].disaggregation_type]: gettext("The sum of 'SADD with double counting' should be equal to the sum of 'Direct with double counting'.")}
        } else if (parseInt(SADDWithoutDirect) !== parseInt(actualWithoutDirect)) {
            disaggValid = false;
            detectedErrors = {...detectedErrors, [disaggregationData["SADD (including unknown) without double counting"].disaggregation_type]: gettext("The sum of 'SADD without double counting' should be equal to the sum of 'Direct without double counting'.")}
        }
        disaggValid && valid ? delete detectedErrors[disaggregationData["SADD (including unknown) without double counting"].disaggregation_type] : null;
        setFormErrors(detectedErrors);
    }

    let validateForm = () => {
        let detectedErrors = {...formErrors};

        // Common Fields Validation
        let maxDate = formatDate(localdate()) < commonFieldsInput.program_end_date ? formatDate(localdate()) : commonFieldsInput.program_end_date;
        if (!commonFieldsInput.date_collected || commonFieldsInput.date_collected === "" || commonFieldsInput.date_collected < commonFieldsInput.program_start_date || commonFieldsInput.date_collected > maxDate) {
            detectedErrors = {...detectedErrors, date_collected: gettext("This date should be within the fiscal year of the reporting period.")};
        };

        if (!commonFieldsInput.periodic_target || Object.keys(commonFieldsInput.periodic_target).length === 0) {
            detectedErrors = {...detectedErrors, fiscal_year: gettext("You cannot change the fiscal year during the current reporting period.")};
        } else { delete detectedErrors.periodic_target };

        if (!commonFieldsInput.outcome_theme || commonFieldsInput.outcome_theme.length === 0) {
            detectedErrors = {...detectedErrors, outcome_theme: gettext("Please complete this field. You can select more than one outcome theme.")};
        } else { delete detectedErrors.outcome_theme };

        // Actual Fields Validation
        let actualsValid = true;
        if (!disaggregationData['Actual with double counting'].labels[0].value) {
            actualsValid = false;
            detectedErrors = {...detectedErrors, totals_error: gettext("Direct total participants with double counting is required. Please complete these fields.")};
        };
        disaggregationData['Actual with double counting'].labels.map((label, i) => {
            if (disaggregationData['Actual without double counting'].labels[i].value) {
                if ( parseInt(disaggregationData['Actual without double counting'].labels[i].value) > parseInt(disaggregationData['Actual with double counting'].labels[i].value || 0) ) {
                    actualsValid = false;
                    detectedErrors = {...detectedErrors, totals_error: gettext("Direct/indirect without double counting should be equal to or lower than direct/indirect with double counting.")};
                }
            }
        })
        actualsValid ? delete detectedErrors.totals_error : null;

        // Sectors Disaggregation Validation
        let validSectors = true;
        let sectors = Object.keys(disaggregationData).filter((disagg) => disaggregationData[disagg].disaggregation_type.includes("Sectors"));
        sectors.map(sectorDisagg => {
            disaggregationData[sectorDisagg].labels.map((label, i) => {
                let labelValue = parseInt(label.value || 0),
                    totalValue = parseInt(disaggregationData["Actual with double counting"].labels.filter((labelObj) => labelObj.label === disaggregationData[sectorDisagg].count_type)[0].value || 0);
                if (labelValue > totalValue) {
                    validSectors = false;
                    detectedErrors = {...detectedErrors, [sectorDisagg]: gettext("Sector values should be less than or equal to the 'Direct/Indirect with double counting' value.")}
                }
            })
            validSectors ? delete detectedErrors[sectorDisagg] : null;
        })

        // Evidence Fields Validation
        let evidenceURLValid = true,
            recordNameValid = true,
            evidenceURL = evidenceFieldsInput.evidence_url || "",
            recordName = evidenceFieldsInput.record_name || "";

        if(evidenceURL.length > 0) {
            if (!evidenceURL.match(/^(http(s)?|file):\/\/.+/)) {
                evidenceURLValid = false;
                detectedErrors = {...detectedErrors, evidence_url: gettext("Please enter a valid evidence link.")};
            } else if (!recordName.length > 0) {
                recordNameValid = false;
                detectedErrors = {...detectedErrors, record_name: gettext("A record name must be included along with the link.")};
            }
        } else if (recordName.length > 0) {
            evidenceURLValid = false;
            detectedErrors = {...detectedErrors, evidence_url: gettext("A link must be included along with the record name.")};
        }
        evidenceURLValid ? delete detectedErrors.evidence_url: null;
        recordNameValid ? delete detectedErrors.record_name: null;

        setFormErrors(detectedErrors);

        if (Object.keys(detectedErrors).length === 0) {
            return true;
        } else {
            scrollToError(detectedErrors)
            return false;
        }
    }

    // State Variables
    let outcomeThemesData = useRef([]);
    const [status, setStatus] = useState('loading');
    const [wasUpdated, setWasUpdated] = useState(false);
    const [disableForm, setDisableForm] = useState(readOnly);
    const [disaggregationData, setDisaggregationData] = useState([]);
    const [evidenceFieldsInput, setEvidenceFieldsInput] = useState({});
    const [commonFieldsInput, setCommonFieldsInput] = useState({});
    const [formErrors, setFormErrors] = useState({});

    // On Mounting of the results form modal
    useEffect(() => {

        $(`#resultModal_${resultID || indicatorID}`).on('shown.bs.modal', function () {
            $(`#resultModal_${resultID || indicatorID}`).on('hidden.bs.modal', function () {
                setDisaggregationData([]);
                setCommonFieldsInput({});
                setEvidenceFieldsInput({});
                outcomeThemesData.current = [];
                setFormErrors({});
                setStatus("loading");
            })
            $(document).on("keyup", function(event) {
                if(event.key === 'Escape') {
                    $(`#resultModal_${resultID || indicatorID}`).modal('hide');
                }
            })
            // Prevent forever spinner froma api failure
            let errorTimeout = setTimeout(() => {
                $(`#resultModal_${resultID || indicatorID}`).modal('hide');
            }, 60000);

            if (indicatorID) {
                api.getPCountResultCreateData(indicatorID)
                    .then(response => {
                        if (response.status === 200) {
                            outcomeThemesData.current = formatOutcomeThemesData(response.data.outcome_themes);
                            setDisaggregationData(handleReceivedDisaggregations(response.data.disaggregations));
                            setCommonFieldsInput({
                                program_start_date: response.data.program_start_date,
                                program_end_date: response.data.program_end_date,
                                periodic_target: response.data.periodic_target,
                                pt_end_date: response.data.pt_end_date,
                                pt_start_date: response.data.pt_start_date,
                            });
                            clearTimeout(errorTimeout);
                            setStatus('ready');
                        } else {
                            clearTimeout(errorTimeout);
                            setStatus('error');
                        }
                    })
            } else {
                api.getPCountResultUpdateData(resultID)
                    .then(response => {
                        if (response.status === 200) {
                            outcomeThemesData.current = formatOutcomeThemesData(response.data.outcome_themes);
                            setDisaggregationData(handleReceivedDisaggregations(response.data.disaggregations));
                            setCommonFieldsInput({
                                periodic_target: response.data.periodic_target,
                                date_collected: response.data.date_collected,
                                outcome_theme: formatSelectedOutcomeThemes(response.data.outcome_themes),
                                program_start_date: response.data.program_start_date,
                                program_end_date: response.data.program_end_date,
                                pt_end_date: response.data.pt_end_date,
                                pt_start_date: response.data.pt_start_date,
                            });
                            setEvidenceFieldsInput({
                                evidence_url: response.data.evidence_url,
                                record_name: response.data.record_name
                            });
                            clearTimeout(errorTimeout);
                            setDisableForm(readOnly || response.data.view_only);
                            setStatus('ready');
                        } else {
                            clearTimeout(errorTimeout);
                            setStatus('error');
                        }
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
                    window.location.reload();
                } else {
                    setStatus("error");
                    setDisableForm(readOnly);
                }
            })
    }

    let prepare_sumbission_data = () => {
        let data = [];
        data = {...data, indicator: indicatorID, ...commonFieldsInput, ...evidenceFieldsInput, disaggregations: Object.values(disaggregationData)};
        data['outcome_theme'] = data['outcome_theme'].map((theme) => theme.value).filter(ot => ot !== null);
        data['periodic_target'] = data['periodic_target']['id'];
        return data;
    }

    // On Submission of the results form
    let handleSubmit = (e) => {
        e.preventDefault();
        if ( validateForm() ) {
            if (indicatorID) {
                let data = prepare_sumbission_data();
                api.createPCountResult(indicatorID, data)
                    .then(response => {
                        if (response.status === 200) {
                            window.location.reload();
                        } else {
                            setStatus("error");
                            setDisableForm(readOnly);
                        }
                    })
            } else if (wasUpdated) {
                window.create_unified_changeset_notice({
                    header: gettext("Reason for change"),
                    show_icon: true,
                    context: document.getElementById('pc-result-modal-form'),
                    message_text: gettext("Your changes will be recorded in a change log.  For future reference, please share your reason for these changes."),
                    include_rationale: true,
                    rationale_required: true,
                    notice_type: 'notice',
                    on_submit: send_update_request,
                    on_cancel: () => setDisableForm(readOnly),
                });
            } else {
                $(`#resultModal_${resultID || indicatorID}`).modal('hide');
            }
        } else {setDisableForm(readOnly);}
    }

    if (Object.keys(disaggregationData).length > 0 && status === 'ready') {
        return (
            <div id="pc-result-modal-form">
                <div>
                    <div className="result-form__heading--pc">
                        <h2>
                            {gettext('Result')}
                        </h2>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <h3 className="no-bold indicator_name">
                        {gettext('Participant Count')}
                    </h3>

                    {Object.keys(commonFieldsInput).length > 0 &&
                        <CommonFields
                            commonFieldsInput={commonFieldsInput}
                            setCommonFieldsInput={setCommonFieldsInput}
                            outcomeThemesData={outcomeThemesData.current}
                            formErrors={formErrors}
                            setFormErrors={setFormErrors}
                            readOnly={disableForm}
                            setWasUpdated={setWasUpdated}
                        />
                    }

                    <ActualValueFields
                        disaggregationData={disaggregationData}
                        setDisaggregationData={setDisaggregationData}
                        formErrors={formErrors}
                        setFormErrors={setFormErrors}
                        handleSADDActualsValidation={handleSADDActualsValidation}
                        readOnly={disableForm}
                        setWasUpdated={setWasUpdated}
                    />
                    {
                        Object.keys(disaggregationData).map((disagg) => {
                            let disaggs = [];
                            if (disaggregationData[disagg].disaggregation_type.includes('SADD') && disaggregationData[disagg].double_counting === true) {
                                disaggs = Object.keys(disaggregationData).reduce((arrSADD, currentDisagg) => {
                                    if (disaggregationData[currentDisagg].disaggregation_type.includes("SADD")) {
                                        arrSADD.unshift(disaggregationData[currentDisagg]);
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
                                    disaggregationData={disaggregationData}
                                    setDisaggregationData={setDisaggregationData}
                                    formErrors={formErrors}
                                    setFormErrors={setFormErrors}
                                    handleSADDActualsValidation={handleSADDActualsValidation}
                                    readOnly={disableForm}
                                    setWasUpdated={setWasUpdated}
                                />
                            )
                        })
                    }
                    <EvidenceFields
                        evidenceFieldsInput={evidenceFieldsInput}
                        setEvidenceFieldsInput={setEvidenceFieldsInput}
                        formErrors={formErrors}
                        setFormErrors={setFormErrors}
                        readOnly={disableForm}
                        setWasUpdated={setWasUpdated}
                    />

                    {!readOnly && !disableForm &&
                    <div className="form-actions">
                        <div>
                            <button
                                type="button"
                                className="btn btn-primary result-group"
                                id="result-submit-create--pc"
                                onClick={(e) => {
                                    setDisableForm(true);
                                    handleSubmit(e);
                                }}
                            >{gettext('Save and close')}
                            </button>
                            <button
                                type="button"
                                className="btn btn-reset result-group"
                                id="result-cancel-btn--pc"
                                data-dismiss="modal"
                            >{gettext('Cancel')}
                            </button>
                        </div>
                    </div>
                    }
                </div>
            </div>
        )
    } else if (status === 'loading') {
        return (
            <DataLoading />
        )
    } else {
        return (
            <ServerError status={status === 'error' ? true : false}/>
        )
    }
}


export { PCResultsForm };
