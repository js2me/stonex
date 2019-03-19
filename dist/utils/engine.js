"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStoreBinder = (moduleName, engineContext) => ({
    getState: engineContext.getState.bind(engineContext, moduleName),
    moduleName,
    resetState: (callback) => {
        engineContext.setState(moduleName, engineContext.modules[moduleName].__initialState, callback);
    },
    setState: engineContext.setState.bind(engineContext, moduleName),
});
//# sourceMappingURL=engine.js.map