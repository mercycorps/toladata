import React from 'react';
import { observer, inject } from "mobx-react"
import { toJS } from 'mobx';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCaretDown, faCaretRight, faSitemap } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {LevelCardCollapsed, LevelCardExpanded} from "./level_cards";
import {ExpandAllButton, CollapseAllButton} from "../../../components/actionButtons";
import {ImportIndicatorsButton} from "../../../components/ImportIndicatorsPopover"
import api from "../../../apiv2"

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
    // These define the cases/views of the RF Builder's main panel component.
    // These different views determine when the expandos, excel, and import buttons are shown.
    // Empty for when there is no RF level at all. New for when the first RF level is started but not yet saved.
    // First for when theres only one RF level saved. Existing for when there are multiply RF levels saved
    EMPTY = 0
    NEW = 1;
    FIRST = 2;
    EXISTING = 3;

    constructor(props) {
        super(props);
        this.state = {
            show_import_banner: null,
            levelsString: "", // State used to store the prev RF levels in a string to determine when there is a change and triggers an componentDidUpdate.
            level_status: this.EMPTY, // State used to switch cases/views of the main RF Level panel component
        };
    }

    getWarningText = () => {
        return {__html: this.props.rootStore.uiStore.splashWarning }
    };

    componentDidMount = () => {
        this.setState({
            level_status: this.setLevelStatus(),
            levelsString: JSON.stringify(this.props.rootStore.levelStore.levels),
        })

        // Handles getting the show/hide flag for the Bulk Import Banner in Django's Session Storage
        api.checkSessions("show_import_banner")
        .then((response) => {
            if (response) {
                this.setState({
                    show_import_banner: response.data
                })
            }
        })
    }

    componentDidUpdate = (prevProps, prevState) => {
        if( this.state.levelsString !== JSON.stringify(this.props.rootStore.levelStore.levels) ) {
            this.setState({
                level_status: this.setLevelStatus(),
                levelsString: JSON.stringify(this.props.rootStore.levelStore.levels),
            })
        }
    }

    // Method used to change the views when starting to add the first levels to the RF Builder.
    setLevelStatus = () => {
        if (this.props.rootStore.levelStore.levels.length === 0) {
            return this.EMPTY;
        } else {
            if (this.props.rootStore.levelStore.levels.filter( l => l.id !== "new").length > 1) {
                return this.EXISTING;
            } else if(this.props.rootStore.levelStore.levels.filter( l => l.id !== "new").length === 1) {
                return this.FIRST;
            } else {
                return this.NEW
            }
        }
    }

    // Handles sending flags update to Django's Session Storage on banner close
    handleBannerClose = () => {
        api.updateSessions({show_import_banner: false})
    }

    render() {
        const isCollapseAllDisabled = this.props.rootStore.uiStore.hasVisibleChildren.length === 0 ||
            this.props.rootStore.uiStore.disableCardActions ||
            this.props.rootStore.uiStore.activeCard;
        const excelClickHandler = () => {
            window.sendGoogleAnalyticsEvent({
                category: "Results Framework Builder",
                action: "Export",
                label: `Program ${this.props.rootStore.levelStore.program_id}`
            });
            window.open(this.props.rootStore.levelStore.excelURL, '_blank')
        }
        let expandoDiv = (() => {
            switch(this.state.level_status) {
                case this.EMPTY || this.NEW:
                    return null;
                case this.FIRST:
                    return (
                        <div className="level-list--expandos" style={{flexDirection: "row-reverse"}}>
                            { this.props.rootStore.levelStore.accessLevel === "high" ? 
                                <ImportIndicatorsButton 
                                    program_id={ this.props.rootStore.levelStore.program_id }
                                    chosenTiers={ this.props.rootStore.levelStore.tierTemplates[this.props.rootStore.levelStore.chosenTierSetKey].tiers }
                                    levels={ this.props.rootStore.levelStore.levels }
                                    page={ "resultsFramework" }
                                /> 
                            : null }            
                        </div>
                    );
                case this.EXISTING:
                    return (
                        <div className="level-list--expandos">
                            <div className="btn-group">
                                <ExpandAllButton
                                isDisabled={this.props.rootStore.uiStore.isExpandAllDisabled}
                                expandFunc={this.props.rootStore.uiStore.expandAllLevels} />
                                <CollapseAllButton
                                isDisabled={isCollapseAllDisabled}
                                collapseFunc={this.props.rootStore.uiStore.collapseAllLevels} />
                            </div>
                            <div className="level-list--action-buttons" style={{display: "flex"}}>
                                { this.props.rootStore.levelStore.accessLevel === "high" && 
                                    <ImportIndicatorsButton 
                                        program_id={ this.props.rootStore.levelStore.program_id }
                                        chosenTiers={ this.props.rootStore.levelStore.tierTemplates[this.props.rootStore.levelStore.chosenTierSetKey].tiers }
                                        levels={ this.props.rootStore.levelStore.levels }
                                        page={ "resultsFramework" }
                                    /> 
                                }                                  
                                <button
                                    type="button"
                                    className="btn btn-sm btn-secondary ml-2"
                                    onClick={ excelClickHandler }>
                                    <i className="fas fa-download"></i>
                                    {
                                        //  # Translators: a button to download a spreadsheet
                                        gettext('Excel')
                                    }
                                </button>
                            </div>
                        </div>
                    );
            }
        })();

        let bulkImportBanner =
            <div
                role="alert"
                id="bulk-import-banner-alert"
                className="alert fade show"
            >
                <div className="bulk-alert-message">
                    <div className="bulk-alert-icon">
                        <i className="fas fa-bullhorn"></i>
                    </div>
                    <div className="bulk-alert-text">
                        <span>
                            {
                                // # Translators: A alert to let users know that instead of entering indicators one at a time, they can use an Excel template to enter multiple indicators at the same time. First step is to build the result framework below, then click the 'Import indicators' button above
                                gettext('Instead of entering indicators one at a time, use an Excel template to import multiple indicators! First, build your results framework below. Next, click the “Import indicators” button above.')
                            }
                        </span>
                    </div>
                </div>
                <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={this.handleBannerClose}>
                    <span aria-hidden="true" >&times;</span>
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
                        this.state.show_import_banner && // Hides Bulk Import Banner if stored as false in Django's Session Storage
                        this.props.rootStore.levelStore.accessLevel === 'high' &&
                        this.state.level_status !== 1
                            ? bulkImportBanner
                            : null
                    }
                    <LevelList renderList='initial'/>
                </div>
        }
        return panel
    }
}
