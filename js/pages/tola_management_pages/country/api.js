import {api} from '../../../api';


export const fetchCountries = (page, filters) => {
    return api.get('/tola_management/country/', {params: {page: page, ...filters}}).then(response => {
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

export const createCountry = (data) => api.post('/tola_management/country/', data)

export const updateCountry = (id, data) => api.put(`/tola_management/country/${id}/`, data)

export const fetchCountryObjectives = (countryId) => {
    return api.get('/tola_management/countryobjective/', {params: {country: countryId}})
}

export const fetchCountryDisaggregations = (countryId) => {
    return api.get('/tola_management/countrydisaggregation/', {params: {country: countryId}})
}

export const createObjective = (data) => api.post('/tola_management/countryobjective/', data)
export const updateObjective = (id, data) => api.put(`/tola_management/countryobjective/${id}/`, data)
export const deleteObjective = (id) => api.delete(`/tola_management/countryobjective/${id}`)

export const createDisaggregation = (data) => api.post('/tola_management/countrydisaggregation/', data)
export const updateDisaggregation = (id, data) => api.put(`/tola_management/countrydisaggregation/${id}/`, data)
export const deleteDisaggregation = (id) => api.delete(`/tola_management/countrydisaggregation/${id}`)


export default {
    fetchCountries,
    fetchCountryObjectives,
    fetchCountryDisaggregations,
    createCountry,
    updateCountry,
    createObjective,
    updateObjective,
    deleteObjective,
    createDisaggregation,
    updateDisaggregation,
    deleteDisaggregation,
}
