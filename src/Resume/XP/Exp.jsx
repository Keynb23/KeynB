import "./XP.css";

const Exp = () => {
  return (
    <>
      <div id="experience-history-section" className="experience-section">
        <h2 className="unlocked-title">Work Experience</h2>
        <div className="experience-history">
          <div className="job-entry">
            <h3>Frontend Developer Internship</h3>
            {/* UPDATED: Changed date to reflect current role */}
            <h4>AstroSkills | Remote | August 2025 – Present</h4>
            <ul>
              <li>
                Co-led the front-end team for AstroSkills, contributing to
                overall design direction and feature implementation.
              </li>
              <li>
                Designed the home screen layout, established the color palette,
                selected typography, and defined the site’s visual style.
              </li>
              <li>
                Collaborated with frontend, backend, and cybersecurity teams to
                integrate features, optimize user experience, and connect APIs.
              </li>
            </ul>
          </div>

          <div className="job-entry">
            <h3>Software Engineer</h3>
            <h4>Coding Temple | Remote | March 2025 – June 2025</h4>
            <ul>
              <li>
                Developed responsive UI components using React and JSX,
                enhancing user experience and interface interactivity.
              </li>
              {/* UPDATED: Rephrased to emphasize frontend focus */}
              <li>
                Consumed and integrated RESTful APIs to fetch and display
                dynamic data within the user interface.
              </li>
              <li>
                Applied version control using Git and GitHub across all projects
                to ensure code reliability and seamless collaboration.
              </li>
            </ul>
          </div>

          <div className="job-entry">
            <h3>Sales Representative</h3>
            <h4>
              Drewing Automotive | Columbia, MO | February 2021 – January 2024
            </h4>
            <ul>
              <li>
                Managed customer relationships, assessed needs, and presented
                tailored vehicle solutions.
              </li>
              <li>
                Increased customer satisfaction and retention through consistent
                follow-up and product knowledge.
              </li>
            </ul>
          </div>

          <div className="job-entry">
            <h3>Laborer</h3>
            <h4>
              Helitech Foundation Repair & Waterproofing | Kingdom City, MO |
              February 2024 – December 2024
            </h4>
            <ul>
              <li>
                Assessed structural damage and assisted with foundation repair
                operations, ensuring high accuracy and safety.
              </li>
              <li>
                Improved job site efficiency by streamlining inventory prep and
                tool handling.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Exp;
