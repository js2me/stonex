import { noop } from './helpers/base_helpers'
import StonexEngine, { MiddlewareAction } from './StonexEngine'
export { default as StonexEngine } from './StonexEngine'

export declare interface ObjectMap<T> {
  [key: string]: T
}

export declare type ModulesMap<MP> = {
  [K in keyof MP]: (new () => MP[K])
}

export declare interface Store<MP> {
  modules: {
    [K in keyof MP]: MP[K]
  }
}

export declare type StonexModules<MP> = {
  [K in keyof MP]: MP[K]
}

export function createStore<MP> (
  modulesMap: ModulesMap<MP>,
  middlewares: MiddlewareAction[] = []
): Store<MP> {
  return new StonexEngine<MP>(modulesMap, middlewares)
}

export class StonexModule<State> {
  public __STONEXMODULE__ = true

  public readonly state: State

  public setState = noop
  public getState = noop
}

/*

class Factory {
  public create<T> (type: (new () => T)): T {
    return new type()
  }
}

*/
