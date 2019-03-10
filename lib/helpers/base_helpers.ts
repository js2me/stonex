
export const noop = (...args: any[]) => {}

export enum types {
    array, object, other, function
}

export const isType = (data: any, expectedType: types): boolean => {
  const typeOf = typeof data
  if (data instanceof Array) {
    return types.array === expectedType
  }
  if (typeOf === 'object') {
    return types.object === expectedType
  }
  if (typeOf === 'function') {
    return types.function === expectedType
  }
  return types.other === expectedType
}

export const copy = (data: any) => {
  if (isType(data, types.array)) {
    return data.slice()
  }
  if (isType(data, types.object)) {
    return Object.assign({}, data)
  }
  return data
}
