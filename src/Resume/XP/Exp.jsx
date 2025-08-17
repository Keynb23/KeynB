import { useState, useRef } from 'react';
import './XP.css';
import MiniGame from './miniGame';

const Exp = () => {
  const [isExperienceUnlocked, setIsExperienceUnlocked] = useState(false);
  const miniGameRef = useRef();

  const handleGameOver = () => {
    setIsExperienceUnlocked(true);
  };

  const handleGameRestart = () => {
    setIsExperienceUnlocked(false);
  };

  const handlePlayAgainClick = () => {
    miniGameRef.current?.restart();
  };

  const handleViewExperienceClick = () => {
    document.getElementById('experience-history-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="xp-section">
        <h2 className="xp-title">Interactive Experience</h2>
        <p className="xp-instructions">
          Play a quick game to unlock my work history!
          <br />
          Press the <strong>Spacebar</strong> to jump over the obstacles.
        </p>
        <div className="game-wrapper">
          <MiniGame
            ref={miniGameRef}
            onGameOver={handleGameOver}
            onGameRestart={handleGameRestart}
          />
          {isExperienceUnlocked && (
            <div className="unlock-overlay">
              <div className="unlock-message">
                <h2>Congrats!</h2>
                <p>You've unlocked my work experience.</p>
                <div className="unlock-buttons">
                  <button onClick={handlePlayAgainClick}>Play Again</button>
                  <button onClick={handleViewExperienceClick}>View My History</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isExperienceUnlocked && (
        <div id="experience-history-section" className="experience-section">
          <h2 className="unlocked-title">Work Experience</h2>
          <div className="experience-history">
            <div className="job-entry">
              <h3>Frontend Developer Internship</h3>
              <video className="job-video" src="/MP4/Space-earth.mp4" loop autoPlay muted controls />
              {/* UPDATED: Changed date to reflect current role */}
              <h4>AstroSkills | Remote | August 2025 – Present</h4>
              <ul>
                <li>Co-led the front-end team for AstroSkills, contributing to overall design direction and feature implementation.</li>
                <li>Designed the home screen layout, established the color palette, selected typography, and defined the site’s visual style.</li>
                <li>Collaborated with frontend, backend, and cybersecurity teams to integrate features, optimize user experience, and connect APIs.</li>
              </ul>
            </div>

            <div className="job-entry">
              <h3>Software Engineer</h3>
              <video className="job-video" src="/MP4/Coding-Vid.mp4" loop autoPlay muted controls />
              <h4>Coding Temple | Remote | March 2025 – June 2025</h4>
              <ul>
                <li>Developed responsive UI components using React and JSX, enhancing user experience and interface interactivity.</li>
                {/* UPDATED: Rephrased to emphasize frontend focus */}
                <li>Consumed and integrated RESTful APIs to fetch and display dynamic data within the user interface.</li>
                <li>Applied version control using Git and GitHub across all projects to ensure code reliability and seamless collaboration.</li>
              </ul>
            </div>

            <div className="job-entry">
              <h3>Sales Representative</h3>
              <video className="job-video" src="/MP4/Salesman.mp4" loop autoPlay muted controls />
              <h4>Drewing Automotive | Columbia, MO | February 2021 – January 2024</h4>
              <ul>
                <li>Managed customer relationships, assessed needs, and presented tailored vehicle solutions.</li>
                <li>Increased customer satisfaction and retention through consistent follow-up and product knowledge.</li>
              </ul>
            </div>

            <div className="job-entry">
              <h3>Laborer</h3>
              <video className="job-video" src="/MP4/Construction.mp4" loop autoPlay muted controls />
              <h4>Helitech Foundation Repair & Waterproofing | Kingdom City, MO | February 2024 – December 2024</h4>
              <ul>
                <li>Assessed structural damage and assisted with foundation repair operations, ensuring high accuracy and safety.</li>
                <li>Improved job site efficiency by streamlining inventory prep and tool handling.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Exp;