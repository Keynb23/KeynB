// src/Resume/Projects/ProjectManager.jsx

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth'; 
import './ProjectManager.css'; 
import { CloseBtn } from '../../Buttons/Modal-Btns'; 

// The data structure for the form input
const initialProjectState = {
    title: '',
    summary: '', // Description of the project
    coverImage: '', // URL for the main screenshot
    media: [], // Array of objects { type: 'image'|'video', src: 'url' }
    tags: '', // Comma-separated list of tags
    source: '', // Source code link
    links: '', // Live site link
};

// Update the component signature to accept the onClose prop
const ProjectManager = ({ onProjectAdded, onClose }) => { 
    const { isAuthenticated } = useAuth(); 
    const [formData, setFormData] = useState(initialProjectState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Access control check
    if (!isAuthenticated) {
        if (onClose) onClose(); 
        return null; 
    }

    // ✅ FIX: This function now correctly saves the raw input 'value' to state.
    // We removed any .trim() call here, which was preventing spaces.
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setIsSubmitting(true);

        try {
            const newProject = {
                // Keep fields that can have spaces as-is
                title: formData.title,
                summary: formData.summary,
                // Trim fields where whitespace is not desired
                coverImage: formData.coverImage.trim(),
                source: formData.source.trim(),
                links: formData.links.trim(),
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                media: formData.media.length > 0 ? formData.media : [{ type: 'image', src: formData.coverImage.trim() }],
            };

            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // FUTURE: Add 'Authorization' token here
                },
                body: JSON.stringify(newProject),
            });

            if (!res.ok) {
                const errorBody = await res.json();
                throw new Error(errorBody.error || `Failed to create project: ${res.statusText}`);
            }

            setSuccess(true);
            setFormData(initialProjectState); // Reset form
            onProjectAdded(); // Callback to refresh project list in parent component
            
            // Close the modal 1 second after success to give visual feedback
            setTimeout(() => {
                onClose(); 
            }, 1000); 

        } catch (err) {
            console.error(err);
            setError(err.message || 'An error occurred during project creation.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // WRAPPER: Uses existing modal styling classes (.Project-Model, .modal-content)
    return (
        <div className="Project-Model" onClick={onClose}>
            {/* Prevent clicks inside the content from closing the modal */}
            <div className="modal-content admin-modal-content" onClick={(e) => e.stopPropagation()}>
                
                {/* Close Button */}
                <CloseBtn onClick={onClose} />
                
                <div className="Project-Manager-Container">
                    <h2>Add New Project (Admin Only)</h2>
                    {error && <p className="error-message">Error: {error}</p>}
                    {success && <p className="success-message">Project added successfully!</p>}
                    
                    <form onSubmit={handleSubmit} className="Project-Form">
                        
                        {/* Title */}
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
                        
                        {/* Description/Summary */}
                        <label htmlFor="summary">Description</label>
                        <textarea id="summary" name="summary" value={formData.summary} onChange={handleChange} required rows="5" />
                        
                        {/* Screenshot/Cover Image */}
                        <label htmlFor="coverImage">Cover Screenshot URL</label>
                        <input type="url" id="coverImage" name="coverImage" value={formData.coverImage} onChange={handleChange} required />

                        {/* Links to Live Site (Optional) */}
                        <label htmlFor="links">Live Site Link (Optional)</label>
                        <input type="url" id="links" name="links" value={formData.links} onChange={handleChange} />
                        
                        {/* Source Code Link (Optional) */}
                        <label htmlFor="source">Source Code Link (Optional)</label>
                        <input type="url" id="source" name="source" value={formData.source} onChange={handleChange} />
                        
                        {/* Tags */}
                        <label htmlFor="tags">Tags (Comma-separated, e.g., React, JavaScript, CSS)</label>
                        <input type="text" id="tags" name="tags" value={formData.tags} onChange={handleChange} required />
                        
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Adding Project...' : 'Add Project to Portfolio'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProjectManager;  