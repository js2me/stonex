import {
  MiddlewareAction, MiddlewareDataTypes,
  ModulesMap, StonexModules, StoreBinder
} from '.'
import { copy, isType, noop, types } from './helpers/base'
import { getAllMethodsFromModule } from './helpers/store'
import Middleware from './Middleware'
import { StonexModule } from './StonexModule'

export default class StonexEngine<MP> {

  public static createStateSnapshot (modules: object): object {
    const state = {}
    Object.keys(modules).forEach((name) => {
      state[name] = copy(modules[name].state)
    })
    return state
  }

  public static createStoreBinder = <MP>(
    moduleName: string,
    engineContext: StonexEngine<MP>
  ): StoreBinder<any> => ({
    getState: engineContext.getState.bind(engineContext, moduleName),
    moduleName,
    setState: engineContext.setState.bind(engineContext, moduleName)
  })

  public static parseModule<MP> (
    Module: new (storeBinder: StoreBinder<any>) => StonexModule<any>,
    moduleName: string,
    engineContext: StonexEngine<MP>,
    middlewares: MiddlewareAction[]
    ):
  { [key: string]: Function, state: any } {
    const storeBinder = StonexEngine.createStoreBinder(moduleName, engineContext)
    const moduleInstance = new Module(storeBinder)
    if (!moduleInstance.__STONEXMODULE__) {
      console.error(`${name} is not a Stonex Module` + '\r\n' +
        'To solve this you should create class which will be extended from StonexModule class')
    }

    // moduleInstance.setState = engineContext.setState.bind(engineContext, moduleName)
    // moduleInstance.getState = engineContext.getState.bind(engineContext, moduleName)
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

  public setState (moduleName: string, changes: any, callback: (state: any) => any = noop): void {
    const changesAsFunction = isType(changes, types.function)
    const changeAction = () => {
      const stateChanges = changesAsFunction ? changes() : changes
      return Middleware.connect(this.middlewares, () => ({
        data: stateChanges,
        moduleName,
        state: StonexEngine.createStateSnapshot(this.modules),
        type: MiddlewareDataTypes.STATE_CHANGE,
      }), (stateChanges) => {
        this.mergeChangesToState(moduleName, stateChanges)
        callback(this.getModuleByName(moduleName).state)
      }, stateChanges)
    }
    if (changesAsFunction) {
      setTimeout(changeAction, 0)
    } else {
      changeAction()
    }
  }

  public getState (moduleName: string): any {
    const state = copy(this.getModuleByName(moduleName).state)
    return Middleware.connect(this.middlewares, () => ({
      data: state,
      moduleName,
      state: StonexEngine.createStateSnapshot(this.modules),
      type: MiddlewareDataTypes.STATE_GET,
    }), (state) => state, state)
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
