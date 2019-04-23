import { StateWorker, StonexStore } from '../lib'
// import Logger from './modifiers/Logger'
import modules, { Modules } from './modules'

export default new StonexStore<Modules>(modules,{
  modifiers: [
    // Logger
  ],
  stateWorker: class OwnFuckinStateWorker extends StateWorker {}
})
