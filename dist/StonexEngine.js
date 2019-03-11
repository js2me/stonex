"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_helpers_1 = require("./helpers/base_helpers");
const store_helpers_1 = require("./helpers/store_helpers");
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
class StonexEngine {
    constructor(modulesMap, middlewares = []) {
        this.middlewares = [];
        this.modules = {};
        this.middlewares = middlewares;
        for (const moduleName of Object.keys(modulesMap)) {
            this.modules[moduleName] = StonexEngine.parseModule(modulesMap[moduleName], moduleName, this, middlewares);
        }
    }
    static createStateFromModules(modules) {
        const state = {};
        Object.keys(modules).forEach((name) => {
            state[name] = base_helpers_1.copy(modules[name].state);
        });
        return state;
    }
    static callMiddlewares(middlewares, action) {
        // tslint:disable-next-line:prefer-for-of
        const data = (middlewares.length ? action() : null);
        const breakResponse = [MiddlewareResponses.BREAK, null];
        let prevResponse = breakResponse;
        for (const middleware of middlewares) {
            const [response, changes] = middleware(data, prevResponse) || breakResponse;
            if (response && response !== MiddlewareResponses.BREAK) {
                if (response === MiddlewareResponses.PREVENT) {
                    return [response, changes];
                }
                else {
                    prevResponse = [response, base_helpers_1.copy(changes)];
                }
            }
        }
        return prevResponse;
    }
    static parseModule(Module, moduleName, engineContext, middlewares) {
        const moduleInstance = new Module();
        if (!moduleInstance.__STONEXMODULE__) {
            console.error(`${name} is not a Stonex Module` + '\r\n' +
                'To solve this you should create class which will be extended from StonexModule class');
        }
        moduleInstance.setState = engineContext.setState.bind(engineContext, moduleName);
        moduleInstance.getState = engineContext.getState.bind(engineContext, moduleName);
        const initialState = base_helpers_1.copy(moduleInstance.state);
        delete moduleInstance.state;
        Object.defineProperty(moduleInstance, 'state', {
            get: () => moduleInstance.getState(),
        });
        return Object.assign({}, store_helpers_1.getAllMethodsFromModule(moduleInstance).reduce((result, method) => {
            result[method] = (...args) => {
                const [response, newArgs] = StonexEngine.callMiddlewares(middlewares, () => ({
                    data: args,
                    methodName: method,
                    moduleName,
                    state: StonexEngine.createStateFromModules(engineContext.modules),
                    type: MiddlewareDataTypes.METHOD_CALL,
                }));
                if (response === MiddlewareResponses.PREVENT) {
                    return;
                }
                if (response === MiddlewareResponses.MODIFY) {
                    args = newArgs;
                }
                return moduleInstance[method].apply(moduleInstance, args);
            };
            return result;
        }, {}), { getState: moduleInstance.getState, state: initialState });
    }
    getModuleByName(moduleName) {
        let module = this.modules[moduleName];
        if (!module) {
            module = this.modules[moduleName] = {
                actions: {},
                state: {},
            };
        }
        return module;
    }
    setState(moduleName, changes, callback = base_helpers_1.noop) {
        const changesAsFunction = base_helpers_1.isType(changes, base_helpers_1.types.function);
        const changeAction = () => {
            let stateChanges = changesAsFunction ? changes() : changes;
            const [response, newStateChanges] = StonexEngine.callMiddlewares(this.middlewares, () => ({
                data: stateChanges,
                moduleName,
                state: StonexEngine.createStateFromModules(this.modules),
                type: MiddlewareDataTypes.STATE_CHANGE,
            }));
            if (response === MiddlewareResponses.PREVENT) {
                return;
            }
            if (response === MiddlewareResponses.MODIFY) {
                stateChanges = base_helpers_1.copy(newStateChanges);
            }
            this.mergeChangesToState(moduleName, stateChanges);
            callback(this.getModuleByName(moduleName).state);
        };
        if (changesAsFunction) {
            setTimeout(changeAction, 0);
        }
        else {
            changeAction();
        }
    }
    getState(moduleName) {
        let state = base_helpers_1.copy(this.getModuleByName(moduleName).state);
        const [response, modifiedState] = StonexEngine.callMiddlewares(this.middlewares, () => ({
            data: state,
            moduleName,
            state: StonexEngine.createStateFromModules(this.modules),
            type: MiddlewareDataTypes.STATE_GET,
        }));
        if (response === MiddlewareResponses.PREVENT) {
            return;
        }
        if (response === MiddlewareResponses.MODIFY) {
            state = modifiedState;
        }
        return state;
    }
    mergeChangesToState(moduleName, stateChanges) {
        const currentModule = this.getModuleByName(moduleName);
        const currentState = currentModule.state;
        if (base_helpers_1.isType(stateChanges, base_helpers_1.types.object) && base_helpers_1.isType(currentState, base_helpers_1.types.object)) {
            currentModule.state = Object.assign({}, currentState, base_helpers_1.copy(stateChanges));
        }
        else {
            // } else if (isType(stateChanges, types.array) && isType(currentState, types.array)) {
            //   currentModule.state = [ ...currentState, ...copy(stateChanges) ]
            // } else {
            currentModule.state = base_helpers_1.copy(stateChanges);
        }
    }
}
exports.default = StonexEngine;
//# sourceMappingURL=StonexEngine.js.map