import { useState } from 'react';
import './Resume.css';
// You've got this part perfect!
import { projectsData, skillTags } from '../data/projectsData.js';

const Projects = () => {
  // State to keep track of the currently selected filter
  const [activeFilter, setActiveFilter] = useState('All');

  // Filter the projects based on the active tag
  const filteredProjects = activeFilter === 'All'
    ? projectsData // If 'All' is selected, show all projects
    : projectsData.filter(project => project.tags.includes(activeFilter));

  return (
    <>
      <div className="project-Container">
        <div className="project-Content">
          <div className="project-top">
            {/* Filter navigation bar */}
            <nav>
              <ul>
                {/* We now map over the skillTags array to create the filter buttons */}
                {skillTags.map(tag => (
                  <li
                    key={tag}
                    className={`Project-Tabs ${activeFilter === tag ? 'active' : ''}`}
                    onClick={() => setActiveFilter(tag)}
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="Project-Main-Content">
            <div className="Pro-Card-Rows">
              {/* And here we map over the filtered projects to create a card for each one */}
              {filteredProjects.map(project => (
                <div key={project.id} className="Project-card">
                  <img src={project.imageUrl} alt={`${project.title} screenshot`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {/* This is where you'd add the project title or video on hover */}
                </div>
              ))}
            </div>
            
            {/* The modal for displaying project details would go here */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Projects;
