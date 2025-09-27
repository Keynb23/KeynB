// src/Resume/Projects/ProjectModal.jsx 

import React from 'react';
import { doc, deleteDoc } from "firebase/firestore"; // Import Firestore delete functions
import { db } from "../../lib/firebase"; 
import { useAuth } from "../../hooks/useAuth.jsx"; // To check if user is logged in
import { CloseBtn } from "../../Buttons/Modal-Btns.jsx"; 
// import other components for displaying project details...

// ProjectModal will now need the entire project object and a callback 
// to refresh the project list in the parent component.
const ProjectModal = ({ project, onClose, onProjectDeleted }) => {
    const { isAuthenticated } = useAuth();
    
    // Safety check to ensure we have the project ID
    if (!project || !project.id) {
        return null; 
    }

    const handleDelete = async () => {
        if (!isAuthenticated) {
            alert("You must be logged in to delete projects.");
            return;
        }

        const confirmDelete = window.confirm(`Are you sure you want to delete the project: "${project.title}"?`);
        
        if (confirmDelete) {
            try {
                // Get the document reference using the project ID
                const projectRef = doc(db, "projects", project.id);
                
                // Perform the deletion
                await deleteDoc(projectRef);

                alert("Project deleted successfully!");
                onClose(); // Close the modal
                
                // Call the callback function to update the parent component's list
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
        <div className="Project-Model" onClick={onClose}>
            <div 
                className="modal-content project-details-content"
                onClick={(e) => e.stopPropagation()}
            >
                <CloseBtn onClick={onClose} />
                
                {/* // ADMIN DELETE BUTTON (The New Addition)*/}
                {isAuthenticated && (
                    <div className="admin-actions">
                        <button onClick={handleDelete} className="btn-delete">
                            Delete Project
                        </button>
                        {/* You would also put the "Edit" button here */}
                        <button className="btn-edit">
                            Edit Project
                        </button>
                    </div>
                )}
                
                {/* Project Content Display (You'll have your existing JSX here) */}
                <h1>{project.title}</h1>
                <p>{project.description}</p>
                {/* ... rest of your project display ... */}

            </div>
        </div>
    );
};

export default ProjectModal;