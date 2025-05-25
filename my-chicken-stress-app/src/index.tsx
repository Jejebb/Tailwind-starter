// src/index.tsx (or main.tsx)
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // <--- THIS IS CRUCIAL
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);