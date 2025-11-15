// main.jsx

import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router-dom"; 
import App from "./App.jsx";
import { ButtonProvider } from "./Buttons/Btns-Context.jsx";
import { AuthProvider } from "./hooks/useAuth.jsx";
import "./index.css";
import MouseTrail from "./MouseTrail.jsx";
import ErrorBoundary from "./errorBoundary.jsx";

// ⭐ 1. Define the ScrollToTop component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll the browser window to the top whenever the route changes
    window.scrollTo(0, 0);
  }, [pathname]); // Depend on pathname

  return null; // This component doesn't render anything
};
// ------------------------------------------------------------------

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

// Render the application
root.render(
  <React.StrictMode>
    <ErrorBoundary>
    <AuthProvider>
      <ButtonProvider>
        <BrowserRouter>
          <ScrollToTop /> 
          <MouseTrail>
            <App />
          </MouseTrail>
        </BrowserRouter>
      </ButtonProvider>
    </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);