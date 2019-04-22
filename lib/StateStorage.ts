import { copy } from './helpers/base'

const stateStorage = (() => {
  const states = {}

  return {
    createState: (id: string, state: any) => {
      states[id] = copy(state)
    },
    getById: (id: string) => {
      return states[id]
    }
  }
})()

export {
    stateStorage
}
