import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// Get the root element from the HTML
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

// Render the application
root.render(
  <React.StrictMode>
    {/* BrowserRouter wraps your entire app, enabling routing */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
