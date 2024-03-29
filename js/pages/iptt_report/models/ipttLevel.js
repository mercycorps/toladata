import { observable } from 'mobx';

import { getLevel } from '../../../models/level';

/**
 * IPTT specific level model constructor:
 * JSON params:
 *    tier_pk int
 *    chain_pk int
 *
 * Corresponds to indicators.serializers_new.tier_and_level_serializers.IPTTLevelSerializer
 */

export const forIPTT = (
    levelJSON = {}
) => ({
    tierPk: !isNaN(parseInt(levelJSON.tier_pk)) ? parseInt(levelJSON.tier_pk) : null,
    tierDepth: parseInt(levelJSON.tier_depth),
    showForTier(tierPk) {
        return !isNaN(parseInt(tierPk)) && parseInt(tierPk) === this.tierPk;
    },
    chainPk: !isNaN(parseInt(levelJSON.chain_pk)) ? parseInt(levelJSON.chain_pk) : null,
    _alwaysShowChain: false, // && levelJSON.chain_pk === 'all',
    showForChain(chainPk) {
        return this._alwaysShowChain || (!isNaN(parseInt(chainPk)) && parseInt(chainPk) === this.chainPk);
    },
    get isResultChainLevel() {
        return this.chainPk && this.chainPk == this.pk;
    },
    get tierNumber() {
        // Would have used falsy test but 0 might be a legit label.  All this just to avoid extra spaces.
        return [this.tierName, this.ontology].filter(elem => elem!=null && elem!=='').join(' ');
    },
    get resultChainLabel() {
        /* # Translators: this labels a filter option for a label as including subordinate levels */
        let labelStr = gettext('%(this_level_number)s and sub-levels: %(this_level_full_name)s');
        return interpolate(labelStr, {this_level_number: this.tierNumber, this_level_full_name: this.name}, true);
    }
});

export default getLevel(forIPTT);
