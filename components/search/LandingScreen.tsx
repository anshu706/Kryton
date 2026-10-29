'use client';

import { motion } from 'framer-motion';
import { ParticleCanvas } from '@/components/search/ParticleCanvas';
import { SearchBar } from '@/components/search/SearchBar';

export function LandingScreen() {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        overflow: 'hidden',
      }}
    >
      {/* Particle background */}
      <ParticleCanvas />

      {/* Radial blue glow from center */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(30,107,255,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '40px',
          width: '100%',
          maxWidth: '800px',
        }}
      >
        {/* Logo + Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          {/* Mini K logo */}
          <KLogo />

          <h1
            className="brand-title"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              letterSpacing: '0.15em',
              background:
                'linear-gradient(135deg, #FFFFFF 30%, #1E6BFF 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1,
            }}
          >
            KRYTON
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              color: 'rgba(255,255,255,0.35)',
              fontSize: '0.9rem',
              letterSpacing: '0.25em',
              fontFamily: "'Inter', sans-serif",
              textTransform: 'uppercase',
            }}
          >
            Research, Illuminated.
          </motion.p>
        </motion.div>

        {/* Search bar */}
        <SearchBar />

      </div>
    </div>
  );
}

// ── Mini K Logo SVG ───────────────────────────────────────────

function KLogo() {
  const nodes = [
    { x: 20, y: 8  },  // top-left
    { x: 20, y: 28 },  // mid-left
    { x: 20, y: 48 },  // bottom-left
    { x: 40, y: 8  },  // top-right
    { x: 40, y: 48 },  // bottom-right
  ];
  const edges = [
    [0, 1], [1, 2], [1, 3], [1, 4],
  ];

  return (
    <motion.svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <defs>
        <filter id="logo-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="node-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.6)" />
        </radialGradient>
      </defs>

      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="#1E6BFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          filter="url(#logo-glow)"
        />
      ))}

      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r="4"
          fill="url(#node-grad)"
          filter="url(#logo-glow)"
        />
      ))}
    </motion.svg>
  );
}
