import { StonexModule } from '../../src'

export default class BlackBox extends StonexModule<any> {
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
