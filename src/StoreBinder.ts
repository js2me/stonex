
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
    store: StonexStore<MP>,
  ): StoreBinder<State, MP> => ({
    getState: store.getState.bind(store, moduleName),
    moduleName,
    modules: store.modules,
    resetState: store.resetState.bind(store, moduleName),
    setState: store.setState.bind(store, moduleName),
  })
