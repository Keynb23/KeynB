// Resume/Projects/ProjectManger.jsx

import { useState, useCallback } from "react";
// 1. Storage Imports
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// 2. Firebase Config and Services
import { db, storage } from "../../lib/firebase";

import { useAuth } from "../../hooks/useAuth.jsx";
import { CloseBtn } from "../../Buttons/Modal-Btns.jsx";
import { skillTags } from "../../data/projectsData.js";
import "./ProjectManager.css";

const initialProjectState = {
  title: "",
  summary: "",
  coverImage: "", // This will store the URL
  screenshots: [], // This will store an array of URLs
  videos: [],
  tags: [],
  liveSiteLink: "",
  sourceCode: "",
};

// ----------------------------------------------------
// 🔥 HELPER FUNCTION FOR FILE UPLOAD
// ----------------------------------------------------
/**
 * Uploads a file to Firebase Storage and returns its public URL.
 * @param {File} file - The file object to upload.
 * @param {string} path - The storage path (e.g., "projectCovers" or "screenshots").
 * @returns {Promise<string>} The public download URL or an empty string on error/no file.
 */
const uploadFile = async (file, path) => {
  if (!file) return "";

  // Create a unique file name
  const fileName = `${Date.now()}_${file.name}`;
  const storageRef = ref(storage, `${path}/${fileName}`);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error(`Error uploading file to ${path}:`, error);
    throw new Error(`Failed to upload ${file.name}.`);
  }
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
    screenshots: [], // Array of File objects
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
      // Optional: Clear the URL input if a file is selected
      setFormData((prev) => ({ ...prev, coverImage: "" }));
    } else if (name === "screenshots" && files.length > 0) {
      setFilesToUpload((prev) => ({ ...prev, screenshots: Array.from(files) }));
      // Optional: Clear the screenshots array if files are selected
      setFormData((prev) => ({ ...prev, screenshots: [] }));
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

  // ----------------------------------------------------
  // 🔥 UPDATED SUBMIT HANDLER
  // ----------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    let coverImageUrl = formData.coverImage.trim(); // Start with the manual URL fallback
    let screenshotUrls = formData.screenshots; // Start with the manual URLs (if applicable)

    try {
      // --- 1. UPLOAD COVER IMAGE ---
      if (filesToUpload.coverImage) {
        coverImageUrl = await uploadFile(
          filesToUpload.coverImage,
          "projectCovers"
        );
      }

      // --- 2. UPLOAD SCREENSHOTS (MULTIPLE FILES) ---
      if (filesToUpload.screenshots.length > 0) {
        const uploadPromises = filesToUpload.screenshots.map((file) =>
          uploadFile(file, "projectScreenshots")
        );
        screenshotUrls = await Promise.all(uploadPromises);
        // Filter out any empty strings if an upload failed, though `uploadFile` throws an error
        screenshotUrls = screenshotUrls.filter((url) => url);
      }

      // --- 3. PREPARE FIRESTORE DOCUMENT ---
      const newProject = {
        title: formData.title,
        description: formData.summary,
        // Save the resulting URL (from file upload or the URL fallback)
        coverImage: coverImageUrl,
        screenshots: screenshotUrls,
        videos: formData.videos, // Note: You'd upload videos similarly if needed
        tags: formData.tags,
        liveSiteLink: formData.liveSiteLink.trim(),
        sourceCode: formData.sourceCode.trim(),

        dateAdded: serverTimestamp(),
        adminId: user.uid,
      };

      // --- 4. SAVE DATA TO FIRESTORE ---
      await addDoc(collection(db, "projects"), newProject);

      setSuccess(true);
      setFormData(initialProjectState);
      setFilesToUpload({ coverImage: null, screenshots: [] });
      onProjectAdded();

      setTimeout(() => onClose(), 1000);
    } catch (err) {
      console.error("Submission Error:", err);
      // Display a more helpful error if it came from the upload
      setError(
        err.message.includes("upload")
          ? err.message
          : "Failed to add project. Check console and Firebase Rules."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // ... (JSX render remains the same)
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
            {/* Title, Description, Links, Tags remain the same */}

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
