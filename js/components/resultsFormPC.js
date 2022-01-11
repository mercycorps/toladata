import React, { useState, useEffect } from 'react';
import CheckboxedMultiSelect from 'components/checkboxed-multi-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import api from '../apiv2';


const PCResultsForm = ({programID, indicatorID, disaggregations, reportingPeriodStart, reportingPeriodEnd}) => {

    const helptext = {
        "649-648": gettext("Only include SADD for Direct participants."),
        650: gettext("Provide a disaggregation of participants reached by sector. Only provide the figure with double counting. Refer to MEL Tip Sheet: Guidelines on Counting and Reporting Participant Numbers <a href='https://library.mercycorps.org/record/16929?ln=en' target='_blank'>[link: https://library.mercycorps.org/record/16929?ln=en]</a> for a description of outcome themes."),
        651: gettext("Provide a disaggregation of participants reached by sector. Only provide the figure with double counting. Refer to MEL Tip Sheet: Guidelines on Counting and Reporting Participant Numbers <a href='https://library.mercycorps.org/record/16929?ln=en' target='_blank'>[link: https://library.mercycorps.org/record/16929?ln=en]</a> for a description of outcome themes."),
        652: gettext("Direct participants – are those who have received a tangible benefit from the program, either as the actual program participants or the intended recipients of the program benefits. Indirect participants – are those who received a tangible benefit through their proximity to or contact with program participants or activities."),
        653: gettext("Direct participants – are those who have received a tangible benefit from the program, either as the actual program participants or the intended recipients of the program benefits. Indirect participants – are those who received a tangible benefit through their proximity to or contact with program participants or activities."),
    };

    useEffect(() => {
        $(`#addResultModal_${indicatorID}`).on('shown.bs.modal', function () {

            $(`#addResultModal_${indicatorID}`).on('hidden.bs.modal', function () {
                setCommonFieldsInput({date_collected: "", fiscal_year: "FY 2022: 1 July 2021 - 30 June 2022"})
                setEvidenceFieldsInput({})
                setActualFieldsInput({})
                setDisaggregationFieldsInput({})
                setSumValues({})
                setFormErrors({})
            })

            $(document).on("keyup", function(event) {
                if(event.key === 'Escape') {
                    $(`#addResultModal_${indicatorID}`).modal('hide');
                }
            })

            api.getPCountResultsData(indicatorID)
                .then(response => {
                    console.log("Form received data!", response);
                    setOutcomeThemesData(formatOutcomeThemsData(response.outcome_themes));
                    setDisaggregationData(handleReceivedDisaggregations(response.disaggregations.disaggregations));
                })
        })
    }, [])

    let handleReceivedDisaggregations = (disaggregations_data) => {
        return disaggregations_data.reduce((formated, disagg) => {
            formated[disagg.pk] = {...disagg};
            return formated;
        }, {});
    }

    let formatOutcomeThemsData = (outcomeThemes) => {
       return outcomeThemes.reduce((themesArray, theme, i) => {
            themesArray[i] = {value: i, label: theme[1]};
            return themesArray;
        }, [])
    }

    const [evidenceFieldsInput, setEvidenceFieldsInput] = useState({});
    const [commonFieldsInput, setCommonFieldsInput] = useState({fiscal_year: "FY 2022: 1 July 2021 - 30 June 2022"});
    const [outcomeThemesData, setOutcomeThemesData] = useState([]);
    const [disaggregationData, setDisaggregationData] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    

    let validateForm = () => {
        let detectedErrors = {};
        if (!commonFieldsInput.date_collected || commonFieldsInput.date_collected === "") {
            detectedErrors = {...detectedErrors, date_collected: gettext("This date should be within the fiscal year of the reporting period.")}
        };

        if (!commonFieldsInput.fiscal_year || commonFieldsInput.fiscal_year === "") {
            detectedErrors = {...detectedErrors, fiscal_year: gettext("You cannot change the fiscal year during the current reporting period. ")}
        };

        if (!commonFieldsInput.outcome_theme || commonFieldsInput.outcome_theme === []) {
            detectedErrors = {...detectedErrors, outcome_theme: gettext("Please complete this field. You can select more than one outcome theme.")}
        };
        // if (Object.entries(actualFieldsInput).length === 0) {
        //     detectedErrors = {...detectedErrors, 576: gettext("Total participants With double counting is required. Please complete this field.")}
        // } else {
        //     if (actualFieldsInput["576"]["1"]) {
        //         if (parseInt(actualFieldsInput["576"]["1"]["0"].value) > parseInt(actualFieldsInput["576"]["0"]["0"].value) || 
        //         parseInt(actualFieldsInput["576"]["1"]["1"].value) > parseInt(actualFieldsInput["576"]["0"]["1"].value)) {
        //             detectedErrors = {...detectedErrors, 576: gettext("Direct/indirect without double counting should be equal or lower than Direct/indirect with double counting.")}
        //         }
        //     }
        // }

        // if (disaggregationFieldsInput["579"]) {
        //     if ( sumValues["576"] && sumValues["579"] && sumValues["579"]["0"] !== sumValues['576']["0"]) {
        //         detectedErrors = {...detectedErrors, 579: gettext("The sum of 'SADD with double counting' should be equal to the sum of 'Direct with double counting'. The sum of 'SADD without double counting' should be equal to the sum of 'Direct without double counting'.")}
        //     }
        //     if (sumValues["576"] && sumValues["579"] && sumValues["579"]["1"] !== sumValues["576"]["1"]) {
        //         detectedErrors = {...detectedErrors, 579: gettext("The sum of 'SADD with double counting' should be equal to the sum of 'Direct with double counting'. The sum of 'SADD without double counting' should be equal to the sum of 'Direct without double counting'.")}
        //     }
        // }

        if (!disaggregationData['653'].labels[0].value || !disaggregationData['653'].labels[1].value) {
            console.log("totals error");
            detectedErrors = {...detectedErrors, totals_error: gettext("Direct/indirect total participants with double counting is required. Please complete these fields.")}
        }

        if (
            parseInt(disaggregationData['652'].labels[0].value || 0) > parseInt(disaggregationData['653'].labels[0].value || 0) ||
            parseInt(disaggregationData['652'].labels[1].value || 0) > parseInt(disaggregationData['653'].labels[1].value || 0)
            ) {
                console.log("totals error");
                detectedErrors = {...detectedErrors, totals_error: gettext("Direct/indirect without double counting should be equal or lower than Direct/indirect with double counting.")}
        }

        if (evidenceFieldsInput.evidence_url ) {
            if (evidenceFieldsInput.evidence_url.match(/^(http(s)?|file):\/\/.+/)) {
                console.log("Evidence Error");
                detectedErrors = {...detectedErrors, evidence_url: gettext("Please enter a valid evidence link.")}
                setValidEvidenceURL(evidenceURLHasValue);
            }
        }

        setFormErrors(detectedErrors);
    }


    let formatData = (data) => {
        let formatedData = [];
        Object.keys(data).map(key => {
            formatedData.push({name: key, value: data[key]})
        })
        return formatedData;
    }

    let handleSubmit = (e) => {
        e.preventDefault();
        validateForm();
        console.log('commonFieldsInput:', commonFieldsInput)
        console.log('evidenceFieldsInput', evidenceFieldsInput);
        let data = [];
        data = data.concat(formatData({indicator: indicatorID, program: programID}))
        // data = data.concat(formatData(commonFieldsInput));
        // data = data.concat(formatData(actualFieldsInput));
        // data = data.concat(formatData(disaggregationFieldsInput));

        // console.log("Data", data);
    //     let form_data = new FormData;
    //    data.map(currentData => {
    //         form_data.append(currentData["name"], currentData["value"]);
    //     })
    //     for(var pair of form_data.entries()) {
    //         console.log('Form Data:', pair[0]+ ', '+ pair[1]);
    //     }

        // api.savePCountResultsData(indicatorID, form_data)
        //     .then(response => {
        //         console.log("Saved Form Data!");
        //     })
    }
    if (Object.keys(disaggregationData).length > 0) {
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
                    reportingPeriodEnd={reportingPeriodEnd}
                    reportingPeriodStart={reportingPeriodStart}
                    commonFieldsInput={commonFieldsInput}
                    setCommonFieldsInput={setCommonFieldsInput}
                    outcomeThemesData={outcomeThemesData}
                    formErrors={formErrors}
                />

                <ActualValueFields
                    disaggregationData={disaggregationData}
                    setDisaggregationData={setDisaggregationData}
                    formErrors={formErrors}
                />

                <DissaggregationFields 
                    indicatorID={indicatorID}
                    disagg={[disaggregationData["649"],disaggregationData["648"]]}
                    disaggregationData={disaggregationData}
                    setDisaggregationData={setDisaggregationData}
                    total={[disaggregationData["652"].labels[0], disaggregationData["653"].labels[0]]}
                    title={"SADD (including unknown)"}
                    helptext={helptext}
                    formErrors={formErrors}
                />
                <DissaggregationFields 
                    indicatorID={indicatorID}
                    disagg={[disaggregationData["650"]]}
                    disaggregationData={disaggregationData}
                    setDisaggregationData={setDisaggregationData}
                    total={[disaggregationData["653"].labels[0]]}
                    helptext={helptext}
                    formErrors={formErrors}
                />
                <DissaggregationFields 
                    indicatorID={indicatorID}
                    disagg={[disaggregationData["651"]]}
                    disaggregationData={disaggregationData}
                    setDisaggregationData={setDisaggregationData}
                    total={[disaggregationData["653"].labels[1]]}
                    helptext={helptext}
                    formErrors={formErrors}
                />

                <EvidenceFields
                    evidenceFieldsInput={evidenceFieldsInput}
                    setEvidenceFieldsInput={setEvidenceFieldsInput}
                    formErrors={formErrors}
                />

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
            </div>
        )
    } else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
}



