import {api} from '../../../api';


export const fetchPrograms = (page, filters) => {
    return api.get('/tola_management/program/', {params: {page: page, ...filters}}).then(response => {
        let data = response.data
        let results = data.results
        let total_results = data.count
        let total_pages = data.page_count
        let next_page = data.next
        let prev_page = data.previous

        return {
            results,
            total_results,
            total_pages,
            next_page,
            prev_page,
        }
    })
}

export const fetchProgramsForFilter = (filters) => {
    return api.get('/tola_management/program/program_filter_options', {params: {...filters}})
}

export const createProgram = (data) => api.post('/tola_management/program/', data)

export const updateProgram = (id, data) => api.put(`/tola_management/program/${id}/`, data)

// endpoint to check if gait ID is unique and return a GAIT link to view similar programs if it is not.
export const validateGaitId = (gaitId, id) => api.get(`/tola_management/program/${id}/gait/${gaitId}/`)

export const updateProgramFundingStatusBulk = (ids, funding_status) => {
    return api.post('/tola_management/program/bulk_update_status/', {ids, funding_status})
}

export const fetchProgramHistory = (id) => api.get(`/tola_management/program/${id}/history/`)

export default {
    fetchPrograms,
    fetchProgramsForFilter,
    fetchProgramHistory,
    createProgram,
    updateProgram,
    updateProgramFundingStatusBulk,
    validateGaitId
}
