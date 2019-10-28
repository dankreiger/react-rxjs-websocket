import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { createEpicMiddleware } from 'redux-observable';

import invariant from 'redux-immutable-state-invariant';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './root.reducer';
import rootSaga from './root.sagas';
import { rootEpic } from './root.epics';

const middlewares: any[] = [thunk];
const epicMiddleware = createEpicMiddleware();
const sagaMiddleware = createSagaMiddleware();

middlewares.push(sagaMiddleware, epicMiddleware);

let composedEnhancers;
if (process.env.NODE_ENV === 'development') {
  middlewares.push(invariant());

  composedEnhancers = composeWithDevTools({ trace: true, traceLimit: 25 })(
    applyMiddleware(...middlewares)
  );
} else {
  composedEnhancers = compose(applyMiddleware(...middlewares));
}

const persistedState = undefined;
const store = createStore(rootReducer, persistedState, composedEnhancers);

epicMiddleware.run(rootEpic as any);
sagaMiddleware.run(rootSaga);

export default store;
