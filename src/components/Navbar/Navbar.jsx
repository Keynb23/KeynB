// components/Navbar/Navbar.jsx

import { Link, NavLink } from "react-router-dom";
import { useButtons } from "../../Buttons/Btns-Context.jsx";
import ThemeBtn from "../../Buttons/ThemeBtn.jsx";
import "./Nav.css";
import { Login } from "../Login/Login.jsx";
import { useState } from "react";

const Navbar = () => {
  const { ActiveButton, setActiveButton } = useButtons();
  const [isLoginVisible, setIsLoginVisible] = useState(false); // Toggle function is now all we need
  const toggleLoginVisibility = () => {
    setIsLoginVisible((prev) => !prev);
  }; // openLogin and closeLogin are redundant now, but you can keep them if they're used elsewhere.
  return (
    <header className="navbar-header">
      {" "}
      <nav className="navbar">
        {/* Logo/Home link */}{" "}
        <Link
          to="/"
          className="navbar-logo"
          onClick={() => setActiveButton("home")}
        >
          KeynB{" "}
        </Link>
        {/* Hidden Login Dropdown Trigger (Your Secret Spot) */}{" "}
        {/* Place this element where you want the secret clickable area to be.
          For this example, it's placed right next to the logo.
          It has an invisible class that you will define in Nav.css.
        */}
        <button
          className="login-trigger-secret"
          onClick={toggleLoginVisibility}
          aria-label="Toggle admin login" // Good for accessibility, even if hidden
        >
          {/* You can put an invisible character or just leave it empty */}.
        </button>
        {/* Navigation Links */}{" "}
        <ul className="nav-links">
          {" "}
          <li>
            {" "}
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Home{" "}
            </NavLink>{" "}
          </li>{" "}
          <li>
            {" "}
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Projects{" "}
            </NavLink>{" "}
          </li>{" "}
          <li>
            {" "}
            <NavLink
              to="/experience"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Experience{" "}
            </NavLink>{" "}
          </li>{" "}
          <li>
            {" "}
            <NavLink
              to="/education"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Education{" "}
            </NavLink>{" "}
          </li>{" "}
        </ul>
        {/* Login Dropdown Container */}
        <div className={`hidden-dropdown ${isLoginVisible ? "visible" : ""}`}>
          {/* The Login component is only rendered when visible */}
          {isLoginVisible && <Login />}
        </div>
        {/* Theme Toggle Button */}{" "}
        <div className="navbar-theme-toggle">
          <ThemeBtn />{" "}
        </div>{" "}
      </nav>{" "}
    </header>
  );
};

export default Navbar;
