import React from 'react';
import { observer, inject } from 'mobx-react';
import { GroupBySelect } from '../../../components/selectWidgets';


const SubTitleRow = inject('dataStore', 'filterStore')(
    observer(({ dataStore, filterStore }) => {
        return (
            <div className="logframe__subheader">
                { dataStore.results_framework &&
                    <a href={ dataStore.results_framework_url }>
                        <i className="fas fa-sitemap"></i>&nbsp;
                        {
                            gettext('View results framework')
                        }
                    </a>
                }
                { dataStore.results_framework &&
                    <GroupBySelect
                        chainLabel={ dataStore.rf_chain_sort_label }
                        value={ filterStore.groupBy }
                        update={ e => { filterStore.setGroupBy(e.target.value); } }
                        labelClass="col-form-label text-append-colon"
                        formGroupClass="form-row inline-select"
                    />
                }
            </div>
        )
    })
)

export default SubTitleRow;
