import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Home  from './Pages/Home';
import Exp from './Resume/XP/Exp';
import Projects from './Resume/Projects/Projects';
import Footer from './components/Footer';
import Contact from './components/Contact';
import EDU from './Resume/Edu/Edu';


function App() {
  return (
    <div className="app-container">
      {/* Navbar will appear on every page */}
      <Navbar />

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
