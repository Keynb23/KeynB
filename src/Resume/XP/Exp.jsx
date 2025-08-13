import { useState } from 'react';
import './XP.css';
import MiniGame from './miniGame';

const Exp = () => {
  // State to track if the game has been completed at least once
  const [isExperienceUnlocked, setIsExperienceUnlocked] = useState(false);

  // This function will be passed to the MiniGame component
  const handleGameOver = () => {
    setIsExperienceUnlocked(true);
  };

  const handleViewExperienceClick = () => {
    // Smoothly scroll to the experience section
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
          <MiniGame onGameOver={handleGameOver} />
          {/* The congrats message now renders as an overlay */}
          {isExperienceUnlocked && (
            <div className="unlock-overlay">
              <div className="unlock-message">
                <h2>Congrats!</h2>
                <p>You've unlocked my work experience.</p>
                <button onClick={handleViewExperienceClick}>View My History</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Conditionally render the experience section when unlocked */}
      {isExperienceUnlocked && (
        <div id="experience-history-section" className="experience-section">
          <h2 className="unlocked-title">Work Experience</h2>
          <div className="experience-history">
            
            <div className="job-entry">
              <h3>Frontend Developer Internship</h3>
              <h4>AstroSkills | Remote | August 2025 – September 2025</h4>
              <ul>
                <li>Co-led the front-end team for AstroSkills, contributing to overall design direction and feature implementation.</li>
                <li>Designed the home screen layout, established the color palette, selected typography, and defined the site’s visual style.</li>
                <li>Collaborated with frontend, backend, and cybersecurity teams to integrate features, optimize user experience, and connect APIs.</li>
              </ul>
            </div>

            <div className="job-entry">
              <h3>Software Engineer</h3>
              <h4>Coding Temple | Remote | March 2025 – June 2025</h4>
              <ul>
                <li>Developed responsive UI components using React and JSX, enhancing user experience and interface interactivity.</li>
                <li>Built and connected RESTful APIs using Flask and MySQL, enabling dynamic data handling.</li>
                <li>Applied version control using Git and GitHub across all projects to ensure code reliability and seamless collaboration.</li>
              </ul>
            </div>

            <div className="job-entry">
              <h3>Sales Representative</h3>
              <h4>Drewing Automotive | Columbia, MO | February 2021 – January 2024</h4>
              <ul>
                <li>Managed customer relationships, assessed needs, and presented tailored vehicle solutions.</li>
                <li>Increased customer satisfaction and retention through consistent follow-up and product knowledge.</li>
              </ul>
            </div>

            <div className="job-entry">
              <h3>Laborer</h3>
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
