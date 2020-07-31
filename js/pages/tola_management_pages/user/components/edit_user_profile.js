import React from 'react'
import Select from 'react-select'
import { observer } from "mobx-react"
import { toJS } from 'mobx'

@observer
export default class EditUserProfile extends React.Component {
    constructor(props) {
        super(props)
        const {userData} = props
        const filtered_orgs = props.organizations.filter(o => o.value != 1 || props.is_superuser)
        let organization_listing = []
        for (let org of filtered_orgs) {
            let org_js = toJS(org);
            if (org_js.label === "Mercy Corps"){
                // # Translators: This is an deactivated menu item visible to users, indicating that assignment of this option is manaaged by another system.
                org_js.label = gettext("Mercy Corps -- managed by Okta");
                org_js.isDisabled = true;
            }
            organization_listing.push(org_js)
        }

        const selected_organization = organization_listing.find(o => o.value == userData.organization_id)
        this.hasMCEmail = userData.email.endsWith("@mercycorps.org");
        this.state = {
            original_user_data: {...userData},
            managed_user_data: {...userData},
            selected_organization,
            organization_listing
        }
    }

    save() {
        this.props.onUpdate(this.state.managed_user_data)
    }

    saveNew(e) {
        e.preventDefault()
        this.props.onCreate(this.state.managed_user_data)
    }

    saveNewAndAddAnother(e) {
        e.preventDefault()
        this.props.onCreateAndAddAnother(this.state.managed_user_data)
    }

    updateFirstName(new_first_name) {
        this.setState({
            managed_user_data: {
                ...this.state.managed_user_data,
                first_name: new_first_name,
            }
        }, () => this.hasUnsavedDataAction())
    }

    updateLastName(new_last_name) {
        this.setState({
            managed_user_data: {
                ...this.state.managed_user_data,
                last_name: new_last_name,
            }
        }, () => this.hasUnsavedDataAction())
    }

    updateUsername(new_username) {
        this.setState({
            managed_user_data: {
                ...this.state.managed_user_data,
                username: new_username,
            }
        }, () => this.hasUnsavedDataAction())
    }

    updateOrganization(new_option) {
        this.setState({
            managed_user_data: {
                ...this.state.managed_user_data,
                organization_id: new_option.value,
            },
            selected_organization: new_option
        }, () => this.hasUnsavedDataAction())
    }

    updateTitle(new_title) {
        this.setState({
            managed_user_data: {
                ...this.state.managed_user_data,
                title: new_title,
            }
        }, () => this.hasUnsavedDataAction())
    }

    updateEmail(new_email) {
        this.setState({
            managed_user_data: {
                ...this.state.managed_user_data,
                email: new_email,
            }
        }, () => this.hasUnsavedDataAction())
    }

    updatePhone(new_phone) {
        this.setState({
            managed_user_data: {
                ...this.state.managed_user_data,
                phone_number: new_phone,
            }
        }, () => this.hasUnsavedDataAction())
    }

    updateModeOfContact(new_mode_of_contact) {
        this.setState({
            managed_user_data: {
                ...this.state.managed_user_data,
                mode_of_contact: new_mode_of_contact,
            }
        }, () => this.hasUnsavedDataAction())
    }

    hasUnsavedDataAction() {
        this.props.onIsDirtyChange(JSON.stringify(this.state.managed_user_data) != JSON.stringify(this.state.original_user_data))
    }

    resetForm() {
        const selected_organization = this.state.organization_listing.find(o => o.value == this.state.original_user_data.organization_id)
        this.setState({
            managed_user_data: this.state.original_user_data,
            selected_organization
        }, () => this.hasUnsavedDataAction())
    }

