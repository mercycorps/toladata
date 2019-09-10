import { extendObservable } from 'mobx';

/**
 * Bare level constructor
 * JSON params:
 *  pk: (string|number)
 *  name: (str)
 *  ontology: (str)
 *  tier_name ([tr] (str))
 */

const bareLevel = (
    levelJSON = {}
) => ({
    pk: parseInt(levelJSON.pk),
    name: levelJSON.name,
    ontology: levelJSON.ontology || null,
    tierName: levelJSON.tier_name
});

export const getLevel = (
    ...levelConstructors
) => ( levelJSON = {} ) => [bareLevel, ...levelConstructors].reduce(
    (acc, fn) => extendObservable(acc, fn(levelJSON)), {});