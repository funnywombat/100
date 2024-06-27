
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

import store from './store';
import GlobalStyles from './GlobalStyles';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    
        <HashRouter> 
            <Provider store={store}>
                <GlobalStyles />
                <App />
            </Provider>
        </HashRouter>


);

 