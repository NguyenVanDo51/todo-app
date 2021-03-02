import { createStore, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { TYPE } from '../core/config';
import { routerReducers, routerReducersStatic } from '../reducers';

const config = { key: `blo_${TYPE}`, storage };

const reducersStorage = combineReducers({
    state: routerReducers,
    persist: persistReducer(config, routerReducersStatic),
});

const store = createStore(
    reducersStorage,
);

const persistor = persistStore(store, null, () => { });
export { persistor, store };
