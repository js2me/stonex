import _ from 'lodash'
import { StonexModule } from '../../lib'

declare interface Item {
  id: string
}

declare interface Map<T> {
  [key: string]: T
}

declare interface State {
  byId: Map<Item>
  fullById: Map<Item>,
  byIdInitialized: boolean,
}

class ItemsModule extends StonexModule<State> {
  public initialState = {
    byId: {},
    byIdInitialized: false,
    fullById: {},
  }

  public async getItems (): Promise<Map<Item>> {
    if (!this.state.byIdInitialized) {
      const { data: items } = await Promise
        .resolve({ data: [{ id: 'string' }] })
      this.setState({
        byId: _.reduce(items,
            (items, item) => {
              items[item.id] = item
              return items
            },
            {}),
        byIdInitialized: true
      })
    }
    return this.state.byId
  }

  public setFullItem (fullItem: Item): any {
    this.setState({
      fullById: {
        ...this.state.fullById,
        [fullItem.id]: { ...fullItem }
      }
    })
  }

}

export default ItemsModule
