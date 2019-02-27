import merge from 'lodash/merge'

// project name : stonex

const usersActions = (maps, getState) => ({
  getUsers: async () => {
    const { data } = await Promise.resolve({ data: 'lol ' })
    maps.users.setUsers(data)
    return data
  },
})

const tableActions = (maps, getState) => ({
  getRows: () => getState().table.rows,
})

const usersMap = {
  setUsers: action => ({ users: action.data }),
}

const maps = {}

const createMap = ({ map, name, initialState }) => {
  const stonexMap = {}
  if (!maps[name]) maps[name] = stonexMap

  const createReducer = origReducer =>
    function() {
      return [].apply(null, origReducer)
    }

  const keys = Object.keys(map)
  for (let x = 0; x < keys.length; x++) {
    const reducerName = keys[x]
    stonexMap[reducerName] = createReducer(map[reducerName])
  }
}
