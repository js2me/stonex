import { StonexModule } from '../../src'
import { testAllCases, testPropertiesOnExist } from './__helpers__'
import { createSpecStore, SpecModule, SpecNestedModule, SpecNotEmptyModule, SpecPureModule } from './__spec__'

describe('StonexModule', () => {

  const testStonexModule = <ModuleType extends StonexModule>(
    moduleStoreKey: string,
    moduleName: string,
    {
      specProp,
      specTestActions,
      initialState = {}
    }: { specProp: string, specTestActions: string[], initialState?: object }) => {
    describe(moduleName, () => {

      let testableModule: ModuleType

      const initializeSpec = () => {
        testableModule = createSpecStore().modules[moduleStoreKey]
      }

      beforeEach(initializeSpec)

      describe('primitive specs', () => {
        test('module should be successfully connected to store', () => {
          expect(testableModule).toBeDefined()
        })

        initializeSpec()

        testPropertiesOnExist([
        ['getState', 'function'],
        ['moduleName', 'string'],
        ['__initialState', 'object'],
        ['modules', 'object'],
        ['resetState', 'function'],
        ['setState', 'function'],
        ], testableModule)

      })

      describe('properties', () => {

        const properties: any = {
          __initialState: [
            ['should be equals to initial value', () => {
              testableModule.setState({ foo: 'bar' })
              expect(testableModule.__initialState).toStrictEqual({ ...initialState })
            }],
          ],
          [`custom-property/${specProp}`]: [
            ['should be existed', () => {
              expect(testableModule[specProp]).toBeDefined()
            }]
          ],
          moduleName: [
            ['should return name of module', () => {
              expect(testableModule.moduleName).toBe(moduleStoreKey)
            }],
          ],
          modules: [
            ['should be able to get access to another modules', () => {
              expect(testableModule.modules[moduleStoreKey]).toBe(testableModule)
            }],
          ],
          state: [
            ['should have initial value', () => {
              expect(testableModule.state).toStrictEqual({ ...initialState })
            }],
            ['should catch an exception when state has been reassigned manually (immutability 1 unit test)', () => {
              let exceptionCatched = false
              try {
                // @ts-ignore @ts-nocheck
                testableModule.state = { 'foo': 'I want to change it' }
              } catch (e) {
                exceptionCatched = true
              }
              expect(exceptionCatched).toBeTruthy()
              expect(testableModule.getState()).toStrictEqual({ ...initialState })
            }],
            ['getState() should return actual state value (immutability 2 unit test)', () => {
              testableModule.state.foo = 'bar'
              expect(testableModule.getState()).toStrictEqual({ ...initialState })
            }],
            ['getState() should return actual state value (immutability 3 unit test)', () => {
              testableModule.state.foo = 'bar'
              testableModule.setState(testableModule.state)
              expect(testableModule.getState()).toStrictEqual({ ...initialState })
            }],
          ]
        }

        testAllCases(properties, property => property)
      })

      describe('methods', () => {

        const methods: any = {
          getState: [
            ['should return actual state', () => {
              testableModule.setState({ foo: 'bar' })
              expect(testableModule.getState()).toStrictEqual({ foo: 'bar' })
            }],
            ['should be equals to state property', () => {
              testableModule.setState({ foo: 'bar' })
              expect(testableModule.getState()).toStrictEqual(testableModule.state)

            }],
          ],
          resetState: [
            ['should reset state', () => {
              testableModule.setState({ foo: 'bar' })
              testableModule.resetState()
              expect(testableModule.state).toStrictEqual({ ...initialState })
            }],
            ['should call callback function when state has been resetted', (done: any) => {
              testableModule.setState({ foo: 'bar' })
              testableModule.resetState((state) => {
                expect(state).toStrictEqual({ ...initialState })
                done()
              })
            }],
          ],
          setState: [
            ['should update state (object -> object) (1)', () => {
              testableModule.setState({ foo: 'bar' })
              expect(testableModule.state).toStrictEqual({ foo: 'bar' })
            }],
            ['should update state (object -> object) (2)', () => {
              const newState = { ...initialState, ...testableModule.state }
              newState.foo = 'baz'
              testableModule.setState(newState)
              expect(testableModule.state).toStrictEqual({ ...initialState, foo: 'baz' })
            }],
            ['should update state (object -> array) (1)', () => {
              testableModule.setState([1])
              expect(testableModule.state).toStrictEqual([1])
            }],
            ['should update state (object -> array) (2)', () => {
              testableModule.setState([1])
              const newState = [...testableModule.state]
              newState.push(2,3,4)
              testableModule.setState(newState)
              expect(testableModule.state).toStrictEqual([1,2,3,4])
            }],
            ['should call callback function when state has been changed', (done: any) => {
              testableModule.setState({ foo: 'bar' }, (state) => {
                expect(state).toStrictEqual({ foo: 'bar' })
                done()
              })
            }],
            ['should async update state', (done: any) => {
              testableModule.setState((state) => {
                return {
                  ...state,
                  bar: 'baz',
                  foo: 'bar',
                }

              }, (state) => {
                expect(state).toStrictEqual({ foo: 'bar', bar: 'baz' })
                done()
              })
            }],
          ],
        }

        testAllCases(methods, methodName => `${methodName}()`)
      })

      describe('actions', () => {

        const baseTestCasesForAction = (methodName: string) => {
          testableModule[methodName]({ foo: 'bar' })
          expect(testableModule.state).toStrictEqual({ foo: 'bar' })
          testableModule[methodName]([1,2,3,4,5])
          expect(testableModule.state).toStrictEqual([1,2,3,4,5])
          testableModule[methodName](5)
          expect(testableModule.state).toStrictEqual(5)
          testableModule[methodName]('some string')
          expect(testableModule.state).toStrictEqual('some string')
        }

        const actions = specTestActions.reduce((actions, actionName) => {
          actions[actionName] = [
            ['should update state', () => {
              baseTestCasesForAction(actionName)
            }]
          ]
          return actions
        }, {})
        testAllCases(actions, actionName => `${actionName}()`)
      })

    })
  }

  testStonexModule<SpecModule>('specModule', 'SpecModule', {
    specProp: 'specProp',
    specTestActions: [
      'updateSpecState',
      'updateSpecState2'
    ]
  })
  testStonexModule<SpecNestedModule>('specNestedModule', 'SpecNestedModule', {
    specProp: 'specProp',
    specTestActions: [
      'updateSpecState',
      'updateSpecState2'
    ]
  })
  testStonexModule<SpecPureModule>('specPureModule', 'SpecPureModule', {
    specProp: 'specProp',
    specTestActions: [
      'updateSpecState'
    ]
  })
  testStonexModule<SpecNotEmptyModule>('specNotEmptyModule', 'SpecNotEmptyModule', {
    initialState: {
      bar: 'baz',
      foo: 'bar',
    },
    specProp: 'specProp',
    specTestActions: [
      'updateSpecState',
      'updateSpecState2'
    ],
  })
})
