'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useResearchStore } from '@/store/useResearchStore';
import { CardItem } from './cards/CardItem';
import { ParticleCanvas } from '@/components/search/ParticleCanvas';

export function FloatingCanvas() {
  const { cards } = useResearchStore();
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.15, 1.8));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.15, 0.5));
  const handleResetZoom = () => setScale(1);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#05070D',
        userSelect: 'none',
      }}
    >
      {/* Background ambient grid & particles */}
      <ParticleCanvas />

      {/* Floating Canvas Transform Wrapper */}
      <motion.div
        animate={{ scale }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformOrigin: '50% 50%',
        }}
      >
        {cards.map((card) => (
          <motion.div
            key={card.id}
            drag
            dragConstraints={containerRef}
            dragElastic={0.1}
            dragMomentum={true}
            initial={{
              opacity: 0,
              scale: 0.8,
              x: `${card.x}%`,
              y: `${card.y}%`,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: `${card.x}%`,
              y: `${card.y}%`,
            }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 25,
            }}
            style={{
              position: 'absolute',
              zIndex: 10,
              cursor: 'grab',
            }}
            whileDrag={{ cursor: 'grabbing', zIndex: 50, scale: 1.05 }}
          >
            <CardItem card={card} isFloating={true} />
          </motion.div>
        ))}

        {cards.length === 0 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '12px',
              color: 'rgba(255,255,255,0.3)',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '2px solid rgba(30,107,255,0.3)',
                borderTop: '2px solid #1E6BFF',
                borderRadius: '50%',
                animation: 'spin 1.2s linear infinite',
              }}
            />
            <p style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>
              Gathering research nodes across knowledge graphs…
            </p>
          </div>
        )}
      </motion.div>

      {/* Zoom Controls HUD */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(16px)',
          borderRadius: '100px',
          padding: '4px 8px',
          zIndex: 30,
        }}
      >
        <button
          onClick={handleZoomOut}
          style={hudBtnStyle}
          title="Zoom out"
          aria-label="Zoom out"
        >
          <ZoomOut size={14} />
        </button>
        <span
          style={{
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.6)',
            padding: '0 4px',
            fontFamily: 'monospace',
          }}
        >
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          style={hudBtnStyle}
          title="Zoom in"
          aria-label="Zoom in"
        >
          <ZoomIn size={14} />
        </button>
        <div
          style={{
            width: '1px',
            height: '14px',
            background: 'rgba(255,255,255,0.1)',
            margin: '0 2px',
          }}
        />
        <button
          onClick={handleResetZoom}
          style={hudBtnStyle}
          title="Reset zoom"
          aria-label="Reset zoom"
        >
          <RotateCcw size={13} />
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const hudBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: 'rgba(255,255,255,0.7)',
  cursor: 'pointer',
  padding: '6px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'color 0.2s',
};
