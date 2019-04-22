import {
  ModuleConfiguration, ModuleCreator, ModuleCreatorsMap,
  StonexModules
} from '.'
import { copy, isType, noop, types } from './helpers/base'
import ModifiersWorker, { ActionModifier, Modifier, ModuleModifier } from './ModifiersWorker'
import { stateStorage } from './StateStorage'
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

// declare type StoreModifier<MP, D = any> = (store: Store<MP> | null) => (void | D)
// declare type ModuleModifier<D = any> = (module: StonexModule) => (void | D)
// declare type ActionModifier = (args: any[], moduleName: string, methodName: string) => false | any

export declare interface StoreConfiguration<MP> {
  stateWorker?: new (...args: any[]) => StateWorker,
  modifiers?: Array<Modifier<MP>>
}

class StonexStore<MP> implements Store<MP> {

  public static createStateSnapshot = <MP>(modules: MP): object =>
    Object.keys(modules).reduce((state, name) => {
      state[name] = copy(modules[name].state)
      return state
    }, {})

  public storeId: number = Math.round(Math.random() * Number.MAX_SAFE_INTEGER - Date.now())

  public modules: StonexModules<MP> = {} as StonexModules<MP>

  private stateWorker: StateWorker
  // private modifiers: Array<Modifier<MP>>

  constructor (
    modulesMap: Partial<ModuleCreatorsMap<MP>>,
    { stateWorker = StateWorker, modifiers }: StoreConfiguration<MP> = {}
  ) {
    this.stateWorker = new stateWorker()

    for (const moduleName of Object.keys(modulesMap)) {
      this.connectModule(
        moduleName,
        modulesMap[moduleName],
        ModifiersWorker.getModuleModifiers(modifiers || [], this)
      )
    }
  }

  public connectModule<State> (
    moduleName: string,
    data: ModuleCreator<State, any>,
    moduleModifiers: ModuleModifier[] = []
  ): StonexModule<State> {

    const createDefaultStoreBinder = () => createStoreBinder<MP, State>(moduleName, this)

    const { module: Module, storeBinder = createDefaultStoreBinder() } = isType(data, types.function) ? {
      module: data as ModuleConfiguration<State>['module'],
      storeBinder: createDefaultStoreBinder(),
    } : data as ModuleConfiguration<State>

    const moduleInstance = new Module(storeBinder)

    const actionModifiers: ActionModifier[] = ModifiersWorker.getActionModifiers(moduleModifiers, moduleInstance)

    if (!moduleInstance.__STONEXMODULE__) {
      console.error(`${name} is not a Stonex Module` + '\r\n' +
        `To solve this you should extend your class ${name} from StonexModule class`)
    }

    console.log('try to get state here ( connectModule )')
    moduleInstance.__initialState = copy(moduleInstance.state)
    moduleInstance.__stateId = `${this.storeId}/${moduleName.toUpperCase()}`

    if (typeof stateStorage.getById(moduleInstance.__stateId) === 'undefined') {
      stateStorage.createState(moduleInstance.__stateId, moduleInstance.__initialState)
    }

    ModifiersWorker.attachActionModifiersToModule(actionModifiers, moduleInstance)

    this.modules[moduleName] = moduleInstance

    return moduleInstance
  }

  public setState = <State>(
    moduleName: string,
    changes: Partial<State> | ((state: State) => Partial<State>),
    callback: (state: State) => any = noop
  ): void =>
    this.stateWorker.setState(this.getModuleByName(moduleName), changes, callback)

  public getState = (moduleName: string): any =>
    this.stateWorker.getState(moduleName)

  public resetState = (moduleName: string, callback: (state: any) => any = noop): void =>
    this.stateWorker.resetState(this.getModuleByName(moduleName), callback)

  private getModuleByName = (moduleName: string): StonexModule<any> | never => {
    const module = this.modules[moduleName]
    if (!module) {
      throw new Error(`Module with name ${moduleName} is not exist in your stonex store`)
    }
    return module
  }
}

export default StonexStore
