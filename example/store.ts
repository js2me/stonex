import { StateWorker, StonexStore } from '../src'
// import Logger from './modifiers/Logger'
import modules, { Modules } from './modules'

const store = new StonexStore<Modules>(modules,{
  modifiers: [
    // Logger
  ],
  stateWorker: class SuperStateWorker extends StateWorker {}
})

export default store
