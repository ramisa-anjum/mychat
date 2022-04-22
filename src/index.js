import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import "./style.css";
import {createStore} from 'redux'
import { Provider } from 'react-redux';
import { rootReducer } from './reducer';
import { composeWithDevTools } from 'redux-devtools-extension';
const store = createStore(rootReducer,composeWithDevTools())
ReactDOM.render(
  <Provider store={store}> 
  <BrowserRouter>
  <App />
  </BrowserRouter>
  </Provider>
  
    
,
  document.getElementById('root')
);