// ***** Common Fields Section *****
const CommonFields = ({ reportingPeriodStart, reportingPeriodEnd, commonFieldsInput, setCommonFieldsInput, outcomeThemesData, formErrors }) => {

    useEffect(() => {
        $('[data-toggle="popover"]').popover({html: true});
    }, [])
    return (
        <fieldset>
            <div className="form-group" id="div_id_date_collected">
                <label htmlFor="id_date_collected" className="label--required">{gettext('Result date')}</label>

                <a 
                href="#"
                tabIndex="0"
                data-toggle="popover"
                data-placement="right"
                data-trigger="focus"
                data-content={ gettext('If data collection occurred within the fiscal year, enter the date where data was collected. If data collection occurred after the end of the fiscal year, enter the last day of the fiscal year (June 30).')}>
                    &nbsp;<i className="far fa-question-circle"></i>
                </a>

                <input 
                    type="date" 
                    name="date_collected" 
                    id="id_date_collected" 
                    className={`datepicker form-control hasDatepicker ${formErrors.date_collected && "is-invalid"}`}
                    required
                    autoComplete="off" 
                    min={reportingPeriodStart}
                    max={reportingPeriodEnd}
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

                <a href="#"
                tabIndex="0"
                data-toggle="popover"
                data-placement="right"
                data-trigger="focus"
                data-content={ gettext('Fiscal years run from July 1 to June 30 of the following year.')}>
                    &nbsp;<i className="far fa-question-circle"></i>
                </a>

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

                <a href="#"
                tabIndex="0"
                data-toggle="popover"
                data-placement="right"
                data-trigger="focus"
                html="true"
                data-content={gettext('Outcome themes are the main areas of a program. Refer to MEL Tip Sheet: Guidelines on Counting and Reporting Participant Numbers <a tabIndex="1" href="https://library.mercycorps.org/record/16929?ln=en" target="_blank">[link: https://library.mercycorps.org/record/16929?ln=en]</a> for a description of outcome themes.<span>')}
                >
                    &nbsp;<i className="far fa-question-circle"></i>
                </a>

                <CheckboxedMultiSelect 
                    options={outcomeThemesData}
                    placeholder={gettext("None Selected")}
                    className={`${formErrors.outcome_theme && "is-invalid"}`}
                    id="outcome_themes_multiselect"
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



// ***** Acutal Values Fields Section *****
const ActualValueFields = ({ disaggregationData, setDisaggregationData, formErrors }) => {

    let handleDataEntry = (value, inputDisaggPk, inputLabelIndex) => {
        let update = {...disaggregationData};
        update[inputDisaggPk].labels[inputLabelIndex] = {...disaggregationData[inputDisaggPk].labels[inputLabelIndex], value: value};
        console.log("After Update", update);
        setDisaggregationData(update);
    }
    
    return (
        <React.Fragment>
            <ul className="list-group form-list-group">
                <li className="list-group-item heading-row">
                    <div className="item__value--header">
                        <div className="item__label">
                            <label className="label--required">{gettext('Total Participant Actual Values')}</label>

                            <a href="#"
                                tabIndex="0"
                                data-toggle="popover"
                                data-placement="right"
                                data-trigger="focus"
                                data-content={
                                    // # Translators:
                                    gettext('Include the participants with double counting on the left and participants without double counting across programs on the right. If two programs share participants, only discount double counting in one program!<br/><br/><strong>Direct participants</strong> – are those who have received a tangible benefit from the program, either as the actual program participants or the intended recipients of the program benefits.<br/><br/><strong>Indirect participants</strong> – are those who received a tangible benefit through their proximity to or contact with program participants or activities.')
                                }>
                                    &nbsp;<i className="far fa-question-circle"></i>
                            </a>
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
                            name={`${disaggregationData["652"].disaggregation_type}-${disaggregationData["652"].labels[0]}`}
                            id={`id_${disaggregationData["652"].disaggregation_type}-${disaggregationData["652"].labels[0]}`}
                            value={disaggregationData["652"].labels[0].value || ""}
                            onChange={(e) => handleDataEntry(e.target.value, 652, 0)}
                        />
                        <input 
                            type="number" 
                            className="bin form-control input-value" 
                            name={`${disaggregationData["653"].disaggregation_type}-${disaggregationData["653"].labels[0]}`}
                            id={`id_${disaggregationData["653"].disaggregation_type}-${disaggregationData["653"].labels[0]}`}
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
                            value={disaggregationData["652"].labels[1].value || ""}
                            onChange={(e) => handleDataEntry(e.target.value, 652, 1)}

                        />
                        <input 
                            type="number" 
                            className="bin form-control input-value" 
                            name={`${disaggregationData["653"].disaggregation_type}-${disaggregationData["653"].labels[1]}`}
                            id={`id_${disaggregationData["653"].disaggregation_type}-${disaggregationData["653"].labels[1]}`}
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
        </React.Fragment>
    )
}



// ***** Dissaggreagation Fields Section *****
const DissaggregationFields = ({ indicatorID, disagg, disaggregationData, setDisaggregationData, total, title, helptext, formErrors}) => {
    const [expanded, setExpanded] = useState(false);
    let disaggID = disagg.reduce((id, disaggregation) => {
        id = id + (id === "" ? "" : "-") + disaggregation.pk;
        return id;
    },"")
    useEffect(() => {
        $(`#${indicatorID}-${disaggID}`).on('show.bs.collapse', function() {
            setExpanded(true);
        })
        $(`#${indicatorID}-${disaggID}`).on('hide.bs.collapse', function() {
            setExpanded(false);
        })
    }, [])

    let handleDataEntry = (value, inputDisaggPk, customsort) => {
        let update = {...disaggregationData};
        update[inputDisaggPk].labels[customsort - 1] = {...disaggregationData[inputDisaggPk].labels[customsort - 1], value: value};
        console.log("After Update", update);
        setDisaggregationData(update);
    }

    return (
        <fieldset>
            <ul className="list-group form-list-group">
                <li className="list-group-item heading-row">
                    <div className="item__value--header">
                        <a className="item__label--accordion accordion-header collapsed" data-toggle="collapse" href={`#${indicatorID}-${disaggID}`} aria-expanded={expanded} aria-controls={`#${disaggID}`}>
                            <FontAwesomeIcon icon={ expanded ? 'caret-down' : 'caret-right' } />&nbsp;
                            <label className="label--required">{title || disagg[0].disaggregation_type}</label>
                        </a>

                        <a href="#"
                            tabIndex="0"
                            data-toggle="popover"
                            data-placement="right"
                            data-trigger="focus"
                            data-content={helptext[disaggID]} // May be better to reduce and provide both help texts.
                        >
                            &nbsp;<i className="far fa-question-circle"></i>
                        </a>

                        {
                            !expanded && formErrors[disagg[0].pk] &&
                            <span className="needs-attention"><i className="fas fa-exclamation-triangle"></i>{gettext("Needs Attention")}</span>
                        }
                    </div>
                    <div className="item__value--container" style={{display: expanded ? "inherit" : "none"}}>
                        {/* {
                            cols[disagg.pk].map((column, i) => {
                            return (
                                <div key={i} className="bin heading">{column.name}</div>
                                )
                            })
                        } */}
                        {
                            disagg.length !== 1 &&
                            <div className="bin heading">{gettext("Without double counting")}</div>
                        }
                        <div className="bin heading">{gettext("With double counting")}</div>
                    </div>
                </li>
            </ul>
        <ul className="list-group form-list-group collapse" id={`${indicatorID}-${disaggID}`}>
            {
                disagg[0].labels.map((labelObj) => {
                    return (
                            <li key={`${disaggID}-${labelObj.customsort}`} className="list-group-item">
                                <div className="item__label">{labelObj.label}</div>
                                <div className="item__value--container">
                                    {
                                        disagg.map(currentDisagg => {
                                            return (
                                                <input 
                                                    key={`id_${disaggID}-${currentDisagg.pk}-${labelObj.customsort}`}
                                                    id={`id_${disaggID}-${currentDisagg.pk}-${labelObj.customsort}`}
                                                    name={`disaggregation-formset-${disaggID}-${labelObj.customsort}-label_pk`} 
                                                    type="number" 
                                                    className="bin form-control input-value" 
                                                    value={disaggregationData[currentDisagg.pk].labels[labelObj.customsort - 1].value || ""}
                                                    onChange={(e) => handleDataEntry(e.target.value, currentDisagg.pk, labelObj.customsort)}
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
                                <div key={currentDisagg.pk} className="bin">{disaggregationData[currentDisagg.pk].labels.reduce((sum, label) => {
                                    sum+= parseInt(label.value) || 0;
                                    return sum}, 0)}
                                </div>
                            )
                        })
                    }
                </div>
            </li>

            <li className="list-group-item reference-row">
                <div className="item__label">{`Actual ${total[0].label} value`}</div>
                <div className="item__value--container">
                    {
                        disagg.map((currentDisagg, i) => {
                            return (
                                <div key={currentDisagg.pk} className="bin">{parseInt(total[i].value || 0)}</div>
                            )
                        })
                    }
                </div>
            </li>

            {
                formErrors[disagg.pk] &&
                    <span id={`validation_id_${[disaggID]}`} className="has-error">{formErrors[disaggID]}</span>
            }
        </ul>
        </fieldset>
    )
}



// ***** Evidence Fields Section *****
const EvidenceFields = ({evidenceFieldsInput, setEvidenceFieldsInput, formErrors }) => {

    const [validEvidenceURL, setValidEvidenceURL] = useState(false);

    useEffect(() => {
        if(evidenceFieldsInput.evidence_url) {
            let evidenceURLHasValue = evidenceFieldsInput.evidence_url.match(/^(http(s)?|file):\/\/.+/);
            setValidEvidenceURL(evidenceURLHasValue);
        }
    }, [evidenceFieldsInput.evidence_url])

    return (
        <div className="card card-body bg-primary-light border-0">
            <h3>
                {   
                    // # Translators: 
                    gettext('Evidence')
                }
            </h3>
            <p>
                {   
                    // # Translators: 
                    gettext('Link this result to a record or folder of records that serves as evidence.')
                }
            </p>

            <div className="form-group">
                <label htmlFor="id_record_url" className="label--required">
                    {
                        gettext('Link to file or folder')
                    }
                </label>
                <a href="#"
                    tabIndex="0"
                    data-toggle="popover"
                    data-placement="right"
                    data-trigger="focus"
                    data-content=
                    {
                        // # Translators: 
                        gettext('Provide a link to a file or folder in Google Drive or another shared network drive. Please be aware that TolaData does not store a copy of your record, <i>so you should not link to something on your personal computer, as no one else will be able to access it.</i>')
                    }
                >
                    &nbsp;<i className="far fa-question-circle"></i>
                </a>

                <div className="d-flex btn-group">
                    <input 
                        type="text" 
                        name="evidence_url" 
                        id="id_evidence_url" 
                        maxLength="255" 
                        className="form-control"
                        value={evidenceFieldsInput.evidence_url || ""}
                        onChange={(e) => setEvidenceFieldsInput({...evidenceFieldsInput, [e.target.name]: e.target.value})}
                    />

                    <button 
                        type="button" 
                        id="id_view_evidence_button" 
                        className="btn btn-sm btn-secondary evidence-view__btn"
                        disabled={!validEvidenceURL}
                        onClick={() => window.open(evidenceFieldsInput.evidence_url, '_blank')}
                    >{gettext('view')}</button>
                    <button 
                        type="button" 
                        id="id_browse_google_drive" 
                        className="btn btn-sm btn-link text-nowrap"
                        onClick={() => alert("Google")}
                    >
                        <i className="fas fa-external-link-alt"></i>{gettext('Browse Google Drive')}
                    </button>
                </div>
                {
                    formErrors.evidence_url && 
                        <span id="validation_id_evidence_url" className="has-error">{formErrors.evidence_url}</span>
                }

                <div className="form-group" id="div_id_record_name">
                    <label htmlFor="id_record_name">{gettext("Record name")}&nbsp;</label>

                    <a href="#"
                        tabIndex="0"
                        data-toggle="popover"
                        data-placement="right"
                        data-trigger="focus"
                        data-content={gettext('Give your record a short name that is easy to remember.')}>
                            <i className="far fa-question-circle"></i>
                    </a>

                    <input 
                        type="text" 
                        name="record_name" 
                        id="id_record_name" 
                        className="form-control" 
                        maxLength="135"
                        value={evidenceFieldsInput.record_name || ""}
                        onChange={(e) => setEvidenceFieldsInput({...evidenceFieldsInput, [e.target.name]: e.target.value})}
                    />
                </div>

            </div>
        </div>
    )
}


export default PCResultsForm;
