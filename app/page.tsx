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

const WorkspaceLayout = dynamic(
  () =>
    import('@/components/workspace/WorkspaceLayout').then((m) => ({
      default: m.WorkspaceLayout,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px',
          backgroundColor: '#1A0706',
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            border: '2px solid rgba(221,2,0,0.25)',
            borderTop: '2px solid #DD0200',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p
          style={{
            color: 'rgba(217,217,217,0.5)',
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.85rem',
            letterSpacing: '0.08em',
          }}
        >
          Initializing deep research workspace…
        </p>
      </div>
    ),
  }
);

export default function Page() {
  const phase = useResearchStore((s) => s.phase);

  return (
    <main style={{ backgroundColor: '#1A0706', minHeight: '100vh' }}>
      {/* Intro Overlay — client only, lazy loaded */}
      <IntroOverlay />

      {/* Phase-gated screens */}
      <AnimatePresence mode="wait">
        {(phase === 'landing' || phase === 'intro') && (
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
            <WorkspaceLayout />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
