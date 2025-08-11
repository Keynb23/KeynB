import { Link, NavLink } from 'react-router-dom';
import { useButtons } from '../../Btns-Context'; // Adjust path if needed
import ThemeBtn from '../../Buttons/ThemeBtn';   // Adjust path if needed
import './Nav.css';

const Navbar = () => {
  // The useButtons hook gives us access to the shared state and functions
  const { activeButton, setActiveButton } = useButtons();

  return (
    <header className="navbar-header">
      <nav className="navbar">
        {/* Logo/Home link */}
        <Link to="/" className="navbar-logo" onClick={() => setActiveButton('home')}>
          KeynB
        </Link>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/projects" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Projects
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/experience" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Experience
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/education" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Education
            </NavLink>
          </li>
        </ul>

        {/* Theme Toggle Button */}
        <div className="navbar-theme-toggle">
          <ThemeBtn />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
