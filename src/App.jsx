import { Routes, Route } from "react-router-dom";
import "./App.css"; // Keep original import
import Navbar from "./components/Navbar/Navbar"; // Keep original import
import Home from "./Pages/Home"; // Keep original import
import Exp from "./Resume/XP/Exp"; // Keep original import
import Projects from "./Resume/Projects/Projects"; // Keep original import
import EDU from "./Resume/Edu/Edu"; // Keep original import
import Footer from "./components/Footer"; // Keep original import
import { Login } from "./components/Login/Login"; // Keep original import
import { useEffect, useState, useRef } from "react";

const TOTAL_LOADING_TIME_MS = 5000;
// Define the breakpoint for the video swap logic
const MOBILE_BREAKPOINT_WIDTH = 768;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false); // Renamed for clarity
  const isMuted = true;
  const [isLoginVisible, setIsLoginVisible] = useState(false);

  // Ref is applied to the single, dynamically rendered video tag.
  const videoRef = useRef(null);

  // --- 1. Breakpoint / Responsive Logic (Client-side JS check) ---
  const checkScreenSize = () => {
    // Check if the viewport width is less than or equal to the breakpoint
    const isMobileOrTablet = window.innerWidth <= MOBILE_BREAKPOINT_WIDTH;

    // Set state based *only* on the width breakpoint
    setIsMobile(isMobileOrTablet);
  };

  useEffect(() => {
    // Initial check
    checkScreenSize();

    // Listener for screen resize or orientation change
    window.addEventListener("resize", checkScreenSize);

    // Cleanup listener
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);
  // -----------------------------------------------------------------

  console.log("App component rendered. Current loading state:", isLoading);

  const handleVideoLoadedData = () => {
    console.log(
      "VIDEO LOADED: Video metadata loaded. It is intentionally muted."
    );
  };

  useEffect(() => {
    console.log(
      `EFFECT: Setting ${TOTAL_LOADING_TIME_MS}ms timer to end loading.`
    );
    const timer = setTimeout(() => {
      if (videoRef.current) videoRef.current.pause();

      console.log("TIMER FIRED: Setting isLoading to false.");
      setIsLoading(false);
    }, TOTAL_LOADING_TIME_MS);

    return () => {
      console.log("EFFECT CLEANUP: Clearing timer.");
      clearTimeout(timer);
    };
  }, []);

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
  // Determine which video source and class to use based on JS breakpoint logic
  // This allows us to render only one video element for efficiency.
  const videoSource = isMobile ? "/IntroVid-Phone.mp4" : "/IntroVid.mp4";
  const videoClass = isMobile
    ? "blender-Phone-video-layer"
    : "blender-video-layer";

  if (isLoading) {
    console.log(`RENDER: Rendering Loading Screen (Source: ${videoSource}).`);
    return (
      <div className="loading-screen-container">
        {/* Render only ONE video element with the correct source and class */}
        <video
          ref={videoRef}
          className={videoClass}
          autoPlay
          playsInline
          loop
          muted={isMuted}
          onLoadedData={handleVideoLoadedData}
        >
          <source src={videoSource} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // Once loading is complete, render the main application
  console.log("RENDER: Rendering Main Application.");
  return (
    <>
      <Navbar />

      <div
        className="hidden-login-trigger"
        onClick={handleSecretClick}
        onContextMenu={(e) => e.preventDefault()}
        tabIndex={0}
      ></div>

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