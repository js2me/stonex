import { StoreBinder } from '.'
import { noop } from './helpers/base'

export class StonexModule<State> {
  public __STONEXMODULE__ = true

  public state: State

  public moduleName: string

  private storeBinder: StoreBinder<State>

  constructor (storeBinder: StoreBinder<State>) {
    if (!storeBinder) {
      throw new Error('Stonex Module created but not registered in Stonex Store. \r\n' +
      'Please attach all your modules to store')
    }
    this.storeBinder = storeBinder
    this.moduleName = storeBinder.moduleName
  }

  public getState = (): State => {
    console.log("FFFF")
    console.log(this.storeBinder.getState)
    return this.storeBinder.getState()
  }

  public resetState = (callback: (state: any) => any): void => this.storeBinder.resetState(callback)

  protected setState = (
    changes: ((() => Partial<State>) | Partial<State>),
    callback: (state: any) => any = noop
  ): any => this.storeBinder.setState(changes, callback)
}
