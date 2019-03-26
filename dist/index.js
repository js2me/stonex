"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const StonexEngine_1 = require("./StonexEngine");
var StonexEngine_2 = require("./StonexEngine");
exports.StonexEngine = StonexEngine_2.default;
__export(require("./StonexModule"));
__export(require("./Middleware"));
__export(require("./StoreBinder"));
__export(require("./StateWorker"));
__export(require("./StonexEngine"));
function createStore(modulesMap, middlewares = []) {
    return new StonexEngine_1.default(modulesMap, middlewares);
}
exports.createStore = createStore;
//# sourceMappingURL=index.js.map