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
          ? 'linear-gradient(135deg, rgba(30,107,255,0.2), rgba(30,107,255,0.08))'
          : 'rgba(255, 255, 255, 0.05)',
        border: isHighlighted
          ? '1px solid #1E6BFF'
          : '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: isHighlighted
          ? '0 0 25px rgba(30,107,255,0.5)'
          : '0 4px 20px rgba(0, 0, 0, 0.3)',
        borderRadius: '16px',
        padding: '16px',
        color: '#FFFFFF',
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
              color: 'rgba(255,255,255,0.5)',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {domain}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              background: 'rgba(30,107,255,0.2)',
              border: '1px solid rgba(30,107,255,0.4)',
              borderRadius: '6px',
              padding: '2px 6px',
              fontSize: '0.7rem',
              fontWeight: 600,
              color: '#1E6BFF',
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
              color: 'rgba(255,255,255,0.4)',
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
          color: '#FFFFFF',
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        {card.title}
      </h4>

      {/* Snippet */}
      <p
        style={{
          fontSize: '0.78rem',
          color: 'rgba(255,255,255,0.65)',
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
          borderTop: '1px solid rgba(255,255,255,0.06)',
          fontSize: '0.72rem',
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: 'rgba(255,255,255,0.45)',
          }}
        >
          <ShieldCheck size={13} color="#1E6BFF" />
          Reliability
        </span>
        <span style={{ fontWeight: 600, color: '#1E6BFF' }}>
          {Math.round(card.reliability * 100)}% verified
        </span>
      </div>
    </motion.div>
  );
}
