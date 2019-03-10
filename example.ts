import { createStore, StonexModule } from './lib'

export class Books extends StonexModule<any> {
  public state = []

  public add (book: string): void {
    this.setState([...this.state, `${this.state.length + 1}. ${book}`])
  }
}

export class Items extends StonexModule<any> {
  public state = {
    isLoading: false,
    data: [],
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

store.modules.books.actions.add('Foo B.')
store.modules.books.actions.add('Bar F.')
store.modules.books.actions.add('AI F.')
console.log(store.modules.books.state)

console.log('before', store.modules.items.state)

const getList = store.modules.items.actions.getList

getList().then((state: any)=>{
  console.log('response', store.modules.items.state, state)
})

console.log('after', store.modules.items.state)
