import {
  ModuleConfiguration, ModuleCreator, ModuleCreatorsMap,
  StonexModules,
  StoreBinder
} from '.'
import { copy, isType, noop, types } from './helpers/base'
import { StateWorker } from './StateWorker'
import { StonexModule } from './StonexModule'
import { createStoreBinder } from './StoreBinder'

export declare interface Store<MP> {
  modules: StonexModules<MP>
  getState: <State>(moduleName: string) => State
  setState: <State>(
    moduleName: string,
    changes: ((() => Partial<State>) | Partial<State>), callback: (state: State) => any
  ) => any
  resetState: (moduleName: string, callback?: (state: any) => any) => void
  connectModule: <State> (
    moduleName: string,
    data: ModuleCreator<State, any>
  ) => StonexModule<State>
}

class StonexStore<MP> implements Store<MP> {

  public static createStateSnapshot = <MP>(modules: MP): object =>
    Object.keys(modules).reduce((state, name) => {
      state[name] = copy(modules[name].state)
      return state
    }, {})

  public modules: StonexModules<MP> = {} as StonexModules<MP>

  private stateWorker: StateWorker

  constructor (
    modulesMap: ModuleCreatorsMap<MP>,
    stateWorker?: StateWorker
  ) {
    this.stateWorker = stateWorker || StateWorker
    for (const moduleName of Object.keys(modulesMap)) {
      this.connectModule(moduleName, modulesMap[moduleName])
    }
  }

  public connectModule<State> (
    moduleName: string,
    data: ModuleCreator<State, any>
  ): StonexModule<State> {
    const createDefaultStoreBinder = () => createStoreBinder<MP, State>(moduleName, this)

    const { module, storeBinder = createDefaultStoreBinder() } = isType(data, types.function) ? {
      module: data as new (storeBinder: StoreBinder<State>) => any,
      storeBinder: createDefaultStoreBinder(),
    } : data as ModuleConfiguration<State>

    const moduleInstance = new module(storeBinder)
    if (!moduleInstance.__STONEXMODULE__) {
      console.error(`${name} is not a Stonex Module` + '\r\n' +
        `To solve this you should extend your class ${name} from StonexModule class`)
    }

    moduleInstance.__initialState = copy(moduleInstance.state)

    this.stateWorker.recreateState(moduleInstance,moduleInstance.__initialState)

    this.modules[moduleName] = moduleInstance

    return moduleInstance
  }

  public setState<State> (moduleName: string, changes: any, callback: (state: State) => any = noop): void {
    const changesAsFunction = isType(changes, types.function)
    const changeAction = (stateChanges: Partial<State>) => {
      const moduleInstance = this.getModuleByName(moduleName)
      this.stateWorker.updateState<State>(moduleInstance, stateChanges)
      callback(moduleInstance.state)
    }
    if (changesAsFunction) {
      setTimeout(() => changeAction(changes()), 0)
    } else {
      changeAction(changes)
    }
  }

  public getState = (moduleName: string): any => copy(this.getModuleByName(moduleName).state)

  public resetState = (moduleName: string, callback: (state: any) => any = noop): void =>
    this.setState(moduleName, this.modules[moduleName].__initialState, callback)

  private getModuleByName (moduleName: string): StonexModule<any> | never {
    const module = this.modules[moduleName]
    if (!module) {
      throw new Error(`Module with name ${moduleName} is not exist in your stonex store`)
    }
    return module
  }
}

export default StonexStore

