'use client';

import { motion } from 'framer-motion';
import { Compass, ArrowRight } from 'lucide-react';
import type { RelatedQueryCard } from '@/types';
import { useResearchStore } from '@/store/useResearchStore';

interface Props {
  card: RelatedQueryCard;
  isFloating?: boolean;
}

export function RelatedCardView({ card, isFloating }: Props) {
  const { setQuery, resetResearch } = useResearchStore();

  const handleBranch = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetResearch();
    setQuery(card.query);
  };

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02, y: -2 }}
      style={{
        background: 'rgba(85, 16, 13, 0.3)',
        border: '1px dashed rgba(221, 2, 0, 0.5)',
        borderRadius: '16px',
        padding: '16px',
        color: '#D9D9D9',
        width: isFloating ? '290px' : '100%',
        backdropFilter: 'blur(16px)',
        transition: 'all 0.2s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.7rem',
          color: '#DD0200',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontWeight: 600,
          marginBottom: '8px',
        }}
      >
        <Compass size={13} />
        Branching Exploration
      </div>

      <h5
        style={{
          fontSize: '0.88rem',
          fontWeight: 600,
          color: '#D9D9D9',
          marginBottom: '6px',
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        {card.query}
      </h5>

      <p
        style={{
          fontSize: '0.76rem',
          color: 'rgba(217,217,217,0.6)',
          marginBottom: '12px',
          lineHeight: 1.4,
        }}
      >
        {card.reason}
      </p>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleBranch}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(221,2,0,0.18)',
          border: '1px solid rgba(221,2,0,0.4)',
          borderRadius: '8px',
          padding: '6px 12px',
          color: '#DD0200',
          fontSize: '0.75rem',
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Explore vector
        <ArrowRight size={12} />
      </motion.button>
    </motion.div>
  );
}
