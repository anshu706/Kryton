'use client';

import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import type { StatCard } from '@/types';
import { useResearchStore } from '@/store/useResearchStore';

interface Props {
  card: StatCard;
  isFloating?: boolean;
}

export function StatCardView({ card, isFloating }: Props) {
  const { highlightedCardId, setHighlightedCardId } = useResearchStore();
  const isHighlighted = highlightedCardId === card.id;

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.03, y: -2 }}
      onClick={() => setHighlightedCardId(isHighlighted ? null : card.id)}
      style={{
        background: isHighlighted
          ? 'linear-gradient(135deg, rgba(30,107,255,0.25), rgba(5,7,13,0.8))'
          : 'linear-gradient(135deg, rgba(30,107,255,0.1), rgba(255,255,255,0.03))',
        border: isHighlighted
          ? '1px solid #1E6BFF'
          : '1px solid rgba(30,107,255,0.3)',
        boxShadow: isHighlighted
          ? '0 0 30px rgba(30,107,255,0.5)'
          : '0 4px 20px rgba(0, 0, 0, 0.4)',
        borderRadius: '16px',
        padding: '18px',
        color: '#FFFFFF',
        width: isFloating ? '260px' : '100%',
        backdropFilter: 'blur(16px)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}
      >
        <span
          style={{
            fontSize: '0.7rem',
            color: 'rgba(30,107,255,0.9)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 600,
          }}
        >
          Key Metric
        </span>
        <TrendingUp size={15} color="#1E6BFF" />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '4px',
          marginBottom: '6px',
        }}
      >
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: '2.4rem',
            fontWeight: 700,
            color: '#FFFFFF',
            fontFamily: "'Space Grotesk', sans-serif",
            lineHeight: 1,
          }}
        >
          {card.value}
        </motion.span>
        <span
          style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: '#1E6BFF',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {card.unit}
        </span>
      </div>

      <p
        style={{
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.65)',
          lineHeight: 1.4,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {card.label}
      </p>
    </motion.div>
  );
}
