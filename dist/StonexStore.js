"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./helpers/base");
var ModifiersWorker_1 = require("./ModifiersWorker");
var StateStorage_1 = require("./StateStorage");
var StateWorker_1 = require("./StateWorker");
var StoreBinder_1 = require("./StoreBinder");
var StonexStore = /** @class */ (function () {
    // private modifiers: Array<Modifier<MP>>
    function StonexStore(modulesMap, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.stateWorker, stateWorker = _c === void 0 ? StateWorker_1.StateWorker : _c, modifiers = _b.modifiers;
        var _this = this;
        this.storeId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER - Date.now());
        this.modules = {};
        this.setState = function (moduleName, changes, callback) {
            if (callback === void 0) { callback = base_1.noop; }
            return _this.stateWorker.setState(_this.getModuleByName(moduleName), changes, callback);
        };
        this.getState = function (moduleName) {
            return _this.stateWorker.getState(moduleName);
        };
        this.resetState = function (moduleName, callback) {
            if (callback === void 0) { callback = base_1.noop; }
            return _this.stateWorker.resetState(_this.getModuleByName(moduleName), callback);
        };
        this.getModuleByName = function (moduleName) {
            var module = _this.modules[moduleName];
            if (!module) {
                throw new Error("Module with name " + moduleName + " is not exist in your stonex store");
            }
            return module;
        };
        this.stateWorker = new stateWorker();
        for (var _i = 0, _d = Object.keys(modulesMap); _i < _d.length; _i++) {
            var moduleName = _d[_i];
            this.connectModule(moduleName, modulesMap[moduleName], ModifiersWorker_1.default.getModuleModifiers(modifiers || [], this));
        }
    }
    StonexStore.prototype.connectModule = function (moduleName, data, moduleModifiers) {
        var _this = this;
        if (moduleModifiers === void 0) { moduleModifiers = []; }
        var createDefaultStoreBinder = function () { return StoreBinder_1.createStoreBinder(moduleName, _this); };
        var _a = base_1.isType(data, base_1.types.function) ? {
            module: data,
            storeBinder: createDefaultStoreBinder(),
        } : data, Module = _a.module, _b = _a.storeBinder, storeBinder = _b === void 0 ? createDefaultStoreBinder() : _b;
        var moduleInstance = new Module(storeBinder);
        var actionModifiers = ModifiersWorker_1.default.getActionModifiers(moduleModifiers, moduleInstance);
        if (!moduleInstance.__STONEXMODULE__) {
            console.error(name + " is not a Stonex Module" + '\r\n' +
                ("To solve this you should extend your class " + name + " from StonexModule class"));
        }
        console.log('try to get state here ( connectModule )');
        moduleInstance.__initialState = base_1.copy(moduleInstance.state);
        moduleInstance.__stateId = this.storeId + "/" + moduleName.toUpperCase();
        if (typeof StateStorage_1.stateStorage.getById(moduleInstance.__stateId) === 'undefined') {
            StateStorage_1.stateStorage.createState(moduleInstance.__stateId, moduleInstance.__initialState);
        }
        ModifiersWorker_1.default.attachActionModifiersToModule(actionModifiers, moduleInstance);
        this.modules[moduleName] = moduleInstance;
        return moduleInstance;
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