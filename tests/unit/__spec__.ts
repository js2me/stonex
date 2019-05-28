import { StonexModule, StonexStore } from '../../src'

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
}

// TODO: Add unit tests for pure module.
// tslint:disable-next-line:max-line-length
// Before needs to solve question with: https://stackoverflow.com/questions/56349619/ts2352-declare-object-with-dynamic-properties-and-one-property-with-specific-t
// const specPureModule = {
//   state: {},
//   addBar (): any {
//     const that = this as StonexModule
//     that.setState({
//       ...this.state,
//       bar: 'baz',
//     })
//   },
//   addFoo (): any {
//     const that = this as StonexModule
//     that.setState({
//       ...this.state,
//       foo: 'bar',
//     })
//   },
// } as PureStonexModule

// interface SpecPureModule extends StonexModule {
//   addBar: any,
//   addFoo: any,
// }

export interface StonexModules {
  specModule: SpecModule,
  specNestedModule: SpecNestedModule,
  specNotEmptyModule: SpecNotEmptyModule
  // specPureModule: SpecPureModule,
}

export const createSpecStore = () => {
  return new StonexStore<StonexModules>({
    specModule: SpecModule,
    specNestedModule: SpecNestedModule,
    specNotEmptyModule: SpecNotEmptyModule,
    // specPureModule,
  })
}
