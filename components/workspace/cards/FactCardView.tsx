'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { FactCard } from '@/types';
import { useResearchStore } from '@/store/useResearchStore';

interface Props {
  card: FactCard;
  isFloating?: boolean;
}

export function FactCardView({ card, isFloating }: Props) {
  const { highlightedCardId, setHighlightedCardId } = useResearchStore();
  const isHighlighted = highlightedCardId === card.id;

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02, y: -2 }}
      onClick={() => setHighlightedCardId(isHighlighted ? null : card.id)}
      style={{
        background: isHighlighted
          ? 'linear-gradient(135deg, rgba(30,107,255,0.22), rgba(255,255,255,0.06))'
          : 'rgba(255, 255, 255, 0.05)',
        border: isHighlighted
          ? '1px solid #1E6BFF'
          : '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: isHighlighted
          ? '0 0 25px rgba(30,107,255,0.45)'
          : '0 4px 20px rgba(0, 0, 0, 0.3)',
        borderRadius: '16px',
        padding: '16px',
        color: '#FFFFFF',
        width: isFloating ? '300px' : '100%',
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
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.7rem',
            color: '#1E6BFF',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 600,
          }}
        >
          <Sparkles size={13} />
          Key Insight
        </span>

        <span
          style={{
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.4)',
            background: 'rgba(255,255,255,0.06)',
            padding: '2px 6px',
            borderRadius: '4px',
          }}
        >
          {Math.round(card.confidence * 100)}% confidence
        </span>
      </div>

      <p
        style={{
          fontSize: '0.85rem',
          color: '#FFFFFF',
          lineHeight: 1.45,
          fontFamily: "'Inter', sans-serif",
          fontWeight: 400,
        }}
      >
        {card.insight}
      </p>
    </motion.div>
  );
}
