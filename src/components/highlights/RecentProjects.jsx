// components/highlights/RecentProjects.jsx

import { useEffect, useState } from "react";
import "./RecentProjects.css"; 
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase"; 

const RecentProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRecentProjects() {
            setLoading(true);
            try {
                // Fetch the 3 most recent projects using Firestore query
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
        fetchRecentProjects();
    }, []);

    if (loading) {
        return (
            <div className="RecentProjects-Wrapper">
                <p className="RecentProjects-Message">Loading recent projects...</p>
            </div>
        );
    }

    if (!projects.length) {
        return (
            <div className="RecentProjects-Wrapper">
                <p className="RecentProjects-Message">No recent projects to display yet.</p>
            </div>
        );
    }

    return (
        <section className="RecentProjects-Wrapper">
            <h2 className="RecentProjects-Title">Recent Projects</h2> 
            <div className="RecentProjects-Grid">
                {projects.map((item) => (
                    <div key={item.id} className="Project-Card-Home">
                        {item.coverImage && ( 
                            <img
                                src={item.coverImage} 
                                alt={item.title}
                                className="Project-Image"
                            />
                        )}
                        <div className="Project-Content">
                            <h3 className="Project-Heading">{item.title}</h3>
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

export default RecentProjects;