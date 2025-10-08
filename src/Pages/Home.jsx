// src/Pages/Home.jsx

import Exp from "../Resume/XP/Exp.jsx";
import Edu from "../Resume/Edu/Edu.jsx";
import ToBtn from "../Buttons/ToBtn.jsx";
import RecentProjects from "../components/highlights/RecentProjects.jsx";

const Home = () => {
  return (
    <>
      <div className="Home-wrapper">
        <div className="Home-Content">
          <div className="title">
            <h1>Key'n Brosdahl</h1>
          </div>
          <div className="sub-title">
            <h3>Frontend Developer</h3>
          </div>
          <div className="aboutMe-wrapper">
            <div className="pro-sum">
              <h4>Profesional Summary</h4>
              <p className="Pro-Sum-P">
                I am a developer and digital artist specializing in creating
                high-performance, interactive experiences across multiple
                platforms. My technical foundation is primarily in React, where
                I build applications using JavaScript (JSX) and TypeScript (TSX)
                for both web and native environments. Beyond web development, my
                creative toolkit includes: 3D Content Creation: Blender and
                Houdini (currently expanding skills). Real-Time Environments:
                Unreal Engine. I am also committed to deepening my core computer
                science knowledge, with a current focus on Data Structures and
                Algorithms.
              </p>
            </div>
          </div>

          {/* Btn that redirects to Project's Page */}
          <div className="home-nav-button">
            <ToBtn to="/projects">View My Work</ToBtn>

            <ToBtn to="/Contact">Contact me</ToBtn>
          </div>

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
