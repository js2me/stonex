import { StateWorker } from '../../src'
import { testAllCases, testPropertiesOnExist } from './__helpers__'
import { createSpecStore, SpecModule, SpecNestedModule } from './__spec__'

describe('StateWorker', () => {
  let mockedStonexModule: SpecModule
  let mockedSecondStonexModule: SpecNestedModule
  let testableStateWorker: StateWorker

  const initializeSpec = () => {
    testableStateWorker = new StateWorker()
    mockedStonexModule = createSpecStore().modules.specModule
    mockedSecondStonexModule = createSpecStore().modules.specNestedModule
  }

  beforeEach(initializeSpec)

  describe('primitive specs', () => {
    initializeSpec()

    testPropertiesOnExist([
      ['getState', 'function'],
      ['initializeState', 'function'],
      ['resetState', 'function'],
      ['setState', 'function'],
      ['state', 'object'],
      ['updateState', 'function'],
    ], testableStateWorker)
  })

  describe('properties', () => {
    const properties: any = {
      state: [
        ['should have initialized value', () => {
          expect(testableStateWorker.state).toStrictEqual({})
        }],
      ]
    }

    testAllCases(properties, propertyName => propertyName)
  })

  const changeStateOfStateWorker = () => {
    testableStateWorker.setState(mockedStonexModule, { foo: 'bar' })
    testableStateWorker.setState(mockedSecondStonexModule, { bar: 'baz' })
  }

  describe('methods', () => {
    const methods: any = {
      // getState: [
      //   ['should be changed when state has been updated via "setState"', () => {
      //     changeStateOfStateWorker()
      //     expect(testableStateWorker.state).toStrictEqual({
      //       specModule: { foo: 'bar' },
      //       specNestedModule: { bar: 'baz' },
      //     })
      //   }],
      //   ['should be changed when state has been updated via "resetState"', () => {
      //     changeStateOfStateWorker()
      //     testableStateWorker.resetState(mockedSecondStonexModule)
      //     expect(testableStateWorker.state).toStrictEqual({
      //       specModule: { foo: 'bar' },
      //       specNestedModule: {},
      //     })
      //   }],
      // ],
      initializeState: [
        ['should put initialState value to the state of StateWorker', () => {
          changeStateOfStateWorker()
          testableStateWorker.initializeState(mockedSecondStonexModule)
          expect(testableStateWorker.state.specNestedModule).toStrictEqual({})
        }]
      ],
      resetState: [
        ['should reset state of module', () => {
          changeStateOfStateWorker()
          testableStateWorker.resetState(mockedSecondStonexModule)
          expect(testableStateWorker.state).toStrictEqual({
            specModule: { foo: 'bar' },
            specNestedModule: {},
          })
        }],
        ['should call callback when state has been resetted', (done: any) => {
          changeStateOfStateWorker()
          testableStateWorker.resetState(mockedSecondStonexModule, () => {
            expect(testableStateWorker.state).toStrictEqual({
              specModule: { foo: 'bar' },
              specNestedModule: {},
            })
            done()
          })
        }],
      ],
      setState: [
        ['should change state', () => {
          changeStateOfStateWorker()
          expect(testableStateWorker.state).toStrictEqual({
            specModule: { foo: 'bar' },
            specNestedModule: { bar: 'baz' },
          })
        }],
        ['should call callback when state has been changed', (done: any) => {
          changeStateOfStateWorker()
          testableStateWorker.setState(mockedSecondStonexModule, { example: '1' }, () => {
            expect(testableStateWorker.state).toStrictEqual({
              specModule: { foo: 'bar' },
              specNestedModule: { example: '1' },
            })
            done()
          })
        }],
      ],
    }

    testAllCases(methods, methodName => `${methodName}()`)
  })

  // describe('methods', () => {
  //   const methods = {

  //   }

  // })

})
