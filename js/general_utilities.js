const SPANISH = 'es';
const FRENCH = 'fr';
const ENGLISH = 'en';

function flattenArray(arr, depth = 1) {
    if (depth == 5) {
        return arr;
    }
    let flattened = [];
    arr.forEach(item => {
        if (Array.isArray(item)) {
            flattened = flattened.concat(flattenArray(item, depth+1));
        } else {
            flattened.push(item);
        }
    });
    return flattened;
}

function ensureNumericArray(value) {
    if (!Array.isArray(value)) {
        value = parseInt(value);
        if (value && !isNaN(value)) {
            return [value];
        }
        return false;
    }
    let arr = value.map(x => parseInt(x)).filter(x => !isNaN(x));
    if (arr && Array.isArray(arr) && arr.length > 0) {
        return arr;
    }
    return false;
}

/*
 * Are we loading a cached page? If so, reload to avoid displaying stale indicator data
 * See ticket #1423
 */
function reloadPageIfCached() {
    // moving the cache check to after page load as firefox calculates transfer size at the end
    $(function () {
        let isCached = window.performance.getEntriesByType("navigation")[0].transferSize === 0;
        //adding a second check to ensure that if for whatever reason teh transfersize reads wrong, we don't reload on
        //a reload:
        let isReload = window.performance.getEntriesByType("navigation")[0].type === "reload";
        if (isCached && !isReload) {
            window.location.reload();
        }
    });
}

const indicatorManualNumberSort = (levelFunc, numberFunc) => {
    return (indicatorA, indicatorB) => {
        let levelA = levelFunc(indicatorA);
        let levelB = levelFunc(indicatorB);
        if (levelA && !levelB) {
            return 1;
        }
        if (levelB && !levelA) {
            return -1;
        }
        if (levelA != levelB) {
            return parseInt(levelA) - parseInt(levelB);
        }
        let numberA = (numberFunc(indicatorA) || '').split('.');
        let numberB = (numberFunc(indicatorB) || '').split('.');
        for (let i=0; i < Math.max(numberA.length, numberB.length); i++) {
            if (numberA[i] && numberB[i]) {
                for (let j=0; j < Math.max(numberA[i].length, numberB[i].length); j++) {
                    if (numberA[i][j] && numberB[i][j]) {
                        if (numberA[i].charCodeAt(j) != numberB[i].charCodeAt(j)) {
                            return numberA[i].charCodeAt(j) - numberB[i].charCodeAt(j);
                        }
                    } else if (numberA[i][j]) {
                        return 1;
                    } else if (numberB[i][j]) {
                        return -1;
                    }
                }
            } else if (numberA[i]) {
                return 1;
            } else if (numberB[i]) {
                return -1;
            }
        }
        return 0;
    }
}

const localizeNumber = (val) => {
    if (val === undefined || val === null || isNaN(parseFloat(val))) {
        return null;
    }
    var intPart = val.toString();
    var floatPart = null;
    if (val.toString().includes(",")) {
        intPart = val.toString().split(",")[0];
        floatPart = val.toString().split(",").length > 1 ? val.toString().split(",")[1 ] : null;
    } else if (val.toString().includes(".")) {
        intPart = val.toString().split(".")[0];
        floatPart = val.toString().split(".").length > 1 ? val.toString().split(".")[1 ] : null;
    }
    floatPart = (floatPart && floatPart.length > 0) ? floatPart : null;
    var displayValue;
    switch(window.userLang) {
        case SPANISH:
            displayValue = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            if (floatPart) {
                displayValue += `,${floatPart}`;
            }
        break;
        case FRENCH:
            displayValue = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, String.fromCharCode(160)); //nbsp
            if (floatPart) {
                displayValue += `,${floatPart}`;
            }
        break;
        case ENGLISH:
        default:
            displayValue = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            if (floatPart) {
                displayValue += `.${floatPart}`;
            }
        break;
    }
    return displayValue;
};

const localizePercent = (val) => {
    if (val === undefined || val === null || isNaN(parseFloat(val))) {
        return null;
    }
    let percent = localizeNumber(Math.round(val * 10000)/100);
    return (percent === null) ? null : `${percent}%`;
}

const sortObjectListByValue = (objects, key='label') => objects.sort((a, b) => {
    return a[key].toUpperCase() > b[key].toUpperCase() ? 1 : -1
})

export { flattenArray, ensureNumericArray, reloadPageIfCached, indicatorManualNumberSort,
          localizeNumber, localizePercent, sortObjectListByValue };
