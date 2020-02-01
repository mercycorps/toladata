export const countryBaseAdminChange = [{
    id: 1,
    date: "2020-01-28 16:00:00",
    admin_user: "Pat Jones",
    disaggregation_type: 50,
    disaggregation_type_name: "I am a type",
    change_type: "country_disaggregation_updated",
    pretty_change_type: "Country disaggregation updated",
}];

export const countryDisaggTypeChanged = {
    name: "disaggregation_type",
    pretty_name: "Disaggregation type",
    prev: "asdf",
    new: "asdf222",
};

export const countryDisaggLabelsChanged = {
    name: "labels",
    pretty_name: "Disaggregation categories",
    prev: {
        2080: {id: 2080, label: "category 1", custom_sort: 1},
        2081: {id: 2081, label: "category 2", custom_sort: 3},
        2082: {id: 2082, label: "category 3", custom_sort: 2},
    },
    new: {
        2080: {id: 2080, label: "category 11", custom_sort: 2},
        2081: {id: 2081, label: "category 22", custom_sort: 1},
        2082: {id: 2082, label: "category 33", custom_sort: 3},
    }
};

export const userChangeLog = '[{"id":60,"date":"2020-01-29 10:48:56","admin_user":"Pat Smith","modified_user":10,"change_type":"user_programs_updated","diff_list":{"countries":[{"name":"4","prev":{"country":"N/A","role":"N/A"},"new":{"country":"Bangladesh","role":"user"}},{"name":"5","prev":{"country":"N/A","role":"N/A"},"new":{"country":"Bahamas","role":"user"}}],"programs":[{"name":"12_572","prev":{"role":"N/A","program":"N/A","country":"N/A"},"new":{"role":"medium","program":"Do Wah Diddy","country":"United States"}}]},"pretty_change_type":"User programs updated"},{"id":61,"date":"2020-01-27 15:53:28","admin_user":"Path Smit","modified_user":10,"change_type":"user_profile_updated","diff_list":[{"name":"first_name","pretty_name":"First name","prev":"Anna","new":"Annie"},{"name":"last_name","pretty_name":"Last name","prev":"Jones","new":"Smith"}],"pretty_change_type":"User profile updated"},{"id":62,"date":"2020-01-27 15:53:09","admin_user":"Path Smit","modified_user":10,"change_type":"user_profile_updated","diff_list":[{"name":"last_name","pretty_name":"Last name","prev":"Jones","new":"Smith"}],"pretty_change_type":"User profile updated"}]'

export const programChangeLog = '[{"id":2,"date":"2020-01-29 11:20:35","admin_user":"Pat Jones","change_type":"program_updated","diff_list":[{"name":"name","pretty_name":"Name","prev":"Program Example","new":"Program Example Change"},{"name":"sectors","pretty_name":"Sectors","prev":"Agribusiness,Agriculture","new":"Agribusiness"},{"name":"countries","pretty_name":"Countries","prev":"Kenya,United States","new":"United States"}],"pretty_change_type":"Program updated"},{"id":1,"date":"2020-01-29 11:19:58","admin_user":"Pat Smith","change_type":"program_created","diff_list":[{"name":"gaitid","pretty_name":"GAIT ID","prev":"","new":"123"},{"name":"name","pretty_name":"Name","prev":"","new":"Program Example"},{"name":"funding_status","pretty_name":"Funding status","prev":"","new":"Funded"},{"name":"cost_center","pretty_name":"Cost center","prev":"","new":null},{"name":"description","pretty_name":"Description","prev":"","new":""},{"name":"sectors","pretty_name":"Sectors","prev":"","new":"Agribusiness,Agriculture"},{"name":"countries","pretty_name":"Countries","prev":"","new":"Kenya,United States"}],"pretty_change_type":"Program created"}]';

export const organizationChangeLog = '[{"id":14,"date":"2020-01-29 11:24:34","admin_user":"Pat Smith","change_type":"organization_updated","diff_list":[{"name":"name","pretty_name":"Name","prev":"Organization Example","new":"Organization Example Changed"},{"name":"primary_address","pretty_name":"Primary address","prev":"Primary contact address","new":"Primary contact address changed"},{"name":"primary_contact_name","pretty_name":"Primary contact name","prev":"Primary Contact Name","new":"Primary Contact Name changed"},{"name":"primary_contact_email","pretty_name":"Primary contact email","prev":"primarycontact@example.com","new":"primarycontactchanged@example.com"}],"pretty_change_type":"Organization updated"},{"id":13,"date":"2020-01-29 11:24:09","admin_user":"Pat Smith","change_type":"organization_created","diff_list":[{"name":"name","pretty_name":"Name","prev":"","new":"Organization Example"},{"name":"primary_address","pretty_name":"Primary address","prev":"","new":"Primary contact address"},{"name":"primary_contact_name","pretty_name":"Primary contact name","prev":"","new":"Primary Contact Name"},{"name":"primary_contact_email","pretty_name":"Primary contact email","prev":"","new":"primarycontact@example.com"},{"name":"primary_contact_phone","pretty_name":"Primary contact phone","prev":"","new":"5551212"},{"name":"mode_of_contact","pretty_name":"Mode of contact","prev":"","new":""},{"name":"is_active","pretty_name":"Is active","prev":"","new":true},{"name":"sectors","pretty_name":"Sectors","prev":"","new":["Basic Needs"]}],"pretty_change_type":"Organization created"}]';
