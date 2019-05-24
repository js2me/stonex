
import { StonexModules, StonexStore } from '.'

export declare interface StoreBinder<State, MP = any> {
  getState: () => State,
  moduleName: string
  modules: StonexModules<MP>
  resetState: (callback?: (state: any) => any) => void
  setState: (changes: (((state: State) => Partial<State>) | Partial<State>), callback?: (state: State) => any) => any
}

export const createStoreBinder = <MP, State>(
    moduleName: string,
    engineContext: StonexStore<MP>,
  ): StoreBinder<State, MP> => ({
    getState: engineContext.getState.bind(engineContext, moduleName),
    moduleName,
    modules: engineContext.modules,
    resetState: engineContext.resetState.bind(engineContext, moduleName),
    setState: engineContext.setState.bind(engineContext, moduleName),
  })
