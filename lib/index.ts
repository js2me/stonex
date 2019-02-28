import merge from 'lodash/merge'

// project name : stonex

export declare interface StonexReducer {
  reducerMap: object,
  initialState: any,
}

export declare interface StonexReducersMap {
  [key: string]: StonexReducer
}

export const buildActions = (actionsMap) => {}

export const buildReducers = (reducers: StonexReducersMap) => {
    
//   const stonexMap = {}
//   if (!maps[name]) maps[name] = stonexMap

//   const createReducer = (origReducer) =>
//     function () {
//       return [].slice.apply(null, origReducer)
//     }

//   const keys = Object.keys(map)
//   for (const x of keys) {
//     const reducerName = keys[x]
//     stonexMap[reducerName] = createReducer(map[reducerName])
//   }
}

export function createStore (actions: object, maps: object) {
  const sMaps = {}
  const sActions = {}

  return {
    getState: null
  }
}
