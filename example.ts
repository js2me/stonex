import { Modifier, StateWorker, StonexStore, Store } from './lib'
import { StonexModule } from './lib/StonexModule'

export class Books extends StonexModule<string[]> {
  public state = []

  public add (book: string): void {
    this.setState([...this.state, `${this.state.length + 1}. ${book}`])
  }
}

export class Items extends StonexModule<{ data: number[]; isLoading: boolean }> {
  public state = {
    data: [],
    isLoading: false
  }

  public getList = async () => {
    if (this.state.data.length) {
      return this.state.data
    }

    this.setState({ isLoading: true })
    const data = await Promise.resolve([1, 2, 3, 4, 5, 6])
    this.setState({ data })
    return this.state.data
  }
}

export class BlackBox extends StonexModule<any> {
  public state = {
    foo: {
      bar: 'bar'
    }
  }

  public changeSomething (ref: any): any {
    this.setState({
      foo: {
        ...this.state.foo,
        bar: ref
      }
    })
  }
}

declare interface MyStore {
  blackBox: BlackBox
  books: Books
  items: Items,
  bukz: Books,
}

const Logger: Modifier<MyStore> = (store: Store<MyStore>) => {
  console.log('-----> [STORE] CREATED', Object.keys(store.modules))

  return (module: StonexModule) => {
    console.log('-----> [MODULE] CREATED', module.moduleName.toUpperCase())

    const closuredGetState = module.getState.bind(module)
    const closuredSetState = module.setState.bind(module)
    const closuredResetState = module.resetState.bind(module)

    module.getState = (...args) => {

      const state = closuredGetState(...args)
      console.log(`-----> [MODULE ${module.moduleName.toUpperCase()}] {GET STATE}`, state)
      return state
    }

    module.setState = (...args) => {

      const prevState = closuredGetState()

      const resultOfSetState = closuredSetState(...args)
      console.log(`-----> [MODULE ${module.moduleName.toUpperCase()}] {SET STATE}`, args)
      console.log(`-----> [MODULE ${module.moduleName.toUpperCase()}]             prev state: `, prevState)
      console.log(`-----> [MODULE ${module.moduleName.toUpperCase()}]             new state: `, closuredGetState())
      return resultOfSetState
    }

    module.resetState = () => {
      console.log(`-----> [MODULE ${module.moduleName.toUpperCase()}] {RESET STATE}`)
      return closuredResetState()
    }

    return (args, moduleName: string, methodName: string) => {
      console.log(`-----> [ACTION] CALLED ${moduleName.toUpperCase()}/${methodName.toUpperCase()}
                arguments`, args)
    }
  }
}

const store = new StonexStore<MyStore>(
  {
    blackBox: BlackBox,
    books: Books,
    items: Items,
  },{
    modifiers: [
      Logger
    ],
    stateWorker: class OwnFuckinStateWorker extends StateWorker {}
  }
)

store.modules.books.add('example')

store.connectModule('bukz', {
  module: Books
})

// TODO: store.modules.bukz -> not exist :(

store.modules.items
  .getList()
  .then((listData: any) => {
    store.modules.items.resetState()
  })
