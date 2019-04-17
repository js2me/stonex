import { StonexStore } from './lib'
import { StonexModule } from './lib/StonexModule'

export class Books extends StonexModule<string[]> {
  public state = []

  public add (book: string): void {
    this.setState([...this.state, `${this.state.length + 1}. ${book}`], (state) => {
      console.log('it should be updated', state)
    })
  }
}

export class Items extends StonexModule<{ data: number[]; isLoading: boolean }> {
  public state = {
    data: [],
    isLoading: false
  }

  public getList = async () => {
    this.setState({ isLoading: true })
    const data = await Promise.resolve([1, 2, 3, 4, 5, 6])
    this.setState({ data })
    return this.state.data
  }
}

const store = new StonexStore({ books: Books, items: Items })

store.modules.books.add('example')

store.connectModule('bukz', {
  module: Books
})
// TODO: store.modules.bukz -> not exist :(

store.modules.items
  .getList()
  .then((listData: any) => {
    console.log('listData', listData)
    store.modules.items.resetState()
  })
  .catch((e: any) => {
    console.log('e', e)
  })

console.log(store.modules.books.getState())