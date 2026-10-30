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
          ? 'linear-gradient(135deg, rgba(221,2,0,0.25), rgba(85,16,13,0.5))'
          : 'rgba(85,16,13,0.35)',
        border: isHighlighted
          ? '1px solid #DD0200'
          : '1px solid rgba(85,16,13,0.75)',
        boxShadow: isHighlighted
          ? '0 0 25px rgba(221,2,0,0.5)'
          : '0 4px 20px rgba(0, 0, 0, 0.4)',
        borderRadius: '16px',
        padding: '16px',
        color: '#D9D9D9',
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
            color: '#DD0200',
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
            color: 'rgba(217,217,217,0.6)',
            background: 'rgba(85,16,13,0.4)',
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
          color: '#D9D9D9',
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
