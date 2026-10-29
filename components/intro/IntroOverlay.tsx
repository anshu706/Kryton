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
      // Auto-complete after 4.5 seconds if not skipped
      autoCompleteRef.current = setTimeout(() => {
        completeIntro();
      }, 4500);
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
          backgroundColor: '#05070D',
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
          backgroundColor: '#05070D',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        {/* K Node Graph Canvas */}
        <KNodeGraph onComplete={completeIntro} />

        {/* Skip button — appears after 1s */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          onClick={skipIntro}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.6)',
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
            (e.target as HTMLButtonElement).style.color = '#FFFFFF';
            (e.target as HTMLButtonElement).style.borderColor =
              'rgba(30,107,255,0.5)';
            (e.target as HTMLButtonElement).style.background =
              'rgba(30,107,255,0.15)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.color =
              'rgba(255,255,255,0.6)';
            (e.target as HTMLButtonElement).style.borderColor =
              'rgba(255,255,255,0.15)';
            (e.target as HTMLButtonElement).style.background =
              'rgba(255,255,255,0.08)';
          }}
        >
          Skip intro
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
