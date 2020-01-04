
let mockState = Object.create(null);

function __setState(newState) {
    mockState = newState;
}

function createRouter(routes, options) {
    return {
        getState() {
            return mockState;
        },
        setRootPath(queryParams) {
            
        },
        usePlugin(plugin) {
            
        },
        start() {
            
        }
    };
}

export default createRouter;

export {__setState};