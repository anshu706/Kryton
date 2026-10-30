'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Globe } from 'lucide-react';
import type { WikipediaCard } from '@/types';
import { useResearchStore } from '@/store/useResearchStore';

interface Props {
  card: WikipediaCard;
  isFloating?: boolean;
}

export function WikipediaCardView({ card, isFloating }: Props) {
  const { highlightedCardId, setHighlightedCardId } = useResearchStore();
  const isHighlighted = highlightedCardId === card.id;

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02, y: -2 }}
      onClick={() => setHighlightedCardId(isHighlighted ? null : card.id)}
      style={{
        background: isHighlighted
          ? 'linear-gradient(135deg, rgba(85,16,13,0.85), rgba(26,7,6,0.95))'
          : 'linear-gradient(135deg, rgba(85,16,13,0.6), rgba(26,7,6,0.85))',
        border: isHighlighted
          ? '2px solid #DD0200'
          : '1px solid rgba(221,2,0,0.4)',
        boxShadow: isHighlighted
          ? '0 0 35px rgba(221,2,0,0.5), 0 8px 30px rgba(0,0,0,0.6)'
          : '0 0 20px rgba(85,16,13,0.4), 0 8px 24px rgba(0,0,0,0.5)',
        borderRadius: '20px',
        padding: '22px',
        color: '#D9D9D9',
        width: isFloating ? '400px' : '100%',
        backdropFilter: 'blur(20px)',
        cursor: 'pointer',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle Wikipedia Watermark Background */}
      <div
        style={{
          position: 'absolute',
          top: '-15px',
          right: '-15px',
          fontSize: '110px',
          fontFamily: 'serif',
          fontWeight: 700,
          color: 'rgba(217,217,217,0.03)',
          pointerEvents: 'none',
          userSelect: 'none',
          lineHeight: 1,
        }}
      >
        W
      </div>

      {/* Top Header Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              background: '#D9D9D9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '15px',
              color: '#1A0706',
              fontFamily: 'serif',
            }}
          >
            W
          </div>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#DD0200',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Wikipedia Foundation
          </span>
        </div>

        <a
          href={card.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: 'rgba(217,217,217,0.6)',
            fontSize: '0.72rem',
            textDecoration: 'none',
            padding: '3px 8px',
            borderRadius: '6px',
            background: 'rgba(217,217,217,0.08)',
            border: '1px solid rgba(217,217,217,0.12)',
            transition: 'all 0.2s',
          }}
          title="Open in Wikipedia"
        >
          <span>en.wikipedia.org</span>
          <ExternalLink size={12} />
        </a>
      </div>

      {/* Article Title */}
      <h3
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#D9D9D9',
          fontFamily: "'Space Grotesk', sans-serif",
          lineHeight: 1.25,
          marginBottom: '4px',
        }}
      >
        {card.title}
      </h3>

      {card.description && (
        <div
          style={{
            fontSize: '0.78rem',
            color: 'rgba(217,217,217,0.5)',
            fontStyle: 'italic',
            marginBottom: '12px',
          }}
        >
          {card.description}
        </div>
      )}

      {/* Extract Body */}
      <p
        style={{
          fontSize: '0.84rem',
          lineHeight: 1.55,
          color: 'rgba(217,217,217,0.85)',
          fontFamily: "'Inter', sans-serif",
          marginBottom: card.quickFacts && card.quickFacts.length > 0 ? '16px' : '12px',
        }}
      >
        {card.extract}
      </p>

      {/* Quick Facts Infobox */}
      {card.quickFacts && card.quickFacts.length > 0 && (
        <div
          style={{
            background: 'rgba(26,7,6,0.6)',
            border: '1px solid rgba(85,16,13,0.8)',
            borderRadius: '10px',
            padding: '10px 14px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px 12px',
            marginBottom: '14px',
          }}
        >
          {card.quickFacts.map((fact, i) => (
            <div key={i}>
              <div
                style={{
                  fontSize: '0.66rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'rgba(217,217,217,0.45)',
                  fontWeight: 600,
                }}
              >
                {fact.label}
              </div>
              <div
                style={{
                  fontSize: '0.78rem',
                  color: '#D9D9D9',
                  fontWeight: 500,
                }}
              >
                {fact.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Read Action */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px solid rgba(85,16,13,0.8)',
        }}
      >
        <span
          style={{
            fontSize: '0.72rem',
            color: 'rgba(217,217,217,0.45)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <Globe size={12} color="#DD0200" />
          Primary Encyclopedic Dossier
        </span>

        <a
          href={card.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#DD0200',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          Read Wikipedia Overview →
        </a>
      </div>
    </motion.div>
  );
}
