import React from 'react';
import { QSTVAProgramSelect, QSTVAPeriodSelect, QSTimeperiodsProgramSelect } from './selects';
import { QSTVATimeFrameRadio } from './radios';
import { IPTTSubmit } from './buttons';

const QuickstartCard = ({ children }) => {
    return <div className="col-sm-6">
                <div className="card">
                    <div className="card-body">
                        { children }
                    </div>
                </div>
            </div>;
}

const TVAQuickstartForm = () => {
    return <QuickstartCard>
                <h5 className="card-title">{
                    /* # Translators: description of a report type, comparison with targets */
                    gettext('Periodic targets vs. actuals')
                }</h5>
                <p className="card-subtitle text-muted mb-2">{
                    /* # Translators: label on a form that describes the report it will display */
                    gettext('View results organized by target period for indicators that share the same target frequency')    
                }</p>
                <QSTVAProgramSelect />
                <QSTVAPeriodSelect />
                <QSTVATimeFrameRadio />
                <IPTTSubmit url={'tvaURL' } />
            </QuickstartCard>;
}

const TimeperiodsQuickstartForm = () => {
    return <QuickstartCard>
                <h5 className="card-title">{
                    /* # Translators: description of a report type, showing only recent updates */
                    gettext('Recent progress for all indicators')
                }</h5>
                <p className="card-subtitle text-muted mb-2">{
                    /* # Translators: label on a form describing the report it will display */
                    gettext('View the most recent two months of results. (You can customize your time periods.) This report does not include periodic targets')
                }</p>
                <QSTimeperiodsProgramSelect />
                <IPTTSubmit url={'timeperiodsURL'} />
            </QuickstartCard>;
}

export const IPTTQuickstartForm = () => {
    return <div className="row">
                <TVAQuickstartForm />
                <TimeperiodsQuickstartForm />
           </div>;
}