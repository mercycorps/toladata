import React from 'react'

const ProgramPeriod = () => {
    return (
        <React.Fragment>
            <a
                href="#"
                data-toggle="modal"
                data-target="#program-period__modal"
            >
                {
                    gettext("Program Period")
                }
            </a>

            <div id="program-period__modal" className="modal fade" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div id="program-period__content" className="modal-content">
{/* 
                        <div className="modal-header" style={{borderBottom: "0 none"}}>
                            <h5 id="id-program-period__title" className="modal-title mb-4">{ gettext("Program Period")}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div> */}

                        <div className="modal-body">

                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close">
                                <span>&times;</span>
                            </button>

                            <div id="program-period__section--heading" className="mb-4">
                                <div className="pt-3" style={{display: "inline-block", width: "90%"}}>

                                    <div className="mb-4"><h2>{ gettext("Program period")}</h2></div>

                                    <div>
                                        { gettext("The program period is used in the setup of periodic targets and in Indicator Performance Tracking Tables (IPTT). TolaData initially sets the program period to include the program’s official start and end dates, as recorded in the Identification Assignment Assistant (IDAA) system. The program period may be adjusted to align with the program’s indicator plan.") }
                                    </div>
                                </div>
                            </div>

                            <div id="program-period__section--idaa-dates" className="mb-3">
                                <h3>{ gettext('IDAA program dates')}</h3>
                                <div style={{display: "flex"}}>
                                    <h4 className="mr-4">
                                        <label htmlFor="idaa__date--start" className="text-uppercase"><div className="mb-0">{ gettext("Start date") }</div></label>
                                        <div className="idaa__date--start">2017-09-09</div>
                                    </h4>
                                    <h4>
                                        <label htmlFor="idaa__date--start" className="text-uppercase"><div className="mb-0">{ gettext("End date") }</div></label>

                                        <div className="idaa__date--end">2019-01-19</div>
                                    </h4>
                                </div>
                            </div>

                            <div id="program-period__section--indicator-dates" className="mb-4" style={{width: "90%"}}>
                                <div className="card inputs-in-a-box">
                                    <div className="card-body px-4 py-3">
                                        <h3 className="mb-3">{ gettext('Indicator tracking start and end dates') }</h3>

                                        <div className="mb-3" style={{display: "flex"}}>
                                            <div className="mr-4" style={{display: "flex", flexDirection: "column"}}>
                                                <label htmlFor="indicator-tracking__date--start" className="text-uppercase"><h4 className="mb-1">{ gettext("Start date") }</h4></label>
                                                <input 
                                                    type="text"
                                                    disabled
                                                    className="indicator-tracking__date--start form-control rptMonthPicker"
                                                    value="2017-01-01"
                                                    onChange={(e) => console.log(e.target.value)}
                                                    />
                                            </div>
                                            <div style={{display: "flex", flexDirection: "column"}}>
                                                <label htmlFor="indicator-tracking__date--start" className="text-uppercase"><h4 className="mb-1">{ gettext("End date") }</h4></label>
                                                <input 
                                                    type="text"
                                                    className="indicator-tracking__date--end form-control rptMonthPicker" 
                                                    value="2021-03-31"
                                                    onChange={(e) => console.log(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            { gettext("While a program may begin and end any day of the month, indicator tracking periods must begin on the first day of the month and end on the last day of the month. Please note that the indicator tracking dates should be adjusted before targets are set up and a program begins submitting indicator results. To adjust the Indicator tracking start date or to move the end date earlier after targets are setup and results submitted, refer to the ") }
                                            <a href={"https://mercycorpsemea.sharepoint.com/sites/TolaDataUserGuide"}>{ gettext('TolaData User Guide.')}</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="program-period__section--indicator-actions">
                                <button className="btn btn-primary">
                                    { gettext('Save Changes') }
                                </button>

                                <button className="btn btn-reset">
                                    { gettext('Reset') }
                                </button>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export { ProgramPeriod };
