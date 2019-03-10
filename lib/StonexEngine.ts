import { copy, isType, noop, types } from './helpers/base_helpers'
import { getAllMethodsFromModule } from './helpers/store_helpers'

export enum MiddlewareDataTypes {
  METHOD_CALL = 'METHOD_CALL'
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
}

export declare type MiddlewareAction = (data: MiddlewareData) => (void | MiddlewareResponse)

class StonexEngine {

  public static callMiddlewares (middlewares: MiddlewareAction[], data: MiddlewareData): MiddlewareResponse {
    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < middlewares.length; index++) {
      const middleware = middlewares[index]
      const [ response, changes ] = middleware(data) || [null, null]
      if (response) {
        return [response, changes]
      }

    }
    return [MiddlewareResponses.BREAK]
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
    // let stateCache = initialState
    Object.defineProperty(moduleInstance, 'state', {
      get: () => moduleInstance.getState(),
    })

    return {
      ...getAllMethodsFromModule(moduleInstance).reduce((result, method: string) => {
        result[method] = (...args: any[]) => {
          const [response, newArgs] = StonexEngine.callMiddlewares(middlewares, {
            data: args,
            methodName: method,
            moduleName,
            type: MiddlewareDataTypes.METHOD_CALL,
          })
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

  public getModuleByName (name: string): { state: any, actions: object } {
    let module = this.modules[name]
    if (!module) {
      module = this.modules[name] = {
        actions: {},
        state: {},
      }
    }
    return module
  }

  public setState (module: string, changes: any, callback: (state: any) => any = noop): void {
    const changesAsFunction = isType(changes, types.function)
    const changeAction = () => {
      this.mergeChangesToState(module, changesAsFunction ? changes() : changes)
      callback(this.getModuleByName(module).state)
    }
    if (changesAsFunction) {
      setTimeout(changeAction, 0)
    } else {
      changeAction()
    }
  }

  public getState (module: string): any {
    return copy(this.getModuleByName(module).state)
  }

  private mergeChangesToState (module: string, stateChanges: any): void {
    const currentModule = this.getModuleByName(module)
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
