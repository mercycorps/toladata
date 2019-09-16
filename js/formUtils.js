/*
 * ID generating code &c. for form inputs
 */

let lastId = 0;

export function uniqueId (prefix='id') {
    lastId++;
    return `${prefix}${lastId}`;
}