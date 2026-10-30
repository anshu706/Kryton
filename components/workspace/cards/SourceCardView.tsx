'use client';

import { motion } from 'framer-motion';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import type { SourceCard } from '@/types';
import { getDomain, getFaviconUrl } from '@/lib/utils';
import { useResearchStore } from '@/store/useResearchStore';

interface Props {
  card: SourceCard;
  isFloating?: boolean;
}

export function SourceCardView({ card, isFloating }: Props) {
  const { highlightedCardId, setHighlightedCardId } = useResearchStore();
  const isHighlighted = highlightedCardId === card.id;
  const domain = getDomain(card.url);
  const favicon = card.favicon || getFaviconUrl(card.url);

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02, y: -2 }}
      onClick={() => setHighlightedCardId(isHighlighted ? null : card.id)}
      style={{
        background: isHighlighted
          ? 'linear-gradient(135deg, rgba(221,2,0,0.25), rgba(85,16,13,0.5))'
          : 'rgba(85,16,13,0.3)',
        border: isHighlighted
          ? '1px solid #DD0200'
          : '1px solid rgba(85,16,13,0.7)',
        boxShadow: isHighlighted
          ? '0 0 25px rgba(221,2,0,0.5)'
          : '0 4px 20px rgba(0, 0, 0, 0.4)',
        borderRadius: '16px',
        padding: '16px',
        color: '#D9D9D9',
        width: isFloating ? '320px' : '100%',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src={favicon}
            alt=""
            width={16}
            height={16}
            style={{ borderRadius: '4px' }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <span
            style={{
              fontSize: '0.75rem',
              color: 'rgba(217,217,217,0.5)',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {domain}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              background: 'rgba(221,2,0,0.2)',
              border: '1px solid rgba(221,2,0,0.4)',
              borderRadius: '6px',
              padding: '2px 6px',
              fontSize: '0.7rem',
              fontWeight: 600,
              color: '#DD0200',
            }}
          >
            [{card.citationIndex}]
          </span>
          <a
            href={card.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              color: 'rgba(217,217,217,0.4)',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Open external source"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Title */}
      <h4
        style={{
          fontSize: '0.9rem',
          fontWeight: 600,
          lineHeight: 1.35,
          marginBottom: '8px',
          color: '#D9D9D9',
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        {card.title}
      </h4>

      {/* Snippet */}
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
        {card.snippet}
      </p>

      {/* Reliability Meter */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '12px',
          paddingTop: '10px',
          borderTop: '1px solid rgba(217,217,217,0.08)',
          fontSize: '0.72rem',
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: 'rgba(217,217,217,0.5)',
          }}
        >
          <ShieldCheck size={13} color="#DD0200" />
          Reliability
        </span>
        <span style={{ fontWeight: 600, color: '#DD0200' }}>
          {Math.round(card.reliability * 100)}% verified
        </span>
      </div>
    </motion.div>
  );
}
