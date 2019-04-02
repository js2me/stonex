import { MiddlewareAction } from './Middleware'
import StonexEngine, { Store } from './StonexEngine'
import { StoreBinder } from './StoreBinder'
export { default as StonexEngine } from './StonexEngine'
export * from './StonexModule'
export * from './Middleware'
export * from './StoreBinder'
export * from './StateWorker'
export * from './StonexEngine'

export declare type ModuleCreatorsMap<M> = {
  [K in keyof M]: ModuleCreator<any, M[K]>
}

export declare type ModuleCreator<State, MI> =
  (new (storeBinder: StoreBinder<any>) => MI) | ModuleConfiguration<any, MI>

export declare interface ModuleConfiguration<State = any, M = any> {
  module: new (storeBinder: StoreBinder<State>) => M,
  storeBinder?: StoreBinder<State>
}

export declare type StonexModules<M> = {
  [K in keyof M]: M[K]
}

export function createStore<M> (
  modulesMap: ModuleCreatorsMap<M>,
  middlewares: MiddlewareAction[] = []
): Store<M> {
  return new StonexEngine<M>(modulesMap, middlewares)
}
