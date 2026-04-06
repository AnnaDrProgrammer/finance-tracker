import React from 'react';
import ReactDOM from 'react-dom/client';
import { Providers } from './providers';
import App from './App';
import './index.css'; // Убедитесь, что index.css есть в папке app

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>,
);
