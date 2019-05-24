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

  describe('state property', () => {

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

    describe('updating state', () => {

      // beforeEach(() => {
      //   specStore
      // })

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

      })

    })
  })
})
