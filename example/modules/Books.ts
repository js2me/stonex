import { StonexModule } from '../../src'

export declare interface Book {
  name: string,
  author: string
}

export default class Books extends StonexModule<string[]> {
  public state = []

  public add (book: Book): void {
    this.setState([...this.state, `${book.name} of ${book.author}`])

    console.log('Books -> this.modules.items.state', this.modules.items.state)
    this.modules.items.getList('lol')
  }
}
