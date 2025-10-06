// App.jsx (No functional changes from last step, just included for completeness)

import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Home from "./Pages/Home";
import Exp from "./Resume/XP/Exp";
import Projects from "./Resume/Projects/Projects";
import Footer from "./components/Footer";
import EDU from "./Resume/Edu/Edu";
import { Login } from "./components/Login/Login";
import { useEffect, useState } from 'react'; 
import Skills from "./components/Skills/Skills"; // Import the Skills component

function App() {
    // 1. Loading State
    const [isLoading, setIsLoading] = useState(true);

    // Callback function passed to the Skills component
    const handleLoadingComplete = () => {
        // Use a slight delay for a smoother transition/fade-out
        setTimeout(() => {
            setIsLoading(false);
        }, 300); 
    };

    // 2. Login Modal State
    const [isLoginVisible, setIsLoginVisible] = useState(false);

    // Function to close the modal (passed as a prop to Login)
    const closeLoginModal = () => {
        setIsLoginVisible(false);
    };

    // 3. The secret click handler (only relevant when loading is complete)
    const handleSecretClick = (e) => {
        if (e.ctrlKey) {
            e.preventDefault(); 
            setIsLoginVisible(true); 
            e.stopPropagation(); 
        }
    };
    
    // If we are loading, ONLY render the Skills component
    if (isLoading) {
        return <Skills onAnimationEnd={handleLoadingComplete} />;
    }

    // Once loading is complete, render the main application
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
                    <Route path="/contact" element={<Footer />} />
                </Routes>
            </div>
            <Footer />
        </>
    );
}

export default App;