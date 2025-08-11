import { useState, useEffect } from 'react';
import './Projects.css';
import { projectsData, skillTags } from '../data/projectsData.js';
import { CloseBtn, NextBtn, PrevBtn } from '../Buttons/Modal-Btns.jsx';

// Look into remove the next and previous buttons and replacing them with a "I'm sold, I'll hire you" button that has more pop to it.

const ProjectModal = ({ project, onClose, onNextProject, onPreviousProject, hasNextProject, hasPreviousProject }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Effect to handle the autoplaying slideshow
  useEffect(() => {
    if (!project) return;
    // Reset to the first slide when the project changes
    setCurrentMediaIndex(0);
  }, [project]);

  useEffect(() => {
    if (!project) return;
    
    const currentMedia = project.media[currentMediaIndex];
    let timer;

    // If the current item is an image, set a timer to advance to the next slide
    if (currentMedia.type === 'image') {
      timer = setTimeout(() => {
        handleNextMedia();
      }, 4000); // 4-second delay for images
    }

    // Cleanup function to clear the timer if the component unmounts or changes
    return () => clearTimeout(timer);
  }, [currentMediaIndex, project]);


  // Effect to handle all keyboard navigation
  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      // Use arrow keys to navigate the media slideshow
      if (event.key === 'ArrowRight') handleNextMedia();
      if (event.key === 'ArrowLeft') handlePreviousMedia();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, currentMediaIndex]); // Re-bind when index changes

  if (!project) return null;

  const handleNextMedia = () => {
    setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % project.media.length);
  };

  const handlePreviousMedia = () => {
    setCurrentMediaIndex((prevIndex) => (prevIndex - 1 + project.media.length) % project.media.length);
  };

  const currentMedia = project.media[currentMediaIndex];

  const handleContentClick = (e) => e.stopPropagation();

  return (
    <div className="Project-Model" onClick={onClose}>
      <div className="modal-content" onClick={handleContentClick}>
        <CloseBtn onClick={onClose} />
        <div className="Pro-Model-Left">
          {currentMedia.type === 'video' ? (
            <video
              key={currentMedia.src} // Key is important for React to re-render the video element
              src={currentMedia.src}
              controls
              autoPlay
              muted
              onEnded={handleNextMedia} // Go to next slide when video finishes
              className="modal-media"
            />
          ) : (
            <img key={currentMedia.src} src={currentMedia.src} alt={project.title} className="modal-media" />
          )}
          {/* The slideshow buttons could go here if you wanted them */}
        </div>
        <div className="Pro-Model-Right">
          <div> {/* Added wrapper for top content */}
            <h2>{project.title}</h2>
            <p>{project.summary}</p>
            <div className="modal-tags">
              {project.tags.map(tag => <span key={tag} className="modal-tag">{tag}</span>)}
            </div>
          </div>
          {/* New wrapper for the PROJECT navigation buttons */}
          <div className="project-navigation-wrapper">
            {hasPreviousProject ? <PrevBtn onClick={onPreviousProject} /> : <div/>}
            {hasNextProject ? <NextBtn onClick={onNextProject} /> : <div/>}
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

  const currentProjectIndex = selectedProject
    ? filteredProjects.findIndex(p => p.id === selectedProject.id)
    : -1;

  const hasNextProject = currentProjectIndex !== -1 && currentProjectIndex < filteredProjects.length - 1;
  const hasPreviousProject = currentProjectIndex > 0;

  const handleNextProject = () => {
    if (hasNextProject) {
      setSelectedProject(filteredProjects[currentProjectIndex + 1]);
    }
  };

  const handlePreviousProject = () => {
    if (hasPreviousProject) {
      setSelectedProject(filteredProjects[currentProjectIndex - 1]);
    }
  };

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
        onNextProject={handleNextProject}
        onPreviousProject={handlePreviousProject}
        hasNextProject={hasNextProject}
        hasPreviousProject={hasPreviousProject}
      />
    </>
  );
};

export default Projects;
