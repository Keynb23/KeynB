// App.jsx

import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Home from "./Pages/Home";
import Exp from "./Resume/XP/Exp";       // <-- RESTORED IMPORT
import Projects from "./Resume/Projects/Projects"; // <-- RESTORED IMPORT
import EDU from "./Resume/Edu/Edu";       // <-- RESTORED IMPORT
import Footer from "./components/Footer";
import { Login } from "./components/Login/Login";
import { useEffect, useState, useRef } from "react"; 
import { Decoys } from "./components/Decoys";
import { BgIcons } from "./components/BG-Icons";

const TOTAL_LOADING_TIME_MS = 30000;
const DESIRED_VOLUME = 0.2; 

function App() {
    // 1. State Management
    const [isLoading, setIsLoading] = useState(true);
    const [isMuted, setIsMuted] = useState(true); 
    const [isLoginVisible, setIsLoginVisible] = useState(false);

    // Refs to control the DOM elements
    const audioRef = useRef(null);
    const videoRef = useRef(null);

    console.log("App component rendered. Current loading state:", isLoading);

    // 2. Loading Timer & Initial Volume Setup
    useEffect(() => {
        console.log(`EFFECT: Setting ${TOTAL_LOADING_TIME_MS}ms timer to end loading.`);
        const timer = setTimeout(() => {
            console.log("TIMER FIRED: Setting isLoading to false.");
            setIsLoading(false);
        }, TOTAL_LOADING_TIME_MS);

        // Set volume on the MP3 audio element immediately on load
        if (audioRef.current) {
            audioRef.current.volume = DESIRED_VOLUME;
            console.log(`EFFECT: Audio volume set to ${DESIRED_VOLUME * 100}%.`);
        }
        
        return () => {
            console.log("EFFECT CLEANUP: Clearing timer.");
            clearTimeout(timer);
        };
    }, []); 

    // 3. Mute/Unmute Handler
    const handleMuteToggle = () => {
        const newMuteState = !isMuted;
        setIsMuted(newMuteState); 
        
        // Control Audio Element (MP3)
        if (audioRef.current) {
            audioRef.current.muted = newMuteState;
            if (!newMuteState) { 
                audioRef.current.volume = DESIRED_VOLUME;
                audioRef.current.play().catch(e => console.error("Audio playback error:", e));
            }
        }
        
        // Control Video Element (We attempt to ensure it plays, but its muted status is static in JSX)
        if (videoRef.current && !newMuteState) {
            videoRef.current.play().catch(e => console.error("Video playback error (still checking file):", e));
        }
        
        console.log(`USER INTERACTION: MP3 Audio is now ${newMuteState ? 'MUTED' : 'UNMUTED'}.`);
    };

    // 🛑 NEW: Skip Handler
    const handleSkipIntro = () => {
        // Stop all media playback
        if (audioRef.current) audioRef.current.pause();
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
                {/* Audio element */}
                <audio 
                    ref={audioRef}
                    src="/introVid-Audio.mp3" 
                    autoPlay 
                    playsInline 
                    muted={isMuted} 
                /> 
                
                {/* Video element (permanently muted) */}
                <video
                    ref={videoRef}
                    className="blender-video-layer"
                    autoPlay
                    playsInline
                    muted={true} 
                >
                    <source src="/IntroVideo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                
                {/* 🛑 Skip and Mute Controls Container */}
                <div className="intro-controls-container">
                    {/* 🛑 NEW: Skip Button */}
                    <button 
                        className="skip-button" 
                        onClick={handleSkipIntro}
                    >
                        SKIP INTRO >>
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