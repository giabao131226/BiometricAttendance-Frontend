import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Tìm thẻ div có id="root" trong thư mục public/index.html để render ứng dụng React lên đó
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);