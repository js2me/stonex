import { StonexStore } from '../../src'
import { createSpecStore, StonexModules } from '../__spec__'

describe('StonexStore', () => {

  let testableStore: StonexStore<StonexModules>

  beforeEach(() => {
    testableStore = createSpecStore()
  })

  describe('primitive specs', () => {
    test('module should be successfully connected to store', () => {
      expect(testableStore).toBeDefined()
    })

    const requiredProperties = [
      ['createStateSnapshot', 'function'],
      ['getState', 'function'],
      ['modules', 'object'],
      ['resetState', 'function'],
      ['setState', 'function'],
      ['storeId', 'number'],
      ['connectModule', 'function'],
    ]

    requiredProperties.forEach(([property, type]) => {
      describe(`"${property}" property`, () => {
        test(`module should contain this property`, () => {
          expect(testableStore).toHaveProperty(property)
        })
        test(`this property should have type "${type}"`, () => {
          expect(typeof testableStore[property]).toBe(type)
        })
      })
    })

  })

  describe('properties', () => {
    const properties = {
      modules: [
        ['should have access to connected modules', () => {
          expect(Object.keys(testableStore.modules)).toStrictEqual(['specModule', 'specNestedModule'])
        }],
        ['should be possible to call method of some connected module', () => {
          let exception = ''
          try {
            testableStore.modules.specModule.updateSpecState({ foo: 'bar' })
          } catch (e) {
            exception = e
          }
          expect(exception).toBeFalsy()
        }],
      ],
      // storeId: () => {},
    }

    Object.keys(properties).forEach(property => {
      describe(property, () => {
        const tests = properties[property]
        tests.forEach(([nameOfTest, testFunc]: [string, any]) => {
          test(nameOfTest, testFunc)
        })
      })
    })
  })

  // describe('methods', () => {
  // })
})
