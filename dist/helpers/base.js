"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-empty */
exports.noop = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
};
/* tslint:enable:no-empty */
var types;
(function (types) {
    types["array"] = "array";
    types["function"] = "function";
    types["object"] = "object";
    types["other"] = "other";
})(types = exports.types || (exports.types = {}));
exports.isType = function (data, expectedType) {
    return (types[data instanceof Array ? 'array' : typeof data] || types.other) === expectedType;
};
exports.copy = function (data) {
    return exports.isType(data, types.array) ?
        data.slice() :
        exports.isType(data, types.object) ?
            Object.assign({}, data) : data;
};
//# sourceMappingURL=base.js.map