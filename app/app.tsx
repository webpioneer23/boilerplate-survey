/**
 * app.tsx
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import '@babel/polyfill';

// Import all the third party stuff
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { persistStore } from 'redux-persist';
import history from 'utils/history';
import 'sanitize.css/sanitize.css';

// Import root app
import App from 'containers/App';

// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider';

// Load the favicon and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
import '!file-loader?name=[name].[ext]!./images/favicon.ico';
import '!file-loader?name=[name].[ext]!./images/android-chrome-192x192.png';
import '!file-loader?name=[name].[ext]!./images/android-chrome-256x256.png';
import '!file-loader?name=[name].[ext]!./images/apple-touch-icon.png';
import '!file-loader?name=[name].[ext]!./images/apple-touch-icon-60x60.png';
import '!file-loader?name=[name].[ext]!./images/apple-touch-icon-60x60-precomposed.png';
import '!file-loader?name=[name].[ext]!./images/apple-touch-icon-76x76.png';
import '!file-loader?name=[name].[ext]!./images/apple-touch-icon-76x76-precomposed.png';
import '!file-loader?name=[name].[ext]!./images/apple-touch-icon-120x120.png';
import '!file-loader?name=[name].[ext]!./images/apple-touch-icon-120x120-precomposed.png';
import '!file-loader?name=[name].[ext]!./images/apple-touch-icon-152x152.png';
import '!file-loader?name=[name].[ext]!./images/apple-touch-icon-152x152-precomposed.png';
import '!file-loader?name=[name].[ext]!./images/apple-touch-icon-180x180.png';
import '!file-loader?name=[name].[ext]!./images/apple-touch-icon-180x180-precomposed.png';
import '!file-loader?name=[name].[ext]!./images/apple-touch-icon-precomposed.png';
import '!file-loader?name=[name].[ext]!./images/favicon-16x16.png';
import '!file-loader?name=[name].[ext]!./images/favicon-32x32.png';
import '!file-loader?name=[name].[ext]!./images/icon-512x512.png';
import '!file-loader?name=[name].[ext]!./images/mstile-150x150.png';
import '!file-loader?name=[name].[ext]!./images/safari-pinned-tab.svg';
import '!file-loader?name=[name].[ext]!./images/site.webmanifest';
import '!file-loader?name=[name].[ext]!./images/browserconfig.xml';
import 'file-loader?name=.htaccess!./.htaccess';
/* eslint-enable import/no-unresolved, import/extensions */

import { PersistGate } from 'redux-persist/integration/react';
import configureStore from './configureStore';

// Import i18n messages
import { translationMessages } from './i18n';

import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import {
    ClearBrowserCacheBoundary
} from 'react-clear-browser-cache';
import ErrorBoundary from './ErrorBoundary';


// Create redux store with history
const initialState = {};
const store = configureStore(initialState, history);
const persistor = persistStore(store);
const MOUNT_NODE = document.getElementById('app') as HTMLElement;

Sentry.init({
    dsn: process.env.SENTRY_DSN, // will move to .env later
    integrations: [
        new BrowserTracing({
            tracingOrigins: ["localhost"],

            // Can also use reactRouterV3Instrumentation or reactRouterV4Instrumentation
            routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),

        }),
    ],
    ignoreErrors: [
        "Non-Error exception captured",
        "Non-Error promise rejection captured"
    ],


    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: process.env.SENTRY_SAMPLE_RATE ? parseFloat(process.env.SENTRY_SAMPLE_RATE) : 1,
});

const root = createRoot(MOUNT_NODE);


const render = (messages: any) => {
    root.render(
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <LanguageProvider messages={messages}>
                    <ConnectedRouter history={history}>
                        <ErrorBoundary>
                            <ClearBrowserCacheBoundary auto fallback='Loading' duration={60000}>
                                <App />
                            </ClearBrowserCacheBoundary>
                        </ErrorBoundary>
                    </ConnectedRouter>
                </LanguageProvider>
            </PersistGate>
        </Provider>,
    );
};

if (module.hot) {
    // Hot reloadable React components and translation json files
    // modules.hot.accept does not accept dynamic dependencies,
    // have to be constants at compile-time
    module.hot.accept(['./i18n', 'containers/App'], () => {
        root.unmount();
        render(translationMessages);
    });
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
    new Promise((resolve) => {
        resolve(import('intl'));
    })
        .then(() => Promise.all([import('intl/locale-data/jsonp/en.js')]))
        .then(() => render(translationMessages))
        .catch((err) => {
            throw err;
        });
} else {
    render(translationMessages);
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
    OfflinePluginRuntime.install(); // eslint-disable-line global-require
}
