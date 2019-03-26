import configureStore from 'redux-mock-store';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

//       actionsToStateSnapshot(actions)

/*
import { actionsToStateSnapshot } from 'redux-state-snapshot'

const actionStateSnapshot = actionsToStateSnapshot(middlewares)
actionStateSnapshot(getUser, userReducer, {})

*/

const actionsToStateSnapshot = (middlewares, initialState) => function (action, reducer) {
  let state = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  const store = createStore(middlewares, initialState);
  return runActions(store, action, reducer, state);
};

const createStore = (middlewares, initialState) => {
  const mockStore = configureStore(middlewares);
  const store = mockStore(initialState);
  return store;
};

const runActions =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (store, action, reducer) {
    let state = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
    yield store.dispatch(action());

    for (const action in store.getActions()) {
      const newState = reducer(state, actions[action]);
      expect(newState).toMatchSnapshot(actions[action].type);
    }
  });

  return function runActions(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

export { actionsToStateSnapshot };
