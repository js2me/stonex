/**
 * Copyright (c) acacode, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import { PureStonexModule, StonexModule } from './StonexModule'
import { StoreBinder } from './StoreBinder'
export { default as StonexStore } from './StonexStore'
export * from './StonexModule'
export * from './StoreBinder'
export * from './StateWorker'
export * from './StonexStore'
export * from './ModifiersWorker'


/**
 * Map of Module creators
 */
export declare type ModuleCreatorsMap<M> = {
  [K in keyof M]: ModuleCreator<any, M[K]>
}

/**
 * Describes what kind of Stonex Module you can attach to Stonex store
 */
export declare type ModuleCreator<State, MI> =
  PureStonexModule<State> | (new (storeBinder: StoreBinder<State>) => MI) | ModuleConfiguration<any, MI>

// tslint:disable:max-line-length
/**
 * @typedef {Object} ModuleConfiguration
 * @property {(PureStonexModule<State> | (new (storeBinder: StoreBinder<State>) => StonexModule<State>))} module - Stonex module
 * @property {StoreBinder<State>?} storeBinder - StoreBinder middleware (it is optional property)
 *
 * @export
 * @interface ModuleConfiguration
 * @template State
 * @template M
 */
// tslint:enable:max-line-length
export declare interface ModuleConfiguration<State = any, M = any> {
  module: (PureStonexModule<State> | (new (storeBinder: StoreBinder<State>) => StonexModule<State>)),
  storeBinder?: StoreBinder<State>
}

/**
 * Stonex Modules class map declaration
 */
export declare type StonexModules<M> = {
  [K in keyof M]: M[K]
}

/**
 * Object where key is name of connect to store module
 * and value state snapshot of store module
 */
export declare type StateSnapshot<M> = {
  [K in keyof M]: M[K] extends StonexModule<any> ? M[K]['state'] : null
}
