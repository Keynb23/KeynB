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

  // Initialize the state immediately based on the current window width
  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= MOBILE_BREAKPOINT_WIDTH
  );

  const isMuted = true;
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const videoRef = useRef(null);

  // --- 1. Breakpoint / Responsive Logic ---
  const checkScreenSize = () => {
    const isMobileOrTablet = window.innerWidth <= MOBILE_BREAKPOINT_WIDTH;
    setIsMobile(isMobileOrTablet);
  };

  useEffect(() => {
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);
  // -----------------------------------------------------------------

  const handleVideoLoadedData = () => {
    // Optional: Log if the video metadata loads
    // console.log("Video metadata loaded.");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (videoRef.current) videoRef.current.pause();
      setIsLoading(false);
    }, TOTAL_LOADING_TIME_MS);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const closeLoginModal = () => {
    setIsLoginVisible(false);
  };

  const handleSecretClick = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      setIsLoginVisible(true);
      e.stopPropagation();
    }
  };

  // --- Conditional Render ---
  const videoSource = isMobile ? "/IntroVid-Phone.mp4" : "/IntroVid.mp4";
  const videoClass = isMobile
    ? "blender-Phone-video-layer"
    : "blender-video-layer";

  if (isLoading) {
    // NEW CONSOLE LOG
    console.log(`Loading video. Source: ${videoSource}, Class: ${videoClass}`);

    return (
      <div className="loading-screen-container">
        <video
          className="blender-video-layer desktop-video"
          autoPlay
          playsInline
          loop
          muted
        >
          <source src="/IntroVid.mp4" type="video/mp4" />
        </video>

        <video
          className="blender-video-layer phone-video"
          autoPlay
          playsInline
          loop
          muted
        >
          <source src="/IntroVid-Phone.mp4" type="video/mp4" />
        </video>
      </div>
    );
  }

  // Once loading is complete, render the main application
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
