import {
  ModuleConfiguration, ModuleCreator, ModuleCreatorsMap,
  StonexModules
} from '.'
import { copy, isType, noop, types } from './helpers/base'
import { getAllMethodsFromModule } from './helpers/module'
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

declare type StoreModifier<MP, D = any> = (store: Store<MP> | null) => (void | D)
declare type ModuleModifier<D = any> = (module: StonexModule) => (void | D)
declare type ActionModifier = (args: any[], moduleName: string, methodName: string) => false | any

export declare type Modifier<MP> = StoreModifier<MP, ModuleModifier<ActionModifier>>

export declare interface StoreConfiguration<MP> {
  stateWorker?: StateWorker
  modifiers?: Array<Modifier<MP>>
}

class StonexStore<MP> implements Store<MP> {

  public static createStateSnapshot = <MP>(modules: MP): object =>
    Object.keys(modules).reduce((state, name) => {
      state[name] = copy(modules[name].state)
      return state
    }, {})

  public modules: StonexModules<MP> = {} as StonexModules<MP>

  private stateWorker: StateWorker
  private modifiers: Array<Modifier<MP>>

  constructor (
    modulesMap: Partial<ModuleCreatorsMap<MP>>,
    { stateWorker, modifiers }: StoreConfiguration<MP> = {}
  ) {
    this.stateWorker = stateWorker || StateWorker
    this.modifiers = modifiers || []

    const moduleModifiers: ModuleModifier[] = this.modifiers.reduce((moduleModifiers: ModuleModifier[], modifier) => {
      const moduleModifier: ModuleModifier | any = modifier(this)
      if (typeof moduleModifier === 'function') {
        moduleModifiers.push(moduleModifier)
      }
      return moduleModifiers
    },[])

    for (const moduleName of Object.keys(modulesMap)) {
      this.connectModule(moduleName, modulesMap[moduleName], moduleModifiers)
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

    const actionModifiers: Function[] = []

    moduleModifiers.forEach(modifier => {
      const actionModifier = modifier(moduleInstance)
      if (typeof actionModifier === 'function') {
        actionModifiers.push(actionModifier)
      }
    })

    if (!moduleInstance.__STONEXMODULE__) {
      console.error(`${name} is not a Stonex Module` + '\r\n' +
        `To solve this you should extend your class ${name} from StonexModule class`)
    }

    moduleInstance.__initialState = copy(moduleInstance.state)

    this.stateWorker.recreateState(moduleInstance,moduleInstance.__initialState)

    getAllMethodsFromModule(moduleInstance).forEach(methodName => {
      const closuredMethod = moduleInstance[methodName]
      moduleInstance[methodName] = (...args: any[]) => {
        for (const modifier of actionModifiers) {
          if (modifier(args, moduleInstance.moduleName, methodName) === false) {
            return null
          }
        }
        return closuredMethod.apply(moduleInstance, args)
      }
    })

    this.modules[moduleName] = moduleInstance

    return moduleInstance
  }

  public setState<State> (
    moduleName: string,
    changes: Partial<State>,
    callback: (state: State) => any
  ): void
  public setState<State> (
    moduleName: string,
    changes: (state: State) => Partial<State>,
    callback: (state: State) => any = noop
  ): void {
    const changesAsFunction = isType(changes, types.function)
    const changeAction = (stateChanges: any) => {
      const moduleInstance = this.getModuleByName(moduleName)
      this.stateWorker.updateState<State>(moduleInstance, stateChanges)
      callback(moduleInstance.state)
    }
    if (changesAsFunction) {
      setTimeout(() => changeAction(changes(this.getModuleByName(moduleName).state)), 0)
    } else {
      changeAction(changes)
    }
  }

  public getState = (moduleName: string): any => copy(this.getModuleByName(moduleName).state)

  public resetState = (moduleName: string, callback: (state: any) => any = noop): void =>
    this.setState(moduleName, this.modules[moduleName].__initialState, callback)

  private getModuleByName = (moduleName: string): StonexModule<any> | never => {
    const module = this.modules[moduleName]
    if (!module) {
      throw new Error(`Module with name ${moduleName} is not exist in your stonex store`)
    }
    return module
  }
}

export default StonexStore
