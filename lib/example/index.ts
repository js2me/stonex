import { buildActions, buildReducers, createStore } from '../index'
import usersActions from './actions'
import usersReducer from './reducer'

const actions = buildActions({
  users: usersActions
})

const reducers = buildReducers({
  users: usersReducer
})

const store = createStore(actions, reducers)

export default store
