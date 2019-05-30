import { PureStonexModule, StonexModule, StonexStore } from '../../src'

export class SpecModule extends StonexModule {
  public state: any = {}

  public specProp: object = {
    prop1: '1',
    prop2: '2',
  }

  public updateSpecState (newData: any): void {
    this.setState(newData)
  }

  public updateSpecState2 = (newData: any) => {
    this.setState(newData)
  }
  public addBar (): any {
    this.setState({
      ...this.state,
      bar: 'baz',
    })
  }
  public addFoo (): any {
    this.setState({
      ...this.state,
      foo: 'bar',
    })
  }
}

export class SpecNestedModule extends SpecModule {

  public updateSpecState (newData: any): void {
    this.setState(newData)
  }
}

export class SpecNotEmptyModule extends StonexModule {
  public state: any = {
    bar: 'baz',
    foo: 'bar',
  }
  public addBar (): any {
    this.setState({
      ...this.state,
      bar: 'baz',
    })
  }
  public addFoo (): any {
    this.setState({
      ...this.state,
      foo: 'bar',
    })
  }
}

const specPureModule = {
  specProp: {
    prop1: '1',
    prop2: '2',
  },
  state: {},
  addBar (): any {
    this.setState({
      ...this.state,
      bar: 'baz',
    })
  },
  addFoo (): any {
    this.setState({
      ...this.state,
      foo: 'bar',
    })
  },
  updateSpecState (newData: any): any {
    this.setState(newData)
  }
} as PureStonexModule<{foo?: string, bar?: string}>

export interface SpecPureModule extends StonexModule<object> {
  addBar: any,
  addFoo: any,
  specProp: object,
}

export interface StonexModules {
  specModule: SpecModule,
  specNestedModule: SpecNestedModule,
  specNotEmptyModule: SpecNotEmptyModule
  specPureModule: SpecPureModule,
}

export const createSpecStore = () => {
  return new StonexStore<StonexModules>({
    specModule: SpecModule,
    specNestedModule: SpecNestedModule,
    specNotEmptyModule: SpecNotEmptyModule,
    specPureModule,
  })
}
