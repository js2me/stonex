import { StonexModule, StonexStore } from '../src'

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

export interface StonexModules {
  specModule: SpecModule,
  specNestedModule: SpecNestedModule,
}

export const createSpecStore = () => {
  return new StonexStore<StonexModules>({
    specModule: SpecModule,
    specNestedModule: SpecNestedModule,
  })
}
