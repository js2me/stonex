
/* tslint:disable:no-empty */
export const noop = (...args: any[]) => {}
/* tslint:enable:no-empty */

export enum types {
    array = 'array',
    function = 'function',
    object = 'object',
    other = 'other',
}

export const isType = (data: any, expectedType: types): boolean =>
  (types[data instanceof Array ? 'array' : typeof data] || types.other) === expectedType

export const copy = (data: any) =>
  isType(data, types.array) ?
    data.slice() :
    isType(data, types.object) ?
      Object.assign({}, data) : data
