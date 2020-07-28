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
        return this.formPostInstance.post(`/pinned_report/`, qs.stringify(reportData))
                    .catch(this.logFailure);
    },
    updateIPTTIndicator(indicatorPk) {
        return this.apiInstance.get(`/iptt/indicator/${indicatorPk}/`)
                    .then(response => response.data)
                    .catch(this.logFailure);
    }
    
};


export default api;