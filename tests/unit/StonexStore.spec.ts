import { StonexStore } from '../../src'
import { testAllCases, testPropertiesOnExist } from './__helpers__'
import { createSpecStore, StonexModules } from './__spec__'

describe('StonexStore', () => {
  let testableStore: StonexStore<StonexModules>

  const initializeSpec = () => {
    testableStore = createSpecStore()
  }

  beforeEach(initializeSpec)

  describe('primitive specs', () => {
    test('module should be successfully connected to store', () => {
      expect(testableStore).toBeDefined()
    })

    initializeSpec()

    testPropertiesOnExist([
      ['createStateSnapshot', 'function'],
      ['getState', 'function'],
      ['modules', 'object'],
      ['resetState', 'function'],
      ['setState', 'function'],
      ['storeId', 'number'],
      ['connectModule', 'function'],
    ], testableStore)

  })

  describe('properties', () => {
    const properties: any = {
      modules: [
        ['should have access to connected modules', () => {
          expect(Object.keys(testableStore.modules)).toStrictEqual([
            'specModule',
            'specNestedModule',
            'specNotEmptyModule',
            'specPureModule'
          ])
        }],
        ['should be possible to call method of some connected module', () => {
          let exception = ''
          try {
            testableStore.modules.specModule.addFoo()
          } catch (e) {
            exception = e
          }
          expect(exception).toBeFalsy()
        }],
      ],
      storeId: [
        ['should return unique key', () => {
          const countOfUniqIds = 1000

          const storeIds = Array(countOfUniqIds).fill(1).reduce((obj) => {
            const id = createSpecStore().storeId
            obj[id] = true
            return obj
          }, {})

          expect(Object.keys(storeIds).length).toBe(countOfUniqIds)
        }]
      ]
    }

    testAllCases(properties, (property) => property)
  })

  describe('methods', () => {
    const methods: any = {
      createStateSnapshot: [
        ['should return snapshot of store state', () => {
          testableStore.modules.specModule.addFoo()
          testableStore.modules.specNestedModule.addFoo()
          testableStore.modules.specPureModule.addBar()
          expect(testableStore.createStateSnapshot()).toStrictEqual({
            specModule: { foo: 'bar' },
            specNestedModule: { foo: 'bar' },
            specNotEmptyModule: {
              bar: 'baz',
              foo: 'bar'
            },
            specPureModule: {
              bar: 'baz'
            }
          })
        }]
      ]
    }

    testAllCases(methods, methodName => `${methodName}()`)
  })

})
