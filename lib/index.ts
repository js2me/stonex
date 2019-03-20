import StonexEngine from './StonexEngine'
export { default as StonexEngine } from './StonexEngine'
export { StonexModule } from './StonexModule'

export declare interface ObjectMap<T> {
  [key: string]: T
}

export declare type ModulesMap<M> = {
  [K in keyof M]: (new (storeBinder: StoreBinder<any>) => M[K])
}

export declare interface Store<M> {
  modules: StonexModules<M>
  getState: <State>(moduleName: string) => State
  setState: <State>(
    moduleName: string,
    changes: ((() => Partial<State>) | Partial<State>), callback: (state: State) => any
  ) => any
  resetState: (moduleName: string, callback?: (state: any) => any) => void
  connectMiddleware: (middleware: MiddlewareAction | MiddlewareAction[]) => void
}

export declare type StonexModules<M> = {
  [K in keyof M]: M[K]
}

export function createStore<M> (
  modulesMap: ModulesMap<M>,
  middlewares: MiddlewareAction[] = []
): Store<M> {
  return new StonexEngine<M>(modulesMap, middlewares)
}

export enum MiddlewareDataTypes {
  METHOD_CALL = 'METHOD_CALL', STATE_CHANGE = 'STATE_CHANGE', STATE_GET = 'STATE_GET'
}

export enum MiddlewareResponses {
  BREAK = 'BREAK', PREVENT = 'PREVENT', MODIFY = 'MODIFY'
}

export declare type MiddlewareResponse = [MiddlewareResponses, any?]

export declare interface MiddlewareData {
  moduleName: string,
  type: MiddlewareDataTypes,
  methodName?: string,
  data?: any,
  state: object,
}

export declare type MiddlewareAction =
  (
    data: MiddlewareData,
    prevResponse?: null | MiddlewareResponse
  ) => (void | MiddlewareResponse)

export declare interface IStonexEngine<MP> {
  modules: {
    [K in keyof MP]: MP[K]
  }
}

export declare interface StoreBinder<State> {
  moduleName: string
  getState: () => State,
  setState: (changes: ((() => Partial<State>) | Partial<State>), callback: (state: State) => any) => any
  resetState: (callback?: (state: any) => any) => void
}
