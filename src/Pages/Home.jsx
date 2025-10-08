// src/Pages/Home.jsx

import Exp from '../Resume/XP/Exp.jsx';
import Edu from '../Resume/Edu/Edu.jsx';
import ToBtn from '../Buttons/ToBtn.jsx';
import RecentProjects from '../components/highlights/RecentProjects.jsx'; 

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
                Front-end developer and aspiring game designer with skills in React, JavaScript, HTML, and CSS. 
                Passionate about creating engaging, interactive experiences through clean UI design and responsive layouts.
                Currently learning Unreal Engine and Blender to combine technical expertise with creative storytelling for immersive games and applications.
              </p>
            </div>
          </div>
          
          {/* Btn that redirects to Project's Page */}
          <div className="home-nav-button">
            <ToBtn to="/projects">
              View My Work
            </ToBtn>
            
            <ToBtn to="/Contact">
            Contact me
            </ToBtn>
          </div>

        <div className="RPH-Wrapper">
            <RecentProjects />
        </div>
        <Exp/>
        <Edu/>
        </div>
      </div>
    </>
  )
}

export default Home;
