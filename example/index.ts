import { createStoreBinder } from '../src'
import Items from './modules/Items'
import store from './store'

store.modules.books.add({
  author: 'Ginger Bread',
  name: 'Peter Pen',
})
store.modules.books.add({
  author: 'Black Jack',
  name: 'POD',
})
store.modules.books.add({
  author: 'Steven King',
  name: 'Black hole',
})
console.log(store.modules.books.state)

try {
  store.modules.books.state = []
} catch (e) {
  console.error('Catched an error')
}

store.modules.things.addThing('superb thing')

console.log('updated state of pure stonex module', store.modules.things.state)

store.connectModule('otherItems', {
  module: Items,
  storeBinder: createStoreBinder('otherItems', store)
},)

store.modules.otherItems.getList().then(() => {
  console.log('other items state', store.modules.otherItems.state)
})

store.modules.animals.createDog('Fluffy')
console.log('animals state', store.modules.animals.state)

console.log('store.modules.books.__initialState', store.modules.books.__initialState)

store.modules.books.resetState()
console.log('store.modules.books.state', store.modules.books.state)
