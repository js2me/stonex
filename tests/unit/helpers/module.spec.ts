import { StonexModule } from '../../../src'
import { convertToStandardModule, getAllMethodsFromModule, isPureModule } from '../../../src/helpers/module'
import { testAllCases } from '../../__helpers__'

describe('base helpers', () => {

  const helpers: any = {
    convertToStandardModule: [
      ['should return class extended from StonexModule', () => {
        const StandardModule = convertToStandardModule({})
        expect(typeof StandardModule).toBe('function')
        expect(StandardModule.prototype.constructor.__proto__.name).toBe('StonexModule')
      }]
    ],
    getAllMethodsFromModule: [
      ['should pick all method names from object', () => {
        const methodNames = getAllMethodsFromModule({
          method1 (): any { return null },
          method2 (): any { return null },
          method3 (): any { return null },
          state: {},
        })
        expect(methodNames).toStrictEqual(['method1','method2','method3'])
      }]
    ],
    isPureModule: [
      ['should return true if module is pure', () => {
        expect(isPureModule(class extends StonexModule<any> {
          public state: any = {}

          public getData (): any {
            return null
          }
        })).toBeFalsy()
        expect(isPureModule({
          state: {},
          getData (): any {
            return null
          }
        })).toBeTruthy()
      }]
    ],
  }

  testAllCases(helpers, helperName => helperName)
})
