
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

export const copy = (data: any) =>
  isType(data, types.array) ? data.slice() : isType(data, types.object) ? Object.assign({}, data) : data
