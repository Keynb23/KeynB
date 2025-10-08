// components/highlights/RecentProjects.jsx

import { useEffect, useState, useCallback } from "react";
// ⭐ Import useNavigate from react-router-dom
import { useNavigate } from 'react-router-dom'; 
import "./RecentProjects.css";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";

const RecentProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // ⭐ Initialize useNavigate hook
  const navigate = useNavigate();
  
  // Define the common navigation target
  const projectsPagePath = "/projects"; 

  // Use useCallback to memoize the click handler
  const handleCardClick = useCallback(() => {
    // Redirects the user to the main projects page
    navigate(projectsPagePath);
  }, [navigate]);
  // ---------------------------------------------


  // Effect to fetch projects (remains the same)
  useEffect(() => {
    async function fetchRP() {
      setLoading(true);
      try {
        const projectsCollection = collection(db, "projects");
        const q = query(
          projectsCollection,
          orderBy("dateAdded", "desc"),
          limit(3)
        );
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch recent projects from Firestore:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRP();
  }, []);

  // Automatic Slide Show Logic (remains the same)
  useEffect(() => {
    if (projects.length > 1) {
      const duration = isPaused ? 7000 : 3000; 

      const intervalId = setInterval(() => {
        if (isPaused) {
          setIsPaused(false);
        } else {
          setCurrentIndex((prevIndex) =>
            prevIndex === projects.length - 1 ? 0 : prevIndex + 1
          );
        }
      }, duration);

      return () => clearInterval(intervalId);
    }
  }, [projects, isPaused]);

  // Handler for the indicator dots (remains the same)
  const handleIndicatorClick = (index) => {
    setCurrentIndex(index);
    setIsPaused(true);
  };
  // ---------------------------------------------

  if (loading) {
    return (
      <section className="RP-Wrapper">
        <p className="RP-Message">Loading recent projects...</p>
      </section>
    );
  }

  if (!projects.length) {
    return (
      <section className="RP-Wrapper">
        <p className="RP-Message">No recent projects to display yet.</p>
      </section>
    );
  }

  return (
    <section className="RP-Wrapper">
      <h2 className="RP-Title">Recent Projects</h2>

      <div className="RP-Carousel-Container">
        <div
          className="RP-Carousel"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {projects.map((item) => (
            // ⭐ Attach the onClick handler and set style for cursor
            <article 
              key={item.id} 
              className="RP-Card"
              onClick={handleCardClick}
              style={{ cursor: 'pointer' }} // Visual hint for users
            >
              {item.coverImage && (
                <div className="RP-Media">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="RP-Image"
                  />
                  {/* ... other content ... */}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>

      <div className="RP-Indicators">
        {projects.map((_, index) => (
          <button
            key={index}
            className={`RP-Indicator ${index === currentIndex ? "active" : ""}`}
            onClick={() => handleIndicatorClick(index)} 
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default RecentProjects;