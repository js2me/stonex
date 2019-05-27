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

    describe('state', () => {

      test('should have initial value', () => {
        expect(testableModule.state).toStrictEqual({})
      })

      test('should catch an exception when state has been reassigned manually (immutability 1 unit test)', () => {
        let exceptionCatched = false
        try {
          testableModule.state = { 'foo': 'I want to change it' }
        } catch (e) {
          exceptionCatched = true
        }
        expect(exceptionCatched).toBeTruthy()
        expect(testableModule.getState()).toStrictEqual({})
      })

      test('getState() should return actual state value (immutability 2 unit test)', () => {
        testableModule.state.foo = 'bar'
        expect(testableModule.getState()).toStrictEqual({})
      })

      test('getState() should return actual state value (immutability 3 unit test)', () => {
        testableModule.state.foo = 'bar'
        testableModule.setState(testableModule.state)
        expect(testableModule.getState()).toStrictEqual({})
      })

    })

    describe('moduleName', () => {

      test('should return name of module', () => {
        expect(testableModule.moduleName).toBe('specModule')
      })

    })

    describe('modules', () => {

      test('should be able to get access to another modules', () => {
        expect(testableModule.modules.specModule).toBe(testableModule)
      })

    })

    describe('__initialState', () => {

      test('should be equals to initial value', () => {
        testableModule.setState({ foo: 'bar' })
        expect(testableModule.__initialState).toStrictEqual({})
      })

    })

  })

  describe('methods', () => {

    describe('setState()', () => {

      test('should update state (object -> object) (1)', () => {
        testableModule.setState({ foo: 'bar' })
        expect(testableModule.state).toStrictEqual({ foo: 'bar' })
      })

      test('should update state (object -> object) (2)', () => {
        const newState = { ...testableModule.state }
        newState.foo = 'baz'
        testableModule.setState(newState)
        expect(testableModule.state).toStrictEqual({ foo: 'baz' })
      })

      test('should update state (object -> array) (1)', () => {
        testableModule.setState([1])
        expect(testableModule.state).toStrictEqual([1])
      })

      test('should update state (object -> array) (2)', () => {
        testableModule.setState([1])
        const newState = [...testableModule.state]
        newState.push(2,3,4)
        testableModule.setState(newState)
        expect(testableModule.state).toStrictEqual([1,2,3,4])
      })

      test('should call callback function when state has been changed', done => {
        testableModule.setState({ foo: 'bar' }, (state) => {
          expect(state).toStrictEqual({ foo: 'bar' })
          done()
        })
      })

      test('should async update state', (done) => {
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
      })
    })

    describe('getState()', () => {

      test('should return actual state', () => {
        testableModule.setState({ foo: 'bar' })
        expect(testableModule.getState()).toStrictEqual({ foo: 'bar' })
      })

      test('should be equals to state property', () => {
        testableModule.setState({ foo: 'bar' })
        expect(testableModule.getState()).toStrictEqual(testableModule.state)
      })

    })

    describe('resetState()', () => {

      test('should reset state', () => {
        testableModule.setState({ foo: 'bar' })
        testableModule.resetState()
        expect(testableModule.state).toStrictEqual({})
      })

      test('should call callback function when state has been resetted', done => {
        testableModule.setState({ foo: 'bar' })
        testableModule.resetState((state) => {
          expect(state).toStrictEqual({})
          done()
        })
      })

    })
  })

  describe('actions', () => {

    describe('updateSpecState()', () => {
      test('should update state', () => {
        testableModule.updateSpecState({ foo: 'bar' })
        expect(testableModule.state).toStrictEqual({ foo: 'bar' })
        testableModule.updateSpecState([1,2,3,4,5])
        expect(testableModule.state).toStrictEqual([1,2,3,4,5])
        testableModule.updateSpecState(5)
        expect(testableModule.state).toStrictEqual(5)
        testableModule.updateSpecState('some string')
        expect(testableModule.state).toStrictEqual('some string')
      })
    })

  })
})
