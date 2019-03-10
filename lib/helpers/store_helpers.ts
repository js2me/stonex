export function getAllMethodsFromModule (module: object): string[] {

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

  // export function pickAllMethodsFromPrototype (module: () => void): string[] {
  //   const propNames: string[] = Object.getOwnPropertyNames(module.prototype)
  //   return filter(propNames, (name) => name !== 'constructor')
  // }

  const isFunc = (value: any, key: string) => typeof value === 'function' && !reservedMethods.includes(key)

  // reduce(Object.keys, (result: string[], value, key) => {
  //   if (typeof value === 'function') {
  //     result.push(key)
  //   }
  //   return result
  // }, [])
  Object.keys(module).forEach((key: string) => {
    if (isFunc(module[key], key)) {
      methods.push(key)
    }
  })

  while (module = Object.getPrototypeOf(module)) {
    const keys = Object.getOwnPropertyNames(module)
    keys.forEach((key: string) => {
      if (isFunc(module[key], key) && !methods.includes(key)) {
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
