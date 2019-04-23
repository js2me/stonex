"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var module_1 = require("./helpers/module");
var ModifiersWorker = /** @class */ (function () {
    function ModifiersWorker() {
    }
    ModifiersWorker.getModuleModifiers = function (modifiers, storeInstance) {
        return modifiers.reduce(function (moduleModifiers, modifier) {
            var moduleModifier = modifier(storeInstance);
            if (typeof moduleModifier === 'function') {
                moduleModifiers.push(moduleModifier);
            }
            return moduleModifiers;
        }, []);
    };
    ModifiersWorker.getActionModifiers = function (moduleModifiers, moduleInstance) {
        return moduleModifiers.reduce(function (actionModifiers, moduleModifier) {
            var actionModifier = moduleModifier(moduleInstance);
            if (typeof actionModifier === 'function') {
                actionModifiers.push(actionModifier);
            }
            return actionModifiers;
        }, []);
    };
    ModifiersWorker.attachActionModifiersToModule = function (actionModifiers, moduleInstance) {
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
    };
    return ModifiersWorker;
}());
exports.default = ModifiersWorker;
//# sourceMappingURL=ModifiersWorker.js.map