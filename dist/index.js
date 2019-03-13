"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./helpers/base");
const StonexEngine_1 = require("./StonexEngine");
var StonexEngine_2 = require("./StonexEngine");
exports.StonexEngine = StonexEngine_2.default;
function createStore(modulesMap, middlewares = []) {
    return new StonexEngine_1.default(modulesMap, middlewares);
}
exports.createStore = createStore;
class StonexModule {
    constructor() {
        this.__STONEXMODULE__ = true;
        this.setState = base_1.noop;
        this.getState = base_1.noop;
    }
}
exports.StonexModule = StonexModule;
var MiddlewareDataTypes;
(function (MiddlewareDataTypes) {
    MiddlewareDataTypes["METHOD_CALL"] = "METHOD_CALL";
    MiddlewareDataTypes["STATE_CHANGE"] = "STATE_CHANGE";
    MiddlewareDataTypes["STATE_GET"] = "STATE_GET";
})(MiddlewareDataTypes = exports.MiddlewareDataTypes || (exports.MiddlewareDataTypes = {}));
var MiddlewareResponses;
(function (MiddlewareResponses) {
    MiddlewareResponses["BREAK"] = "BREAK";
    MiddlewareResponses["PREVENT"] = "PREVENT";
    MiddlewareResponses["MODIFY"] = "MODIFY";
})(MiddlewareResponses = exports.MiddlewareResponses || (exports.MiddlewareResponses = {}));
//# sourceMappingURL=index.js.map