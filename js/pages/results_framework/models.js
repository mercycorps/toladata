import { observable, computed, action, toJS, runInAction, autorun } from "mobx";
import { api } from "../../api.js"

export class RootStore {
    constructor (program, levels, indicators, levelTiers, tierTemplates, englishTemplates, customTemplates, programObjectives, accessLevel, usingResultsFramework) {
        this.levelStore =  new LevelStore(program, levels, indicators, levelTiers, tierTemplates, englishTemplates, customTemplates, programObjectives, accessLevel, usingResultsFramework, this);
        this.uiStore = new UIStore(this);
    }
}

export class LevelStore {
    @observable levels = [];
    @observable indicators = [];
    @observable chosenTierSetKey = "";
    @observable chosenTierSet = [];
    program_id;
    tierTemplates;
    programObjectives;
    defaultTemplateKey = "";
    customTierSetKey = "";
    accessLevel = false;
    usingResultsFramework;

    constructor(program, levels, indicators, levelTiers, tierTemplates, englishTemplates, customTemplates, programObjectives, accessLevel, usingResultsFramework, rootStore) {
        this.rootStore = rootStore;
        this.levels = levels;
        this.indicators = indicators;
        this.englishTierTemlates = JSON.parse(englishTemplates);
        this.defaultTemplateKey = "mc_standard";
        this.customTierSetKey = "custom";
        this.program_id = program.id;
        this.manual_numbering = program.manual_numbering;
        this.programObjectives = programObjectives;
        this.accessLevel = accessLevel;

        this.tierTemplates = JSON.parse(tierTemplates);
        this.tierTemplates[this.customTierSetKey] = {name: "Custom"};
        this.tierTemplates[this.customTierSetKey]['tiers'] = customTemplates.map( ct => ct.name);
        console.log('tt', this.tierTemplates);


        // Set the stored tier set key and the values, if they exist.  Use the default if they don't.
        if (levelTiers.length > 0) {
            const origLevelTiers = levelTiers.map( t => t.name)
            this.chosenTierSetKey = this.deriveTemplateKey(origLevelTiers);
            if (this.chosenTierSetKey == this.customTierSetKey) {
                this.chosenTierSet = levelTiers.map(t => t.name);
            }
            else{
                this.chosenTierSet = this.tierTemplates[this.chosenTierSetKey]['tiers']
            }
        }
        else {
            this.chosenTierSetKey = this.defaultTemplateKey;
            this.chosenTierSet = this.tierTemplates[this.chosenTierSetKey]['tiers'];
        }

        this.usingResultsFramework = usingResultsFramework;

    }

    @computed get sortedLevels () {
        return this.levels.slice().sort((a, b) => {a.level_depth - b.level_depth || a.customsort - b.customsort})
    }

    @computed get levelProperties () {
        let levelProperties = {};

        for (let level of this.levels) {
            let properties = {};
            const childrenIds = this.getChildLevels(level.id).map( l => l.id);
            const indicatorCount = this.indicators.filter( i => i.level == level.id);

            properties['indicators'] = this.getLevelIndicators(level.id);
            properties['descendantIndicatorIds'] = this.getDescendantIndicatorIds(childrenIds);
            properties['ontologyLabel'] = this.buildOntology(level.id);
            properties['tierName'] = this.chosenTierSet[level.level_depth-1];
            properties['childTierName'] = null;
            if (this.chosenTierSet.length > level.level_depth) {
                properties['childTierName'] = this.chosenTierSet[level.level_depth];
            }

            properties['canDelete'] = childrenIds.length==0 && indicatorCount==0 && this.accessLevel=='high';
            properties['canEdit'] = this.accessLevel == 'high';
            levelProperties[level.id] = properties;
        }

        return levelProperties
    }

    @computed get chosenTierSetName () {
        console.log('template is', this.chosenTierSetKey, this.tierTemplates[this.chosenTierSetKey]);
        return this.tierTemplates[this.chosenTierSetKey]['name'];
    }

