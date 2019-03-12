import { createStore, StonexModule } from './lib'
import StonexEngine, { MiddlewareData } from './lib/StonexEngine'

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

const store = createStore({ books: Books }, [
  ({ methodName = '', moduleName, data, type }: MiddlewareData): void => {
    console.log(`${type} : [${moduleName.toUpperCase()}/${methodName.toUpperCase()}] \r\n\    args : `, data)
  },
])

store.modules.books.add('lol')

// const getList = store.modules.items.getList

// getList('lol')

// console.log('state', StonexEngine.createStateFromModules(store.modules))
