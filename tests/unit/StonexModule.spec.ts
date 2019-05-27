import { testAllCases } from '../__helpers__'
import { createSpecStore, SpecModule } from '../__spec__'

describe('StonexModule', () => {

  let testableModule: SpecModule

  beforeEach(() => {
    testableModule = createSpecStore().modules.specModule
  })

  describe('primitive specs', () => {
    test('module should be successfully connected to store', () => {
      expect(testableModule).toBeDefined()
    })

    const requiredProperties = [
      ['getState', 'function'],
      ['moduleName', 'string'],
      ['__initialState', 'object'],
      ['modules', 'object'],
      ['resetState', 'function'],
      ['setState', 'function'],
    ]

    requiredProperties.forEach(([property, type]) => {
      describe(`"${property}" property`, () => {
        test(`module should contain this property`, () => {
          expect(testableModule).toHaveProperty(property)
        })
        test(`this property should have type "${type}"`, () => {
          expect(typeof testableModule[property]).toBe(type)
        })
      })
    })

  })

  describe('properties', () => {

    const properties: any = {
      __initialState: [
        ['should be equals to initial value', () => {
          testableModule.setState({ foo: 'bar' })
          expect(testableModule.__initialState).toStrictEqual({})
        }],
      ],
      moduleName: [
        ['should return name of module', () => {
          expect(testableModule.moduleName).toBe('specModule')
        }],
      ],
      modules: [
        ['should be able to get access to another modules', () => {
          expect(testableModule.modules.specModule).toBe(testableModule)
        }],
      ],
      state: [
        ['should have initial value', () => {
          expect(testableModule.state).toStrictEqual({})
        }],
        ['should catch an exception when state has been reassigned manually (immutability 1 unit test)', () => {
          let exceptionCatched = false
          try {
            testableModule.state = { 'foo': 'I want to change it' }
          } catch (e) {
            exceptionCatched = true
          }
          expect(exceptionCatched).toBeTruthy()
          expect(testableModule.getState()).toStrictEqual({})
        }],
        ['getState() should return actual state value (immutability 2 unit test)', () => {
          testableModule.state.foo = 'bar'
          expect(testableModule.getState()).toStrictEqual({})
        }],
        ['getState() should return actual state value (immutability 3 unit test)', () => {
          testableModule.state.foo = 'bar'
          testableModule.setState(testableModule.state)
          expect(testableModule.getState()).toStrictEqual({})
        }],
      ],
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
          expect(testableModule.state).toStrictEqual({})
        }],
        ['should call callback function when state has been resetted', (done: any) => {
          testableModule.setState({ foo: 'bar' })
          testableModule.resetState((state) => {
            expect(state).toStrictEqual({})
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
          const newState = { ...testableModule.state }
          newState.foo = 'baz'
          testableModule.setState(newState)
          expect(testableModule.state).toStrictEqual({ foo: 'baz' })
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

    const actions: any = {
      updateSpecState: [
        ['should update state', () => {
          testableModule.updateSpecState({ foo: 'bar' })
          expect(testableModule.state).toStrictEqual({ foo: 'bar' })
          testableModule.updateSpecState([1,2,3,4,5])
          expect(testableModule.state).toStrictEqual([1,2,3,4,5])
          testableModule.updateSpecState(5)
          expect(testableModule.state).toStrictEqual(5)
          testableModule.updateSpecState('some string')
          expect(testableModule.state).toStrictEqual('some string')
        }]
      ]
    }

    testAllCases(actions, actionName => `${actionName}()`)
  })
})
