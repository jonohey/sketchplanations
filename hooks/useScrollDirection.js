import { useEffect, useRef, useState } from 'react';

const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [isAtTop, setIsAtTop] = useState(true);
  const scrollDirectionRef = useRef('up');
  const isAtTopRef = useRef(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      const atTop = scrollY < 50;

      // More responsive threshold for direction changes
      if (direction !== scrollDirectionRef.current && Math.abs(scrollY - lastScrollY) > 2) {
        scrollDirectionRef.current = direction;
        setScrollDirection(direction);
        console.log('Scroll direction changed to:', direction, 'at scrollY:', scrollY);
      }
      
      if (atTop !== isAtTopRef.current) {
        isAtTopRef.current = atTop;
        setIsAtTop(atTop);
        console.log('isAtTop changed to:', atTop, 'at scrollY:', scrollY);
      }

      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []); // Empty dependency array to avoid re-registering

  return { scrollDirection, isAtTop };
};

export default useScrollDirection;