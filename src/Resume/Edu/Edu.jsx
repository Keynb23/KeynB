import { useState, useRef, useEffect } from 'react';
import './Edu.css';
import Icons from '../../components/Icons.jsx'; // Your icons object

const Edu = () => {
  const bowlRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Use a ref to store icon properties so they don't reset on re-render
  const iconsRef = useRef([]);

  // Initialize icon positions and speeds only once
  useEffect(() => {
    const iconKeys = Object.keys(Icons);
    iconsRef.current = iconKeys.map(key => ({
      key: key,
      src: Icons[key],
      // Random initial position (from 20% to 80% of the container)
      initialX: 20 + Math.random() * 60,
      initialY: 20 + Math.random() * 60,
      // Random speed factor for parallax effect (some move faster than others)
      speedFactor: 0.2 + Math.random() * 0.8
    }));
  }, []);

  const handleMouseMove = (e) => {
    if (!bowlRef.current) return;

    const rect = bowlRef.current.getBoundingClientRect();
    // Calculate mouse position relative to the center of the container (-0.5 to 0.5)
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    
    setMousePos({ x, y });
  };

  return (
    <section className="education-container">
      <h1 className="education-title">Education & Skills</h1>

      {/* --- Formal Education Card --- */}
      <div className="education-card">
        {/* ... Card Content ... */}
        <div className="card-content">
          <h2 className="degree-title">Frontend Development</h2>
          <p className="school-info">Coding Temple | March 2025 – July 2025</p>
          <p className="card-description">
            An intensive, hands-on bootcamp focused on modern frontend technologies, covering the development process from UI/UX and responsive design to building complex, interactive web applications.
          </p>
          <h3 className="skills-heading">Key Skills:</h3>
          <ul className="skills-list">
            <li>JavaScript (ES6+)</li>
            <li>TypeScript</li>
            <li>React</li>
            <li>HTML5 & CSS3</li>
            <li>State Management</li>
            <li>Responsive Design</li>
            <li>API Integration (Postman)</li>
            <li>Version Control (Git)</li>
          </ul>
        </div>
      </div>

      {/* --- Self-Taught Card --- */}
      <div className="education-card">
         {/* ... Card Content ... */}
         <div className="card-content">
          <h2 className="degree-title">Self-Taught 3D Developer & Designer</h2>
          <p className="school-info">Online Learning | 2025 – Present</p>
          <p className="card-description">
            Continuously learning 3D development principles and practices through documentation, tutorials, and personal projects to create immersive web experiences.
          </p>
          <h3 className="skills-heading">Focus Areas:</h3>
          <ul className="skills-list">
            <li>Unreal Engine</li>
            <li>Blender</li>
            <li>Houdini VFX</li>
            <li>React Three Fiber</li>
            <li>Three.js</li>
            <li>3D Modeling</li>
            <li>Texturing & Shading</li>
            <li>Lighting & Rendering</li>
            <li>3D Animation</li>
            <li>Game Development</li>
            <li>Blueprints</li>
            <li>Sketchfab</li>
          </ul>
        </div>
      </div>
      
      {/* --- Interactive Icon Bowl --- */}
      <div 
        className="Icon-Bowl" 
        ref={bowlRef} 
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMousePos({ x: 0, y: 0 })} // Reset when mouse leaves
      >
        {iconsRef.current.map(icon => {
          const moveX = mousePos.x * 20 * icon.speedFactor; // Max move 20px
          const moveY = mousePos.y * 20 * icon.speedFactor;
          
          return (
            <img 
              key={icon.key}
              src={icon.src}
              alt={`${icon.key} icon`}
              className="icon-instance"
              style={{
                top: `${icon.initialY}%`,
                left: `${icon.initialX}%`,
                transform: `translate(-50%, -50%) translate(${moveX}px, ${moveY}px)`,
              }}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Edu;