import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/base.scss';
import App from './components/Site/App/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);