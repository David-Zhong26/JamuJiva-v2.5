import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** When landing on `/` with a hash (e.g. from another route), scroll to the section. */
const HashScroll: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/') return;
    const id = location.hash.replace(/^#/, '');
    if (!id) return;
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    });
  }, [location.pathname, location.hash]);

  return null;
};

export default HashScroll;