    // This monitors the number of indicators attached to the program and adds/removes the header link depending on
    // whether there are indicators.  It relies on all indicators being passed up from the server each time
    // the indicator list is refreshed.
    monitorHeaderLink = autorun( reaction => {
        let headerSpan = $("#rf_builder_header");
        let linkedFlag = headerSpan.children("a").length > 0;
        if (this.indicators.length > 0 && !linkedFlag ) {
            const headerText = headerSpan.text();
            headerSpan.html(`<a href="/program/${this.program_id}/">${headerText}</a>`)
        }
        else if (this.indicators.length == 0 && linkedFlag) {
            const headerText = $("#rf_builder_header > a").text();
            headerSpan.text(headerText);
        }
    // delay is needed to prevent undefined value from being used for program_id that isn't set yet on first load.
    }, {delay: 50});

    @action
    changeTierSet(newTierSetKey) {
        console.log('cchanging ', newTierSetKey);
        this.chosenTierSetKey = newTierSetKey;
        this.chosenTierSet = this.tierTemplates[newTierSetKey]['tiers'];
        if (this.chosenTierSetKey === this.customTierSetKey && this.chosenTierSet.length === 0) {
            this.chosenTierSet = ['']
        }
        console.log('chosentierset is', toJS(this.chosenTierSet));
    }

    @action
    updateCustomTier = (event) => {

        console.log('cchanging event', this.chosenTierSet[event.target.dataset.tierorder]);
        this.chosenTierSet[event.target.dataset.tierorder] = event.target.value;
        this.tierTemplates[this.customTierSetKey]['tiers'] = this.chosenTierSet;
        console.log('newcustom', toJS(this.tierTemplates[this.customTierSetKey]));
    };

    @action
    addCustomTier = () => {
        this.chosenTierSet.push("")
    };


    @action
    cancelEdit = levelId => {
        if (levelId == "new") {
            const targetLevel = this.levels.find(l => l.id == levelId);

            // First update any customsort values that were modified when this card was created
            let siblingsToReorder = this.levels.filter(l => {
                return l.customsort > targetLevel.customsort && l.parent == targetLevel.parent;
            });
            siblingsToReorder.forEach(sib => sib.customsort -= 1);

            // Now remove the new card
            this.levels.replace(this.levels.filter((element) => element.id != "new"));
        }

        this.fetchIndicatorsFromDB();
        this.rootStore.uiStore.removeActiveCard();
    };

    @action
    createNewLevelFromSibling = (siblingId) => {
        // Copy sibling data for the new level and then clear some of it out
        let sibling = toJS(this.levels.find( l => l.id == siblingId));
        let newLevel = Object.assign({}, sibling);
        newLevel.customsort += 1;
        newLevel.id = "new";
        newLevel.name = "";
        newLevel.assumptions = "";

        // bump the customsort field for siblings that come after the inserted Level
        let siblingsToReorder = this.levels.filter( l => {
            return sibling && l.customsort > sibling.customsort && l.parent == sibling.parent;
        });
        siblingsToReorder.forEach( sib => sib.customsort+=1);
        // add new Level to the various Store components
        this.rootStore.uiStore.activeCard = "new";
        this.levels.push(newLevel);
        setTimeout(
            function(){$("#level-card-new")[0].scrollIntoView({behavior:"smooth"})},
            100
        )
    };

    @action
    createNewLevelFromParent = (parentId) => {
        // Copy data for the new level and then clear some of it out
        let parent = toJS(this.levels.find( l => l.id == parentId));
        let newLevel = {
            id:"new",
            customsort: 1,
            name: "",
            assumptions: "",
            parent: parentId,
            level_depth: parent.level_depth + 1,
            program: this.program_id
        };

        // bump the customsort field for siblings that come after the inserted Level
        let siblingsToReorder = this.levels.filter( l => l.parent == parentId);

        siblingsToReorder.forEach( sib => sib.customsort+=1);
        // add new Level to the various Store components
        this.levels.push(newLevel);
        this.rootStore.uiStore.activeCard = "new";
        this.rootStore.uiStore.hasVisibleChildren.push(newLevel.parent)

    };

