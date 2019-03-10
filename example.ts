import { createStore, StonexModule } from './lib'

export class Books extends StonexModule<any> {
  public state = []

  public add (book: string): void {
    this.setState([...this.state, `${this.state.length + 1}. ${book}`])
  }
}

export class Items extends StonexModule<any> {
  public state = {
    data: [],
    isLoading: false,
  }

  public getList = async () => {
    this.setState({ isLoading: true })
    const data = await Promise.resolve({ data: [1,2,3,4,5,6] })
    this.setState(data)
    return this.state
  }
}

const store = createStore({
  books: Books,
  items: Items,
})

store.modules.books.add('Foo B.')
store.modules.books.add('Bar F.')
store.modules.books.add('AI F.')

console.log(store.modules.books.state)
console.log('before', store.modules.items.state)

const getList = store.modules.items.getList

getList().then((state: any) => {
  console.log('response', store.modules.items.getState(), state)
})

console.log('after', store.modules.items.state)
