import { cloneDeep, filter, merge, reduce, uniq  } from 'lodash'

// project name : stonex

export declare interface TypedMap<T> {
  [key: string]: InstanceType<T | any>
}
export declare interface StonexModulesMap extends TypedMap<any> {}

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

export function createStore (modules: StonexModulesMap): StonexModulesMap {
  const keys = Object.keys(modules)
  for (const moduleName of keys) {
    const module = new (modules[moduleName])() as StonexModule<any>

    if (!module.__STONEXMODULE__) {
      throw Error(`${moduleName} is not a Stonex Module` + '\r\n'+ 
        'To solve this you should create class which will be extended from StonexModule class')
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

export declare interface StonexModuleConfiguration {
  useAsyncUpdateState: boolean
}

export class StonexModule<State> {
  public __STONEXMODULE__ = true

  public readonly initialState: State
  public state: State
  public useAsyncUpdateState: boolean = false

  protected globalState: object

  private stateUpdateTimer: any = null
  private newChanges: any[] = []

  constructor (configuration: StonexModuleConfiguration = {} as StonexModuleConfiguration) {
    this.useAsyncUpdateState = configuration.useAsyncUpdateState
    this.updateState(this.initialState)
  }

  public setState = (newState: Partial<State>): State | Promise<State> =>
    this.useAsyncUpdateState ? this.asyncUpdateState(newState) : this.updateState(newState)

  private updateState (newState: Partial<State>): State {
    // ts-lint ignore 2540
    this.state = merge({}, newState) as State
    return this.state
  }

  private asyncUpdateState (newState: Partial<State>): Promise<State> {
    return new Promise((resolve) => {
      if (this.stateUpdateTimer) {
        clearTimeout(this.stateUpdateTimer)
      }
      this.newChanges.push(cloneDeep(newState))
      this.stateUpdateTimer = setTimeout(() => {
        const newState = {}
        this.newChanges.forEach((changes) => {
          merge(newState, changes)
        })
        this.newChanges = []
        resolve(this.updateState(newState))
      })
    })
  }

}
