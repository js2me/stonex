import { StateWorker, StonexModule, StonexStore } from '../../src'
import { testAllCases, testPropertiesOnExist } from './__helpers__'
import { createSpecStore, SpecModule, StonexModules } from './__spec__'

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
      ['connectModule', 'function'],
      ['createStateSnapshot', 'function'],
      ['getState', 'function'],
      ['modules', 'object'],
      ['resetState', 'function'],
      ['setState', 'function'],
      ['storeId', 'number'],
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
      connectModule: [
        ['should attach module to store', () => {
          testableStore.connectModule('mySuperbModule', SpecModule)
          expect((testableStore.modules as any).mySuperbModule).toBeDefined()
        }],
        ['attached module to store should have access to own state', () => {
          testableStore.connectModule('mySuperbModule', SpecModule)
          expect((testableStore.modules as any).mySuperbModule.state).toStrictEqual({})
        }],
      ],
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
      ],
      getState: [
        ['should return state of module', () => {
          testableStore.modules.specModule.addBar()
          testableStore.modules.specModule.addFoo()
          expect(testableStore.getState('specModule')).toStrictEqual({
            bar: 'baz',
            foo: 'bar'
          })
        }],
        ['should call "getState" of "stateWorker" class', () => {
          const getStateMock = jest.fn()
          class CustomStateWorker extends StateWorker {
            public getState<State> (moduleName: string): State {
              getStateMock(moduleName)
              return super.getState(moduleName)
            }
          }
          const specStore = createSpecStore({
            stateWorker: CustomStateWorker
          })
          let callsCount = getStateMock.mock.calls.length
          specStore.getState('specModule')
          callsCount = getStateMock.mock.calls.length - callsCount
          expect(callsCount).toBe(1)
        }],
      ],
      resetState: [
        ['should reset state of module', () => {
          testableStore.modules.specModule.addBar()
          testableStore.modules.specModule.addFoo()
          testableStore.resetState('specModule')
          expect(testableStore.modules.specModule.state).toStrictEqual({})
        }],
        ['should call "resetState" of "stateWorker" class', () => {
          const resetStateMock = jest.fn()
          class CustomStateWorker extends StateWorker {
            public resetState<State> (moduleInstance: StonexModule<State>, callback?: any): void {
              resetStateMock(moduleInstance)
              return super.resetState(moduleInstance, callback)
            }
          }
          const specStore = createSpecStore({
            stateWorker: CustomStateWorker
          })
          let callsCount = resetStateMock.mock.calls.length
          specStore.resetState('specModule')
          callsCount = resetStateMock.mock.calls.length - callsCount
          expect(callsCount).toBe(1)
        }],
      ],
      setState: [
        ['should update state of module', () => {
          testableStore.setState('specModule', {
            foo: 'bar'
          })
          expect(testableStore.modules.specModule.state).toStrictEqual({
            foo: 'bar'
          })
        }],
        ['should call "setState" of "stateWorker" class', () => {
          const setStateMock = jest.fn()
          class CustomStateWorker extends StateWorker {
            public setState<State> (
              moduleInstance: StonexModule<State>,
              changes: Partial<State> | ((state: State) => Partial<State>),
              callback?: any
            ): void {
              setStateMock(moduleInstance, changes)
              return super.setState(moduleInstance, changes, callback)
            }
          }
          const specStore = createSpecStore({
            stateWorker: CustomStateWorker
          })
          let callsCount = setStateMock.mock.calls.length
          specStore.setState('specModule', { foo: 'bar' })
          callsCount = setStateMock.mock.calls.length - callsCount
          expect(callsCount).toBe(1)
        }],
      ]
    }

    testAllCases(methods, methodName => `${methodName}()`)
  })

})
