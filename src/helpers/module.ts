import { StonexModule } from '../StonexModule'

export function getAllMethodsFromModule (module: object): string[] {
  const methods: string[] = []
  const reservedMethods = [
    'getState',
    'setState',
    'resetState',
    'constructor',
    '__defineGetter__',
    '__defineSetter__',
    'hasOwnProperty',
    '__lookupGetter__',
    '__lookupSetter__',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toString',
    'valueOf',
    'toLocaleString',
  ]

  const addMethodToList = (key: string) => {
    if (
      typeof module[key] === 'function' &&
      reservedMethods.indexOf(key) === -1 &&
      methods.indexOf(key) === -1
    ) {
      methods.push(key)
    }
  }

  Object.keys(module).forEach(addMethodToList)

  /* tslint:disable:no-conditional-assignment */
  while (module = Object.getPrototypeOf(module)) {
  /* tslint:enable:no-conditional-assignment */
    const keys = Object.getOwnPropertyNames(module)
    keys.forEach(addMethodToList)
  }
  return methods
}

export function isPureModule (module: any): boolean {
  return typeof module !== 'function'
}

export function convertToStandardModule (pureModule: object): any {

  return class extends StonexModule<any> {

    constructor (storeBinder: any) {
      super(storeBinder)

      const keys = Object.keys(pureModule)

      Object.assign(this, pureModule)
      keys.forEach((key: any) => {
        if (typeof pureModule[key] === 'function') {
          this[key] = (...args: any[]) => pureModule[key].apply(this, args)
        }
      })
    }
  }
}
