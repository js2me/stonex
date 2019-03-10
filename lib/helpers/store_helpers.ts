export function pickAllMethodsFromInstance (module: object): string[] {

  const methods: string[] = []
  const reservedMethods = [
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
  while (module = Object.getPrototypeOf(module)) {
    const keys = Object.getOwnPropertyNames(module)
    keys.forEach((key: string) => {
      if (typeof module[key] === 'function' && !reservedMethods.includes(key)) {
        methods.push(key)
      }
    })
  }
  return methods

  // return reduce(module, (result: string[], value, key) => {
  //   if (typeof value === 'function') {
  //     result.push(key)
  //   }
  //   return result
  // }, [])
}
