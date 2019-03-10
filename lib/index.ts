import StonexEngine from './StonexEngine'

// project name : stonex

export declare interface TypedMap<T> {
  [key: string]: InstanceType<T | any>
}
export declare interface StonexModulesMap {
  [name: string]: new <T extends StonexModule<any>>() => T
}
export declare interface StonexModulesMa2p {
  [name: string]: new <T extends StonexModule<any>>() => T
}

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
