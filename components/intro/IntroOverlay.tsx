'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntro } from '@/hooks/useIntro';
import { KNodeGraph } from './KNodeGraph';

export function IntroOverlay() {
  const { hasSeenIntro, skipIntro, completeIntro } = useIntro();
  const autoCompleteRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (hasSeenIntro === false) {
      // Auto-complete after 2.8 seconds if not skipped
      autoCompleteRef.current = setTimeout(() => {
        completeIntro();
      }, 2800);
    }
    return () => {
      if (autoCompleteRef.current) clearTimeout(autoCompleteRef.current);
    };
  }, [hasSeenIntro, completeIntro]);

  // While checking sessionStorage, render nothing (prevents flash)
  if (hasSeenIntro === null) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#1A0706',
          zIndex: 100,
        }}
      />
    );
  }

  if (hasSeenIntro === true) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="intro"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#1A0706',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        {/* K Node Graph Canvas */}
        <KNodeGraph onComplete={completeIntro} />

        {/* Skip button — appears quickly */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          onClick={skipIntro}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'rgba(85,16,13,0.4)',
            border: '1px solid rgba(221,2,0,0.25)',
            color: 'rgba(217,217,217,0.7)',
            padding: '8px 20px',
            borderRadius: '100px',
            cursor: 'pointer',
            fontSize: '13px',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            letterSpacing: '0.04em',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.color = '#D9D9D9';
            (e.target as HTMLButtonElement).style.borderColor =
              'rgba(221,2,0,0.7)';
            (e.target as HTMLButtonElement).style.background =
              'rgba(221,2,0,0.2)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.color =
              'rgba(217,217,217,0.7)';
            (e.target as HTMLButtonElement).style.borderColor =
              'rgba(221,2,0,0.25)';
            (e.target as HTMLButtonElement).style.background =
              'rgba(85,16,13,0.4)';
          }}
        >
          Skip intro
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
