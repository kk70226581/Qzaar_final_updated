import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scrolls to the top of the window when the pathname changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;