// App.jsx
import { Routes, Route } from "react-router-dom";
import "./App.css"; // Retained .css extension
import Navbar from "./components/Navbar/Navbar.jsx"; // Added .jsx
import Home from "./Pages/Home.jsx"; // Added .jsx
import Exp from "./Resume/XP/Exp.jsx";       // Added .jsx
import Projects from "./Resume/Projects/Projects.jsx"; // Added .jsx
import EDU from "./Resume/Edu/Edu.jsx";       // Added .jsx
import Footer from "./components/Footer.jsx"; // Added .jsx
import { Login } from "./components/Login/Login.jsx"; // Added .jsx
import { useEffect, useState, useRef } from "react"; 
import { Decoys } from "./components/Decoys.jsx"; // Added .jsx
import { BgIcons } from "./components/BG-Icons.jsx"; // Added .jsx

// The IntroVid.mp4 file now contains both video and audio.
const TOTAL_LOADING_TIME_MS = 4000;
const DESIRED_VOLUME = 0.2; 

function App() {
    // 1. State Management
    const [isLoading, setIsLoading] = useState(true);
    const [isMuted, setIsMuted] = useState(true); 
    const [isLoginVisible, setIsLoginVisible] = useState(false);

    // Ref to control the video element (which now contains the audio)
    const videoRef = useRef(null);

    console.log("App component rendered. Current loading state:", isLoading);

    // Handler to set the correct volume once the video is ready to play
    const handleVideoLoadedData = () => {
        // Only set the desired volume if the user hasn't toggled mute off.
        if (videoRef.current && !isMuted) {
             videoRef.current.volume = DESIRED_VOLUME;
        }
        console.log("VIDEO LOADED: Video metadata loaded. Volume set if unmuted.");
    };

    // 2. Loading Timer (No audio specific setup here anymore)
    useEffect(() => {
        console.log(`EFFECT: Setting ${TOTAL_LOADING_TIME_MS}ms timer to end loading.`);
        const timer = setTimeout(() => {
            console.log("TIMER FIRED: Setting isLoading to false.");
            setIsLoading(false);
        }, TOTAL_LOADING_TIME_MS);

        return () => {
            console.log("EFFECT CLEANUP: Clearing timer.");
            clearTimeout(timer);
        };
    }, []); 

    // 3. Mute/Unmute Handler (Controls the video element)
    const handleMuteToggle = () => {
        const newMuteState = !isMuted;
        setIsMuted(newMuteState); 
        
        // Control Video Element
        if (videoRef.current) {
            videoRef.current.muted = newMuteState; // Mute/unmute the video
            
            if (!newMuteState) { 
                // If unmuting, set the desired volume and attempt playback
                videoRef.current.volume = DESIRED_VOLUME;
                videoRef.current.play().catch(e => console.error("Video playback error:", e));
            }
        }
        
        console.log(`USER INTERACTION: Video audio is now ${newMuteState ? 'MUTED' : 'UNMUTED'}.`);
    };

    // Skip Handler
    const handleSkipIntro = () => {
        // Stop the video playback
        if (videoRef.current) videoRef.current.pause();

        // Immediately switch to the main application
        setIsLoading(false);
        console.log("USER INTERACTION: Intro skipped. Transitioning to main site.");
    };
    
    // 4. Other Handlers
    const closeLoginModal = () => {
        console.log("LOGIN: Modal closed.");
        setIsLoginVisible(false);
    };

    const handleSecretClick = (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
            console.log("LOGIN: Ctrl+Click detected. Opening modal.");
            setIsLoginVisible(true);
            e.stopPropagation();
        }
    };


    // --- Conditional Render ---
    
    if (isLoading) {
        console.log("RENDER: Rendering Loading Screen (Muted).");
        return (
            <div className="loading-screen-container">
                
                {/* Video element (now contains audio) */}
                <video
                    ref={videoRef}
                    className="blender-video-layer"
                    autoPlay
                    playsInline
                    loop // Play until the timer expires or the user skips
                    muted={isMuted} // Dynamically controlled by handleMuteToggle
                    onLoadedData={handleVideoLoadedData} // Set volume once ready
                >
                    <source src="/IntroVid.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                
                {/* Skip and Mute Controls Container */}
                <div className="intro-controls-container">
                    {/* Skip Button */}
                    <button 
                        className="skip-button" 
                        onClick={handleSkipIntro}
                    >
                        SKIP INTRO
                    </button>

                    {/* MUTE TOGGLE BUTTON */}
                    <button 
                        className="unmute-button"
                        onClick={handleMuteToggle}
                    >
                        {isMuted ? 'Click to Unmute 🔊' : 'Click to Mute 🔇'}
                    </button>
                </div>
            </div>
        );
    }

    // Once loading is complete, render the main application
    console.log("RENDER: Rendering Main Application.");
    return (
        <>
            <Navbar />
            <BgIcons />
            <Decoys />
            
            <div
                className="hidden-login-trigger"
                onClick={handleSecretClick}
                onContextMenu={(e) => e.preventDefault()}
                tabIndex={0}
            >
            </div>

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
