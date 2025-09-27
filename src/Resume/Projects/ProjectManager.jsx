import React, { useState, useCallback } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";

import { useAuth } from "../../hooks/useAuth.jsx";
import { CloseBtn } from "../../Buttons/Modal-Btns.jsx";
import { skillTags } from "../../data/projectsData.js"; // IMPORTED skillTags
import "./ProjectManager.css";

const initialProjectState = {
  title: "",
  summary: "",
  coverImage: "",
  screenshots: [],
  videos: [],
  tags: [],
  liveSiteLink: "",
  sourceCode: "",
};

const ProjectManager = ({ onProjectAdded, onClose }) => {
  const { isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState(initialProjectState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [currentTagInput, setCurrentTagInput] = useState("");
  const [filesToUpload, setFilesToUpload] = useState({
    coverImage: null,
    screenshots: [],
  });

  if (!isAuthenticated) {
    if (onClose) onClose();
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = useCallback((e) => {
    const { name, files } = e.target;

    if (name === "coverImage" && files.length > 0) {
      setFilesToUpload((prev) => ({ ...prev, coverImage: files[0] }));
    } else if (name === "screenshots" && files.length > 0) {
      setFilesToUpload((prev) => ({ ...prev, screenshots: Array.from(files) }));
    }
  }, []);

  // Helper function to add a tag from either input or click
  const addTag = useCallback(
    (tag) => {
      const cleanTag = tag.trim();
      if (cleanTag && !formData.tags.includes(cleanTag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, cleanTag],
        }));
        return true;
      }
      return false;
    },
    [formData.tags]
  );

  // Handler for adding tag from input field
  const handleAddTagFromInput = useCallback(() => {
    addTag(currentTagInput);
    setCurrentTagInput(""); // Clear input
  }, [currentTagInput, addTag]);

  // Handler for adding tag from the suggested list
  const handleAddTagFromSuggestion = useCallback(
    (tag) => {
      addTag(tag);
    },
    [addTag]
  );

  const handleRemoveTag = useCallback((tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  }, []);

  const handleTagKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddTagFromInput(); // Use the input handler
      }
    },
    [handleAddTagFromInput]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const newProject = {
        title: formData.title,
        description: formData.summary,
        coverImage: formData.coverImage.trim(),
        screenshots: formData.screenshots,
        videos: formData.videos,
        tags: formData.tags,
        liveSiteLink: formData.liveSiteLink.trim(),
        sourceCode: formData.sourceCode.trim(),

        dateAdded: serverTimestamp(),
        adminId: user.uid,
      };

      await addDoc(collection(db, "projects"), newProject);

      setSuccess(true);
      setFormData(initialProjectState);
      setFilesToUpload({ coverImage: null, screenshots: [] });
      onProjectAdded();

      setTimeout(() => onClose(), 1000);
    } catch (err) {
      console.error("Firestore Add Error:", err);
      setError("Failed to add project. Check console and Firebase Rules.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pm-Wrapper" onClick={onClose}>
      <div className="pm-modal-content" onClick={(e) => e.stopPropagation()}>
        <CloseBtn onClick={onClose} />
        <div className="pm-container">
          <h2>Add New Project (Admin Only)</h2>
          {error && <p className="alert-error">Error: {error}</p>}
          {success && (
            <p className="alert-success">Project added successfully!</p>
          )}

          <form onSubmit={handleSubmit} className="pm-form">
            <label htmlFor="title" className="pm-form-label">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="pm-form-input"
            />

            <label htmlFor="summary" className="pm-form-label">
              Description
            </label>
            <textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              required
              rows="5"
              className="form-textarea"
            />

            <fieldset className="pm-form-fieldset">
              <legend>Images/Videos (Add from Device)</legend>

              <label htmlFor="coverImage" className="pm-form-label">
                Cover Image
              </label>
              <input
                type="file"
                id="coverImage"
                name="coverImage"
                onChange={handleFileChange}
                accept="image/*"
                className="pm-form-input-file"
              />
              {filesToUpload.coverImage && (
                <p className="pm-file-preview-name">
                  Selected: {filesToUpload.coverImage.name}
                </p>
              )}

              <label htmlFor="screenshots" className="pm-form-label">
                Additional Images/Videos
              </label>
              <input
                type="file"
                id="screenshots"
                name="screenshots"
                onChange={handleFileChange}
                accept="image/*,video/*"
                multiple
                className="pm-form-input-file"
              />
              {filesToUpload.screenshots.length > 0 && (
                <p className="pm-file-preview-name">
                  Selected {filesToUpload.screenshots.length} file(s)
                </p>
              )}

              <label htmlFor="coverImageUrl" className="pm-form-image">
                Cover Image URL (Fallback)
              </label>
              <input
                type="url"
                id="coverImageUrl"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                className="pm-form-input"
              />
            </fieldset>

            {/* --- TAGS SECTION --- */}
            <label htmlFor="tagInput" className="pm-form-label">
              Tags
            </label>
            <div className="pm-tag-input-group">
              <input
                type="text"
                id="tagInput"
                value={currentTagInput}
                onChange={(e) => setCurrentTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type tag and press Enter"
                className="pm-form-input"
              />
              <button
                type="button"
                onClick={handleAddTagFromInput}
                className="pm-btn-tag-add"
                disabled={!currentTagInput.trim()}
              >
                Add
              </button>
            </div>

            {/* Suggested Tags to Pull From */}
            <div className="pm-suggested-tags-container">
              {skillTags.map((tag) => {
                // Ignore the "All" filter tag and tags already selected
                if (tag === "All" || formData.tags.includes(tag)) return null;

                return (
                  <span
                    key={tag}
                    className="pm-suggested-tag"
                    onClick={() => handleAddTagFromSuggestion(tag)}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>

            <label className="pm-form-label">
              Active Tags (Click to Remove)
            </label>
            <div className="pm-tag-container">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="pm-project-tag"
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag}
                  <span className="pm-tag-remove-btn">&times;</span>
                </span>
              ))}
            </div>
            {/* --- END TAGS SECTION --- */}

            <label htmlFor="liveSiteLink" className="pm-form-label">
              Live Site Link
            </label>
            <input
              type="url"
              id="liveSiteLink"
              name="liveSiteLink"
              value={formData.liveSiteLink}
              onChange={handleChange}
              className="pm-form-input"
            />

            <label htmlFor="sourceCode" className="pm-form-label">
              Source Code Link
            </label>
            <input
              type="url"
              id="sourceCode"
              name="sourceCode"
              value={formData.sourceCode}
              onChange={handleChange}
              className="pm-form-input"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="pm-btn-submit"
            >
              {isSubmitting ? "Adding Project..." : "Add Project to Portfolio"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectManager;
