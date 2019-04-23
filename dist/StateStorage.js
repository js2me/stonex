"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./helpers/base");
var stateStorage = (function () {
    var states = {};
    return {
        createState: function (id, state) {
            states[id] = base_1.copy(state);
        },
        getById: function (id) {
            return states[id];
        }
    };
})();
exports.stateStorage = stateStorage;
//# sourceMappingURL=StateStorage.js.map