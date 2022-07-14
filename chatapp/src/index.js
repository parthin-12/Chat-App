import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import {ToastContainer} from "react-toastify"
import App from './App';
import store from "./../src/Redux/store.js"
import "react-toastify/dist/ReactToastify.css";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<Provider store={store} >
    <ToastContainer/>
    <App />
</Provider>
);
