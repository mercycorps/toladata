import {api} from '../../../api';

export const fetchUsersWithFilter = (page, filters) => api.get('/tola_management/user/', {params: {page: page, ...filters}}).then(response => {
    let data = response.data

    let total_results_count = data.count
    let current_results_count = data.results.length
    let total_pages = data.page_count

    return {
        users: data.results,
        total_pages: total_pages,
        total_users: total_results_count,
        next_page: data.next,
        prev_page: data.previous
    }
})

export const fetchUser = (user_id) => api.get(`/tola_management/user/${user_id}/`).then(response => response.data)

export const saveUserProfile = (user_id, data) => api.put(`/tola_management/user/${user_id}/`, data).then((response) => {
    return response.data
})

export const updateUserIsActive = (user_id, data) => api.put(`/tola_management/user/${user_id}/is_active/`, data).then(response => response.data)

export const fetchUserProgramAccess = (user_id) => api.get(`/tola_management/user/${user_id}/program_access/`).then(response => response.data)

export const saveUserPrograms = (user_id, data) => api.put(`/tola_management/user/${user_id}/program_access/`, data).then(response => {

})

export const fetchUserHistory = (user_id) => api.get(`/tola_management/user/${user_id}/history/`).then(response => response.data)

export const createUser = (new_user_data) => api.post(`/tola_management/user/`, new_user_data).then(response => {
    return response.data
})

export const resendRegistrationEmail = (user_id) => api.get(`/tola_management/user/${user_id}/resend_registration_email/`, {}).then(response => response.data)

export const bulkUpdateUserStatus = (user_ids, new_status) => api.post(`/tola_management/user/bulk_update_status/`, {user_ids, new_status}).then(response => response.data)
export const bulkAddPrograms = (user_ids, added_programs) => api.post(`/tola_management/user/bulk_add_programs/`, {user_ids, added_programs}).then(response => response.data)
export const bulkRemovePrograms = (user_ids, removed_programs) => api.post(`/tola_management/user/bulk_remove_programs/`, {user_ids, removed_programs}).then(response => response.data)

export const fetchUserAggregates = (user_id) => api.get(`/tola_management/user/${user_id}/aggregate_data/`).then(response => response.data)

export default {
    fetchUsersWithFilter,
    fetchUser,
    saveUserProfile,
    fetchUserProgramAccess,
    saveUserPrograms,
    fetchUserHistory,
    createUser,
    resendRegistrationEmail,
    bulkUpdateUserStatus,
    bulkAddPrograms,
    bulkRemovePrograms,
    fetchUserAggregates,
    updateUserIsActive
}
