// components/highlights/RecentProjects.jsx

import { useEffect, useState } from "react";
import "./RecentProjects.css"; 

// Renamed from Highlights to RecentProjects
const RecentProjects = () => {
  const [projects, setProjects] = useState([]); // Renamed from highlights to projects
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentProjects() {
      try {
        // Fetch only the 3 most recent projects for the homepage
        // The backend should handle the sorting and limiting (e.g., LIMIT 3)
        const res = await fetch("/api/projects/latest"); 
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch recent projects:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRecentProjects();
  }, []);

  if (loading) {
    return (
      <div className="RecentProjects-Wrapper">
        <p className="RecentProjects-Message">Loading recent projects...</p>
      </div>
    );
  }

  // Use projects for the check
  if (!projects.length) {
    return (
      <div className="RecentProjects-Wrapper">
        <p className="RecentProjects-Message">No recent projects to display yet.</p>
      </div>
    );
  }

  return (
    // Renamed section class
    <section className="RecentProjects-Wrapper">
      <h2 className="RecentProjects-Title">Recent Projects</h2> 
      <div className="RecentProjects-Grid">
        {projects.map((item) => (
          <div key={item.id} className="Project-Card-Home">
            {/* Assuming your project object has imageUrl, title, description, and source/link */}
            {item.coverImage && ( 
              <img
                src={item.coverImage} 
                alt={item.title}
                className="Project-Image"
              />
            )}
            <div className="Project-Content">
              <h3 className="Project-Heading">{item.title}</h3>
              {/* Using a summary or short description for the homepage */}
              <p className="Project-Description">{item.summary}</p> 
              {item.source && (
                <a
                  href={item.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="Project-Link"
                >
                  Source Code →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Renamed export
export default RecentProjects;