"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./helpers/base");
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
class Middleware {
    static call(middlewares, mdAction) {
        const data = (middlewares.length ? mdAction() : null);
        const breakResponse = [MiddlewareResponses.BREAK, null];
        let prevResponse = breakResponse;
        for (const middleware of middlewares) {
            const [response, changes] = middleware(data, prevResponse) || breakResponse;
            if (response && response !== MiddlewareResponses.BREAK) {
                if (response === MiddlewareResponses.PREVENT) {
                    return [response, changes];
                }
                else {
                    prevResponse = [response, base_1.copy(changes)];
                }
            }
        }
        return prevResponse;
    }
    static connect(middlewares, mdAction, action, changableData) {
        const [response, modifiedState] = Middleware.call(middlewares, mdAction);
        if (response === MiddlewareResponses.PREVENT) {
            return;
        }
        if (response === MiddlewareResponses.MODIFY) {
            changableData = modifiedState;
        }
        return action(changableData);
    }
}
exports.default = Middleware;
//# sourceMappingURL=Middleware.js.map