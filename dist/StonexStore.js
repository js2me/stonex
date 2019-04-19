"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./helpers/base");
var module_1 = require("./helpers/module");
var StateWorker_1 = require("./StateWorker");
var StoreBinder_1 = require("./StoreBinder");
var StonexStore = /** @class */ (function () {
    function StonexStore(modulesMap, _a) {
        var _b = _a === void 0 ? {} : _a, stateWorker = _b.stateWorker, modifiers = _b.modifiers;
        var _this = this;
        this.modules = {};
        this.getState = function (moduleName) { return base_1.copy(_this.getModuleByName(moduleName).state); };
        this.resetState = function (moduleName, callback) {
            if (callback === void 0) { callback = base_1.noop; }
            return _this.setState(moduleName, _this.modules[moduleName].__initialState, callback);
        };
        this.getModuleByName = function (moduleName) {
            var module = _this.modules[moduleName];
            if (!module) {
                throw new Error("Module with name " + moduleName + " is not exist in your stonex store");
            }
            return module;
        };
        this.stateWorker = stateWorker || StateWorker_1.StateWorker;
        this.modifiers = modifiers || [];
        var moduleModifiers = this.modifiers.reduce(function (moduleModifiers, modifier) {
            var moduleModifier = modifier(_this);
            if (typeof moduleModifier === 'function') {
                moduleModifiers.push(moduleModifier);
            }
            return moduleModifiers;
        }, []);
        for (var _i = 0, _c = Object.keys(modulesMap); _i < _c.length; _i++) {
            var moduleName = _c[_i];
            this.connectModule(moduleName, modulesMap[moduleName], moduleModifiers);
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
        var actionModifiers = [];
        moduleModifiers.forEach(function (modifier) {
            var actionModifier = modifier(moduleInstance);
            if (typeof actionModifier === 'function') {
                actionModifiers.push(actionModifier);
            }
        });
        if (!moduleInstance.__STONEXMODULE__) {
            console.error(name + " is not a Stonex Module" + '\r\n' +
                ("To solve this you should extend your class " + name + " from StonexModule class"));
        }
        moduleInstance.__initialState = base_1.copy(moduleInstance.state);
        this.stateWorker.recreateState(moduleInstance, moduleInstance.__initialState);
        module_1.getAllMethodsFromModule(moduleInstance).forEach(function (methodName) {
            var closuredMethod = moduleInstance[methodName];
            moduleInstance[methodName] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                for (var _a = 0, actionModifiers_1 = actionModifiers; _a < actionModifiers_1.length; _a++) {
                    var modifier = actionModifiers_1[_a];
                    if (modifier(args, moduleInstance.moduleName, methodName) === false) {
                        return null;
                    }
                }
                return closuredMethod.apply(moduleInstance, args);
            };
        });
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