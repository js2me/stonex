import merge from 'lodash-es/merge'
import reduce from 'lodash-es/reduce'

// project name : stonex

export declare interface StonexModulesMap {
  [key: string]: InstanceType<any>
}

export function createStore (modules: StonexModulesMap) {
  const keys = Object.keys(modules)
  for (const key of keys) {
    const moduleName = keys[key]
    const module = new (modules[moduleName])() as StonexModule<any>

    if (!module.__STONEXMODULE__) {
      throw Error(`${moduleName} is not a Stonex Module`)
    }

    modules[moduleName] = reduce(module, (result, value, key) => {
      if (typeof value === 'function') {
        result[key] = value.bind(module)
      }
      return result
    }, {})
  }
  return modules
}

export class StonexModule<State> {
  public __STONEXMODULE__ = true

  public readonly initialState: State
  protected readonly state: State

  protected globalState: object

  protected setState: (newState: Partial<State>, rewrite?: boolean) => State

  constructor () {
    this.updateState(this.initialState)
  }

  private updateState (newState: Partial<State>): void {
    // ts-lint ignore 2540
    this.state = merge({}, newState) as State
  }

}
