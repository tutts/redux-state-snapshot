import configureStore from 'redux-mock-store'

export const actionsToStateSnapshot = (middlewares, initialState) => (action, reducer) => {
  const store = createStore(middlewares, initialState)

  return runActions(store, action, reducer, initialState)
}

const createStore = (middlewares, initialState) => {
  const mockStore = configureStore(middlewares)
  const store = mockStore(initialState)

  return store
}

const runActions = async (store, action, reducer, state = undefined) => {
  await store.dispatch(action())
  const actions = store.getActions()

  for (const action in actions) {
    const newState = reducer(state, actions[action])
    expect(newState).toMatchSnapshot(actions[action].type)
  }
}
