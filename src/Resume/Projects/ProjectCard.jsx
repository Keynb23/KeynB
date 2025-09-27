// src/Resume/Projects/ProjectCard.jsx

    import './Projects.css'; // Assuming styles are shared

// This component receives a project object and a click handler.
const ProjectCard = ({ project, onCardClick }) => {
    // Basic structure for display
    return (
        <div 
            className="Project-Card" 
            onClick={() => onCardClick(project)} 
            role="button"
            tabIndex="0"
        >
            {project.coverImage && (
                <img 
                    src={project.coverImage} 
                    alt={`Cover image for ${project.title}`} 
                    className="Project-Card-Image" 
                />
            )}
            <div className="Project-Card-Content">
                <h3 className="Project-Card-Title">{project.title || 'Untitled Project'}</h3>
                <p className="Project-Card-Summary">{project.summary || 'Click to see details.'}</p>
            </div>
        </div>
    );
};

export default ProjectCard;