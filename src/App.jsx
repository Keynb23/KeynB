// App.jsx (Fully Updated)

import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Home from "./Pages/Home";
import Exp from "./Resume/XP/Exp";
import Projects from "./Resume/Projects/Projects";
import Footer from "./components/Footer";
import EDU from "./Resume/Edu/Edu";
import { Login } from "./components/Login/Login";
import { useEffect, useState, useRef } from "react"; 
import { Decoys } from "./components/Decoys";
import { BgIcons } from "./components/BG-Icons";

const TOTAL_LOADING_TIME_MS = 30000;

function App() {
    // 1. State Management
    const [isLoading, setIsLoading] = useState(true);
    const [isMuted, setIsMuted] = useState(true); // Starts TRUE (muted)
    const [isLoginVisible, setIsLoginVisible] = useState(false);

    // Refs to control the DOM elements
    const audioRef = useRef(null);
    const videoRef = useRef(null);

    // 2. Loading Timer (Unchanged)
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

    // 3. Mute/Unmute Handler (TOGGLE LOGIC ADDED)
    const handleMuteToggle = () => {
        // Toggle the mute state
        const newMuteState = !isMuted;
        setIsMuted(newMuteState); 
        
        // Manually update the DOM elements
        if (audioRef.current) {
            audioRef.current.muted = newMuteState;
            // If unmuting, attempt to play/sync again
            if (!newMuteState) {
                audioRef.current.play().catch(e => console.error("Audio playback error after unmute:", e));
            }
        }
        if (videoRef.current) {
            videoRef.current.muted = newMuteState;
            // If unmuting, attempt to play/sync again
            if (!newMuteState) {
                videoRef.current.play().catch(e => console.error("Video playback error after unmute:", e));
            }
        }
        console.log(`USER INTERACTION: Audio is now ${newMuteState ? 'MUTED' : 'UNMUTED'}.`);
    };
    
    // ... (closeLoginModal and handleSecretClick functions remain the same)
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
    
    // If we are loading, display the one-time loading screen
    if (isLoading) {
        console.log("RENDER: Rendering Loading Screen (Muted).");
        return (
            <div className="loading-screen-container">
                {/* Audio source is fixed to MP3 */}
                <audio 
                    ref={audioRef}
                    src="/introVid-Audio.mp3" 
                    autoPlay 
                    playsInline 
                    muted={isMuted} // Controlled by state
                /> 
                
                {/*  VIDEO FIX ATTEMPT: Using <source> tag is standard for compatibility */}
                <video
                    ref={videoRef}
                    className="blender-video-layer"
                    autoPlay
                    playsInline
                    muted={isMuted} // Controlled by state
                >
                    {/*  Using <source> tags. This is often more reliable than 'src' attribute. */}
                    {/*  PLEASE DOUBLE-CHECK THE PATH: /IntroVideo.mp4 MUST be correct. */}
                    <source src="/IntroVideo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                
                {/*  MUTE TOGGLE BUTTON: Now permanently visible during the loading screen */}
                <div 
                    className="unmute-overlay" 
                    onClick={handleMuteToggle} // Toggle handler
                >
                    <button className="unmute-button">
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

            {/* ... (rest of the application JSX remains the same) ... */}
            
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