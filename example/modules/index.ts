import { PureStonexModule } from '../../src'
import BlackBox from './BlackBox'
import Books from './Books'
import Items from './Items'

export declare interface Modules {
  blackBox: BlackBox
  books: Books
  items: Items,
  bukz: Books,
  things: {
    state: any,
    addThing: (name: any) => any
  },
  otherItems: Items,
}

export default {
  blackBox: BlackBox,
  books: Books,
  items: Items,
  things: {
    addThing (name: any): any {
      // @ts-ignore
      this.setState({
        ...this.state,
        [name]: {
          data: 'thing',
          name,
        }
      })
    },
    state: {},
  } as PureStonexModule<any>,
}
