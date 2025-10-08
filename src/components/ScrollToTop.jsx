// components/ScrollToTop.jsx

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // Get the current location object from React Router
  const { pathname } = useLocation();

  useEffect(() => {
    // When the pathname changes (i.e., a new page loads), 
    // scroll the browser window to the top.
    window.scrollTo(0, 0);
  }, [pathname]); // Rerun this effect every time the pathname changes

  // This component doesn't render anything, it's just for side effects (scrolling)
  return null;
};

export default ScrollToTop;