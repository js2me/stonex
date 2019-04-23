
import { StonexStore } from '.'

export declare interface StoreBinder<State> {
  moduleName: string
  getState: () => State,
  setState: (changes: ((() => Partial<State>) | Partial<State>), callback: (state: State) => any) => any
  resetState: (callback?: (state: any) => any) => void
}

export const createStoreBinder = <MP, State>(
    moduleName: string,
    engineContext: StonexStore<MP>,
  ): StoreBinder<State> => ({
    getState: engineContext.getState.bind(engineContext, moduleName),
    moduleName,
    resetState: engineContext.resetState.bind(engineContext, moduleName),
    setState: engineContext.setState.bind(engineContext, moduleName),
  })
