import { createStoreBinder, StateWorker, StonexStore } from '../src'
// import Logger from './modifiers/Logger'
import modules, { Modules } from './modules'
import Items from './modules/Items'

const store = new StonexStore<Modules>(modules,{
  modifiers: [
    // Logger
  ],
  stateWorker: class SuperStateWorker extends StateWorker {}
})

store.connectModule('otherItems', {
  module: Items,
  storeBinder: createStoreBinder('otherItems', store)
},)

store.modules.otherItems.getList().then(() => {
  console.log('other items state', store.modules.otherItems.state)
})

export default store
