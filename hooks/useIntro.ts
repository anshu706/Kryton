'use client';

import { useEffect, useState, useCallback } from 'react';
import { useResearchStore } from '@/store/useResearchStore';

const INTRO_KEY = 'kryton-intro-seen';

export function useIntro() {
  const setPhase = useResearchStore((s) => s.setPhase);
  const [hasSeenIntro, setHasSeenIntro] = useState<boolean | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const seen =
          typeof window !== 'undefined' &&
          (localStorage.getItem(INTRO_KEY) === 'true' ||
            sessionStorage.getItem(INTRO_KEY) === 'true');
        setHasSeenIntro(seen);
        if (seen) {
          setPhase('landing');
        }
      } catch {
        setHasSeenIntro(true);
        setPhase('landing');
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [setPhase]);

  const completeIntro = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(INTRO_KEY, 'true');
        sessionStorage.setItem(INTRO_KEY, 'true');
      }
    } catch {
      // storage disabled/quota
    }
    setHasSeenIntro(true);
    setPhase('landing');
  }, [setPhase]);

  const skipIntro = useCallback(() => {
    completeIntro();
  }, [completeIntro]);

  return { hasSeenIntro, completeIntro, skipIntro };
}

