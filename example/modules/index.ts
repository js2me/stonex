import BlackBox from './BlackBox'
import Books from './Books'
import Items from './Items'

export declare interface Modules {
  blackBox: BlackBox
  books: Books
  items: Items,
  bukz: Books,
}

export default {
  blackBox: BlackBox,
  books: Books,
  items: Items,
}
