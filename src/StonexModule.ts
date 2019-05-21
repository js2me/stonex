import { StonexModules, StoreBinder } from '.'

// TODO: fix typings here (dynamic keys as methods)
export declare interface PureStonexModule<State = any> {
  state?: State | any,
}

/**
 *
 * @export
 * @class StonexModule
 * @template State
 * @template
 *
 *
 * @example
 * class YourModule extends StonexModule {
 *    state = {}
 *    getData = (key) => this.state[key]
 *    setData = (data) => this.setState(data)
 *    clear = () => this.resetState()
 * }
 *
 * yourStore.connectModule('yourModule', YourModule)
 * yourStore.modules.yourModule.setData({ foo: 'bar' })
 */
export class StonexModule<State = any, MP = any> {
  public readonly __STONEXMODULE__ = true

  /**
   * Current state
   *
   * @type {State}
   * @memberof StonexModule
   */
  public readonly state: State

  /**
   * Using inside stonex store. Don't change it
   *
   * @type {string}
   * @memberof StonexModule
   */
  public readonly moduleName: string

  /**
   * Reference to another modules linked to store.
   * Bridge to use another modules inside module.
   *
   * @type {StonexModules<MP>}
   * @memberof StonexModule
   */
  public readonly modules: StonexModules<MP>

  /**
   * Returns current state of stonex module. It is the same as `state` property
   *
   * @memberof StonexModule
   * @returns {State}
   */
  public getState: () => State

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
  public setState: (
    changes: ((state: State) => Partial<State>) | Partial<State>,
    callback?: (state: any) => any
  ) => any

  /**
   * Reset state to initial/first value
   *
   * @param {function} callback - callback function which called when state will been flushed to initial/default value
   *
   * @memberof StonexModule
   * @returns {void}
   */
  public resetState: (callback?: (state: any) => any) => void

  /* tslint:disable:variable-name */
  public __initialState: State
  /* tslint:enable:variable-name */

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

    Object.assign(this, storeBinder)
  }
}
