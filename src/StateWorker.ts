import { StonexModule } from '.'
import { copy, isType, noop, types } from './helpers/base'

declare interface EmptyStateMap {
  [moduleName: string]: any
}

export class StateWorker<StateMap = EmptyStateMap> {

  public state: StateMap = {} as StateMap

  public initializeState<State = any> (moduleInstance: StonexModule<State>): void {
    this.state[moduleInstance.moduleName] = copy(moduleInstance.__initialState)

    // TODO: remove it. it could be useless operation
    // delete moduleInstance.state

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

  public getState<State> (moduleName: string): State {
    return copy(this.state[moduleName])
  }

  public resetState<State> (moduleInstance: StonexModule<State>, callback: (state: any) => any = noop): void {
    return this.setState(moduleInstance, moduleInstance.__initialState, callback)
  }

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
