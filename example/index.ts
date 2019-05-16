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
