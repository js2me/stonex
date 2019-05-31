import { createStoreBinder, StoreBinder } from '../../src'
import { testAllCases, testPropertiesOnExist } from './__helpers__'
import { createSpecStore, StonexModules } from './__spec__'

describe('StoreBinder', () => {
  const moduleName = 'specModule'
  let testableStoreBinder: StoreBinder<any, StonexModules>
  let specStore: any

  const initializeSpec = () => {
    specStore = createSpecStore()
    testableStoreBinder = createStoreBinder(moduleName, specStore)
  }

  beforeEach(initializeSpec)

  describe('primitive specs', () => {

    test('should be function', () => {
      expect(typeof createStoreBinder).toBe('function')
    })
    test('should return object', () => {
      expect(typeof createStoreBinder(moduleName, createSpecStore())).toBe('object')
    })

    initializeSpec()

    testPropertiesOnExist([
      ['getState', 'function'],
      ['moduleName', 'string'],
      ['modules', 'object'],
      ['resetState', 'function'],
      ['setState', 'function'],
    ], testableStoreBinder)

  })

  describe('properties', () => {
    const properties: any = {
      moduleName: [
        ['should contains name of stonex module', () => {
          expect(testableStoreBinder.moduleName).toBe(moduleName)
        }],
      ],
      modules: [
        ['should be the reference to store modules', () => {
          expect(testableStoreBinder.modules).toBe(specStore.modules)
        }],
        ['should have ability to use some existing module', () => {
          let exception = ''
          try {
            testableStoreBinder.modules.specNestedModule.addFoo()
          } catch (e) {
            exception = e
          }
          expect(exception).toBeFalsy()
        }],
      ],
    }

    testAllCases(properties, (property) => property)
  })

  describe('methods', () => {
    const methods: any = {
      getState: [
        ['should return state of attached module', () => {
          specStore.modules.specModule.addFoo()
          expect(testableStoreBinder.getState()).toStrictEqual({ foo: 'bar' })
        }],
      ],
      resetState: [
        ['should reset state of attached module', () => {
          specStore.modules.specModule.addFoo()
          testableStoreBinder.resetState()
          expect(testableStoreBinder.getState()).toStrictEqual({})
        }],
      ],
      setState: [
        ['should update state of attached module', () => {
          testableStoreBinder.setState({ example: 'example' })
          expect(testableStoreBinder.getState()).toStrictEqual({ example: 'example' })
        }],
      ],
    }

    testAllCases(methods, methodName => `${methodName}()`)
  })

})
