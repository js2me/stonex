
/* tslint:disable:no-empty */
export const noop = (...args: any[]) => {}
/* tslint:enable:no-empty */

export enum types {
    array = 'array',
    function = 'function',
    object = 'object',
    other = 'other',
}

/**
 * Returns true if value have expected type otherwise false
 *
 * @param {*} value
 * @param {types} expectedType
 */
export const isType = (value: any, expectedType: types): boolean =>
  (types[value instanceof Array ? 'array' : typeof value] || types.other) === expectedType

/**
 * Create copy of object/array/other type (1 LEVEL)
 *
 * @param {*} value
 */
export const copy = (value: any) =>
  isType(value, types.array) ?
    value.slice() :
    isType(value, types.object) ?
      Object.assign({}, value) : value
