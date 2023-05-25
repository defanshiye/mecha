import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';

if (module.hot) {
  module.hot.accept('./App', () => {
    hydrateRoot(document.getElementById('app'), <App />);
  });
}
