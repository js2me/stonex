import { StonexModule } from '.'
import { copy, isType, noop, types } from './helpers/base'

declare interface EmptyStateMap {
  [moduleName: string]: any
}

/**
 * StateWorker it is class which do all work
 * linked with state inside each Stonex Module connected to the store
 *
 * @export
 * @class StateWorker
 * @template StateMap
 *
 *
 * @example
 * import { StateWorker, StonexStore } from '../src'
 * import modules, { Modules } from './modules'
 *
 * class SuperStateWorker extends StateWorker {
 *
 *  getState(moduleName: string){
 *    // own behaviour
 *    return super.getState(moduleName)
 *  }
 * }
 *
 * const store = new StonexStore<Modules>(modules,{
 *  stateWorker: SuperStateWorker
 * })
 */
export class StateWorker<StateMap = EmptyStateMap> {

  /**
   * Map of stonex module states
   *
   * @public
   * @type {StateMap}
   * @memberof StateWorker
   */
  public state: StateMap = {} as StateMap

  /**
   * Method which calls when Stonex initializing state inside your module
   *
   * @param {StonexModule<State>} moduleInstance
   * 
   * @public
   */
  public initializeState<State = any> (moduleInstance: StonexModule<State>): void {
    this.state[moduleInstance.moduleName] = copy(moduleInstance.__initialState)

    Object.defineProperty(moduleInstance, 'state', {
      get: () => moduleInstance.getState(),
      set: () => {
        throw new Error(
          `State of the module ${moduleInstance.moduleName} is immutable.\r\n` +
          `Please use "this.setState" for updating state of the ${moduleInstance.moduleName} module`
        )
      },
    })
  }

  /**
   * Preparing new state to update
   * 
   * @param {StonexModule<State>} moduleInstance 
   * @param {Partial<State> | ((state: State) => Partial<State>)} changes 
   * @param {function?} callback
   * 
   * @public 
   */
  public setState<State> (
    moduleInstance: StonexModule<State>,
    changes: Partial<State> | ((state: State) => Partial<State>),
    callback: (state: State) => any = noop
  ): void {
    const changesAsFunction = isType(changes, types.function)
    const changeAction = (stateChanges: Partial<State>) => {
      this.updateState<State>(moduleInstance, stateChanges)
      callback(moduleInstance.state)
    }
    if (changesAsFunction) {
      setTimeout(() => changeAction((changes as (state: State) => Partial<State>)(moduleInstance.state)), 0)
    } else {
      changeAction(changes as Partial<State>)
    }
  }

  /**
   * Returns state of stonex module
   * 
   * @param {string} moduleName
   * 
   * @public 
   */
  public getState<State> (moduleName: string): State {
    return copy(this.state[moduleName])
  }

  /**
   * Reset state of stonex module
   * 
   * @param {StonexModule<State>} moduleInstance 
   * @param {function?} callback
   * 
   * @public 
   */
  public resetState<State> (moduleInstance: StonexModule<State>, callback: (state: any) => any = noop): void {
    return this.setState(moduleInstance, moduleInstance.__initialState, callback)
  }

  /**
   * Updating state of stonex module
   * 
   * @param {StonexModule<State>} moduleInstance 
   * @param {Partial<State>} stateChanges 
   */
  private updateState<State> (moduleInstance: StonexModule<State>, stateChanges: Partial<State>): void | never {
    let flattedStateChanges = null

    if (isType(stateChanges, types.function)) {
      throw new Error(`State of ${moduleInstance.moduleName} module can not have the type of function`)
    }

    if (isType(stateChanges, types.object)) {
      flattedStateChanges = { ...copy(stateChanges) }
    } else {
      flattedStateChanges = isType(stateChanges, types.array) ? [...copy(stateChanges)] : stateChanges
    }

    this.state[moduleInstance.moduleName] = flattedStateChanges
  }

}
