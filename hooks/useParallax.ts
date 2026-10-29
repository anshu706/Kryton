'use client';

import { useEffect, useRef } from 'react';

export function useParallax(strength = 20) {
  const xRef = useRef(0);
  const yRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      xRef.current = ((e.clientX - cx) / cx) * strength;
      yRef.current = ((e.clientY - cy) / cy) * strength;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [strength]);

  return { xRef, yRef };
}
