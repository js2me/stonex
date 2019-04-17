"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getAllMethodsFromModule(module) {
    var methods = [];
    var reservedMethods = [
        'getState',
        'setState',
        'resetState',
        'constructor',
        '__defineGetter__',
        '__defineSetter__',
        'hasOwnProperty',
        '__lookupGetter__',
        '__lookupSetter__',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'toString',
        'valueOf',
        'toLocaleString',
    ];
    var checkMethodOnExistInList = function (value, key) {
        return typeof value === 'function' &&
            reservedMethods.indexOf(key) === -1 &&
            methods.indexOf(key) === -1;
    };
    var addMethodToList = function (key) {
        if (checkMethodOnExistInList(module[key], key)) {
            methods.push(key);
        }
    };
    Object.keys(module).forEach(addMethodToList);
    while (module = Object.getPrototypeOf(module)) {
        var keys = Object.getOwnPropertyNames(module);
        keys.forEach(addMethodToList);
    }
    return methods;
}
exports.getAllMethodsFromModule = getAllMethodsFromModule;
//# sourceMappingURL=module.js.map