    @action
    createFirstLevel = () => {
        // Using "root" for parent id so the Django view can distinguish between top tier level and 2nd tier level
        let newLevel = {
            id: "new",
            program: this.program_id,
            name: "",
            assumptions: "",
            customsort: 1,
            level_depth: 1,
            parent: "root"
        };
        this.levels.push(newLevel);
        this.rootStore.uiStore.activeCard = "new";
    };

    saveLevelTiersToDB = () => {
        const tier_data = {program_id: this.program_id};
        if (this.chosenTierSetKey === "custom") {
            tier_data.tiers = this.chosenTierSet;
        }
        else {
            tier_data.tiers = this.englishTierTemlates[this.chosenTierSetKey]['tiers']
        }
        api.post(`/save_leveltiers/`, tier_data)
            .then(response => {
            })
            .catch(error => console.log('error', error))
    };

    deleteLevelFromDB = (levelId) => {
        const level_label = `${this.levelProperties[levelId]['tierName']} ${this.levelProperties[levelId]['ontologyLabel']}`;
        api.delete(`/level/${levelId}`)
            .then(response => {
                this.levels.replace(response.data);
                this.rootStore.uiStore.activeCard = null;
                if (this.levels.length == 0){
                    this.createFirstLevel()
                }


                success_notice({
                    /* # Translators: Notification to user that the deletion command that they issued was successful */
                    message_text: interpolate(gettext("%s was deleted."), [level_label]),
                    addClass: 'program-page__rationale-form',
                    stack: {
                        dir1: 'up',
                        dir2: 'right',
                        firstpos1: 20,
                        firstpos2: 20,
                    }
                })
            })
            .catch(error => console.log('error', error))

        this.rootStore.uiStore.setDisableForPrompt(false);
    };


    // TODO: better error handling for API
    saveLevelToDB = (submitType, levelId, indicatorWasUpdated, formData) => {
        // if indicators have been updated, call a separate save method and remove the data from object that will be sent with the level saving post request
        if (indicatorWasUpdated) {
            this.saveReorderedIndicatorsToDB(formData.indicators)
        }
        delete formData.indicators;

        // Now process the save differently depending on if it's a new level or a pre-existing one.
        let targetLevel = this.levels.find(level => level.id == levelId);
        const level_label = `${this.levelProperties[levelId].tierName} ${this.levelProperties[levelId].ontologyLabel}`;
        let levelToSave = Object.assign(toJS(targetLevel), formData);
        const levelDataWasUpdated = this.rootStore.uiStore.activeCardNeedsConfirm;
        if (levelId == "new") {
            if (levelToSave.parent == "root") {
                this.saveLevelTiersToDB();
                $('#logframe_link').show();
            }

            // Don't need id, since it will be "new", and don't need rationale, since it's a new level.
            delete levelToSave.id;
            delete levelToSave.rationale;

            api.post(`/insert_new_level/`, levelToSave)
                .then(response => {
                    runInAction(() => {
                        this.levels.replace(response.data['all_data'])
                    });

                    success_notice({
                        // # Translators: This is a confirmation message that confirms that change has been successfully saved to the DB.
                        message_text: interpolate(gettext("%s saved."), [level_label]),
                        addClass: 'program-page__rationale-form',
                        stack: {
                            dir1: 'up',
                            dir2: 'right',
                            firstpos1: 20,
                            firstpos2: 20,
                        }
                    });

                    const newId = response.data["new_level"]["id"];
                    this.rootStore.uiStore.activeCard = null;
                    if (submitType == "saveAndEnableIndicators") {
                        runInAction( () => {
                           this.rootStore.uiStore.activeCard = newId;
                        });
                    }
                    else if (submitType == "saveAndAddSibling"){
                        this.createNewLevelFromSibling(newId);

                    }
                    else if (submitType == "saveAndAddChild"){
                        this.createNewLevelFromParent(newId);

                    }
                })
                .catch(error => console.log('error', error))

        } else {
            api.put(`/level/${levelId}/`, levelToSave)
                .then(response => {
                    if (levelDataWasUpdated || indicatorWasUpdated) {
                        success_notice({
                            // # Translators:  Confirmation message that user-supplied updates were successfully applied.
                            message_text: interpolate(gettext("%s updated."), [level_label]),
                            addClass: 'program-page__rationale-form',
                            stack: {
                                dir1: 'up',
                                dir2: 'right',
                                firstpos1: 20,
                                firstpos2: 20,
                            }
                        });
                    }
                    runInAction( () => {
                        Object.assign(targetLevel, response.data);
                    });
                    this.rootStore.uiStore.activeCard = null;
                    if (submitType == "saveAndAddSibling"){
                        this.createNewLevelFromSibling(levelId);
                    }
                    else if (submitType == "saveAndAddChild"){
                        this.createNewLevelFromParent(levelId);
                    }

                })
                .catch( error => {
                    console.log("There was an error:", error);
                })
        }

        this.fetchIndicatorsFromDB();

        this.rootStore.uiStore.activeCardNeedsConfirm = false;
    };

