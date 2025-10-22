// /src/Resume/Projects/ProjectModal.jsx
import  { useState, useEffect, useMemo } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../hooks/useAuth.jsx";
import { CloseBtn } from "../../Buttons/Modal-Btns.jsx";
import './ProjectModal.css';

const ProjectModal = ({ project, onClose, onProjectDeleted }) => {
  // STATE & CONTEXT HOOKS
  const { isAuthenticated } = useAuth();
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // EFFECT: Reset media index when project changes
  useEffect(() => {
    setCurrentMediaIndex(0);
  }, [project]);

  // EFFECT: Handle ESC key close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const media = useMemo(() => {
    if (!project) return [];

    return [
      project.coverImage,
      ...(project.screenshots || []),
      ...(project.videos || []),
    ].filter((url) => url);
  }, [project]);

  // EARLY EXIT (Placed AFTER all hooks)
  if (!project || !project.id) {
    return null;
  }

  const currentMedia = media[currentMediaIndex];

  // MEDIA NAVIGATION HANDLERS
  const goToNextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % media.length);
  };

  const goToPrevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  // ADMIN DELETE HANDLER
  const handleDelete = async () => {
    if (!isAuthenticated) {
      alert("You must be logged in to delete projects.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the project: "${project.title}"?`
    );

    if (confirmDelete) {
      try {
        const projectRef = doc(db, "projects", project.id);
        await deleteDoc(projectRef);

        alert("Project deleted successfully!");
        onClose();

        if (onProjectDeleted) {
          onProjectDeleted();
        }
      } catch (error) {
        console.error("Error deleting document:", error);
        alert("Failed to delete project. Check console and Firebase Rules.");
      }
    }
  };

  return (
    // JSX RENDER
    <div className="Project-Model" onClick={onClose}>
      <div
        className="modal-content project-details-content"
        onClick={(e) => e.stopPropagation()}
      >
        <CloseBtn onClick={onClose} />

        {/* 1. MEDIA DISPLAY (Left Side) */}
        <div className="Pro-Model-Left">
          {media.length > 0 && (
            <>
              {currentMedia.match(/\.(mp4|webm|ogg)$/i) ? (
                <video
                  src={currentMedia}
                  controls
                  autoPlay
                  loop
                  muted
                  className="modal-media"
                />
              ) : (
                <img
                  src={currentMedia}
                  alt={`${project.title} - Screenshot ${currentMediaIndex + 1}`}
                  className="modal-media"
                />
              )}

              {/* Media Navigation Arrows */}
              {media.length > 1 && (
                <>
                  <button
                    className="media-nav media-prev"
                    onClick={goToPrevMedia}
                  >
                    &#10094;
                  </button>
                  <button
                    className="media-nav media-next"
                    onClick={goToNextMedia}
                  >
                    &#10095;
                  </button>
                  <div className="slideshow-instructions">
                    {currentMediaIndex + 1} / {media.length} (Click arrows to
                    cycle)
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* 2. TEXT CONTENT (Right Side) */}
        <div className="Pro-Model-Right">
          <div>
            <h1 className="project-title-modal">{project.title}</h1>

            <p className="project-description-modal">
              {project.summary || project.description}
            </p>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="modal-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="modal-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Links and Actions */}
          <div className="modal-actions-area">
            {/* Live Site and Source Code Links */}
            <div className="modal-links-wrapper">
              {project.liveSiteLink && (
                <a
                  href={project.liveSiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-link-btn live-site"
                >
                  View Live Site
                </a>
              )}
              {project.sourceCode && (
                <a
                  href={project.sourceCode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-link-btn source-code"
                >
                  Source Code
                </a>
              )}
            </div>

            {/* ADMIN DELETE BUTTON */}
            {isAuthenticated && (
              <div className="admin-actions">
                <button onClick={handleDelete} className="btn-delete">
                  Delete Project
                </button>
                {/* The "Edit" button would go here */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
