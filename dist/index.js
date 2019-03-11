"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_helpers_1 = require("./helpers/base_helpers");
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
        this.setState = base_helpers_1.noop;
        this.getState = base_helpers_1.noop;
    }
}
exports.StonexModule = StonexModule;
//# sourceMappingURL=index.js.map