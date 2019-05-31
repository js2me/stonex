import { StonexModules, StoreBinder } from '.'

export declare interface PureStonexModule<State = any> {
  state?: State,
  [property: string]: ((this: StonexModule<State>, ...args: any[]) => any) | State | any,
}

/**
 * Special class which contains all information/actions linked with specific state.
 * Provide linking store information to your stonex module
 * and specific methods which allows to work with `state`.
 * 
 * 
 * @export
 * @class StonexModule
 * @template State
 *
 *
 * @example
 * class SM extends StonexModule {
 *    state = {}
 *    getData = (key) => this.state[key]
 *    setData = (data) => this.setState(data)
 *    clear = () => this.resetState()
 * }
 *
 * yourStore.connectModule('sm', SM)
 * yourStore.modules.sm.setData({ foo: 'bar' })
 */
export class StonexModule<State = any, MP = any> {
  public readonly __STONEXMODULE__ = true

  /**
   * Current state
   *
   * @type {State}
   * @memberof StonexModule
   */
  // @ts-ignore
  public readonly state: State = null

  /**
   * Using inside Stonex store. You shouldn't change it!
   *
   * @type {string}
   * @memberof StonexModule
   */
  public readonly moduleName: string = '@STONEX_MODULE'

  /**
   * Reference to another modules linked to store.
   * Bridge to use another modules inside module.
   *
   * @type {StonexModules<MP>}
   * @memberof StonexModule
   */
  public readonly modules: StonexModules<MP>

  /* tslint:disable:variable-name */
  public __initialState: State
  /* tslint:enable:variable-name */

  /**
   * This property is usings inside Stonex as bridge between module and store
   *
   * *Fake property* - this property more needed for declarations and hints for TS
   *
   * @type {StonexModules<MP>}
   * @memberof StonexModule
   */
  private storeBinder: StoreBinder<State, MP>

  /**
   * Creates an instance of StonexModule.
   * Provide linking store information to your stonex module
   * And provides specific methods which allows to work with state.
   *
   * @param {StoreBinder<State, MP>} storeBinder - creates via 'createStoreBinder' function
   *
   * @memberof StonexModule
   */
  constructor (storeBinder: StoreBinder<State, MP>) {
    if (!storeBinder) {
      throw new Error(
        'Stonex Module created but not registered in Stonex Store. \r\n' +
        'Please attach all your modules to store')
    }

    if (!(
      storeBinder.getState &&
      storeBinder.moduleName &&
      storeBinder.modules &&
      storeBinder.resetState &&
      storeBinder.setState
    )) {
      throw new Error(
        'Stonex Module must be creating via valid StoreBinder. \r\n' +
        'When you create a new instance of StonexModule, ' +
        'it should receive a object with keys (getState, moduleName, modules, resetState, setState)')
    }

    Object.assign(this, storeBinder)
  }

  /**
   * Returns current state of stonex module. It is the same as `state` property
   *
   * @memberof StonexModule
   * @returns {State}
   */
  public getState = () => this.storeBinder.getState()

  /**
   * Update state of stonex module
   *
   * @param {function | State} changes - what needs to update.
   * It should be a partial state or callback function with first argument as latest state data
   *
   * @param {function?} callback - callback function which called when state has been updated
   *
   * @memberof StonexModule
   * @returns {void}
   */
  public setState = (
    changes: ((state: State) => Partial<State>) | Partial<State>,
    callback?: (state: any) => any
  ) => this.storeBinder.setState(changes, callback)

  /**
   * Reset state to initial/first value
   *
   * @param {function} callback - callback function which called when state will been flushed to initial/default value
   *
   * @memberof StonexModule
   * @returns {void}
   */
  public resetState = (callback?: (state: State) => any) => this.storeBinder.resetState(callback)
}
