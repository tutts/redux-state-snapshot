import configureStore from 'redux-mock-store'

// const actions = store.getActions()
//       actionsToStateSnapshot(actions)

/*
import { actionsToStateSnapshot } from 'redux-state-snapshot'

const actionStateSnapshot = actionsToStateSnapshot(middlewares)
actionStateSnapshot(getUser, userReducer, {})

*/

export const actionsToStateSnapshot = (middlewares, initialState) => (action, reducer, state = undefined) => {
  const store = createStore(middlewares, initialState)
  return runActions(store, action, reducer, state)
}

const createStore = (middlewares, initialState) => {
  const mockStore = configureStore(middlewares)
  const store = mockStore(initialState)

  return store
}

const runActions = async (store, action, reducer, state = undefined) => {
  await store.dispatch(action())

  for (const action in store.getActions()) {
    const newState = reducer(state, actions[action])
    expect(newState).toMatchSnapshot(actions[action].type)
  }
}
