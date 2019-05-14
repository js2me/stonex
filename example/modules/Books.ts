import { StonexModule } from '../../src'

export declare interface Book {
  name: string,
  author: string
}

export default class Books extends StonexModule<string[]> {
  public state = []

  public add (book: Book): void {
    this.setState([...this.state, `${book.name} of ${book.author}`])

    this.modules.items.getList('lol')
  }
}
