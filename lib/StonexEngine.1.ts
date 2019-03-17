import {
  MiddlewareAction, MiddlewareData,
  MiddlewareDataTypes, ModulesMap, StonexModules
} from '.'
import { copy, isType, noop, types } from './helpers/base'
import { getAllMethodsFromModule } from './helpers/store'
import Middleware from './Middleware'

export default class StonexEngine<MP> {

  public static createStateSnapshot (modules: object): object {
    const state = {}
    Object.keys(modules).forEach((name) => {
      state[name] = copy(modules[name].state)
    })
    return state
  }

  public static parseModule<MP> (
    Module: any,
    moduleName: string,
    engineContext: StonexEngine<MP>,
    middlewares: MiddlewareAction[]
    ):
  { [key: string]: Function, state: any } {
    const moduleInstance = new Module()
    if (!moduleInstance.__STONEXMODULE__) {
      console.error(`${name} is not a Stonex Module` + '\r\n' +
        'To solve this you should create class which will be extended from StonexModule class')
    }

    moduleInstance.setState = engineContext.setState.bind(engineContext, moduleName)
    moduleInstance.getState = engineContext.getState.bind(engineContext, moduleName)
    const initialState = copy(moduleInstance.state)
    delete moduleInstance.state

    Object.defineProperty(moduleInstance, 'state', {
      get: () => moduleInstance.getState(),
    })

    return {
      ...getAllMethodsFromModule(moduleInstance).reduce((result, method: string) => {
        result[method] = (...args: any[]) => Middleware.connect(middlewares, () => ({
          data: args,
          methodName: method,
          moduleName,
          state: StonexEngine.createStateSnapshot(engineContext.modules),
          type: MiddlewareDataTypes.METHOD_CALL,
        }), (args) => moduleInstance[method].apply(moduleInstance, args), args)
        return result
      }, {}),
      getState: moduleInstance.getState,
      state:  initialState
    }
  }
  public modules: StonexModules<MP>

  private middlewares: MiddlewareAction[] = []

  constructor (modulesMap: ModulesMap<MP>, middlewares: MiddlewareAction[] = []) {
    // TODO: fix it
    Object.defineProperty(this, 'modules', {
      value: {}
    })
    this.middlewares = middlewares

    for (const moduleName of Object.keys(modulesMap)) {
      this.modules[moduleName] = StonexEngine.parseModule(modulesMap[moduleName], moduleName, this, middlewares)
    }
  }

  public connectMiddleware (
    type: MiddlewareDataTypes,
    data: Partial<MiddlewareData>,
    action: (changes: any) => any
  ): any {
    if (!this.middlewares.length) {
      return action(data.data)
    }
    return Middleware.connect(this.middlewares, () => ({
      ...data,
      state: StonexEngine.createStateSnapshot(this.modules),
      type,
    } as MiddlewareData), action, data.data)
  }

  private getModuleByName (moduleName: string): { state: any, actions: object } {
    let module = this.modules[moduleName]
    if (!module) {
      module = this.modules[moduleName] = {
        actions: {},
        state: {},
      }
    }
    return module
  }

  private setState (moduleName: string, changes: any, callback: (state: any) => any = noop): void {
    const changesAsFunction = isType(changes, types.function)
    const changeAction = () => {
      const stateChanges = changesAsFunction ? changes() : changes
      return this.connectMiddleware(MiddlewareDataTypes.STATE_CHANGE, {
        data: stateChanges,
        moduleName,
      }, (stateChanges: any) => {
        this.mergeChangesToState(moduleName, stateChanges)
        callback(this.getModuleByName(moduleName).state)
      })
    }
    if (changesAsFunction) {
      setTimeout(changeAction, 0)
    } else {
      changeAction()
    }
  }

  private getState (moduleName: string): any {
    const state = copy(this.getModuleByName(moduleName).state)
    return this.connectMiddleware(MiddlewareDataTypes.STATE_GET, {
      data: state,
      moduleName,
    }, (state) => state)
  }

  private mergeChangesToState (moduleName: string, stateChanges: any): void {
    const currentModule = this.getModuleByName(moduleName)
    const currentState = currentModule.state
    if (isType(stateChanges, types.object) && isType(currentState, types.object)) {
      currentModule.state = { ...currentState, ...copy(stateChanges) }
    } else {
      currentModule.state = copy(stateChanges)
    }
  }

}
