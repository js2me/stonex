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
        this.state = {};
    }
    StateWorker.prototype.initializeState = function (moduleInstance) {
        this.state[moduleInstance.moduleName] = moduleInstance.__initialState;
        delete moduleInstance.state;
        Object.defineProperty(moduleInstance, 'state', {
            get: function () { return moduleInstance.getState(); },
            set: function () {
                throw new Error("State of the module " + moduleInstance.moduleName + " is immutable.\r\n" +
                    ("Please use \"this.setState\" for updating state of the " + moduleInstance.moduleName + " module"));
            },
        });
    };
    StateWorker.prototype.setState = function (moduleInstance, changes, callback) {
        var _this = this;
        if (callback === void 0) { callback = base_1.noop; }
        var changesAsFunction = base_1.isType(changes, base_1.types.function);
        var changeAction = function (stateChanges) {
            _this.updateState(moduleInstance, stateChanges);
            callback(moduleInstance.state);
        };
        if (changesAsFunction) {
            setTimeout(function () { return changeAction(changes(moduleInstance.state)); }, 0);
        }
        else {
            changeAction(changes);
        }
    };
    StateWorker.prototype.getState = function (moduleName) {
        return base_1.copy(this.state[moduleName]);
    };
    StateWorker.prototype.resetState = function (moduleInstance, callback) {
        if (callback === void 0) { callback = base_1.noop; }
        return this.setState(moduleInstance, moduleInstance.__initialState, callback);
    };
    StateWorker.prototype.updateState = function (moduleInstance, stateChanges) {
        var currentState = this.getState(moduleInstance.moduleName);
        var flattedStateChanges = null;
        if (base_1.isType(stateChanges, base_1.types.object)) {
            flattedStateChanges = __assign({}, (base_1.isType(currentState, base_1.types.object) ? currentState : {}), base_1.copy(stateChanges));
        }
        else {
            flattedStateChanges = base_1.isType(stateChanges, base_1.types.array) ? base_1.copy(stateChanges).slice() : stateChanges;
        }
        this.state[moduleInstance.moduleName] = flattedStateChanges;
    };
    return StateWorker;
}());
exports.StateWorker = StateWorker;
//# sourceMappingURL=StateWorker.js.map