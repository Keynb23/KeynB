// src/Resume/Projects/Projects.jsx

import { useState, useEffect, useCallback } from 'react';
import './Projects.css';

// Firebase Imports
import { collection, getDocs, query, orderBy } from 'firebase/firestore'; 
import { db } from '../../lib/firebase';
import { useAuth } from '../../hooks/useAuth.jsx'; // 👈 Use the .jsx extension

// Component Imports
import { skillTags } from '../../data/projectsData.js';
import ProjectManager from './ProjectManager.jsx'; // The Admin Modal
import ProjectCard from './ProjectCard.jsx'; // 👈 Keep only the import
import ProjectModal from './ProjectModal'; // 👈 Keep only the import
import { CloseBtn } from '../../Buttons/Modal-Btns.jsx';
// NOTE: Ensure './ProjectCard.jsx' and './ProjectModal.jsx' files exist!

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedProject, setSelectedProject] = useState(null);
    const [showAdminModal, setShowAdminModal] = useState(false); 
    
    // 🔥 CRUCIAL: Check for login status
    const { isAuthenticated } = useAuth(); 

    // Fetches ALL projects from Firestore
    const fetchProjects = useCallback(async () => {
        setLoading(true);
        let apiProjects = [];
        
        try {
            const projectsCollection = collection(db, "projects");
            const q = query(projectsCollection, orderBy("dateAdded", "desc"));
            const snapshot = await getDocs(q);
            
            apiProjects = snapshot.docs.map(doc => ({
                id: doc.id, 
                ...doc.data() 
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
    
    // When a project is added/edited, fetch the list again to update the UI
    const handleProjectAdded = () => {
        fetchProjects(); 
    };

    const filteredProjects = activeFilter === 'All'
        ? projects 
        : projects.filter(project => project.tags && project.tags.includes(activeFilter));

    const handleFilterClick = (tag) => {
        setActiveFilter(tag);
    };

    return (
        <>
            <div className="project-Container">
                <div className="project-Content">
                    
                    {/* 🔥 THE ADD PROJECT BUTTON APPEARS ONLY WHEN AUTHENTICATED */}
                    {isAuthenticated && (
                        <button 
                            className="admin-add-project-btn" 
                            onClick={() => setShowAdminModal(true)}
                        >
                            + Add New Project
                        </button>
                    )}
                    
                    {/* Project Manager rendered as a modal */}
                    {isAuthenticated && showAdminModal && (
                        <ProjectManager 
                            onProjectAdded={handleProjectAdded} 
                            onClose={() => setShowAdminModal(false)}
                        />
                    )}
                    
                    {/* Project Filter Tabs (Add logic here) */}
                    <div className="Project-Tabs">
                        {/* Filter tabs mapping */}
                    </div>

                    <div className="Project-Main-Content">
                        {loading && <p>Loading portfolio projects...</p>}
                        
                        <div className="Pro-Card-Rows">
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