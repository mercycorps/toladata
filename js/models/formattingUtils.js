/**
 * Formats a decimal number from the received JSON value to a valid JS model value
 * formatting for user language / percent / etc. is next step, this normalizes nulls, strings, etc.
 * to a float if it has a decimal component, and an int otherwise
 */
export const formatDecimal = (value) => {
    if (isNaN(parseFloat(value))) { return false; }
    value = parseFloat(value);
    if (Number.isInteger(value)) { return parseInt(value); }
    return value;
};