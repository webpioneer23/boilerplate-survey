/**
 * Create the store with dynamic reducers
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { persistReducer } from 'redux-persist';
import localforage from 'localforage';
import createSagaMiddleware from 'redux-saga';
import createReducer from './reducers';
import { InjectedStore } from 'types';
import { createInjectorsEnhancer, forceReducerReload } from 'redux-injectors';
import { composeWithDevTools } from 'redux-devtools-extension';
import { PersistConfig } from 'redux-persist';

export default function configureStore(initialState = {}, history) {
    const reduxSagaMonitorOptions = {};



    const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
    const { run: runSaga } = sagaMiddleware;

    // Create the store with two middlewares
    // 1. sagaMiddleware: Makes redux-sagas work
    // 2. routerMiddleware: Syncs the location/URL path to the state
    const middlewares = [sagaMiddleware, routerMiddleware(history)];

    // const enhancers = [applyMiddleware(...middlewares)];
    const enhancers = [
        applyMiddleware(...middlewares),
        createInjectorsEnhancer({
            createReducer,
            runSaga,
        }),
    ];

    let enhancer;

    // If Redux Dev Tools and Saga Dev Tools Extensions are installed, enable them
    /* istanbul ignore next */
    if (process.env.NODE_ENV !== 'production' && typeof window === 'object') {
        /* eslint-disable no-underscore-dangle */
        // if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({});
        enhancer = composeWithDevTools(...enhancers);
        // NOTE: Uncomment the code below to restore support for Redux Saga
        // Dev Tools once it supports redux-saga version 1.x.x
        // if (window.__SAGA_MONITOR_EXTENSION__)
        //   reduxSagaMonitorOptions = {
        //     sagaMonitor: window.__SAGA_MONITOR_EXTENSION__,
        //   };
        /* eslint-enable */
    } else {
        enhancer = compose(...enhancers);
    }

    const persistConfig = {
        key: 'root',
        storage: localforage,
        blacklist: ['router'],
        version: 1,
    };


    const persistedReducer = persistReducer(persistConfig, createReducer());

    const store = createStore(persistedReducer, initialState, enhancer) as InjectedStore;

    // Extensions
    store.runSaga = sagaMiddleware.run;
    store.injectedReducers = {}; // Reducer registry
    store.injectedSagas = {}; // Saga registry

    // Make reducers hot reloadable, see http://mxs.is/googmo
    /* istanbul ignore next */
    if (module.hot) {
        module.hot.accept('./reducers', () => {
            store.replaceReducer(createReducer(store.injectedReducers));
        });
    }

    return store;
}
