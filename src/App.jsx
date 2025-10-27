// App.jsx
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Home from "./Pages/Home";
import Exp from "./Resume/XP/Exp";
import Projects from "./Resume/Projects/Projects";
import EDU from "./Resume/Edu/Edu";
import Footer from "./components/Footer";
import { Login } from "./components/Login/Login";
import { useEffect, useState, useRef } from "react";
import { Decoys } from "./components/Decoys";

// The IntroVid.mp4 file now contains both video and audio.
const TOTAL_LOADING_TIME_MS = 4000;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const isMuted = true;
  const [isLoginVisible, setIsLoginVisible] = useState(false);

  // Ref to control the video element
  const videoRef = useRef(null);

  console.log("App component rendered. Current loading state:", isLoading);

  // Handler to ensure the video is ready to play.
  const handleVideoLoadedData = () => {
    console.log(
      "VIDEO LOADED: Video metadata loaded. It is intentionally muted."
    );
  };

  // 2. Loading Timer (Video plays for this duration, then the main app loads)
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

  // 3. Other Handlers
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
        {/* Video element, permanently muted */}
        <video
          ref={videoRef}
          className="blender-video-layer"
          autoPlay
          playsInline
          loop // Play until the timer expires
          muted={isMuted} // Video is permanently muted
          onLoadedData={handleVideoLoadedData} // Simple ready handler
        >
          <source src="/IntroVid.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Removed Skip and Mute Controls Container */}
      </div>
    );
  }

  // Once loading is complete, render the main application
  console.log("RENDER: Rendering Main Application.");
  return (
    <>
      <Navbar />
      <Decoys />

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
