
const initialState = {
  users: []
}

const reducerMap = {
  setUsers: (action) => ({ users: action.data }),
}

export default {
  initialState,
  reducerMap
}
