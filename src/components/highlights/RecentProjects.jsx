// components/highlights/RecentProjects.jsx

import { useEffect, useState } from "react";
import "./RecentProjects.css";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const RecentProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === projects.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? projects.length - 1 : prevIndex - 1
    );
  };

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
        <button
          className="RP-Nav-Button RP-Prev"
          onClick={handlePrev}
          aria-label="Previous Project"
        >
          <FaChevronLeft />
        </button>

        <div 
          className="RP-Carousel" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {projects.map((item) => (
            <article key={item.id} className="RP-Card">
              {item.coverImage && (
                <div className="RP-Media">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="RP-Image"
                  />
                </div>
              )}
            </article>
          ))}
        </div>

        <button
          className="RP-Nav-Button RP-Next"
          onClick={handleNext}
          aria-label="Next Project"
        >
          <FaChevronRight />
        </button>
      </div>

      <div className="RP-Indicators">
        {projects.map((_, index) => (
          <button
            key={index}
            className={`RP-Indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default RecentProjects;