import { createStore, StonexModule } from './lib'

export class Books extends StonexModule<any> {
  public state = []

  public add (book: string): void {
    this.setState([...this.state, `${this.state.length + 1}. ${book}`])
  }
}

const store = createStore({
  example: Books,
})

store.modules.example.actions.add('Foo B.')
store.modules.example.actions.add('Bar F.')
store.modules.example.actions.add('AI F.')

console.log(store.modules.example.state)
