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
        return await this.templatesInstance.get(`/indicators/bulk_import_indicators/${program_id}/`, { params: {tierLevelsRows: tierLevelsRows} })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'BulkIndicatorImport.xlsx');
                document.body.appendChild(link);
                link.click();
                return response;
            })
            .catch((error) => {
                this.logFailure(error)
                return {error};
            })
    },
    async uploadTemplate(data) {
        // TODO
            // Send to backend
        console.log("API request to send Templates");
            return await Promise.resolve( {statusText: "OK", data: {valid: 16, invalid: 0}} )
                .then(response => new Promise( resolve => {
                    // Mock varied delayed response from the backend to see variation of the loading spinner. Will be removed once it is actually connected to the backend
                    let timeOptions = [500, 900, 1000, 2000, 3000]
                    let delay = timeOptions[Math.floor(Math.random() * 5)]
                    setTimeout(() => {
                        resolve( response.data )
                    }, delay);
                }))
                .catch((error) => {
                    this.logFailure(error)
                    return {error};
                })    
    },
    async confirmUpload() {
        // TODO
            // Send to backend
        console.log("API request to Confirm");
        return await Promise.resolve( {statusText: "OK"} )
            .then(response => new Promise( resolve => {
                // Mock varied delayed response from the backend to see variation of the loading spinner. Will be removed once it is actually connected to the backend
                let timeOptions = [500, 900, 1000, 2000, 3000]
                let delay = timeOptions[Math.floor(Math.random() * 5)]
                setTimeout(() => {
                    resolve( response.statusText )
                }, delay);
            }))
            .catch((error) => {
                this.logFailure(error);
                return {error};
            })    
    }
};


export default api;
