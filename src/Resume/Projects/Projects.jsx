// src/Resume/Projects/Projects.jsx

import { useState, useEffect, useCallback } from "react";
import "./Projects.css";

// Firebase Imports
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../hooks/useAuth.jsx";

// Component Imports
import { skillTags } from "../../data/projectsData.js";
import ProjectManager from "./ProjectManager.jsx";
import ProjectCard from "./ProjectCard.jsx";
import ProjectModal from "./ProjectModal";
import { CloseBtn } from "../../Buttons/Modal-Btns.jsx";

// Function to group projects into rows of 4 (for desktop display)
const groupProjectsIntoRows = (projects, projectsPerRow = 4) => {
  const rows = [];
  for (let i = 0; i < projects.length; i += projectsPerRow) {
    rows.push(projects.slice(i, i + projectsPerRow));
  }
  return rows;
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);

  // 👇 UPDATE: Destructure 'isAuthorizedAdmin' instead of 'isAuthenticated'
  const { isAuthorizedAdmin } = useAuth();

  // Fetches ALL projects from Firestore
  const fetchProjects = useCallback(async () => {
    // ... (fetchProjects logic is unchanged)
    setLoading(true);
    let apiProjects = [];

    try {
      const projectsCollection = collection(db, "projects");
      const q = query(projectsCollection, orderBy("dateAdded", "desc"));
      const snapshot = await getDocs(q);

      apiProjects = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Failed to fetch projects from Firestore:", error);
    }

    setProjects(apiProjects);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // When a project is added/edited/deleted, fetch the list again to update the UI
  const handleProjectUpdate = () => {
    fetchProjects();
  };

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter(
          (project) => project.tags && project.tags.includes(activeFilter)
        );

  const groupedRows = groupProjectsIntoRows(filteredProjects);

  const handleFilterClick = (tag) => {
    setActiveFilter(tag);
  };

  return (
    <>
      <div className="project-Container">
        <div className="project-Content">
          {/* ADMIN ADD BUTTON */}
          {isAuthorizedAdmin && (
            <button
              className="admin-add-project-btn"
              onClick={() => setShowAdminModal(true)}
            >
              + Add New Project
            </button>
          )}

          {/* Project Manager Modal */}
          {isAuthorizedAdmin && showAdminModal && (
            <ProjectManager
              onProjectAdded={handleProjectUpdate}
              onClose={() => setShowAdminModal(false)}
            />
          )}

          {/* Project Filter Tabs */}
          <div className="Project-Tabs-Wrapper">
            {skillTags.map((tag) => (
              <button
                key={tag}
                className={`Project-Tab ${activeFilter === tag ? "active" : ""}`}
                onClick={() => handleFilterClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="Project-Main-Content">
            {loading && <p>Loading portfolio projects...</p>}

            {/* Render Rows of Projects */}
            {groupedRows.map((row, index) => (
              <div key={index} className="Pro-Card-Row">
                {row.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onCardClick={setSelectedProject}
                  />
                ))}
              </div>
            ))}

            {/* No projects message */}
            {!loading && filteredProjects.length === 0 && (
              <p className="no-projects-message">
                No projects found for filter: "{activeFilter}"
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Project Details Modal (Netflix-style) */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onProjectDeleted={handleProjectUpdate}
      />
    </>
  );
};

export default Projects;
