// src/Pages/Home.jsx

import React, { useEffect } from "react";
import Exp from "../Resume/XP/Exp.jsx";
import Edu from "../Resume/Edu/Edu.jsx";
import ToBtn from "../Buttons/ToBtn.jsx";
import RecentProjects from "../components/highlights/RecentProjects.jsx";

const Home = () => {
    useEffect(() => {
    const title = document.querySelector(".title h1");

    let active = false;
    let timer = null;

    function randomDelay(min, max) {
      return Math.random() * (max - min) + min;
    }

    function startWiggleLoop() {
      if (active) return;
      active = true;

      function loop() {
        if (!active) return;

        // Add wiggle animation
        title.classList.add("wiggle");

        // Remove it after animation finishes
        setTimeout(() => {
          title.classList.remove("wiggle");
        }, 200);

        // Random delay before next wiggle
        const nextDelay = randomDelay(800, 9000); 
        timer = setTimeout(loop, nextDelay);
      }

      // First wiggle happens after 1.2 seconds
      timer = setTimeout(loop, 13400);
    }

    function stopWiggleLoop() {
      active = false;
      clearTimeout(timer);
      title.classList.remove("wiggle");
    }

    title.addEventListener("mouseenter", startWiggleLoop);
    title.addEventListener("mouseleave", stopWiggleLoop);

    return () => {
      title.removeEventListener("mouseenter", startWiggleLoop);
      title.removeEventListener("mouseleave", stopWiggleLoop);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const wrapper = document.querySelector(".RPH-Wrapper");

    const updateOffset = () => {
      const x = `${(Math.random() - 0.5) * 10}px`;
      const y = `${(Math.random() - 0.5) * 10}px`;

      if (wrapper) {
        wrapper.style.setProperty("--paint-offset-x", x);
        wrapper.style.setProperty("--paint-offset-y", y);
      }
    };

    updateOffset();
    const interval = setInterval(updateOffset, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* SVG filter rendering is removed */}

      <div className="Home-wrapper">
        <div className="Home-Content">
          <div className="title">
            <h1>Key'n Brosdahl</h1>
          </div>
          <div className="sub-title">
            <h3>Software Engineer</h3>
          </div>
          <div className="aboutMe-wrapper">
            <div className="pro-sum">
              <h4>Professional Summary</h4>
              <p className="Pro-Sum-P">
                I am a developer and digital artist specializing in creating
                high-performance, interactive experiences across multiple
                platforms.
              </p>

              <p className="Pro-Sum-P">
                My technical foundation is primarily in React, where I build
                applications using JavaScript (JSX) and TypeScript (TSX) for
                both web and native environments. Beyond web development, my
                creative toolkit includes: 3D Content Creation: Blender and
                Houdini (currently expanding skills).{" "}
              </p>

              <p className="Pro-Sum-P">
                Real-Time Environments: Unreal Engine. I am also committed to
                deepening my core computer science knowledge, with a current
                focus on Data Structures and Algorithms.
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="home-nav-button">
            <ToBtn to="/projects">View My Work</ToBtn>
            <ToBtn to="/Contact">Contact me</ToBtn>
          </div>

          {/* Recent Projects Highlights */}
          <div className="RPH-Wrapper">
            <RecentProjects />
          </div>
          <Exp />
          <Edu />
        </div>
      </div>
    </>
  );
};

export default Home;
