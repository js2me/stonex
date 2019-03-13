import { createStore, MiddlewareData, StonexModule } from './lib'

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
    const data = await Promise.resolve([1,2,3,4,5,6])
    this.setState({ data })
    return this.state.data
  }
}

const store = createStore({ books: Books, items: Items }, [
  ({ methodName = '', moduleName, data, type }: MiddlewareData): void => {
    console.log(`${type} : [${moduleName.toUpperCase()}/${methodName.toUpperCase()}] \r\n\    args : `, data)
  },
])

store.modules.books.add('some book 1')
store.modules.books.add('some book 2')
store.modules.books.add('some book 3')
store.modules.books.add('some book 4')

store.modules.items.getList().then((listData) => {
  console.log('listData', listData)
}).catch((e: any) => {
  console.log('e', e)
})
// const getList = store.modules.items.getList

// getList('lol')

// console.log('state', StonexEngine.createStateFromModules(store.modules))
