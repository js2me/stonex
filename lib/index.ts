import { filter, merge, reduce, uniq } from 'lodash'

// project name : stonex

export declare interface StonexModulesMap {
  [key: string]: InstanceType<any>
}

export function pickAllMethodsFromPrototype (module: () => void): string[] {
  const propNames: string[] = Object.getOwnPropertyNames(module.prototype)
  return filter(propNames, (name) => name !== 'constructor')
}
export function pickAllMethodsFromInstance (module: object): string[] {
  return reduce(module, (result: string[], value, key) => {
    if (typeof value === 'function') {
      result.push(key)
    }
    return result
  }, [])
}

export function createStore (modules: StonexModulesMap) {
  const keys = Object.keys(modules)
  for (const moduleName of keys) {
    const module = new (modules[moduleName])() as StonexModule<any>

    if (!module.__STONEXMODULE__) {
      throw Error(`${moduleName} is not a Stonex Module`)
    }
    const methods = uniq([
      ...pickAllMethodsFromPrototype(modules[moduleName]),
      ...pickAllMethodsFromInstance(module)
    ])
    modules[moduleName] = reduce(methods, (result, method: string) => {
      result[method] = module[method].bind(module)
      return result
    }, {})
    modules[moduleName].getState = () => module.state
  }
  return modules
}

export class StonexModule<State> {
  public __STONEXMODULE__ = true

  public readonly initialState: State
  public state: State

  protected globalState: object

  constructor () {
    this.updateState(this.initialState)
  }

  public setState(newState: Partial<State>): void {
    this.updateState(newState)
  }

  private updateState (newState: Partial<State>): void {
    // ts-lint ignore 2540
    this.state = merge({}, newState) as State
  }

}
