import { StoreBinder } from '.'

export class StonexModule<State = any> {
  public readonly __STONEXMODULE__ = true

  public readonly state: State

  public readonly moduleName: string

  public getState: () => State
  public setState: (
    changes: ((state: State) => Partial<State>) | Partial<State>,
    callback?: (state: any) => any
  ) => any

  public resetState: (callback?: (state: any) => any) => void

  /* tslint:disable:variable-name */
  public __initialState: State
  /* tslint:enable:variable-name */

  constructor (storeBinder: StoreBinder<State>) {
    if (!storeBinder) {
      throw new Error(
        'Stonex Module created but not registered in Stonex Store. \r\n' +
        'Please attach all your modules to store')
    }
    Object.assign(this, storeBinder)
  }
}
