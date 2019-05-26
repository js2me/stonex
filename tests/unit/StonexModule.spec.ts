import { StonexModule, StonexStore } from '../../src'

class SpecModule extends StonexModule {
  public state: any = {}

  public updateSpecState (newData: any): void {
    this.setState(newData)
  }
}

class SpecNestedModule extends SpecModule {

  public updateSpecState (newData: any): void {
    this.setState(newData)
  }
}

interface StonexModules {
  specModule: SpecModule,
  specNestedModule: SpecNestedModule,
}

const createSpecStore = () => {
  return new StonexStore<StonexModules>({
    specModule: SpecModule,
    specNestedModule: SpecNestedModule,
  })
}

describe('StonexModule', () => {

  let testableModule: SpecModule

  beforeEach(() => {
    testableModule = createSpecStore().modules.specModule
  })

  describe('primitive specs', () => {
    test('module should be successfully connected to store', () => {
      expect(testableModule).toBeDefined()
    })

    // specStore.modules.specModule.updateSpecState()

    // test('module should have ability to create state snapshot', () => {
    //   expect(specStore.createStateSnapshot()).toStrictEqual({
    //     specModule: {},
    //     specNestedModule: {},
    //   })
    // })

    // test('stonex store should have unique id')

    const requiredProperties = [
      'getState',
      'moduleName',
      'modules',
      'resetState',
      'setState',
      'setState',
    ]

    requiredProperties.forEach(property => {
      test(`module should contain require property ${property}`, () => {
        expect(testableModule).toHaveProperty(property)
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

      test('should reset state', done => {
        testableModule.setState({ foo: 'bar' })
        console.log('testableModule.__initialState', testableModule.__initialState)
        testableModule.resetState()
        expect(testableModule.state).toStrictEqual({})
        done()
      })

      // test('should call callback function when state has been resetted', done => {
      //   testableModule.setState({ foo: 'bar' })
      //   testableModule.resetState((state) => {
      //     expect(state).toStrictEqual({})
      //     done()
      //   })
      // })

    })
    // describe('createStateSnapshot()', () => {

    //   test('module should have ability to create state snapshot', () => {
    //     expect(testableModule.createStateSnapshot()).toStrictEqual({
    //       specModule: {},
    //       specNestedModule: {},
    //     })
    //   })
    // })
  })
})
