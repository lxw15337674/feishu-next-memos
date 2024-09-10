import isBrowser from '@/utils/isBrower';
import { useState, useEffect } from 'react';

enum TailwindResponsiveWidth {
  md = 768,
}

const useIsMobile = () => {
  const [width, setWidth] = useState(isBrowser() ? window?.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width < TailwindResponsiveWidth.md; // Return true if mobile (width less than md breakpoint)
};

export default useIsMobile;
