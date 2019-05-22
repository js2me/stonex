import { StonexModule, StonexStore } from '../../lib/stonex'
// import { StonexModule } from '../../src/StonexModule'

console.log('SttonexModule', StonexModule)

const createSpecStore = () => {

  class SpecModule extends StonexModule {
    public state = {}

    public updateSpecState (newData): void {
      this.setState(newData)
    }
  }

  return new StonexStore({
    specModule: SpecModule
  })
}

test('StonexModule', () => {

  const specStore = createSpecStore()

  test('primitive specs', () => {
    test('module should be successfully connected to store', () => {
      expect(specStore.modules.specModule).toHaveProperty('getState')
    })
  })

  test('state property', () => {

    test('should have initial value', () => {
      expect(specStore.modules.specModule.state).toBe({})
    })

  })
  // test()

})
