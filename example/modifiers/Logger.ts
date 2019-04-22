import { Modifier, StonexModule, Store } from '../../lib'
import { Modules } from '../modules'

const Logger: Modifier<Modules> = (store: Store<Modules>) => {
  console.log('-----> [STORE] CREATED', Object.keys(store.modules))

  return (module: StonexModule) => {
    console.log('-----> [MODULE] CREATED', module.moduleName.toUpperCase())

    const closuredGetState = module.getState.bind(module)
    const closuredSetState = module.setState.bind(module)
    // const closuredResetState = module.resetState.bind(module)

    // module.getState = (...args) => {

    //   const state = closuredGetState(...args)
    //   console.log(`-----> [MODULE ${module.moduleName.toUpperCase()}] GET/STATE`, state)
    //   // console.log(new Error('ssss'))
    //   return state
    // }

    module.setState = (...args) => {

      const prevState = closuredGetState()

      const resultOfSetState = closuredSetState(...args)
      console.log(`-----> [MODULE ${module.moduleName.toUpperCase()}] SET/STATE :`)
      console.log(`-----> [MODULE ${module.moduleName.toUpperCase()}] - arguments: `, args)
      console.log(`-----> [MODULE ${module.moduleName.toUpperCase()}] - prev state: `, prevState)
      console.log(`-----> [MODULE ${module.moduleName.toUpperCase()}] - new state: `, closuredGetState())
      return resultOfSetState
    }

    // module.resetState = () => {
    //   console.log(`-----> [MODULE ${module.moduleName.toUpperCase()}] {RESET STATE}`)
    //   return closuredResetState()
    // }

    return (args, moduleName: string, methodName: string) => {
      console.log(`-----> [ACTION] CALLED ${moduleName.toUpperCase()}/${methodName.toUpperCase()}
                arguments`, args)
    }
  }
}

export default Logger
