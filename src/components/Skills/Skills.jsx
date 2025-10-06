// components/Skills/Skills.jsx

import { useEffect } from 'react'; 
import './Skills.css';

// Define the total duration for the animation to complete in milliseconds.
const TOTAL_ANIMATION_TIME_MS = 3800; 

const Skills = ({ onAnimationEnd }) => { 

    useEffect(() => {
        const timer = setTimeout(() => {
            if (onAnimationEnd) {
                onAnimationEnd();
            }
        }, TOTAL_ANIMATION_TIME_MS);

        return () => clearTimeout(timer);

    }, [onAnimationEnd]);


    const items = [
        "PYTHON", "NODE.JS", "EXPO GO", "BOOTSTRAP", "TAILWINDCSS", "NATIVEWIND", "AGILE",
        "DATA STRUCTURES", "ALGORITHMS", "HTML", "JAVASCRIPT", "TYPESCRIPT", "JSX", "TSX",
        "REACT", "REACT NATIVE", "REACT THREE JS", "SQL", "POSTMAN", "BLENDER",
        "UNREAL ENGINE", "HOUDINI VFX", "RIGGING", "ANIMATIONS", "SCULPTING", "UX/UI",
        "PYTHON", "NODE.JS", "EXPO GO", "BOOTSTRAP", "TAILWINDCSS", "NATIVEWIND", "AGILE",
        "DATA STRUCTURES", "ALGORITHMS", "HTML", "CSS", "JAVASCRIPT", "TYPESCRIPT", "JSX",
        "TSX", "REACT", "REACT NATIVE", "REACT THREE JS", "SQL", "POSTMAN", "BLENDER",
        "UNREAL ENGINE"
    ];

    return (
        <div className="stuck-grid">
            {/* The special item - given i=0 to ensure immediate start (as per CSS) */}
            <div className="grid-item special" style={{'--i': 0}}> 
                <b>Key'n Brosdahl</b>
            </div>

            {/* Map over the other items */}
            {items.map((item, index) => {
                // index + 1 ensures the rest of the items have a non-zero delay
                return (
                    <div
                        key={index}
                        className="grid-item"
                        style={{ '--i': index + 1 }} 
                    >
                        {item}
                    </div>
                );
            })}
        </div>
    );
};

export default Skills;