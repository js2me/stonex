import {
  MiddlewareAction, MiddlewareDataTypes,
  ModulesMap, StonexModules, StoreBinder
} from '.'
import { copy, isType, noop, types } from './helpers/base'
import { getAllMethodsFromModule } from './helpers/module'
import Middleware from './Middleware'
import { StonexModule } from './StonexModule'
import { createStoreBinder } from './utils/engine'
import { recreateState, updateState } from './utils/state'

export default class StonexEngine<MP> {

  public static createStateSnapshot<MP> (modules: MP): object {
    const state = {}
    Object.keys(modules).forEach((name) => {
      state[name] = copy(modules[name].state)
    })
    return state
  }

  public modules: StonexModules<MP> = {} as StonexModules<MP>

  private middlewares: MiddlewareAction[] = []

  constructor (modulesMap: ModulesMap<MP>, middlewares: MiddlewareAction[] = []) {
    this.connectMiddleware(middlewares)
    for (const moduleName of Object.keys(modulesMap)) {
      this.connectModule(moduleName, modulesMap[moduleName])
    }
  }

  public connectModule<State> (
    moduleName: string,
    Class: new (storeBinder: StoreBinder<any>) => any
  ): StonexModule<State> {
    const moduleInstance = new Class(createStoreBinder(moduleName, this))
    if (!moduleInstance.__STONEXMODULE__) {
      console.error(`${name} is not a Stonex Module` + '\r\n' +
        'To solve this you should create class which will be extended from StonexModule class')
    }

    moduleInstance.__initialState = copy(moduleInstance.state)

    recreateState(moduleInstance,moduleInstance.__initialState)

    getAllMethodsFromModule(moduleInstance).forEach((method: string) => {
      const originalMethod = moduleInstance[method].bind(moduleInstance)
      moduleInstance[method] = (...args: any[]) => Middleware.connect(this.middlewares, () => ({
        data: args,
        methodName: method,
        moduleName,
        state: StonexEngine.createStateSnapshot(this.modules),
        type: MiddlewareDataTypes.METHOD_CALL,
      }), (args) => originalMethod(...args), args)
    })

    this.modules[moduleName] = moduleInstance

    return moduleInstance
  }

  public setState<State> (moduleName: string, changes: any, callback: (state: State) => any = noop): void {
    const changesAsFunction = isType(changes, types.function)
    const changeAction = () => {
      const stateChanges = changesAsFunction ? changes() : changes
      return Middleware.connect(this.middlewares, () => ({
        data: stateChanges,
        moduleName,
        state: StonexEngine.createStateSnapshot(this.modules),
        type: MiddlewareDataTypes.STATE_CHANGE,
      }), (stateChanges: Partial<State>) => {
        const moduleInstance = this.getModuleByName(moduleName)
        updateState<State>(moduleInstance, stateChanges)
        callback(moduleInstance.state)
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

  public resetState (moduleName: string, callback: (state: any) => any = noop): void {
    this.setState(moduleName, this.modules[moduleName].__initialState, callback)
  }

  public connectMiddleware (middleware: MiddlewareAction | MiddlewareAction[]): void {
    const middlewares = (isType(middleware, types.array) ? middleware : [middleware]) as MiddlewareAction[]
    this.middlewares.push(...middlewares)
  }

  private getModuleByName (moduleName: string): StonexModule<any> {
    const module = this.modules[moduleName]
    if (!module) {
      throw new Error(`Module with name ${moduleName} is not exist in your stonex store`)
    }
    return module
  }
}
