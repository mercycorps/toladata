import getFilterStore from '../models/filterStore';

/**
 * FilterStore tracks the sidebar filters for the IPTT:
 *  - invoked by iptt Root Store:
 *          filterStore = getFilterStore(reactContext)
 *  - handles initial URL parameters from ipttRouter
 *  - handles user interaction with the sidebar filters (dropdowns and multiselects)
 *  - provides the set of program, frequency, period, etc. data to components to show correct elements
 *  - provides the set of indicators and their ordering to the components to display
 *  - provides an interface to the router to
 *      - update the browser URL to match current filters
 *      - output the URL (and querystring) to the Excel and Pinning functions
 */

describe('IPTT Filter Store', () => {
    it('has a test', () => {
        expect(true).toBeTruthy();
    });
});