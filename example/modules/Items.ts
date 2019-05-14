import { Modules } from '.'
import { StonexModule } from '../../src'

export default class Items extends StonexModule<{ data: number[]; isLoading: boolean }, Modules> {
  public state = {
    data: [],
    isLoading: false
  }

  public getList = async () => {

    console.log('get list called')

    if (this.state.data.length) {
      return this.state.data
    }

    this.setState({ isLoading: true })
    const data = await Promise.resolve([1, 2, 3, 4, 5, 6])
    this.setState({ data })

    return this.state.data
  }
}
