import axios from 'axios';
import qs from 'qs';

const api = {
    apiInstance: axios.create({
        withCredentials: true,
        baseURL: '/indicators/api/',
        responseType: 'json',
        headers: {
            "X-CSRFToken": document.cookie.replace(/(?:(?:^|.*;\s*)csrftoken\s*\=\s*([^;]*).*$)|^.*$/, "$1")
        }
    }),
    indicatorsInstance: axios.create({
        withCredentials: true,
        baseURL: '/indicators/',
        responseType: 'json',
        headers: {
            "X-CSRFToken": document.cookie.replace(/(?:(?:^|.*;\s*)csrftoken\s*\=\s*([^;]*).*$)|^.*$/, "$1")
        }
    }),
    documentInstance: axios.create({
        withCredentials: true,
        baseURL: '/indicators/api/',
        responseType: 'document',
        headers: {
            "X-CSRFToken": document.cookie.replace(/(?:(?:^|.*;\s*)csrftoken\s*\=\s*([^;]*).*$)|^.*$/, "$1")
        },
        transformResponse: [response => new XMLSerializer().serializeToString(response)]
    }),
    formPostInstance: axios.create({
        withCredentials: true,
        baseURL: '/indicators/api/',
        responseType: 'json',
        headers: {
            "X-CSRFToken": document.cookie.replace(/(?:(?:^|.*;\s*)csrftoken\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
            'content-type': 'application/x-www-form-urlencoded'
        },
    }),
    apiSession: axios.create({
        withCredentials: true,
        responseType: 'json',
        headers: {
            "X-CSRFToken": document.cookie.replace(/(?:(?:^|.*;\s*)csrftoken\s*\=\s*([^;]*).*$)|^.*$/, "$1")
        }
    }),
    templatesInstance: axios.create({
        withCredentials: true,
        responseType: 'blob',
        headers: {
            "X-CSRFToken": document.cookie.replace(/(?:(?:^|.*;\s*)csrftoken\s*\=\s*([^;]*).*$)|^.*$/, "$1")
        }
    }),
    logFailure(failureMsg) {
        console.log("api call failed:", failureMsg);
    },
    getProgramPageUrl(programPk) {
        return !isNaN(parseInt(programPk)) ? `/program/${programPk}/` : false;
    },
    programLevelOrdering(programPk) {
        return this.apiInstance.get(`/program/ordering/${programPk}/`)
        .then(response => response.data)
        .catch(this.logFailure);
    },
    rfLevelOrdering(programPk) {
        return this.apiInstance.get(`/program/level_ordering/${programPk}/`)
        .then(response => response.data)
        .catch(this.logFailure);
    },
    indicatorResultsTable(indicatorPk, editable) {
        return this.documentInstance.get(`/result_table/${indicatorPk}/`, {params: {raw: true, edit: editable}})
            .then(response => response.data)
            .catch(this.logFailure);
    },
    updateProgramPageIndicator(indicatorPk) {
        return this.apiInstance.get(`/program_page/indicator/${indicatorPk}/`)
        .then(response => response.data)
        .catch(this.logFailure);
    },
    updateAllProgramPageIndicators(programPk) {
        return this.apiInstance.get(`/program_page/${programPk}/`)
        .then(response => response.data)
        .catch(this.logFailure);
    },
    async getProgramPeriodData(programPk) {
        // return await this.apiInstance.get(`/program_period_update/${programPk}/`)
        // .then(response => response.data)
        // .catch(this.logFailure);
        return await {
            has_regular_target_frequencies: false,
            readOnly: false,
            idaa_start_date: "2020-09-16",
            idaa_end_date: "2025-09-15",
            // idaa_start_date: null,
            // idaa_end_date: null,
            // reporting_period_start: "", 
            reporting_period_start: "2020-01-01", 
            reporting_period_end: "2027-01-31",
        }
    },
    async updateProgramPeriodData(programPk, data) {
        return await this.apiInstance.put(`/program_period_update/${programPk}`, data)
        .then(response => response.data)
        .catch(() => {
            this.logFailure
            // return {status: 400, failmsg: "Did not save."}
            return {status: 400}
        });
        // return await {"Updated Dates": data}
    },
    ipttFilterData(programPk) {
        return this.apiInstance.get(`/iptt/${programPk}/filter_data/`)
                    .then(response => response.data)
                    .catch(this.logFailure);
    },
    getIPTTReportData({programPk, frequency, reportType} = {}) {
        return this.apiInstance.get(`/iptt/${programPk}/report_data/`,
                                    {params: {frequency: frequency, report_type: reportType}})
                    .then(response => response.data)
                    .catch(this.logFailure);
    },
    savePinnedReport(reportData) {
        window.sendGoogleAnalyticsEvent({
            category: "IPTT",
            action: "Pin",
            label: qs.stringify(reportData)
        });
        return this.formPostInstance.post(`/pinned_report/`, qs.stringify(reportData))
                    .catch(err => {
                        if (err?.response?.data?.error_code == 'DUPLICATE') {
                            // this error is expectecd - throw it so it gets handled by the catch on the other side
                                throw 'DUPLICATE';
                        } else {
                            // this error is unexpected, log it and go
                            this.logFailure(err);
                        }
                    });
    },
    updateIPTTIndicator(indicatorPk) {
        return this.apiInstance.get(`/iptt/indicator/${indicatorPk}/`)
                    .then(response => response.data)
                    .catch(this.logFailure);
    },
    async checkSessions (query) {
        return await this.apiSession.get('/update_user_session/',
            {params: {query: query}})
        .then(response => response.data)
        .catch(this.logFailure)
    },
    updateSessions (sessionVarsToUpdate) {
        return this.apiSession.put('/update_user_session/', sessionVarsToUpdate)
            .then(response => response.statusText)
            .catch(this.logFailure)
    },
    async downloadTemplate (program_id, tierLevelsRows) {
        let flatTierLevelsRows = tierLevelsRows.reduce((accumulator, currentValue) => {
            accumulator[currentValue.name] = currentValue.rows;
            return accumulator
        }, {})
        return await this.templatesInstance.get(`/indicators/api/bulk_import_indicators/${program_id}/`, { params: flatTierLevelsRows })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                // # Translators: This is the file name of an Excel template that will be used for batch imports
                link.setAttribute('download', gettext('Import indicators.xlsx'));
                document.body.appendChild(link);
                link.click();
                return response;
            })
            .catch((error) => {
                this.logFailure(error);
                return error.response;
            })
    },
    async uploadTemplate(program_id, file) {
        if (file && (file.type.startsWith('application/vnd.ms-excel') || file.type.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'))) {
            let formData = new FormData()
            formData.append('file', file)
            return await this.apiSession.post(`/indicators/api/bulk_import_indicators/${program_id}/`,
                    formData, {headers: {'Content-Type': 'multipart/form-data'}}
                )
                .then(response => response)
                .catch(error => {
                    console.log(error);
                    this.logFailure(error);
                    return error.response;
                })
        } else {
            return {status: 406, data: {error_codes: [113]}}
        }
    },
    async downloadFeedback(program_id) {
        return await this.templatesInstance.get(`/indicators/api/get_feedback_bulk_import_template/${program_id}/`)
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', gettext('Import indicators.xlsx'));
                document.body.appendChild(link);
                link.click();
                return response;
            })
            .catch((error) => {
                this.logFailure(error);
                return error.response;
            })
    },
    async confirmUpload(program_id) {
        return await this.apiInstance.post(`/save_bulk_import_data/${program_id}/`)
            .then(response => response)
            .catch((error) => {
                this.logFailure(error);
                return error.response;
            })
    },
    async getPCountResultCreateData(indicator_id) {
        return await this.apiInstance.get(`/pcount_result_create/${indicator_id}`)
            .then(response => response)
            .catch(error => {
                this.logFailure(error);
                return error.response;
            })
    },
    async createPCountResult(indicator_id, form_data) {
        return await this.apiInstance.post(`/pcount_result_create/${indicator_id}`,
            form_data, {headers: {'Content-Type': 'application/json'}})
            .then(response => response)
            .catch(error => {
                this.logFailure(error);
                return error.response;
            })
    },
    async getPCountResultUpdateData(result_id) {
        return await this.apiInstance.get(`/pcount_result_update/${result_id}`)
            .then(response => response)
            .catch(error => {
                this.logFailure(error);
                return error.response;
            })
    },
    async updatePCountResult(result_id, form_data) {
        return await this.apiInstance.put(`/pcount_result_update/${result_id}`,
            form_data, {headers: {'Content-Type': 'application/json'}})
            .then(response => response)
            .catch(error => {
                this.logFailure(error);
                return error.response;
            })
    },
};


export default api;
