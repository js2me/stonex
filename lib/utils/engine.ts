import { StonexEngine, StoreBinder } from '../'

export const createStoreBinder = <MP>(
    moduleName: string,
    engineContext: StonexEngine<MP>,
  ): StoreBinder<any> => ({
    getState: engineContext.getState.bind(engineContext, moduleName),
    moduleName,
    resetState: engineContext.resetState.bind(engineContext, moduleName),
    setState: engineContext.setState.bind(engineContext, moduleName),
  })
