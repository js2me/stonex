import StonexEngine from './StonexEngine'
export { default as StonexEngine } from './StonexEngine'

export function createStore (
  modulesMap: any,
  middlewares: Array<() => void> = []
): any {
  return new StonexEngine(modulesMap, middlewares)
}

const noop = (...args: any[]) => {}
export class StonexModule<State> {
  public __STONEXMODULE__ = true

  public state: State

  public setState = noop
  public getState = noop

}
