'use client';

import { motion } from 'framer-motion';
import { Newspaper, ExternalLink } from 'lucide-react';
import type { NewspaperCard } from '@/types';
import { useResearchStore } from '@/store/useResearchStore';

interface Props {
  card: NewspaperCard;
  isFloating?: boolean;
}

export function NewspaperCardView({ card, isFloating }: Props) {
  const { highlightedCardId, setHighlightedCardId } = useResearchStore();
  const isHighlighted = highlightedCardId === card.id;

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02, y: -2 }}
      onClick={() => setHighlightedCardId(isHighlighted ? null : card.id)}
      style={{
        background: isHighlighted
          ? 'linear-gradient(135deg, rgba(85,16,13,0.7), rgba(26,7,6,0.9))'
          : 'linear-gradient(135deg, rgba(85,16,13,0.4), rgba(26,7,6,0.8))',
        border: isHighlighted
          ? '1px solid #DD0200'
          : '1px solid rgba(85,16,13,0.85)',
        boxShadow: isHighlighted
          ? '0 0 30px rgba(221,2,0,0.5)'
          : '0 6px 20px rgba(0,0,0,0.45)',
        borderRadius: '16px',
        padding: '18px',
        color: '#D9D9D9',
        width: isFloating ? '340px' : '100%',
        backdropFilter: 'blur(16px)',
        cursor: 'pointer',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    >
      {/* Newspaper Masthead */}
      <div
        style={{
          borderBottom: '2px solid rgba(221,2,0,0.3)',
          paddingBottom: '8px',
          marginBottom: '10px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontSize: '1rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#D9D9D9',
              fontFamily: 'Georgia, serif',
            }}
          >
            {card.publication}
          </span>

          <span
            style={{
              background: 'rgba(221,2,0,0.15)',
              border: '1px solid rgba(221,2,0,0.35)',
              borderRadius: '4px',
              padding: '1px 6px',
              fontSize: '0.68rem',
              fontWeight: 700,
              color: '#DD0200',
            }}
          >
            PRESS REPORT
          </span>
        </div>

        {/* Issue Date & Edition */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '4px',
            fontSize: '0.68rem',
            color: 'rgba(217,217,217,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <span>{card.date}</span>
          <span>{card.edition || 'Special Archival Dispatch'}</span>
        </div>
      </div>

      {/* Main Headline */}
      <h4
        style={{
          fontSize: '0.96rem',
          fontWeight: 700,
          lineHeight: 1.35,
          color: '#D9D9D9',
          fontFamily: "'Space Grotesk', Georgia, serif",
          marginBottom: '8px',
        }}
      >
        {card.headline}
      </h4>

      {/* Byline */}
      {card.columnist && (
        <div
          style={{
            fontSize: '0.72rem',
            color: '#DD0200',
            fontWeight: 600,
            marginBottom: '8px',
          }}
        >
          By {card.columnist}
        </div>
      )}

      {/* Column Snippet */}
      <p
        style={{
          fontSize: '0.8rem',
          lineHeight: 1.5,
          color: 'rgba(217,217,217,0.75)',
          fontFamily: "'Inter', sans-serif",
          display: '-webkit-box',
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          marginBottom: '12px',
        }}
      >
        &ldquo;{card.snippet}&rdquo;
      </p>

      {/* Footer Link & Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '8px',
          borderTop: '1px solid rgba(85,16,13,0.7)',
          fontSize: '0.72rem',
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: 'rgba(217,217,217,0.45)',
          }}
        >
          <Newspaper size={12} color="#DD0200" />
          Verified Print Issue
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
          <span>View Archive</span>
          <ExternalLink size={11} />
        </a>
      </div>
    </motion.div>
  );
}
