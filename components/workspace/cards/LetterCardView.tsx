'use client';

import { motion } from 'framer-motion';
import { Mail, ExternalLink, ShieldAlert } from 'lucide-react';
import type { LetterCard } from '@/types';
import { useResearchStore } from '@/store/useResearchStore';

interface Props {
  card: LetterCard;
  isFloating?: boolean;
}

export function LetterCardView({ card, isFloating }: Props) {
  const { highlightedCardId, setHighlightedCardId } = useResearchStore();
  const isHighlighted = highlightedCardId === card.id;

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02, y: -2 }}
      onClick={() => setHighlightedCardId(isHighlighted ? null : card.id)}
      style={{
        background: isHighlighted
          ? 'linear-gradient(135deg, rgba(85,16,13,0.75), rgba(26,7,6,0.92))'
          : 'linear-gradient(135deg, rgba(85,16,13,0.45), rgba(26,7,6,0.85))',
        border: isHighlighted
          ? '1px solid #DD0200'
          : '1px solid rgba(221,2,0,0.3)',
        boxShadow: isHighlighted
          ? '0 0 30px rgba(221,2,0,0.45)'
          : '0 6px 20px rgba(0,0,0,0.4)',
        borderRadius: '16px',
        padding: '18px',
        color: '#D9D9D9',
        width: isFloating ? '340px' : '100%',
        backdropFilter: 'blur(16px)',
        cursor: 'pointer',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        position: 'relative',
      }}
    >
      {/* Classification Stamp */}
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
            background: 'rgba(221,2,0,0.18)',
            border: '1px solid rgba(221,2,0,0.4)',
            color: '#DD0200',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.68rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          <ShieldAlert size={12} />
          {card.classification || 'PUBLISHED DISPATCH'}
        </span>

        <span
          style={{
            fontSize: '0.68rem',
            color: 'rgba(217,217,217,0.5)',
            fontFamily: 'monospace',
          }}
        >
          {card.date}
        </span>
      </div>

      {/* Letter Meta Box */}
      <div
        style={{
          background: 'rgba(26,7,6,0.5)',
          border: '1px solid rgba(85,16,13,0.8)',
          borderRadius: '8px',
          padding: '8px 12px',
          marginBottom: '10px',
          fontSize: '0.74rem',
          lineHeight: 1.5,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div>
          <strong style={{ color: 'rgba(217,217,217,0.5)' }}>FROM: </strong>
          <span style={{ color: '#D9D9D9' }}>{card.sender}</span>
        </div>
        <div>
          <strong style={{ color: 'rgba(217,217,217,0.5)' }}>TO: </strong>
          <span style={{ color: '#D9D9D9' }}>{card.recipient}</span>
        </div>
        <div style={{ marginTop: '2px' }}>
          <strong style={{ color: '#DD0200' }}>SUBJ: </strong>
          <span style={{ color: '#D9D9D9', fontWeight: 600 }}>{card.subject}</span>
        </div>
      </div>

      {/* Letter Excerpt */}
      <p
        style={{
          fontSize: '0.8rem',
          lineHeight: 1.5,
          color: 'rgba(217,217,217,0.8)',
          fontFamily: "'Courier New', monospace, monospace",
          fontStyle: 'normal',
          display: '-webkit-box',
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          marginBottom: '12px',
          background: 'rgba(85,16,13,0.2)',
          padding: '8px 10px',
          borderRadius: '6px',
          borderLeft: '2px solid #DD0200',
        }}
      >
        &ldquo;{card.content}&rdquo;
      </p>

      {/* Footer Info & Link */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '8px',
          borderTop: '1px solid rgba(85,16,13,0.7)',
          fontSize: '0.7rem',
        }}
      >
        <span
          style={{
            color: 'rgba(217,217,217,0.45)',
            fontFamily: 'monospace',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Mail size={12} color="#DD0200" />
          {card.archiveRef || 'ARCHIVE FILE'}
        </span>

        <a
          href={card.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            color: '#DD0200',
            textDecoration: 'none',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
          }}
        >
          <span>Examine Record</span>
          <ExternalLink size={11} />
        </a>
      </div>
    </motion.div>
  );
}
