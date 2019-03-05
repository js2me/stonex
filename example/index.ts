import { createStore } from '../lib'
import ItemsModule from './modules/items'

const store = createStore({
  items: ItemsModule
})

console.log(store)


export default store
