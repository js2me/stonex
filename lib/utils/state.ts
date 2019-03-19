import { StonexModule } from '../'
import { copy, isType, types } from '../helpers/base'

export function recreateState (moduleInstance: StonexModule<any>, value: any): void {
  Object.defineProperty(moduleInstance, 'state', {
    get: () => value,
    set: () => {
      throw new Error(`State is immutable (module: ${moduleInstance.moduleName})`)
    },
  })
  Object.freeze(moduleInstance.state)
}

export function updateState<State> (moduleInstance: StonexModule<any>, stateChanges: Partial<State>): void {
  const currentState = copy(moduleInstance.state)
  if (isType(stateChanges, types.object) && isType(currentState, types.object)) {
    recreateState(moduleInstance, { ...currentState, ...copy(stateChanges) })
  } else {
    recreateState(moduleInstance, stateChanges)
  }
}
