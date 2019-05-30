import { createStoreBinder, StoreBinder } from '../../src'
import { testPropertiesOnExist } from './__helpers__'
import { createSpecStore, StonexModules } from './__spec__'

describe('StoreBinder', () => {
  let testableStoreBinder: StoreBinder<any, StonexModules>

  const initializeSpec = () => {
    const specStore = createSpecStore()
    testableStoreBinder = createStoreBinder('specModule', specStore)
  }

  beforeEach(initializeSpec)

  describe('primitive specs', () => {

    initializeSpec()

    testPropertiesOnExist([
      ['setState', 'function'],
      ['moduleName', 'string'],
      ['modules', 'object'],
      ['resetState', 'function'],
      ['setState', 'function'],
    ], testableStoreBinder)

  })

  // describe('properties', () => {
  //   const properties: any = {
  //   }

  //   testAllCases(properties, (property) => property)
  // })

  // describe('methods', () => {
  //   const methods: any = {
  //   }

  //   testAllCases(methods, methodName => `${methodName}()`)
  // })

})