    saveReorderedIndicatorsToDB = indicators => {
        api.post("/reorder_indicators/", indicators)
                .then(response => {
                   this.fetchIndicatorsFromDB()
                })
                .catch( error => {
                    console.log("There was an error:", error);
                })
    };

    @action
    updateIndicatorNameInStore(indicatorId, newName) {
        this.indicators.find( i => i.id == indicatorId).name = newName;
    }

    @action
    deleteIndicatorFromStore = (indicatorId, levelId) => {
        this.indicators = this.indicators.filter( i => i.id != indicatorId);
        this.indicators
            .filter( i => i.level == levelId)
            .sort( (a, b) => a.level_order - b.level_order)
            .forEach( (indicator, index) => indicator.level_order = index);
    };

    @action
    addIndicatorToStore = (indicatorData) => {
        this.indicators.push(indicatorData);
    };

    @action
    moveIndicatorInStore = (indicatorId, newLevelId) => {
        let target = this.indicators.find( i => i.id == indicatorId);
        target.level = newLevelId;
        target.level_order = this.indicators.filter( i => i.level == newLevelId).length -1;
    };

    fetchIndicatorsFromDB = (indicatorId=null) => {
        const indicatorQParam = indicatorId ? `?indicatorId=${indicatorId}` : "";
        api.get(`/indicator_list/${this.program_id}/${indicatorQParam}`)
            .then((response) => runInAction(() => {
                this.indicators = response.data;
            }))
            .catch((error) => console.log('There was an error:', error));
    };

    deriveTemplateKey = (origLevelTiers) => {
        // Check each tier set in the templates to see if the tier order and content are exactly the same
        // If they are, return the template key
        const levelTierStr = JSON.stringify(toJS(origLevelTiers));
        for (let templateKey in this.englishTierTemlates){
            // not an eligable template if the key is inherited or if the lengths of the tier sets don't match.
            if (!this.englishTierTemlates.hasOwnProperty(templateKey) ||
                origLevelTiers.length != this.englishTierTemlates[templateKey]['tiers'].length) {
                continue;
            }
            const templateValuesStr = JSON.stringify(this.englishTierTemlates[templateKey]['tiers']);
            if (levelTierStr == templateValuesStr) {
                return templateKey;
            }
        }

        // If this has been reached, the db has stored tiers but they're not a match to a template
        return this.customTierSetKey;
    };


    buildOntology = (levelId, ontologyArray = []) => {
        let level = toJS(this.levels.find( l => l.id == levelId));
        /*  If there is no parent (saved top tier level) or the parent is "root" (unsaved top tier level)
            then we should return with adding to the ontology because there is no ontology entry for the top tier
         */
        if (level.parent && level.parent != "root") {
            ontologyArray.unshift(level.customsort);
            return this.buildOntology(level.parent, ontologyArray);
        }
        else {
            return ontologyArray.join(".");
        }
    };

    getChildLevels = levelId => this.levels.filter( l => l.parent == levelId);

    getLevelIndicators = levelId => this.indicators.filter( i => i.level == levelId);

