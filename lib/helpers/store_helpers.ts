export function getAllMethodsFromModule (module: object): string[] {
  const methods: string[] = []
  const reservedMethods = [
    'getState',
    'setState',
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

  const checkMethodOnExistInList = (value: any, key: string) =>
    typeof value === 'function' &&
    reservedMethods.indexOf(key) === -1 &&
    methods.indexOf(key) === -1

  const addMethodToList = (key: string) => {
    if (checkMethodOnExistInList(module[key], key)) {
      methods.push(key)
    }
  }

  Object.keys(module).forEach(addMethodToList)

  while (module = Object.getPrototypeOf(module)) {
    const keys = Object.getOwnPropertyNames(module)
    keys.forEach(addMethodToList)
  }
  return methods
}
