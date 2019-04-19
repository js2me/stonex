"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./helpers/base");
var StateWorker_1 = require("./StateWorker");
var StoreBinder_1 = require("./StoreBinder");
var StonexStore = /** @class */ (function () {
    function StonexStore(modulesMap, stateWorker) {
        var _this = this;
        this.modules = {};
        this.getState = function (moduleName) { return base_1.copy(_this.getModuleByName(moduleName).state); };
        this.resetState = function (moduleName, callback) {
            if (callback === void 0) { callback = base_1.noop; }
            return _this.setState(moduleName, _this.modules[moduleName].__initialState, callback);
        };
        this.stateWorker = stateWorker || StateWorker_1.StateWorker;
        for (var _i = 0, _a = Object.keys(modulesMap); _i < _a.length; _i++) {
            var moduleName = _a[_i];
            this.connectModule(moduleName, modulesMap[moduleName]);
        }
    }
    StonexStore.prototype.connectModule = function (moduleName, data) {
        var _this = this;
        var createDefaultStoreBinder = function () { return StoreBinder_1.createStoreBinder(moduleName, _this); };
        var _a = base_1.isType(data, base_1.types.function) ? {
            module: data,
            storeBinder: createDefaultStoreBinder(),
        } : data, Module = _a.module, _b = _a.storeBinder, storeBinder = _b === void 0 ? createDefaultStoreBinder() : _b;
        var moduleInstance = new Module(storeBinder);
        if (!moduleInstance.__STONEXMODULE__) {
            console.error(name + " is not a Stonex Module" + '\r\n' +
                ("To solve this you should extend your class " + name + " from StonexModule class"));
        }
        moduleInstance.__initialState = base_1.copy(moduleInstance.state);
        this.stateWorker.recreateState(moduleInstance, moduleInstance.__initialState);
        this.modules[moduleName] = moduleInstance;
        return moduleInstance;
    };
    StonexStore.prototype.setState = function (moduleName, changes, callback) {
        var _this = this;
        if (callback === void 0) { callback = base_1.noop; }
        var changesAsFunction = base_1.isType(changes, base_1.types.function);
        var changeAction = function (stateChanges) {
            var moduleInstance = _this.getModuleByName(moduleName);
            _this.stateWorker.updateState(moduleInstance, stateChanges);
            callback(moduleInstance.state);
        };
        if (changesAsFunction) {
            setTimeout(function () { return changeAction(changes(_this.getModuleByName(moduleName).state)); }, 0);
        }
        else {
            changeAction(changes);
        }
    };
    StonexStore.prototype.getModuleByName = function (moduleName) {
        var module = this.modules[moduleName];
        if (!module) {
            throw new Error("Module with name " + moduleName + " is not exist in your stonex store");
        }
        return module;
    };
    StonexStore.createStateSnapshot = function (modules) {
        return Object.keys(modules).reduce(function (state, name) {
            state[name] = base_1.copy(modules[name].state);
            return state;
        }, {});
    };
    return StonexStore;
}());
exports.default = StonexStore;
//# sourceMappingURL=StonexStore.js.map