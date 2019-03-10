import { getAllMethodsFromModule } from './helpers/store_helpers'

const noop = () => {}

enum types {
    array, object, other, function
}

const isType = (data: any, expectedType: types): boolean => {
  const typeOf = typeof data
  if (data instanceof Array) {
    return types.array === expectedType
  }
  if (typeOf === 'object') {
    return types.object === expectedType
  }
  if (typeOf === 'function') {
    return types.function === expectedType
  }
  return types.other === expectedType
}

const copy = (data: any) => {
  if (isType(data, types.array)) {
    return data.slice()
  }
  if (isType(data, types.object)) {
    return Object.assign({}, data)
  }
  return data
}

class StonexEngine {

  public static parseModule (
    Module: any,
    moduleName: string,
    engineContext: StonexEngine):
  { actions: object, state: any } {
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
      actions: getAllMethodsFromModule(moduleInstance).reduce((result, method: string) => {
        result[method] = moduleInstance[method].bind(moduleInstance)
        return result
      }, {}),
      state:  initialState
    }
  }

  public middleware = []
  private modules = {}

  constructor (modulesMap: any, middleware: any) {
    this.middleware = middleware

    for (const moduleName of Object.keys(modulesMap)) {
      this.modules[moduleName] = StonexEngine.parseModule(modulesMap[moduleName], moduleName, this)
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
