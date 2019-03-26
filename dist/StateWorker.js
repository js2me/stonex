"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./helpers/base");
class StateWorker {
    static recreateState(moduleInstance, value) {
        Object.defineProperty(moduleInstance, 'state', {
            get: () => value,
            set: () => {
                throw new Error(`State is immutable (module: ${moduleInstance.moduleName})`);
            },
        });
        Object.freeze(moduleInstance.state);
    }
    static updateState(moduleInstance, stateChanges) {
        const currentState = base_1.copy(moduleInstance.state);
        if (base_1.isType(stateChanges, base_1.types.object) && base_1.isType(currentState, base_1.types.object)) {
            StateWorker.recreateState(moduleInstance, Object.assign({}, currentState, base_1.copy(stateChanges)));
        }
        else {
            StateWorker.recreateState(moduleInstance, stateChanges);
        }
    }
}
exports.StateWorker = StateWorker;
//# sourceMappingURL=StateWorker.js.map