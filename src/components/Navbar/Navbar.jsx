// components/Navbar/Navbar.jsx

import { Link, NavLink, useNavigate } from "react-router-dom"; // 👈 Added useNavigate
import { useButtons } from "../../Buttons/Btns-Context.jsx";
import { useAuth } from "../../hooks/useAuth.jsx"; // 👈 IMPORT useAuth
import ThemeBtn from "../../Buttons/ThemeBtn.jsx";
import "./Nav.css";
import { Login } from "../Login/Login.jsx";
import { useState } from "react";

const Navbar = () => {
    // Auth Hooks
    const { isAuthenticated, logout } = useAuth(); // 👈 Get auth status and logout function
    const navigate = useNavigate();
    
    // Original State
    const { ActiveButton, setActiveButton } = useButtons();
    const [isLoginVisible, setIsLoginVisible] = useState(false);
    
    // Renamed for clarity: this function serves as the onClose handler for the Login modal
    const closeLoginModal = () => {
        setIsLoginVisible(false);
    }; 
    
    // Function to handle logout
    const handleLogout = async () => {
        try {
            await logout(); // Calls Firebase signOut
            // Close the modal just in case it was open (good cleanup practice)
            closeLoginModal(); 
            navigate('/'); // Redirect to the home page or wherever you prefer
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <header className="navbar-header">
            <nav className="navbar">
                {/* Logo/Home link */}
                <Link
                    to="/"
                    className="navbar-logo"
                    onClick={() => setActiveButton("home")}
                >
                    KeynB
                </Link>
                
                {/* // ----------------------------------------------------
                // 🔥 CONDITIONAL LOGIN/LOGOUT BUTTON AREA 🔥
                // ----------------------------------------------------
                */}
                {isAuthenticated ? (
                    // IF LOGGED IN: Show Logout Button
                    <button
                        className="login-trigger-secret" // Reusing the class, but its function is now Logout
                        onClick={handleLogout}
                        aria-label="Logout" 
                    >
                        Logout
                    </button>
                ) : (
                    // IF LOGGED OUT: Show the Secret Login Trigger
                    <button
                        className="login-trigger-secret"
                        onClick={() => setIsLoginVisible(true)} // Explicitly open the modal
                        aria-label="Toggle admin login" 
                    >
                        {/* You can put an invisible character or just leave it empty */}.
                    </button>
                )}


                {/* Navigation Links */}
                <ul className="nav-links">
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive ? "nav-link active" : "nav-link"
                            }
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/projects"
                            className={({ isActive }) =>
                                isActive ? "nav-link active" : "nav-link"
                            }
                        >
                            Projects
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/experience"
                            className={({ isActive }) =>
                                isActive ? "nav-link active" : "nav-link"
                            }
                        >
                            Experience
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/education"
                            className={({ isActive }) =>
                                isActive ? "nav-link active" : "nav-link"
                            }
                        >
                            Education
                        </NavLink>
                    </li>
                </ul>
                
                {/* Login Dropdown Container */}
                <div className={`hidden-dropdown ${isLoginVisible ? "visible" : ""}`}>
                    {/* // ----------------------------------------------------
                    // 🔥 CRITICAL FIX: PASS THE onClose PROP 🔥
                    // ----------------------------------------------------
                    */}
                    {isLoginVisible && <Login onClose={closeLoginModal} />} 
                </div>
                
                {/* Theme Toggle Button */}
                <div className="navbar-theme-toggle">
                    <ThemeBtn />
                </div>
            </nav>
        </header>
    );
};

export default Navbar;