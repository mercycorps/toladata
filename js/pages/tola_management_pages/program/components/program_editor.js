import React from 'react'
import { observer } from "mobx-react"

@observer
export default class ProgramEditor extends React.Component {

    updateActivePage(new_page) {
        if(!this.props.new) {
            this.props.notifyPaneChange(new_page)
        }
    }

    render() {
        const {ProfileSection, SettingsSection, HistorySection, active_pane} = this.props

        const profile_active_class = (active_pane == 'profile')?'active':''
        const settings_active_class = (active_pane == 'settings')?'active':''
        const history_active_class = (active_pane == 'status_and_history')?'active':''
        const new_class = (this.props.new)?'disabled':''

        return (
            <div className="user-editor tab-set--vertical">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <a href="#" className={`nav-link ${profile_active_class}`}
                            onClick={(e) => { e.preventDefault(); this.updateActivePage('profile');}}>
                            {gettext("Profile")}
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className={`nav-link ${settings_active_class} ${new_class}`}
                            onClick={(e) => { e.preventDefault(); this.updateActivePage('settings');}}>
                            {gettext("Settings")}
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className={`nav-link ${history_active_class} ${new_class}`}
                            onClick={(e) => { e.preventDefault(); this.updateActivePage('status_and_history')}}>
                            {gettext("Status and History")}
                        </a>
                    </li>
                </ul>
                <div className="tab-content">
                    {active_pane == 'profile' &&
                    <ProfileSection />
                    }
                    {active_pane == 'settings' &&
                    <SettingsSection />
                    }
                    {active_pane == 'status_and_history' &&
                    <HistorySection />
                    }
                </div>
            </div>
        )
    }
}
