import {
  ModuleConfiguration, ModuleCreator, ModuleCreatorsMap,
  StateSnapshot,
  StonexModules
} from '.'
import { copy, isType, noop, types } from './helpers/base'
import { convertToStandardModule, isPureModule } from './helpers/module'
import ModifiersWorker, { ActionModifier, Modifier, ModuleModifier } from './ModifiersWorker'
import { StateWorker } from './StateWorker'
import { StonexModule } from './StonexModule'
import { createStoreBinder } from './StoreBinder'

export declare interface Store<MP> {
  modules: StonexModules<MP>
  getState: <State>(moduleName: string) => State
  setState: <State>(
    moduleName: string,
    changes: ((() => Partial<State>) | Partial<State>), callback?: (state: State) => any
  ) => any
  resetState: (moduleName: string, callback?: (state: any) => any) => void
  connectModule: <State> (
    moduleName: string,
    data: ModuleCreator<State, any>
  ) => StonexModule<State>
  createStateSnapshot: () => StateSnapshot<MP>,
  storeId: number
}

export declare interface StoreConfiguration<MP> {
  stateWorker?: new (...args: any[]) => StateWorker,
  modifiers?: Array<Modifier<MP>>
}

class StonexStore<MP> implements Store<MP> {

  public static createStateSnapshot = <MP>(modules: MP): StateSnapshot<MP> =>
    Object.keys(modules).reduce((state, name) => {
      state[name] = copy(modules[name].state)
      return state
    }, {}) as StateSnapshot<MP>

  public storeId: number = Math.round(Math.random() * Number.MAX_SAFE_INTEGER - Date.now())

  public modules: StonexModules<MP> = {} as StonexModules<MP>

  private stateWorker: StateWorker

  constructor (
    modulesMap: Partial<ModuleCreatorsMap<MP>>,
    { stateWorker = StateWorker, modifiers }: StoreConfiguration<MP> = {}
  ) {
    this.stateWorker = new stateWorker()

    const moduleModifiers = ModifiersWorker.getModuleModifiers(modifiers || [], this)

    for (const moduleName of Object.keys(modulesMap)) {
      this.connectModule(
        moduleName,
        modulesMap[moduleName],
        moduleModifiers
      )
    }
  }

  public createStateSnapshot = (): StateSnapshot<MP> => StonexStore.createStateSnapshot(this.modules)

  public connectModule<State> (
    moduleName: string,
    data: ModuleCreator<State, any> | ModuleConfiguration<State>,
    moduleModifiers: ModuleModifier[] = []
  ): StonexModule<State> {

    const createDefaultStoreBinder = () => createStoreBinder<MP, State>(moduleName, this)

    const { module: Module, storeBinder = createDefaultStoreBinder() } =
      (
        isType(data, types.function)
        || (isType(data, types.object) && typeof (data as ModuleConfiguration<State>).module === 'undefined')
      ) ? {
        module: data as ModuleConfiguration<State>['module'],
        storeBinder: createDefaultStoreBinder(),
      } : data as ModuleConfiguration<State>

    const moduleInstance = new (isPureModule(Module) ? convertToStandardModule(Module) : Module)(storeBinder)

    const actionModifiers: ActionModifier[] = ModifiersWorker.getActionModifiers(moduleModifiers, moduleInstance)

    if (!moduleInstance.__STONEXMODULE__) {
      console.error(`${name} is not a Stonex Module` + '\r\n' +
        `To solve this you should extend your class ${name} from StonexModule class`)
    }

    moduleInstance.__initialState = copy(moduleInstance.state)
    this.stateWorker.initializeState(moduleInstance)

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
