import { useState, useEffect, useCallback } from 'react';
import './Projects.css';
import { projectsData, skillTags } from '../data/projectsData.js';
import { CloseBtn } from '../Buttons/Modal-Btns.jsx';
// I'm importing the ToBtn to use for the new "Hire Me" button
import ToBtn from '../Buttons/ToBtn.jsx';

const ProjectModal = ({ project, onClose }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  // New state to control the autoplay timer
  const [isPaused, setIsPaused] = useState(false);

  // --- Slideshow Navigation Logic ---

  const handleNextMedia = useCallback(() => {
    if (!project) return;
    // Resumes the autoplay when the user manually clicks next
    setIsPaused(false);
    setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % project.media.length);
  }, [project]);

  const handlePreviousMedia = useCallback(() => {
    if (!project) return;
    // Pauses the autoplay when the user manually goes back
    setIsPaused(true);
    setCurrentMediaIndex((prevIndex) => (prevIndex - 1 + project.media.length) % project.media.length);
  }, [project]);


  // --- useEffect Hooks for managing slideshow behavior ---

  // Reset slideshow when a new project is opened
  useEffect(() => {
    if (!project) return;
    setCurrentMediaIndex(0);
    setIsPaused(false); // Ensure it's not paused when a new modal opens
  }, [project]);

  // Autoplay timer for images
  useEffect(() => {
    if (!project || isPaused || project.media[currentMediaIndex].type !== 'image') {
      return; // Do nothing if there's no project, it's paused, or it's a video
    }
    
    const timer = setTimeout(() => {
      handleNextMedia();
    }, 3000); // 3-second delay for images

    return () => clearTimeout(timer);
  }, [currentMediaIndex, project, handleNextMedia, isPaused]);


  // Keyboard navigation for Escape and slideshow controls
  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') handleNextMedia();
      if (event.key === 'ArrowLeft') handlePreviousMedia();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose, handleNextMedia, handlePreviousMedia]);

  if (!project) return null;

  const currentMedia = project.media[currentMediaIndex];
  const handleContentClick = (e) => e.stopPropagation();

  return (
    <div className="Project-Model" onClick={onClose}>
      <div className="modal-content" onClick={handleContentClick}>
        <CloseBtn onClick={onClose} />
        <div className="Pro-Model-Left">
          {currentMedia.type === 'video' ? (
            <video
              key={currentMedia.src}
              src={currentMedia.src}
              controls
              autoPlay
              muted
              onPlay={() => setIsPaused(true)} // Pause slideshow while video plays
              onEnded={() => {
                setIsPaused(false); // Resume slideshow after video
                handleNextMedia();
              }}
              className="modal-media"
            />
          ) : (
            <img key={currentMedia.src} src={currentMedia.src} alt={project.title} className="modal-media" />
          )}
          <div className="slideshow-navigation-wrapper">
            <button className="slideshow-nav-btn prev" onClick={handlePreviousMedia}>&#8249;</button>
            <button className="slideshow-nav-btn next" onClick={handleNextMedia}>&#8250;</button>
          </div>
        </div>
        <div className="Pro-Model-Right">
          <div>
            <h2>{project.title}</h2>
            <p>{project.summary}</p>
            <div className="modal-tags">
              {project.tags.map(tag => <span key={tag} className="modal-tag">{tag}</span>)}
            </div>
          </div>
          <div className="hire-me-wrapper">
            <ToBtn to="/contact">I'm sold, let's talk!</ToBtn>
          </div>
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [hoveredProjectId, setHoveredProjectId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = activeFilter === 'All'
    ? projectsData
    : projectsData.filter(project => project.tags.includes(activeFilter));

  return (
    <>
      <div className="project-Container">
        <div className="project-Content">
          <div className="project-top">
            <nav>
              <ul>
                {skillTags.map(tag => (
                  <li
                    key={tag}
                    className={`Project-Tabs ${activeFilter === tag ? 'active' : ''}`}
                    onClick={() => setActiveFilter(tag)}
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="Project-Main-Content">
            <div className="Pro-Card-Rows">
              {filteredProjects.map(project => {
                const videoUrl = project.media?.find(m => m.type === 'video')?.src;

                return (
                  <div
                    key={project.id}
                    className="Project-card"
                    onMouseEnter={() => setHoveredProjectId(project.id)}
                    onMouseLeave={() => setHoveredProjectId(null)}
                    onClick={() => setSelectedProject(project)}
                  >
                    {hoveredProjectId === project.id && videoUrl ? (
                      <video
                        src={videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="project-video"
                      />
                    ) : (
                      <img
                        src={project.coverImage}
                        alt={`${project.title} screenshot`}
                        className="project-image"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
};

export default Projects;
