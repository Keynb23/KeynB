import { useEffect } from "react";

// Update the function signature to receive props, which will contain 'children'
export default function MouseTrail({ children }) {
  useEffect(() => {
    const trail = [];
    const trailLength = 20;

    const createDot = () => {
      const dot = document.createElement("div");
      dot.className = "mouse-trail-dot";
      document.body.appendChild(dot);
      return dot;
    };

    // Initialize dots
    for (let i = 0; i < trailLength; i++) {
      trail.push(createDot());
    }

    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      trail.forEach((dot, i) => {
        const next = trail[i + 1] || { style: { left: mouseX, top: mouseY } };
        // Note: Your positioning logic is already quite advanced for a simple fix,
        // so we'll leave it as is, assuming it's correct for your desired effect.
        dot.style.left = `${(parseFloat(dot.style.left) || mouseX) + (parseFloat(next.style.left) - (parseFloat(dot.style.left) || mouseX)) * 0.3}px`;
        dot.style.top = `${(parseFloat(dot.style.top) || mouseY) + (parseFloat(next.style.top) - (parseFloat(dot.style.top) || mouseY)) * 0.3}px`;
      });
      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove);
    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      trail.forEach((dot) => dot.remove());
    };
  }, []);

  // 👈 THE CRUCIAL FIX: Return the children
  return children;
}
