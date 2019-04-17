"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./helpers/base");
var StateWorker = /** @class */ (function () {
    function StateWorker() {
    }
    StateWorker.recreateState = function (moduleInstance, value) {
        Object.defineProperty(moduleInstance, 'state', {
            get: function () { return value; },
            set: function () {
                throw new Error("State is immutable (module: " + moduleInstance.moduleName + ")");
            },
        });
        Object.freeze(moduleInstance.state);
    };
    StateWorker.updateState = function (moduleInstance, stateChanges) {
        var currentState = base_1.copy(moduleInstance.state);
        if (base_1.isType(stateChanges, base_1.types.object) && base_1.isType(currentState, base_1.types.object)) {
            StateWorker.recreateState(moduleInstance, __assign({}, currentState, base_1.copy(stateChanges)));
        }
        else {
            StateWorker.recreateState(moduleInstance, stateChanges);
        }
    };
    return StateWorker;
}());
exports.StateWorker = StateWorker;
//# sourceMappingURL=StateWorker.js.map