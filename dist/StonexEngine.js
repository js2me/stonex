"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const base_1 = require("./helpers/base");
const module_1 = require("./helpers/module");
const Middleware_1 = require("./Middleware");
const StateWorker_1 = require("./StateWorker");
const StoreBinder_1 = require("./StoreBinder");
class StonexEngine {
    constructor(modulesMap, middlewares = [], stateWorker = StateWorker_1.StateWorker) {
        this.modules = {};
        this.middlewares = [];
        this.connectMiddleware(middlewares);
        this.stateWorker = stateWorker;
        for (const moduleName of Object.keys(modulesMap)) {
            this.connectModule(moduleName, modulesMap[moduleName]);
        }
    }
    static createStateSnapshot(modules) {
        const state = {};
        Object.keys(modules).forEach((name) => {
            state[name] = base_1.copy(modules[name].state);
        });
        return state;
    }
    connectModule(moduleName, data) {
        const { module, storeBinder } = base_1.isType(data, base_1.types.function) ? {
            module: data,
            storeBinder: StoreBinder_1.createStoreBinder(moduleName, this),
        } : data;
        const moduleInstance = new module(storeBinder);
        if (!moduleInstance.__STONEXMODULE__) {
            console.error(`${name} is not a Stonex Module` + '\r\n' +
                'To solve this you should create class which will be extended from StonexModule class');
        }
        moduleInstance.__initialState = base_1.copy(moduleInstance.state);
        this.stateWorker.recreateState(moduleInstance, moduleInstance.__initialState);
        module_1.getAllMethodsFromModule(moduleInstance).forEach((method) => {
            const originalMethod = moduleInstance[method].bind(moduleInstance);
            moduleInstance[method] = (...args) => Middleware_1.default.connect(this.middlewares, () => ({
                data: args,
                methodName: method,
                moduleName,
                state: StonexEngine.createStateSnapshot(this.modules),
                type: _1.MiddlewareDataTypes.METHOD_CALL,
            }), (args) => originalMethod(...args), args);
        });
        this.modules[moduleName] = moduleInstance;
        return moduleInstance;
    }
    setState(moduleName, changes, callback = base_1.noop) {
        const changesAsFunction = base_1.isType(changes, base_1.types.function);
        const changeAction = () => {
            const stateChanges = changesAsFunction ? changes() : changes;
            return Middleware_1.default.connect(this.middlewares, () => ({
                data: stateChanges,
                moduleName,
                state: StonexEngine.createStateSnapshot(this.modules),
                type: _1.MiddlewareDataTypes.STATE_CHANGE,
            }), (stateChanges) => {
                const moduleInstance = this.getModuleByName(moduleName);
                this.stateWorker.updateState(moduleInstance, stateChanges);
                callback(moduleInstance.state);
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
            state: StonexEngine.createStateSnapshot(this.modules),
            type: _1.MiddlewareDataTypes.STATE_GET,
        }), (state) => state, state);
    }
    resetState(moduleName, callback = base_1.noop) {
        this.setState(moduleName, this.modules[moduleName].__initialState, callback);
    }
    connectMiddleware(middleware) {
        const middlewares = (base_1.isType(middleware, base_1.types.array) ? middleware : [middleware]);
        this.middlewares.push(...middlewares);
    }
    getModuleByName(moduleName) {
        const module = this.modules[moduleName];
        if (!module) {
            throw new Error(`Module with name ${moduleName} is not exist in your stonex store`);
        }
        return module;
    }
}
exports.default = StonexEngine;
//# sourceMappingURL=StonexEngine.js.map