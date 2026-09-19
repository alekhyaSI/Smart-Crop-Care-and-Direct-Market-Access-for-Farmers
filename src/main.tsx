import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { LanguageProvider } from './i18n';

function Root() {
  return (
    <LanguageProvider>
      <App />
    </LanguageProvider>
  );
}

ReactDOM.createRoot(
  document.getElementById('root')!
).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);