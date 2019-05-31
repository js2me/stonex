import { Modifier } from '../../src'
import { createSpecStore, StonexModules } from './__spec__'

describe('Modifiers', () => {

  describe('Store Modifier', () => {

    test('should be called by creating a store', () => {
      const modifierMock = jest.fn()
      const storeModifier: Modifier<StonexModules> = modifierMock

      const store = createSpecStore({
        modifiers: [
          storeModifier
        ]
      })

      expect(modifierMock).toBeCalledTimes(1)
      expect(modifierMock).toBeCalledWith(store)
    })

  })

  describe('Module Modifier', () => {

    test('should be called by attaching a module to store', () => {
      const modifierMock = jest.fn()
      const moduleModifier: Modifier<StonexModules> = () => modifierMock

      const store = createSpecStore({
        modifiers: [
          moduleModifier
        ]
      })

      expect(modifierMock).toBeCalledTimes(Object.keys(store.modules).length)
    })

  })

  describe('Action Modifier', () => {

    test('should be not called by initializing store', () => {
      const modifierMock = jest.fn()
      const actionModifier: Modifier<StonexModules> = () => () => modifierMock

      createSpecStore({
        modifiers: [
          actionModifier
        ]
      })

      expect(modifierMock).toBeCalledTimes(0)
    })

    test('should be called when some action is executing', () => {
      const modifierMock = jest.fn()
      const actionModifier: Modifier<StonexModules> = () => () => modifierMock

      const store = createSpecStore({
        modifiers: [
          actionModifier
        ]
      })

      store.modules.specModule.addFoo()
      expect(modifierMock).toBeCalledTimes(1)
    })

  })

})
