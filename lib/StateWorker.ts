import { StonexModule } from '.'
import { copy, isType, noop, types } from './helpers/base'

export class StateWorker {

  public state = {}

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

  public getState = <State>(moduleName: string): State =>
    copy(this.state[moduleName])

  public resetState = <State>(moduleInstance: StonexModule<State>, callback: (state: any) => any = noop): void =>
    this.setState(moduleInstance, moduleInstance.__initialState, callback)

  private updateState<State> (moduleInstance: StonexModule<State>, stateChanges: Partial<State>): void {
    console.log('try to get state here ( updateState )')
    const currentState = this.getState(moduleInstance.moduleName)
    let flattedStateChanges = null

    if (isType(stateChanges, types.object)) {
      flattedStateChanges = { ...(isType(currentState, types.object) ? currentState : {}), ...copy(stateChanges) }
    } else {
      flattedStateChanges = stateChanges
    }

    this.state[moduleInstance.moduleName] = flattedStateChanges

    Object.defineProperty(moduleInstance, 'state', {
      get: () => moduleInstance.getState(),
      set: () => {
        throw new Error(`State is immutable (module: ${moduleInstance.moduleName})`)
      },
    })
    Object.freeze(moduleInstance.state)
  }

}
