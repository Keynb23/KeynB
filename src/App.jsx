import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Home  from './Pages/Home';
import Edu from './Resume/Edu';
import Exp from './Resume/Exp';
import Projects from './Resume/Projects';

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
        <Route path="/education" element={<Edu />} />
      </Routes>
    </div>
  );
}

export default App;
