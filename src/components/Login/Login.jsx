// components/Login/Login.jsx

import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx"; // Use .jsx for consistency
import { CloseBtn } from "../../Buttons/Modal-Btns.jsx"; // Assuming you use a CloseBtn component

// 1. Component MUST accept 'onClose' prop from the parent that renders the modal.
export const Login = ({ onClose }) => {
  // State is only needed for the login form fields, so we can keep them inside the component.
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 👇 UPDATE: Destructure isAuthenticated and logout as well
  const { login, logout, isAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(username, password);

      // Close the modal and navigate on successful login
      if (onClose) {
        onClose();
      }
      navigate("/projects");
    } catch (err) {
      console.error("Login failed:", err.message);
      setError("Login failed. Check your credentials.");
    }
  };

  // 👇 NEW: Logout handler function
  const handleLogout = async () => {
    try {
      await logout();
      if (onClose) {
        onClose(); // Close the modal
      }
      navigate("/"); // Navigate to the homepage or public landing page
    } catch (err) {
      console.error("Logout failed:", err.message);
      // Optionally set an error here if logout fails, but it's rare.
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      {" "}
      {/* Allows clicking outside to close */}
      {/* Prevent clicks on the content from closing the modal */}
      <div
        className="login-container modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {onClose && <CloseBtn onClick={onClose} />}

        {/* 👇 CONDITIONAL RENDERING: Show the logout button OR the login form */}
        {isAuthenticated ? (
          // --- Display Logout Button when authenticated ---
          <div className="logout-display">
            <h2>Admin Session</h2>
            <p>You are currently logged in.</p>
            <button
              className="login-button logout-button" // Reuse login-button class, or add a specific one
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          // --- Display Login Form when NOT authenticated ---
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Admin Login</h2>
            {error && <div className="error-message">{error}</div>}

            <div className="li-form-group">
              <label htmlFor="username">Email</label>
              <input
                type="email"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="Enter your email"
                className="form-input"
              />
            </div>

            <div className="li-form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                className="form-input"
              />
            </div>

            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
