import { copy, isType, noop, types } from './helpers/base_helpers'
import { getAllMethodsFromModule } from './helpers/store_helpers'

export enum MiddlewareDataTypes {
  METHOD_CALL = 'METHOD_CALL', STATE_CHANGE = 'STATE_CHANGE', STATE_GET = 'STATE_GET'
}

export enum MiddlewareResponses {
  BREAK = 'BREAK', PREVENT = 'PREVENT', MODIFY = 'MODIFY'
}

export declare type MiddlewareResponse = [MiddlewareResponses, any?]

export declare interface MiddlewareData {
  moduleName: string,
  type: MiddlewareDataTypes,
  methodName?: string,
  data?: any,
  state: object,
}

export declare type MiddlewareAction =
  (
    data: MiddlewareData,
    prevResponse?: null | MiddlewareResponse
  ) => (void | MiddlewareResponse)

class StonexEngine {

  public static createStateFromModules (modules: object): object {
    const state = {}
    Object.keys(modules).forEach((name) => {
      state[name] = copy(modules[name].state)
    })
    return state
  }

  public static callMiddlewares (middlewares: MiddlewareAction[], action: () => MiddlewareData): MiddlewareResponse {
    // tslint:disable-next-line:prefer-for-of
    const data = (middlewares.length ? action() : null) as MiddlewareData
    const breakResponse: MiddlewareResponse = [MiddlewareResponses.BREAK, null]
    let prevResponse: MiddlewareResponse = breakResponse

    for (const middleware of middlewares) {
      const [ response, changes ] = middleware(data, prevResponse) || breakResponse
      if (response && response !== MiddlewareResponses.BREAK) {
        if (response === MiddlewareResponses.PREVENT) {
          return [response, changes]
        } else {
          prevResponse = [response, copy(changes)]
        }
      }
    }

    return prevResponse
  }

  public static parseModule (
    Module: any,
    moduleName: string,
    engineContext: StonexEngine,
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
        result[method] = (...args: any[]) => {
          const [response, newArgs] = StonexEngine.callMiddlewares(middlewares, () => ({
            data: args,
            methodName: method,
            moduleName,
            state: StonexEngine.createStateFromModules(engineContext.modules),
            type: MiddlewareDataTypes.METHOD_CALL,
          }))
          if (response === MiddlewareResponses.PREVENT) {
            return
          }
          if (response === MiddlewareResponses.MODIFY) {
            args = newArgs
          }
          return moduleInstance[method].apply(moduleInstance, args)
        }
        return result
      }, {}),
      getState: moduleInstance.getState,
      state:  initialState
    }
  }

  public middlewares: MiddlewareAction[] = []
  private modules = {}

  constructor (modulesMap: any, middlewares: MiddlewareAction[] = []) {
    this.middlewares = middlewares

    for (const moduleName of Object.keys(modulesMap)) {
      this.modules[moduleName] = StonexEngine.parseModule(modulesMap[moduleName], moduleName, this, middlewares)
    }
  }

  public getModuleByName (moduleName: string): { state: any, actions: object } {
    let module = this.modules[moduleName]
    if (!module) {
      module = this.modules[moduleName] = {
        actions: {},
        state: {},
      }
    }
    return module
  }

  public setState (moduleName: string, changes: any, callback: (state: any) => any = noop): void {
    const changesAsFunction = isType(changes, types.function)
    const changeAction = () => {
      let stateChanges = changesAsFunction ? changes() : changes
      const [response, newStateChanges] = StonexEngine.callMiddlewares(this.middlewares, () => ({
        data: stateChanges,
        moduleName,
        state: StonexEngine.createStateFromModules(this.modules),
        type: MiddlewareDataTypes.STATE_CHANGE,
      }))
      if (response === MiddlewareResponses.PREVENT) {
        return
      }
      if (response === MiddlewareResponses.MODIFY) {
        stateChanges = copy(newStateChanges)
      }
      this.mergeChangesToState(moduleName, stateChanges)
      callback(this.getModuleByName(moduleName).state)
    }
    if (changesAsFunction) {
      setTimeout(changeAction, 0)
    } else {
      changeAction()
    }
  }

  public getState (moduleName: string): any {
    let state = copy(this.getModuleByName(moduleName).state)
    const [response, modifiedState] = StonexEngine.callMiddlewares(this.middlewares, () => ({
      data: state,
      moduleName,
      state: StonexEngine.createStateFromModules(this.modules),
      type: MiddlewareDataTypes.STATE_GET,
    }))
    if (response === MiddlewareResponses.PREVENT) {
      return
    }
    if (response === MiddlewareResponses.MODIFY) {
      state = modifiedState
    }
    return state
  }

  private mergeChangesToState (moduleName: string, stateChanges: any): void {
    const currentModule = this.getModuleByName(moduleName)
    const currentState = currentModule.state
    if (isType(stateChanges, types.object) && isType(currentState, types.object)) {
      currentModule.state = { ...currentState, ...copy(stateChanges) }
    } else {
    // } else if (isType(stateChanges, types.array) && isType(currentState, types.array)) {
    //   currentModule.state = [ ...currentState, ...copy(stateChanges) ]
    // } else {
      currentModule.state = copy(stateChanges)
    }
  }

}

export default StonexEngine
