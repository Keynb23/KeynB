import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Home  from './Pages/Home';
import Exp from './Resume/XP/Exp';
import Projects from './Resume/Projects/Projects';
import Footer from './components/Footer';
import Contact from './components/Contact';
import EDU from './Resume/Edu/Edu';
import SculptingCanvas from './components/SculptingCanvas';

import { useEffect } from 'react';

function App() {

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if the key pressed is the spacebar (keyCode 32)
      if (event.keyCode === 32) {
        // Prevent the default action (scrolling)
        event.preventDefault();
      }
    };

    // Add the event listener to the window object
    window.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // The empty dependency array ensures this effect runs only once


  return (
    <div className="app-container">
      {/* Navbar will appear on every page */}
      <Navbar />
      <SculptingCanvas/>

      {/* Routes define the different pages of your application */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/experience" element={<Exp />} />
        <Route path="/education" element={<EDU/>} />
        <Route path="/contact" element={<Contact/>}/>
      </Routes>
      <Footer/>

    </div>
  );
}

export default App;