    getDescendantIndicatorIds = (childLevelIds) => {
        const childLevels = this.levels.filter( l => childLevelIds.includes(l.id));
        let newIndicatorIds = [];
        childLevels.forEach( childLevel => {
            newIndicatorIds = newIndicatorIds.concat(this.indicators.filter( i => i.level == childLevel.id).map( i => i.id));
            let grandChildIds = this.levels.filter( l => l.parent == childLevel.id).map( l => l.id);
            newIndicatorIds = newIndicatorIds.concat(this.getDescendantIndicatorIds(grandChildIds, newIndicatorIds));
        });
        return newIndicatorIds
    }

}


export class UIStore {

    @observable activeCard;
    @observable hasVisibleChildren = [];
    @observable disableForPrompt;
    activeCardNeedsConfirm = "";

    constructor (rootStore) {
        this.rootStore = rootStore;
        this.hasVisibleChildren = this.rootStore.levelStore.levels.map(l => l.id)
        this.activeCardNeedsConfirm = false;
        this.activeCard = null;
        this.disableForPrompt = false;
    }

    @computed get tierLockStatus () {
        // The leveltier picker should be disabled if there is at least one saved level in the DB.
        let notNewLevels = this.rootStore.levelStore.levels.filter( l => l.id != "new");
        if  (notNewLevels.length > 0) {
            return "locked"
        }
        // The apply button should not be visible if there is only one level visible (i.e. saved to the db or not)
        else if (this.rootStore.levelStore.levels.length == 1){
            return "primed"
        }

        return null;
    }
    // TODO: Make sure old editing data is not preserved when an edit is cancelled
    @action
    editCard = (levelId) => {
        const cancelledLevelId = this.activeCard;
        if (this.activeCardNeedsConfirm) {
            this.setDisableForPrompt(true);
            $(`#level-card-${this.activeCard}`)[0].scrollIntoView({behavior:"smooth"});
            const oldTierName = this.rootStore.levelStore.levelProperties[this.activeCard].tierName;
            create_no_rationale_changeset_notice({
                /* # Translators:  This is a confirmation prompt that is triggered by clicking on a cancel button.  */
                message_text: gettext("Are you sure you want to continue?"),
                /* # Translators:  This is a warning provided to the user when they try to cancel the editing of something they have already modified.  */
                preamble: interpolate(gettext("Changes to this %s will not be saved"), [oldTierName]),
                type: "notice",
                on_submit: () => this.onLeaveConfirm(levelId, cancelledLevelId),
                on_cancel: () => this.setDisableForPrompt(false),
            })
        }
        else {
            this.activeCard = levelId;
            this.rootStore.levelStore.levels.replace(this.rootStore.levelStore.levels.filter( l => l.id != "new"))
        }
    };

    @action
    onLeaveConfirm = (levelId, cancelledLevelId) => {
        this.setDisableForPrompt(false);
        this.rootStore.levelStore.cancelEdit(cancelledLevelId);
        this.activeCardNeedsConfirm = false;
        this.activeCard = levelId;
        // Need to use set timeout to ensure that scrolling loses the race with components reacting to the new position of the open card.
        setTimeout(
            function(){$(`#level-card-${levelId}`)[0].scrollIntoView({behavior:"smooth"})},
            100
        );
    };

    @action
    setDisableForPrompt = (value) => {
        this.disableForPrompt = value;
    };

    @action
    removeActiveCard = () => {
        this.activeCard = null;
        this.rootStore.uiStore.activeCardNeedsConfirm = false;
    };

    @action
    updateVisibleChildren = (levelId, forceHide=false, forceShow=false) => {
        // forceHide is to ensure that descendant levels are also made hidden, even if they are not actually visible.
        if (this.hasVisibleChildren.indexOf(levelId) >= 0 || forceHide) {
            this.hasVisibleChildren = this.hasVisibleChildren.filter( level_id => level_id != levelId );
            const childLevels = this.rootStore.levelStore.levels.filter( l => l.parent == levelId);
            childLevels.forEach( l => this.updateVisibleChildren(l.id, true))
        }
        else {
            this.hasVisibleChildren.push(levelId);
        }
    }
}
