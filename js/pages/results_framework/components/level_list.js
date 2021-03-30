import React from 'react';
import { observer, inject } from "mobx-react"
import { toJS } from 'mobx';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCaretDown, faCaretRight, faSitemap } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {LevelCardCollapsed, LevelCardExpanded} from "./level_cards";
import {ExpandAllButton, CollapseAllButton} from "../../../components/actionButtons";

library.add(faCaretDown, faCaretRight, faSitemap);

@inject('rootStore')
@observer
class LevelList extends React.Component {

    render() {
        let renderList = [];
        if (this.props.renderList == 'initial') {
            renderList = this.props.rootStore.levelStore.sortedLevels
                .filter(level => ['root', null].indexOf(level.parent) != -1)
        }

        else{
            renderList = this.props.renderList.sort((a, b) => a.customsort - b.customsort);
        }

        return renderList.map((elem) => {
            let card = '';
            if (this.props.rootStore.uiStore.activeCard == elem.id) {
                card =
                    <LevelCardExpanded
                        level={elem}
                        levelProps={this.props.rootStore.levelStore.levelProperties[elem.id]}/>
            }
            else {
                card =
                    <LevelCardCollapsed
                        level={elem}
                        levelProps={this.props.rootStore.levelStore.levelProperties[elem.id]}/>
            }

            let children = this.props.rootStore.levelStore.sortedLevels.filter(level => level.parent == elem.id);
            let childLevels = null;
            if (children.length > 0){
                childLevels =  <LevelList
                    rootStore={this.props.rootStore}
                    renderList={children}/>
            }

            return (
                <div key={elem.id} className="leveltier--new">
                    {card}
                    {childLevels}
                </div>
            )
    })}
}

@inject('rootStore')
@observer
export class LevelListPanel  extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show_import_banner: false
        };
    }

    getWarningText = () => {
        return {__html: this.props.rootStore.uiStore.splashWarning }
    };

    // Handles getting the show/hide flag for the Bulk Import Banner in Django's Session Storage
    componentDidMount = () => {
        $.ajax({
            type: "GET",
            url: "/update_user_session/",
            contentType: "application/json",
            data: {
                query: "show_import_banner"
            }
            ,
            success: (data) => {
                this.setState({
                    show_import_banner: data.result
                })
            },
            error: (error) => {
                console.log('Error:', error.statusText);
            }
        })
    }

    render() {
        const isCollapseAllDisabled = this.props.rootStore.uiStore.hasVisibleChildren.length === 0 ||
            this.props.rootStore.uiStore.disableCardActions ||
            this.props.rootStore.uiStore.activeCard;
        let expandoDiv = null;
        if (this.props.rootStore.levelStore.levels.filter( l => l.id !== "new").length > 1){
            const excelClickHandler = () => {
                window.sendGoogleAnalyticsEvent({
                    category: "Results Framework Builder",
                    action: "Export",
                    label: `Program ${this.props.rootStore.levelStore.program_id}`
                });
                window.open(this.props.rootStore.levelStore.excelURL, '_blank')
            }
            expandoDiv =
                <div className="level-list--expandos">
                    <div className="btn-group">
                        <ExpandAllButton
                        isDisabled={this.props.rootStore.uiStore.isExpandAllDisabled}
                        expandFunc={this.props.rootStore.uiStore.expandAllLevels} />
                        <CollapseAllButton
                        isDisabled={isCollapseAllDisabled}
                        collapseFunc={this.props.rootStore.uiStore.collapseAllLevels} />
                    </div>
                    <div className="level-list--action-buttons">
                        <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={ excelClickHandler }>
                            <i className="fas fa-download"></i>
                            {
                                //  # Translators: a button to download a spreadsheet
                                gettext('Excel')
                            }
                        </button>
                    </div>
                </div>;

        }
        let bulkImportBanner = 
            <div 
                role="alert" 
                id="bulk-import-banner-alert" 
                className="alert fade show" 
                hidden={this.state.show_import_banner !== true} // Hides Bulk Import Banner if stored as false in Django's Session Storage
            >
                <div className="bulk-alert-message">
                    <div className="bulk-alert-icon">
                        <i className="fas fa-bullhorn"></i>
                    </div>
                    <div className="bulk-alert-text">
                        <span>
                            {
                                // # Translators: A alert to let users know that instead of entering indicators one at a time, they can use an Excel template to enter multiple indicators at the same time. First step is to build the result framework below, then click the 'Import indicators' button above
                                gettext('Instead of entering indicators one at a time, use an Excel template to import multiple indicators! First, build your result framework below. Next, click the “Import indicators” button above.')
                            }
                        </span>
                    </div>
                </div>
                <button type="button" className="close" data-dismiss="alert" aria-label="Close" >
                    <span aria-hidden="true" className="x-modal">&times;</span>
                </button>
            </div>

        let panel = '';
        if (this.props.rootStore.levelStore.levels.length == 0) {
            panel =
                <div className="level-list-panel">
                    <div className="level-list-panel__dingbat">
                        <FontAwesomeIcon icon='sitemap'/>
                    </div>
                    <div className="level-list-panel__text text-large"
                         dangerouslySetInnerHTML={this.getWarningText()}/>
                </div>
        } else {
            panel =
                <div id="level-list" style={{flexGrow: "2"}}>
                    {expandoDiv}
                    {
                        this.props.rootStore.levelStore.accessLevel === 'high' && 
                        this.props.rootStore.levelStore.levels[0].id !== 'new' 
                        ? bulkImportBanner 
                        : null
                    }
                    <LevelList renderList='initial'/>
                </div>
        }
        return panel
    }
}
