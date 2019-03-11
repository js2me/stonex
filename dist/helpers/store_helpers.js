"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getAllMethodsFromModule(module) {
    const methods = [];
    const reservedMethods = [
        'getState',
        'setState',
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
    const checkMethodOnExistInList = (value, key) => typeof value === 'function' &&
        reservedMethods.indexOf(key) === -1 &&
        methods.indexOf(key) === -1;
    const addMethodToList = (key) => {
        if (checkMethodOnExistInList(module[key], key)) {
            methods.push(key);
        }
    };
    Object.keys(module).forEach(addMethodToList);
    while (module = Object.getPrototypeOf(module)) {
        const keys = Object.getOwnPropertyNames(module);
        keys.forEach(addMethodToList);
    }
    return methods;
}
exports.getAllMethodsFromModule = getAllMethodsFromModule;
//# sourceMappingURL=store_helpers.js.map