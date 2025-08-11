import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ButtonProvider } from './Buttons/Btns-Context.jsx'; // Make sure this path is correct
import './index.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

// Render the application
root.render(
  <React.StrictMode>
    {/* By wrapping your app in the provider, you make the context 
      (theme, activeButton, etc.) available to all child components.
    */}
    <ButtonProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ButtonProvider>
  </React.StrictMode>
);
