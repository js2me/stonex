import { createStore } from '../lib'
import ItemsModule from './modules/items'

const store = createStore({
  items: ItemsModule
})

export default store
