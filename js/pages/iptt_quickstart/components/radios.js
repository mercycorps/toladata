import React from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';

@inject('rootStore')
@observer
export class QSTVATimeFrameRadio extends React.Component {
    constructor(props) {
        super(props);
    }
    
    setMostRecentCount = (e) => {
        // eliminate leading zeros and non-digit characters then update state and store
        let value = e.target.value.replace(/^0+/, '').replace(/[^0-9]*/gi, '');
        this.props.rootStore.setMostRecentCount(value);
    }

    render() {
        return <div className="form-group d-lg-flex pb-4">
                    <div className={
                        classNames('form-check', 'form-check-inline', 'pt-1', 'pr-2',
                            {'form-check-inline--is-disabled': this.props.rootStore.periodCountDisabled})
                    }>
                        <span className="form-check-input">
                            <input type="radio"
                                   checked={ this.props.rootStore.showAll }
                                   disabled={ this.props.rootStore.periodCountDisabled }
                                   onChange={ this.props.rootStore.setShowAll }
                                   id="id_targetperiods-timeframe_0"
                                   />
                        </span>
                        <label className="form-check-label" htmlFor="id_targetperiods-timeframe_0">
                            { gettext('Show all') }
                        </label>
                    </div>
                    <div className={
                        classNames('form-check', 'form-check-inline', 'pt-1',
                            {'form-check-inline--is-disabled': this.props.rootStore.periodCountDisabled})
                    }>
                        <span className="form-check-input">
                            <input type="radio"
                                   checked={ this.props.rootStore.mostRecent }
                                   disabled={ this.props.rootStore.periodCountDisabled }
                                   onChange={ this.props.rootStore.setMostRecent }
                                   id="id_targetperiods-timeframe_1"
                                   />
                        </span>
                        <label className="form-check-label" htmlFor="id_targetperiods-timeframe_1">
                            { gettext('Most recent') }
                        </label>
                    </div>
                    <div>
                        <input type="text" className="form-control"
                           value={ this.props.rootStore.mostRecentCountDisplay }
                           disabled={ this.props.rootStore.periodCountDisabled }
                           placeholder={ gettext('enter a number') }
                           onChange={ this.setMostRecentCount }
                           />
                    </div>
               </div>;
    }
}
