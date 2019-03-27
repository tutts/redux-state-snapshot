# redux-state-snapshot

Simple utility to help test your redux integration

## Motivation

Its common to test Redux in isolation, as its spearation of concerns lends well to unit tests, however testing the integration between ActionTypes, Actions and Reducers from an end user perspective is more challenging.

This tiny utility builds on top of the great work done with [`redux-mock-store`](https://github.com/dmitry-zaets/redux-mock-store), and allows you to test your Redux actions (syncronously or asyncronously), offering your components using Redux stores downstream certainty, by taking a snapshot of your state after each action.

## Requirements

- [Jest](https://jestjs.io/)
- [Redux](https://redux.js.org/)

## Install

```
yarn add redux-state-snapshot --dev
```
```
npm i redux-state-snapshot --dev
```

## API

### `actionsToStateSnapshot(middleware, initialState)`

Creates the store and returns function to execute Jest Snapshot

#### Parameters

##### `middleware` [array]

An array of Redux middleware required to execute action

##### `initialState` [any]

A default state to provide to redux Redux store, the same state being able to retrieved via `.getState()`

##### example

```javascript
import { actionsToStateSnapshot } from 'redux-state-snapshot'
import thunk from 'redux-thunk'

const actionStateSnapshot = actionsToStateSnapshot([thunk], { foo: 'bar' })
```

#### Return

##### `function(action, reducer)`

###### `action` [function]

Wrap your Redux action in a clossure (this will prevent the action from executing at runtime)

###### `reducer` [function]

Pass your reducer to the function the same way you would `combineReducers`

##### example

```javascript
import myAction from './my-action'
import myReducer from './my-reducer'

actionStateSnapshot(() => myAction(foo), reducer) // creates snapshot
```

## Examples

```javascript
import { actionsToStateSnapshot } from 'redux-state-snapshot'
import thunk from 'redux-thunk'

/* ACTION TYPES */
const ACTION_TYPE_TEST = 'ACTION_TYPE_TEST'

/* ACTIONS */
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

/* REDUCER */
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
```
