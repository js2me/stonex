import { noop } from './helpers/base_helpers'
import StonexEngine from './StonexEngine'
export { default as StonexEngine } from './StonexEngine'

export declare interface ObjectMap<T> {
  [key: string]: T
}

export declare type ModulesMap<M> = {
  [K in keyof M]: (new () => M[K])
}

export declare interface Store<M> {
  modules: StonexModules<M>
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

export class StonexModule<State> {
  public __STONEXMODULE__ = true

  public readonly state: State

  public setState = noop
  public getState = noop
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

export declare interface IStonexEngine<MP>{
  modules: {
    [K in keyof MP]: MP[K]
  }
}
