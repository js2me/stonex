import { noop } from './helpers/base_helpers'
import StonexEngine, { MiddlewareAction } from './StonexEngine'
export { default as StonexEngine } from './StonexEngine'

export function createStore (
  modulesMap: any,
  middlewares: MiddlewareAction[] = []
): any {
  return new StonexEngine(modulesMap, middlewares)
}

export class StonexModule<State> {
  public __STONEXMODULE__ = true

  public readonly state: State

  public setState = noop
  public getState = noop
}
