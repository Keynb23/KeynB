import { useState, useEffect, useCallback } from 'react';
import './Projects.css';
import { projectsData, skillTags } from '../../data/projectsData.js';
import { CloseBtn } from '../../Buttons/Modal-Btns.jsx';
import ToBtn from '../../Buttons/ToBtn.jsx';

// This is a new, self-contained component for a single project card.
// It manages its own hover state, which is a more robust pattern.
const ProjectCard = ({ project, onCardClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoUrl = project.media?.find(m => m.type === 'video')?.src;

  return (
    <div
      className="Project-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onCardClick(project)}
    >
      {isHovered && videoUrl ? (
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
};

const ProjectModal = ({ project, onClose }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleNextMedia = useCallback(() => {
    if (!project) return;
    setIsPaused(false);
    setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % project.media.length);
  }, [project]);

  const handlePreviousMedia = useCallback(() => {
    if (!project) return;
    setIsPaused(true);
    setCurrentMediaIndex((prevIndex) => (prevIndex - 1 + project.media.length) % project.media.length);
  }, [project]);

  useEffect(() => {
    if (!project) return;
    setCurrentMediaIndex(0);
    setIsPaused(false);
  }, [project]);

  useEffect(() => {
    if (!project || isPaused || project.media[currentMediaIndex].type !== 'image') {
      return;
    }
    
    const timer = setTimeout(() => {
      handleNextMedia();
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentMediaIndex, project, handleNextMedia, isPaused]);

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
              onPlay={() => setIsPaused(true)}
              onEnded={() => {
                setIsPaused(false);
                handleNextMedia();
              }}
              className="modal-media"
            />
          ) : (
            <img key={currentMedia.src} src={currentMedia.src} alt={project.title} className="modal-media" />
          )}
          <div className="slideshow-instructions">
            <p>Use your left and right arrows to navigate</p>
          </div>
        </div>
        <div className="Pro-Model-Right">
          <div>
            <h2>{project.title}</h2>
            <p>{project.summary}</p>
            <div className="modal-tags">
              {project.tags.map(tag => <span key={tag} className="modal-tag">{tag}</span>)}
            </div>
            {/* This new wrapper renders the project links */}
            <div className="modal-links-wrapper">
              {project.links && (
                <a href={project.links} target="_blank" rel="noopener noreferrer" className="modal-link-btn live-site">
                  Live Site
                </a>
              )}
              {project.source && (
                <a href={project.source} target="_blank" rel="noopener noreferrer" className="modal-link-btn source-code">
                  Source Code
                </a>
              )}
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
  // The hoveredProjectId state is no longer needed, as each card manages itself.
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
              {/* The mapping logic is now much simpler. */}
              {filteredProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onCardClick={setSelectedProject}
                />
              ))}
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
