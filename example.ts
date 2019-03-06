import ItemsModule from './example/modules/items'
import { createStore } from './lib'

const store = createStore({
  items: ItemsModule,
})

store.items.setFullItem({ id: 'test1' })
store.items.setFullItem({ id: 'test1' })
store.items.setFullItem({ id: 'test1' })
store.items.setFullItem({ id: 'test2' })
store.items.setFullItem({ id: 'test3' })
store.items.setFullItem({ id: 'test4' })

setTimeout(()=>{
  console.log('asd', store.items.getState())
})