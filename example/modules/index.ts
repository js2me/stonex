import Animals from './Animals'
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
  animals: any
}

export default {
  animals: Animals,
  blackBox: BlackBox,
  books: Books,
  items: Items,
  things: {
    state: {},
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
  },
}
