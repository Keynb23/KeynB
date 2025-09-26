// src/Resume/Projects/ProjectManager.jsx

import { useState } from "react";
// Import Firestore functions
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase"; // Firestore database instance

import { useAuth } from "../../hooks/useAuth";
import './ProjectManager.css';
import { CloseBtn } from "../../Buttons/Modal-Btns";
import ProjectManager from './ProjectManager';

// The data structure for the form input is fine, but we'll simplify media input for now.
const initialProjectState = {
  title: "",
  summary: "", // Description of the project
  coverImage: "", // URL for the main screenshot
  screenshots: "", // Comma-separated URLs for screenshots
  videos: "", // Comma-separated URLs for videos (e.g., YouTube/Vimeo links)
  tags: "", // Comma-separated list of tags
  source: "", // Source code link
  links: "", // Live site link
};

// Update the component signature to accept the onClose prop
const ProjectManager = ({ onProjectAdded, onClose }) => {
  const { isAuthenticated, user } = useAuth(); // Get user for potential future use
  const [formData, setFormData] = useState(initialProjectState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Access control check
  if (!isAuthenticated) {
    // If the modal somehow opened without authentication, close it.
    if (onClose) onClose();
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      // 1. Prepare and clean the data for Firestore
      const newProject = {
        title: formData.title,
        summary: formData.summary,
        coverImage: formData.coverImage.trim(),
        source: formData.source.trim(),
        links: formData.links.trim(),

        // Convert comma-separated strings into arrays of trimmed values
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        screenshots: formData.screenshots
          .split(",")
          .map((url) => url.trim())
          .filter((url) => url),
        videos: formData.videos
          .split(",")
          .map((url) => url.trim())
          .filter((url) => url),

        // Add necessary metadata for sorting and security
        dateAdded: serverTimestamp(), // Use Firestore server timestamp
        adminId: user ? user.uid : null, // Record the admin user who created it (optional but good practice)
      };

      // 2. Call the Firebase Firestore API to add the document
      const docRef = await addDoc(collection(db, "projects"), newProject);

      setSuccess(true);
      setFormData(initialProjectState); // Reset form
      onProjectAdded(); // Callback to refresh project list in parent component

      // Close the modal 1 second after success to give visual feedback
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error("Firestore Add Error:", err);
      setError("Failed to add project. Check console and Firebase Rules.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // WRAPPER: Uses existing modal styling classes (.Project-Model, .modal-content)
  return (
    <div className="Project-Model" onClick={onClose}>
      {/* Prevent clicks inside the content from closing the modal */}
      <div
        className="modal-content admin-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <CloseBtn onClick={onClose} />

        <div className="Project-Manager-Container">
          <h2>Add New Project (Admin Only)</h2>
          {error && <p className="error-message">Error: {error}</p>}
          {success && (
            <p className="success-message">Project added successfully!</p>
          )}

          <form onSubmit={handleSubmit} className="Project-Form">
            {/* Title */}
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            {/* Description/Summary */}
            <label htmlFor="summary">Description</label>
            <textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              required
              rows="5"
            />

            {/* Tags */}
            <label htmlFor="tags">
              Tags (Comma-separated, e.g., React, CSS, Python)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              required
            />

            {/* Screenshot/Cover Image */}
            <label htmlFor="coverImage">Cover Screenshot URL</label>
            <input
              type="url"
              id="coverImage"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              required
            />

            {/* Multiple Screenshots (NEW FIELD) */}
            <label htmlFor="screenshots">
              Additional Screenshots (Comma-separated URLs)
            </label>
            <input
              type="text"
              id="screenshots"
              name="screenshots"
              value={formData.screenshots}
              onChange={handleChange}
              placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
            />

            {/* Multiple Videos (NEW FIELD) */}
            <label htmlFor="videos">Videos (Comma-separated URLs)</label>
            <input
              type="text"
              id="videos"
              name="videos"
              value={formData.videos}
              onChange={handleChange}
              placeholder="https://youtube.com/link1, https://vimeo.com/link2"
            />

            {/* Source Code Link (Optional) */}
            <label htmlFor="source">Source Code Link (Optional)</label>
            <input
              type="url"
              id="source"
              name="source"
              value={formData.source}
              onChange={handleChange}
            />

            {/* Links to Live Site (Optional) */}
            <label htmlFor="links">Live Site Link (Optional)</label>
            <input
              type="url"
              id="links"
              name="links"
              value={formData.links}
              onChange={handleChange}
            />

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding Project..." : "Add Project to Portfolio"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectManager;
