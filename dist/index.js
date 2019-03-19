"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StonexEngine_1 = require("./StonexEngine");
var StonexEngine_2 = require("./StonexEngine");
exports.StonexEngine = StonexEngine_2.default;
var StonexModule_1 = require("./StonexModule");
exports.StonexModule = StonexModule_1.StonexModule;
function createStore(modulesMap, middlewares = []) {
    return new StonexEngine_1.default(modulesMap, middlewares);
}
exports.createStore = createStore;
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