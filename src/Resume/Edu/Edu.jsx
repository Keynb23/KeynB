// src/Pages/Resume/Edu/Edu.jsx

import './Edu.css';

const Edu = () => {
  return (
    <section className="education-container">
      <h1 className="education-title">Education & Skills</h1>

      <div className="education-card">
        <div className="EDU-card-content">
          <h2 className="degree-title">Frontend Development</h2>
          <p className="school-info">Coding Temple | March 2025 – July 2025</p>
          <p className="card-description">
            An intensive, hands-on bootcamp focused on modern frontend technologies, covering the development process from UI/UX and responsive design to building complex, interactive web applications.
          </p>
          <h3 className="skills-heading">Key Skills:</h3>
          <ul className="skills-list">
            <li>JavaScript (ES6+)</li><li>TypeScript</li><li>React</li><li>HTML5 & CSS3</li><li>State Management</li><li>Responsive Design</li><li>API Integration (Postman)</li><li>Version Control (Git)</li>
          </ul>
        </div>
      </div>

      <div className="education-card">
        <div className="EDU-card-content">
          <h2 className="degree-title">Self-Taught 3D Developer & Designer</h2>
          <p className="school-info">Online Learning | 2025 – Present</p>
          <p className="card-description">
            Continuously learning 3D development principles and practices through documentation, tutorials, and personal projects to create immersive web experiences.
          </p>
          <h3 className="skills-heading">Focus Areas:</h3>
          <ul className="skills-list">
            <li>Unreal Engine</li><li>Blender</li><li>Houdini VFX</li><li>React Three Fiber</li><li>Three.js</li><li>3D Modeling</li><li>Texturing & Shading</li><li>Lighting & Rendering</li><li>3D Animation</li><li>Game Development</li><li>Blueprints</li><li>Sketchfab</li>
          </ul>
        </div>
      </div>

    </section>
  );
};

export default Edu;