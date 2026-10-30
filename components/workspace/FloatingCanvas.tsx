'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useResearchStore } from '@/store/useResearchStore';
import { CardItem } from './cards/CardItem';
import { ParticleCanvas } from '@/components/search/ParticleCanvas';

export function FloatingCanvas() {
  const { cards } = useResearchStore();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#1A0706',
        userSelect: 'none',
      }}
    >
      {/* Background ambient grid & particles */}
      <ParticleCanvas />

      {/* Floating Canvas Transform Wrapper */}
      <div
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
              color: 'rgba(217,217,217,0.4)',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '2px solid rgba(221,2,0,0.3)',
                borderTop: '2px solid #DD0200',
                borderRadius: '50%',
                animation: 'spin 1.2s linear infinite',
              }}
            />
            <p style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>
              Gathering research nodes across knowledge graphs…
            </p>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
