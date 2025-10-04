import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Home from "./Pages/Home";
import Exp from "./Resume/XP/Exp";
import Projects from "./Resume/Projects/Projects";
import Footer from "./components/Footer";
import Contact from "./components/Contact";
import EDU from "./Resume/Edu/Edu";
import { Login } from "./components/Login/Login";
import { useEffect, useState } from 'react'; 

function App() {
    // 1. State to manage the visibility of the Login modal
    const [isLoginVisible, setIsLoginVisible] = useState(false);

    // Function to close the modal (passed as a prop to Login)
    const closeLoginModal = () => {
        setIsLoginVisible(false);
    };

    // 2. The secret click handler
    const handleSecretClick = (e) => {
        // Check if the left Control key (e.ctrlKey) was held down
        // And if the primary mouse button (e.button === 0) was clicked
        if (e.ctrlKey) {
            e.preventDefault(); // Prevent default button behavior, just in case
            setIsLoginVisible(true); // Show the modal
            // Stop propagation to prevent any parent click handlers from firing
            e.stopPropagation(); 
        }
    };
    
    // 3. Effect to listen for keyboard events (optional, but good for cleanup)
    // You don't need this for the secret click, but it's often used with secret access.
    
    // Cleanup of the incorrect Click function and placeholder button
    // The Login component renders the backdrop, so we just need a hidden trigger element.

    return (
        <>
            <Navbar />
            
            {/* The hidden trigger element, placed outside the main content flow */}
            <div 
                className="hidden-login-trigger" 
                onClick={handleSecretClick}
                onContextMenu={(e) => e.preventDefault()} // Prevent right-click menu appearing
                tabIndex={0} // Makes it focusable, though click is main trigger
            >
                {/* A hidden marker that is only clickable in a specific area */}
                {/* Content is purely semantic for screen readers if you want to leave it empty */}
            </div>

            {/* Render the Login modal only when isLoginVisible is true */}
            {isLoginVisible && <Login onClose={closeLoginModal} />}

            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/experience" element={<Exp />} />
                    <Route path="/education" element={<EDU />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </div>
            <Footer />
        </>
    );
}

export default App;