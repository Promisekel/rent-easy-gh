import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

console.log('🚀 Rent Easy GH - Starting app initialization...');
console.log('Environment:', process.env.NODE_ENV);

const root = ReactDOM.createRoot(document.getElementById('root'));
console.log('✅ React root created successfully');

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('✅ App rendered successfully');

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
