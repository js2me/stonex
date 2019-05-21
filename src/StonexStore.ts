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

/**
 * Map of Stonex Modules class references
 * @typedef {Object} MP
 */

/**
 *
 *
 * @class StonexStore
 * @implements {Store<MP>}
 * @template MP
 *
 * @example
 * import SomeModule from './SomeModule'
 *
 * const store = new StonexStore({
 *  someModule: SomeModule
 * })
 *
 * store.modules.someModule.doSomething()
 *
 * store.createStateSnapshot()
 */
class StonexStore<MP> implements Store<MP> {

  /**
   * Creates snapshot of state
   *
   * @param {MP} modules - Map with keys where key it is name of module and value it is class reference or object
   *
   * @static
   * @memberof StonexStore
   *
   * @returns {StateSnapshot<MP>}
   */
  public static createStateSnapshot = <MP>(modules: MP): StateSnapshot<MP> =>
    Object.keys(modules).reduce((state, name) => {
      state[name] = copy(modules[name].state)
      return state
    }, {}) as StateSnapshot<MP>

  /**
   * Unique identificator of store.
   * Usings inside library. Don't change it!
   *
   * @type {number}
   * @memberof StonexStore
   */
  public storeId: number = Math.round(Math.random() * Number.MAX_SAFE_INTEGER - Date.now())

  /**
   * Map of modules
   *
   * @type {StonexModules<MP>}
   * @memberof StonexStore
   */
  public modules: StonexModules<MP> = {} as StonexModules<MP>

  /**
   * Set of methods which needed to work with module's state (updating, initializing, etc)
   *
   * Its can be overriden via StonexStore constructor ( new StonexStore(modules, { stateWorker: OwnStateWorker }) )
   *
   * @private
   * @type {StateWorker}
   * @memberof StonexStore
   */
  private stateWorker: StateWorker

  /**
   * Creates an instance of StonexStore.
   * @param {Partial<ModuleCreatorsMap<MP>>} modulesMap
   * @param {StoreConfiguration<MP>} storeConfiguration - have keys 'stateWorker', 'modifiers'
   * @memberof StonexStore
   */
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

  /**
   * Create snapshot of the current store state
   *
   * @memberof StonexStore
   * @returns {StateSnapshot<MP>}
   */
  public createStateSnapshot = (): StateSnapshot<MP> => StonexStore.createStateSnapshot(this.modules)

  // tslint:disable:max-line-length
  /**
   * Allows to attach stonex module to the store
   *
   * @template State
   * @param {string} moduleName - name of stonex module. This name will usings inside stonex store
   * @param {(ModuleCreator<State, any> | ModuleConfiguration<State>)} data - It can be: stonex module class reference, pure stonex module or ModuleConfiguration
   * @param {ModuleModifier[]} moduleModifiers - list of module modifiers (specific middleware)
   * @returns {StonexModule<State>}
   * @memberof StonexStore
   *
   *
   * @example
   * yourStore.connectModule('moduleName', ModuleClass)
   *
   * yourStore.modules.moduleName.methodFromModuleClass()
   */
  // tslint:enable:max-line-length
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

  /**
   *
   * @param {string} moduleName - name of module
   * @param {*} changes - changes which need to apply to state of module
   * @param {function} callback - function which will been called when state has been changed
   *
   * @memberof StonexStore
   * @returns {void}
   */
  public setState = <State>(
    moduleName: string,
    changes: Partial<State> | ((state: State) => Partial<State>),
    callback: (state: State) => any = noop
  ): void =>
    this.stateWorker.setState(this.getModuleByName(moduleName), changes, callback)

  /**
   * Returns module state
   *
   * @param {string} moduleName
   *
   * @memberof StonexStore
   * @returns {*}
   */
  public getState = (moduleName: string): any =>
    this.stateWorker.getState(moduleName)

  /**
   * Set state to initial value (first value of module state)
   *
   * @param {string} moduleName - name of module
   * @param {function} callback - function which will been called when state has been cleared
   *
   * @memberof StonexStore
   * @returns {void}
   */
  public resetState = (moduleName: string, callback: (state: any) => any = noop): void =>
    this.stateWorker.resetState(this.getModuleByName(moduleName), callback)

  /**
   * Find module in stonex store by name
   *
   * @private
   * @memberof StonexStore
   *
   * @returns {(StonexModule | never)}
   */
  private getModuleByName = (moduleName: string): StonexModule<any> | never => {
    const module = this.modules[moduleName]
    if (!module) {
      throw new Error(`Module with name ${moduleName} is not exist in your stonex store`)
    }
    return module
  }
}

export default StonexStore
