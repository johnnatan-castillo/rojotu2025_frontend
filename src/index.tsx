import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './App';
import './styles/global.css';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container!); // ! es para decirle a TypeScript que no es null

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
