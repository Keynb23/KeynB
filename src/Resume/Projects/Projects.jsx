// src/Resume/Projects/Projects.jsx

import { useState, useEffect, useCallback } from 'react';
import './Projects.css';
import { skillTags } from '../../data/projectsData.js';
import { CloseBtn } from '../../Buttons/Modal-Btns.jsx';
import ToBtn from '../../Buttons/ToBtn.jsx';
import ProjectManager from './ProjectManager.jsx';
import { useAuth } from '../../hooks/useAuth'; 

// 1. IMPORT YOUR HARD-CODED PROJECT FILES
import { BetterState } from '../../data/Warehouse/BetterState.js';
import { DJApp } from '../../data/Warehouse/DJApp.js';


// 🐛 FIX: Define STATIC DATA OUTSIDE the component. 
// This ensures the array is created only once and never changes, 
// preventing it from causing useCallback to re-create the fetchProjects function.
const STATIC_PROJECTS = [
    BetterState,
    DJApp
];


// The ProjectCard and ProjectModal components remain the same...

const ProjectCard = ({ project, onCardClick }) => {
    // ... (ProjectCard content remains unchanged) ...
};

const ProjectModal = ({ project, onClose }) => {
    // ... (ProjectModal content remains unchanged) ...
};


const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedProject, setSelectedProject] = useState(null);
    
    const [showAdminModal, setShowAdminModal] = useState(false); 
    const { isAuthenticated } = useAuth(); 

    // Handles modal closing and data refresh
    const handleProjectAdded = () => {
        fetchProjects(); // Refresh the list
    };


    // 🐛 FIX: The dependency array for useCallback is now empty ([]) because it only relies on 
    // the external constant (STATIC_PROJECTS), which is guaranteed not to change. 
    // This stops the function from being re-created on every render.
    const fetchProjects = useCallback(async () => {
        setLoading(true);
        let apiProjects = [];
        try {
            const res = await fetch('/api/projects'); 
            if (res.ok) {
                apiProjects = await res.json();
            } else {
                 console.warn("API projects failed to load, continuing with static data.");
            }
        } catch (error) {
            console.error("Failed to fetch projects from API:", error);
        } 
        
        // Combine static and dynamic projects
        const allProjects = [...apiProjects, ...STATIC_PROJECTS]; 
        
        // Final Project list, sorted by a potential dateAdded field (newest first)
        const sortedProjects = allProjects.sort((a, b) => {
            const dateA = a.dateAdded ? new Date(a.dateAdded) : new Date(0); 
            const dateB = b.dateAdded ? new Date(b.dateAdded) : new Date(0);
            return dateB - dateA; 
        });

        setProjects(sortedProjects);
        setLoading(false);
    }, []); // 🐛 FIX: Empty dependency array ensures stability.

    // Because fetchProjects is stable, the useEffect hook only runs on initial mount.
    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // ... (Rest of the component logic remains the same) ...
    
    const filteredProjects = activeFilter === 'All'
        ? projects 
        : projects.filter(project => project.tags.includes(activeFilter));

    return (
        <>
            <div className="project-Container">
                <div className="project-Content">
                    
                    {/* Admin Button to open the modal */}
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
                            onClose={() => setShowAdminModal(false)} // Pass a close handler
                        />
                    )}

                    {/* ... (rest of the Project-Tabs and Content) ... */}

                    <div className="Project-Main-Content">
                        {/* 🐛 FIX: The loading message will now only display once on initial load */}
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