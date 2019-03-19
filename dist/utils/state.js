"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../helpers/base");
function recreateState(moduleInstance, value) {
    Object.defineProperty(moduleInstance, 'state', {
        get: () => value,
        set: () => {
            throw new Error(`State is immutable (module: ${moduleInstance.moduleName})`);
        },
    });
    Object.freeze(moduleInstance.state);
}
exports.recreateState = recreateState;
function updateState(moduleInstance, stateChanges) {
    const currentState = base_1.copy(moduleInstance.state);
    if (base_1.isType(stateChanges, base_1.types.object) && base_1.isType(currentState, base_1.types.object)) {
        recreateState(moduleInstance, Object.assign({}, currentState, base_1.copy(stateChanges)));
    }
    else {
        recreateState(moduleInstance, stateChanges);
    }
}
exports.updateState = updateState;
//# sourceMappingURL=state.js.map