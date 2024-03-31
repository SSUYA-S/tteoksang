import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/css/common.css';
import './assets/css/variables.css';
import './assets/css/cropSprite.css';
import './assets/css/animation.css';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage.tsx';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './util/store.ts';
import { CookiesProvider } from 'react-cookie';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <CookiesProvider>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <Routes>
                        <Route index element={<MainPage />}></Route>
                    </Routes>
                </BrowserRouter>
            </PersistGate>
        </CookiesProvider>
    </Provider>
);
