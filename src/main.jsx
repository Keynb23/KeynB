import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ButtonProvider } from "./Buttons/Btns-Context.jsx"; // Context for UI buttons
import { AuthProvider } from "./hooks/useAuth.jsx"; // 👈 NEW: Auth Context for Login
import "./index.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

// Render the application
root.render(
  <React.StrictMode>
    {/* All providers must wrap the application */}
    {/* AuthProvider makes isAuthenticated available everywhere */}
    <AuthProvider>
      <ButtonProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ButtonProvider>
    </AuthProvider>
  </React.StrictMode>
);
