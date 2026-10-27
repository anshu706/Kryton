'use client';

import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { useResearchStore } from '@/store/useResearchStore';
import { LandingScreen } from '@/components/search/LandingScreen';

// Lazy-load heavy components
const IntroOverlay = dynamic(
  () =>
    import('@/components/intro/IntroOverlay').then((m) => ({
      default: m.IntroOverlay,
    })),
  { ssr: false }
);

// WorkspaceLayout will be built in Phase 4
const WorkspacePlaceholder = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '16px',
    }}
  >
    <div
      style={{
        width: '48px',
        height: '48px',
        border: '2px solid rgba(30,107,255,0.3)',
        borderTop: '2px solid #1E6BFF',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <p
      style={{
        color: 'rgba(255,255,255,0.4)',
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.875rem',
        letterSpacing: '0.08em',
      }}
    >
      Initializing workspace…
    </p>
  </motion.div>
);

export default function Page() {
  const phase = useResearchStore((s) => s.phase);

  return (
    <main
      style={{ backgroundColor: '#05070D', minHeight: '100vh' }}
    >
      {/* Intro — client only, lazy loaded */}
      <IntroOverlay />

      {/* Phase-gated screens */}
      <AnimatePresence mode="wait">
        {phase === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <LandingScreen />
          </motion.div>
        )}

        {phase === 'workspace' && (
          <motion.div
            key="workspace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <WorkspacePlaceholder />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
