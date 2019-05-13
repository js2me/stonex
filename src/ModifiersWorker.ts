import { getAllMethodsFromModule } from './helpers/module'
import { StonexModule } from './StonexModule'
import { Store } from './StonexStore'

export declare type StoreModifier<MP, D = any> = (store: Store<MP> | null) => (void | D)
export declare type ModuleModifier<D = any> = (module: StonexModule) => (void | D)
export declare type ActionModifier = (args: any[], moduleName: string, methodName: string) => false | any

export declare type Modifier<MP> = StoreModifier<MP, ModuleModifier<ActionModifier>>

export default class ModifiersWorker {

  public static getModuleModifiers<MP> (modifiers: Array<Modifier<MP>>, storeInstance: Store<MP>): ModuleModifier[] {
    return modifiers.reduce((moduleModifiers: ModuleModifier[], modifier) => {
      const moduleModifier: ModuleModifier | any = modifier(storeInstance)
      if (typeof moduleModifier === 'function') {
        moduleModifiers.push(moduleModifier)
      }
      return moduleModifiers
    },[])
  }

  public static getActionModifiers (moduleModifiers: ModuleModifier[], moduleInstance: StonexModule): ActionModifier[] {
    return moduleModifiers.reduce((actionModifiers: ActionModifier[], moduleModifier: ModuleModifier) => {
      const actionModifier: ActionModifier | any = moduleModifier(moduleInstance)
      if (typeof actionModifier === 'function') {
        actionModifiers.push(actionModifier)
      }
      return actionModifiers
    }, [])
  }

  public static attachActionModifiersToModule (actionModifiers: ActionModifier[], moduleInstance: StonexModule): void {
    getAllMethodsFromModule(moduleInstance).forEach(methodName => {
      const closuredMethod = moduleInstance[methodName]
      moduleInstance[methodName] = (...args: any[]) => {
        for (const modifier of actionModifiers) {
          if (modifier(args, moduleInstance.moduleName, methodName) === false) {
            return null
          }
        }
        return closuredMethod.apply(moduleInstance, args)
      }
    })
  }
}
