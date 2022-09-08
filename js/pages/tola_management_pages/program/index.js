import React from 'react';
import ReactDOM from 'react-dom';
import {ProgramStore} from './models';
import {IndexView} from './views';
import api from './api';

const app_root = '#app_root'


/*
 * Model/Store setup
 */

const {
    country_filter,
    organization_filter,
    users_filter,
    allCountries,
    countries,
    organizations,
    users,
    programFilterPrograms,
    sectors,
    idaa_sectors,
    idaa_outcome_themes,
} = jsContext

/* formatting filters to be used by the ProgramStore */
const makeCountryOptions = (country_ids) => country_ids.map(id => countries[id]).map(country => ({label: country.name, value: country.id}))
const makeOrganizationOptions = (org_ids) => org_ids.map(id => organizations[id]).map(org => ({label: org.name, value: org.id}))
const makeUserOptions = (user_ids) => user_ids.map(id => users[id]).map(user => ({label: user.name, value: user.id}))

const filters = {
    countries: makeCountryOptions(country_filter),
    organizations: makeOrganizationOptions(organization_filter),
    users: makeUserOptions(users_filter)
}

const initialData = {
    countries,
    allCountries,
    organizations,
    programFilterPrograms,
    sectors,
    idaa_sectors,
    idaa_outcome_themes,
    filters,
    users,
    idaa_sectors
}
const store = new ProgramStore(
    api,
    initialData,
);


ReactDOM.render(
    <IndexView store={store} />,
    document.querySelector(app_root)
);
