import { StonexModule } from '.'
import { copy, isType, types } from './helpers/base'

export declare interface StateWorker {
  recreateState: (moduleInstance: StonexModule<any>, value: any) => void
  updateState: <State>(moduleInstance: StonexModule<any>, stateChanges: Partial<State>) => void
}

export class StateWorker implements StateWorker {

  public static recreateState (moduleInstance: StonexModule<any>, value: any): void {
    Object.defineProperty(moduleInstance, 'state', {
      get: () => value,
      set: () => {
        throw new Error(`State is immutable (module: ${moduleInstance.moduleName})`)
      },
    })
    Object.freeze(moduleInstance.state)
  }

  public static updateState<State> (moduleInstance: StonexModule<any>, stateChanges: Partial<State>): void {
    const currentState = copy(moduleInstance.state)
    if (isType(stateChanges, types.object) && isType(currentState, types.object)) {
      StateWorker.recreateState(moduleInstance, { ...currentState, ...copy(stateChanges) })
    } else {
      StateWorker.recreateState(moduleInstance, stateChanges)
    }
  }
}
