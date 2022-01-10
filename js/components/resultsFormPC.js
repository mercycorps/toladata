import React, { useState, useEffect } from 'react';
import CheckboxedMultiSelect from 'components/checkboxed-multi-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import api from '../apiv2';


const PCResultsForm = ({programID, indicatorID, disaggregations, reportingPeriodStart, reportingPeriodEnd}) => {


    const helptext = {
        648: gettext("Only include SADD for Direct participants."),
        649: gettext("Only include SADD for Direct participants."),
        650: gettext("Provide a disaggregation of participants reached by sector. Only provide the figure with double counting. Refer to MEL Tip Sheet: Guidelines on Counting and Reporting Participant Numbers <a href='https://library.mercycorps.org/record/16929?ln=en' target='_blank'>[link: https://library.mercycorps.org/record/16929?ln=en]</a> for a description of outcome themes."),
        651: gettext("Provide a disaggregation of participants reached by sector. Only provide the figure with double counting. Refer to MEL Tip Sheet: Guidelines on Counting and Reporting Participant Numbers <a href='https://library.mercycorps.org/record/16929?ln=en' target='_blank'>[link: https://library.mercycorps.org/record/16929?ln=en]</a> for a description of outcome themes."),
        652: gettext("Direct participants – are those who have received a tangible benefit from the program, either as the actual program participants or the intended recipients of the program benefits. Indirect participants – are those who received a tangible benefit through their proximity to or contact with program participants or activities."),
        653: gettext("Direct participants – are those who have received a tangible benefit from the program, either as the actual program participants or the intended recipients of the program benefits. Indirect participants – are those who received a tangible benefit through their proximity to or contact with program participants or activities."),
    };

    const columnOptions = [
        {
            id: "with_double",
            name: "With double counting",
        }, 
        {
            id: "without_double",
            name: "Without double counting",
        }
    ]
    let cols = {
        591: [columnOptions[0]],
        590: [columnOptions[0]],
        109: [columnOptions[1], columnOptions[0]],
        576: [columnOptions[1], columnOptions[0]],
        577: [columnOptions[0]],
        578: [columnOptions[0]],
        579: [columnOptions[1], columnOptions[0]],
        652: [columnOptions[0]],
        653: [columnOptions[0]],
        650: [columnOptions[0]],
        651: [columnOptions[0]],
        // 648: [columnOptions[1], columnOptions[0]],
        648: [columnOptions[0]],
        649: [columnOptions[1], columnOptions[0]],
    }

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
                    handleReceivedDisaggregations(response.disaggregations.disaggregations)
                })
        })
    }, [])

    let handleReceivedDisaggregations = (disaggregations_data) => {
        let data = disaggregations_data.reduce((formated, disagg) => {
            let labels = disagg.labels.reduce((labelsObj, label) => {
                labelsObj[label.customsort] = label;
                return labelsObj;
            }, {});
            formated[disagg.pk] = {...disagg, labels: labels};
            return formated;
        }, {});
        
        console.log("Formated:", data);
        setDisaggregationData(data);
    }

    let formatOutcomeThemsData = (outcomeThemes) => {
       return outcomeThemes.reduce((themesArray, theme, i) => {
            themesArray[i] = {value: i, label: theme[1]};
            return themesArray;
        }, [])
    }

    const [resultsFieldsInput, setResultsFieldsInput] = useState({});
    const [outcomeThemesData, setOutcomeThemesData] = useState([]);
    const [disaggregationData, setDisaggregationData] = useState([]);
    
    const [commonFieldsInput, setCommonFieldsInput] = useState({fiscal_year: "FY 2022: 1 July 2021 - 30 June 2022"});
    const [evidenceFieldsInput, setEvidenceFieldsInput] = useState({});
    const [actualFieldsInput, setActualFieldsInput] = useState({});
    const [disaggregationFieldsInput, setDisaggregationFieldsInput] = useState({});
    const [sumValues, setSumValues] = useState({});
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
        if (Object.entries(actualFieldsInput).length === 0) {
            detectedErrors = {...detectedErrors, 576: gettext("Total participants With double counting is required. Please complete this field.")}
        } else {
            if (actualFieldsInput["576"]["1"]) {
                if (parseInt(actualFieldsInput["576"]["1"]["0"].value) > parseInt(actualFieldsInput["576"]["0"]["0"].value) || 
                parseInt(actualFieldsInput["576"]["1"]["1"].value) > parseInt(actualFieldsInput["576"]["0"]["1"].value)) {
                    detectedErrors = {...detectedErrors, 576: gettext("Direct/indirect without double counting should be equal or lower than Direct/indirect with double counting.")}
                }
            }
        }

        if (disaggregationFieldsInput["579"]) {
            if ( sumValues["576"] && sumValues["579"] && sumValues["579"]["0"] !== sumValues['576']["0"]) {
                detectedErrors = {...detectedErrors, 579: gettext("The sum of 'SADD with double counting' should be equal to the sum of 'Direct with double counting'. The sum of 'SADD without double counting' should be equal to the sum of 'Direct without double counting'.")}
            }
            if (sumValues["576"] && sumValues["579"] && sumValues["579"]["1"] !== sumValues["576"]["1"]) {
                detectedErrors = {...detectedErrors, 579: gettext("The sum of 'SADD with double counting' should be equal to the sum of 'Direct with double counting'. The sum of 'SADD without double counting' should be equal to the sum of 'Direct without double counting'.")}
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
        // console.log('actualFieldsInput:', actualFieldsInput)
        console.log('disaggregationFieldsInput:', disaggregationFieldsInput);
        console.log('evidenceFieldsInput', evidenceFieldsInput);
        console.log('sumValues:', sumValues);
        let data = [];
        data = data.concat(formatData({indicator: indicatorID, program: programID}))
        // data = data.concat(formatData(commonFieldsInput));
        // data = data.concat(formatData(actualFieldsInput));
        // data = data.concat(formatData(disaggregationFieldsInput));

        // console.log("Data", data);
        let form_data = new FormData;
       data.map(currentData => {
            form_data.append(currentData["name"], currentData["value"]);
        })
        for(var pair of form_data.entries()) {
            console.log('Form Data:', pair[0]+ ', '+ pair[1]);
        }

        api.savePCountResultsData(indicatorID, form_data)
            .then(response => {
                console.log("Saved Form Data!");
            })
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
                        disagg={disaggregationData["648"]}
                        disaggregationData={disaggregationData}
                        setDisaggregationData={setDisaggregationData}
                        cols={cols}
                        helptext={helptext}
                        formErrors={formErrors}
                />
                <DissaggregationFields 
                    indicatorID={indicatorID}
                    disagg={disaggregationData["650"]}
                    disaggregationData={disaggregationData}
                    setDisaggregationData={setDisaggregationData}
                    cols={cols}
                    helptext={helptext}
                    formErrors={formErrors}
                />
                <DissaggregationFields 
                    indicatorID={indicatorID}
                    disagg={disaggregationData["651"]}
                    disaggregationData={disaggregationData}
                    setDisaggregationData={setDisaggregationData}
                    cols={cols}
                    helptext={helptext}
                    formErrors={formErrors}
                />

                {/* {Object.keys(disaggregationData).map((disagg, i) => {
                    if ( [578, 579, 648, 649, "650", 651].indexOf(disagg) >= 0 ) {
                        // return <DissaggregationFields 
                        //             key={disagg.pk}
                        //             indicatorID={indicatorID}
                        //             disagg={disagg}
                        //             actualFieldsInput={actualFieldsInput}
                        //             disaggregationFieldsInput={disaggregationFieldsInput}
                        //             setDisaggregationFieldsInput={setDisaggregationFieldsInput}
                        //             sumValues={sumValues}
                        //             setSumValues={setSumValues}
                        //             helptext={helptext}
                        //             cols={cols}
                        //             formErrors={formErrors}
                        //         />
                    }
                })} */}
                <EvidenceFields
                    resultsFieldsInput={resultsFieldsInput}
                    setResultsFieldsInput={setResultsFieldsInput}
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

    let handleDataEntry = (value, inputDisaggPk, inputLabelSort) => {
        let update = {...disaggregationData};
        update[inputDisaggPk].labels[inputLabelSort] = {...disaggregationData[inputDisaggPk].labels[inputLabelSort], value: value};
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
                            name={`${disaggregationData["652"].disaggregation_type}-${disaggregationData["652"].labels["1"]}`}
                            id={`id_${disaggregationData["652"].disaggregation_type}-${disaggregationData["652"].labels["1"]}`}
                            value={Object.keys(disaggregationData).length > 0 && disaggregationData["652"].labels["1"].value || ""}
                            onChange={(e) => handleDataEntry(e.target.value, 652, 1)}
                        />
                        <input 
                            type="number" 
                            className="bin form-control input-value" 
                            name={`${disaggregationData["653"].disaggregation_type}-${disaggregationData["653"].labels["1"]}`}
                            id={`id_${disaggregationData["653"].disaggregation_type}-${disaggregationData["653"].labels["1"]}`}
                            value={disaggregationData["653"].labels["1"].value || ""}
                            onChange={(e) => handleDataEntry(e.target.value, 653, 1)}

                        />
                    </div>
                </li>

                <li className="list-group-item">
                    <div className="item__label">{gettext("Actual Indirect value")}</div>
                    <div className="item__value--container">
                        <input 
                            type="number" 
                            className="bin form-control input-value" 
                            name={`${disaggregationData["652"].disaggregation_type}-${disaggregationData["652"].labels["2"]}`}
                            id={`id_${disaggregationData["652"].disaggregation_type}-${disaggregationData["652"].labels["2"]}`}
                            value={disaggregationData["652"].labels["2"].value || ""}
                            onChange={(e) => handleDataEntry(e.target.value, 652, 2)}

                        />
                        <input 
                            type="number" 
                            className="bin form-control input-value" 
                            name={`${disaggregationData["653"].disaggregation_type}-${disaggregationData["653"].labels["2"]}`}
                            id={`id_${disaggregationData["653"].disaggregation_type}-${disaggregationData["653"].labels["2"]}`}
                            value={disaggregationData["653"].labels["2"].value || ""}
                            onChange={(e) => handleDataEntry(e.target.value, 653, 2)}
                        />
                    </div>
                </li>

                <li className="list-group-item reference-row">
                    <div className="item__label">{gettext("Actual Total value")}</div>
                    <div className="item__value--container">
                        <div className="bin">{parseInt(disaggregationData['652'].labels['1'].value || 0) + parseInt(disaggregationData['652'].labels['2'].value || 0)}</div>
                        <div className="bin">{parseInt(disaggregationData['653'].labels['1'].value || 0) + parseInt(disaggregationData['653'].labels['2'].value || 0)}</div>
                    </div>
                </li>

                {/* {
                    formErrors[disagg.pk] &&
                        <span id={`validation_id_${disagg.pk}`} className="has-error">{formErrors[disagg.pk]}</span>
                } */}
            </ul>
        </React.Fragment>
    )
}



// ***** Dissaggreagation Fields Section *****
const DissaggregationFields = ({ indicatorID, disagg, disaggregationData, setDisaggregationData, cols, helptext, formErrors}) => {
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        $(`#${indicatorID}-${disagg.pk}`).on('show.bs.collapse', function() {
            setExpanded(true);
        })
        $(`#${indicatorID}-${disagg.pk}`).on('hide.bs.collapse', function() {
            setExpanded(false);
        })
    }, [])
    
    let handleDataEntry = (value, disagg, label, rowIndex, colIndex, colLength) => {
        let colSortedIndex = colLength - 1 - colIndex; // Column index from right to left to align the same column of the disaggregations with 2 columns with ones with 1 column
        
        let updatedDisaggFields = {...disaggregationFieldsInput};
        !updatedDisaggFields[disagg] && (updatedDisaggFields[disagg] = {});
        !updatedDisaggFields[disagg][colSortedIndex] && (updatedDisaggFields[disagg][colSortedIndex] = []);
        updatedDisaggFields[disagg][colSortedIndex][rowIndex] = {...label, value: value};
        setDisaggregationFieldsInput(updatedDisaggFields);

        let updatedSumValues = {...sumValues};
        !updatedSumValues[disagg] && (updatedSumValues[disagg] = {});
        let sum = updatedDisaggFields[disagg][colSortedIndex].reduce((total, currentLabel) => {
            return total + parseInt(currentLabel.value || 0);
        }, 0)
        updatedSumValues[disagg][colSortedIndex] = sum;
        setSumValues(updatedSumValues);

        console.log(value, "|", disagg, "|", label, "|", rowIndex, "|", colIndex, "|", colLength);
        console.log('disaggregationFieldsInput:', updatedDisaggFields);
        console.log('updatedSumValues:', updatedSumValues);
        console.log('sumValues', sumValues);
    }

    return (
        <fieldset>
            <ul className="list-group form-list-group">
                <li className="list-group-item heading-row">
                    <div className="item__value--header">
                        <a className="item__label--accordion accordion-header collapsed" data-toggle="collapse" href={`#${indicatorID}-${disagg.pk}`} aria-expanded={expanded} aria-controls={`#${disagg.pk}`}>
                            <FontAwesomeIcon icon={ expanded ? 'caret-down' : 'caret-right' } />&nbsp;
                            <label className="label--required">{disagg.disaggregation_type}</label>
                        </a>

                        <a href="#"
                            tabIndex="0"
                            data-toggle="popover"
                            data-placement="right"
                            data-trigger="focus"
                            data-content={helptext[disagg.pk]}
                        >
                            &nbsp;<i className="far fa-question-circle"></i>
                        </a>

                        {
                            !expanded && formErrors[disagg.pk] &&
                            <span className="needs-attention"><i className="fas fa-exclamation-triangle"></i>{gettext("Needs Attention")}</span>
                        }
                    </div>
                    <div className="item__value--container" style={{display: expanded ? "inherit" : "none"}}>
                        {
                            cols[disagg.pk].map((column, i) => {
                            return (
                                <div key={i} className="bin heading">{column.name}</div>
                                )
                            })
                        }
                    </div>
                </li>
            </ul>
        <ul className="list-group form-list-group collapse" id={`${indicatorID}-${disagg.pk}`}>

            {
                Object.keys(disagg.labels).map((labelObj, rowIndex) => {
                    return (
                            <li key={`${disagg.pk}-${labelObj.customsort}-${rowIndex}`} className="list-group-item">
                                <div className="item__label">{labelObj.label}</div>
                                <div className="item__value--container">
                                    {
                                        cols[disagg.pk].map((column, colIndex) => {
                                            let sortedColumnIndex = cols[disagg.pk].length - 1 - colIndex;
                                            let value;
                                            // try { value = disaggregationFieldsInput[disagg.pk][sortedColumnIndex][rowIndex].value; } 
                                            try { value = resultsFieldsInput[disagg.pk][sortedColumnIndex][rowIndex].value || ""; } 
                                            catch { value = ""}

                                            return (
                                                <input 
                                                    key={`${disagg.pk}-${labelObj.customsort}-${rowIndex}-${colIndex}`}
                                                    type="number" 
                                                    className="bin form-control input-value" 
                                                    name={`disaggregation-formset-${disagg.pk}-${rowIndex}-label_pk-${column.id}`} 
                                                    id={`id_${column.id}`}
                                                    value={value}
                                                    onChange={(e) => handleDataEntry(e.target.value, disagg.pk, labelObj, rowIndex, colIndex, cols[disagg.pk].length)}
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
                            cols[disagg.pk].map((column, colIndex) => {
                                // let sortedColumnIndex = cols[disagg.pk].length - 1 - colIndex;
                                // let value;
                                // try{ value = sumValues[disagg.pk][sortedColumnIndex] }
                                // catch{ value = 0 }
                                return (
                                    <div key={colIndex} className="bin">{"value"}</div>
                                )
                            })
                        }
                    </div>
                </li>

                <li className="list-group-item reference-row">

                    <div className="item__label">{gettext("Actual Direct value")}</div>

                    <div className="item__value--container">
                        {
                            cols[disagg.pk].map((column, colIndex) => {
                                let sortedColumnIndex = cols[disagg.pk].length - 1 - colIndex;
                                let value;
                                try{ value = actualFieldsInput[576][sortedColumnIndex][0].value }// TODO: update for direct or indirect
                                catch{ value = 0 }
                                return (
                                    <div key={colIndex} className="bin">{value}</div>
                                )
                            })
                        }
                    </div>
                </li>
                {
                    formErrors[disagg.pk] &&
                        <span id={`validation_id_${[disagg.pk]}`} className="has-error">{formErrors[disagg.pk]}</span>
                }
        </ul>
        </fieldset>
    )
}



// ***** Evidence Fields Section *****
const EvidenceFields = ({ resultsFieldsInput, setResultsFieldsInput, evidenceFieldsInput, setEvidenceFieldsInput, formErrors }) => {

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
