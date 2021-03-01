/* eslint-disable import/no-unresolved */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import localForage from 'localforage';
import { Toaster } from 'react-hot-toast';
import * as serviceWorker from './serviceWorker';

/**
 * Redux chung
 */
import { store, persistor } from './container/store';
/**
 * Router
 */
import TRouter from './router/router';
import './style/main.scss';

localForage.config({
    driver      : localForage.WEBSQL, // Force WebSQL; same as using setDriver()
    name        : 'todo_app',
    version     : 1.0,
    size        : 4980736, // Size of database, in bytes. WebSQL-only for now.
    storeName   : 'todoapp', // Should be alphanumeric, with underscores.
    description : 'some description'
});

ReactDOM.render(
    <Provider store={store}>
        <PersistGate
            loading={<div>Đang tải dữ liệu</div>}
            persistor={persistor}
        >
            <Toaster />
            <TRouter />
        </PersistGate>
    </Provider>,
    document.getElementById('root'),
);

const config_sw = {
    // onSuccess: () => { console.log('SW SUCCESS'); },
    // onUpdate: () => { console.log('SW UPDATE'); },
};
serviceWorker.register(config_sw);
