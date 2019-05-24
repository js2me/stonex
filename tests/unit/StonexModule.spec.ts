import { StonexModule, StonexStore } from '../../src'
// import { StonexModule } from '../../src/StonexModule'

console.log('SttonexModule', StonexModule)

const createSpecStore = () => {

  class SpecModule extends StonexModule {
    public state = {}

    public updateSpecState (newData: any): void {
      this.setState(newData)
    }
  }

  return new StonexStore({
    specModule: SpecModule
  })
}

describe('StonexModule', () => {

  const specStore = createSpecStore()

  describe('primitive specs', () => {
    test('module should be successfully connected to store', () => {
      expect(specStore.modules.specModule).toBeDefined()
    })

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
        expect(specStore.modules.specModule).toHaveProperty(property)
      })
    })

    // expect(specStore.modules.specModule).toHaveProperty('getStates')
  })

  describe('state property', () => {

    test('should have initial value', () => {
      expect(specStore.modules.specModule.state).toStrictEqual({})
    })

  })
  // test()

})
