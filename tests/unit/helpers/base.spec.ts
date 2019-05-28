import { copy, isType, noop, types } from '../../../src/helpers/base'
import { testAllCases } from '../__helpers__'

describe('base helpers', () => {

  const helpers: any = {
    copy: [
      ['should create shallow copy of object', () => {
        const specObj = { foo: 'bar' }
        const copied = copy(specObj)
        expect(copied).not.toBe(specObj)
      }],
      ['should create shallow copy of array', () => {
        const specArr = [1,2,3,4]
        const copied = copy(specArr)
        expect(copied).not.toBe(specArr)
      }],
    ],
    isType: [
      ['should return true if type is array', () => {
        expect(isType([], types.array)).toBe(true)
        expect(isType({}, types.array)).toBe(false)
      }],
      ['should return true if type is object', () => {
        expect(isType({}, types.object)).toBe(true)
        expect(isType([], types.object)).toBe(false)
      }],
      ['should return true if type is other', () => {
        expect(isType('somestring', types.other)).toBe(true)
        expect(isType(1234, types.other)).toBe(true)
        expect(isType([], types.other)).toBe(false)
        expect(isType({}, types.other)).toBe(false)
      }],
      ['should return true if type is function', () => {
        expect(isType(() => null, types.function)).toBe(true)
        expect(isType([], types.function)).toBe(false)
      }],
    ],
    noop: [
      ['should have type function', () => {
        expect(typeof noop).toBe('function')
      }],
      ['should be void function', () => {
        expect(noop()).toBeUndefined()
      }],
    ],
  }

  testAllCases(helpers, helperName => helperName)
})
