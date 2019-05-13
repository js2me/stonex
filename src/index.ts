// ts disable
import { StonexModule } from './StonexModule'
import { StoreBinder } from './StoreBinder'
export { default as StonexStore } from './StonexStore'
export * from './StonexModule'
export * from './StoreBinder'
export * from './StateWorker'
export * from './StonexStore'
export * from './ModifiersWorker'

export declare type ModuleCreatorsMap<M> = {
  [K in keyof M]: ModuleCreator<any, M[K]>
}

export declare type ModuleCreator<State, MI> =
  (new (storeBinder: StoreBinder<any>) => MI) | ModuleConfiguration<any, MI>

export declare interface ModuleConfiguration<State = any, M = any> {
  module: new (storeBinder: StoreBinder<State>) => StonexModule<State>,
  storeBinder?: StoreBinder<State>
}

export declare type StonexModules<M> = {
  [K in keyof M]: M[K]
}

export declare type StateSnapshot<M> = {
  [K in keyof M]: M[K] extends StonexModule<any> ? M[K]['state'] : null
}