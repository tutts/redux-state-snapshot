import thunk from 'redux-thunk'

import { actionsToStateSnapshot } from './index'

const ACTION_TYPE_TEST = 'ACTION_TYPE_TEST'

function starting() {
  return {
    type: `${ACTION_TYPE_TEST}_STARTING`,
  }
}

function success(payload) {
  return {
    type: `${ACTION_TYPE_TEST}_SUCCESS`,
    payload,
  }
}

function failure(payload) {
  return {
    type: `${ACTION_TYPE_TEST}_FAILURE`,
    payload,
  }
}

function fetchDataSuccess() {
  return dispatch => {
    return Promise.resolve()
      .then(dispatch(starting()))
      .then(() => dispatch(success({ error: null, data: ['foo', 'bar'] })))
  }
}

function fetchDataFailure() {
  return dispatch => {
    return Promise.resolve()
      .then(dispatch(starting()))
      .then(() => dispatch(failure({ error: 'Uh oh!', data: [] })))
  }
}

function doAction(foo) {
  return { type: ACTION_TYPE_TEST, foo }
}

const reducer = (state = { data: [], error: null, loading: false }, action) => {
  switch (action.type) {
    case ACTION_TYPE_TEST:
      return { ...state, foo: action.foo }
    case `${ACTION_TYPE_TEST}_STARTING`:
      return { ...state, loading: true }
    case `${ACTION_TYPE_TEST}_FAILURE`:
    case `${ACTION_TYPE_TEST}_SUCCESS`:
      return { data: action.payload.data, error: action.payload.error, loading: false }
    default:
      return state
  }
}

describe('GIVEN a user', () => {
  describe('WHEN I want to test my async redux actions and state', () => {
    describe('THEN I can use actionsToStateSnapshot for async actions', () => {
      test('to snapshot on success', () => {
        const actionStateSnapshot = actionsToStateSnapshot([thunk])
        actionStateSnapshot(() => fetchDataSuccess(), reducer)
      })

      test('to snapshot on failure', () => {
        const actionStateSnapshot = actionsToStateSnapshot([thunk])
        actionStateSnapshot(() => fetchDataFailure(), reducer)
      })
    })

    describe('AND I can use actionsToStateSnapshot for sync actions', () => {
      test('to snapshot on success', () => {
        const actionStateSnapshot = actionsToStateSnapshot()
        actionStateSnapshot(() => doAction('bar'), reducer)
      })
    })

    describe('AND I can use actionsToStateSnapshot with a default state', () => {
      test('to snapshot on success', () => {
        const initialState = { customData: true }
        const actionStateSnapshot = actionsToStateSnapshot([], initialState)
        actionStateSnapshot(() => doAction('bar'), reducer)
      })
    })
  })
})
