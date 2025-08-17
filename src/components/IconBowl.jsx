import { useState, useRef, useEffect } from 'react';
import './IconBowl.css';

// --- Import all your icon images directly ---
import CodeTIcon from '../assets/Cred/CodeT.png';
import CssIcon from '../assets/Cred/Css.svg';
import JsIcon from '../assets/Cred/JS.svg';
import PostmanIcon from '../assets/Cred/Postman.svg';
import SQLIcon from '../assets/Cred/SQL.svg';
import TSIcon from '../assets/Cred/TS.svg';
import ThreejsIcon from '../assets/Cred/Threejs.svg';
import ReactIcon from '../assets/Cred/logo.svg';
import PythonIcon from '../assets/Cred/python.svg';
import BlenderIcon from '../assets/Cred/Blender.svg';
import UnrealEngineIcon from '../assets/Cred/UE5.png';

// --- Physics & Interaction Constants ---
const ICON_SIZE = 50;
const DAMPING = 0.98; // Air resistance
const MOUSE_RADIUS = 80; // The radius around the mouse that affects icons
const MOUSE_PUSH_STRENGTH = 0.5; // How strongly the mouse pushes icons

const IconBowl = () => {
  const bowlRef = useRef(null);
  const [icons, setIcons] = useState([]);
  const animationFrameId = useRef(null);
  const mousePos = useRef({ x: -999, y: -999 }); // Start mouse off-screen

  // Initialize icons
  useEffect(() => {
    const bowlElement = bowlRef.current;
    if (!bowlElement) return;

    const allIconSrcs = [
      CodeTIcon, CssIcon, JsIcon, PostmanIcon, SQLIcon, TSIcon,
      ThreejsIcon, ReactIcon, PythonIcon, BlenderIcon, UnrealEngineIcon,
    ];

    const initialIcons = allIconSrcs.map((src, index) => ({
      id: index,
      src,
      radius: ICON_SIZE / 2,
      x: ICON_SIZE + Math.random() * (bowlElement.offsetWidth - ICON_SIZE * 2),
      y: ICON_SIZE + Math.random() * (bowlElement.offsetHeight - ICON_SIZE * 2),
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
    }));
    setIcons(initialIcons);
  }, []);

  // Main Animation Loop
  useEffect(() => {
    const updatePhysics = () => {
      const bowlRect = bowlRef.current.getBoundingClientRect();

      setIcons(currentIcons => {
        let newIcons = currentIcons.map(icon => ({ ...icon }));

        // Update physics for ALL icons
        newIcons.forEach(icon => {
          // --- NEW: Apply mouse repulsion force ---
          const dx = icon.x - mousePos.current.x;
          const dy = icon.y - mousePos.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = icon.radius + MOUSE_RADIUS;
        
          if (dist < minDist) {
            const angle = Math.atan2(dy, dx);
            const force = (minDist - dist) / minDist; // Force is stronger when closer
            
            // Push icon away from mouse
            icon.vx += Math.cos(angle) * force * MOUSE_PUSH_STRENGTH;
            icon.vy += Math.sin(angle) * force * MOUSE_PUSH_STRENGTH;
          }
          
          // Apply damping (friction)
          icon.vx *= DAMPING;
          icon.vy *= DAMPING;
          
          // Update position
          icon.x += icon.vx;
          icon.y += icon.vy;

          // Wall collisions
          if (icon.x - icon.radius < 0) { icon.x = icon.radius; icon.vx *= -0.9; }
          if (icon.x + icon.radius > bowlRect.width) { icon.x = bowlRect.width - icon.radius; icon.vx *= -0.9; }
          if (icon.y - icon.radius < 0) { icon.y = icon.radius; icon.vy *= -0.9; }
          if (icon.y + icon.radius > bowlRect.height) { icon.y = bowlRect.height - icon.radius; icon.vy *= -0.9; }
        });

        // Icon-to-icon collisions
        for (let i = 0; i < newIcons.length; i++) {
          for (let j = i + 1; j < newIcons.length; j++) {
            const iconA = newIcons[i];
            const iconB = newIcons[j];
            const dx = iconB.x - iconA.x;
            const dy = iconB.y - iconA.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = iconA.radius + iconB.radius;

            if (distance > 0 && distance < minDistance) {
              const angle = Math.atan2(dy, dx);
              const overlap = minDistance - distance;
              const moveX = (overlap / 2) * Math.cos(angle);
              const moveY = (overlap / 2) * Math.sin(angle);
              
              iconA.x -= moveX;
              iconA.y -= moveY;
              iconB.x += moveX;
              iconB.y += moveY;
              
              const tempVx = iconA.vx;
              const tempVy = iconA.vy;
              iconA.vx = iconB.vx;
              iconA.vy = iconB.vy;
              iconB.vx = tempVx;
              iconB.vy = tempVy;
            }
          }
        }
        return newIcons;
      });

      animationFrameId.current = requestAnimationFrame(updatePhysics);
    };

    animationFrameId.current = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrameId.current);
  }, []);

  const handleMouseMove = (e) => {
    const rect = bowlRef.current.getBoundingClientRect();
    mousePos.current.x = e.clientX - rect.left;
    mousePos.current.y = e.clientY - rect.top;
  };

  const handleMouseLeave = () => {
      // Move mouse far away so it doesn't affect icons
      mousePos.current = { x: -9999, y: -9999 };
  };

  return (
    <div 
        className="Icon-Bowl" 
        ref={bowlRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
    >
      {icons.map(icon => (
        <img
          key={icon.id}
          src={icon.src}
          className="icon-instance"
          alt=""
          style={{
            transform: `translate(${icon.x - icon.radius}px, ${icon.y - icon.radius}px)`,
          }}
        />
      ))}
    </div>
  );
};

export default IconBowl;