    render() {
        const ud = this.state.managed_user_data
        const e = this.props.errors
        const disabled = this.props.disabled
        const error_classes = {
            first_name: (e.first_name)?'is-invalid':'',
            last_name: (e.last_name)?'is-invalid':'',
            username: (e.username)?'is-invalid':'',
            email: (e.email)?'is-invalid':'',
            organization: (e.organization_id)?'is-invalid':''
        }
        return (
            <div className="tab-pane--react">
                <h2 className="no-bold">{ud.name? ud.name+': ':''}{gettext("Profile")}</h2>
                <form className="form">
                    <div className="form-group">
                        <label className="label--required" htmlFor="user-first-name-input">{gettext("Preferred First Name")}</label>
                        <input
                            disabled={disabled || this.hasMCEmail}
                            className={"form-control "+error_classes.first_name}
                            type="text"
                            value={ud.first_name || ''}
                            onChange={(e) => this.updateFirstName(e.target.value) }
                            id="user-first-name-input"
                            required />
                        {e.first_name &&
                        <div className="invalid-feedback">
                            {e.first_name}
                        </div>
                        }
                    </div>
                    <div className="form-group">
                        <label className="label--required" htmlFor="user-last-name-input">{gettext("Preferred Last Name")}</label>
                        <input
                            disabled={disabled || this.hasMCEmail}
                            className={"form-control "+error_classes.last_name}
                            type="text"
                            value={ud.last_name || ''}
                            onChange={(e) => this.updateLastName(e.target.value) }
                            id="user-last-name-input"
                            required />
                        {e.last_name &&
                         <div className="invalid-feedback">
                             {e.last_name}
                         </div>
                        }
                     </div>
                     <div className="form-group">
                        <label className="label--required" htmlFor="user-username-input">{gettext("Username")}</label>
                        <input
                            disabled={disabled || this.hasMCEmail}
                            className={"form-control "+error_classes.username}
                            type="text"
                            value={ud.username || ''}
                            onChange={(e) => this.updateUsername(e.target.value) }
                            id="user-username-input"
                            required />
                        {e.username &&
                         <div className="invalid-feedback">
                             {e.username}
                         </div>
                        }
                    </div>
                    <div className="form-group">
                        <label className="label--required" htmlFor="user-organization-input">{gettext("Organization")}</label>
                        <Select
                            isDisabled={disabled || this.hasMCEmail}
                            className={"react-select "+error_classes.organization}
                            value={this.state.selected_organization}
                            options={this.state.organization_listing}
                            onChange={(e) => this.updateOrganization(e)}
                            // # Translators: This is the default option for a dropdown menu
                            placeholder={gettext("None Selected")}
                            id="user-organization-input" />
                        {e.organization_id &&
                        <div className="invalid-feedback feedback--react-select">
                            {e.organization_id}
                        </div>
                        }
                    </div>
                    <div className="form-group">
                        <label htmlFor="user-title-input">{gettext("Title")}</label>
                        <input
                            disabled={disabled}
                            maxLength="50"
                            type="text"
                            value={ud.title || ''}
                            onChange={(e) => this.updateTitle(e.target.value)}
                            className="form-control"
                            id="user-title-input" />
                    </div>
                    <div className="form-group">
                        <label className="label--required" htmlFor="user-email-input">{gettext("Email")}</label>
                        <input
                            disabled={disabled || this.hasMCEmail}
                            className={"form-control "+error_classes.email}
                            type="email"
                            value={ud.email || ''}
                            onChange={(e) => this.updateEmail(e.target.value)}
                            id="user-email-input" />
                        {e.email &&
                        <div className="invalid-feedback">
                            {e.email}
                        </div>
                        }
                    </div>
                    <div className="form-group">
                        <label htmlFor="user-phone-input">{gettext("Phone")}</label>
                        <input
                            disabled={disabled}
                            type="tel"
                            value={ud.phone_number || ''}
                            onChange={(e) => this.updatePhone(e.target.value)}
                            className="form-control"
                            id="user-phone-input" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="user-mode-of-contact-input">{gettext("Preferred Mode of Contact")}</label>
                        <input
                            disabled={disabled}
                            type="text"
                            value={ud.mode_of_contact || ''}
                            onChange={(e) => this.updateModeOfContact(e.target.value)}
                            className="form-control"
                            id="user-mode-of-contact-input" />
                    </div>
                    {this.props.new && !disabled &&
                    <div className="form-group btn-row">
                        <button className="btn btn-primary" type="button" onClick={(e) => this.saveNew(e)}>{gettext("Save changes")}</button>
                        <button className="btn btn-secondary" onClick={(e) => this.saveNewAndAddAnother(e)}>{gettext("Save And Add Another")}</button>
                        <button className="btn btn-reset" type="button" onClick={() => this.resetForm()}>{gettext("Reset")}</button>
                    </div>
                    }
                    {!this.props.new && !disabled &&
                    <div className="form-group btn-row">
                        <button className="btn btn-primary" type="button" onClick={(e) => this.save()}>{gettext("Save changes")}</button>
                        <button className="btn btn-reset" type="button" onClick={() => this.resetForm()}>{gettext("Reset")}</button>
                    </div>
                    }
                </form>
            </div>
        )
    }
}
