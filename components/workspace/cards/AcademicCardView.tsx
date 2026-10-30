'use client';

import { motion } from 'framer-motion';
import { BookOpen, ExternalLink } from 'lucide-react';
import type { AcademicCard } from '@/types';
import { useResearchStore } from '@/store/useResearchStore';

interface Props {
  card: AcademicCard;
  isFloating?: boolean;
}

export function AcademicCardView({ card, isFloating }: Props) {
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
        width: isFloating ? '340px' : '100%',
        backdropFilter: 'blur(16px)',
        cursor: 'pointer',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    >
      {/* Top Header */}
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
            background: 'rgba(221,2,0,0.15)',
            color: '#DD0200',
            padding: '2px 8px',
            borderRadius: '6px',
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          <BookOpen size={12} />
          Peer-Reviewed ({card.year})
        </span>

        {card.pdfUrl && (
          <a
            href={card.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              color: 'rgba(255,255,255,0.4)',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Open paper"
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>

      {/* Title */}
      <h4
        style={{
          fontSize: '0.9rem',
          fontWeight: 600,
          lineHeight: 1.35,
          marginBottom: '6px',
          color: '#D9D9D9',
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        {card.title}
      </h4>

      {/* Authors */}
      <div
        style={{
          fontSize: '0.75rem',
          color: 'rgba(217,217,217,0.5)',
          marginBottom: '8px',
          fontStyle: 'italic',
        }}
      >
        {card.authors.slice(0, 2).join(', ')}
        {card.authors.length > 2 ? ' et al.' : ''}
      </div>

      {/* Abstract */}
      <p
        style={{
          fontSize: '0.78rem',
          color: 'rgba(217,217,217,0.7)',
          lineHeight: 1.45,
          fontFamily: "'Inter', sans-serif",
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {card.abstract}
      </p>

      {/* DOI Badge */}
      {card.doi && (
        <div
          style={{
            marginTop: '10px',
            paddingTop: '8px',
            borderTop: '1px solid rgba(217,217,217,0.08)',
            fontSize: '0.68rem',
            color: 'rgba(221,2,0,0.85)',
            fontFamily: 'monospace',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          DOI: {card.doi}
        </div>
      )}
    </motion.div>
  );
}
