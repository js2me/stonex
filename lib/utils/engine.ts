import { StonexEngine, StoreBinder } from '../'

export const createStoreBinder = <MP>(
    moduleName: string,
    engineContext: StonexEngine<MP>,
  ): StoreBinder<any> => ({
    getState: engineContext.getState.bind(engineContext, moduleName),
    moduleName,
    resetState: (callback: (state: any) => any): void => {
      engineContext.setState(moduleName, engineContext.modules[moduleName].__initialState, callback)
    },
    setState: engineContext.setState.bind(engineContext, moduleName),
  })
