'use client';

import { useEffect, useState } from 'react';
import { useResearchStore } from '@/store/useResearchStore';

const INTRO_KEY = 'kryton-intro-seen';

export function useIntro() {
  const setPhase = useResearchStore((s) => s.setPhase);
  const [hasSeenIntro, setHasSeenIntro] = useState<boolean | null>(null);

  useEffect(() => {
    const seen = sessionStorage.getItem(INTRO_KEY) === 'true';
    setHasSeenIntro(seen);
    if (seen) {
      setPhase('landing');
    }
  }, [setPhase]);

  const completeIntro = () => {
    sessionStorage.setItem(INTRO_KEY, 'true');
    setHasSeenIntro(true);
    setPhase('landing');
  };

  const skipIntro = () => {
    completeIntro();
  };

  return { hasSeenIntro, completeIntro, skipIntro };
}
