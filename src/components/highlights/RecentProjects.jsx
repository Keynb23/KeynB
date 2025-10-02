// components/highlights/RecentProjects.jsx

import { useEffect, useState } from "react";
import "./RecentProjects.css";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Import icons for navigation

const RecentProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  // State to track the currently visible project index
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // ... (fetchRP logic remains unchanged)
    async function fetchRP() {
      setLoading(true);
      try {
        // Fetch the 3 most recent projects using Firestore query
        const projectsCollection = collection(db, "projects");
        const q = query(
          projectsCollection,
          // Assuming 'dateAdded' is a field you set when creating the project
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

  // Function to handle next project (wraps around)
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === projects.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to handle previous project (wraps around)
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? projects.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    // ... (loading state remains unchanged)
    return (
      <div className="RP-Wrapper">
        <p className="RP-Message">Loading recent projects...</p>
      </div>
    );
  }

  if (!projects.length) {
    // ... (no projects state remains unchanged)
    return (
      <div className="RP-Wrapper">
        <p className="RP-Message">No recent projects to display yet.</p>
      </div>
    );
  }

  return (
    <section className="RP-Wrapper">
      <h2 className="RP-Title">Recent Projects</h2>

      {/* New Carousel Container that holds all the elements */}
      <div className="RP-Carousel-Container">
        {/* Navigation Buttons */}
        <button
          className="RP-Nav-Button RP-Prev"
          onClick={handlePrev}
          aria-label="Previous Project"
        >
          <FaChevronLeft />
        </button>

        {/* The Carousel Track (The list of projects) */}
        <div className="RP-Carousel">
          {projects.map((item, index) => {
            // Calculate the card state relative to the current index
            const isCurrent = index === currentIndex;
            const isNext = index === (currentIndex + 1) % projects.length;
            // Use modulo for 'prev' to handle wrapping from index 0
            const isPrev =
              index === (currentIndex - 1 + projects.length) % projects.length;

            let carouselState = "hidden";
            if (isCurrent) {
              carouselState = "current";
            } else if (isNext) {
              carouselState = "next";
            } else if (isPrev) {
              carouselState = "prev";
            }

            return (
              <div
                key={item.id}
                // Apply the data-attribute for CSS styling
                data-carousel-state={carouselState}
                className="RP-Card-Home"
              >
                {item.coverImage && (
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="RP-Image"
                  />
                )}
                <div className="RP-Content">
                  <h3 className="RP-Heading">{item.title}</h3>
                  <p className="RP-Description">{item.summary}</p>
                  {item.source && (
                    <a
                      href={item.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="RP-Link"
                    >
                      Source Code →
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          className="RP-Nav-Button RP-Next"
          onClick={handleNext}
          aria-label="Next Project"
        >
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
};
export default RecentProjects;
