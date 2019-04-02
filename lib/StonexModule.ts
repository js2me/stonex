import { StoreBinder } from '.'

export class StonexModule<State> {
  public readonly __STONEXMODULE__ = true

  public readonly state: State

  public readonly moduleName: string

  public getState: () => State
  public setState: (changes: ((() => Partial<State>) | Partial<State>), callback?: (state: any) => any) => any
  public resetState: (callback?: (state: any) => any) => void

  constructor (storeBinder: StoreBinder<State>) {
    if (!storeBinder) {
      throw new Error(
        'Stonex Module created but not registered in Stonex Store. \r\n' +
        'Please attach all your modules to store')
    }
    const { getState, setState, resetState, moduleName } = storeBinder
    this.getState = getState
    this.setState = setState
    this.resetState = resetState
    this.moduleName = moduleName
  }
}
