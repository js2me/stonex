"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const base_1 = require("./helpers/base");
const store_1 = require("./helpers/store");
const Middleware_1 = require("./Middleware");
class StonexEngine {
    constructor(modulesMap, middlewares = []) {
        this.middlewares = [];
        // TODO: fix it
        Object.defineProperty(this, 'modules', {
            value: {}
        });
        this.middlewares = middlewares;
        for (const moduleName of Object.keys(modulesMap)) {
            this.modules[moduleName] = StonexEngine.parseModule(modulesMap[moduleName], moduleName, this, middlewares);
        }
    }
    static createStateFromModules(modules) {
        const state = {};
        Object.keys(modules).forEach((name) => {
            state[name] = base_1.copy(modules[name].state);
        });
        return state;
    }
    static parseModule(Module, moduleName, engineContext, middlewares) {
        const moduleInstance = new Module();
        if (!moduleInstance.__STONEXMODULE__) {
            console.error(`${name} is not a Stonex Module` + '\r\n' +
                'To solve this you should create class which will be extended from StonexModule class');
        }
        moduleInstance.setState = engineContext.setState.bind(engineContext, moduleName);
        moduleInstance.getState = engineContext.getState.bind(engineContext, moduleName);
        const initialState = base_1.copy(moduleInstance.state);
        delete moduleInstance.state;
        Object.defineProperty(moduleInstance, 'state', {
            get: () => moduleInstance.getState(),
        });
        return Object.assign({}, store_1.getAllMethodsFromModule(moduleInstance).reduce((result, method) => {
            result[method] = (...args) => Middleware_1.default.connect(middlewares, () => ({
                data: args,
                methodName: method,
                moduleName,
                state: StonexEngine.createStateFromModules(engineContext.modules),
                type: _1.MiddlewareDataTypes.METHOD_CALL,
            }), (args) => moduleInstance[method].apply(moduleInstance, args), args);
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
    setState(moduleName, changes, callback = base_1.noop) {
        const changesAsFunction = base_1.isType(changes, base_1.types.function);
        const changeAction = () => {
            const stateChanges = changesAsFunction ? changes() : changes;
            return Middleware_1.default.connect(this.middlewares, () => ({
                data: stateChanges,
                moduleName,
                state: StonexEngine.createStateFromModules(this.modules),
                type: _1.MiddlewareDataTypes.STATE_CHANGE,
            }), (stateChanges) => {
                this.mergeChangesToState(moduleName, stateChanges);
                callback(this.getModuleByName(moduleName).state);
            }, stateChanges);
        };
        if (changesAsFunction) {
            setTimeout(changeAction, 0);
        }
        else {
            changeAction();
        }
    }
    getState(moduleName) {
        const state = base_1.copy(this.getModuleByName(moduleName).state);
        return Middleware_1.default.connect(this.middlewares, () => ({
            data: state,
            moduleName,
            state: StonexEngine.createStateFromModules(this.modules),
            type: _1.MiddlewareDataTypes.STATE_GET,
        }), (state) => state, state);
    }
    mergeChangesToState(moduleName, stateChanges) {
        const currentModule = this.getModuleByName(moduleName);
        const currentState = currentModule.state;
        if (base_1.isType(stateChanges, base_1.types.object) && base_1.isType(currentState, base_1.types.object)) {
            currentModule.state = Object.assign({}, currentState, base_1.copy(stateChanges));
        }
        else {
            currentModule.state = base_1.copy(stateChanges);
        }
    }
}
exports.default = StonexEngine;
//# sourceMappingURL=StonexEngine.js.map