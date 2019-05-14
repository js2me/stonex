/**
 * Copyright (c) acacode, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

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
  (new (storeBinder: StoreBinder<State>) => MI) | ModuleConfiguration<any, MI>

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
