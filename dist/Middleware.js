"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const base_1 = require("./helpers/base");
class Middleware {
    static call(middlewares, mdAction) {
        const data = (middlewares.length ? mdAction() : null);
        const breakResponse = [_1.MiddlewareResponses.BREAK, null];
        let prevResponse = breakResponse;
        for (const middleware of middlewares) {
            const [response, changes] = middleware(data, prevResponse) || breakResponse;
            if (response && response !== _1.MiddlewareResponses.BREAK) {
                if (response === _1.MiddlewareResponses.PREVENT) {
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
        if (response === _1.MiddlewareResponses.PREVENT) {
            return;
        }
        if (response === _1.MiddlewareResponses.MODIFY) {
            changableData = modifiedState;
        }
        return action(changableData);
    }
}
exports.default = Middleware;
//# sourceMappingURL=Middleware.js.map