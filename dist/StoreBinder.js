"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStoreBinder = (moduleName, engineContext) => ({
    getState: engineContext.getState.bind(engineContext, moduleName),
    moduleName,
    resetState: engineContext.resetState.bind(engineContext, moduleName),
    setState: engineContext.setState.bind(engineContext, moduleName),
});
//# sourceMappingURL=StoreBinder.js.map